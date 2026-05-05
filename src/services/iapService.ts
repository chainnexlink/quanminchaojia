// iOS Apple IAP (In-App Purchase) 服务
// 使用 @capgo/native-purchases 插件实现 StoreKit 2

import { Capacitor } from '@capacitor/core';

// IAP 产品 ID 映射（需在 App Store Connect 中创建对应的产品）
export const IAP_PRODUCT_IDS: Record<string, string> = {
  'pkg_6':   'com.quanminchaojia.points_60',
  'pkg_30':  'com.quanminchaojia.points_300',
  'pkg_68':  'com.quanminchaojia.points_680',
  'pkg_128': 'com.quanminchaojia.points_1280',
  'pkg_328': 'com.quanminchaojia.points_3280',
  'pkg_648': 'com.quanminchaojia.points_6480',
};

export interface IAPProduct {
  productId: string;
  title: string;
  description: string;
  price: string;        // 本地化价格字符串，如 "¥6.00"
  priceAmount: number;  // 数字金额
  currency: string;
}

export interface IAPPurchaseResult {
  success: boolean;
  transactionId?: string;
  productId?: string;
  error?: string;
}

let NativePurchases: any = null;
let isInitialized = false;

// 检查是否在 iOS 原生环境中
export function isNativeIOS(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
}

// 初始化 IAP
export async function initIAP(): Promise<boolean> {
  if (!isNativeIOS()) return false;
  if (isInitialized) return true;

  try {
    const module = await import('@capgo/native-purchases');
    NativePurchases = module.NativePurchases;
    isInitialized = true;
    return true;
  } catch (e) {
    console.error('[IAP] 初始化失败:', e);
    return false;
  }
}

// 获取产品信息
export async function getIAPProducts(packageIds: string[]): Promise<IAPProduct[]> {
  if (!isInitialized || !NativePurchases) return [];

  const productIds = packageIds
    .map(id => IAP_PRODUCT_IDS[id])
    .filter(Boolean);

  if (productIds.length === 0) return [];

  try {
    const products: IAPProduct[] = [];
    for (const productId of productIds) {
      try {
        const result = await NativePurchases.getProduct({ productIdentifier: productId });
        if (result && result.product) {
          products.push({
            productId: result.product.productIdentifier || productId,
            title: result.product.localizedTitle || '',
            description: result.product.localizedDescription || '',
            price: result.product.localizedPrice || '',
            priceAmount: result.product.price || 0,
            currency: result.product.currencyCode || 'CNY',
          });
        }
      } catch (e) {
        console.warn('[IAP] 获取产品失败:', productId, e);
      }
    }
    return products;
  } catch (e) {
    console.error('[IAP] 批量获取产品失败:', e);
    return [];
  }
}

// 购买产品（消耗型）
export async function purchaseIAP(packageId: string): Promise<IAPPurchaseResult> {
  if (!isInitialized || !NativePurchases) {
    return { success: false, error: '支付服务未初始化' };
  }

  const productId = IAP_PRODUCT_IDS[packageId];
  if (!productId) {
    return { success: false, error: '无效的商品' };
  }

  try {
    const result = await NativePurchases.purchaseProduct({
      productIdentifier: productId,
      quantity: 1,
    });

    if (result && result.transactionId) {
      return {
        success: true,
        transactionId: result.transactionId,
        productId,
      };
    }

    return { success: false, error: '购买未完成' };
  } catch (e: any) {
    // 用户取消购买
    if (e?.code === 'USER_CANCELLED' || e?.message?.includes('cancel')) {
      return { success: false, error: '已取消购买' };
    }
    console.error('[IAP] 购买失败:', e);
    return { success: false, error: e?.message || '购买失败，请重试' };
  }
}

// 恢复购买（消耗型一般不需要，但 Apple 要求提供）
export async function restorePurchases(): Promise<void> {
  if (!isInitialized || !NativePurchases) return;

  try {
    await NativePurchases.restorePurchases();
  } catch (e) {
    console.error('[IAP] 恢复购买失败:', e);
  }
}
