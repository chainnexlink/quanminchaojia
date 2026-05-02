import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Withdrawal {
  id: string;
  userId: string;
  username: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  rejectReason?: string;
}

const mockWithdrawals: Withdrawal[] = [
  {
    id: '1',
    userId: 'u1',
    username: '用户A',
    amount: 500,
    bankName: '工商银行',
    bankAccount: '6222 **** **** 8888',
    accountHolder: '张三',
    status: 'pending',
    createdAt: '2026-04-29 10:30',
  },
  {
    id: '2',
    userId: 'u2',
    username: '用户B',
    amount: 1000,
    bankName: '建设银行',
    bankAccount: '6217 **** **** 6666',
    accountHolder: '李四',
    status: 'approved',
    createdAt: '2026-04-28 15:20',
    processedAt: '2026-04-28 16:00',
  },
  {
    id: '3',
    userId: 'u3',
    username: '用户C',
    amount: 200,
    bankName: '招商银行',
    bankAccount: '6225 **** **** 9999',
    accountHolder: '王五',
    status: 'rejected',
    createdAt: '2026-04-27 09:00',
    processedAt: '2026-04-27 10:30',
    rejectReason: '银行卡信息有误',
  },
];

export function AdminWithdrawalsPage() {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredWithdrawals = withdrawals.filter(w =>
    filter === 'all' ? true : w.status === filter
  );

  const handleApprove = (id: string) => {
    setWithdrawals(prev => prev.map(w =>
      w.id === id ? { ...w, status: 'approved', processedAt: new Date().toISOString() } : w
    ));
    setSelectedId(null);
  };

  const handleReject = (id: string) => {
    setWithdrawals(prev => prev.map(w =>
      w.id === id ? { ...w, status: 'rejected', processedAt: new Date().toISOString(), rejectReason: '审核不通过' } : w
    ));
    setSelectedId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 text-amber-600 text-xs"><Clock size={12} />待审核</span>;
      case 'approved':
        return <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle size={12} />已通过</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-600 text-xs"><XCircle size={12} />已拒绝</span>;
      default:
        return null;
    }
  };

  return (
    <div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {f === 'all' ? '全部' : f === 'pending' ? '待审核' : f === 'approved' ? '已通过' : '已拒绝'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredWithdrawals.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">{w.username}</p>
                  <p className="text-xs text-gray-500">{w.createdAt}</p>
                </div>
                <span className="text-lg font-bold text-blue-600">¥{w.amount}</span>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <p>{w.bankName}</p>
                <p>{w.bankAccount}</p>
                <p className="text-xs text-gray-400">{w.accountHolder}</p>
              </div>

              <div className="flex justify-between items-center">
                {getStatusBadge(w.status)}
                {w.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(w.id)}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded-full"
                    >
                      通过
                    </button>
                    <button
                      onClick={() => handleReject(w.id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded-full"
                    >
                      拒绝
                    </button>
                  </div>
                )}
              </div>

              {w.rejectReason && (
                <p className="text-xs text-red-500 mt-2">原因: {w.rejectReason}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
