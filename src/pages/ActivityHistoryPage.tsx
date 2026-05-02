import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Trophy } from 'lucide-react';

const historyActivities = [
  { id: 1, title: '月饼甜咸大PK', desc: '甜月饼 vs 咸月饼', winner: 'north', participants: 52000, endTime: '2024-09-17' },
  { id: 2, title: '粽子口味之争', desc: '甜粽子 vs 咸粽子', winner: 'south', participants: 48000, endTime: '2024-06-10' },
  { id: 3, title: '火锅蘸料大战', desc: '麻酱 vs 油碟', winner: 'north', participants: 35000, endTime: '2024-03-15' },
];

export function ActivityHistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">历史活动</h1>
      </div>

      <div className="p-4 space-y-3">
        {historyActivities.map((act, i) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-200">{act.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                act.winner === 'north' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-pink-500/20 text-pink-400'
              }`}>
                {act.winner === 'north' ? '北方胜' : '南方胜'}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{act.desc}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {act.participants.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.endTime}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
