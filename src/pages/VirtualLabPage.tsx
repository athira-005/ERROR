import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, X, FlaskConical, BookOpen, Settings, Bell, Box } from 'lucide-react';
import type { Device, LabControl } from '../data/types';
import { navigate } from '../hooks/useRouter';
import { useProgress } from '../hooks/useProgress';
import { WaveformCanvas, type WaveformParams } from '../components/WaveformCanvas';
import { DeviceModel3D } from '../components/DeviceModel3D';

export function VirtualLabPage({ device }: { device: Device }) {
  const hasWaveform = device.lab.waveformType !== 'none';
  const [mode, setMode] = useState<'guided' | 'free' | 'fault' | 'maintenance'>(hasWaveform ? 'free' : 'guided');
  const [isRunning, setIsRunning] = useState(true);
  const [controlValues, setControlValues] = useState<Record<string, number | string | boolean>>({});
  const [activeFault, setActiveFault] = useState<string | null>(null);
  const [alarmMessage, setAlarmMessage] = useState<string | null>(null);
  const [guidedStep, setGuidedStep] = useState(0);
  const { markModuleComplete, recordAccess } = useProgress();

  useEffect(() => {
    const defaults: Record<string, number | string | boolean> = {};
    device.lab.controls.forEach((c) => {
      defaults[c.key] = c.default;
    });
    setControlValues(defaults);
    recordAccess(device.id, 'lab');
  }, [device.id]);

  useEffect(() => {
    if (activeFault) {
      const fault = device.lab.faults.find((f) => f.id === activeFault);
      if (fault?.alarm) {
        setAlarmMessage(fault.alarm);
      }
    } else {
      setAlarmMessage(null);
    }
  }, [activeFault, device.lab.faults]);

  const updateControl = (key: string, value: number | string | boolean) => {
    setControlValues((prev) => ({ ...prev, [key]: value }));
  };

  const buildWaveformParams = (): WaveformParams => {
    const v = controlValues;
    return {
      type: device.lab.waveformType,
      gain: (v['gain'] as number) || 10,
      hpf: (v['hpf'] as number) || 0.5,
      lpf: (v['lpf'] as number) || 150,
      notch: v['notch'] !== false,
      rhythm: v['rhythm'] as string,
      state: v['state'] as string,
      fault: activeFault || undefined,
      speed: parseFloat((v['speed'] as string) || '25'),
      heartRate: (v['pulse'] as number) || (v['fhr'] as number) || 72,
      respRate: (v['resp'] as number) || 14,
      spo2: (v['spo2'] as number) || 98,
      contraction: (v['contraction'] as number) || 30,
      etco2: (v['etco2'] as number) || 38,
    };
  };

  const handleCompleteLab = () => {
    markModuleComplete(device.id, 'lab');
  };

  const renderControl = (control: LabControl) => {
    const value = controlValues[control.key];
    if (value === undefined) return null;

    if (control.type === 'slider') {
      return (
        <div key={control.key} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">{control.label}</label>
            <span className="text-sm font-mono text-primary-600">
              {value}{control.unit && ` ${control.unit}`}
            </span>
          </div>
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={value as number}
            onChange={(e) => updateControl(control.key, parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-500"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{control.min}{control.unit}</span>
            <span>{control.max}{control.unit}</span>
          </div>
        </div>
      );
    }

    if (control.type === 'select') {
      return (
        <div key={control.key} className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{control.label}</label>
          <select
            value={value as string}
            onChange={(e) => updateControl(control.key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            {control.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (control.type === 'toggle') {
      return (
        <div key={control.key} className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">{control.label}</label>
          <button
            onClick={() => updateControl(control.key, !value)}
            className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-primary-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      );
    }

    return null;
  };

  const modes = hasWaveform
    ? [
        { id: 'guided' as const, label: 'Guided Operation', icon: BookOpen },
        { id: 'free' as const, label: 'Free Exploration', icon: Settings },
        { id: 'fault' as const, label: 'Fault Injection', icon: AlertTriangle },
        { id: 'maintenance' as const, label: 'Maintenance Practice', icon: FlaskConical },
      ]
    : [
        { id: 'guided' as const, label: 'Guided Operation', icon: BookOpen },
        { id: 'maintenance' as const, label: 'Maintenance Practice', icon: FlaskConical },
      ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button onClick={() => navigate(`/device/${device.id}`)} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to {device.name}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center shadow-lg">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">{device.name} Virtual Lab</h1>
            <p className="text-slate-600">
              {hasWaveform
                ? 'Interactive 3D model with live waveform simulation, controls, and fault injection'
                : 'Interactive 3D model exploration with guided operation and maintenance training'}
            </p>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); if (m.id !== 'fault') setActiveFault(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {m.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main lab area */}
          <div className="space-y-4">
            {/* Alarm banner */}
            {alarmMessage && (
              <div className="flex items-center gap-3 bg-rose-50 border-2 border-rose-200 rounded-xl p-4 animate-fade-in">
                <div className="w-10 h-10 rounded-lg bg-rose-500 flex items-center justify-center animate-pulse">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-rose-700">ALARM: {alarmMessage}</div>
                  <div className="text-sm text-rose-600">Check the device and resolve the fault</div>
                </div>
                <button onClick={() => { setActiveFault(null); setAlarmMessage(null); }} className="ml-auto text-rose-400 hover:text-rose-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* 3D Model — shown for ALL devices */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Box className="w-4 h-4 text-primary-500" />
                  3D Device Model
                </h3>
                <span className="text-xs text-slate-400">Interactive — drag to rotate, click parts to explore</span>
              </div>
              <DeviceModel3D device={device} interactive={true} />
            </div>

            {/* Waveform display — only for simulation-capable devices */}
            {hasWaveform && (
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    Live Waveform Simulation
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      {isRunning ? <Pause className="w-4 h-4 text-slate-600" /> : <Play className="w-4 h-4 text-slate-600" />}
                    </button>
                    <button
                      onClick={() => { setControlValues({}); setActiveFault(null); setTimeout(() => { const d: Record<string, any> = {}; device.lab.controls.forEach((c) => d[c.key] = c.default); setControlValues(d); }, 50); }}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 overflow-hidden">
                  {isRunning && <WaveformCanvas params={buildWaveformParams()} width={560} height={220} />}
                  {!isRunning && (
                    <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
                      Simulation paused — press play to resume
                    </div>
                  )}
                </div>
                {/* Vital signs readout */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {controlValues['pulse'] !== undefined && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500">Heart Rate</div>
                      <div className="font-mono text-lg font-bold text-primary-600">{controlValues['pulse']} bpm</div>
                    </div>
                  )}
                  {controlValues['spo2'] !== undefined && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500">SpO2</div>
                      <div className="font-mono text-lg font-bold text-teal-600">{controlValues['spo2']}%</div>
                    </div>
                  )}
                  {controlValues['resp'] !== undefined && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500">Resp Rate</div>
                      <div className="font-mono text-lg font-bold text-accent-600">{controlValues['resp']}/min</div>
                    </div>
                  )}
                  {controlValues['etco2'] !== undefined && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500">EtCO2</div>
                      <div className="font-mono text-lg font-bold text-violet-600">{controlValues['etco2']} mmHg</div>
                    </div>
                  )}
                  {controlValues['fhr'] !== undefined && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500">FHR</div>
                      <div className="font-mono text-lg font-bold text-blue-600">{controlValues['fhr']} bpm</div>
                    </div>
                  )}
                  {controlValues['sys'] !== undefined && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500">BP</div>
                      <div className="font-mono text-lg font-bold text-rose-600">{controlValues['sys']}/{controlValues['dia']}</div>
                    </div>
                  )}
                  {controlValues['temp'] !== undefined && (
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500">Temp</div>
                      <div className="font-mono text-lg font-bold text-amber-600">{controlValues['temp']}°C</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Non-waveform info card */}
            {!hasWaveform && (
              <div className="card p-5 bg-gradient-to-br from-primary-50 to-teal-50 border-primary-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">3D Model Exploration Mode</h3>
                    <p className="text-sm text-slate-600">
                      This device does not produce a live physiological waveform, so the virtual lab focuses on 3D model
                      exploration, guided operation steps, and maintenance training. Use the 3D model above to click
                      through internal components, then follow the guided steps to learn the operating procedure.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Guided mode steps */}
            {mode === 'guided' && (
              <div className="card p-6">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Guided Operation ({guidedStep + 1}/{device.lab.guidedSteps.length})</h3>
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {guidedStep + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{device.lab.guidedSteps[guidedStep].title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{device.lab.guidedSteps[guidedStep].description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setGuidedStep(Math.max(0, guidedStep - 1))}
                    disabled={guidedStep === 0}
                    className="text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-primary-600"
                  >
                    ← Previous step
                  </button>
                  {guidedStep < device.lab.guidedSteps.length - 1 ? (
                    <button
                      onClick={() => setGuidedStep(guidedStep + 1)}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Next step →
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteLab}
                      className="flex items-center gap-2 bg-teal-500 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete Lab
                    </button>
                  )}
                </div>
                <div className="flex justify-center gap-1.5 mt-4">
                  {device.lab.guidedSteps.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === guidedStep ? 'bg-primary-500 w-6' : i < guidedStep ? 'bg-teal-400' : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Fault injection mode — only for waveform devices */}
            {mode === 'fault' && hasWaveform && (
              <div className="card p-6">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Fault Injection & Troubleshooting</h3>
                <p className="text-sm text-slate-600 mb-4">Inject a fault into the simulation and practice diagnosing it. The alarm will trigger — can you identify the cause?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {device.lab.faults.map((fault) => {
                    const active = activeFault === fault.id;
                    return (
                      <button
                        key={fault.id}
                        onClick={() => setActiveFault(active ? null : fault.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          active ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white hover:border-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className={`w-4 h-4 ${active ? 'text-rose-500' : 'text-slate-400'}`} />
                          <span className="font-semibold text-sm text-slate-900">{fault.label}</span>
                        </div>
                        <p className="text-xs text-slate-500">{fault.description}</p>
                        {active && fault.alarm && (
                          <div className="mt-2 text-xs font-mono text-rose-600 bg-rose-100 px-2 py-1 rounded">
                            ALARM: {fault.alarm}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {activeFault && (
                  <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-sm text-slate-700">
                      <strong>Diagnosis exercise:</strong> Observe the waveform changes. What fault do you think is causing this? Check the Troubleshooting module for possible causes and solutions.
                    </p>
                    <button
                      onClick={() => { setActiveFault(null); setAlarmMessage(null); }}
                      className="mt-3 flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve fault
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Maintenance mode */}
            {mode === 'maintenance' && (
              <div className="card p-6 space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900">Maintenance Practice</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 mb-2">Daily Inspection Checklist</h4>
                    {device.maintenance.dailyInspection.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg mb-1">
                        <CheckCircle className="w-4 h-4 text-slate-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 mb-2">Safety Warnings & Best Practices</h4>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <ul className="space-y-2">
                        <li className="text-sm text-slate-700">Always power off the device before connecting or disconnecting sensors</li>
                        <li className="text-sm text-slate-700">Verify electrical safety before patient connection</li>
                        <li className="text-sm text-slate-700">Follow manufacturer calibration schedule</li>
                        <li className="text-sm text-slate-700">Document all maintenance activities in the device log</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCompleteLab}
                  className="flex items-center gap-2 bg-teal-500 text-white text-sm font-medium py-2.5 px-5 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Maintenance Training
                </button>
              </div>
            )}
          </div>

          {/* Control panel — only for waveform devices */}
          {hasWaveform ? (
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="card p-5">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary-500" />
                  Controls
                </h3>
                <div className="space-y-4">
                  {device.lab.controls.map((control) => renderControl(control))}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="card p-5">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  Lab Information
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="font-semibold text-slate-800 mb-1">3D Model Exploration</div>
                    <p>Drag the 3D model to rotate it from any angle. Click on the glowing hotspots to learn about each component.</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="font-semibold text-slate-800 mb-1">Exploded View</div>
                    <p>Use the expand icon in the 3D viewer to separate internal components for detailed inspection.</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="font-semibold text-slate-800 mb-1">Guided Operation</div>
                    <p>Follow step-by-step instructions to learn the correct operating procedure for this device.</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="font-semibold text-slate-800 mb-1">Maintenance Training</div>
                    <p>Review daily inspection checklists and safety best practices specific to this device.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
