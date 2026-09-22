import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Device } from '../../data/types';

export function VivaModule({ device }: { device: Device }) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const questions = device.vivaQuestions;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Viva Questions</h2>
      </div>

      <p className="text-slate-600">Oral exam questions and answers for the {device.name}. Click each question to reveal the answer.</p>

      <div className="space-y-3">
        {questions.map((q, i) => {
          const isOpen = expanded === i;
          return (
            <div key={i} className="border-2 border-slate-200 rounded-xl overflow-hidden transition-all">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-indigo-50' : 'bg-white hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    Q{i + 1}
                  </span>
                  <span className="font-medium text-slate-900 text-sm">{q.question}</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
              </button>
              {isOpen && (
                <div className="p-4 bg-white border-t border-slate-100 animate-fade-in">
                  <p className="text-slate-700 leading-relaxed">{q.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
