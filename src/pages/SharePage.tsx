import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Link2, MessageCircle, Users, Share2, Download, Check, Swords, Trophy, Flame } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

export function SharePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { topics, user } = useStore();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const topic = topics.find(t => t.id === id);
  const shareUrl = `${window.location.origin}/#/topic/${id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast('链接已复制到剪贴板', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      showToast('链接已复制到剪贴板', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async (platform: string) => {
    const title = topic?.title || '全民嘲家';
    const text = topic
      ? `${topic.camps?.[0]} vs ${topic.camps?.[1]}，快来参与讨论！`
      : '快来全民嘲家参与辩论！';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        showToast('分享成功', 'success');
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`);
      showToast(`内容已复制，请打开${platform}粘贴分享`, 'info');
    }
  };

  const handleSavePoster = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        background: '#0f172a',
        scale: 2,
      } as any);
      const link = document.createElement('a');
      link.download = `全民嘲家-${topic?.title || '分享'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('海报已保存', 'success');
    } catch {
      showToast('保存海报需要网络支持，请截图保存', 'info');
    }
  };

  const campPercent = (() => {
    if (!topic?.raw_votes) return 50;
    const total = topic.raw_votes.reduce((a, b) => a + b, 0);
    return total === 0 ? 50 : Math.round((topic.raw_votes[0] / total) * 100);
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">分享话题</h1>
      </div>

      <div className="p-4">
        {/* Share Card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white mb-6 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            {/* Brand */}
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-2 flex items-center justify-center">
                <Swords className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-lg font-bold">全民嘲家</h2>
              <p className="text-xs opacity-70">AI 裁判辩论平台</p>
            </div>

            {/* Topic Info */}
            {topic ? (
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {topic.debate_type === 'local' ? '同城' : '文化'}
                  </span>
                  {(topic.heat ?? 0) > 80 && (
                    <span className="text-xs bg-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" /> 热门
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-3">{topic.title}</h3>

                {/* Camps & Votes */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-300" />
                      {topic.camps?.[0]}
                    </span>
                    <span>{topic.raw_votes?.[0] || 0} 票</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full"
                      style={{ width: `${campPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{topic.camps?.[1]}</span>
                    <span>{topic.raw_votes?.[1] || 0} 票</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 text-xs opacity-80">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {topic.total_participants} 人参与
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 mb-4 text-center">
                <p className="text-sm opacity-80">快来全民嘲家参与热门辩论！</p>
              </div>
            )}

            {/* User Invite */}
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
              <img
                src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'guest'}`}
                alt=""
                className="w-10 h-10 rounded-full border-2 border-white/30"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.nickname || '游客'}</p>
                <p className="text-xs opacity-70">邀请你来参与辩论</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Share Actions */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: copied ? Check : Link2, label: copied ? '已复制' : '复制链接', action: handleCopyLink, active: copied },
            { icon: MessageCircle, label: '微信', action: () => handleNativeShare('微信'), active: false },
            { icon: Users, label: '朋友圈', action: () => handleNativeShare('朋友圈'), active: false },
            { icon: Share2, label: 'QQ', action: () => handleNativeShare('QQ'), active: false }
          ].map((item) => (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.9 }}
              onClick={item.action}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                item.active
                  ? 'bg-green-500/20 border border-green-500/50'
                  : 'bg-slate-800/80 border border-slate-700/50'
              }`}>
                <item.icon className={`w-6 h-6 ${item.active ? 'text-green-400' : 'text-slate-300'}`} />
              </div>
              <span className={`text-xs ${item.active ? 'text-green-400' : 'text-slate-400'}`}>{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Save Poster */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSavePoster}
          className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          保存海报
        </motion.button>

        {/* Direct link to topic */}
        {topic && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/topic/${topic.id}`)}
            className="w-full mt-3 py-4 bg-slate-800/80 border border-slate-700/50 text-slate-300 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            直接进入话题
          </motion.button>
        )}
      </div>
    </div>
  );
}
