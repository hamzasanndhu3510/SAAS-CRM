
import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysis, Message, Lead } from "../types";

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses gemini-3-pro-preview to evaluate the lead and generate a personalized email.
 */
export const scoreLeadProfile = async (lead: Partial<Lead>): Promise<AiAnalysis> => {
  const ai = getAiClient();
  const prompt = `
    Role: Expert Sales Consultant for the Pakistan Real Estate Market.
    Lead Info:
    - Name: ${lead.name}
    - Inquiry Source: ${lead.source}
    - Estimated Value: PKR ${lead.value}
    
    Tasks:
    1. Calculate a "Conversion Score" (0-100).
    2. Estimate a "Closing Probability" (0-100) assuming the lead replies to our first contact.
    3. Draft a high-converting, professional, and personalized email template addressing them by name. Mention their interest and value.
    4. Provide a 1-sentence summary of the lead's potential.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            sentiment: { type: Type.STRING },
            summary: { type: Type.STRING },
            key_points: { type: Type.ARRAY, items: { type: Type.STRING } },
            next_action: { type: Type.STRING },
            closing_probability: { type: Type.NUMBER },
            personalized_email: { type: Type.STRING }
          },
          required: ["score", "sentiment", "summary", "key_points", "next_action", "closing_probability", "personalized_email"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    return JSON.parse(text.trim()) as AiAnalysis;
  } catch (e) {
    console.error("Gemini Scoring Error:", e);
    return {
      score: 50,
      sentiment: 'NEUTRAL',
      summary: 'Standard analysis fallback.',
      key_points: ['Review profile'],
      next_action: 'Manual outreach',
      closing_probability: 25,
      personalized_email: `Dear ${lead.name},\n\nThank you for contacting us via ${lead.source}. We would like to discuss your requirement further.\n\nRegards,\nTeam PakCRM`
    };
  }
};

export const analyzeLeadConversation = async (messages: Message[], leadName: string): Promise<AiAnalysis> => {
  const ai = getAiClient();
  const conversationText = messages.map(m => `${m.type}: ${m.content}`).join('\n');
  const prompt = `Analyze this conversation with ${leadName}:\n${conversationText}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            sentiment: { type: Type.STRING },
            summary: { type: Type.STRING },
            key_points: { type: Type.ARRAY, items: { type: Type.STRING } },
            next_action: { type: Type.STRING },
            closing_probability: { type: Type.NUMBER },
            personalized_email: { type: Type.STRING }
          },
          required: ["score", "sentiment", "summary", "key_points", "next_action", "closing_probability", "personalized_email"]
        }
      }
    });
    return JSON.parse(response.text || '{}') as AiAnalysis;
  } catch (e) {
    return scoreLeadProfile({ name: leadName });
  }
};

export const parseLeadFromText = async (rawText: string): Promise<Partial<Lead>> => {
  const ai = getAiClient();
  const prompt = `Extract structured lead data from: "${rawText}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            phone: { type: Type.STRING },
            value: { type: Type.NUMBER },
            source: { type: Type.STRING },
            ai_score: { type: Type.NUMBER }
          },
          required: ["name", "phone", "value", "source", "ai_score"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {};
  }
};
