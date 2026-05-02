import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CashTransaction {
  id: string;
  userId: string;
  username: string;
  type: 'income' | 'expense';
  amount: number;
  source: 'reward' | 'withdraw' | 'refund';
  description: string;
  createdAt: string;
}

const mockTransactions: CashTransaction[] = [
  { id: '1', userId: 'u1', username: '用户A', type: 'income', amount: 50, source: 'reward', description: '话题奖励', createdAt: '2026-04-29 10:30' },
  { id: '2', userId: 'u2', username: '用户B', type: 'expense', amount: 100, source: 'withdraw', description: '提现申请', createdAt: '2026-04-28 15:20' },
  { id: '3', userId: 'u3', username: '用户C', type: 'income', amount: 30, source: 'reward', description: '创作者奖励', createdAt: '2026-04-27 09:00' },
];

export function AdminCashPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = mockTransactions.filter(t =>
    filter === 'all' ? true : t.type === filter
  );

  const totalIncome = mockTransactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = mockTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  return (
    <div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <TrendingUp size={16} />
              <span className="text-sm">总收入</span>
            </div>
            <p className="text-xl font-bold text-green-700">¥{totalIncome}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <TrendingDown size={16} />
              <span className="text-sm">总支出</span>
            </div>
            <p className="text-xl font-bold text-red-700">¥{totalExpense}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {(['all', 'income', 'expense'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {f === 'all' ? '全部' : f === 'income' ? '收入' : '支出'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{t.username}</p>
                  <p className="text-xs text-gray-500">{t.description}</p>
                </div>
                <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}¥{t.amount}
                </span>
              </div>
              <p className="text-xs text-gray-400">{t.createdAt}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
