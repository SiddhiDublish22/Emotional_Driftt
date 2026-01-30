
import React, { useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, Legend, BarChart, Bar, Brush, LineChart, Line, ReferenceArea
} from 'recharts';
import { JournalEntry, EmotionScores } from '../types';
import { EMOTION_COLORS, EMOTION_LABELS } from '../constants';
import { Flame, TrendingUp, Clock, Info, Download, Maximize2, Sparkles, Zap, ShieldCheck, Activity, BarChart2 } from 'lucide-react';

interface DashboardProps {
  entries: JournalEntry[];
  streak: number;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, streak }) => {
  const latestEntry = entries[0];
  
  const timelineData = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((e, idx, arr) => {
        // Calculate drift: significant change from previous entry
        let isDrift = false;
        if (idx > 0) {
          const prev = arr[idx-1];
          const intensityDelta = Math.abs(e.intensity - prev.intensity);
          const emotionChanged = e.dominantEmotion !== prev.dominantEmotion;
          isDrift = intensityDelta > 3 || emotionChanged;
        }

        return {
          timestamp: new Date(e.timestamp).getTime(),
          dateLabel: new Date(e.timestamp).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
          }),
          ...e.emotions,
          intensity: e.intensity,
          confidence: e.confidence,
          behaviorConfidence: e.behaviorConfidence,
          userRating: (e.userRating / 5) * 1.0, // scale to 0-1 for charts
          isDrift
        };
      });
  }, [entries]);

  const pieData = useMemo(() => {
    if (entries.length === 0) return [];
    const totals = entries.reduce((acc, curr) => {
      Object.keys(curr.emotions).forEach(key => {
        const k = key as keyof EmotionScores;
        acc[k] = (acc[k] || 0) + curr.emotions[k];
      });
      return acc;
    }, {} as any);

    return Object.keys(totals).map(key => ({
      name: EMOTION_LABELS[key],
      value: totals[key] / entries.length,
      color: EMOTION_COLORS[key]
    })).filter(d => d.value > 0);
  }, [entries]);

  // Aggregate Insights
  const stability = useMemo(() => {
    if (entries.length < 2) return 100;
    const drifts = timelineData.filter(d => d.isDrift).length;
    return Math.round(Math.max(0, 100 - (drifts / entries.length * 200)));
  }, [entries, timelineData]);

  const mostFrequentEmotion = useMemo(() => {
    if (entries.length === 0) return 'None';
    const counts = entries.reduce((acc, e) => {
      acc[e.dominantEmotion] = (acc[e.dominantEmotion] || 0) + 1;
      return acc;
    }, {} as any);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }, [entries]);

  const posVsNeg = useMemo(() => {
    if (entries.length === 0) return { pos: 0, neg: 0 };
    const pos = entries.reduce((acc, e) => acc + e.emotions.joy + e.emotions.calm, 0);
    const neg = entries.reduce((acc, e) => acc + e.emotions.sadness + e.emotions.anger + e.emotions.fear, 0);
    const total = pos + neg + 0.1;
    return { pos: Math.round((pos/total)*100), neg: Math.round((neg/total)*100) };
  }, [entries]);

  const exportCSV = () => {
    const headers = [
      'Timestamp', 'Text', 'Dominant Emotion', 'Joy', 'Sadness', 'Anger', 'Fear', 'Calm', 'Surprise', 
      'Intensity', 'Confidence (%)', 'Behavior-Assisted Confidence (%)', 'User Rating (1-5)',
      'Typing Speed (cps)', 'Time Spent (s)'
    ];
    const rows = entries.map(e => [
      e.timestamp,
      `"${e.text.replace(/"/g, '""')}"`,
      e.dominantEmotion,
      e.emotions.joy.toFixed(2),
      e.emotions.sadness.toFixed(2),
      e.emotions.anger.toFixed(2),
      e.emotions.fear.toFixed(2),
      e.emotions.calm.toFixed(2),
      e.emotions.surprise.toFixed(2),
      e.intensity,
      e.confidence,
      e.behaviorConfidence,
      e.userRating,
      e.behavioralSignals.typingSpeed.toFixed(2),
      e.behavioralSignals.timeSpent.toFixed(1)
    ]);
    const summary = [
      [],
      ['Summary Insights'],
      ['Stability Indicator', `${stability}%`],
      ['Most Frequent Emotion', EMOTION_LABELS[mostFrequentEmotion]],
      ['Positive Ratio', `${posVsNeg.pos}%`],
      ['Negative Ratio', `${posVsNeg.neg}%`]
    ];
    
    const csvContent = [...[headers, ...rows], ...summary].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotional-drift-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.25em]">
            <Sparkles className="w-4 h-4" />
            Intelligence Engine v2.5
          </div>
          <h2 className="text-5xl font-black tracking-tighter">Your Emotional Feed</h2>
          <p className="text-slate-500 font-medium max-w-2xl text-lg">Monitoring psychological drift through deep-learning synthesis and behavioral interaction signaling.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={exportCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 glass border-slate-200 dark:border-slate-800 rounded-2xl font-black hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <div className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-tr from-amber-500 to-orange-400 text-white rounded-2xl font-black shadow-xl shadow-amber-500/30">
            <Flame className="w-5 h-5 fill-current" />
            <span>{streak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Stability Index', value: `${stability}%`, icon: Activity, color: 'indigo', tint: 'hover-tint-indigo' },
          { label: 'Primary Frequency', value: EMOTION_LABELS[mostFrequentEmotion] || 'N/A', icon: BarChart2, color: 'rose', tint: 'hover-tint-rose' },
          { label: 'Positivity Mix', value: `${posVsNeg.pos}%`, icon: Zap, color: 'amber', tint: 'hover-tint-indigo' },
          { label: 'Analysis Fidelity', value: latestEntry ? `${latestEntry.behaviorConfidence}%` : 'N/A', icon: ShieldCheck, color: 'emerald', tint: 'hover-tint-indigo' }
        ].map((stat, i) => (
          <div key={i} className={`glass p-10 rounded-[3rem] ${stat.tint}`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                <stat.icon className="w-7 h-7" />
              </div>
            </div>
            <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
            <div className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Journey Map */}
        <div className="lg:col-span-8 glass p-10 rounded-[3.5rem] hover-tint-indigo overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black tracking-tight">Emotional Trajectory</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium italic">Detection of significant psychological drift events.</p>
            </div>
          </div>
          <div className="h-[450px] w-full relative">
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={timelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  {Object.keys(EMOTION_COLORS).map(key => (
                    <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={EMOTION_COLORS[key]} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={EMOTION_COLORS[key]} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.15} />
                <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} dy={10} minTickGap={40}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} domain={[0, 1]}/>
                <Tooltip 
                  cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '5 5' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass p-8 rounded-3xl shadow-2xl backdrop-blur-2xl border-white/20">
                          <p className="font-black text-slate-900 dark:text-white mb-6 text-lg tracking-tight">{label}</p>
                          <div className="space-y-3">
                            {payload.map((p, i) => (
                              <div key={i} className="flex items-center justify-between gap-12">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{p.name}</span>
                                <span className="text-sm font-black" style={{color: p.color}}>{(p.value as number).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="joy" name="Joy" stroke={EMOTION_COLORS.joy} fillOpacity={1} fill="url(#color-joy)" strokeWidth={4} />
                <Area type="monotone" dataKey="sadness" name="Sadness" stroke={EMOTION_COLORS.sadness} fillOpacity={1} fill="url(#color-sadness)" strokeWidth={3} />
                <Area type="monotone" dataKey="calm" name="Calm" stroke={EMOTION_COLORS.calm} fillOpacity={1} fill="url(#color-calm)" strokeWidth={3} />
                <Area type="step" dataKey="intensity" name="Intensity" stroke="#6366F1" fill="transparent" strokeWidth={1} strokeDasharray="4 4" />
                <Brush dataKey="dateLabel" height={40} stroke="#6366F1" fill="transparent" travellerWidth={12} className="mt-8 opacity-20 hover:opacity-100 transition-opacity"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Spectrum */}
        <div className="lg:col-span-4 glass p-10 rounded-[3.5rem] flex flex-col hover-tint-indigo overflow-hidden">
          <h3 className="text-2xl font-black tracking-tight mb-10">Dominant Spectrum</h3>
          <div className="flex-grow w-full relative min-h-[350px]">
            {entries.length > 0 ? (
              <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={120}
                    paddingAngle={12}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontWeight: 800, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6">
                <Sparkles className="w-16 h-16 opacity-10 animate-pulse" />
                <p className="font-black text-xs tracking-[0.3em] uppercase">Pending Synthesis</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Web Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[3.5rem] hover-tint-indigo overflow-hidden">
          <div className="mb-10">
            <h4 className="text-xl font-black tracking-tight">Behavioral Alignment</h4>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Interaction Fidelity Optimization</p>
          </div>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.1} />
                <XAxis dataKey="dateLabel" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip />
                <Line type="monotone" dataKey="behaviorConfidence" name="AI Fidelity" stroke="#10B981" strokeWidth={5} dot={{r: 6, fill: '#10B981'}} />
                <Line type="monotone" dataKey="confidence" name="Raw Confidence" stroke="#94A3B8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-10 rounded-[3.5rem] hover-tint-indigo overflow-hidden">
          <div className="mb-10">
            <h4 className="text-xl font-black tracking-tight">Psychological Reflection</h4>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Synchronizing AI Perception with Self-Rating</p>
          </div>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.1} />
                <Tooltip />
                <Bar dataKey="intensity" name="System Intensity" fill="#6366F1" opacity={0.4} radius={[12, 12, 0, 0]} />
                <Bar dataKey="userRating" name="User Rating" fill="#F59E0B" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
