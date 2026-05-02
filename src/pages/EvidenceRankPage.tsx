import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Flame, Heart, Eye } from 'lucide-react';
import { useStore } from '../store';

export function EvidenceRankPage() {
  const navigate = useNavigate();
  const { topics } = useStore();

  const allPosts: any[] = [];
  const rankedPosts = allPosts
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-4">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">佐证排行榜</h1>
      </div>

      <div className="p-4 space-y-3">
        {rankedPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                i < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <img src={post.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="" className="w-8 h-8 rounded-full" />
                  <span className="font-medium text-sm text-slate-200">{post.user?.nickname || '用户'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    post.camp === 'north' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-pink-500/20 text-pink-400'
                  }`}>
                    {post.camp === 'north' ? '北方' : '南方'}
                  </span>
                </div>
                <p className="text-sm text-slate-300 line-clamp-2">{post.content}</p>
                {post.images?.[0] && (
                  <img src={post.images[0]} alt="" className="w-full h-32 object-cover rounded-lg mt-2" />
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {post.likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {post.views || 0}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
