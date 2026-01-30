
import React from 'react';
import { 
  Monitor, 
  Server, 
  Database, 
  Cpu, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRightLeft 
} from 'lucide-react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">System Architecture</h2>
        <p className="text-slate-500">A visual guide to how your data flows through the Emotional Drift platform.</p>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-12">
        {/* Frontend */}
        <div className="relative group w-full md:w-64 glass p-8 rounded-3xl border-t-4 border-indigo-500 flex flex-col items-center text-center shadow-2xl hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <Monitor className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Frontend</h3>
          <p className="text-xs text-slate-500">React 18 + Tailwind CSS<br/>Lucide + Recharts</p>
          <div className="mt-4 flex flex-wrap justify-center gap-1">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-[10px] rounded border border-indigo-100 dark:border-indigo-900">TSX</span>
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-[10px] rounded border border-indigo-100 dark:border-indigo-900">SPA</span>
          </div>
        </div>

        <ArrowRightLeft className="w-8 h-8 text-slate-300 hidden md:block" />

        {/* Backend / API */}
        <div className="relative group w-full md:w-64 glass p-8 rounded-3xl border-t-4 border-emerald-500 flex flex-col items-center text-center shadow-2xl hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <Server className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">API Layer</h3>
          <p className="text-xs text-slate-500">Secure Service Handlers<br/>Emotion Analysis Logic</p>
          <div className="mt-4 flex flex-wrap justify-center gap-1">
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-[10px] rounded border border-emerald-100 dark:border-emerald-900">REST</span>
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-[10px] rounded border border-emerald-100 dark:border-emerald-900">NLP</span>
          </div>
          
          {/* Sub-process: AI Engine */}
          <div className="absolute -bottom-24 md:-right-24 md:bottom-auto w-48 glass p-4 rounded-2xl border border-amber-400 shadow-lg">
             <div className="flex items-center gap-2 mb-2">
               <Cpu className="w-4 h-4 text-amber-500" />
               <span className="font-bold text-xs">Gemini AI Engine</span>
             </div>
             <p className="text-[10px] text-slate-500">Multimodal reasoning for emotion detection & summarization.</p>
          </div>
        </div>

        <ArrowRightLeft className="w-8 h-8 text-slate-300 hidden md:block" />

        {/* Database */}
        <div className="relative group w-full md:w-64 glass p-8 rounded-3xl border-t-4 border-rose-500 flex flex-col items-center text-center shadow-2xl hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
            <Database className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Database</h3>
          <p className="text-xs text-slate-500">Structured Emotional Logs<br/>User Metadata</p>
          <div className="mt-4 flex flex-wrap justify-center gap-1">
            <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950 text-[10px] rounded border border-rose-100 dark:border-rose-900">JSON</span>
            <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950 text-[10px] rounded border border-rose-100 dark:border-rose-900">Storage</span>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl max-w-4xl mx-auto">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Data Integrity & Privacy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">End-to-End Encryption</p>
            Your emotional data is transmitted securely via HTTPS and stored in a structured format that prevents unauthorized access.
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">Scalable Analysis</p>
            The system utilizes Gemini Flash for high-speed, real-time emotion detection and Gemini Pro for deep historical trend analysis.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
