import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Gift, MessageSquare, Zap, Eye } from 'lucide-react';
import { useStore } from '../store';

const reasonIcons: Record<string, typeof Gift> = {
  vote: Zap,
  comment: MessageSquare,
  ai_call: Eye,
  ad: Gift,
  bet_payout: TrendingUp,
  recharge: TrendingUp,
  default: Gift
};

const reasonLabels: Record<string, string> = {
  vote: '话题投票',
  comment: '发表评论',
  ai_call: '召唤AI裁判',
  ad: '观看广告',
  bet_payout: '支持池分配',
  recharge: '积分充值',
  default: '其他'
};

export function PointsHistoryPage() {
  const navigate = useNavigate();
  const { user, topics } = useStore();

  const transactions = [
    { id: '1', reason: 'vote', delta: 5, balance: (user?.points ?? 0), topic_id: topics[0]?.id, created_at: '2小时前' },
    { id: '2', reason: 'comment', delta: 10, balance: (user?.points ?? 0) - 5, topic_id: topics[0]?.id, created_at: '昨天' },
    { id: '3', reason: 'ad', delta: 20, balance: (user?.points ?? 0) - 15, created_at: '2天前' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">积分明细</h1>
        <span className="text-slate-500 text-sm">{transactions.length}</span>
      </div>

      <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6">
        <div className="text-center">
          <p className="text-sm opacity-80 mb-1">当前积分</p>
          <p className="text-4xl font-bold">{user?.points ?? 0}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {transactions.map((t, i) => {
          const Icon = reasonIcons[t.reason] || reasonIcons.default;
          const isIncome = t.delta > 0;
          const topic = topics.find(topic => topic.id === t.topic_id);
          
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => t.topic_id && navigate(`/topic/${t.topic_id}`)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700/50"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isIncome ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-200">{reasonLabels[t.reason] || reasonLabels.default}</p>
                {topic && <p className="text-xs text-slate-500">{topic.title}</p>}
                <p className="text-xs text-slate-500">{t.created_at}</p>
              </div>
              <div className={`font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                {isIncome ? '+' : ''}{t.delta}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
