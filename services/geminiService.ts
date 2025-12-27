
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAIResponse = async (prompt: string, history: any[], imageBase64?: string) => {
  // Eng tezkor modelga o'tilmoqda
  const model = "gemini-3-flash-preview";
  
  const contents = [...history];
  
  if (imageBase64) {
    contents.push({
      role: 'user',
      parts: [
        { text: prompt },
        { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }
      ]
    });
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1, // Ko'proq aniqlik va tezlik uchun harorat pasaytirildi
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Uzr, tizim haddan tashqari band yoki texnik nosozlik yuz berdi. Iltimos, bir necha soniyadan so'ng qaytadan urinib ko'ring.";
  }
};
