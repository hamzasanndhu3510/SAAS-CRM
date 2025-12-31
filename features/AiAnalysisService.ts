
import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysis, Message, Lead } from "../types";

/**
 * Creates a fresh instance of the Gemini API client.
 */
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Enhanced AI Analysis: Scores lead and generates a personalized email.
 * Uses gemini-3-pro-preview for complex reasoning and content generation.
 */
export const scoreLeadProfile = async (lead: Partial<Lead>): Promise<AiAnalysis> => {
  const ai = getAiClient();
  const prompt = `
    Evaluate this real estate lead from Pakistan:
    Name: ${lead.name}
    Source: ${lead.source}
    Estimated Value: PKR ${lead.value}
    
    Task:
    1. Provide a conversion score (0-100).
    2. Estimate the 'Closing Probability' (0-100) assuming they have just replied to our first email.
    3. Write a highly personalized, professional email template to send to this client to build rapport.
    4. Provide a summary and next steps.
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
            closing_probability: { type: Type.NUMBER, description: 'Probability of closing assuming first reply received' },
            personalized_email: { type: Type.STRING, description: 'The drafted email template' }
          },
          required: ["score", "sentiment", "summary", "key_points", "next_action", "closing_probability", "personalized_email"]
        }
      }
    });

    // Directly access text property as per guidelines
    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text.trim()) as AiAnalysis;
  } catch (e) {
    console.error("AI Scoring Error:", e);
    return {
      score: 50,
      sentiment: 'NEUTRAL',
      summary: 'Standard lead analysis applied.',
      key_points: ['Review contact details'],
      next_action: 'Send introductory message',
      closing_probability: 30,
      personalized_email: `Dear ${lead.name},\n\nThank you for reaching out via ${lead.source}. We have several properties matching your interest. Looking forward to discussing this further.\n\nBest regards,\nPakCRM Team`
    };
  }
};

/**
 * Analyze existing conversation history.
 */
export const analyzeLeadConversation = async (messages: Message[], leadName: string): Promise<AiAnalysis> => {
  const ai = getAiClient();
  const conversationText = messages.map(m => `${m.type}: ${m.content}`).join('\n');
  const prompt = `Analyze conversation with ${leadName}:\n${conversationText}`;

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
    // Directly access text property as per guidelines
    const text = response.text;
    return JSON.parse(text || '{}') as AiAnalysis;
  } catch (e) {
    return scoreLeadProfile({ name: leadName });
  }
};

/**
 * Fast parse lead from raw text.
 */
export const parseLeadFromText = async (rawText: string): Promise<Partial<Lead>> => {
  const ai = getAiClient();
  const prompt = `Extract lead info from: "${rawText}"`;

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
    // Directly access text property as per guidelines
    const text = response.text;
    return JSON.parse(text || '{}');
  } catch (e) {
    return {};
  }
};
