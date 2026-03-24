import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.startsWith('sk-or-')) {
      return res.status(500).json({ error: 'No valid API key available' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: prompt }] }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return res.json({ image: `data:image/png;base64,${part.inlineData.data}` });
      }
    }

    res.status(500).json({ error: 'Failed to generate image' });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch-all to serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
