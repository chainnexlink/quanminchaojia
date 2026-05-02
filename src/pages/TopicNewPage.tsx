import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export function TopicNewPage() {
  const navigate = useNavigate();
  const { topics } = useStore();
  const sortedTopics = [...topics].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">最新话题</h1>
      </div>

      <div className="px-4 py-4 space-y-3">
        {sortedTopics.map((topic, i) => {
          const total = (topic.raw_votes?.[0] || 0) + (topic.raw_votes?.[1] || 0);
          const northPct = total > 0 ? ((topic.raw_votes?.[0] || 0) / total) * 100 : 50;
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/topic/${topic.id}`)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 最新
                </span>
                <span className="text-xs text-slate-500">{topic.debate_type}</span>
              </div>
              <h3 className="font-bold text-slate-100">{topic.title}</h3>
              <p className="text-slate-400 text-sm mt-1 line-clamp-2">{topic.title}</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyan-400 font-medium">北 {topic.raw_votes?.[0] || 0}</span>
                  <span className="text-pink-400 font-medium">南 {topic.raw_votes?.[1] || 0}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                  <div className="h-full bg-cyan-500" style={{ width: `${northPct}%` }} />
                  <div className="h-full bg-pink-500" style={{ width: `${100 - northPct}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-slate-500 text-xs">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {total} 参与</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
