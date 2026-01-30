
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles, CheckCircle2, ShieldCheck, Heart, User } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { dbService } from '../services/db';
import { JournalEntry, EmotionScores, BehavioralData } from '../types';

interface JournalFormProps {
  onSuccess: (entry: JournalEntry) => void;
}

const JournalForm: React.FC<JournalFormProps> = ({ onSuccess }) => {
  const [text, setText] = useState('');
  const [userRating, setUserRating] = useState(3);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Behavioral signal tracking
  const startTime = useRef<number>(0);
  const keyPressCount = useRef<number>(0);

  useEffect(() => {
    if (text.length === 1 && startTime.current === 0) {
      startTime.current = Date.now();
    }
  }, [text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    const endTime = Date.now();
    const timeSpent = (endTime - (startTime.current || endTime)) / 1000;
    const behavioralData: BehavioralData = {
      typingSpeed: text.length / (timeSpent || 1),
      timeSpent: timeSpent,
      textLength: text.length
    };

    try {
      const analysis = await geminiService.analyzeEmotion(text, behavioralData);
      const scores = analysis.scores;
      
      let dominant: keyof EmotionScores = 'joy';
      let maxVal = -1;
      Object.keys(scores).forEach(key => {
        const k = key as keyof EmotionScores;
        if (scores[k] > maxVal) {
          maxVal = scores[k];
          dominant = k;
        }
      });

      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        userId: 'user-1',
        text,
        timestamp: new Date().toISOString(),
        emotions: scores,
        dominantEmotion: dominant,
        intensity: Math.round(analysis.intensity * 10),
        confidence: analysis.confidence,
        behaviorConfidence: analysis.behaviorConfidence,
        userRating: userRating,
        behavioralSignals: behavioralData
      };

      dbService.saveEntry(entry);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(entry);
        setText('');
        setUserRating(3);
        startTime.current = 0;
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-12 duration-1000 pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          Private Analysis Session
        </div>
        <h2 className="text-5xl font-black tracking-tighter">Tell us your story.</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg leading-relaxed">
          Our behavior-assisted algorithm processes your syntax and interaction patterns to map your emotional state.
        </p>
      </div>

      <div className="glass p-1 md:p-2 rounded-[3rem] shadow-2xl">
        <div className="bg-white dark:bg-slate-900/80 rounded-[2.5rem] p-8 md:p-12 space-y-8">
          
          <div className="flex flex-col items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800">
             <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">How would you rate your mood? (1-5)</label>
             <div className="flex gap-4">
               {[1, 2, 3, 4, 5].map((val) => (
                 <button 
                  key={val}
                  type="button"
                  onClick={() => setUserRating(val)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                    userRating === val 
                      ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100'
                  }`}
                 >
                   {val}
                 </button>
               ))}
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative group">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's weighing on your mind? Be as descriptive as possible..."
                className="w-full h-72 p-10 bg-slate-50/50 dark:bg-slate-950/40 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none text-xl leading-relaxed font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700"
                disabled={isAnalyzing || isSuccess}
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-indigo-600 text-xl tracking-tight">AI NLP Active</p>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Decoding Behavioral Patterns...</p>
                  </div>
                </div>
              )}
              {isSuccess && (
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <p className="font-black text-slate-900 dark:text-white text-3xl tracking-tighter">Processed Successfully</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!text.trim() || isAnalyzing || isSuccess}
              className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center gap-4 group"
            >
              {isAnalyzing ? 'Analyzing...' : (
                <>
                  <Send className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  Analyze Sentiments
                </>
              )}
            </button>
          </form>
          
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-[0.2em] pt-4">
             <ShieldCheck className="w-4 h-4" />
             Enhanced with behavioral patterns
          </div>
        </div>
      </div>

      <div className="p-8 glass rounded-[2rem] bg-amber-50/30 dark:bg-amber-900/10 border-amber-200/50">
        <h4 className="font-black text-amber-800 dark:text-amber-400 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
          <Heart className="w-4 h-4" /> Safety & Ethics
        </h4>
        <p className="text-sm text-amber-700/80 dark:text-amber-300/60 font-medium leading-relaxed">
          This application provides AI-based emotional insights and is not a medical or diagnostic tool.
          No biometric or fingerprint data is collected. Behavioral signals such as typing speed are used solely to improve analysis confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Local Insights', desc: 'Analysis results are stored on your device using local storage.' },
          { title: 'Confidence Metrics', desc: 'Every detection includes a multi-factor confidence rating.' },
          { title: 'Safe AI', desc: 'Zero biometric collection ensures your physical privacy is preserved.' }
        ].map((feat, i) => (
          <div key={i} className="glass p-8 rounded-[2rem] text-center hover-tint-indigo">
            <h4 className="font-black text-lg mb-2">{feat.title}</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalForm;
