import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, Trash2, BarChart3, Clock, Eye, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { getCountdown } from '../data/mock';
import { useToast } from '../components/Toast';

export function TopicManagePage() {
  const navigate = useNavigate();
  const { user, topics } = useStore();
  const { showToast } = useToast();
  const myTopics = topics.filter(t => t.creator_id === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">话题管理</h1>
      </div>

      <div className="p-4">
        {myTopics.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>暂无创建的话题</p>
            <button
              onClick={() => navigate('/publish')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full text-sm"
            >
              创建话题
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myTopics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-200 flex-1 pr-2">{topic.title}</h3>
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getCountdown(topic.expire_at || '')}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="text-cyan-400">北方 {topic.raw_votes?.[0] || 0}</span>
                  <span className="text-pink-400">南方 {topic.raw_votes?.[1] || 0}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {topic.total_participants || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    0
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/topic/${topic.id}`)}
                    className="flex-1 py-2 bg-slate-700/50 rounded-lg text-sm flex items-center justify-center gap-1 text-slate-300"
                  >
                    <BarChart3 className="w-4 h-4" /> 数据
                  </button>
                  <button
                    onClick={() => navigate(`/publish?edit=${topic.id}`)}
                    className="flex-1 py-2 bg-violet-500/20 text-violet-400 rounded-lg text-sm flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-4 h-4" /> 编辑
                  </button>
                  <button
                    onClick={() => showToast('话题已结束', 'success')}
                    className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> 结束
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
