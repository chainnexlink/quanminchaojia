import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Coupon {
  id: string;
  name: string;
  type: 'discount' | 'cash';
  value: number;
  minSpend: number;
  status: 'active' | 'used' | 'expired';
  expireAt: string;
}

const mockCoupons: Coupon[] = [
  { id: '1', name: '全场9折券', type: 'discount', value: 10, minSpend: 100, status: 'active', expireAt: '2026-05-31' },
  { id: '2', name: '立减20豆', type: 'cash', value: 20, minSpend: 50, status: 'active', expireAt: '2026-05-15' },
  { id: '3', name: '免广告卡', type: 'cash', value: 50, minSpend: 0, status: 'used', expireAt: '2026-04-20' },
];

export function MyCouponsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all');

  const filtered = mockCoupons.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'active') return c.status === 'active';
    return c.status === 'used' || c.status === 'expired';
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = { active: 'bg-green-500/20 text-green-400', used: 'bg-slate-700 text-slate-500', expired: 'bg-red-500/20 text-red-400' };
    const labels: Record<string, string> = { active: '未使用', used: '已使用', expired: '已过期' };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">我的优惠券</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'used'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                filter === f ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/50'
              }`}
            >
              {f === 'all' ? '全部' : f === 'active' ? '未使用' : '已使用'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 ${c.status !== 'active' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-200">{c.name}</span>
                    {getStatusBadge(c.status)}
                  </div>
                  <p className="text-xs text-slate-500">
                    {c.type === 'discount' ? `满${c.minSpend}可用` : `满${c.minSpend}可用`}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                    <Clock className="w-3 h-3" />
                    <span>有效期至 {c.expireAt}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-violet-400">
                    {c.type === 'discount' ? `${c.value}%` : `${c.value}豆`}
                  </span>
                </div>
              </div>
              {c.status === 'active' && (
                <button onClick={() => navigate('/shop')} className="w-full mt-3 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg text-sm">
                  立即使用
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
