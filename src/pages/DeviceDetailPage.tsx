import { useState } from 'react';
import { ArrowLeft, Star, BookOpen, Cpu, Workflow, Boxes, Wrench, AlertTriangle, HelpCircle, FileQuestion, Sparkles, FlaskConical, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import type { Device } from '../data/types';
import { categories } from '../data/categories';
import { navigate } from '../hooks/useRouter';
import { useProgress } from '../hooks/useProgress';
import { IntroductionModule } from '../components/device-modules/IntroductionModule';
import { WorkingPrincipleModule } from '../components/device-modules/WorkingPrincipleModule';
import { ComponentExplorerModule } from '../components/device-modules/ComponentExplorerModule';
import { BlockDiagramModule } from '../components/device-modules/BlockDiagramModule';
import { MaintenanceModule } from '../components/device-modules/MaintenanceModule';
import { TroubleshootingModule } from '../components/device-modules/TroubleshootingModule';
import { VivaModule } from '../components/device-modules/VivaModule';
import { QuizModule } from '../components/device-modules/QuizModule';
import { AIAssistantModule } from '../components/device-modules/AIAssistantModule';

type ModuleId = 'intro' | 'working-principle' | 'components' | 'block-diagram' | 'maintenance' | 'troubleshooting' | 'viva' | 'quiz' | 'ai';

const moduleList: { id: ModuleId; label: string; icon: any }[] = [
  { id: 'intro', label: 'Introduction', icon: BookOpen },
  { id: 'working-principle', label: 'Working Principle', icon: Workflow },
  { id: 'components', label: 'Component Explorer', icon: Boxes },
  { id: 'block-diagram', label: 'Block Diagram', icon: Cpu },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
  { id: 'viva', label: 'Viva Questions', icon: HelpCircle },
  { id: 'quiz', label: 'MCQ Quiz', icon: FileQuestion },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
];

export function DeviceDetailPage({ device }: { device: Device }) {
  const [activeModule, setActiveModule] = useState<ModuleId>('intro');
  const { isModuleComplete, markModuleComplete, toggleFavorite, favorites, recordAccess, getDeviceProgress } = useProgress();
  const cat = categories.find((c) => c.id === device.categoryId);
  const isFav = favorites.includes(device.id);
  const progress = getDeviceProgress(device.id);

  const handleModuleChange = (id: ModuleId) => {
    setActiveModule(id);
    recordAccess(device.id, id);
  };

  const handleComplete = () => {
    markModuleComplete(device.id, activeModule);
  };

  const isComplete = isModuleComplete(device.id, activeModule);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button onClick={() => navigate('/library')} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        {/* Device Header */}
        <div className="card p-6 mb-6 overflow-hidden relative">
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat?.color}`} />
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cat?.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
              <span className="text-white text-3xl font-bold">{device.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-primary-500 font-medium mb-1">{cat?.name}</div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-1">{device.name}</h1>
                  <p className="text-slate-600">{device.tagline}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(device.id)}
                  className={`p-2.5 rounded-xl border transition-all ${isFav ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 hover:border-amber-200'}`}
                >
                  <Star className={`w-5 h-5 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                  device.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  device.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>{device.difficulty}</span>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-teal-400 transition-all" style={{ width: `${progress.percentage}%` }} />
                  </div>
                  <span>{progress.completed}/{progress.total} modules</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Lab Banner */}
        <button
          onClick={() => navigate(`/lab/${device.id}`)}
          className="w-full mb-6 group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-teal-500 to-accent-500 p-5 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-lg">Open Virtual Laboratory</div>
                <div className="text-sm text-white/80">Interactive simulation with live controls and fault injection</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Module Navigation + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Module sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="card p-3">
              <div className="space-y-1">
                {moduleList.map((mod) => {
                  const Icon = mod.icon;
                  const complete = isModuleComplete(device.id, mod.id);
                  const active = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => handleModuleChange(mod.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {complete ? <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />}
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-left">{mod.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Module content */}
          <div className="min-h-[500px]">
            <div className="card p-6 md:p-8">
              {activeModule === 'intro' && <IntroductionModule device={device} />}
              {activeModule === 'working-principle' && <WorkingPrincipleModule device={device} />}
              {activeModule === 'components' && <ComponentExplorerModule device={device} />}
              {activeModule === 'block-diagram' && <BlockDiagramModule device={device} />}
              {activeModule === 'maintenance' && <MaintenanceModule device={device} />}
              {activeModule === 'troubleshooting' && <TroubleshootingModule device={device} />}
              {activeModule === 'viva' && <VivaModule device={device} />}
              {activeModule === 'quiz' && <QuizModule device={device} onComplete={handleComplete} />}
              {activeModule === 'ai' && <AIAssistantModule device={device} />}
            </div>

            {/* Mark complete + next */}
            {activeModule !== 'quiz' && activeModule !== 'ai' && (
              <div className="flex items-center justify-between mt-4 px-2">
                <button
                  onClick={handleComplete}
                  disabled={isComplete}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                    isComplete ? 'text-teal-600 cursor-default' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isComplete ? <><CheckCircle2 className="w-4 h-4" /> Module completed</> : <><Circle className="w-4 h-4" /> Mark as complete</>}
                </button>
                <button
                  onClick={() => {
                    const idx = moduleList.findIndex((m) => m.id === activeModule);
                    if (idx < moduleList.length - 1) handleModuleChange(moduleList[idx + 1].id);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all"
                >
                  Next module
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
