import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, TrendingUp, Medal, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export function RankingPage() {
  const navigate = useNavigate();
  const { user } = useStore();

  const rankings = [
    { rank: 1, name: '北方战神', power: 12580, camp: 'north', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r1' },
    { rank: 2, name: '南方霸主', power: 11230, camp: 'south', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r2' },
    { rank: 3, name: '嘲珈达人', power: 9850, camp: 'north', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r3' },
    { rank: 4, name: '战力王者', power: 8920, camp: 'south', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r4' },
    { rank: 5, name: 'PK高手', power: 7650, camp: 'north', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r5' },
  ];

  const myRank = rankings.findIndex(r => r.name === user?.nickname) + 1 || 6;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">赛季战绩</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 mb-4 cursor-pointer" onClick={() => navigate('/profile/achievements')}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-200">个人排名</h2>
            <span className="text-violet-400 font-bold">第 {myRank} 名</span>
          </div>
          <div className="flex items-center gap-4">
            <img src={user?.avatar_url || ''} alt="" className="w-16 h-16 rounded-full border-4 border-violet-500/30" />
            <div className="flex-1">
              <p className="font-bold text-lg text-slate-100">{user?.nickname}</p>
              <p className="text-sm text-slate-400">{user?.camp === 'north' ? '北方阵营' : '南方阵营'}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-100">{user?.season_power}</p>
              <p className="text-xs text-slate-400">本赛季战力</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 mb-4">
          <h2 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            战力排行榜
          </h2>
          <div className="space-y-2">
            {rankings.map((item) => (
              <motion.div
                key={item.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(`/user/${item.rank}`)}
                className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-700"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  item.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                  item.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                  item.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {item.rank <= 3 ? <Medal className="w-4 h-4" /> : item.rank}
                </div>
                <img src={item.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{item.name}</p>
                  <p className={`text-xs ${item.camp === 'north' ? 'text-blue-400' : 'text-red-400'}`}>
                    {item.camp === 'north' ? '北方阵营' : '南方阵营'}
                  </p>
                </div>
                <p className="font-bold text-slate-300">{item.power.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <h2 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            历史战绩
          </h2>
          <div className="space-y-3">
            {[
              { season: '第3赛季', rank: 8, result: 'win', reward: 100 },
              { season: '第2赛季', rank: 12, result: 'lose', reward: 30 },
              { season: '第1赛季', rank: 5, result: 'win', reward: 100 },
            ].map((record, i) => (
              <div key={i} onClick={() => navigate('/profile/achievements')} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-700">
                <div>
                  <p className="font-medium text-slate-200">{record.season}</p>
                  <p className="text-xs text-slate-400">排名: 第{record.rank}名</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${record.result === 'win' ? 'text-blue-400' : 'text-red-400'}`}>
                    {record.result === 'win' ? '胜利' : '失败'}
                  </span>
                  <p className="text-xs text-amber-400">+{record.reward}积分</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
