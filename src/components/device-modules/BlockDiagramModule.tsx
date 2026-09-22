import { useState } from 'react';
import { Cpu, ChevronRight, X } from 'lucide-react';
import type { Device } from '../../data/types';
import * as LucideIcons from 'lucide-react';

export function BlockDiagramModule({ device }: { device: Device }) {
  const [selected, setSelected] = useState<number | null>(null);
  const blocks = device.blockDiagram;

  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Circle;
    return Icon;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-violet-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Interactive Block Diagram</h2>
      </div>

      <p className="text-slate-600">Click any block to understand its role in the signal flow of the {device.name}.</p>

      {/* Block flow diagram */}
      <div className="flex flex-wrap items-center justify-center gap-2 py-4">
        {blocks.map((block, i) => {
          const Icon = getIcon(block.icon);
          const active = selected === i;
          return (
            <div key={i} className="flex items-center">
              <button
                onClick={() => setSelected(active ? null : i)}
                className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 transition-all min-w-[120px] ${
                  active ? 'border-primary-400 bg-primary-50 shadow-md scale-105' : 'border-slate-200 bg-white hover:border-primary-200 hover:shadow-sm'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className={`text-xs font-semibold text-center ${active ? 'text-primary-700' : 'text-slate-600'}`}>{block.label}</span>
              </button>
              {i < blocks.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300 mx-0.5 hidden md:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected block detail */}
      {selected !== null ? (
        <div className="bg-gradient-to-br from-violet-50 to-primary-50/50 rounded-2xl p-6 border border-violet-100 animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {(() => { const Icon = getIcon(blocks[selected].icon); return <Icon className="w-5 h-5 text-violet-600" />; })()}
              <h3 className="font-display text-lg font-bold text-slate-900">{blocks[selected].label}</h3>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-700 leading-relaxed">{blocks[selected].description}</p>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-sm">
          Select a block above to see its detailed description
        </div>
      )}
    </div>
  );
}
