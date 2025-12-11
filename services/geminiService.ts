import { GoogleGenAI } from "@google/genai";
import { CRANIAL_NERVES } from "../constants";
import { CranialNerve } from "../types";

// Initialize Gemini
// NOTE: Ideally this uses the process.env.API_KEY injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateClinicalScenario = async (): Promise<{ scenario: string, nerveId: number }> => {
  // Pick a random nerve to be the target
  const targetNerve = CRANIAL_NERVES[Math.floor(Math.random() * CRANIAL_NERVES.length)];
  
  const prompt = `
    Você é um professor de neuroanatomia criando um quiz para estudantes de medicina.
    Gere um cenário clínico curto (máximo 3 frases) descrevendo um paciente com uma lesão no nervo craniano: ${targetNerve.roman} - ${targetNerve.name}.
    
    Regras:
    1. NÃO mencione o nome do nervo ou o número romano no texto.
    2. Descreva os sintomas clínicos específicos (ex: ptose, anosmia, paralisia de Bell, desvio da úvula).
    3. Retorne APENAS o texto do cenário.
    4. Idioma: Português.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Falha ao gerar cenário.");
    }

    return {
      scenario: text,
      nerveId: targetNerve.id
    };
  } catch (error) {
    console.error("Erro ao conectar com Gemini:", error);
    // Fallback scenario if API fails (simulated for robustness)
    return {
      scenario: `Paciente apresenta dificuldade severa em elevar os ombros e virar a cabeça contra resistência. (Modo Offline - Erro na API)`,
      nerveId: 11 // Acessório
    };
  }
};

export const generateNerveIllustration = async (nerve: CranialNerve): Promise<string> => {
  const prompt = `
    Crie uma ilustração médica anatômica, estilo desenho científico didático, focada na função principal do nervo craniano: ${nerve.name} (Função: ${nerve.keyFunction}).
    
    Detalhes:
    - Fundo branco ou neutro.
    - Estilo limpo, vetorial ou esboço médico de alta qualidade.
    - A imagem deve destacar a parte do corpo afetada (olho, língua, ouvido, rosto, etc.) ou a ação realizada.
    - NÃO inclua texto, letras ou números na imagem.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      // Note: responseMimeType is not supported for nano banana series models image generation
    });

    // Iterate parts to find the image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Nenhuma imagem gerada.");
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw error;
  }
};
