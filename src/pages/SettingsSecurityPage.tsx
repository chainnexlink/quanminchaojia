import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff, Shield, Smartphone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

export function SettingsSecurityPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      showToast('两次输入的密码不一致', 'error');
      return;
    }
    if (passwords.new.length < 6) {
      showToast('新密码至少6位', 'error');
      return;
    }
    showToast('密码修改成功', 'success');
    setShowPasswordForm(false);
    setPasswords({ old: '', new: '', confirm: '' });
  };

  const securityItems = [
    { icon: Lock, label: '修改密码', action: () => setShowPasswordForm(true), status: '' },
    { icon: Smartphone, label: '手机绑定', action: () => showToast('请前往个人资料页面绑定手机', 'info'), status: '已绑定' },
    { icon: Mail, label: '邮箱绑定', action: () => showToast('请前往个人资料页面绑定邮箱', 'info'), status: '未绑定' },
    { icon: Shield, label: '账号保护', action: () => showToast('账号保护已开启', 'success'), status: '已开启' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">账号安全</h1>
      </div>

      <div className="p-4 space-y-3">
        {securityItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={item.action}
            className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <item.icon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 text-left">
              <span className="font-medium text-slate-200">{item.label}</span>
            </div>
            {item.status && (
              <span className="text-sm text-slate-500">{item.status}</span>
            )}
          </motion.button>
        ))}
      </div>

      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 w-full max-w-sm"
          >
            <h3 className="font-bold text-lg mb-4 text-slate-100">修改密码</h3>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="原密码"
                  value={passwords.old}
                  onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm pr-10 text-slate-200 placeholder-slate-500"
                />
                <button
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="新密码"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm pr-10 text-slate-200 placeholder-slate-500"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <input
                type="password"
                placeholder="确认新密码"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordForm(false)}
                className="flex-1 py-2 bg-slate-700 rounded-lg text-sm text-slate-200"
              >
                取消
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-2 bg-violet-500 text-white rounded-lg text-sm"
              >
                确认修改
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
