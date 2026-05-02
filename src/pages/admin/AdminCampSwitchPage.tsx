import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, ArrowRightLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CampSwitch {
  id: string;
  userId: string;
  username: string;
  fromCamp: 'north' | 'south';
  toCamp: 'north' | 'south';
  reason: string;
  switchedAt: string;
}

const mockSwitches: CampSwitch[] = [
  { id: '1', userId: 'u1', username: '张三', fromCamp: 'north', toCamp: 'south', reason: '主动切换', switchedAt: '2026-04-29 10:30' },
  { id: '2', userId: 'u2', username: '李四', fromCamp: 'south', toCamp: 'north', reason: '系统调整', switchedAt: '2026-04-28 15:20' },
];

export function AdminCampSwitchPage() {
  const navigate = useNavigate();
  const [switches] = useState<CampSwitch[]>(mockSwitches);
  const [filter, setFilter] = useState<'all' | 'north' | 'south'>('all');

  const filtered = switches.filter(s =>
    filter === 'all' ? true : s.toCamp === filter
  );

  const northCount = switches.filter(s => s.toCamp === 'north').length;
  const southCount = switches.filter(s => s.toCamp === 'south').length;

  return (
    <div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Users size={16} />
              <span className="text-sm">北方阵营</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{northCount}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <Users size={16} />
              <span className="text-sm">南方阵营</span>
            </div>
            <p className="text-xl font-bold text-red-700">{southCount}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {(['all', 'north', 'south'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {f === 'all' ? '全部' : f === 'north' ? '北方' : '南方'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{s.username}</span>
                <span className="text-xs text-gray-400">{s.switchedAt}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded ${s.fromCamp === 'north' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                  {s.fromCamp === 'north' ? '北方' : '南方'}
                </span>
                <ArrowRightLeft size={14} className="text-gray-400" />
                <span className={`px-2 py-1 rounded ${s.toCamp === 'north' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                  {s.toCamp === 'north' ? '北方' : '南方'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{s.reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
