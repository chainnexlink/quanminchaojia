import type { User, Topic, GlobalStats, ShopItem } from '../types';

export const currentUser: User = {
  id: 'u1',
  nickname: '嘲珈达人',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
  camp: 'north',
  points: 2580,
  totalPower: 1560,
  seasonPower: 320
};

export const globalStats: GlobalStats = {
  northTotalPower: 125680,
  southTotalPower: 118520,
  northSeasonPower: 8560,
  southSeasonPower: 7920,
  seasonEndTime: '2026-05-01T00:00:00Z'
};

export const mockTopics: Topic[] = [
  {
    id: 't1',
    title: '豆腐脑吃咸还是甜？',
    debate_type: 'culture',
    creator_id: 'u2',
    camps: ['北方', '南方'],
    raw_votes: [2560, 1890],
    ai_boost_percents: [0, 0],
    final_votes: [2560, 1890],
    total_participants: 2,
    heat: 4450,
    expire_at: '2026-04-29T00:00:00Z',
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-26T10:00:00Z'
  },
  {
    id: 't2',
    title: '粽子是甜的好吃还是咸的好吃？',
    debate_type: 'culture',
    creator_id: 'u5',
    camps: ['北方', '南方'],
    raw_votes: [1890, 2340],
    ai_boost_percents: [0, 0],
    final_votes: [1890, 2340],
    total_participants: 0,
    heat: 4230,
    expire_at: '2026-04-28T00:00:00Z',
    ai_boost_expire_at: null,
    leading_camp: 1,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-25T08:00:00Z'
  },
  {
    id: 't3',
    title: '冬天室内该有暖气吗？',
    debate_type: 'culture',
    creator_id: 'u6',
    camps: ['北方', '南方'],
    raw_votes: [4560, 1230],
    ai_boost_percents: [0, 0],
    final_votes: [4560, 1230],
    total_participants: 0,
    heat: 5790,
    expire_at: '2026-04-27T00:00:00Z',
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-24T14:00:00Z'
  }
];

export const shopItems: ShopItem[] = [
  {
    id: 's1',
    name: '额外投票券 x3',
    description: '本期话题额外获得3次投票机会',
    points: 100,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    type: 'ticket'
  },
  {
    id: 's2',
    name: '免广告卡 7天',
    description: '7天内观看内容免广告',
    points: 300,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    type: 'adfree'
  },
  {
    id: 's3',
    name: '定制马克杯',
    description: '南北对战限定版马克杯',
    points: 800,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
    type: 'physical'
  },
  {
    id: 's4',
    name: '额外投票券 x10',
    description: '本期话题额外获得10次投票机会',
    points: 280,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    type: 'ticket'
  },
  {
    id: 's5',
    name: '免广告卡 30天',
    description: '30天内观看内容免广告',
    points: 1000,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    type: 'adfree'
  },
  {
    id: 's6',
    name: '限定T恤',
    description: '南北对战限定版T恤',
    points: 1500,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    type: 'physical'
  }
];

export const getCountdown = (endTime: string): string => {
  const end = new Date(endTime).getTime();
  const now = new Date().getTime();
  const diff = end - now;
  if (diff <= 0) return '已结束';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days}天${hours}时`;
};
