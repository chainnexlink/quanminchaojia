import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Eye, Upload } from 'lucide-react';
import { useStore } from '../store';

export function CampEvidenceListPage() {
  const { topicId, camp } = useParams();
  const navigate = useNavigate();
  const { topics } = useStore();
  const topic = topics.find(t => t.id === topicId);

  if (!topic) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <p className="text-slate-400">话题不存在</p>
      </div>
    );
  }

  const isNorth = camp === 'north';
  const posts: any[] = [];
  const campName = isNorth ? '北方' : '南方';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className={`${isNorth ? 'bg-cyan-500' : 'bg-pink-500'} px-4 py-3 flex items-center gap-3 sticky top-0 z-10 text-white`}>
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/20 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg">{campName}阵营佐证</h1>
        <span className="text-sm opacity-80">{posts?.length || 0}条</span>
      </div>

      <div className="p-4 space-y-4">
        {posts?.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={post.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-medium text-slate-200">{post.user?.nickname || '用户'}</div>
                <div className="text-xs text-slate-500">{post.time || '刚刚'}</div>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-3">{post.content}</p>
            {post.images?.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {post.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>
            )}
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {post.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> {post.comments?.length || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {post.views || 0}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-4 left-0 right-0 px-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/upload-evidence/${topicId}/${camp}`)}
          className={`w-full py-3 ${isNorth ? 'bg-cyan-500' : 'bg-pink-500'} text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2`}
        >
          <Upload className="w-5 h-5" /> 上传佐证
        </motion.button>
      </div>
    </div>
  );
}
