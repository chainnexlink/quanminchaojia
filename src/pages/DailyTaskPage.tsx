import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, Gift, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useState } from 'react';

const tasks = [
  { id: 'sign', name: '每日签到', reward: { points: 10, power: 5 }, icon: Calendar },
  { id: 'browse', name: '浏览5个话题', reward: { points: 20, power: 10 }, icon: Circle },
  { id: 'vote', name: '参与3次投票', reward: { points: 30, power: 15 }, icon: Circle },
  { id: 'upload', name: '上传1个佐证', reward: { points: 50, power: 25 }, icon: Circle },
  { id: 'comment', name: '评论5次', reward: { points: 25, power: 10 }, icon: Circle },
  { id: 'share', name: '分享话题', reward: { points: 30, power: 15 }, icon: Circle }
];

export function DailyTaskPage() {
  const navigate = useNavigate();
  const { addPoints, addPower } = useStore();
  const [completed, setCompleted] = useState<string[]>(['sign']);
  const [streak, setStreak] = useState(7);

  const handleTask = (taskId: string) => {
    if (completed.includes(taskId)) return;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      addPoints(task.reward.points);
      addPower(task.reward.power);
      setCompleted([...completed, taskId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">每日任务</h1>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-80">连续签到</p>
            <p className="text-2xl font-bold">{streak}天</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 mb-4">
          <h3 className="font-bold text-slate-100 mb-4">今日任务</h3>
          <div className="space-y-3">
            {tasks.map((task, i) => {
              const isDone = completed.includes(task.id);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleTask(task.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                    isDone ? 'bg-slate-700/50' : 'bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDone ? 'bg-green-500/20 text-green-400' : 'bg-violet-500/20 text-violet-400'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <task.icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDone ? 'text-slate-400' : 'text-slate-200'}`}>
                      {task.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      +{task.reward.points}积分 +{task.reward.power}战力
                    </p>
                  </div>
                  {!isDone && (
                    <button className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs rounded-full">
                      去完成
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <h3 className="font-bold text-slate-100 mb-3">任务说明</h3>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• 每日0点重置任务进度</li>
            <li>• 连续签到可获得额外奖励</li>
            <li>• 每日战力获取上限20点</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
