import { BookOpen, CheckCircle, AlertCircle, History, Zap } from 'lucide-react';
import type { Device } from '../../data/types';

export function IntroductionModule({ device }: { device: Device }) {
  const { introduction } = device;
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Introduction</h2>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Overview</h3>
        <p className="text-slate-600 leading-relaxed">{introduction.overview}</p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Clinical Importance</h3>
        <p className="text-slate-600 leading-relaxed">{introduction.clinicalImportance}</p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-3">Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {introduction.applications.map((app, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
              <Zap className="w-4 h-4 text-teal-500 flex-shrink-0" />
              {app}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <History className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-slate-800">History</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">{introduction.history}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-slate-800">Advantages</h3>
          </div>
          <ul className="space-y-2">
            {introduction.advantages.map((adv, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                {adv}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-800">Limitations</h3>
          </div>
          <ul className="space-y-2">
            {introduction.limitations.map((lim, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                {lim}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
