import { GoogleGenAI } from '@google/genai';

// Simple interface for generating AI narrative
export interface AIGenerationParams {
  systemPrompt: string;
  context: string;
}

// 1. Define Horde Models
// 'KoboldAI/OPT-6.7B-Erebus' or similar models are often used for text RP on AI Horde,
// though we usually just let it route to available text models.
const HORDE_API_URL = 'https://stablehorde.net/api/v2/generate/text/async';
const HORDE_STATUS_URL = 'https://stablehorde.net/api/v2/generate/text/status';

/**
 * Service to interact with the AI Horde for uncensored text generation.
 * This is our fallback if Gemini refuses a prompt.
 */
export async function generateWithHorde(params: AIGenerationParams): Promise<string> {
  const prompt = `System: ${params.systemPrompt}\n\nContext:\n${params.context}\n\nNarrative:`;

  try {
    const submitRes = await fetch(HORDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': '0000000000' // Anonymous key, queue times may vary
      },
      body: JSON.stringify({
        prompt,
        params: {
          max_context_length: 2048,
          max_length: 300,
          temperature: 0.8,
          rep_pen: 1.1
        },
        models: ["PygmalionAI/pygmalion-6b", "KoboldAI/OPT-6.7B-Erebus", "aphrodite/Sao10K/L3-8B-Stheno-v3.2"] // Common RP models
      })
    });

    if (!submitRes.ok) {
      throw new Error(`Horde submission failed: ${submitRes.statusText}`);
    }

    const submitData = await submitRes.json();
    const id = submitData.id;

    if (!id) throw new Error("No job ID returned from AI Horde");

    // Poll for completion (Wait up to 2 minutes)
    for (let i = 0; i < 24; i++) {
      await new Promise(r => setTimeout(r, 5000)); // Poll every 5 seconds

      const statusRes = await fetch(`${HORDE_STATUS_URL}/${id}`);
      if (!statusRes.ok) continue;

      const statusData = await statusRes.json();

      if (statusData.done && statusData.generations && statusData.generations.length > 0) {
        return statusData.generations[0].text.trim();
      }
      if (statusData.faulted) {
        throw new Error("AI Horde job faulted");
      }
    }

    throw new Error("AI Horde job timed out");

  } catch (error) {
    console.error("AI Horde generation error:", error);
    return "The darkness obscures your vision. (AI Generation Failed)";
  }
}

/**
 * Service to interact with Google's Gemini API.
 * Acts as the primary "vibecoder" to structure narrative, but falls back to Horde if flagged.
 */
export async function generateWithGemini(params: AIGenerationParams): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("No Gemini API key found, falling back directly to AI Horde");
    return generateWithHorde(params);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // We construct the prompt instructing Gemini to write the text
    const prompt = `System Instructions: ${params.systemPrompt}\n\nCurrent Game State Context:\n${params.context}\n\nGenerate the next paragraph of narrative text based on this context. Keep it descriptive and atmospheric.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Fast, good for vibecoding
      contents: prompt,
      config: {
         temperature: 0.9
      }
    });

    // Handle string extraction correctly
    const text = response.text || '';

    // Check if the content was completely blocked
    if (text.length === 0) {
       console.log("Gemini likely blocked the response due to safety filters. Falling back to Uncensored AI Horde.");
       return generateWithHorde(params);
    }

    return text;

  } catch (error: any) {
    // If we hit a safety error or API error, fallback to Horde
    if (error?.message?.includes('safety') || error?.status === 400) {
       console.log("Gemini triggered safety filter. Falling back to Uncensored AI Horde.", error.message);
       return generateWithHorde(params);
    }
    console.error("Gemini unexpected error:", error);
    return generateWithHorde(params); // Always fallback to Horde on failure
  }
}

/**
 * The main pipeline function that takes the current game state and requests the next scene.
 */
export async function generateLateGameContent(gameState: any): Promise<string> {
  const systemPrompt = `You are the invisible Game Master of a text-based RPG set in Morrowind (Elder Scrolls), but infused with dark, psychological, and physiological mechanics similar to 'Degrees of Lewdity'.
The player has entered the 'Late Game', where the deterministic rules break down, and strange, horrific, or corrupting events occur.
Do not write UI elements. Write 1-2 paragraphs of second-person narrative ("You feel..."). Focus on the atmosphere, their high stats (like corruption/trauma), and their current clothing integrity.`;

  const context = `
Location: ${gameState.locationId}
Time: Day ${gameState.time.day}, ${gameState.time.hour}:${gameState.time.minute.toString().padStart(2, '0')}
Stats: Health ${gameState.stats.health}/${gameState.stats.maxHealth}, Fatigue ${gameState.stats.fatigue}/${gameState.stats.maxFatigue}
DoL Stats: Arousal ${gameState.stats.arousal}, Stress ${gameState.stats.stress}, Trauma ${gameState.stats.trauma}, Corruption ${gameState.stats.corruption}, Hallucination ${gameState.stats.hallucination}
Clothing Status: Upper: ${gameState.clothing.upper?.integrity || 0}%, Lower: ${gameState.clothing.lower?.integrity || 0}%
`;

  return await generateWithGemini({ systemPrompt, context });
}
