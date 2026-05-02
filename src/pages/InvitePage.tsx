import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Gift, Share2, Copy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function InvitePage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const inviteCode = 'ABC123';
  const stats = { invited: 12, rewarded: 180, pending: 3 };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: '全民嘲珈邀请',
      text: `快来加入全民嘲珈，我的邀请码是：${inviteCode}`,
      url: window.location.origin
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('分享内容已复制到剪贴板');
      }
    } catch (err) {
      console.log('分享取消');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">邀请好友</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
          <h2 className="text-slate-300 mb-4">我的邀请码</h2>
          <div className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between mb-4">
            <span className="text-2xl font-bold tracking-wider text-slate-100">{inviteCode}</span>
            <button onClick={handleCopy} className="flex items-center gap-1 text-violet-400">
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="text-sm">{copied ? '已复制' : '复制'}</span>
            </button>
          </div>
          <button onClick={handleShare} className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" /> 分享邀请
          </button>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-violet-400">{stats.invited}</p>
              <p className="text-xs text-slate-400">已邀请</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">¥{stats.rewarded}</p>
              <p className="text-xs text-slate-400">累计奖励</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
              <p className="text-xs text-slate-400">待激活</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2 text-slate-200">
            <Gift className="w-5 h-5 text-amber-400" /> 奖励规则
          </h3>
          <div className="space-y-2 text-sm text-slate-400">
            <p>1. 好友通过你的邀请码注册，你可获得¥5</p>
            <p>2. 好友完成首单，你再获得¥10</p>
            <p>3. 奖励可累计，上不封顶</p>
          </div>
        </div>
      </div>
    </div>
  );
}
