import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, TrendingUp } from 'lucide-react';
import { useStore } from '../store';

export function TopicHotPage() {
  const navigate = useNavigate();
  const { topics } = useStore();

  const hotTopics = [...topics]
    .sort((a, b) => ((b.raw_votes?.[0] || 0) + (b.raw_votes?.[1] || 0)) - ((a.raw_votes?.[0] || 0) + (a.raw_votes?.[1] || 0)))
    .slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-4">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg flex items-center gap-2 text-slate-100">
          <Flame className="w-5 h-5 text-red-400" /> 热门话题
        </h1>
      </div>

      <div className="p-4 space-y-3">
        {hotTopics.map((topic, i) => {
          const total = (topic.raw_votes?.[0] || 0) + (topic.raw_votes?.[1] || 0);
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/topic/${topic.id}`)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  i < 3 ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100">{topic.title}</h3>
                    {i < 3 && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">热门</span>}
                  </div>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{topic.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {total} 热度
                    </span>
                    <span>{topic.total_participants || 0} 条讨论</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
