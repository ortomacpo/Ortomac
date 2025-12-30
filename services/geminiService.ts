
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getGeminiAnalysis = async (context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: context,
      config: {
        systemInstruction: `Você é o consultor de IA "Cérebro OrtoPhysio". Seu objetivo é otimizar uma clínica de fisioterapia e oficina ortopédica. 
        Forneça respostas em formato executivo: 
        1. STATUS ATUAL
        2. PONTOS DE MELHORIA
        3. PLANO DE AÇÃO
        
        Seja técnico ao falar de materiais (Polipropileno, Carbono) e protocolos (Schroth, SEAS, RPG).`,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha na conexão com o Cérebro IA.";
  }
};

export const analyzePatientProgress = async (patientData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise o progresso: ${JSON.stringify(patientData)}`,
      config: {
        systemInstruction: "Analise dados clínicos de escoliose/ortopedia. Retorne JSON com resumo, recomendações e nível de prioridade.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityLevel: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
}
