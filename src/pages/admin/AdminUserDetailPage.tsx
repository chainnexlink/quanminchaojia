import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, MessageSquare, Vote, DollarSign, Coins, Clock, Ban, RotateCcw, Edit3 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface UserDetail {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'active' | 'banned';
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
  points: number;
  cashBalance: number;
  totalPower: number;
}

const mockUser: UserDetail = {
  id: '1',
  username: '张三',
  email: 'zhangsan@meoo.local',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  status: 'active',
  role: 'user',
  createdAt: '2024-01-15',
  lastLogin: '2026-04-29 10:30',
  points: 1250,
  cashBalance: 580,
  totalPower: 3200
};

const mockTopics = [
  { id: 't1', title: '豆腐脑甜咸之争', votes: 156, createdAt: '2026-04-20' },
  { id: 't2', title: '南北供暖差异', votes: 89, createdAt: '2026-04-18' }
];

const mockVotes = [
  { id: 'v1', topicTitle: '豆腐脑甜咸之争', camp: '甜党', points: 0, time: '2026-04-20 14:30' },
  { id: 'v2', topicTitle: '南北供暖差异', camp: '暖气派', points: 50, time: '2026-04-18 09:00' }
];

const mockWithdrawals = [
  { id: 'w1', amount: 500, status: 'approved', time: '2026-04-15' },
  { id: 'w2', amount: 200, status: 'pending', time: '2026-04-28' }
];

const mockPointsLog = [
  { id: 'p1', type: 'earn', amount: 100, reason: '每日任务', time: '2026-04-29' },
  { id: 'p2', type: 'spend', amount: -20, reason: 'AI评判', time: '2026-04-28' }
];

export function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user] = useState<UserDetail>(mockUser);
  const [activeTab, setActiveTab] = useState<'topics' | 'votes' | 'withdrawals' | 'points'>('topics');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  const handleBan = () => {
    setShowBanModal(false);
  };

  return (
    <div>

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-4 mb-4">
            <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <h2 className="text-lg font-bold">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {user.status === 'active' ? '正常' : '已封禁'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                  {user.role === 'admin' ? '管理员' : '用户'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-t">
            <div className="text-center">
              <p className="text-lg font-bold text-amber-600">{user.points}</p>
              <p className="text-xs text-gray-500">辩豆</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">¥{user.cashBalance}</p>
              <p className="text-xs text-gray-500">现金</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">{user.totalPower}</p>
              <p className="text-xs text-gray-500">战力</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <button onClick={() => setShowEditModal(true)} className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm flex items-center justify-center gap-1">
              <Edit3 className="w-4 h-4" /> 编辑资料
            </button>
            <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-1">
              <RotateCcw className="w-4 h-4" /> 重置密码
            </button>
            <button onClick={() => setShowBanModal(true)} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm flex items-center justify-center gap-1">
              <Ban className="w-4 h-4" /> {user.status === 'active' ? '封禁' : '解封'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b">
            {[
              { key: 'topics', label: '话题', icon: MessageSquare },
              { key: 'votes', label: '投票', icon: Vote },
              { key: 'withdrawals', label: '提现', icon: DollarSign },
              { key: 'points', label: '积分', icon: Coins }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1 ${
                  activeTab === tab.key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === 'topics' && (
              <div className="space-y-3">
                {mockTopics.map(topic => (
                  <div key={topic.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">{topic.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{topic.votes}票 · {topic.createdAt}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'votes' && (
              <div className="space-y-3">
                {mockVotes.map(vote => (
                  <div key={vote.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">{vote.topicTitle}</p>
                    <p className="text-xs text-gray-500 mt-1">{vote.camp} · {vote.points > 0 ? `+${vote.points}豆` : '免费'} · {vote.time}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'withdrawals' && (
              <div className="space-y-3">
                {mockWithdrawals.map(w => (
                  <div key={w.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">¥{w.amount}</p>
                      <p className="text-xs text-gray-500">{w.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${w.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {w.status === 'approved' ? '已通过' : '待审核'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'points' && (
              <div className="space-y-3">
                {mockPointsLog.map(log => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{log.reason}</p>
                      <p className="text-xs text-gray-500">{log.time}</p>
                    </div>
                    <span className={`font-bold ${log.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {log.amount > 0 ? '+' : ''}{log.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showBanModal && (
        <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold mb-4">{user.status === 'active' ? '封禁用户' : '解封用户'}</h3>
            <p className="text-sm text-gray-600 mb-4">确定要{user.status === 'active' ? '封禁' : '解封'}用户 {user.username} 吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setShowBanModal(false)} className="flex-1 py-2 bg-gray-100 rounded-lg">取消</button>
              <button onClick={handleBan} className="flex-1 py-2 bg-red-500 text-white rounded-lg">确定</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
