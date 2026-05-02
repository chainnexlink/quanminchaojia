import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, MessageCircle, Settings, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'system' | 'private';
  title: string;
  content: string;
  time: string;
  unread: boolean;
  avatar?: string;
}

const mockMessages: Message[] = [
  { id: '1', type: 'system', title: '系统通知', content: '您的话题已通过审核', time: '10分钟前', unread: true },
  { id: '2', type: 'private', title: '用户A', content: '你好，对这个话题很感兴趣', time: '1小时前', unread: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
  { id: '3', type: 'system', title: '奖励到账', content: '您的创作奖励已到账', time: '昨天', unread: false },
];

export function MessagesPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'private'>('all');

  const filtered = messages.filter(m => activeTab === 'all' ? true : m.type === activeTab);

  const markRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
  };

  const deleteMsg = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">消息中心</h1>
          <button onClick={() => navigate('/settings')} className="ml-auto p-2 text-slate-400 hover:bg-slate-700/50 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-4 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        {['all', 'system', 'private'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {tab === 'all' ? '全部' : tab === 'system' ? '系统' : '私信'}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {filtered.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 ${msg.unread ? 'border-l-4 border-l-violet-500' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                msg.type === 'system' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-700'
              }`}>
                {msg.type === 'system' ? <Bell className="w-5 h-5" /> : 
                 <img src={msg.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} className="w-full h-full rounded-full" />}
              </div>
              <div className="flex-1 cursor-pointer" onClick={() => msg.type === 'private' ? navigate(`/user/${msg.id}`) : navigate('/notifications')}>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200">{msg.title}</span>
                  {msg.unread && <span className="w-2 h-2 bg-red-400 rounded-full" />}
                </div>
                <p className="text-sm text-slate-400 mt-1">{msg.content}</p>
                <p className="text-xs text-slate-500 mt-2">{msg.time}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {msg.unread && (
                <button onClick={() => markRead(msg.id)} className="flex-1 py-2 bg-violet-500/20 text-violet-400 rounded-lg text-sm">
                  <CheckCircle className="w-4 h-4 inline mr-1" />已读
                </button>
              )}
              <button onClick={() => deleteMsg(msg.id)} className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm">
                <Trash2 className="w-4 h-4 inline mr-1" />删除
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
