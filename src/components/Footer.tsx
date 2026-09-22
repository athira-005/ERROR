import { Activity, Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-bold text-white">BioMedVerse</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              The AI-powered virtual medical device learning ecosystem for Biomedical Engineering students.
              Learn, interact, troubleshoot, and simulate medical devices without physical equipment.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#/library" className="hover:text-teal-400 transition-colors">Device Library</a></li>
              <li><a href="#/dashboard" className="hover:text-teal-400 transition-colors">Student Dashboard</a></li>
              <li><a href="#/ai-assistant" className="hover:text-teal-400 transition-colors">AI Assistant</a></li>
              <li><a href="#/careers" className="hover:text-teal-400 transition-colors">Career Paths</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>50+ Medical Devices</li>
              <li>Interactive Virtual Labs</li>
              <li>Troubleshooting Simulators</li>
              <li>AI-Powered Tutoring</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2026 BioMedVerse. For educational use in Biomedical Engineering programs.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-teal-400 transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-teal-400 transition-colors"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
