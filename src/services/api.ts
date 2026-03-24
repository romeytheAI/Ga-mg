import { STABLE_API, DEFAULT_API_KEY } from '../constants';
import { getRelevantLore } from '../lore';
import { imageWorker } from '../utils/workers';

export async function generateText(prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any, skipLore: boolean = false) {
  const relevantLore = skipLore ? null : getRelevantLore(prompt, 10);
  const enhancedPrompt = relevantLore ? `Relevant Elder Scrolls Lore:\n${relevantLore}\n\n${prompt}` : prompt;

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
  }

  // Try Pollinations (Uncensored, Free) as backup
  try {
    const systemPrompt = 'You are an AI Director for a dark fantasy RPG. Respond ONLY with valid JSON.';
    const fullPrompt = `${systemPrompt}\n\n${enhancedPrompt}`;
    const pollinationsUrl = `https://gen.pollinations.ai/text/${encodeURIComponent(fullPrompt)}?json=true`;
    const pollinationsRes = await fetch(pollinationsUrl);
    if (pollinationsRes.ok) {
      const text = await pollinationsRes.text();
      return text;
    }
  } catch (e) {
    console.error("Pollinations text generation failed", e);
  }

  throw new Error("All text generation methods failed.");
}

export async function generateImage(prompt: string, apiKey: string, hordeApiKey: string, model: string, dispatch?: any) {
  // Try Pollinations Image first (Uncensored, Free)
  try {
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
    const res = await fetch(pollinationsUrl);
    if (res.ok) {
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.warn("Pollinations image generation failed, falling back to Horde", e);
  }

  // Try Horde (Stable Horde)
  try {
    if (dispatch) dispatch({ type: 'HORDE_REQUEST_START', payload: { type: 'image' } });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const body: any = {
        prompt,
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
  }

  // Fallback to Gemini Image via backend
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }
    const data = await res.json();
    if (data.image) {
      return data.image;
    }
  } catch (backendError) {
    console.warn("Backend image generation fallback failed", backendError);
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
