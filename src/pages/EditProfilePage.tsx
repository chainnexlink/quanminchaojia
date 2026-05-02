import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { isValidPhone, sendSmsCode, verifySmsCode, getSmsCooldown } from '../services/smsService';

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useStore();
  const { showToast } = useToast();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsCooldown, setSmsCooldown] = useState(0);
  const [sendingSms, setSendingSms] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 倒计时
  useEffect(() => {
    if (smsCooldown <= 0) return;
    const timer = setInterval(() => {
      setSmsCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [smsCooldown]);

  const handleSendSms = useCallback(async () => {
    if (!isValidPhone(phone)) {
      showToast('请输入正确的11位手机号', 'error');
      return;
    }
    setSendingSms(true);
    const result = await sendSmsCode(phone, 'bindPhone');
    setSendingSms(false);
    if (result.success) {
      setSmsCooldown(result.cooldown);
      showToast('验证码已发送', 'success');
    } else {
      showToast(result.message, 'error');
    }
  }, [phone, showToast]);

  const handleVerifyPhone = useCallback(async () => {
    if (!smsCode) return;
    const result = await verifySmsCode(phone, smsCode, 'bindPhone');
    if (result.success) {
      setPhoneVerified(true);
      showToast('手机号验证成功', 'success');
    } else {
      showToast(result.message, 'error');
    }
  }, [phone, smsCode, showToast]);

  const handleSave = async () => {
    if (!nickname.trim()) {
      showToast('昵称不能为空', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        nickname: nickname.trim(),
        bio: bio.trim() || null,
        ...(phoneVerified && phone ? { phone } : {})
      });
      setSaving(false);
      setSaved(true);
      showToast('资料保存成功', 'success');
      setTimeout(() => {
        setSaved(false);
        navigate('/profile');
      }, 1000);
    } catch (err) {
      setSaving(false);
      showToast('保存失败，请稍后重试', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg flex-1 text-slate-100">编辑资料</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 bg-violet-500 text-white rounded-full text-sm font-medium disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-col items-center py-6">
          <div className="relative">
            <img
              src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}
              alt=""
              className="w-24 h-24 rounded-full border-4 border-slate-700 shadow-lg"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-3">点击更换头像</p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">昵称</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl outline-none focus:border-violet-500 text-slate-200 placeholder-slate-500"
              placeholder="请输入昵称"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">个性签名</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl outline-none focus:border-violet-500 text-slate-200 placeholder-slate-500 resize-none"
              placeholder="介绍一下自己..."
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">手机号</label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneVerified(false); }}
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl outline-none focus:border-violet-500 text-slate-200 placeholder-slate-500"
                placeholder="请输入手机号"
                maxLength={11}
              />
              <button
                onClick={handleSendSms}
                disabled={sendingSms || smsCooldown > 0 || !phone}
                className="px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingSms ? '发送中...' : smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码'}
              </button>
            </div>
            {phone && (smsCooldown > 0 || smsCode) && !phoneVerified && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl outline-none focus:border-violet-500 text-slate-200 placeholder-slate-500"
                  placeholder="请输入验证码"
                  maxLength={6}
                />
                <button
                  onClick={handleVerifyPhone}
                  disabled={!smsCode || smsCode.length < 6 || phoneVerified}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {phoneVerified ? '已验证' : '验证'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
        >
          <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center">
            <Check className="w-12 h-12 text-green-400 mb-2" />
            <p className="font-medium text-slate-200">保存成功</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
