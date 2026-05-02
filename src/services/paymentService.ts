// 支付服务 - 微信支付 & 支付宝

import { supabase } from '../supabase/client';
import { getPlatformType } from './platformService';

export type PaymentMethod = 'wechat' | 'alipay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface PaymentOrder {
  orderId: string;
  amount: number;         // 金额（分）
  subject: string;        // 商品描述
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface RechargePackage {
  id: string;
  name: string;
  points: number;
  price: number;          // 元
  bonus: number;          // 赠送积分
  tag?: string;           // 标签如"最受欢迎"
}

// 充值套餐配置
export const rechargePackages: RechargePackage[] = [
  { id: 'pkg_6',   name: '6元套餐',   points: 60,   price: 6,   bonus: 0 },
  { id: 'pkg_30',  name: '30元套餐',  points: 300,  price: 30,  bonus: 30,  tag: '热门' },
  { id: 'pkg_68',  name: '68元套餐',  points: 680,  price: 68,  bonus: 100, tag: '超值' },
  { id: 'pkg_128', name: '128元套餐', points: 1280, price: 128, bonus: 260, tag: '最划算' },
  { id: 'pkg_328', name: '328元套餐', points: 3280, price: 328, bonus: 800 },
  { id: 'pkg_648', name: '648元套餐', points: 6480, price: 648, bonus: 2000, tag: '至尊' },
];

// 创建充值订单
export async function createRechargeOrder(
  userId: string,
  packageId: string,
  method: PaymentMethod
): Promise<PaymentOrder> {
  const pkg = rechargePackages.find(p => p.id === packageId);
  if (!pkg) throw new Error('无效的充值套餐');

  const platform = getPlatformType();
  if (platform === 'miniprogram') {
    throw new Error('小程序暂不支持支付，请在App中操作');
  }

  // 创建数据库订单记录（payment_orders 表需后端建表后启用）
  // TODO: 实际对接时替换为后端 API 调用
  const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // 预留：后端建表后可解除注释
  // const { data: order, error } = await supabase.from('payment_orders' as any).insert({
  //   user_id: userId, package_id: packageId,
  //   amount: pkg.price * 100, points: pkg.points + pkg.bonus,
  //   method, status: 'pending'
  // }).select().single();
  // if (error) throw new Error('创建订单失败: ' + error.message);

  return {
    orderId,
    amount: pkg.price * 100,
    subject: `全民嘲家积分充值 - ${pkg.name}`,
    method,
    status: 'pending'
  };
}

// 调起微信支付（App/H5）
export async function callWechatPay(order: PaymentOrder): Promise<boolean> {
  // TODO: 对接后端获取微信支付参数（prepay_id 等）
  // 后端需要：
  //   1. 调用微信统一下单 API: https://api.mch.weixin.qq.com/v3/pay/transactions/app (App支付)
  //                           https://api.mch.weixin.qq.com/v3/pay/transactions/h5  (H5支付)
  //   2. 返回支付参数给前端
  // 前端需要：
  //   App: 调用微信 SDK WXPay.pay(params)
  //   H5:  重定向到微信 mweb_url

  console.log('[WechatPay] 待对接 - orderId:', order.orderId, 'amount:', order.amount);

  // 预留接口：获取支付参数
  // const { data } = await fetch('/api/payment/wechat/create', {
  //   method: 'POST',
  //   body: JSON.stringify({ order_id: order.orderId })
  // }).then(r => r.json());

  return false; // 待实际对接后返回支付结果
}

// 调起支付宝支付（App/H5）
export async function callAlipay(order: PaymentOrder): Promise<boolean> {
  // TODO: 对接后端获取支付宝支付参数
  // 后端需要：
  //   1. 调用支付宝 alipay.trade.app.pay (App) 或 alipay.trade.wap.pay (H5)
  //   2. 返回签名后的 orderString
  // 前端需要：
  //   App: 调用支付宝 SDK AlipaySDK.pay(orderString)
  //   H5:  使用返回的 form 表单自动提交

  console.log('[Alipay] 待对接 - orderId:', order.orderId, 'amount:', order.amount);

  // 预留接口
  // const { data } = await fetch('/api/payment/alipay/create', {
  //   method: 'POST',
  //   body: JSON.stringify({ order_id: order.orderId })
  // }).then(r => r.json());

  return false;
}

// 统一支付调用入口
export async function processPayment(order: PaymentOrder): Promise<boolean> {
  switch (order.method) {
    case 'wechat':
      return callWechatPay(order);
    case 'alipay':
      return callAlipay(order);
    default:
      throw new Error('不支持的支付方式');
  }
}

// 查询订单支付状态（待后端建表）
export async function queryOrderStatus(_orderId: string): Promise<PaymentStatus> {
  // TODO: 实际对接时替换为后端 API 或 supabase 查询
  // const { data, error } = await supabase
  //   .from('payment_orders' as any).select('status')
  //   .eq('id', orderId).single();
  // if (error || !data) return 'failed';
  // return data.status as PaymentStatus;
  return 'pending';
}

// 支付成功后回调（由后端 webhook 触发，前端轮询确认）
export async function confirmPaymentSuccess(_orderId: string, userId: string, totalPoints?: number): Promise<void> {
  // TODO: 实际对接时，由后端验证订单状态后再加积分
  // 目前只做积分加成逻辑的占位实现
  if (!totalPoints || totalPoints <= 0) return;

  // 给用户加积分
  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single();

  if (profile) {
    const currentPoints = profile.points || 0;
    const newBalance = currentPoints + totalPoints;

    await supabase.from('profiles')
      .update({ points: newBalance })
      .eq('id', userId);

    // 记录积分流水
    await supabase.from('points_transactions').insert({
      user_id: userId,
      reason: 'recharge',
      delta: totalPoints,
      balance: newBalance
    });
  }
}
