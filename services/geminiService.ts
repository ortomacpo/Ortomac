
import { GoogleGenAI, Type } from "@google/genai";

export const getGeminiAnalysis = async (context: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é o consultor de IA "Cérebro OrtoPhysio". Seu objetivo é otimizar uma clínica de fisioterapia e oficina ortopédica. 
      Forneça respostas em formato executivo: 
      1. STATUS ATUAL (Análise rápida)
      2. PONTOS DE MELHORIA (O que está errado ou pode ser melhorado)
      3. PLANO DE AÇÃO (Passo a passo prático)
      
      Seja técnico quando falar de materiais (Polipropileno, Resinas, Fibra de Carbono) e de protocolos clínicos (Schroth, SEAS, RPG).
      
      Pedido do usuário: ${context}`,
      config: {
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise clinicamente os dados deste paciente de fisioterapia/ortopedia: ${JSON.stringify(patientData)}. 
      Considere os Ângulos de Cobb, Testes de Adams e evoluções clínicas. 
      Retorne um JSON com um resumo do status atual, 3 recomendações prioritárias e um nível de alerta (Baixo, Médio, Alto).`,
      config: {
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
