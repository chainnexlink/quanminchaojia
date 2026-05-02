import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, UserCheck } from 'lucide-react';
import { useState } from 'react';

const mockFollowers = [
  { id: '1', name: '小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', isFollowing: false },
  { id: '2', name: '小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', isFollowing: true },
  { id: '3', name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', isFollowing: false },
  { id: '4', name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', isFollowing: true },
];

export function FollowerListPage() {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState(mockFollowers);

  const toggleFollow = (id: string) => {
    setFollowers(prev => prev.map(f => f.id === id ? { ...f, isFollowing: !f.isFollowing } : f));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">粉丝列表</h1>
        <span className="text-slate-500 text-sm">{followers.length}</span>
      </div>

      <div className="p-4 space-y-3">
        {followers.map((follower, i) => (
          <motion.div
            key={follower.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img src={follower.avatar} alt="" className="w-12 h-12 rounded-full" />
              <span className="font-medium text-slate-200">{follower.name}</span>
            </div>
            <button
              onClick={() => toggleFollow(follower.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${
                follower.isFollowing
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
              }`}
            >
              {follower.isFollowing ? (
                <><UserCheck className="w-4 h-4" /> 已关注</>
              ) : (
                <><UserPlus className="w-4 h-4" /> 关注</>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
