
import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysis, Message, Lead } from "../types";

// Always use a named parameter for apiKey.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses gemini-3-pro-preview to evaluate the lead and generate a high-converting personalized outreach.
 * Optimized for the Pakistan Real Estate Market context.
 */
export const scoreLeadProfile = async (lead: Partial<Lead>): Promise<AiAnalysis> => {
  const ai = getAiClient();
  const prompt = `
    Role: Senior Sales Strategist for Pakistan's Premier Real Estate CRM.
    Target Market: Lahore, Karachi, Islamabad.
    Lead Context:
    - Name: ${lead.name}
    - Channel: ${lead.source}
    - Potential Value: PKR ${lead.value}
    
    Instructions:
    1. Assess Conversion Potential (0-100) based on value and channel.
    2. Analyze Sentiment (POSITIVE, NEUTRAL, NEGATIVE).
    3. Calculate Probability of Closing (0-100) if a high-quality response is sent now.
    4. Draft a sophisticated, professional outreach template (WhatsApp/Email style). Use "Salaam" if appropriate. Mention they reached out via ${lead.source}.
    5. Summarize the lead potential in one punchy sentence.
    6. List 3 tactical key points for the agent to follow.
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
            score: { type: Type.NUMBER, description: 'Overall conversion score out of 100' },
            sentiment: { type: Type.STRING, description: 'Must be POSITIVE, NEUTRAL, or NEGATIVE' },
            summary: { type: Type.STRING, description: 'Executive summary of the lead' },
            key_points: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: '3 tactical points'
            },
            next_action: { type: Type.STRING, description: 'Recommended immediate next step' },
            closing_probability: { type: Type.NUMBER, description: 'Percentage probability of winning' },
            personalized_email: { type: Type.STRING, description: 'The drafted outreach copy' }
          },
          required: ["score", "sentiment", "summary", "key_points", "next_action", "closing_probability", "personalized_email"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI returned empty content");
    
    return JSON.parse(text.trim()) as AiAnalysis;
  } catch (e) {
    console.error("Gemini Scoring Engine Failure:", e);
    // Graceful fallback for the UI
    return {
      score: 45,
      sentiment: 'NEUTRAL',
      summary: 'Automated baseline analysis generated.',
      key_points: ['Attempt immediate contact', 'Confirm budget availability', 'Verify property preference'],
      next_action: 'Initial Call Attempt',
      closing_probability: 15,
      personalized_email: `Hi ${lead.name},\n\nThank you for reaching out via ${lead.source}. We have received your inquiry regarding property investment. When is a good time to connect and share more details?\n\nRegards,\nTeam PakCRM`
    };
  }
};

/**
 * Performs a deep dive into conversation history using Gemini 3 Pro to detect intent shifts.
 */
export const analyzeLeadConversation = async (messages: Message[], leadName: string): Promise<AiAnalysis> => {
  const ai = getAiClient();
  const conversationLog = messages.map(m => `[${m.type}] ${m.content}`).join('\n');
  
  const prompt = `
    Analyze this conversation history with client ${leadName}:
    ${conversationLog}
    
    Determine if the client is exhibiting high buying intent or just browsing.
    Calculate current closing probability based on the most recent interactions.
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
    if (!text) throw new Error("No analysis received");
    return JSON.parse(text.trim()) as AiAnalysis;
  } catch (e) {
    console.warn("Conversation analysis fallback to static profile score.");
    return scoreLeadProfile({ name: leadName });
  }
};

/**
 * Intelligent parser that extracts structured lead data from messy raw text strings.
 */
export const parseLeadFromText = async (rawInput: string): Promise<Partial<Lead>> => {
  const ai = getAiClient();
  const prompt = `
    Extract structured real estate lead info from this raw input: "${rawInput}"
    Focus on: Name, Phone Number, Budget/Value (PKR), and the Inquiry Source.
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
            name: { type: Type.STRING },
            phone: { type: Type.STRING },
            value: { type: Type.NUMBER },
            source: { type: Type.STRING }
          },
          required: ["name", "phone", "value", "source"]
        }
      }
    });
    
    const text = response.text;
    if (!text) return {};
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("AI Parser Failed:", e);
    return {};
  }
};
