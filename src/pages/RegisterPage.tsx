import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, ArrowLeft, CheckCircle, Shield } from 'lucide-react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { supabaseUrl } from '../supabase/client';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, login } = useStore();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isPasswordMatch = password === confirmPassword;
  const isNicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const canSubmit = isEmailValid && isPasswordValid && isPasswordMatch && isNicknameValid && agreeTerms && !loading;

  const handleRegister = async () => {
    if (!canSubmit) return;
    // 原生环境下 Supabase 不可用，直接进入游客模式
    if (supabaseUrl.includes('localhost')) {
      showToast('已进入游客模式', 'info');
      navigate('/home', { replace: true });
      return;
    }
    setLoading(true);
    try {
      await register(email, password, nickname.trim());
      await login(email, password);
      setStep('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '注册失败，请重试';
      const lowerMsg = msg.toLowerCase();
      if (msg.includes('already registered')) {
        showToast('该邮箱已注册，请直接登录', 'error');
      } else if (lowerMsg.includes('fetch') || lowerMsg.includes('network') || lowerMsg.includes('failed') || lowerMsg.includes('timeout') || lowerMsg.includes('cors') || lowerMsg.includes('load')) {
        showToast('网络连接异常，已进入游客模式', 'info');
        navigate('/home', { replace: true });
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-100 mb-2"
        >
          注册成功！
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-sm mb-8 text-center"
        >
          欢迎加入全民嘲家，开始你的辩论之旅
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="w-full max-w-xs py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25"
        >
          进入首页
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="px-4 py-3 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      <div className="px-6 pt-4 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">创建账号</h1>
          <p className="text-slate-400 text-sm mb-8">加入全民嘲家，让每一次争论都有价值</p>
        </motion.div>

        <div className="space-y-4">
          {/* Nickname */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="text-xs text-slate-500 mb-1.5 block">昵称</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="2-12个字符"
                maxLength={12}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500 transition-colors"
              />
              {nickname && (
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs ${isNicknameValid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {nickname.trim().length}/12
                </span>
              )}
            </div>
          </motion.div>

          {/* Email */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
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
              {email && !isEmailValid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-400">格式错误</span>
              )}
            </div>
          </motion.div>

          {/* Password */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="text-xs text-slate-500 mb-1.5 block">密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="至少6位密码"
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

          {/* Confirm Password */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <label className="text-xs text-slate-500 mb-1.5 block">确认密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500 transition-colors"
              />
              {confirmPassword && !isPasswordMatch && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-400">密码不一致</span>
              )}
            </div>
          </motion.div>

          {/* Terms */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-start gap-3 pt-2">
            <button
              onClick={() => setAgreeTerms(!agreeTerms)}
              className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                agreeTerms ? 'bg-violet-500 border-violet-500' : 'border-slate-600'
              }`}
            >
              {agreeTerms && <CheckCircle className="w-3 h-3 text-white" />}
            </button>
            <p className="text-xs text-slate-400 leading-relaxed">
              我已阅读并同意
              <span onClick={() => navigate('/terms')} className="text-violet-400 cursor-pointer"> 《用户协议》</span>
              和
              <span onClick={() => navigate('/privacy')} className="text-violet-400 cursor-pointer"> 《隐私政策》</span>
            </p>
          </motion.div>

          {/* Submit */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRegister}
            disabled={!canSubmit}
            className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                注册
              </>
            )}
          </motion.button>

          {/* Security Notice */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-2">
            <Shield className="w-3 h-3" />
            <span>信息加密传输，保障账号安全</span>
          </motion.div>

          {/* Login Link */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="text-center text-sm text-slate-400 mt-6">
            已有账号？
            <span onClick={() => navigate('/login')} className="text-violet-400 font-medium cursor-pointer ml-1">立即登录</span>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
