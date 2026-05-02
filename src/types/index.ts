export type DebateType = 'culture' | 'local';
export type Camp = 'north' | 'south';
export type TopicStatus = 'pending' | 'approved' | 'rejected';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  camp: Camp | null;
  points: number;
  cash_balance: number;
  total_power: number;
  season_power: number;
  created_at: string;
}

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  camp: Camp;
  points: number;
  totalPower: number;
  seasonPower: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  images: string[];
  camp: Camp;
  likes: number;
  comments: { id: string; user: User; content: string; createdAt: string }[];
  views: number;
  createdAt: string;
}

export interface Topic {
  id: string;
  title: string;
  debate_type: DebateType;
  creator_id: string;
  camps: string[];
  raw_votes: number[];
  ai_boost_percents: number[];
  final_votes: number[];
  total_participants: number;
  heat: number;
  expire_at: string | null;
  ai_boost_expire_at: string | null;
  leading_camp: number;
  cover_image: string | null;
  status: TopicStatus;
  support_pool: number;
  sponsored_by: string | null;
  created_at: string;
  creator?: Profile;
}

export interface Vote {
  id: string;
  topic_id: string;
  user_id: string;
  camp_index: number;
  points: number;
  created_at: string;
}

export interface Comment {
  id: string;
  topic_id: string;
  user_id: string;
  camp_index: number | null;
  content: string;
  images: string[];
  likes: number;
  replies: number;
  is_hot: boolean;
  created_at: string;
  user?: Profile;
}

export interface AIJudgment {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  ai_summary: string | null;
  ai_taunt: string | null;
  favored_camp: number | null;
  boost_percent: number | null;
  points_cost: number;
  created_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  reason: string;
  delta: number;
  balance: number;
  topic_id: string | null;
  created_at: string;
  topic?: Topic;
}

export interface CashTransaction {
  id: string;
  user_id: string;
  reason: string;
  amount: number;
  balance: number;
  topic_id: string | null;
  created_at: string;
  topic?: Topic;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  status: WithdrawalStatus;
  bank_info: Record<string, any> | null;
  processed_at: string | null;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string | null;
  topic_id: string | null;
  is_read: boolean;
  created_at: string;
  topic?: Topic;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface GlobalStats {
  northTotalPower: number;
  southTotalPower: number;
  northSeasonPower: number;
  southSeasonPower: number;
  seasonEndTime: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  type: 'ticket' | 'adfree' | 'physical';
}
