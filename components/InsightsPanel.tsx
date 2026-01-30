
import React, { useState, useEffect } from 'react';
import { BrainCircuit, TrendingUp, Lightbulb, Map, RefreshCcw, Loader2 } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { JournalEntry, AIInsight } from '../types';

interface InsightsPanelProps {
  entries: JournalEntry[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ entries }) => {
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = async () => {
    if (entries.length === 0) return;
    setIsLoading(true);
    try {
      const data = await geminiService.generateInsights(entries);
      setInsights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [entries.length]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl p-10">
        <BrainCircuit className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-400">No Data for Analysis</h2>
        <p className="text-slate-400 mt-2 max-w-sm">Write your first journal entry to unlock personalized AI insights and emotional drift predictions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">AI Insights</h2>
          <p className="text-slate-500">Intelligent analysis of your emotional patterns.</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={isLoading}
          className="p-2 glass rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCcw className="w-6 h-6" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="glass p-8 rounded-3xl border-l-4 border-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold">Executive Summary</h3>
          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            {isLoading ? 'Regenerating summary...' : (insights?.summary || 'Generating summary based on your logs...')}
          </p>
        </div>

        {/* Drift Prediction */}
        <div className="glass p-8 rounded-3xl border-l-4 border-rose-500">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-6 h-6 text-rose-500" />
            <h3 className="text-xl font-bold">Drift Prediction</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            {isLoading ? 'Calculating trajectory...' : (insights?.driftPrediction || 'Analyzing patterns for future predictions...')}
          </p>
        </div>

        {/* Patterns/Trends */}
        <div className="glass p-8 rounded-3xl border-l-4 border-emerald-500">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-bold">Identified Trends</h3>
          </div>
          <ul className="space-y-4">
            {isLoading ? [1, 2, 3].map(i => <li key={i} className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-3/4"></li>) : 
              insights?.trends.map((trend, i) => (
                <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                  {trend}
                </li>
              ))
            }
          </ul>
        </div>

        {/* Wellness Tips */}
        <div className="glass p-8 rounded-3xl border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold">Wellness Recommendations</h3>
          </div>
          <div className="space-y-4">
            {isLoading ? [1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl"></div>) : 
              insights?.tips.map((tip, i) => (
                <div key={i} className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-slate-700 dark:text-slate-300">
                  {tip}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
