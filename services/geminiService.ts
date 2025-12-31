import { GoogleGenAI } from "@google/genai";

export const getGeminiAnalysis = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "Você é o Cérebro OrtoPhysio, especialista em reabilitação física e fabricação de órteses/próteses. Forneça respostas técnicas em português brasileiro.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Desculpe, não consegui processar a análise agora. Verifique a chave API.";
  }
};