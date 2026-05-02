import { supabase } from '../supabase/client';

/**
 * AI加成规则服务
 * 
 * 规则概要：
 * - 首次召唤（无加成/已过期）：+10%
 * - 有效期内同阵营：+1%
 * - 有效期内换阵营：原阵营清零，新阵营+10%
 * - 仅当AI倾向与召唤者投票阵营一致时才生效
 * - 加成有效期24小时，每次成功召唤刷新
 * - 每人每天最多3次召唤
 * - 每话题15分钟内最多1次有效加成变更
 * - 加成不影响同城辩论最终胜负（同城辩论以raw_votes为准）
 */

const DAILY_CALL_LIMIT = 3;
const COOLDOWN_MS = 15 * 60 * 1000; // 15分钟
const BOOST_DURATION_MS = 24 * 60 * 60 * 1000; // 24小时
const FIRST_BOOST_PERCENT = 10;
const INCREMENT_PERCENT = 1;
const MAX_BOOST_PERCENT = 50;

export interface BoostCheckResult {
  canCall: boolean;
  reason?: string;
  dailyRemaining: number;
}

export interface BoostApplyResult {
  boostApplied: boolean;
  newBoostPercents: number[];
  newFinalVotes: number[];
  reason: string;
}

/**
 * 检查用户今日是否还能召唤AI（每人每天3次上限）
 */
export async function checkDailyCallLimit(userId: string): Promise<BoostCheckResult> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('ai_judgments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', todayStart.toISOString());

  const used = count || 0;
  const remaining = DAILY_CALL_LIMIT - used;

  if (remaining <= 0) {
    return { canCall: false, reason: '今日AI召唤次数已用完（每天最多3次）', dailyRemaining: 0 };
  }

  return { canCall: true, dailyRemaining: remaining };
}

/**
 * 检查话题是否在15分钟加成冷却期内
 * 通过 ai_boost_expire_at 反推上次加成时间
 */
function checkTopicCooldown(aiBoostExpireAt: string | null): { onCooldown: boolean; remainingSeconds: number } {
  if (!aiBoostExpireAt) {
    return { onCooldown: false, remainingSeconds: 0 };
  }

  // 上次加成时间 = ai_boost_expire_at - 24小时
  const lastBoostTime = new Date(aiBoostExpireAt).getTime() - BOOST_DURATION_MS;
  const elapsed = Date.now() - lastBoostTime;

  if (elapsed < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
    return { onCooldown: true, remainingSeconds: remaining };
  }

  return { onCooldown: false, remainingSeconds: 0 };
}

/**
 * 计算并应用AI加成
 * 
 * @param topicId - 话题ID
 * @param favoredCamp - AI判定倾向 (0=平局, 1=阵营1/camps[0], 2=阵营2/camps[1])
 * @param userVotedCamp - 用户投票的阵营索引 (0 或 1)
 * @param isLocalDebate - 是否为同城辩论
 */
export async function applyAIBoost(
  topicId: string,
  favoredCamp: number,
  userVotedCamp: number,
  isLocalDebate: boolean
): Promise<BoostApplyResult> {
  // 平局不改变加成
  if (favoredCamp === 0) {
    return {
      boostApplied: false,
      newBoostPercents: [0, 0],
      newFinalVotes: [],
      reason: 'AI判定为平局，不改变加成状态'
    };
  }

  // 将AI的favoredCamp(1-indexed)转为0-indexed阵营索引
  const favoredCampIndex = favoredCamp - 1;

  // 只有AI倾向与召唤者阵营一致时才触发加成
  if (favoredCampIndex !== userVotedCamp) {
    return {
      boostApplied: false,
      newBoostPercents: [0, 0],
      newFinalVotes: [],
      reason: 'AI倾向与您支持的阵营不一致，仅返回分析结果'
    };
  }

  // 获取当前话题数据
  const { data: topic } = await supabase
    .from('topics')
    .select('ai_boost_percents, ai_boost_expire_at, raw_votes, debate_type')
    .eq('id', topicId)
    .single();

  if (!topic) {
    return { boostApplied: false, newBoostPercents: [0, 0], newFinalVotes: [], reason: '话题不存在' };
  }

  // 检查15分钟冷却
  const cooldown = checkTopicCooldown(topic.ai_boost_expire_at);
  if (cooldown.onCooldown) {
    const minutes = Math.ceil(cooldown.remainingSeconds / 60);
    return {
      boostApplied: false,
      newBoostPercents: topic.ai_boost_percents || [0, 0],
      newFinalVotes: topic.raw_votes || [0, 0],
      reason: `话题加成冷却中，${minutes}分钟后可再次变更`
    };
  }

  const currentBoosts = topic.ai_boost_percents || [0, 0];
  const expireAt = topic.ai_boost_expire_at ? new Date(topic.ai_boost_expire_at) : null;
  const isExpired = !expireAt || expireAt < new Date();

  let newBoosts: number[];

  if (isExpired) {
    // 无加成或已过期：首次 +10%
    newBoosts = [0, 0];
    newBoosts[favoredCampIndex] = FIRST_BOOST_PERCENT;
  } else {
    // 检查当前哪个阵营有加成
    const currentBoostedCamp = currentBoosts[0] > 0 ? 0 : currentBoosts[1] > 0 ? 1 : -1;

    if (currentBoostedCamp === favoredCampIndex) {
      // 同阵营：+1%，上限50%
      newBoosts = [...currentBoosts];
      newBoosts[favoredCampIndex] = Math.min(newBoosts[favoredCampIndex] + INCREMENT_PERCENT, MAX_BOOST_PERCENT);
    } else {
      // 换阵营：原阵营清零，新阵营 +10%
      newBoosts = [0, 0];
      newBoosts[favoredCampIndex] = FIRST_BOOST_PERCENT;
    }
  }

  // 新过期时间 = 当前时间 + 24小时
  const newExpireAt = new Date(Date.now() + BOOST_DURATION_MS).toISOString();

  // 计算最终票数
  const rawVotes = topic.raw_votes || [0, 0];
  const finalVotes = rawVotes.map((v, i) => Math.round(v * (1 + (newBoosts[i] || 0) / 100)));

  // 确定领先阵营
  const leadingCamp = finalVotes[0] > finalVotes[1] ? 0 : finalVotes[1] > finalVotes[0] ? 1 : null;

  // 更新话题数据库
  await supabase
    .from('topics')
    .update({
      ai_boost_percents: newBoosts,
      ai_boost_expire_at: newExpireAt,
      final_votes: finalVotes,
      leading_camp: leadingCamp
    })
    .eq('id', topicId);

  return {
    boostApplied: true,
    newBoostPercents: newBoosts,
    newFinalVotes: finalVotes,
    reason: `加成已生效！${topic.raw_votes && rawVotes[favoredCampIndex] > 0 ? `+${newBoosts[favoredCampIndex]}%` : ''}`
  };
}

/**
 * 计算带加成的展示票数（纯前端计算，用于实时显示）
 * 同城辩论不受加成影响
 */
export function calculateDisplayVotes(
  rawVotes: number[],
  aiBoostPercents: number[] | null,
  aiBoostExpireAt: string | null,
  debateType: string
): { displayVotes: number[]; activeBoosts: number[]; isBoostActive: boolean } {
  // 同城辩论不受加成影响
  if (debateType === 'local') {
    return { displayVotes: [...rawVotes], activeBoosts: [0, 0], isBoostActive: false };
  }

  const boosts = aiBoostPercents || [0, 0];
  const expireAt = aiBoostExpireAt ? new Date(aiBoostExpireAt) : null;
  const isActive = !!expireAt && expireAt > new Date() && boosts.some(b => b > 0);

  if (!isActive) {
    return { displayVotes: [...rawVotes], activeBoosts: [0, 0], isBoostActive: false };
  }

  const displayVotes = rawVotes.map((v, i) => Math.round(v * (1 + (boosts[i] || 0) / 100)));

  return { displayVotes, activeBoosts: boosts, isBoostActive: true };
}
