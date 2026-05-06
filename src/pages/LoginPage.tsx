import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowLeft, Shield } from 'lucide-react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useStore();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim() && password.trim() && !loading;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await login(email, password);
      showToast('登录成功', 'success');
      navigate('/home', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '登录失败';
      if (msg.includes('Invalid login')) {
        showToast('邮箱或密码错误', 'error');
      } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed') || msg.includes('timeout') || msg.includes('CORS')) {
        showToast('网络连接异常，已进入游客模式', 'info');
        navigate('/home', { replace: true });
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    showToast('以游客身份浏览', 'info');
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="px-4 py-3 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      <div className="px-6 pt-8 pb-8">
        {/* Logo & Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <span className="text-3xl font-black text-white">嘲</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">欢迎回来</h1>
          <p className="text-slate-400 text-sm">登录全民嘲家，继续你的辩论之旅</p>
        </motion.div>

        <div className="space-y-4">
          {/* Email */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="text-xs text-slate-500 mb-1.5 block">邮箱</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <label className="text-xs text-slate-500 mb-1.5 block">密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full pl-11 pr-12 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500 transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={!canSubmit}
            className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                登录
              </>
            )}
          </motion.button>

          {/* Guest Login */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGuestLogin}
            className="w-full py-3.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl font-medium hover:bg-slate-700 transition-colors"
          >
            游客模式浏览
          </motion.button>

          {/* Security */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-2">
            <Shield className="w-3 h-3" />
            <span>信息加密传输，保障账号安全</span>
          </motion.div>

          {/* Register Link */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-center text-sm text-slate-400 mt-6">
            还没有账号？
            <span onClick={() => navigate('/register')} className="text-violet-400 font-medium cursor-pointer ml-1">立即注册</span>
          </motion.p>

          {/* Bottom Links */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-4 mt-4">
            <span onClick={() => navigate('/terms')} className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">用户协议</span>
            <span className="text-slate-700">|</span>
            <span onClick={() => navigate('/privacy')} className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">隐私政策</span>
            <span className="text-slate-700">|</span>
            <span onClick={() => navigate('/help')} className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">帮助中心</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
