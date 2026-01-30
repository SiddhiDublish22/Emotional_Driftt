
export interface EmotionScores {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  calm: number;
  surprise: number;
}

export interface BehavioralData {
  typingSpeed: number; // characters per second
  timeSpent: number; // seconds
  textLength: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  emotions: EmotionScores;
  dominantEmotion: keyof EmotionScores;
  intensity: number; // 0-10
  confidence: number; // 0-100%
  behaviorConfidence: number; // 0-100% (enhanced by behavioral signals)
  userRating: number; // 1-5 user self-reflection
  behavioralSignals: BehavioralData;
}

export interface User {
  id: string;
  email: string;
  name: string;
  streak: number;
  lastEntryDate?: string;
}

export interface AIInsight {
  summary: string;
  trends: string[];
  tips: string[];
  driftPrediction: string;
  stabilityIndicator: number; // 0-100
  positivityRatio: number; // 0-100
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
