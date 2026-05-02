import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Plus, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RewardRecord {
  id: string;
  userId: string;
  username: string;
  amount: number;
  type: 'topic' | 'vote' | 'activity';
  description: string;
  createdAt: string;
}

const mockRewards: RewardRecord[] = [
  { id: '1', userId: 'u1', username: '用户A', amount: 50, type: 'topic', description: '话题获胜奖励', createdAt: '2026-04-29 10:30' },
  { id: '2', userId: 'u2', username: '用户B', amount: 20, type: 'vote', description: '投票参与奖励', createdAt: '2026-04-29 09:15' },
];

export function AdminRewardsPage() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<RewardRecord[]>(mockRewards);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ userId: '', amount: 0, type: 'topic' as const, description: '' });

  const totalRewards = rewards.reduce((a, b) => a + b.amount, 0);

  const handleSend = () => {
    const newReward: RewardRecord = {
      id: Date.now().toString(),
      userId: form.userId,
      username: '用户' + form.userId,
      amount: form.amount,
      type: form.type,
      description: form.description,
      createdAt: new Date().toLocaleString()
    };
    setRewards([newReward, ...rewards]);
    setShowModal(false);
    setForm({ userId: '', amount: 0, type: 'topic', description: '' });
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">
          <Plus size={16} /> 发放奖励
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-amber-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Gift size={16} />
              <span className="text-sm">总奖励</span>
            </div>
            <p className="text-xl font-bold text-amber-700">¥{totalRewards}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Users size={16} />
              <span className="text-sm">获奖人数</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{rewards.length}</p>
          </div>
        </div>

        <div className="space-y-3">
          {rewards.map((r) => (
            <motion.div key={r.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{r.username}</p>
                  <p className="text-xs text-gray-500">{r.description}</p>
                </div>
                <span className="text-amber-600 font-bold">+¥{r.amount}</span>
              </div>
              <p className="text-xs text-gray-400">{r.createdAt}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold mb-4">发放奖励</h3>
            <input placeholder="用户ID" value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} className="w-full px-3 py-2 border rounded-lg mb-3 text-sm" />
            <input type="number" placeholder="金额" value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg mb-3 text-sm" />
            <input placeholder="描述" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg mb-4 text-sm" />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm">取消</button>
              <button onClick={handleSend} className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm">确认</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
