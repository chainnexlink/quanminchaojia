import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Edit3, MessageCircle, Heart, Eye, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

export function MyPostsPage() {
  const navigate = useNavigate();
  const { user, topics } = useStore();
  const { showToast } = useToast();

  const myTopics = topics.filter(t => t.creator_id === user?.id);
  const myPosts: any[] = [];

  const handleEdit = (topicId: string) => {
    navigate(`/publish?edit=${topicId}`);
  };

  const handleDelete = (topicId: string) => {
    showToast('话题已删除', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">我的作品</h1>
      </div>

      <div className="p-4">
        <h2 className="text-sm font-medium text-slate-500 mb-3">我发起的话题 ({myTopics.length})</h2>
        {myTopics.length > 0 ? (
          <div className="space-y-3 mb-6">
            {myTopics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl"
              >
                <h3 className="font-medium text-slate-200 mb-2">{topic.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="text-cyan-400">{topic.camps?.[0]} {topic.raw_votes?.[0] || 0}</span>
                  <span className="text-pink-400">{topic.camps?.[1]} {topic.raw_votes?.[1] || 0}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(topic.id)} className="flex-1 py-2 bg-slate-700/50 rounded-lg text-sm flex items-center justify-center gap-1 text-slate-300 hover:bg-slate-600/50 transition-colors">
                    <Edit3 className="w-4 h-4" /> 编辑
                  </button>
                  <button onClick={() => handleDelete(topic.id)} className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4" /> 删除
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm mb-4">还没有发起过话题</p>
            <button onClick={() => navigate('/publish')} className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-sm font-medium">
              去发布话题
            </button>
          </div>
        )}

        <h2 className="text-sm font-medium text-slate-500 mb-3">我的佐证 ({myPosts.length})</h2>
        {myPosts.length > 0 ? (
          <div className="space-y-3">
            {myPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl"
              >
                <p className="text-sm text-slate-300 mb-2">{post.content}</p>
                {post.images?.[0] && (
                  <img src={post.images[0]} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />
                )}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments?.length || 0}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">还没有上传过佐证</p>
          </div>
        )}
      </div>
    </div>
  );
}
