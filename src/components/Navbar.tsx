import { Activity, LayoutGrid, GraduationCap, Sparkles, Briefcase, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { navigate } from '../hooks/useRouter';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentHash = window.location.hash.replace(/^#/, '') || '/';

  const navItems = [
    { label: 'Home', path: '/', icon: Activity },
    { label: 'Device Library', path: '/library', icon: LayoutGrid },
    { label: 'Dashboard', path: '/dashboard', icon: GraduationCap },
    { label: 'Careers', path: '/careers', icon: Briefcase },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentHash === '/' || currentHash === '';
    return currentHash.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-display text-lg font-bold text-slate-900">BioMedVerse</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">VIRTUAL BIOMED LAB</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
