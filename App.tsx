
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import JournalForm from './components/JournalForm';
import InsightsPanel from './components/InsightsPanel';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import { dbService } from './services/db';
import { JournalEntry, User, Theme } from './types';
import { Trash2, User as UserIcon, Shield, Bell, ChevronRight, History, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  useEffect(() => {
    // Initial data load
    const savedEntries = dbService.getEntries();
    const savedUser = dbService.getUser();
    setEntries(savedEntries);
    setUser(savedUser);

    // Initial theme check
    const savedTheme = localStorage.getItem('ed_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === Theme.DARK) document.documentElement.classList.add('dark');
    }

    // Scroll to top on tab change
    window.scrollTo(0, 0);
  }, [activeTab]);

  const toggleTheme = () => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
    localStorage.setItem('ed_theme', newTheme);
    if (newTheme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNewEntry = (entry: JournalEntry) => {
    setEntries(prev => [entry, ...prev]);
    setUser(dbService.getUser());
    setActiveTab('dashboard');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your journal history? This cannot be undone.')) {
      dbService.clearData();
      setEntries([]);
      setUser(dbService.getUser());
      setActiveTab('dashboard');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard entries={entries} streak={user?.streak || 0} />;
      case 'journal':
        return <JournalForm onSuccess={handleNewEntry} />;
      case 'insights':
        return <InsightsPanel entries={entries} />;
      case 'architecture':
      case 'technology':
        return <ArchitectureDiagram />;
      case 'history':
      case 'archives':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black tracking-tight mb-4">Historical Archive</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">Review your past emotional states and track your journey through time.</p>
            </div>
            <div className="space-y-6">
              {entries.map((entry) => (
                <div key={entry.id} className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 hover-tint-indigo transition-all">
                  <div className="md:w-56 flex-shrink-0">
                    <div className="text-sm font-black text-indigo-600 mb-1 uppercase tracking-widest">
                      {new Date(entry.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </div>
                    <div className="text-xs font-bold text-slate-400">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                       <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: entry.dominantEmotion ? (window as any).EMOTION_COLORS?.[entry.dominantEmotion] || '#6366F1' : '#6366F1' }} 
                       />
                       <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400">
                         {entry.dominantEmotion}
                       </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium italic">
                      "{entry.text}"
                    </p>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <div className="text-center py-32 glass rounded-[3rem]">
                   <History className="w-16 h-16 mx-auto mb-6 opacity-10" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest">No history recorded yet</p>
                   <button onClick={() => setActiveTab('journal')} className="mt-6 text-indigo-600 font-black hover:underline underline-offset-4">Write your first entry →</button>
                </div>
              )}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-4">Preferences</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">Manage your secure environment and visual profile.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Card */}
              <div className="glass p-10 rounded-[3rem]">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{user?.name}</h3>
                    <p className="text-slate-500 font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                      <Shield className="w-5 h-5 text-indigo-500" />
                      <span className="font-bold">Privacy Controls</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                      <Bell className="w-5 h-5 text-indigo-500" />
                      <span className="font-bold">Session Alerts</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="glass p-10 rounded-[3rem] flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                    <SettingsIcon className="w-6 h-6 text-indigo-500" />
                    Global Settings
                  </h3>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-lg">Atmosphere</p>
                        <p className="text-sm text-slate-500 font-medium">Switch between light and dark themes.</p>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all"
                      >
                        {theme === Theme.LIGHT ? 'Go Dark' : 'Go Light'}
                      </button>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-4">
                      <p className="font-black text-rose-600 mb-4 uppercase tracking-widest text-xs">Danger Zone</p>
                      <button 
                        onClick={clearAllData}
                        className="flex items-center gap-3 px-8 py-4 border-2 border-rose-100 dark:border-rose-900/20 text-rose-600 rounded-2xl font-black hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all w-full justify-center"
                      >
                        <Trash2 className="w-5 h-5" />
                        Purge Local History
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard entries={entries} streak={user?.streak || 0} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isDarkMode={theme === Theme.DARK} 
      toggleTheme={toggleTheme}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
