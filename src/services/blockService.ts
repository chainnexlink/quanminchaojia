// 用户屏蔽/拉黑服务
// 满足 App Store 审核要求 - UGC 应用必须有用户屏蔽机制

import { supabase } from '../supabase/client';

// 本地缓存屏蔽列表
let blockedUsers: Set<string> = new Set();
let loaded = false;

// 加载当前用户的屏蔽列表
export async function loadBlockedUsers(userId: string): Promise<void> {
  try {
    const { data } = await supabase
      .from('user_blocks')
      .select('blocked_user_id')
      .eq('user_id', userId);

    blockedUsers = new Set((data || []).map(d => d.blocked_user_id));
    loaded = true;
  } catch (e) {
    console.error('[Block] 加载屏蔽列表失败:', e);
  }
}

// 屏蔽用户
export async function blockUser(userId: string, targetUserId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_blocks')
      .upsert({
        user_id: userId,
        blocked_user_id: targetUserId,
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id,blocked_user_id' });

    if (error) throw error;

    blockedUsers.add(targetUserId);
    return true;
  } catch (e) {
    console.error('[Block] 屏蔽用户失败:', e);
    return false;
  }
}

// 取消屏蔽
export async function unblockUser(userId: string, targetUserId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_blocks')
      .delete()
      .eq('user_id', userId)
      .eq('blocked_user_id', targetUserId);

    if (error) throw error;

    blockedUsers.delete(targetUserId);
    return true;
  } catch (e) {
    console.error('[Block] 取消屏蔽失败:', e);
    return false;
  }
}

// 检查用户是否被屏蔽
export function isUserBlocked(targetUserId: string): boolean {
  return blockedUsers.has(targetUserId);
}

// 获取屏蔽列表
export function getBlockedUserIds(): string[] {
  return Array.from(blockedUsers);
}

// 过滤掉被屏蔽用户的内容
export function filterBlockedContent<T extends { user_id?: string; userId?: string }>(items: T[]): T[] {
  if (blockedUsers.size === 0) return items;
  return items.filter(item => {
    const uid = item.user_id || item.userId || '';
    return !blockedUsers.has(uid);
  });
}
