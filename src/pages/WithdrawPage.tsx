import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, AlertCircle, CheckCircle, Smartphone } from 'lucide-react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { isMiniProgram, openInApp } from '../services/platformService';

export function WithdrawPage() {
  const navigate = useNavigate();
  const { user, withdraw } = useStore();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const inMiniProgram = isMiniProgram();

  const minAmount = 100;
  const canWithdraw = (user?.cash_balance || 0) >= minAmount;

  const handleSubmit = async () => {
    if (!amount || !bankName || !cardNumber || !accountName) {
      showToast('请填写完整的提现信息', 'error');
      return;
    }
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      showToast('请输入有效的提现金额', 'error');
      return;
    }
    if (withdrawAmount < minAmount) {
      showToast(`最低提现金额为 ${minAmount} 元`, 'error');
      return;
    }
    if (withdrawAmount > (user?.cash_balance || 0)) {
      showToast('现金余额不足，无法提现', 'error');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await withdraw(withdrawAmount, {
        bank_name: bankName,
        card_number: cardNumber,
        account_name: accountName
      });
      setSubmitting(false);
      setSuccess(true);
      showToast(`提现申请 ¥${withdrawAmount.toFixed(2)} 已提交`, 'success');
    } catch (err) {
      setSubmitting(false);
      const msg = err instanceof Error ? err.message : '提现失败，请稍后重试';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100">提现申请已提交</h2>
          <p className="text-slate-400 mt-2">预计3-5个工作日到账</p>
          <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg">
            返回
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">提现申请</h1>
      </div>

      <div className="p-4">
        {inMiniProgram ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-amber-300 mb-2">小程序暂不支持提现</h3>
            <p className="text-sm text-slate-400 mb-4">
              根据平台规定，提现功能需在App中操作。<br />请打开「全民嘲家」App完成提现。
            </p>
            <button
              onClick={() => openInApp('withdraw')}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl"
            >
              打开App提现
            </button>
            <p className="text-xs text-slate-500 mt-3">如未安装App，请前往应用商店搜索「全民嘲家」</p>
          </div>
        ) : (
          <>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm opacity-80">可提现金额</span>
          </div>
          <div className="text-4xl font-bold">¥{(user?.cash_balance || 0).toFixed(2)}</div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">提现金额</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`最低 ${minAmount} 元`}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg outline-none focus:border-violet-500 text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">开户银行</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="如：中国工商银行"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg outline-none focus:border-violet-500 text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">银行卡号</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="请输入银行卡号"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg outline-none focus:border-violet-500 text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">开户姓名</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="请输入真实姓名"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg outline-none focus:border-violet-500 text-slate-200 placeholder-slate-500"
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!amount || !bankName || !cardNumber || !accountName || submitting}
          className="w-full mt-6 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '提交中...' : '确认提现'}
        </motion.button>

        <p className="text-xs text-slate-500 text-center mt-4">
          每月限提现1次，到账时间3-5个工作日
        </p>
          </>
        )}
      </div>
    </div>
  );
}
