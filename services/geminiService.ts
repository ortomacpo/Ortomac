
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
        1. STATUS ATUAL (Análise rápida)
        2. PONTOS DE MELHORIA (O que pode ser melhorado)
        3. PLANO DE AÇÃO (Passo a passo prático)
        
        Seja técnico ao falar de materiais (Polipropileno, Resinas, Fibra de Carbono) e de protocolos clínicos (Schroth, SEAS, RPG).`,
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha na conexão com o Cérebro IA. Verifique sua chave de API e conexão de rede.";
  }
};

export const analyzePatientProgress = async (patientData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise os dados: ${JSON.stringify(patientData)}`,
      config: {
        systemInstruction: "Analise clinicamente os dados deste paciente de fisioterapia/ortopedia. Considere Ângulos de Cobb e Testes de Adams. Retorne um JSON com resumo, 3 recomendações e nível de alerta (Baixo, Médio, Alto).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Resumo clínico do estado do paciente" },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Próximos passos clínicos" },
            priorityLevel: { type: Type.STRING, description: "Nível de prioridade de intervenção" }
          },
          required: ["summary", "recommendations", "priorityLevel"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis Error:", error);
    return null;
  }
}
