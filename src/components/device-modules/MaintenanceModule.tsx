import { useState } from 'react';
import { Wrench, Gauge, Shield, ClipboardCheck, Settings } from 'lucide-react';
import type { Device } from '../../data/types';

export function MaintenanceModule({ device }: { device: Device }) {
  const [activeTab, setActiveTab] = useState<'calibration' | 'preventive' | 'electrical' | 'daily'>('calibration');
  const m = device.maintenance;

  const tabs = [
    { id: 'calibration' as const, label: 'Calibration', icon: Gauge, items: m.calibration },
    { id: 'preventive' as const, label: 'Preventive Maintenance', icon: Settings, items: m.preventiveMaintenance },
    { id: 'electrical' as const, label: 'Electrical Safety', icon: Shield, items: m.electricalSafety },
    { id: 'daily' as const, label: 'Daily Inspection', icon: ClipboardCheck, items: m.dailyInspection },
  ];

  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Maintenance Module</h2>
      </div>

      <p className="text-slate-600">Learn the complete maintenance procedures for the {device.name}, including calibration, preventive maintenance, electrical safety, and daily inspection.</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Checklist */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          {(() => { const Icon = active.icon; return <Icon className="w-5 h-5 text-amber-600" />; })()}
          <h3 className="font-display text-lg font-bold text-slate-900">{active.label}</h3>
        </div>
        <div className="space-y-3">
          {active.items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-slate-100 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-600 flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
