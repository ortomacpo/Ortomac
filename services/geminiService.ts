
import { GoogleGenAI, Type } from "@google/genai";

// Criamos uma função auxiliar para obter o cliente apenas quando necessário
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY não configurada no ambiente.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getGeminiAnalysis = async (context: string) => {
  try {
    const ai = getClient();
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
    return response.text || "Sem resposta da IA no momento.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `O Cérebro IA está temporariamente indisponível: ${error.message}`;
  }
};

export const analyzePatientProgress = async (patientData: any) => {
  try {
    const ai = getClient();
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
    console.error("Analysis Error:", error);
    return null;
  }
}
