import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Gift, TrendingUp, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdRecord {
  id: string;
  userId: string;
  username: string;
  points: number;
  watchedAt: string;
}

const mockRecords: AdRecord[] = [
  { id: '1', userId: 'u1', username: '用户A', points: 10, watchedAt: '2026-04-29 10:30' },
  { id: '2', userId: 'u2', username: '用户B', points: 10, watchedAt: '2026-04-29 09:15' },
];

export function AdminAdRewardPage() {
  const navigate = useNavigate();
  const [records] = useState<AdRecord[]>(mockRecords);
  const [rewardPoints, setRewardPoints] = useState(10);
  const [dailyLimit, setDailyLimit] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const totalWatched = records.length;
  const totalRewarded = records.reduce((a, b) => a + b.points, 0);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowSettings(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
          <Settings size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Video size={16} />
              <span className="text-sm">今日观看</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{totalWatched}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Gift size={16} />
              <span className="text-sm">奖励发放</span>
            </div>
            <p className="text-xl font-bold text-green-700">{totalRewarded}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {records.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 border-b last:border-b-0 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{r.username}</p>
                <p className="text-xs text-gray-400">{r.watchedAt}</p>
              </div>
              <span className="text-green-600 font-bold">+{r.points}豆</span>
            </motion.div>
          ))}
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowSettings(false)}>
          <motion.div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">奖励设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">单次奖励(豆)</label>
                <input type="number" value={rewardPoints} onChange={e => setRewardPoints(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">每日上限(次)</label>
                <input type="number" value={dailyLimit} onChange={e => setDailyLimit(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowSettings(false)} className="flex-1 py-2 bg-gray-100 rounded-lg">取消</button>
              <button onClick={() => setShowSettings(false)} className="flex-1 py-2 bg-blue-500 text-white rounded-lg">保存</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
