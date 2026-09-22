import { useState } from 'react';
import { Boxes, Box } from 'lucide-react';
import type { Device } from '../../data/types';
import * as LucideIcons from 'lucide-react';
import { DeviceModel3D } from '../DeviceModel3D';

export function ComponentExplorerModule({ device }: { device: Device }) {
  const [selected, setSelected] = useState(0);
  const [view, setView] = useState<'3d' | 'list'>('3d');
  const components = device.components;

  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Circle;
    return Icon;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
          <Boxes className="w-5 h-5 text-accent-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Component Explorer</h2>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('3d')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            view === '3d' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Box className="w-4 h-4" />
          3D Model View
        </button>
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'list' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Component List
        </button>
      </div>

      {view === '3d' ? (
        <div className="space-y-4">
          <p className="text-slate-600">
            Explore the {device.name} in 3D. Drag to rotate the model, click the glowing hotspots to identify each component,
            or use the exploded view to see internal parts.
          </p>
          <DeviceModel3D device={device} interactive={true} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
          {/* Component list */}
          <div className="space-y-2">
            {components.map((comp, i) => {
              const Icon = getIcon(comp.icon);
              const active = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    active ? 'bg-primary-50 border-2 border-primary-200' : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary-500 text-white' : 'bg-white text-slate-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${active ? 'text-primary-700' : 'text-slate-700'}`}>{comp.name}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{comp.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Component detail */}
          <div className="bg-gradient-to-br from-slate-50 to-primary-50/50 rounded-2xl p-6 border border-slate-100">
            {(() => {
              const comp = components[selected];
              const Icon = getIcon(comp.icon);
              return (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary-600" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900">{comp.name}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Description</div>
                      <p className="text-slate-700">{comp.description}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Function</div>
                      <p className="text-slate-700">{comp.function}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
