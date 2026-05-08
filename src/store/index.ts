import { create } from 'zustand';
import { supabase } from '../supabase/client';
import type { Database } from '../supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Topic = Database['public']['Tables']['topics']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];
type PointsTransaction = Database['public']['Tables']['points_transactions']['Row'];
type CashTransaction = Database['public']['Tables']['cash_transactions']['Row'];

interface ShopItem {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'virtual' | 'physical' | 'ticket' | 'adfree';
  stock: number;
}

interface AppState {
  user: Profile | null;
  topics: Topic[];
  comments: Comment[];
  notifications: Notification[];
  pointsHistory: PointsTransaction[];
  cashHistory: CashTransaction[];
  shopItems: ShopItem[];
  blockedUsers: string[];
  isLoading: boolean;
  
  // Auth
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  
  // Topics
  fetchTopics: (type?: string) => Promise<void>;
  createTopic: (data: { title: string; debate_type: string; camps: string[]; expire_at?: string }) => Promise<void>;
  voteTopic: (topicId: string, campIndex: number) => Promise<void>;
  supportTopic: (topicId: string, campIndex: number, points: number) => Promise<void>;
  
  // Comments
  fetchComments: (topicId: string) => Promise<void>;
  addComment: (topicId: string, content: string, campIndex: number, images?: string[]) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  
  // AI Judge
  saveAIJudgment: (topicId: string, content: string, result: { summary: string; taunt: string; favoredCamp: number; boostPercent: number }) => Promise<void>;
  
  // User
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  
  // Block
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  
  // Transactions
  fetchPointsHistory: () => Promise<void>;
  fetchCashHistory: () => Promise<void>;
  withdraw: (amount: number, bankInfo: object) => Promise<void>;
  
  // Notifications
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  
  // Camp
  switchCamp: () => void;
  
  // Points & Power
  addPoints: (amount: number) => void;
  addPower: (amount: number) => void;
}

const defaultUser: Profile = {
  id: 'guest',
  nickname: '游客',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
  bio: null,
  camp: 'north',
  points: 0,
  cash_balance: 0,
  total_power: 0,
  season_power: 0,
  created_at: new Date().toISOString(),
  updated_at: null
};

const defaultShopItems: ShopItem[] = [
  { id: '1', name: '免广告卡(7天)', description: '7天内免除所有广告', points: 50, type: 'adfree', stock: 999 },
  { id: '2', name: '免广告卡(30天)', description: '30天内免除所有广告', points: 150, type: 'adfree', stock: 999 },
  { id: '3', name: '辩豆礼包', description: '获得100辩豆', points: 0, type: 'virtual', stock: 100 },
  { id: '4', name: '限定马克杯', description: '官方限定周边马克杯', points: 500, type: 'physical', stock: 50 },
  { id: '5', name: '限定T恤', description: '官方限定周边T恤', points: 800, type: 'physical', stock: 30 },
  { id: '6', name: '双倍积分卡', description: '24小时内获得双倍积分', points: 100, type: 'ticket', stock: 200 },
  { id: '7', name: '改名卡', description: '修改你的昵称', points: 200, type: 'virtual', stock: 500 },
  { id: '8', name: '头像框-黄金', description: '专属黄金头像框', points: 300, type: 'virtual', stock: 100 },
];

export const useStore = create<AppState>((set, get) => ({
  user: defaultUser,
  topics: [],
  comments: [],
  notifications: [],
  pointsHistory: [],
  cashHistory: [],
  shopItems: defaultShopItems,
  blockedUsers: JSON.parse(localStorage.getItem('blockedUsers') || '[]'),
  isLoading: false,

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      set({ user: profile });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, topics: [], comments: [], notifications: [] });
  },

  register: async (email, password, nickname) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, nickname });
    }
  },

  fetchTopics: async (type) => {
    set({ isLoading: true });
    let query = supabase.from('topics').select('*').eq('status', 'approved').order('created_at', { ascending: false });
    if (type) query = query.eq('debate_type', type);
    const { data } = await query;
    set({ topics: data || [], isLoading: false });
  },

  createTopic: async (data) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('topics').insert({
      ...data,
      creator_id: user.id,
      status: 'pending'
    });
  },

  voteTopic: async (topicId, campIndex) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('votes').insert({
      topic_id: topicId,
      user_id: user.id,
      camp_index: campIndex
    });
  },

  supportTopic: async (topicId, campIndex, points) => {
    const { user } = get();
    if (!user || (user.points ?? 0) < points) return;
    await supabase.from('votes').insert({
      topic_id: topicId,
      user_id: user.id,
      camp_index: campIndex,
      points
    });
    await supabase.from('profiles').update({ points: (user.points ?? 0) - points }).eq('id', user.id);
    set({ user: { ...user, points: (user.points ?? 0) - points } });
  },

  fetchComments: async (topicId) => {
    const { data } = await supabase.from('comments').select('*').eq('topic_id', topicId).order('created_at', { ascending: false });
    set({ comments: data || [] });
  },

  addComment: async (topicId, content, campIndex, images = []) => {
    const { user } = get();
    if (!user) throw new Error('请先登录');
    const { error } = await supabase.from('comments').insert({
      topic_id: topicId,
      user_id: user.id,
      camp_index: campIndex,
      content,
      images
    });
    if (error) throw new Error(error.message);
    await get().fetchComments(topicId);
  },

  likeComment: async (commentId) => {
    const { data } = await supabase.from('comments').select('likes').eq('id', commentId).single();
    const currentLikes = data?.likes ?? 0;
    await supabase.from('comments').update({ likes: currentLikes + 1 }).eq('id', commentId);
  },

  saveAIJudgment: async (topicId, content, result) => {
    const { user } = get();
    if (!user || (user.points ?? 0) < 20) throw new Error('积分不足');
    
    await supabase.from('ai_judgments').insert({
      topic_id: topicId,
      user_id: user.id,
      content,
      ai_summary: result.summary,
      ai_taunt: result.taunt,
      favored_camp: result.favoredCamp,
      boost_percent: result.boostPercent,
      points_cost: 20
    });
    
    await supabase.from('profiles').update({ points: (user.points ?? 0) - 20 }).eq('id', user.id);
    set({ user: { ...user, points: (user.points ?? 0) - 20 } });
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('profiles').update(data).eq('id', user.id);
    set({ user: { ...user, ...data } });
  },

  followUser: async (userId) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('follows').insert({ follower_id: user.id, following_id: userId });
  },

  unfollowUser: async (userId) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', userId);
  },

  fetchPointsHistory: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase.from('points_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    set({ pointsHistory: data || [] });
  },

  fetchCashHistory: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase.from('cash_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    set({ cashHistory: data || [] });
  },

  withdraw: async (amount, bankInfo) => {
    const { user } = get();
    if (!user) throw new Error('请先登录');
    if ((user.cash_balance ?? 0) < amount) throw new Error('余额不足，无法提现');
    await supabase.from('withdrawals').insert({
      user_id: user.id,
      amount,
      bank_info: bankInfo as any
    });
    const newBalance = (user.cash_balance ?? 0) - amount;
    await supabase.from('profiles').update({ cash_balance: newBalance }).eq('id', user.id);
    set({ user: { ...user, cash_balance: newBalance } });
  },

  fetchNotifications: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    set({ notifications: data || [] });
  },

  markNotificationRead: async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  },

  switchCamp: () => {
    const { user } = get();
    if (!user) return;
    const newCamp = user.camp === 'north' ? 'south' : 'north';
    set({ user: { ...user, camp: newCamp } });
  },

  addPoints: (amount: number) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, points: (user.points || 0) + amount } });
  },

  addPower: (amount: number) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, total_power: (user.total_power || 0) + amount, season_power: (user.season_power || 0) + amount } });
  },

  blockUser: (userId: string) => {
    const { blockedUsers } = get();
    if (blockedUsers.includes(userId)) return;
    const updated = [...blockedUsers, userId];
    localStorage.setItem('blockedUsers', JSON.stringify(updated));
    set({ blockedUsers: updated });
  },

  unblockUser: (userId: string) => {
    const { blockedUsers } = get();
    const updated = blockedUsers.filter(id => id !== userId);
    localStorage.setItem('blockedUsers', JSON.stringify(updated));
    set({ blockedUsers: updated });
  }
}));
