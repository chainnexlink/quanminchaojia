import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Hash, TrendingUp, Clock } from 'lucide-react';
import { useStore } from '../store';

const categories: Record<string, { name: string; icon: string }> = {
  food: { name: '美食', icon: '🍜' },
  life: { name: '生活', icon: '🏠' },
  culture: { name: '文化', icon: '📚' },
  travel: { name: '旅游', icon: '✈️' },
  dialect: { name: '方言', icon: '🗣️' },
  custom: { name: '习俗', icon: '🎊' }
};

export function TopicCategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { topics } = useStore();

  const categoryInfo = categories[category || ''] || { name: '分类', icon: '📂' };
  const filteredTopics = topics.filter(t => t.debate_type === (category || ''));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <span className="text-2xl">{categoryInfo.icon}</span>
        <h1 className="font-semibold text-lg text-slate-100">{categoryInfo.name}话题</h1>
      </div>

      <div className="flex gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
        <button className="flex items-center gap-1 px-3 py-1.5 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">
          <TrendingUp className="w-4 h-4" /> 最热
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-slate-400 rounded-full text-sm">
          <Clock className="w-4 h-4" /> 最新
        </button>
      </div>

      <div className="p-4 space-y-3">
        {filteredTopics.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/topic/${topic.id}`)}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-400 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                VS
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100">{topic.title}</h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{topic.title}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="text-cyan-400">北 {topic.raw_votes?.[0] || 0}</span>
                    <span className="text-slate-600">:</span>
                    <span className="text-pink-400">南 {topic.raw_votes?.[1] || 0}</span>
                  </span>
                  <span>{(topic.raw_votes?.[0] || 0) + (topic.raw_votes?.[1] || 0)} 条讨论</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
