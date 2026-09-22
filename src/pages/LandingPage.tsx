import { Activity, Cpu, FlaskConical, GraduationCap, HeartPulse, Scan, Sparkles, Zap, ArrowRight, Microscope, Brain, Stethoscope, Briefcase, TrendingUp, Award } from 'lucide-react';
import { navigate } from '../hooks/useRouter';
import { allDevices } from '../data';
import { categories } from '../data/categories';

export function LandingPage() {
  const stats = [
    { value: allDevices.length, label: 'Medical Devices' },
    { value: categories.length, label: 'Categories' },
    { value: '9', label: 'Modules per Device' },
    { value: '∞', label: 'Simulations' },
  ];

  const features = [
    { icon: Activity, title: 'Interactive Virtual Labs', desc: 'Realistic simulations with live waveforms, adjustable parameters, and fault injection for every device.', color: 'from-blue-500 to-cyan-500' },
    { icon: Cpu, title: 'Component Explorer', desc: 'Click through internal components and block diagrams to understand how each device works from the inside out.', color: 'from-teal-500 to-emerald-500' },
    { icon: Zap, title: 'Troubleshooting Simulator', desc: 'Practice diagnosing and resolving realistic fault scenarios with guided feedback and solutions.', color: 'from-amber-500 to-orange-500' },
    { icon: Sparkles, title: 'AI Medical Assistant', desc: 'Context-aware AI tutor that explains concepts, compares devices, and generates viva questions.', color: 'from-violet-500 to-purple-500' },
    { icon: GraduationCap, title: 'Auto-Graded Quizzes', desc: 'MCQ quizzes with detailed explanations and viva questions for exam preparation.', color: 'from-rose-500 to-pink-500' },
    { icon: FlaskConical, title: 'Maintenance Training', desc: 'Learn calibration, preventive maintenance, electrical safety, and daily inspection procedures.', color: 'from-indigo-500 to-blue-500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-b from-primary-50 via-white to-teal-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur border border-primary-200 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-slate-700">AI-Powered Virtual Biomedical Engineering Laboratory</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6 animate-fade-in-up">
              Master Medical Devices in a
              <span className="block gradient-text">Virtual Laboratory</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              BioMedVerse replaces the physical medical device lab with an interactive digital ecosystem.
              Learn, simulate, troubleshoot, and master 50+ medical devices — all from your browser.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <button onClick={() => navigate('/library')} className="btn-primary flex items-center gap-2 group">
                Explore Device Library
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/lab/ecg-machine')} className="btn-secondary flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Try ECG Virtual Lab
              </button>
            </div>
          </div>

          {/* Floating device icons */}
          <div className="mt-16 flex items-center justify-center gap-8 opacity-60">
            <div className="animate-float" style={{ animationDelay: '0s' }}><HeartPulse className="w-8 h-8 text-primary-400" /></div>
            <div className="animate-float" style={{ animationDelay: '1s' }}><Scan className="w-8 h-8 text-teal-400" /></div>
            <div className="animate-float" style={{ animationDelay: '2s' }}><Brain className="w-8 h-8 text-accent-400" /></div>
            <div className="animate-float" style={{ animationDelay: '0.5s' }}><Microscope className="w-8 h-8 text-primary-400" /></div>
            <div className="animate-float" style={{ animationDelay: '1.5s' }}><Stethoscope className="w-8 h-8 text-teal-400" /></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">A Complete Virtual Laboratory</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every device includes nine interactive modules — from working principles to hands-on virtual labs with live simulations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="card card-hover p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">Explore by Category</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">From patient monitoring to neonatal care — devices across all major biomedical engineering domains.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const deviceCount = allDevices.filter((d) => d.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/library/${cat.id}`)}
                  className="card card-hover p-5 text-left animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-md`}>
                    {cat.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 mb-1 leading-tight">{cat.name}</h3>
                  <p className="text-xs text-slate-500">{deviceCount} devices</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Career teaser */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 mb-4">
                <Briefcase className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-600">Career Guidance</span>
              </div>
              <h2 className="section-title mb-4">Plan Your Career in Biomedical Engineering</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Explore industry jobs, research careers, and higher studies opportunities. From clinical engineering
                to medical device design, from Ph.D. research to healthcare MBA — BioMedVerse helps you discover the
                path that's right for you.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: Briefcase, text: 'Industry roles at Medtronic, Philips, GE, Siemens & more' },
                  { icon: FlaskConical, text: 'Research careers in biomaterials, imaging AI, neural engineering' },
                  { icon: GraduationCap, text: 'Graduate programs at top universities worldwide' },
                  { icon: Award, text: 'Professional certifications to boost your credentials' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-teal-600" />
                      </div>
                      {item.text}
                    </div>
                  );
                })}
              </div>
              <button onClick={() => navigate('/careers')} className="btn-primary flex items-center gap-2 group">
                Explore Career Paths
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, value: '$130B+', label: 'Global MedTech Market', color: 'from-blue-500 to-cyan-500' },
                { icon: Briefcase, value: '400K+', label: 'BME Jobs Worldwide', color: 'from-teal-500 to-emerald-500' },
                { icon: GraduationCap, value: '50+', label: 'Top Universities', color: 'from-violet-500 to-purple-500' },
                { icon: Award, value: '5+', label: 'Certifications', color: 'from-amber-500 to-orange-500' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="card p-5 text-center">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-display text-xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-teal-500 to-accent-500 p-12 text-center shadow-2xl">
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Ready to Enter the Virtual Lab?</h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">Start exploring medical devices, running simulations, and building your biomedical engineering expertise today.</p>
              <button onClick={() => navigate('/library')} className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform">
                Browse All Devices
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
