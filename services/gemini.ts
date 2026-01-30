
import { GoogleGenAI, Type } from "@google/genai";
import { EmotionScores, AIInsight, JournalEntry, BehavioralData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  analyzeEmotion: async (text: string, behavior: BehavioralData): Promise<{ 
    scores: EmotionScores, 
    intensity: number, 
    confidence: number,
    behaviorConfidence: number 
  }> => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following journal entry for emotional content and behavior.
      
      User Behavior Signals:
      - Typing Speed: ${behavior.typingSpeed.toFixed(2)} chars/sec
      - Time Spent: ${behavior.timeSpent.toFixed(1)} seconds
      - Text Length: ${behavior.textLength} chars

      Entry Text: "${text}"

      Instructions:
      1. Provide emotional scores (0-1) for: joy, sadness, anger, fear, calm, surprise.
      2. Provide an overall emotional intensity score (0-10).
      3. Provide a base confidence score (0-100) based purely on text clarity.
      4. Provide an 'enhanced' behaviorConfidence score (0-100). Slower typing or longer time spent on short text might indicate high emotional hesitation or deep reflection, increasing confidence in complex emotions. High speed might indicate raw, impulsive emotion.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            joy: { type: Type.NUMBER },
            sadness: { type: Type.NUMBER },
            anger: { type: Type.NUMBER },
            fear: { type: Type.NUMBER },
            calm: { type: Type.NUMBER },
            surprise: { type: Type.NUMBER },
            intensity: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            behaviorConfidence: { type: Type.NUMBER },
          },
          required: ["joy", "sadness", "anger", "fear", "calm", "surprise", "intensity", "confidence", "behaviorConfidence"]
        }
      }
    });

    try {
      const res = JSON.parse(response.text || '{}');
      return {
        scores: {
          joy: res.joy,
          sadness: res.sadness,
          anger: res.anger,
          fear: res.fear,
          calm: res.calm,
          surprise: res.surprise
        },
        intensity: res.intensity,
        confidence: res.confidence,
        behaviorConfidence: res.behaviorConfidence
      };
    } catch (e) {
      console.error("Failed to parse emotion analysis", e);
      return { 
        scores: { joy: 0, sadness: 0, anger: 0, fear: 0, calm: 0, surprise: 0 }, 
        intensity: 0, 
        confidence: 0,
        behaviorConfidence: 0
      };
    }
  },

  generateInsights: async (entries: JournalEntry[]): Promise<AIInsight> => {
    const historyText = entries.slice(0, 10).map(e => `[${e.timestamp}] ${e.text}`).join('\n');
    
    // Calculate simple metrics for the AI to consider
    const emotionChanges = entries.length > 1 ? entries.filter((e, i) => i > 0 && e.dominantEmotion !== entries[i-1].dominantEmotion).length : 0;
    const stability = entries.length > 0 ? Math.max(0, 100 - (emotionChanges / entries.length * 100)) : 100;
    
    const posEmotions = entries.reduce((acc, e) => acc + (e.emotions.joy + e.emotions.calm), 0);
    const negEmotions = entries.reduce((acc, e) => acc + (e.emotions.sadness + e.emotions.anger + e.emotions.fear), 0);
    const posRatio = (posEmotions / (posEmotions + negEmotions + 0.1)) * 100;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these recent journal entries and provide mental health insights.
      Current Stats: Stability ${stability.toFixed(0)}%, Positivity ${posRatio.toFixed(0)}%
      History:
      ${historyText}
      
      Output JSON with:
      - summary: 1-2 sentences of overall mood.
      - trends: List of 3 identified emotional patterns.
      - tips: List of 3 personalized wellness tips.
      - driftPrediction: Prediction of likely mood drift for the next few days.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            trends: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            driftPrediction: { type: Type.STRING },
          },
          required: ["summary", "trends", "tips", "driftPrediction"]
        }
      }
    });

    try {
      const res = JSON.parse(response.text || '{}');
      return {
        ...res,
        stabilityIndicator: stability,
        positivityRatio: posRatio
      };
    } catch (e) {
      return {
        summary: "Analysis unavailable.",
        trends: [],
        tips: [],
        driftPrediction: "Stay mindful of your daily routine.",
        stabilityIndicator: stability,
        positivityRatio: posRatio
      };
    }
  }
};
