import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Gift, Video, CheckCircle } from 'lucide-react';
import { useStore } from '../store';
import { isMiniProgram } from '../services/platformService';

const transactions = [
  { id: 1, type: 'income', title: '每日签到', points: 10, time: '今天 09:30' },
  { id: 2, type: 'income', title: '话题投票', points: 5, time: '今天 08:15' },
  { id: 3, type: 'expense', title: '兑换商品', points: -100, time: '昨天 14:20' },
  { id: 4, type: 'income', title: '观看广告', points: 20, time: '昨天 10:00' },
];

export function ProfileWalletPage() {
  const navigate = useNavigate();
  const { user } = useStore();
  const inMiniProgram = isMiniProgram();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">我的钱包</h1>
        </div>

        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="w-6 h-6" />
            <span className="text-sm opacity-80">当前积分</span>
          </div>
          <div className="text-5xl font-bold">{user?.points}</div>
        </div>

        <div className="flex gap-3 mt-6">
          {!inMiniProgram && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/recharge')}
              className="flex-1 py-3 bg-white text-orange-500 rounded-xl font-semibold"
            >
              充值
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop')}
            className="flex-1 py-3 bg-white/20 text-white rounded-xl font-semibold"
          >
            去兑换
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile/points')}
            className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold border border-white/30"
          >
            明细
          </motion.button>
        </div>
      </div>

      <div className="p-4">
        <h2 className="font-semibold text-slate-200 mb-3">收支明细</h2>
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl">
          {transactions.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-4 border-b last:border-0 border-slate-700/50"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                t.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-200">{t.title}</div>
                <div className="text-xs text-slate-500">{t.time}</div>
              </div>
              <div className={`font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {t.type === 'income' ? '+' : ''}{t.points}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
