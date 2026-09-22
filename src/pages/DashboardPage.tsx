import { Award, Star, Clock, TrendingUp, CheckCircle, Activity, Sparkles, ArrowRight, Trophy } from 'lucide-react';
import { allDevices } from '../data';
import { categories } from '../data/categories';
import { navigate } from '../hooks/useRouter';
import { useProgress } from '../hooks/useProgress';

export function DashboardPage() {
  const { progress, quizResults, favorites, recentAccess, certificates, loading, getDeviceProgress } = useProgress();

  const completedModules = progress.filter((p) => p.completed).length;
  const totalModules = allDevices.length * 9;
  const avgQuizScore = quizResults.length > 0 ? Math.round(quizResults.reduce((acc, q) => acc + q.score, 0) / quizResults.length) : 0;
  const completedLabs = progress.filter((p) => p.module === 'lab' && p.completed).length;
  const earnedCertificates = certificates.length;

  // Skills breakdown
  const categoryProgress = categories.map((cat) => {
    const devices = allDevices.filter((d) => d.categoryId === cat.id);
    let completed = 0;
    devices.forEach((d) => {
      completed += getDeviceProgress(d.id).completed;
    });
    return { category: cat, completed, total: devices.length * 9 };
  });

  // Favorite devices
  const favoriteDevices = allDevices.filter((d) => favorites.includes(d.id));

  // Recent devices
  const recentDevices = recentAccess
    .map((ra) => ({ device: allDevices.find((d) => d.id === ra.device_id), module: ra.module }))
    .filter((r) => r.device)
    .filter((r, i, arr) => arr.findIndex((x) => x.device!.id === r.device!.id) === i)
    .slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  const stats = [
    { icon: CheckCircle, label: 'Modules Completed', value: completedModules, total: totalModules, color: 'from-teal-500 to-emerald-500' },
    { icon: Trophy, label: 'Quiz Average', value: `${avgQuizScore}%`, total: 100, color: 'from-primary-500 to-blue-500' },
    { icon: Activity, label: 'Labs Completed', value: completedLabs, total: allDevices.length, color: 'from-violet-500 to-purple-500' },
    { icon: Award, label: 'Certificates', value: earnedCertificates, total: allDevices.length, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">Student Dashboard</h1>
          <p className="text-slate-600">Track your learning progress, quiz scores, and earned achievements.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-display text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                {typeof stat.total === 'number' && typeof stat.value === 'number' && (
                  <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${stat.color}`} style={{ width: `${Math.min((stat.value / stat.total) * 100, 100)}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills dashboard */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Skills Dashboard
              </h2>
              <div className="space-y-3">
                {categoryProgress.map(({ category, completed, total }, i) => {
                  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{category.name}</span>
                        <span className="text-xs text-slate-500">{completed}/{total} ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent activity */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                Recently Accessed
              </h2>
              {recentDevices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recentDevices.map(({ device, module }, i) => {
                    const cat = categories.find((c) => c.id === device!.categoryId);
                    return (
                      <button
                        key={i}
                        onClick={() => navigate(`/device/${device!.id}`)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat?.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                          {device!.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-slate-900 truncate">{device!.name}</div>
                          <div className="text-xs text-slate-500 capitalize">{module?.replace('-', ' ') || 'viewed'}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 ml-auto flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No recent activity. Start exploring devices in the <button onClick={() => navigate('/library')} className="text-primary-500 hover:underline">library</button>.
                </div>
              )}
            </div>

            {/* Quiz scores */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Recent Quiz Scores
              </h2>
              {quizResults.length > 0 ? (
                <div className="space-y-2">
                  {quizResults.slice(0, 5).map((quiz, i) => {
                    const device = allDevices.find((d) => d.id === quiz.device_id);
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${quiz.score >= 70 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                            {quiz.score}%
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{device?.name || quiz.device_id}</div>
                            <div className="text-xs text-slate-500">{quiz.correct_answers}/{quiz.total_questions} correct</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">No quiz attempts yet.</div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Favorites */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Favorite Devices
              </h2>
              {favoriteDevices.length > 0 ? (
                <div className="space-y-2">
                  {favoriteDevices.map((device) => {
                    const cat = categories.find((c) => c.id === device.categoryId);
                    return (
                      <button
                        key={device.id}
                        onClick={() => navigate(`/device/${device.id}`)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat?.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {device.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-900 truncate">{device.name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">
                  No favorites yet. Tap the star icon on any device to add it here.
                </div>
              )}
            </div>

            {/* Certificates */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Certificates
              </h2>
              {certificates.length > 0 ? (
                <div className="space-y-2">
                  {certificates.map((cert, i) => {
                    const device = allDevices.find((d) => d.id === cert.device_id);
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                        <Award className="w-8 h-8 text-amber-500 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{device?.name || cert.device_id}</div>
                          <div className="text-xs text-slate-500">{cert.certificate_type}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">
                  Complete all 9 modules of a device to earn a certificate.
                </div>
              )}
            </div>

            {/* AI Assistant CTA */}
            <div className="card p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-display text-lg font-bold text-slate-900">AI Tutor</h2>
              </div>
              <p className="text-sm text-slate-600 mb-4">Get personalized help from the BioMed AI Assistant.</p>
              <button onClick={() => navigate('/ai-assistant')} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium py-2.5 rounded-lg hover:shadow-lg transition-all">
                Ask AI Assistant
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
