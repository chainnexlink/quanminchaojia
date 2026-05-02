import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Users, Clock, Zap } from 'lucide-react';

const challenges = [
  { id: '1', title: '南北甜咸大PK', desc: '豆腐脑甜咸之争', participants: 31500, endTime: '2天后结束', reward: 1000, hot: true },
  { id: '2', title: '冬季取暖方式', desc: '暖气 vs 空调', participants: 28900, endTime: '3天后结束', reward: 800, hot: true },
];

export function ActivityChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const challenge = challenges.find(c => c.id === id) || challenges[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-4 py-4 flex items-center gap-3 text-white sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/20 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold">挑战赛详情</span>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-bold text-slate-100">{challenge.title}</h1>
          {challenge.hot && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">热门</span>}
        </div>
        <p className="text-slate-400 mb-4">{challenge.desc}</p>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {challenge.participants.toLocaleString()} 参与</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {challenge.endTime}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4">
          <h3 className="font-semibold mb-3 text-slate-200">活动奖励</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="font-medium text-slate-200">{challenge.reward} 积分</p>
              <p className="text-xs text-slate-500">参与即可获得</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4">
          <h3 className="font-semibold mb-3 text-slate-200">参与方式</h3>
          <div className="space-y-3 text-sm text-slate-400">
            <p>1. 选择你的阵营（北方/南方）</p>
            <p>2. 上传佐证支持你的观点</p>
            <p>3. 邀请好友助力</p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/topics')}
          className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold"
        >
          立即参与
        </motion.button>
      </div>
    </div>
  );
}
