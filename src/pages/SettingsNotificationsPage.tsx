import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, MessageSquare, Heart, TrendingUp, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

interface NotificationSetting {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  enabled: boolean;
}

export function SettingsNotificationsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: '1', icon: MessageSquare, label: '评论回复', description: '有人回复你的评论时通知', enabled: true },
    { id: '2', icon: Heart, label: '点赞', description: '有人点赞你的内容时通知', enabled: true },
    { id: '3', icon: Bell, label: '系统通知', description: '系统公告和重要更新', enabled: true },
    { id: '4', icon: TrendingUp, label: '话题动态', description: '关注话题有新动态时通知', enabled: false },
    { id: '5', icon: Gift, label: '活动提醒', description: '新活动和奖励提醒', enabled: true },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">通知设置</h1>
      </div>

      <div className="p-4 space-y-3">
        {settings.map((setting, index) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <setting.icon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <span className="font-medium text-slate-200">{setting.label}</span>
              <p className="text-xs text-slate-500">{setting.description}</p>
            </div>
            <button
              onClick={() => toggleSetting(setting.id)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                setting.enabled ? 'bg-violet-500' : 'bg-slate-600'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  setting.enabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="p-4">
        <button
          onClick={() => showToast('通知设置已保存', 'success')}
          className="w-full py-3 bg-violet-500 text-white rounded-xl font-medium"
        >
          保存设置
        </button>
      </div>
    </div>
  );
}
