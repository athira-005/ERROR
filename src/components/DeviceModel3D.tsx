import { useState, useRef, useEffect } from 'react';
import { RotateCw, MousePointerClick, X, Eye, Maximize2 } from 'lucide-react';
import type { Device } from '../data/types';
import * as LucideIcons from 'lucide-react';

type DeviceShape = 'monitor' | 'pump' | 'scanner' | 'handheld' | 'table' | 'box' | 'wearable' | 'tube';

function getDeviceShape(device: Device): DeviceShape {
  const id = device.id;
  if (['ecg-machine', 'eeg-machine', 'multiparameter-monitor', 'holter-monitor', 'defibrillator', 'anesthesia-machine'].includes(id)) return 'monitor';
  if (['infusion-pump', 'syringe-pump', 'dialysis-machine', 'cpap-machine', 'bipap-machine', 'ventilator', 'neonatal-ventilator', 'surgical-suction-machine'].includes(id)) return 'pump';
  if (['x-ray-machine', 'ct-scanner', 'mri-scanner', 'ultrasound', 'pet-scanner', 'mammography', 'fluoroscopy', 'c-arm', 'dental-xray', 'fundus-camera', 'oct-scanner', 'slit-lamp', 'autorefractometer'].includes(id)) return 'scanner';
  if (['pulse-oximeter', 'bp-monitor', 'capnograph', 'fetal-monitor', 'tens-unit', 'emg-machine'].includes(id)) return 'handheld';
  if (['operating-table', 'dental-chair-unit', 'infant-incubator', 'wheelchair-technologies', 'exoskeleton'].includes(id)) return 'table';
  if (['pacemaker', 'prosthetic-devices', 'functional-electrical-stimulation-system'].includes(id)) return 'wearable';
  if (['surgical-lights', 'laser-therapy-device', 'ultrasound-therapy-unit', 'radiofrequency-ablation-system', 'electrocautery-unit', 'electrosurgical-unit', 'ultrasonic-scaler'].includes(id)) return 'tube';
  return 'box';
}

export function DeviceModel3D({ device, interactive = true }: { device: Device; interactive?: boolean }) {
  const [rotation, setRotation] = useState({ x: -15, y: 20 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [exploded, setExploded] = useState(false);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const shape = getDeviceShape(device);

  useEffect(() => {
    if (!autoRotate || !interactive) return;
    const interval = setInterval(() => setRotation((prev) => ({ ...prev, y: prev.y + 0.5 })), 50);
    return () => clearInterval(interval);
  }, [autoRotate, interactive]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setAutoRotate(false);
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current || !interactive) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setRotation((prev) => ({ x: Math.max(-60, Math.min(60, prev.x - dy * 0.5)), y: prev.y + dx * 0.5 }));
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => { dragRef.current = null; };

  const getIcon = (name: string) => (LucideIcons as any)[name] || LucideIcons.Circle;
  const transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
  const ex = exploded ? 35 : 0;
  const fb = 'absolute flex items-center justify-center';

  const hotspots = device.components.slice(0, 4).map((comp, i) => ({
    label: comp.name,
    index: i,
  }));

  return (
    <div className="space-y-4">
      <div
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ minHeight: '380px', perspective: '1200px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid floor */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(45,212,191,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px', transform: 'rotateX(60deg) translateY(50%)', transformOrigin: 'bottom',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

        {/* 3D Model */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          <div style={{ transform, transformStyle: 'preserve-3d', transition: dragRef.current ? 'none' : 'transform 0.1s ease-out' }}>
            {/* Shape renderer */}
            {shape === 'monitor' && (
              <div className="relative" style={{ width: '220px', height: '180px', transformStyle: 'preserve-3d' }}>
                <div className={`${fb} bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 rounded-lg`} style={{ width: '200px', height: '130px', transform: `translateZ(${50 + ex}px)`, boxShadow: '0 0 30px rgba(45,212,191,0.15)' }}>
                  <div className="w-[170px] h-[100px] bg-slate-950 rounded-md flex items-center justify-center overflow-hidden relative">
                    <svg viewBox="0 0 170 60" className="w-full h-full">
                      <polyline points="0,30 20,30 25,28 30,30 35,10 40,50 45,30 60,30 65,28 70,30 75,15 80,45 85,30 100,30 105,28 110,30 115,12 120,48 125,30 140,30 145,28 150,30 155,18 160,42 165,30 170,30" fill="none" stroke="#2dd4bf" strokeWidth="1.5" className="animate-pulse" />
                    </svg>
                    <div className="absolute top-1 left-2 text-[8px] text-teal-400 font-mono">HR 72</div>
                    <div className="absolute top-1 right-2 text-[8px] text-cyan-400 font-mono">SpO2 98%</div>
                  </div>
                </div>
                <div className={`${fb} bg-slate-800 border border-slate-700 rounded-lg`} style={{ width: '200px', height: '130px', transform: `translateZ(${-50 - ex}px) rotateY(180deg)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600`} style={{ width: '200px', height: '100px', transform: `rotateX(90deg) translateZ(50px) translateY(-50px)` }} />
                <div className={`${fb} bg-slate-800 border border-slate-700`} style={{ width: '200px', height: '100px', transform: `rotateX(-90deg) translateZ(80px) translateY(50px)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600`} style={{ width: '100px', height: '130px', transform: `rotateY(-90deg) translateZ(100px) translateX(-50px)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600`} style={{ width: '100px', height: '130px', transform: `rotateY(90deg) translateZ(100px) translateX(50px)` }} />
                <div className="absolute left-1/2 -translate-x-1/2 bg-slate-600 rounded" style={{ bottom: '-30px', width: '12px', height: '30px' }} />
                <div className="absolute left-1/2 -translate-x-1/2 bg-slate-700 rounded-lg" style={{ bottom: '-38px', width: '80px', height: '8px' }} />
              </div>
            )}

            {shape === 'pump' && (
              <div className="relative" style={{ width: '160px', height: '260px', transformStyle: 'preserve-3d' }}>
                <div className={`${fb} bg-gradient-to-b from-slate-600 to-slate-800 border border-slate-500 rounded-xl`} style={{ width: '130px', height: '220px', transform: `translateZ(${40 + ex}px)`, boxShadow: '0 0 25px rgba(45,212,191,0.1)' }}>
                  <div className="flex flex-col items-center gap-1.5 py-3">
                    <div className="w-[90px] h-[40px] bg-slate-950 rounded-md flex items-center justify-center"><span className="text-[10px] text-teal-400 font-mono">120/80</span></div>
                    <div className="flex gap-1.5 mt-1"><div className="w-5 h-5 rounded-full bg-primary-500" /><div className="w-5 h-5 rounded-full bg-rose-500" /><div className="w-5 h-5 rounded-full bg-slate-500" /></div>
                    <div className="w-[80px] h-[50px] bg-slate-700 rounded-md mt-1 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-teal-400 border-t-transparent animate-spin-slow" /></div>
                  </div>
                </div>
                <div className={`${fb} bg-slate-800 border border-slate-700 rounded-xl`} style={{ width: '130px', height: '220px', transform: `translateZ(${-40 - ex}px) rotateY(180deg)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500 rounded-lg`} style={{ width: '130px', height: '80px', transform: `rotateX(90deg) translateZ(40px) translateY(-40px)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600 rounded-lg`} style={{ width: '130px', height: '80px', transform: `rotateX(-90deg) translateZ(180px) translateY(40px)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500`} style={{ width: '80px', height: '220px', transform: `rotateY(-90deg) translateZ(65px) translateX(-40px)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500`} style={{ width: '80px', height: '220px', transform: `rotateY(90deg) translateZ(65px) translateX(40px)` }} />
                <div className="absolute left-1/2 -translate-x-1/2 bg-slate-500 rounded-full" style={{ top: '-40px', width: '6px', height: '40px' }} />
                <div className="absolute left-1/2 -translate-x-1/2 bg-slate-600 rounded-full" style={{ top: '-46px', width: '40px', height: '6px' }} />
              </div>
            )}

            {shape === 'scanner' && (
              <div className="relative" style={{ width: '260px', height: '220px', transformStyle: 'preserve-3d' }}>
                <div className={`${fb} bg-gradient-to-br from-slate-600 to-slate-800 border border-slate-500 rounded-full`} style={{ width: '180px', height: '180px', transform: `translateZ(${30 + ex}px)`, boxShadow: '0 0 40px rgba(45,212,191,0.15)' }}>
                  <div className="w-[140px] h-[140px] rounded-full bg-slate-950 flex items-center justify-center"><div className="w-[100px] h-[100px] rounded-full border-4 border-teal-500/30 border-t-teal-400 animate-spin-slow" /></div>
                </div>
                <div className={`${fb} bg-slate-800 border border-slate-700 rounded-full`} style={{ width: '180px', height: '180px', transform: `translateZ(${-30 - ex}px) rotateY(180deg)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500 rounded-full`} style={{ width: '180px', height: '60px', transform: `rotateX(90deg) translateZ(30px) translateY(-30px)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600 rounded-full`} style={{ width: '180px', height: '60px', transform: `rotateX(-90deg) translateZ(150px) translateY(30px)` }} />
                <div className={`${fb} bg-slate-500 border border-slate-400 rounded-lg`} style={{ width: '80px', height: '200px', transform: `translateX(90px)` }}>
                  <div className="w-full h-3 bg-slate-400 rounded-t-lg" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bg-slate-700 rounded-lg" style={{ bottom: '-20px', width: '140px', height: '12px' }} />
              </div>
            )}

            {shape === 'handheld' && (
              <div className="relative" style={{ width: '120px', height: '200px', transformStyle: 'preserve-3d' }}>
                <div className={`${fb} bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-600 rounded-2xl`} style={{ width: '100px', height: '160px', transform: `translateZ(${30 + ex}px)`, boxShadow: '0 0 25px rgba(45,212,191,0.12)' }}>
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="w-[70px] h-[50px] bg-slate-950 rounded-md flex flex-col items-center justify-center"><span className="text-[14px] text-teal-400 font-mono font-bold">98%</span><span className="text-[8px] text-cyan-400 font-mono">72 bpm</span></div>
                    <svg viewBox="0 0 70 20" className="w-[70px] h-5"><polyline points="0,10 15,10 18,8 20,12 23,2 26,18 29,10 45,10 48,8 50,12 53,4 56,16 59,10 70,10" fill="none" stroke="#2dd4bf" strokeWidth="1" /></svg>
                    <div className="w-6 h-6 rounded-full bg-primary-500 mt-1" />
                  </div>
                </div>
                <div className={`${fb} bg-slate-800 border border-slate-700 rounded-2xl`} style={{ width: '100px', height: '160px', transform: `translateZ(${-30 - ex}px) rotateY(180deg)` }}>
                  <div className="w-12 h-12 rounded-full bg-rose-500/30 border-2 border-rose-400/50" />
                </div>
                <div className={`${fb} bg-slate-600 border border-slate-500 rounded-lg`} style={{ width: '100px', height: '60px', transform: `rotateX(90deg) translateZ(30px) translateY(-30px)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600 rounded-lg`} style={{ width: '100px', height: '60px', transform: `rotateX(-90deg) translateZ(130px) translateY(30px)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500`} style={{ width: '60px', height: '160px', transform: `rotateY(-90deg) translateZ(50px) translateX(-30px)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500`} style={{ width: '60px', height: '160px', transform: `rotateY(90deg) translateZ(50px) translateX(30px)` }} />
                <div className="absolute left-1/2 -translate-x-1/2 bg-slate-500 rounded-b-lg" style={{ bottom: '-25px', width: '60px', height: '25px' }} />
              </div>
            )}

            {shape === 'table' && (
              <div className="relative" style={{ width: '260px', height: '160px', transformStyle: 'preserve-3d' }}>
                <div className={`${fb} bg-gradient-to-br from-slate-500 to-slate-700 border border-slate-400 rounded-xl`} style={{ width: '220px', height: '80px', transform: `translateZ(${30 + ex}px)`, boxShadow: '0 0 25px rgba(45,212,191,0.1)' }}>
                  <div className="w-[160px] h-[40px] bg-slate-400/30 rounded-lg border border-slate-400/50" />
                </div>
                <div className={`${fb} bg-slate-800 border border-slate-700 rounded-xl`} style={{ width: '220px', height: '80px', transform: `translateZ(${-30 - ex}px) rotateY(180deg)` }} />
                <div className={`${fb} bg-slate-500 border border-slate-400 rounded-lg`} style={{ width: '220px', height: '60px', transform: `rotateX(90deg) translateZ(30px) translateY(-30px)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600 rounded-lg`} style={{ width: '220px', height: '60px', transform: `rotateX(-90deg) translateZ(50px) translateY(30px)` }} />
                <div className={`${fb} bg-slate-500 border border-slate-400`} style={{ width: '60px', height: '80px', transform: `rotateY(-90deg) translateZ(110px) translateX(-30px)` }} />
                <div className={`${fb} bg-slate-500 border border-slate-400`} style={{ width: '60px', height: '80px', transform: `rotateY(90deg) translateZ(110px) translateX(30px)` }} />
                <div className="absolute left-6 bottom-0 w-3 h-16 bg-slate-600 rounded" />
                <div className="absolute right-6 bottom-0 w-3 h-16 bg-slate-600 rounded" />
                <div className="absolute bg-slate-700 rounded-lg border border-slate-500" style={{ top: '-15px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '20px' }}>
                  <div className="flex items-center justify-center gap-1 h-full"><div className="w-2 h-2 rounded-full bg-teal-400" /><div className="w-2 h-2 rounded-full bg-amber-400" /><div className="w-2 h-2 rounded-full bg-rose-400" /></div>
                </div>
              </div>
            )}

            {shape === 'wearable' && (
              <div className="relative" style={{ width: '140px', height: '140px', transformStyle: 'preserve-3d' }}>
                <div className={`${fb} bg-gradient-to-br from-slate-600 to-slate-800 border border-slate-500 rounded-full`} style={{ width: '100px', height: '100px', transform: `translateZ(${25 + ex}px)`, boxShadow: '0 0 30px rgba(45,212,191,0.2)' }}>
                  <div className="w-[70px] h-[70px] rounded-full bg-slate-950 flex items-center justify-center"><div className="w-[40px] h-[40px] rounded-full border-2 border-teal-400 border-t-transparent animate-spin-slow" /></div>
                </div>
                <div className={`${fb} bg-slate-800 border border-slate-700 rounded-full`} style={{ width: '100px', height: '100px', transform: `translateZ(${-25 - ex}px) rotateY(180deg)` }}>
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-400/40" />
                </div>
                <div className={`${fb} bg-slate-600 border border-slate-500 rounded-full`} style={{ width: '100px', height: '50px', transform: `rotateX(90deg) translateZ(25px) translateY(-25px)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600 rounded-full`} style={{ width: '100px', height: '50px', transform: `rotateX(-90deg) translateZ(75px) translateY(25px)` }} />
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-8 h-20 bg-slate-600 rounded-t-lg" style={{ transform: 'translateY(-15px)' }} />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-20 bg-slate-600 rounded-b-lg" style={{ transform: 'translateY(15px)' }} />
              </div>
            )}

            {shape === 'tube' && (
              <div className="relative" style={{ width: '120px', height: '240px', transformStyle: 'preserve-3d' }}>
                <div className={`${fb} bg-gradient-to-b from-slate-600 to-slate-800 border border-slate-500 rounded-2xl`} style={{ width: '80px', height: '200px', transform: `translateZ(${25 + ex}px)`, boxShadow: '0 0 25px rgba(45,212,191,0.12)' }}>
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center"><div className="w-5 h-5 rounded-full bg-teal-400 animate-pulse" /></div>
                    <div className="w-12 h-1 bg-slate-500 rounded-full" /><div className="w-10 h-1 bg-slate-500 rounded-full" />
                    <div className="flex gap-1 mt-1"><div className="w-4 h-4 rounded bg-primary-500" /><div className="w-4 h-4 rounded bg-rose-500" /></div>
                  </div>
                </div>
                <div className={`${fb} bg-slate-800 border border-slate-700 rounded-2xl`} style={{ width: '80px', height: '200px', transform: `translateZ(${-25 - ex}px) rotateY(180deg)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500 rounded-lg`} style={{ width: '80px', height: '50px', transform: `rotateX(90deg) translateZ(25px) translateY(-25px)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600 rounded-lg`} style={{ width: '80px', height: '50px', transform: `rotateX(-90deg) translateZ(175px) translateY(25px)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500`} style={{ width: '50px', height: '200px', transform: `rotateY(-90deg) translateZ(40px) translateX(-25px)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500`} style={{ width: '50px', height: '200px', transform: `rotateY(90deg) translateZ(40px) translateX(25px)` }} />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3 h-20 bg-slate-600 rounded-b-full" />
              </div>
            )}

            {shape === 'box' && (
              <div className="relative" style={{ width: '180px', height: '180px', transformStyle: 'preserve-3d' }}>
                <div className={`${fb} bg-gradient-to-br from-slate-600 to-slate-800 border border-slate-500 rounded-xl`} style={{ width: '150px', height: '150px', transform: `translateZ(${40 + ex}px)`, boxShadow: '0 0 25px rgba(45,212,191,0.1)' }}>
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="w-[100px] h-[40px] bg-slate-950 rounded-md flex items-center justify-center"><span className="text-[10px] text-teal-400 font-mono">READY</span></div>
                    <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" /><div className="w-3 h-3 rounded-full bg-slate-600" /><div className="w-3 h-3 rounded-full bg-slate-600" /></div>
                    <div className="w-[80px] h-[40px] bg-slate-700 rounded-md flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-teal-400 border-t-transparent animate-spin-slow" /></div>
                  </div>
                </div>
                <div className={`${fb} bg-slate-800 border border-slate-700 rounded-xl`} style={{ width: '150px', height: '150px', transform: `translateZ(${-40 - ex}px) rotateY(180deg)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500 rounded-lg`} style={{ width: '150px', height: '80px', transform: `rotateX(90deg) translateZ(40px) translateY(-40px)` }} />
                <div className={`${fb} bg-slate-700 border border-slate-600 rounded-lg`} style={{ width: '150px', height: '80px', transform: `rotateX(-90deg) translateZ(110px) translateY(40px)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500`} style={{ width: '80px', height: '150px', transform: `rotateY(-90deg) translateZ(75px) translateX(-40px)` }} />
                <div className={`${fb} bg-slate-600 border border-slate-500`} style={{ width: '80px', height: '150px', transform: `rotateY(90deg) translateZ(75px) translateX(40px)` }} />
              </div>
            )}

            {/* Hotspots */}
            {interactive && hotspots.map((h, i) => {
              const positions = [
                { top: '15%', left: '50%' },
                { top: '45%', left: '50%' },
                { top: '75%', left: '50%' },
                { top: '45%', left: '85%' },
              ];
              return (
                <div key={i} className="absolute z-20" style={positions[i]} onClick={(e) => { e.stopPropagation(); setSelectedComponent(selectedComponent === i ? null : i); }}>
                  <div className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                    <div className={`w-3 h-3 rounded-full transition-all ${selectedComponent === i ? 'bg-teal-400 scale-150 ring-4 ring-teal-400/30' : 'bg-primary-400 hover:bg-teal-400 hover:scale-125'} animate-pulse`} />
                    {showLabels && (
                      <div className={`absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs px-2 py-0.5 rounded transition-opacity ${selectedComponent === i ? 'bg-teal-500 text-white opacity-100' : 'bg-black/60 text-teal-300 opacity-70'}`}>{h.label}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls overlay */}
        {interactive && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button onClick={(e) => { e.stopPropagation(); setAutoRotate(!autoRotate); }} className={`p-2 rounded-lg backdrop-blur transition-colors ${autoRotate ? 'bg-teal-500/30 text-teal-300' : 'bg-white/10 text-slate-400'}`} title="Toggle auto-rotation"><RotateCw className="w-4 h-4" /></button>
            <button onClick={(e) => { e.stopPropagation(); setShowLabels(!showLabels); }} className={`p-2 rounded-lg backdrop-blur transition-colors ${showLabels ? 'bg-teal-500/30 text-teal-300' : 'bg-white/10 text-slate-400'}`} title="Toggle labels"><Eye className="w-4 h-4" /></button>
            <button onClick={(e) => { e.stopPropagation(); setExploded(!exploded); }} className={`p-2 rounded-lg backdrop-blur transition-colors ${exploded ? 'bg-teal-500/30 text-teal-300' : 'bg-white/10 text-slate-400'}`} title="Exploded view"><Maximize2 className="w-4 h-4" /></button>
          </div>
        )}

        {/* Info badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-slate-400 bg-black/40 backdrop-blur px-3 py-1.5 rounded-lg">
          <MousePointerClick className="w-3.5 h-3.5" /> Drag to rotate • Click parts to explore
        </div>
        {/* Device name badge */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur px-3 py-1.5 rounded-lg">
          <span className="text-xs font-display font-semibold text-teal-300">{device.name}</span>
        </div>
      </div>

      {/* Selected component detail */}
      {selectedComponent !== null && interactive && (
        <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-xl p-4 border border-primary-100 animate-fade-in">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {(() => { const Icon = getIcon(device.components[selectedComponent].icon); return <Icon className="w-5 h-5 text-primary-600" />; })()}
              <h4 className="font-display font-bold text-slate-900">{device.components[selectedComponent].name}</h4>
            </div>
            <button onClick={() => setSelectedComponent(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-slate-700">{device.components[selectedComponent].description}</p>
          <div className="mt-2 text-xs text-slate-500"><span className="font-semibold">Function:</span> {device.components[selectedComponent].function}</div>
        </div>
      )}

      {/* Component legend */}
      {interactive && (
        <div className="flex flex-wrap gap-2">
          {device.components.slice(0, 6).map((comp, i) => {
            const Icon = getIcon(comp.icon);
            const active = selectedComponent === i;
            return (
              <button key={i} onClick={() => setSelectedComponent(active ? null : i)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'}`}>
                <Icon className="w-3.5 h-3.5" />{comp.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
