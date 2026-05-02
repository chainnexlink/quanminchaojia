// 短信验证码服务 - 对接阿里云 Dysmsapi
// 前端通过后端 SMS Server 中转发送

export interface SendSmsResult {
  success: boolean;
  message: string;
  cooldown: number;
}

export interface VerifySmsResult {
  success: boolean;
  message: string;
}

// SMS 后端服务地址
const SMS_API_BASE = process.env.NODE_ENV === 'production'
  ? '/api/sms'   // 生产环境通过 nginx 代理
  : 'http://localhost:3267/api/sms';  // 开发环境直连

// 本地冷却管理（前端防抖，后端也有冷却校验）
const cooldownMap = new Map<string, number>();

// 检查手机号格式
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

// 获取剩余冷却时间
export function getSmsCooldown(phone: string): number {
  const expireAt = cooldownMap.get(phone);
  if (!expireAt) return 0;
  const remaining = Math.ceil((expireAt - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

// 发送短信验证码
export async function sendSmsCode(
  phone: string,
  type: 'login' | 'bindPhone' | 'resetPassword' | 'withdraw'
): Promise<SendSmsResult> {
  if (!isValidPhone(phone)) {
    return { success: false, message: '请输入正确的手机号', cooldown: 0 };
  }

  const cooldown = getSmsCooldown(phone);
  if (cooldown > 0) {
    return { success: false, message: `请${cooldown}秒后重试`, cooldown };
  }

  try {
    const response = await fetch(`${SMS_API_BASE}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, type })
    });

    const data = await response.json();

    if (data.success && data.cooldown > 0) {
      cooldownMap.set(phone, Date.now() + data.cooldown * 1000);
    }

    return {
      success: data.success,
      message: data.message,
      cooldown: data.cooldown || 0
    };
  } catch (err) {
    return { success: false, message: '网络错误，请检查短信服务是否启动', cooldown: 0 };
  }
}

// 验证短信验证码
export async function verifySmsCode(
  phone: string,
  code: string,
  type: 'login' | 'bindPhone' | 'resetPassword' | 'withdraw'
): Promise<VerifySmsResult> {
  if (!isValidPhone(phone)) {
    return { success: false, message: '手机号格式不正确' };
  }

  if (!/^\d{4,6}$/.test(code)) {
    return { success: false, message: '验证码格式不正确' };
  }

  try {
    const response = await fetch(`${SMS_API_BASE}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code, type })
    });

    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (err) {
    return { success: false, message: '网络错误，请检查短信服务是否启动' };
  }
}

// 手机号脱敏显示
export function maskPhone(phone: string): string {
  if (phone.length !== 11) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(7);
}
