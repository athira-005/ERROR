import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Wrench, Lightbulb } from 'lucide-react';
import type { Device } from '../../data/types';

export function TroubleshootingModule({ device }: { device: Device }) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const scenarios = device.troubleshooting;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Troubleshooting Simulator</h2>
      </div>

      <p className="text-slate-600">Review realistic fault scenarios for the {device.name}. Study the symptoms, possible causes, and recommended solutions.</p>

      {/* Scenarios */}
      <div className="space-y-3">
        {scenarios.map((scenario, i) => {
          const isOpen = expanded === i;
          return (
            <div key={i} className="border-2 border-slate-200 rounded-xl overflow-hidden transition-all">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                  isOpen ? 'bg-rose-50' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isOpen ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{scenario.scenario}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{scenario.symptom}</div>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="p-4 bg-white border-t border-slate-100 animate-fade-in space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Possible Causes</div>
                    <ul className="space-y-1.5">
                      {scenario.possibleCauses.map((cause, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Wrench className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Solution</span>
                    </div>
                    <p className="text-sm text-slate-700">{scenario.solution}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 bg-primary-50 rounded-xl p-4 border border-primary-100">
        <Lightbulb className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700">
          Ready to practice? Open the <strong>Virtual Laboratory</strong> to inject faults into a live simulation and test your diagnostic skills.
        </p>
      </div>
    </div>
  );
}
