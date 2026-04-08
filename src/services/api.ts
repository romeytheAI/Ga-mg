import { STABLE_API, DEFAULT_API_KEY } from '../constants';
import { getRelevantLore } from '../lore';
import { imageWorker } from '../utils/workers';
import { costTracker } from '../dafl/CostTracker';
import { SemanticAudit } from '../dafl/SemanticAudit';

export async function generateText(prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any, skipLore: boolean = false) {
  const relevantLore = skipLore ? null : getRelevantLore(prompt, 10);
  let enhancedPrompt = relevantLore ? `Relevant Elder Scrolls Lore:\n${relevantLore}\n\n${prompt}` : prompt;

  // Apply semantic audit to optimize token usage
  const { optimized, audit } = SemanticAudit.auditPrompt(enhancedPrompt);
  enhancedPrompt = optimized;

  if (audit.tokensSaved > 0 && dispatch) {
    console.log(`[API] Semantic audit saved ${audit.tokensSaved} tokens:`, audit.optimizations);
  }

  const startTime = Date.now();

  // Try Horde (AI Horde)
  try {
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_START', payload: { type: 'text' } });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for initial request
    
    const body: any = {
        prompt: enhancedPrompt,
        params: { max_context_length: 8192, max_length: 600, temperature: 0.75 }
      };
      if (model) {
        body.models = [model];
      }
      
      const res = await fetch(`${STABLE_API}/generate/text/async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': hordeApiKey || DEFAULT_API_KEY },
        body: JSON.stringify(body),
        signal: controller.signal
      });
    
    clearTimeout(timeoutId);

    if (res.ok) {
      const { id } = await res.json();
      let attempts = 0;
      const maxAttempts = 15; // 30 seconds max (15 * 2s)
      
      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000));
        
        const statusController = new AbortController();
        const statusTimeout = setTimeout(() => statusController.abort(), 5000); // 5s timeout for status check
        
        try {
          const statusRes = await fetch(`${STABLE_API}/generate/text/status/${id}`, {
            signal: statusController.signal
          });
          clearTimeout(statusTimeout);
          
          if (!statusRes.ok) throw new Error(`Status check failed: ${statusRes.status}`);
          
          const status = await statusRes.json();
          if (dispatch && status.wait_time) {
            dispatch({ type: 'HORDE_ETA_UPDATE', payload: { type: 'text', eta: status.wait_time } });
          }
          if (status.done) {
            if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'text' } });

            // Track successful API call
            const tokens = SemanticAudit.estimateTokens(enhancedPrompt + status.generations[0].text);
            costTracker.trackAPICall({
              provider: 'horde',
              type: 'text',
              tokens,
              successful: true,
              metadata: { model, duration: Date.now() - startTime }
            });

            return status.generations[0].text;
          }
          if (status.faulted) {
            console.warn("Horde text generation faulted.");
            break;
          }
        } catch (statusErr) {
          clearTimeout(statusTimeout);
          console.warn("Horde status check error:", statusErr);
          // Continue polling on transient errors, but it counts towards maxAttempts
        }
        attempts++;
      }
      console.warn(`Horde text generation timed out after ${maxAttempts} attempts.`);
    } else {
      console.warn(`Horde text generation request failed: ${res.status}`);
    }
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'text' } });
  } catch (e) {
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'text' } });
    console.warn("Horde text generation failed, falling back to Pollinations", e);

    // Track failed Horde call
    costTracker.trackAPICall({
      provider: 'horde',
      type: 'text',
      tokens: SemanticAudit.estimateTokens(enhancedPrompt),
      successful: false,
      metadata: { error: String(e), duration: Date.now() - startTime }
    });
  }

  // Try Pollinations (Uncensored, Free) as backup
  try {
    const systemPrompt = 'You are an AI Director for a dark fantasy RPG. Respond ONLY with valid JSON.';
    const fullPrompt = `${systemPrompt}\n\n${enhancedPrompt}`;
    const pollinationsUrl = `https://gen.pollinations.ai/text/${encodeURIComponent(fullPrompt)}?json=true`;
    const pollinationsRes = await fetch(pollinationsUrl);
    if (pollinationsRes.ok) {
      const text = await pollinationsRes.text();

      // Track successful Pollinations call
      const tokens = SemanticAudit.estimateTokens(fullPrompt + text);
      costTracker.trackAPICall({
        provider: 'pollinations',
        type: 'text',
        tokens,
        successful: true,
        metadata: { duration: Date.now() - startTime }
      });

      return text;
    }
  } catch (e) {
    console.error("Pollinations text generation failed", e);

    // Track failed Pollinations call
    costTracker.trackAPICall({
      provider: 'pollinations',
      type: 'text',
      tokens: SemanticAudit.estimateTokens(enhancedPrompt),
      successful: false,
      metadata: { error: String(e) }
    });
  }

  throw new Error("All text generation methods failed.");
}

export async function generateImage(prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any) {
  const startTime = Date.now();

  // Apply semantic audit to image prompts too
  const { optimized: optimizedPrompt } = SemanticAudit.auditPrompt(prompt);

  // Try Pollinations Image first (Uncensored, Free)
  try {
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(optimizedPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
    const res = await fetch(pollinationsUrl);
    if (res.ok) {
      const blob = await res.blob();

      // Track successful image generation
      costTracker.trackAPICall({
        provider: 'pollinations',
        type: 'image',
        successful: true,
        metadata: { seed, duration: Date.now() - startTime }
      });

      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.warn("Pollinations image generation failed, falling back to Horde", e);

    // Track failed Pollinations image call
    costTracker.trackAPICall({
      provider: 'pollinations',
      type: 'image',
      successful: false,
      metadata: { error: String(e) }
    });
  }

  // Try Horde (Stable Horde)
  try {
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_START', payload: { type: 'image' } });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const body: any = {
        prompt: optimizedPrompt,
        params: { width: 512, height: 512, steps: 20 }
      };
      if (model) {
        body.models = [model];
      }
      
      const res = await fetch(`${STABLE_API}/generate/async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': hordeApiKey || DEFAULT_API_KEY },
        body: JSON.stringify(body),
        signal: controller.signal
      });
    
    clearTimeout(timeoutId);

    if (res.ok) {
      const { id } = await res.json();
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds max (30 * 2s)
      
      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000));
        
        const statusController = new AbortController();
        const statusTimeout = setTimeout(() => statusController.abort(), 5000);
        
        try {
          const statusRes = await fetch(`${STABLE_API}/generate/status/${id}`, {
            signal: statusController.signal
          });
          clearTimeout(statusTimeout);
          
          if (!statusRes.ok) throw new Error(`Status check failed: ${statusRes.status}`);
          
          const status = await statusRes.json();
          if (dispatch && status.wait_time) {
            dispatch({ type: 'HORDE_ETA_UPDATE', payload: { type: 'image', eta: status.wait_time } });
          }
          if (status.done) {
            if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'image' } });

            // Track successful Horde image generation
            costTracker.trackAPICall({
              provider: 'horde',
              type: 'image',
              successful: true,
              metadata: { model, duration: Date.now() - startTime }
            });

            const base64Data = status.generations[0].img;
            if (!imageWorker) return `data:image/webp;base64,${base64Data}`;
            
            return new Promise<string>((resolve, reject) => {
              const workerTimeout = setTimeout(() => {
                imageWorker!.removeEventListener('message', handler);
                reject(new Error("Image worker timed out"));
              }, 10000); // 10s timeout for worker processing
              
              const handler = (e: MessageEvent) => {
                clearTimeout(workerTimeout);
                imageWorker!.removeEventListener('message', handler);
                if (e.data.error) reject(new Error(e.data.error));
                else resolve(e.data.url);
              };
              imageWorker!.addEventListener('message', handler);
              imageWorker!.postMessage({ base64Data });
            });
          }
          if (status.faulted) {
            console.warn("Horde image generation faulted.");
            break;
          }
        } catch (statusErr) {
          clearTimeout(statusTimeout);
          console.warn("Horde image status check error:", statusErr);
        }
        attempts++;
      }
      console.warn(`Horde image generation timed out after ${maxAttempts} attempts.`);
    } else {
      console.warn(`Horde image generation request failed: ${res.status}`);
    }
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'image' } });
  } catch (e) {
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_END', payload: { type: 'image' } });
    console.warn("Horde image generation failed.");

    // Track failed Horde image call
    costTracker.trackAPICall({
      provider: 'horde',
      type: 'image',
      successful: false,
      metadata: { error: String(e), duration: Date.now() - startTime }
    });
  }

  // Fallback to Gemini Image (if available)
  if (!apiKey || apiKey.startsWith('sk-or-')) throw new Error("No API key available for fallback generation");

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: optimizedPrompt }] }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        // Track successful Gemini image generation (paid API)
        costTracker.trackAPICall({
          provider: 'gemini',
          type: 'image',
          successful: true,
          metadata: { duration: Date.now() - startTime }
        });

        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    // Track failed Gemini call
    costTracker.trackAPICall({
      provider: 'gemini',
      type: 'image',
      successful: false,
      metadata: { error: String(e) }
    });
  }

  throw new Error("Failed to generate image with fallback");
}

export async function generateLegendaryStats(name: string, description: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any) {
  const prompt = `Generate RPG stats for a legendary item in the Elder Scrolls universe.
Item Name: ${name}
Description: ${description}

Output ONLY a JSON object with stat keys (health, stamina, willpower, lust, trauma, hygiene, corruption, allure, arousal, pain, control, stress, hallucination, purity) and numeric values.
Example: { "health": 50, "allure": 20 }`;

  try {
    const result = await generateText(prompt, apiKey, hordeApiKey, model, dispatch);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    return { health: 25, willpower: 25 };
  }
  return {};
}
