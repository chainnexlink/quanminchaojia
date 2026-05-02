import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Plus, Minus, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PointsRecord {
  id: string;
  userId: string;
  username: string;
  type: 'income' | 'expense';
  amount: number;
  reason: string;
  createdAt: string;
}

const mockRecords: PointsRecord[] = [
  { id: '1', userId: 'u1', username: '用户A', type: 'income', amount: 100, reason: '每日任务', createdAt: '2026-04-29 10:30' },
  { id: '2', userId: 'u2', username: '用户B', type: 'expense', amount: 20, reason: 'AI评判', createdAt: '2026-04-29 09:15' },
  { id: '3', userId: 'u3', username: '用户C', type: 'income', amount: 500, reason: '活动奖励', createdAt: '2026-04-28 16:00' },
];

export function AdminPointsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<PointsRecord[]>(mockRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ userId: '', amount: 0, reason: '', type: 'income' as 'income' | 'expense' });

  const filteredRecords = records.filter(r => r.username.includes(searchQuery));

  const handleSubmit = () => {
    const newRecord: PointsRecord = {
      id: Date.now().toString(),
      userId: formData.userId,
      username: '用户' + formData.userId,
      type: formData.type,
      amount: formData.amount,
      reason: formData.reason,
      createdAt: new Date().toLocaleString()
    };
    setRecords([newRecord, ...records]);
    setShowModal(false);
    setFormData({ userId: '', amount: 0, reason: '', type: 'income' });
  };

  return (
    <div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
          >
            调整积分
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 border-b last:border-b-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{record.username}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    record.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {record.type === 'income' ? '收入' : '支出'}
                  </span>
                </div>
                <span className={`font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {record.type === 'income' ? '+' : '-'}{record.amount}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{record.reason}</span>
                <span className="text-xs">{record.createdAt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">调整用户积分</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="用户ID"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`flex-1 py-2 rounded-lg text-sm ${formData.type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                >
                  <Plus className="w-4 h-4 inline mr-1" />增加
                </button>
                <button
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`flex-1 py-2 rounded-lg text-sm ${formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
                >
                  <Minus className="w-4 h-4 inline mr-1" />扣除
                </button>
              </div>
              <input
                type="number"
                placeholder="积分数量"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="原因"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-100 rounded-lg">取消</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-blue-500 text-white rounded-lg">确认</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
