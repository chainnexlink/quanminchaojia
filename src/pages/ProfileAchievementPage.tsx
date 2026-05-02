import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Zap, Flame, Award } from 'lucide-react';

const achievements = [
  { id: '1', name: '初出茅庐', desc: '首次参与话题投票', icon: Zap, unlocked: true },
  { id: '2', name: '阵营先锋', desc: '累计获得100战力', icon: Flame, unlocked: true },
  { id: '3', name: '话题达人', desc: '发布10条佐证', icon: Star, unlocked: false },
  { id: '4', name: '人气王', desc: '获得100个赞', icon: Trophy, unlocked: false },
  { id: '5', name: '赛季冠军', desc: '本赛季战力第一', icon: Award, unlocked: false }
];

export function ProfileAchievementPage() {
  const navigate = useNavigate();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">我的成就</h1>
        <span className="text-sm text-slate-500">{unlockedCount}/{achievements.length}</span>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white mb-4 cursor-pointer" onClick={() => navigate('/ranking')}>
          <div className="flex items-center gap-3">
            <Trophy className="w-12 h-12" />
            <div>
              <h2 className="text-xl font-bold">成就收藏家</h2>
              <p className="text-sm opacity-90">已解锁 {unlockedCount} 个成就</p>
            </div>
            <span className="ml-auto text-white/70">查看排名 →</span>
          </div>
        </div>

        <div className="space-y-3">
          {achievements.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-4 ${!item.unlocked ? 'opacity-50' : ''}`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                item.unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-700 text-slate-500'
              }`}>
                <item.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-100">{item.name}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
              {item.unlocked && <span className="text-xs text-green-400 font-medium">已解锁</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
