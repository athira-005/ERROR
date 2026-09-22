import { useState, useMemo } from 'react';
import { Search, Star, ArrowRight, X } from 'lucide-react';
import { allDevices } from '../data';
import { categories } from '../data/categories';
import { navigate } from '../hooks/useRouter';
import { useProgress } from '../hooks/useProgress';

export function LibraryPage({ initialCategory }: { initialCategory?: string }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const { favorites, toggleFavorite, getDeviceProgress } = useProgress();

  const filtered = useMemo(() => {
    return allDevices.filter((d) => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.tagline.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'all' || d.categoryId === selectedCategory;
      const matchDifficulty = difficultyFilter === 'all' || d.difficulty === difficultyFilter;
      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [search, selectedCategory, difficultyFilter]);

  const difficultyColors: Record<string, string> = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-amber-100 text-amber-700',
    Advanced: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">Medical Device Library</h1>
          <p className="text-slate-600">Browse {allDevices.length} interactive medical devices across {categories.length} categories.</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  difficultyFilter === diff ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300'
                }`}
              >
                {diff === 'all' ? 'All Levels' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-500">
          Showing {filtered.length} device{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((device, i) => {
            const cat = categories.find((c) => c.id === device.categoryId);
            const isFav = favorites.includes(device.id);
            const progress = getDeviceProgress(device.id);

            return (
              <div
                key={device.id}
                className="card card-hover overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
              >
                {/* Image header */}
                <div className="relative h-40 bg-gradient-to-br from-primary-100 to-teal-100 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat?.color} opacity-20`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat?.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-2xl font-bold">{device.name.charAt(0)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(device.id); }}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-white/80 backdrop-blur hover:bg-white transition-all"
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                  </button>
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-medium ${difficultyColors[device.difficulty]}`}>
                    {device.difficulty}
                  </span>
                  {progress.percentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/50">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-teal-400" style={{ width: `${progress.percentage}%` }} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-xs text-primary-500 font-medium mb-1">{cat?.name}</div>
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-1">{device.name}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{device.tagline}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600">9 Modules</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600">Virtual Lab</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600">Quiz</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/device/${device.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 text-slate-700 text-sm font-medium py-2.5 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Learn
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/lab/${device.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary-600 to-teal-500 text-white text-sm font-medium py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                    >
                      Virtual Lab
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No devices found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
