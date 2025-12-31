
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Gets a general analysis for clinical and operational optimization.
 * Uses gemini-3-flash-preview for general text tasks.
 */
export const getGeminiAnalysis = async (context: string) => {
  try {
    // Initializing Gemini client using the environment variable API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    // Accessing text property directly as per latest SDK guidelines.
    return response.text || "Sem resposta da IA no momento.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `O Cérebro IA está temporariamente indisponível.`;
  }
};

/**
 * Analyzes patient progress data and returns structured JSON recommendations.
 * Uses gemini-3-pro-preview for complex reasoning and structured output.
 */
export const analyzePatientProgress = async (patientData: any) => {
  try {
    // Creating a new instance right before the call to ensure fresh API key usage.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    // Parsing the JSON string returned in the text property.
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis Error:", error);
    return null;
  }
}
