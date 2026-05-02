// 平台环境检测服务

export type PlatformType = 'miniprogram' | 'app-ios' | 'app-android' | 'app' | 'h5';

// 检测当前运行环境
export function getPlatformType(): PlatformType {
  const ua = navigator.userAgent.toLowerCase();

  // 微信小程序环境
  if ((window as any).__wxjs_environment === 'miniprogram' ||
      ua.includes('miniprogram') ||
      (window as any).wx?.miniProgram) {
    return 'miniprogram';
  }

  // 支付宝小程序
  if ((ua.includes('alipayclient') && ua.includes('miniprogram')) ||
      (typeof (window as any).my?.getEnv === 'function' && (window as any).my.getEnv()?.miniprogram)) {
    return 'miniprogram';
  }

  // App WebView（通过 bridge 或 UA 判断）
  if ((window as any).AppBridge || ua.includes('debateapp')) {
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) {
      return 'app-ios';
    }
    if (ua.includes('android')) {
      return 'app-android';
    }
    return 'app';
  }

  return 'h5';
}

// 是否为小程序环境
export function isMiniProgram(): boolean {
  return getPlatformType() === 'miniprogram';
}

// 是否为 App 环境
export function isApp(): boolean {
  const pt = getPlatformType();
  return pt === 'app' || pt === 'app-ios' || pt === 'app-android';
}

// 是否为 iOS App 环境（App Store 审核用）
export function isIOSApp(): boolean {
  return getPlatformType() === 'app-ios';
}

// 是否处于 iOS 环境（包括 Safari 浏览器）
export function isIOS(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('iphone') || ua.includes('ipad') || (ua.includes('macintosh') && navigator.maxTouchPoints > 1);
}

// 小程序中跳转到 App 的 scheme
const APP_SCHEME = 'debateapp://';

// 引导用户打开 App
export function openInApp(path?: string): void {
  const targetUrl = path ? `${APP_SCHEME}${path}` : APP_SCHEME;

  // 微信小程序：调用 wx.launchApp 或展示引导
  if ((window as any).wx?.miniProgram) {
    // 小程序内无法直接打开 App，需通过按钮组件的 open-type="launchApp"
    // 这里仅做 fallback 提示
    return;
  }

  // H5 环境：尝试通过 scheme 唤起
  window.location.href = targetUrl;
}

// 获取不可用功能的引导文案
export function getRestrictionMessage(feature: 'payment' | 'withdraw'): string {
  const messages = {
    payment: '小程序暂不支持支付功能，请在App中完成充值',
    withdraw: '小程序暂不支持提现功能，请在App中完成提现'
  };
  return messages[feature];
}
