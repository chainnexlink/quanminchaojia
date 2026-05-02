import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Coins, DollarSign, History, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface WalletData {
  userId: string;
  username: string;
  points: number;
  cash: number;
  frozenPoints: number;
  frozenCash: number;
}

const mockWallet: WalletData = {
  userId: '1',
  username: '张三',
  points: 1250,
  cash: 580,
  frozenPoints: 0,
  frozenCash: 0
};

const mockTransactions = [
  { id: '1', type: 'points', amount: 100, action: 'income', reason: '每日任务', time: '2026-04-29 10:30' },
  { id: '2', type: 'cash', amount: 50, action: 'income', reason: '话题奖励', time: '2026-04-28 15:20' },
];

export function AdminProfileWalletPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletData>(mockWallet);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustType, setAdjustType] = useState<'points' | 'cash'>('points');
  const [adjustAction, setAdjustAction] = useState<'add' | 'deduct'>('add');
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');

  const handleAdjust = () => {
    if (amount <= 0) return;
    setWallet(prev => {
      const field = adjustType === 'points' ? 'points' : 'cash';
      const delta = adjustAction === 'add' ? amount : -amount;
      return { ...prev, [field]: Math.max(0, prev[field] + delta) };
    });
    setShowAdjustModal(false);
    setAmount(0);
    setReason('');
  };

  return (
    <div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-medium mb-4">{wallet.username}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Coins className="w-4 h-4" />
                <span className="text-sm">辩豆</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{wallet.points}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">现金</span>
              </div>
              <p className="text-2xl font-bold text-green-700">¥{wallet.cash}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl font-medium"
          >
            调整资产
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500" />
            <span className="font-medium">交易记录</span>
          </div>
          {mockTransactions.map(t => (
            <div key={t.id} className="p-4 border-b last:border-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{t.reason}</p>
                  <p className="text-xs text-gray-400">{t.time}</p>
                </div>
                <span className={`font-bold ${t.action === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.action === 'income' ? '+' : '-'}{t.type === 'cash' ? '¥' : ''}{t.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold mb-4">调整资产</h3>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAdjustType('points')}
                className={`flex-1 py-2 rounded-lg text-sm ${adjustType === 'points' ? 'bg-amber-500 text-white' : 'bg-gray-100'}`}
              >
                辩豆
              </button>
              <button
                onClick={() => setAdjustType('cash')}
                className={`flex-1 py-2 rounded-lg text-sm ${adjustType === 'cash' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
              >
                现金
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAdjustAction('add')}
                className={`flex-1 py-2 rounded-lg text-sm ${adjustAction === 'add' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              >
                <Plus className="w-4 h-4 inline mr-1" />增加
              </button>
              <button
                onClick={() => setAdjustAction('deduct')}
                className={`flex-1 py-2 rounded-lg text-sm ${adjustAction === 'deduct' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
              >
                <Minus className="w-4 h-4 inline mr-1" />扣除
              </button>
            </div>
            <input
              type="number"
              placeholder="金额"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border rounded-xl mb-3"
            />
            <input
              type="text"
              placeholder="原因"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowAdjustModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl">取消</button>
              <button onClick={handleAdjust} className="flex-1 py-3 bg-blue-500 text-white rounded-xl">确认</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
