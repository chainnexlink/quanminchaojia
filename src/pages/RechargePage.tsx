import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Coins, CheckCircle, Smartphone, Shield, Zap, Crown, Apple, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { rechargePackages, type RechargePackage, type PaymentMethod, confirmPaymentSuccess } from '../services/paymentService';
import { isMiniProgram, openInApp, isIOSApp, isIOS } from '../services/platformService';
import { isNativeIOS, initIAP, purchaseIAP } from '../services/iapService';

// 套餐图标映射
const packageIcons: Record<string, typeof Coins> = {
  'pkg_6': Coins,
  'pkg_30': Coins,
  'pkg_68': Zap,
  'pkg_128': Zap,
  'pkg_328': Crown,
  'pkg_648': Crown,
};

// 套餐渐变色
const packageColors: Record<string, string> = {
  'pkg_6': 'from-slate-600 to-slate-500',
  'pkg_30': 'from-blue-600 to-cyan-500',
  'pkg_68': 'from-violet-600 to-purple-500',
  'pkg_128': 'from-amber-500 to-orange-500',
  'pkg_328': 'from-rose-500 to-pink-500',
  'pkg_648': 'from-yellow-500 to-amber-400',
};

// 标签颜色
const tagColors: Record<string, string> = {
  '热门': 'bg-blue-500',
  '超值': 'bg-violet-500',
  '最划算': 'bg-amber-500',
  '至尊': 'bg-gradient-to-r from-yellow-400 to-amber-500',
};

// 后端 API 地址
const API_BASE = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3267/api';

export function RechargePage() {
  const navigate = useNavigate();
  const { user } = useStore();
  const { showToast } = useToast();
  const [selectedPkg, setSelectedPkg] = useState<RechargePackage | null>(null);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('wechat');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const inMiniProgram = isMiniProgram();
  const useAppleIAP = isNativeIOS();
  const inIOSApp = useAppleIAP || isIOSApp() || isIOS();
  const [iapReady, setIapReady] = useState(false);

  // iOS 环境初始化 IAP
  useEffect(() => {
    if (useAppleIAP) {
      initIAP().then(ok => setIapReady(ok)).catch(() => setIapReady(false));
    }
  }, [useAppleIAP]);

  const handleRecharge = async () => {
    if (!selectedPkg || !user) return;

    setSubmitting(true);
    try {
      // iOS 原生环境使用 Apple IAP
      if (useAppleIAP) {
        const result = await purchaseIAP(selectedPkg.id);
        if (result.success) {
          const totalPoints = selectedPkg.points + selectedPkg.bonus;
          await confirmPaymentSuccess(result.transactionId || '', user.id, totalPoints);
          setOrderId(result.transactionId || '');
          setOrderSuccess(true);
          showToast('充值成功！积分已到账', 'success');
        } else {
          if (result.error !== '已取消购买') {
            showToast(result.error || '购买失败', 'error');
          }
        }
        return;
      }

      // 非 iOS 环境使用第三方支付
      const response = await fetch(`${API_BASE}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Timestamp': String(Date.now()),
        },
        body: JSON.stringify({
          userId: user.id,
          packageId: selectedPkg.id,
          method: payMethod,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '创建订单失败');
      }

      setOrderId(data.orderId);
      setOrderSuccess(true);
      showToast('订单已创建，等待支付对接', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '充值失败，请稍后重试';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 支付成功后的确认页
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            {useAppleIAP ? '充值成功' : '订单已创建'}
          </h2>
          <p className="text-slate-400 mt-2">
            {selectedPkg?.name} - {selectedPkg && selectedPkg.points + selectedPkg.bonus} 积分
          </p>
          {orderId && <p className="text-xs text-slate-500 mt-1">交易号：{orderId}</p>}
          <p className="text-sm text-amber-400 mt-4">
            {useAppleIAP ? '积分已到账，感谢您的支持！' : '支付确认后积分将自动到账'}
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { setOrderSuccess(false); setSelectedPkg(null); }}
              className="flex-1 py-3 bg-slate-700 text-slate-200 rounded-xl font-semibold"
            >
              继续充值
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold"
            >
              返回
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* 顶部导航 */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">积分充值</h1>
      </div>

      <div className="p-4">
        {/* 小程序引导 */}
        {inMiniProgram ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-amber-300 mb-2">小程序暂不支持充值</h3>
            <p className="text-sm text-slate-400 mb-4">
              根据平台规定，充值功能需在App中操作。
            </p>
            <button
              onClick={() => openInApp('recharge')}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl"
            >
              打开App充值
            </button>
          </div>
        ) : useAppleIAP && !iapReady ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-amber-300 mb-2">支付功能维护中</h3>
            <p className="text-sm text-slate-400 mb-4">
              Apple 内购服务正在配置中，请稍后再试。
            </p>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl"
            >
              返回
            </button>
          </div>
        ) : (
          <>
            {/* 当前积分 */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-5 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="w-5 h-5 opacity-80" />
                    <span className="text-sm opacity-80">当前积分</span>
                  </div>
                  <div className="text-4xl font-bold">{user?.points ?? 0}</div>
                </div>
                <button
                  onClick={() => navigate('/profile/points')}
                  className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium"
                >
                  积分明细
                </button>
              </div>
            </div>

            {/* 充值套餐 */}
            <h2 className="font-semibold text-slate-200 mb-3">选择充值套餐</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {rechargePackages.map((pkg, i) => {
                const isSelected = selectedPkg?.id === pkg.id;
                const Icon = packageIcons[pkg.id] || Coins;
                const gradient = packageColors[pkg.id] || 'from-slate-600 to-slate-500';

                return (
                  <motion.button
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`relative p-4 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'ring-2 ring-violet-400 bg-slate-700/80'
                        : 'bg-slate-800/80 border border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    {/* 标签 */}
                    {pkg.tag && (
                      <span className={`absolute -top-2 -right-1 px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${tagColors[pkg.tag] || 'bg-blue-500'}`}>
                        {pkg.tag}
                      </span>
                    )}

                    {/* 图标 + 积分 */}
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <div className="text-xl font-bold text-slate-100">
                      {pkg.points + pkg.bonus}
                      <span className="text-xs font-normal text-slate-400 ml-1">积分</span>
                    </div>

                    {pkg.bonus > 0 && (
                      <div className="text-xs text-amber-400 mt-0.5">含赠送 {pkg.bonus} 积分</div>
                    )}

                    <div className="mt-2 text-lg font-bold text-white">
                      ¥{pkg.price}
                    </div>

                    {/* 选中指示器 */}
                    {isSelected && (
                      <motion.div
                        layoutId="selected-check"
                        className="absolute top-2 left-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* 支付方式 */}
            {selectedPkg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-semibold text-slate-200 mb-3">支付方式</h2>
                <div className="space-y-2 mb-6">
                  {inIOSApp ? (
                    /* iOS 环境 - Apple 内购 */
                    <button
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800/80 border-2 border-slate-400/50"
                    >
                      <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                        <Apple className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-slate-200">Apple 内购支付</div>
                        <div className="text-xs text-slate-500">安全便捷</div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-400 bg-slate-400 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </button>
                  ) : (
                    <>
                  {/* 微信支付 */}
                  <button
                    onClick={() => setPayMethod('wechat')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                      payMethod === 'wechat'
                        ? 'bg-green-500/10 border-2 border-green-500/50'
                        : 'bg-slate-800/80 border border-slate-700/50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.493.493 0 01.177-.554C23.196 18.153 24 16.553 24 14.754c0-3.291-3.139-5.956-7.062-5.896zm-2.834 2.958c.534 0 .967.44.967.982a.975.975 0 01-.967.983.975.975 0 01-.967-.983c0-.542.433-.982.967-.982zm4.857 0c.535 0 .967.44.967.982a.975.975 0 01-.967.983.975.975 0 01-.966-.983c0-.542.432-.982.966-.982z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-slate-200">微信支付</div>
                      <div className="text-xs text-slate-500">推荐</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      payMethod === 'wechat' ? 'border-green-500 bg-green-500' : 'border-slate-600'
                    }`}>
                      {payMethod === 'wechat' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>

                  {/* 支付宝 */}
                  <button
                    onClick={() => setPayMethod('alipay')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                      payMethod === 'alipay'
                        ? 'bg-blue-500/10 border-2 border-blue-500/50'
                        : 'bg-slate-800/80 border border-slate-700/50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                        <path d="M21.422 15.358c-3.49-1.266-6.655-2.956-6.655-2.956s.627-1.659.928-3.476c.301-1.817.194-3.737-.766-3.737-.96 0-1.505 1.104-1.712 2.278-.208 1.174-.124 2.794-.124 2.794s-1.925-.906-3.09-.906c-1.165 0-2.47.83-2.47 2.209 0 1.378 1.175 2.108 2.47 2.47 1.296.363 2.952-.017 2.952-.017s-.993 2.108-3.462 3.989C7.024 19.888 4.27 20.5 4.27 20.5l-.003.003A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12 0-1.005-.13-1.98-.37-2.912-.77.342-1.503.63-2.208.27zM12 0C5.373 0 0 5.373 0 12c0 2.55.796 4.913 2.15 6.858.18-.375.48-.915.928-1.504 1.128-1.48 3.188-2.874 3.188-2.874s-1.053-.202-1.656-.843c-.604-.64-.65-1.742.046-2.61.696-.87 2.074-.882 3.09-.362 1.016.521 1.48 1.256 1.48 1.256s.397-1.275.603-2.527c.206-1.252.188-2.6.188-2.6S7.45 6.173 6.44 4.69c-1.01-1.48-.16-3.44 1.593-3.796C9.786.538 11.23 1.82 12 3.49c.77-1.67 2.214-2.952 3.967-2.596 1.753.356 2.603 2.316 1.593 3.796-1.01 1.483-3.578 2.104-3.578 2.104z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-slate-200">支付宝</div>
                      <div className="text-xs text-slate-500">快捷支付</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      payMethod === 'alipay' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                    }`}>
                      {payMethod === 'alipay' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                    </>
                  )}
                </div>

                {/* 订单摘要 + 确认按钮 */}
                <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">套餐</span>
                    <span className="text-slate-200">{selectedPkg.name}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">获得积分</span>
                    <span className="text-amber-400 font-medium">{selectedPkg.points + selectedPkg.bonus}</span>
                  </div>
                  {selectedPkg.bonus > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">其中赠送</span>
                      <span className="text-green-400">+{selectedPkg.bonus}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-700/50 my-3" />
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-medium">应付金额</span>
                    <span className="text-2xl font-bold text-white">¥{selectedPkg.price}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRecharge}
                  disabled={submitting || (useAppleIAP && !iapReady)}
                  className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      处理中...
                    </span>
                  ) : useAppleIAP ? (
                    `购买 ¥${selectedPkg.price}`
                  ) : (
                    `确认支付 ¥${selectedPkg.price}`
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* 安全提示 */}
            <div className="flex items-center justify-center gap-1.5 mt-6 mb-4">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">
                {inIOSApp ? '安全支付由 Apple 官方保障' : '安全支付由微信/支付宝官方保障'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
