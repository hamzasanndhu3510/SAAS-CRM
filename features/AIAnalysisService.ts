
import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysis, Message, Lead } from "../types";

/**
 * Creates a fresh instance of the Gemini API client.
 * Always initialized right before use to ensure session key validity.
 */
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyze lead conversation for sentiment and conversion probability.
 * Uses gemini-3-pro-preview for advanced reasoning on lead intent.
 */
export const analyzeLeadConversation = async (messages: Message[], leadName: string): Promise<AiAnalysis> => {
  const ai = getAiClient();
  const conversationText = messages
    .map(m => `${m.type === 'INBOUND' ? 'Lead' : 'Agent'}: ${m.content}`)
    .join('\n');

  const prompt = `
    Analyze this conversation for a real estate lead named "${leadName}" in Pakistan.
    Conversation:
    ${conversationText}

    Determine:
    1. A lead score from 0 to 100.
    2. Overall sentiment (POSITIVE, NEUTRAL, or NEGATIVE).
    3. A short summary of what they want.
    4. 3 key points.
    5. Next action.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: 'Conversion probability (0-100)' },
          sentiment: { type: Type.STRING, description: 'POSITIVE, NEUTRAL, or NEGATIVE' },
          summary: { type: Type.STRING },
          key_points: { type: Type.ARRAY, items: { type: Type.STRING } },
          next_action: { type: Type.STRING }
        },
        required: ["score", "sentiment", "summary", "key_points", "next_action"],
        propertyOrdering: ["score", "sentiment", "summary", "key_points", "next_action"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as AiAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return {
      score: 0,
      sentiment: 'NEUTRAL',
      summary: 'Analysis failed to parse.',
      key_points: [],
      next_action: 'Manual review required.'
    };
  }
};

/**
 * Score a lead profile based on basic metadata using Gemini 3 Pro.
 */
export const scoreLeadProfile = async (lead: Partial<Lead>): Promise<AiAnalysis> => {
  const ai = getAiClient();
  const prompt = `
    Evaluate this real estate lead from Pakistan and provide a conversion score (0-100).
    Lead Details:
    Name: ${lead.name}
    Source: ${lead.source}
    Value: PKR ${lead.value}
    Stage: ${lead.stage}

    Return a detailed analysis including reasoning for the score.
  `;

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
          next_action: { type: Type.STRING }
        },
        required: ["score", "sentiment", "summary", "key_points", "next_action"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as AiAnalysis;
  } catch (e) {
    return {
      score: 50,
      sentiment: 'NEUTRAL',
      summary: 'Profile analysis error.',
      key_points: [],
      next_action: 'Manual lead check.'
    };
  }
};

/**
 * Extract structured lead data from raw text snippets.
 */
export const parseLeadFromText = async (rawText: string): Promise<Partial<Lead>> => {
  const ai = getAiClient();
  const prompt = `
    Extract lead information from the following text.
    Text: "${rawText}"

    Extract:
    1. Name
    2. Phone (03xx-xxxxxxx)
    3. Estimated value in PKR
    4. Source (WHATSAPP, FACEBOOK, WALK_IN, WEBSITE)
    5. An initial conversion score (0-100) based on the intent shown in the text.
  `;

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

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {};
  }
};
