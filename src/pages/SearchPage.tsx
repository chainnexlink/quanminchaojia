import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, TrendingUp, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const hotSearches = ['豆腐脑咸甜', '粽子口味', '暖气', '冬天室内', '南北差异'];

export function SearchPage() {
  const navigate = useNavigate();
  const { topics } = useStore();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>(['火锅', '粽子', '暖气']);
  const [results, setResults] = useState<typeof topics>([]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    const filtered = topics.filter(t => t.title.includes(q));
    setResults(filtered);
    if (!history.includes(q)) {
      setHistory([q, ...history].slice(0, 10));
    }
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="搜索话题、用户..."
              className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500"
            />
          </div>
          <button onClick={() => handleSearch(query)} className="text-violet-400 font-medium text-sm">
            搜索
          </button>
        </div>
      </div>

      {query ? (
        <div className="p-4">
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((topic) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => navigate(`/topic/${topic.id}`)}
                  className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl cursor-pointer"
                >
                  <h3 className="font-medium text-slate-200">{topic.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {(topic.raw_votes?.[0] || 0) + (topic.raw_votes?.[1] || 0)} 参与
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p>未找到相关结果</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          {history.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-300">搜索历史</h3>
                <button onClick={clearHistory} className="text-xs text-slate-500">
                  清空
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((h) => (
                  <button
                    key={h}
                    onClick={() => handleSearch(h)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300"
                  >
                    <Clock className="w-3 h-3" />
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-red-400" />
              热门搜索
            </h3>
            <div className="flex flex-wrap gap-2">
              {hotSearches.map((h, i) => (
                <button
                  key={h}
                  onClick={() => handleSearch(h)}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300 hover:border-violet-500"
                >
                  {i < 3 && <span className="text-red-400 mr-1">{i + 1}</span>}
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
