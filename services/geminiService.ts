import { GoogleGenAI } from "@google/genai";

// Cache to prevent re-fetching on every re-render
const imageCache: Record<string, string> = {};

export const generateCharacterCard = async (prompt: string, id: string): Promise<string | null> => {
  if (imageCache[id]) {
    return imageCache[id];
  }

  // If no API key, return null so UI can show a specific "No Signal" state
  // instead of a random misleading photo.
  if (!process.env.API_KEY) {
    console.warn("No API_KEY found.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using the nano banana model (gemini-2.5-flash-image)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt
          }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
            imageCache[id] = imageUrl;
            return imageUrl;
        }
    }
    
    console.error("No image inlineData in response");
    return null;

  } catch (error) {
    console.error(`Failed to generate image for ${id}:`, error);
    return null;
  }
};