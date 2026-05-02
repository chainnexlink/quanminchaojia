import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, UserCheck } from 'lucide-react';
import { useState } from 'react';

const mockFollowing = [
  { id: '1', name: '话题达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', bio: '热爱南北文化讨论', isFollowing: true },
  { id: '2', name: '北方代表', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', bio: '北方阵营忠实粉丝', isFollowing: true },
  { id: '3', name: '南方小土豆', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', bio: '为南方而战', isFollowing: false },
];

export function FollowingListPage() {
  const navigate = useNavigate();
  const [following, setFollowing] = useState(mockFollowing);

  const toggleFollow = (id: string) => {
    setFollowing(prev => prev.map(u => u.id === id ? { ...u, isFollowing: !u.isFollowing } : u));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">关注 ({following.length})</h1>
      </div>

      <div className="p-4 space-y-3">
        {following.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl flex items-center gap-3"
          >
            <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <div className="font-medium text-slate-200">{user.name}</div>
              <div className="text-xs text-slate-500">{user.bio}</div>
            </div>
            <button
              onClick={() => toggleFollow(user.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                user.isFollowing
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
              }`}
            >
              {user.isFollowing ? (
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
