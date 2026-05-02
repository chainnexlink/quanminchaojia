import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, UserCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

const mockUsers = [
  { id: 'u1', nickname: '北方战神', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u1', camp: 'north', isFollowing: true },
  { id: 'u2', nickname: '南方小土豆', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2', camp: 'south', isFollowing: false },
  { id: 'u3', nickname: '美食探员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u3', camp: 'north', isFollowing: true },
  { id: 'u4', nickname: '嘲珈达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u4', camp: 'south', isFollowing: false },
];

export function FollowPage() {
  const navigate = useNavigate();
  const { user, followUser, unfollowUser } = useStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'recommend'>('following');
  const [users, setUsers] = useState(mockUsers);

  const toggleFollow = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    
    try {
      if (target.isFollowing) {
        await unfollowUser(id);
        showToast(`已取消关注 ${target.nickname}`, 'info');
      } else {
        await followUser(id);
        showToast(`已关注 ${target.nickname}`, 'success');
      }
      setUsers(users.map(u => u.id === id ? { ...u, isFollowing: !u.isFollowing } : u));
    } catch (err) {
      showToast('操作失败', 'error');
    }
  };

  const filteredUsers = activeTab === 'recommend'
    ? users.filter(u => u.id !== user?.id && !u.isFollowing)
    : users;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">关注与粉丝</h1>
      </div>

      <div className="flex border-b border-slate-700/50 bg-slate-800/50">
        {[
          { key: 'following', label: '关注', count: 128 },
          { key: 'followers', label: '粉丝', count: 256 },
          { key: 'recommend', label: '推荐', count: null }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 py-3 text-sm font-medium relative ${
              activeTab === tab.key ? 'text-violet-400' : 'text-slate-500'
            }`}
          >
            {tab.label} {tab.count && `(${tab.count})`}
            {activeTab === tab.key && (
              <motion.div layoutId="followTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-violet-500" />
            )}
          </button>
        ))}
      </div>

      <div className="p-3">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索用户..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm outline-none text-slate-200 placeholder-slate-500"
          />
        </div>

        <div className="space-y-2">
          {filteredUsers.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-3 rounded-xl flex items-center gap-3"
            >
              <img src={u.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-slate-200">{u.nickname}</div>
                <div className={`text-xs ${u.camp === 'north' ? 'text-cyan-400' : 'text-pink-400'}`}>
                  {u.camp === 'north' ? '北方阵营' : '南方阵营'}
                </div>
              </div>
              <button
                onClick={() => toggleFollow(u.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${
                  u.isFollowing
                    ? 'bg-slate-700 text-slate-400'
                    : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                }`}
              >
                {u.isFollowing ? (
                  <><UserCheck className="w-4 h-4" /> 已关注</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> 关注</>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
