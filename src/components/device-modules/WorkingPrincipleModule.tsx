import { useState } from 'react';
import { Workflow, ChevronRight, CheckCircle } from 'lucide-react';
import type { Device } from '../../data/types';
import * as LucideIcons from 'lucide-react';

export function WorkingPrincipleModule({ device }: { device: Device }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = device.workingPrinciple;

  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Circle;
    return Icon;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
          <Workflow className="w-5 h-5 text-teal-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Interactive Working Principle</h2>
      </div>

      <p className="text-slate-600">Click each step to explore how {device.name} works, from signal generation to output display.</p>

      {/* Step flow */}
      <div className="flex flex-wrap gap-2 mb-6">
        {steps.map((step, i) => {
          const Icon = getIcon(step.icon);
          const active = activeStep === i;
          return (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-primary-600 text-white shadow-md' : i < activeStep ? 'bg-teal-50 text-teal-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${active ? 'bg-white/20' : i < activeStep ? 'bg-teal-100' : 'bg-slate-200'}`}>
                  {i < activeStep ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.title}</span>
              </button>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />}
            </div>
          );
        })}
      </div>

      {/* Active step detail */}
      <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl p-6 border border-primary-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
            {(() => { const Icon = getIcon(steps[activeStep].icon); return <Icon className="w-6 h-6 text-primary-600" />; })()}
          </div>
          <div>
            <div className="text-xs text-primary-500 font-medium">Step {activeStep + 1} of {steps.length}</div>
            <h3 className="font-display text-lg font-bold text-slate-900">{steps[activeStep].title}</h3>
          </div>
        </div>
        <p className="text-slate-700 leading-relaxed">{steps[activeStep].description}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-primary-600 transition-colors"
        >
          ← Previous
        </button>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === activeStep ? 'bg-primary-500 w-6' : i < activeStep ? 'bg-teal-300' : 'bg-slate-200'}`} />
          ))}
        </div>
        <button
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          className="text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-primary-600 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
