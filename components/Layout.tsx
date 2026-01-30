
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PenLine, 
  History, 
  Settings, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Database,
  BrainCircuit,
  ShieldAlert,
  ChevronDown,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journal', label: 'Journal', icon: PenLine },
    { id: 'insights', label: 'AI Analysis', icon: BrainCircuit },
    { id: 'history', label: 'Archives', icon: History },
    { id: 'architecture', label: 'Technology', icon: Database },
  ];

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark text-slate-100' : 'text-slate-900'}`}>
      {/* Website Header */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass h-20 shadow-xl' : 'h-24 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">E</div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tighter leading-none">Emotional Drift</span>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Wellness Platform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass border-slate-200 dark:border-slate-800 hover:scale-110 transition-all"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`p-2.5 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-slate-900 text-white' : 'glass'}`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2 rounded-xl glass"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`lg:hidden absolute top-full inset-x-0 glass border-t border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen py-6 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
          <div className="flex flex-col px-6 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-xl' 
                    : 'hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold glass"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
              {isDarkMode ? 'Switch to Day' : 'Switch to Night'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Website Content */}
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Website Footer */}
      <footer className="glass border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">E</div>
                <span className="font-black text-lg tracking-tighter">Emotional Drift</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Pioneering behavioral emotional analytics through advanced NLP and interaction signaling.
              </p>
              <div className="flex gap-4 pt-2">
                <Twitter className="w-5 h-5 text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-600">Platform</h4>
              <ul className="space-y-2">
                {['Dashboard', 'Journal', 'Insights', 'Technology'].map((link) => (
                  <li key={link}>
                    <button onClick={() => setActiveTab(link.toLowerCase())} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-600">Security</h4>
              <ul className="space-y-2">
                {['Data Privacy', 'Encryption', 'AI Ethics', 'Safety'].map((link) => (
                  <li key={link} className="text-sm font-bold text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors">{link}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 bg-indigo-50/30 dark:bg-indigo-950/20 p-6 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/20">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4" /> Ethical Disclosure
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                This platform utilizes Gemini Flash AI for sentiment synthesis. It is intended for monitoring and self-reflection, not clinical diagnosis or crisis intervention.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800 gap-4">
            <span className="text-xs font-bold text-slate-400">© 2025 Emotional Drift Monitoring. All rights reserved.</span>
            <div className="flex gap-8">
              <span className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Privacy Policy</span>
              <span className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Terms of Service</span>
              <span className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
