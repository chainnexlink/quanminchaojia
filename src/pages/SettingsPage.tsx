import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Lock, User, Trash2, LogOut, ChevronRight, Moon, MapPin, HelpCircle, Info, UserX, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { supabase } from '../supabase/client';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const { showToast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'confirm' | 'final'>('confirm');
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('已退出登录', 'success');
      navigate('/login', { replace: true });
    } catch {
      showToast('退出失败', 'error');
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('app-cache');
    showToast('缓存已清除', 'success');
  };

  const handleDeleteAccount = async () => {
    if (!user || user.id === 'guest') {
      showToast('游客无需注销账号', 'info');
      return;
    }
    setDeleting(true);
    try {
      // 删除用户相关数据
      await supabase.from('comments').delete().eq('user_id', user.id);
      await supabase.from('votes').delete().eq('user_id', user.id);
      await supabase.from('follows').delete().eq('follower_id', user.id);
      await supabase.from('follows').delete().eq('following_id', user.id);
      await supabase.from('notifications').delete().eq('user_id', user.id);
      await supabase.from('points_transactions').delete().eq('user_id', user.id);
      await supabase.from('cash_transactions').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.signOut();
      showToast('账号已注销，所有数据已删除', 'success');
      navigate('/login', { replace: true });
    } catch {
      showToast('注销失败，请稍后重试或联系客服', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteStep('confirm');
    }
  };

  const settingsGroups: { title: string; items: { icon: any; label: string; action: () => void; toggle?: boolean; toggleValue?: boolean; danger?: boolean }[] }[] = [
    {
      title: '账号设置',
      items: [
        { icon: User, label: '个人资料', action: () => navigate('/edit-profile') },
        { icon: Lock, label: '账号安全', action: () => navigate('/settings/security') },
        { icon: MapPin, label: '收货地址', action: () => navigate('/settings/address') }
      ]
    },
    {
      title: '应用设置',
      items: [
        { icon: Bell, label: '通知设置', action: () => navigate('/settings/notifications') },
        { icon: Moon, label: '深色模式', action: () => { setDarkMode(!darkMode); showToast(darkMode ? '已切换为浅色模式（当前仅支持深色）' : '已切换为深色模式', 'info'); }, toggle: true, toggleValue: darkMode }
      ]
    },
    {
      title: '其他',
      items: [
        { icon: HelpCircle, label: '帮助中心', action: () => navigate('/help') },
        { icon: Info, label: '关于我们', action: () => navigate('/about') },
        { icon: Trash2, label: '清除缓存', action: handleClearCache },
        { icon: LogOut, label: '退出登录', action: handleLogout, danger: true },
        { icon: UserX, label: '注销账号', action: () => setShowDeleteConfirm(true), danger: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">设置</h1>
      </div>

      <div className="p-4 space-y-4">
        {settingsGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden"
          >
            <h3 className="text-xs text-slate-500 font-medium px-4 pt-3 pb-2">{group.title}</h3>
            {group.items.map((item, i) => (
              <motion.button
                key={item.label}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3 ${
                  i !== group.items.length - 1 ? 'border-b border-slate-700/50' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  item.danger ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className={`flex-1 text-left ${item.danger ? 'text-red-400' : 'text-slate-200'}`}>
                  {item.label}
                </span>
                {item.toggle ? (
                  <div className={`w-11 h-6 rounded-full relative ${item.toggleValue ? 'bg-violet-500' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.toggleValue ? 'left-6' : 'left-1'}`} />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                )}
              </motion.button>
            ))}
          </motion.div>
        ))}
      </div>

      {/* 注销账号确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 w-full max-w-sm"
          >
            {deleteStep === 'confirm' ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">注销账号</h3>
                    <p className="text-xs text-slate-500">此操作不可撤销</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-slate-300">注销账号后，以下数据将被永久删除：</p>
                  <ul className="text-sm text-slate-400 space-y-1 ml-4">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" />个人资料和头像</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" />所有发布的评论和投票</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" />积分、现金余额和交易记录</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" />关注关系和通知</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeleteStep('confirm'); }}
                    className="flex-1 py-3 bg-slate-700 rounded-xl text-sm font-medium text-slate-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => setDeleteStep('final')}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-medium"
                  >
                    继续注销
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserX className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-100 mb-2">确认注销？</h3>
                  <p className="text-sm text-red-400">此操作将永久删除您的账号和所有数据，且无法恢复。</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeleteStep('confirm'); }}
                    className="flex-1 py-3 bg-slate-700 rounded-xl text-sm font-medium text-slate-200"
                  >
                    我再想想
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-medium disabled:opacity-50"
                  >
                    {deleting ? '注销中...' : '确认注销'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
