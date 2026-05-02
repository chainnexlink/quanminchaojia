import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wallet, Gift, History, CreditCard, Users, CheckCircle, Clock, Package, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isMiniProgram, openInApp } from '../services/platformService';

interface Reward {
  id: string;
  type: 'cash' | 'physical' | 'points';
  category: 'creator' | 'activity' | 'invite' | 'daily';
  name: string;
  amount?: number;
  points?: number;
  status: 'claimable' | 'claimed' | 'shipped' | 'pending';
  date: string;
  description?: string;
}

import { useStore } from '../store';

const mockRewards: Reward[] = [
  { id: '1', type: 'cash', category: 'creator', name: '优质创作者奖励', amount: 88, status: 'claimable', date: '2026-04-28', description: '话题获得1000+投票' },
  { id: '2', type: 'physical', category: 'activity', name: '限定马克杯', status: 'shipped', date: '2026-04-25' },
  { id: '3', type: 'cash', category: 'invite', name: '邀请好友奖励', amount: 15, status: 'claimed', date: '2026-04-20', description: '好友完成首单' },
  { id: '4', type: 'points', category: 'daily', name: '每日签到奖励', points: 50, status: 'claimed', date: '2026-04-29' },
];

const exchangeRecords = [
  { id: '1', item: '免广告卡', points: 50, date: '2026-04-28' },
  { id: '2', item: '话题置顶券', points: 200, date: '2026-04-25' },
];

const inviteStats = {
  totalInvited: 12,
  totalReward: 180,
  pending: 3
};

export function RewardsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'rewards' | 'exchange' | 'invite'>('rewards');
  const [filter, setFilter] = useState<'all' | 'cash' | 'physical' | 'points'>('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const inMiniProgram = isMiniProgram();

  const filteredRewards = filter === 'all' ? mockRewards : mockRewards.filter(r => r.type === filter);
  const claimableCount = mockRewards.filter(r => r.status === 'claimable').length;

  const handleClaim = (reward: Reward) => {
    setSelectedReward(reward);
    setShowClaimModal(true);
  };

  const confirmClaim = () => {
    setShowClaimModal(false);
    setSelectedReward(null);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      claimable: 'bg-green-500/20 text-green-400',
      claimed: 'bg-slate-700 text-slate-400',
      shipped: 'bg-blue-500/20 text-blue-400',
      pending: 'bg-yellow-500/20 text-yellow-400'
    };
    const labels: Record<string, string> = { claimable: '可领取', claimed: '已领取', shipped: '已发货', pending: '处理中' };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>{labels[status]}</span>;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'cash': return <Wallet className="w-5 h-5" />;
      case 'physical': return <Package className="w-5 h-5" />;
      case 'points': return <Gift className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">奖励中心</h1>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm opacity-80">{inMiniProgram ? '累计奖励' : '可提现金额'}</p>
            <p className="text-2xl font-bold">{inMiniProgram ? '103辩豆' : '¥103.00'}</p>
          </div>
          {claimableCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {claimableCount}个待领取
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 p-4 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        {[
          { key: 'rewards', label: '我的奖励' },
          { key: 'exchange', label: '兑换记录' },
          { key: 'invite', label: '邀请奖励' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab.key ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'rewards' && (
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            {(['all', 'cash', 'physical', 'points'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  filter === f ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {f === 'all' ? '全部' : f === 'cash' ? (inMiniProgram ? '辩豆' : '现金') : f === 'physical' ? '实物' : '积分'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredRewards.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  if (item.type === 'cash') {
                    if (inMiniProgram) { openInApp('withdraw'); } else { navigate('/withdraw'); }
                  }
                }}
                className={`bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl ${item.type === 'cash' ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    item.type === 'cash' ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' :
                    item.type === 'physical' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                    'bg-gradient-to-br from-violet-400 to-purple-500 text-white'
                  }`}>
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-200">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-slate-500">{item.description}</p>
                    )}
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                  <div className="text-right">
                    {item.amount && <p className="font-bold text-green-400">¥{item.amount}</p>}
                    {item.points && <p className="font-bold text-purple-400">{item.points}豆</p>}
                    {getStatusBadge(item.status)}
                  </div>
                </div>
                {item.status === 'claimable' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClaim(item); }}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg text-sm font-medium"
                  >
                    立即领取
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'exchange' && (
        <div className="p-4 space-y-3">
          {exchangeRecords.map((record, i) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate('/shop')}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg flex items-center justify-center">
                  <History className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-200">{record.item}</p>
                  <p className="text-xs text-slate-500">{record.date}</p>
                </div>
              </div>
              <span className="text-amber-400 font-bold">-{record.points}豆</span>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'invite' && (
        <div className="p-4 space-y-4">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-400">{inviteStats.totalInvited}</p>
                <p className="text-xs text-slate-400">已邀请</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">¥{inviteStats.totalReward}</p>
                <p className="text-xs text-slate-400">累计奖励</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">{inviteStats.pending}</p>
                <p className="text-xs text-slate-400">待激活</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-medium">{inMiniProgram ? '邀请好友赢奖励' : '邀请好友赚现金'}</span>
            </div>
            <p className="text-sm opacity-90 mb-3">每邀请1位好友，最高可获得¥15奖励</p>
            <button
              onClick={() => navigate('/invite')}
              className="w-full py-2 bg-white/20 rounded-lg text-sm font-medium"
            >
              立即邀请
            </button>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl">
            <div className="p-4 border-b border-slate-700/50">
              <span className="font-medium text-sm text-slate-200">邀请记录</span>
            </div>
            <div className="p-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">暂无邀请记录</span>
            </div>
          </div>
        </div>
      )}

      {showClaimModal && selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowClaimModal(false)}>
          <motion.div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-slate-100">确认领取</h3>
              <p className="text-sm text-slate-400 mt-1">{selectedReward.name}</p>
              {selectedReward.amount && <p className="text-xl font-bold text-green-400 mt-2">¥{selectedReward.amount}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowClaimModal(false)} className="flex-1 py-2 bg-slate-700 text-slate-200 rounded-lg">取消</button>
              <button onClick={confirmClaim} className="flex-1 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg font-medium">确认领取</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
