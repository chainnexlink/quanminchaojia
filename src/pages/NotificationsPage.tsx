import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, MessageSquare, Trophy, Sparkles, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

const mockNotifications = [
  { id: '1', type: 'ai', title: 'AI裁判结果', content: '您的召唤已生成结果，AI倾向北方阵营', time: '10分钟前', read: false },
  { id: '2', type: 'debate', title: '辩论已结束', content: '您参与的"豆腐脑甜咸之争"已结束，获得50积分', time: '2小时前', read: false },
  { id: '3', type: 'cash', title: '辩豆奖励到账', content: '话题热度奖励 50辩豆 已到账', time: '昨天', read: true },
  { id: '4', type: 'follow', title: '关注的人发布新话题', content: '小明发布了新话题"火锅蘸料大战"', time: '2天前', read: true },
];

export function NotificationsPage() {
  const navigate = useNavigate();
  const { user, notifications: storeNotifications, fetchNotifications, markNotificationRead } = useStore();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);

  useEffect(() => {
    if (user && user.id !== 'guest') {
      fetchNotifications().then(() => {
        // If store has notifications, merge them
        // For now we use mock + store approach
      });
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await markNotificationRead(id);
    } catch (err) {
      // Fallback to local state update only
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Sparkles className="w-5 h-5 text-violet-400" />;
      case 'debate': return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'cash': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <MessageSquare className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleClick = (n: typeof mockNotifications[0]) => {
    markAsRead(n.id);
    if (n.type === 'ai') navigate('/topics');
    else if (n.type === 'debate') navigate('/activity');
    else if (n.type === 'cash') navigate('/profile/wallet');
    else navigate('/topics');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg flex items-center gap-2 text-slate-100">
          <Bell className="w-5 h-5" /> 消息通知
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </h1>
      </div>

      <div className="p-4 space-y-3">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleClick(n)}
            className={`bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 cursor-pointer ${!n.read ? 'border-l-4 border-l-violet-500' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center">
                {getIcon(n.type)}
              </div>
              <div className="flex-1" onClick={() => handleClick(n)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">{n.title}</h3>
                  {!n.read && <span className="w-2 h-2 bg-red-400 rounded-full" />}
                </div>
                <p className="text-sm text-slate-400 mt-1">{n.content}</p>
                <span className="text-xs text-slate-500 mt-2">{n.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
