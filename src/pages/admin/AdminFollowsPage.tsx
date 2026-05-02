import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, UserPlus, UserMinus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FollowRelation {
  id: string;
  followerId: string;
  followerName: string;
  followingId: string;
  followingName: string;
  createdAt: string;
  status: 'active' | 'blocked';
}

const mockFollows: FollowRelation[] = [
  { id: '1', followerId: 'u1', followerName: '用户A', followingId: 'u2', followingName: '用户B', createdAt: '2026-04-29', status: 'active' },
  { id: '2', followerId: 'u2', followerName: '用户B', followingId: 'u3', followingName: '用户C', createdAt: '2026-04-28', status: 'active' },
];

export function AdminFollowsPage() {
  const navigate = useNavigate();
  const [follows, setFollows] = useState<FollowRelation[]>(mockFollows);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = follows.filter(f => 
    f.followerName.includes(searchQuery) || f.followingName.includes(searchQuery)
  );

  const handleToggle = (id: string) => {
    setFollows(prev => prev.map(f => 
      f.id === id ? { ...f, status: f.status === 'active' ? 'blocked' : 'active' } : f
    ));
  };

  return (
    <div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索用户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">{f.followerName}</p>
                    <p className="text-xs text-gray-400">关注 → {f.followingName}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(f.id)}
                  className={`p-2 rounded-lg ${f.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                >
                  {f.status === 'active' ? <UserMinus size={18} /> : <UserPlus size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">{f.createdAt}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
