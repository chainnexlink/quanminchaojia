import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Gift, Ticket, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

export function AdRewardPage() {
  const navigate = useNavigate();
  const { user, addPoints } = useStore();
  const { showToast } = useToast();
  const [watching, setWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reward, setReward] = useState<{ type: string; value: number; label: string } | null>(null);
  const [dailyWatches, setDailyWatches] = useState(0);
  const [claimed, setClaimed] = useState<string[]>([]);

  const rewards = [
    { id: 'vote3', icon: Ticket, label: '额外投票券 x3', desc: '本期话题可用', value: 3, color: 'blue' },
    { id: 'points50', icon: Gift, label: '50积分', desc: '永久积分', value: 50, color: 'amber' },
    { id: 'adfree1', icon: Sparkles, label: '免广告卡 1天', desc: '24小时免广告', value: 1, color: 'purple' }
  ];

  useEffect(() => {
    if (watching && progress < 100) {
      const timer = setTimeout(() => setProgress(p => p + 2), 100);
      return () => clearTimeout(timer);
    }
    if (watching && progress >= 100) {
      setWatching(false);
      const rewardPoints = 50;
      addPoints(rewardPoints);
      setReward({ type: 'points', value: rewardPoints, label: `${rewardPoints}积分` });
      setDailyWatches(d => d + 1);
      showToast(`+${rewardPoints}积分`, 'success');
    }
  }, [watching, progress]);

  const startWatch = () => {
    if (dailyWatches >= 5) return;
    setWatching(true);
    setProgress(0);
  };

  const claimReward = (id: string) => {
    if (claimed.includes(id)) return;
    const rewardItem = rewards.find(r => r.id === id);
    if (rewardItem && rewardItem.id === 'points50') {
      addPoints(rewardItem.value);
      showToast(`+${rewardItem.value}积分`, 'success');
    } else {
      showToast(`已领取: ${rewardItem?.label || '奖励'}`, 'success');
    }
    setClaimed([...claimed, id]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">看广告领奖励</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">今日观看</span>
            <span className="text-sm font-medium text-slate-200">{dailyWatches}/5</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${(dailyWatches / 5) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence>
          {reward && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center mb-4"
            >
              <CheckCircle className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-1">恭喜获得</h3>
              <p className="text-2xl font-bold">{reward.label}</p>
              <button onClick={() => setReward(null)} className="mt-4 px-6 py-2 bg-white/20 rounded-full text-sm">
                收下奖励
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {watching ? (
          <motion.div className="bg-slate-900 rounded-2xl aspect-video flex flex-col items-center justify-center mb-4 relative">
            <div className="text-white text-center">
              <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm opacity-70">广告播放中...</p>
              <p className="text-2xl font-bold mt-2">{progress}%</p>
            </div>
            <div className="absolute bottom-4 left-4 right-4 h-1 bg-slate-700 rounded-full">
              <motion.div className="h-full bg-amber-500" style={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startWatch}
            disabled={dailyWatches >= 5}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl font-bold mb-4 disabled:opacity-50"
          >
            {dailyWatches >= 5 ? '今日次数已用完' : '观看广告领奖励'}
          </motion.button>
        )}

        <h3 className="font-bold text-slate-200 mb-3">可领取奖励</h3>
        <div className="space-y-3">
          {rewards.map((item) => {
            const isClaimed = claimed.includes(item.id);
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                whileTap={!isClaimed ? { scale: 0.98 } : {}}
                onClick={() => claimReward(item.id)}
                className={`bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl flex items-center gap-3 ${isClaimed ? 'opacity-50' : 'cursor-pointer'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  item.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-violet-500/20 text-violet-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                {isClaimed ? (
                  <span className="text-green-400 text-sm">已领取</span>
                ) : (
                  <span className="text-amber-400 text-sm font-medium">领取</span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
          <h4 className="font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            奖励规则
          </h4>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• 每日最多观看5次广告</li>
            <li>• 每次观看可获得3张投票券</li>
            <li>• 投票券仅限本期话题使用</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
