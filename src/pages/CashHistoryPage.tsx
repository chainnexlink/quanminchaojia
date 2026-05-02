import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useStore } from '../store';

const mockCashHistory = [
  { id: '1', type: 'income', reason: '话题热度奖励', amount: 50.00, balance: 150.00, time: '2024-01-15 14:30' },
  { id: '2', type: 'expense', reason: '提现申请', amount: -100.00, balance: 100.00, time: '2024-01-10 09:00' },
  { id: '3', type: 'income', reason: '话题热度奖励', amount: 80.00, balance: 200.00, time: '2024-01-05 16:45' },
];

export function CashHistoryPage() {
  const navigate = useNavigate();
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">现金明细</h1>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5" />
          <span className="text-sm opacity-80">当前余额</span>
        </div>
        <div className="text-3xl font-bold">¥{(user?.cash_balance || 0).toFixed(2)}</div>
      </div>

      <div className="p-4">
        <h2 className="font-semibold text-slate-200 mb-3">收支记录</h2>
        <div className="space-y-3">
          {mockCashHistory.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {item.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-200">{item.reason}</div>
                <div className="text-xs text-slate-500">{item.time}</div>
              </div>
              <div className={`font-bold ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {item.type === 'income' ? '+' : ''}¥{item.amount.toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
