import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Bell, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'broadcast';
  target: 'all' | 'active';
  sentAt: string;
  readCount: number;
  totalCount: number;
}

const mockNotifications: Notification[] = [
  { id: '1', title: '系统维护通知', content: '今晚2点进行系统维护', type: 'system', target: 'all', sentAt: '2026-04-29 10:00', readCount: 12580, totalCount: 12580 },
  { id: '2', title: '新功能上线', content: 'AI裁判功能已上线', type: 'broadcast', target: 'active', sentAt: '2026-04-28 15:30', readCount: 8900, totalCount: 12000 },
];

export function AdminNotificationsPage() {
  const navigate = useNavigate();
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [showSendModal, setShowSendModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'broadcast' as 'system' | 'broadcast',
    target: 'all' as 'all' | 'active'
  });

  const handleSend = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    setShowSendModal(false);
    setFormData({ title: '', content: '', type: 'broadcast', target: 'all' });
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowSendModal(true)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
        >
          <Send size={16} /> 发送通知
        </button>
      </div>

      <div className="p-4 space-y-3">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bell size={18} className={n.type === 'system' ? 'text-red-500' : 'text-blue-500'} />
                <span className="font-medium">{n.title}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                n.type === 'system' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {n.type === 'system' ? '系统' : '广播'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{n.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {n.target === 'all' ? '全部用户' : '活跃用户'}
                </span>
                <span>{n.sentAt}</span>
              </div>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle size={12} /> 阅读率 {Math.round((n.readCount / n.totalCount) * 100)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowSendModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4">发送通知</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="输入通知标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="输入通知内容"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="broadcast">广播</option>
                    <option value="system">系统</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目标</label>
                  <select
                    value={formData.target}
                    onChange={e => setFormData({ ...formData, target: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">全部用户</option>
                    <option value="active">活跃用户</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 py-2 bg-gray-100 rounded-lg text-sm"
              >
                取消
              </button>
              <button
                onClick={handleSend}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                发送
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
