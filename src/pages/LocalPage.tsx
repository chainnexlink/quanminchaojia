import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Search, Clock, Users, Sparkles, ChevronRight, Trophy,
  TrendingUp, Flame, Plus, Filter, AlertCircle, CheckCircle2,
  Timer, Coins, Shield, Crown, Lock, ArrowUpRight, Bot, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { defaultAIModels, type AIModelConfig, modelIconSVGs } from '../services/aiModels';
import type { Tables } from '../supabase/types';

type Topic = Tables<'topics'> & {
  creator?: Partial<Tables<'profiles'>>;
  camp_supports?: number[];
};

// Settlement distribution
const SETTLEMENT = {
  WINNER_RATIO: 0.70,
  CREATOR_RATIO: 0.05,
  PLATFORM_RATIO: 0.05,
  OPERATIONS_RATIO: 0.20,
};

const SUPPORT_MIN = 10;
const SUPPORT_MAX = 1000;
const CREATE_COST = 100;

type TopicStatus = 'active' | 'ended' | 'settled';

function getTopicStatus(topic: Topic): TopicStatus {
  if (!topic.expire_at) return 'active';
  const now = Date.now();
  const expire = new Date(topic.expire_at).getTime();
  if (now < expire) return 'active';
  return 'ended';
}

function getTimeRemaining(expireAt: string | null): { text: string; urgent: boolean; expired: boolean } {
  if (!expireAt) return { text: '无限期', urgent: false, expired: false };
  const diff = new Date(expireAt).getTime() - Date.now();
  if (diff <= 0) return { text: '已结束', urgent: false, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return { text: `${days}天${hours}时`, urgent: days < 1, expired: false };
  if (hours > 0) return { text: `${hours}时${mins}分`, urgent: hours < 6, expired: false };
  return { text: `${mins}分钟`, urgent: true, expired: false };
}

// Mock local topics with Mode 2 data
const mockLocalTopics: Topic[] = [
  {
    id: 'local-001',
    title: '周末聚餐去哪吃',
    debate_type: 'local',
    creator_id: 'user3',
    camps: ['火锅', '烧烤', '日料', '川菜'],
    raw_votes: [45, 38, 22, 18],
    ai_boost_percents: null,
    final_votes: null,
    total_participants: 123,
    heat: 72,
    expire_at: '2026-05-05T23:59:59Z',
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 3280,
    sponsored_by: null,
    created_at: '2026-04-25T09:00:00Z',
    updated_at: null,
    creator: { nickname: '吃货小王', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    camp_supports: [1200, 980, 650, 450],
  },
  {
    id: 'local-002',
    title: '周末羽毛球约战选场地',
    debate_type: 'local',
    creator_id: 'user6',
    camps: ['奥体中心', '社区球馆'],
    raw_votes: [32, 28],
    ai_boost_percents: null,
    final_votes: null,
    total_participants: 60,
    heat: 45,
    expire_at: '2026-05-03T18:00:00Z',
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 1500,
    sponsored_by: null,
    created_at: '2026-04-26T10:00:00Z',
    updated_at: null,
    creator: { nickname: '运动达人', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
    camp_supports: [800, 700],
  },
  {
    id: 'local-003',
    title: '五一去哪玩',
    debate_type: 'local',
    creator_id: 'user7',
    camps: ['周边游', '宅家', '自驾远游', '出国'],
    raw_votes: [89, 56, 34, 12],
    ai_boost_percents: null,
    final_votes: null,
    total_participants: 191,
    heat: 88,
    expire_at: '2026-05-01T08:00:00Z',
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 5600,
    sponsored_by: null,
    created_at: '2026-04-27T08:00:00Z',
    updated_at: null,
    creator: { nickname: '旅行家', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7' },
    camp_supports: [2100, 1500, 1200, 800],
  },
  {
    id: 'local-004',
    title: '公司团建方案投票',
    debate_type: 'local',
    creator_id: 'user8',
    camps: ['密室逃脱', '户外拓展', 'KTV', '桌游', '剧本杀'],
    raw_votes: [28, 22, 15, 18, 32],
    ai_boost_percents: null,
    final_votes: null,
    total_participants: 115,
    heat: 62,
    expire_at: '2026-05-02T12:00:00Z',
    ai_boost_expire_at: null,
    leading_camp: 4,
    cover_image: null,
    status: 'approved',
    support_pool: 4200,
    sponsored_by: null,
    created_at: '2026-04-28T14:00:00Z',
    updated_at: null,
    creator: { nickname: 'HR小姐姐', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8' },
    camp_supports: [800, 650, 450, 520, 1780],
  },
  {
    id: 'local-005',
    title: '最好吃的早餐是什么',
    debate_type: 'local',
    creator_id: 'user9',
    camps: ['包子油条', '煎饼果子', '肠粉', '豆浆配烧饼'],
    raw_votes: [120, 95, 88, 67],
    ai_boost_percents: null,
    final_votes: null,
    total_participants: 370,
    heat: 92,
    expire_at: '2026-04-29T23:59:59Z',
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 8500,
    sponsored_by: null,
    created_at: '2026-04-22T08:00:00Z',
    updated_at: null,
    creator: { nickname: '早餐达人', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9' },
    camp_supports: [3200, 2500, 1800, 1000],
  },
];

const campColors = [
  { bg: 'from-cyan-500 to-blue-500', text: 'text-cyan-400', bar: 'bg-cyan-400', light: 'bg-cyan-400/15 text-cyan-400', border: 'border-cyan-500/30' },
  { bg: 'from-pink-500 to-rose-500', text: 'text-pink-400', bar: 'bg-pink-400', light: 'bg-pink-400/15 text-pink-400', border: 'border-pink-500/30' },
  { bg: 'from-amber-500 to-orange-500', text: 'text-amber-400', bar: 'bg-amber-400', light: 'bg-amber-400/15 text-amber-400', border: 'border-amber-500/30' },
  { bg: 'from-emerald-500 to-green-500', text: 'text-emerald-400', bar: 'bg-emerald-400', light: 'bg-emerald-400/15 text-emerald-400', border: 'border-emerald-500/30' },
  { bg: 'from-violet-500 to-purple-500', text: 'text-violet-400', bar: 'bg-violet-400', light: 'bg-violet-400/15 text-violet-400', border: 'border-violet-500/30' },
  { bg: 'from-red-500 to-rose-600', text: 'text-red-400', bar: 'bg-red-400', light: 'bg-red-400/15 text-red-400', border: 'border-red-500/30' },
];

function getCampColor(index: number) {
  return campColors[index % campColors.length];
}

type FilterType = 'all' | 'active' | 'ended' | 'hot';

export function LocalPage() {
  const navigate = useNavigate();
  const { user } = useStore();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [topics, setTopics] = useState<Topic[]>(mockLocalTopics);
  const [supportModal, setSupportModal] = useState<{ topic: Topic; campIndex: number } | null>(null);
  const [supportAmount, setSupportAmount] = useState('');
  const [, setTick] = useState(0);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModelConfig>(defaultAIModels[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Countdown timer refresh
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredTopics = topics.filter(t => {
    if (searchQuery && !t.title.includes(searchQuery)) return false;
    const status = getTopicStatus(t);
    if (filter === 'active') return status === 'active';
    if (filter === 'ended') return status === 'ended' || status === 'settled';
    if (filter === 'hot') return (t.heat || 0) > 70;
    return true;
  });

  const handleOpenSupport = useCallback((e: React.MouseEvent, topic: Topic, campIndex: number) => {
    e.stopPropagation();
    const status = getTopicStatus(topic);
    if (status !== 'active') {
      showToast('该话题已结束，无法支持', 'error');
      return;
    }
    setSupportModal({ topic, campIndex });
    setSupportAmount('');
  }, [showToast]);

  const handleSupport = useCallback(() => {
    if (!supportModal || !user) {
      showToast('请先登录', 'error');
      return;
    }
    const amount = parseInt(supportAmount);
    if (isNaN(amount) || amount < SUPPORT_MIN || amount > SUPPORT_MAX) {
      showToast(`支持数量需在 ${SUPPORT_MIN}-${SUPPORT_MAX} 辩豆之间`, 'error');
      return;
    }
    if ((user.points ?? 0) < amount) {
      showToast('辩豆不足，请先充值', 'error');
      return;
    }

    const { topic, campIndex } = supportModal;
    setTopics(prev => prev.map(t => {
      if (t.id !== topic.id) return t;
      const newSupports = [...(t.camp_supports || t.camps.map(() => 0))];
      newSupports[campIndex] = (newSupports[campIndex] || 0) + amount;
      const newVotes = [...(t.raw_votes || t.camps.map(() => 0))];
      newVotes[campIndex] = (newVotes[campIndex] || 0) + 1;
      return {
        ...t,
        camp_supports: newSupports,
        raw_votes: newVotes,
        support_pool: (t.support_pool || 0) + amount,
        total_participants: (t.total_participants || 0) + 1,
      };
    }));

    showToast(`成功支持 "${topic.camps[campIndex]}"，消耗 ${amount} 辩豆`, 'success');
    setSupportModal(null);
  }, [supportModal, supportAmount, user, showToast]);

  const handleAiSummon = useCallback((e: React.MouseEvent, topic: Topic) => {
    e.stopPropagation();
    setSelectedTopic(topic);
    setAiModalOpen(true);
  }, []);

  const handleAiSubmit = useCallback(() => {
    if (!aiInput.trim() || !selectedTopic) return;
    navigate(`/topic/${selectedTopic.id}?ai=true&content=${encodeURIComponent(aiInput)}`);
    setAiModalOpen(false);
    setAiInput('');
  }, [aiInput, selectedTopic, navigate]);

  const getWinnerIndex = (topic: Topic): number => {
    const supports = topic.camp_supports || [];
    if (supports.length === 0) return 0;
    let maxIdx = 0;
    for (let i = 1; i < supports.length; i++) {
      if ((supports[i] || 0) > (supports[maxIdx] || 0)) maxIdx = i;
    }
    return maxIdx;
  };

  const getSettlementPreview = (topic: Topic) => {
    const pool = topic.support_pool || 0;
    return {
      winnerPool: Math.floor(pool * SETTLEMENT.WINNER_RATIO),
      creatorReward: Math.floor(pool * SETTLEMENT.CREATOR_RATIO),
      platformFee: Math.floor(pool * SETTLEMENT.PLATFORM_RATIO),
      operationsPool: Math.floor(pool * SETTLEMENT.OPERATIONS_RATIO),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 pt-3 pb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">同城辩论</h1>
                <p className="text-xs text-white/70">用辩豆支持你的立场</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/publish')}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-bold"
            >
              <Plus size={16} /> 发起 <span className="text-amber-300 text-xs">({CREATE_COST}豆)</span>
            </motion.button>
          </div>

          {/* Stats bar */}
          <div className="flex gap-3 mt-2">
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold">{topics.length}</p>
              <p className="text-xs text-white/70">进行中</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold">{topics.reduce((s, t) => s + (t.support_pool || 0), 0).toLocaleString()}</p>
              <p className="text-xs text-white/70">辩豆池</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold">{topics.reduce((s, t) => s + (t.total_participants || 0), 0)}</p>
              <p className="text-xs text-white/70">参与者</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-slate-700/50 rounded-xl flex items-center px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="搜索同城话题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm ml-2 flex-1 text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {([
              { key: 'all', label: '全部', icon: Filter },
              { key: 'active', label: '进行中', icon: Timer },
              { key: 'ended', label: '已结束', icon: CheckCircle2 },
              { key: 'hot', label: '热门', icon: Flame },
            ] as const).map(item => (
              <motion.button
                key={item.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(item.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === item.key
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700/50 text-slate-400 border border-transparent'
                }`}
              >
                <item.icon size={12} /> {item.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Settlement rules hint */}
      <div className="px-4 mt-3">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-amber-500/20 flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-amber-400 font-bold">结算规则：</span>
            胜方支持者分 <span className="text-emerald-400 font-bold">70%</span> 奖池 |
            创建者 <span className="text-cyan-400 font-bold">5%</span> |
            平台 <span className="text-slate-300 font-bold">5%</span> |
            运营回流 <span className="text-violet-400 font-bold">20%</span>
          </p>
        </div>
      </div>

      {/* Topic list */}
      <div className="p-4 space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">暂无同城话题</p>
            <p className="text-slate-500 text-sm mt-1">发起第一个话题吧！</p>
          </div>
        ) : (
          filteredTopics.map((topic, i) => {
            const status = getTopicStatus(topic);
            const timeInfo = getTimeRemaining(topic.expire_at);
            const winnerIdx = getWinnerIndex(topic);
            const totalSupport = topic.camp_supports?.reduce((a, b) => a + b, 0) || topic.support_pool || 0;
            const settlement = getSettlementPreview(topic);

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border cursor-pointer relative ${
                  status === 'ended'
                    ? 'border-slate-600/50 opacity-80'
                    : 'border-slate-700/50'
                }`}
                onClick={() => navigate(`/topic/${topic.id}`)}
              >
                {/* Top bar gradient */}
                <div className={`h-1 ${
                  status === 'ended'
                    ? 'bg-slate-600'
                    : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
                }`} />

                <div className="p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900">
                          <MapPin size={10} /> 同城
                        </span>
                        {/* Countdown */}
                        <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium ${
                          timeInfo.expired
                            ? 'bg-slate-600/50 text-slate-400'
                            : timeInfo.urgent
                              ? 'bg-red-400/15 text-red-400 animate-pulse'
                              : 'bg-amber-400/15 text-amber-400'
                        }`}>
                          <Clock size={10} /> {timeInfo.text}
                        </span>
                        {status === 'ended' && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-600/50 text-slate-300 flex items-center gap-1 font-bold">
                            <Lock size={10} /> 已结束
                          </span>
                        )}
                        {(topic.heat || 0) > 80 && status === 'active' && (
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-xs px-2 py-1 rounded-full bg-orange-400/15 text-orange-400 flex items-center gap-1 font-bold"
                          >
                            <Flame size={10} /> 热门
                          </motion.span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-100 text-lg leading-tight">{topic.title}</h3>
                    </div>
                  </div>

                  {/* Support Pool display */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl px-3 py-2 border border-amber-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sparkles size={14} className="text-amber-400" />
                          <span className="text-xs text-slate-400">奖池总额</span>
                        </div>
                        <span className="text-lg font-bold text-amber-400">{(topic.support_pool || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Coins size={10} className="text-amber-400/60" />
                        <span className="text-[10px] text-slate-500">辩豆</span>
                        <span className="text-[10px] text-slate-600 mx-1">|</span>
                        <Users size={10} className="text-slate-500" />
                        <span className="text-[10px] text-slate-500">{topic.total_participants} 人参与</span>
                      </div>
                    </div>
                    {status === 'ended' && (
                      <div className="bg-slate-700/50 rounded-xl px-3 py-2 border border-slate-600/50 text-center">
                        <Trophy size={16} className="text-amber-400 mx-auto mb-1" />
                        <p className="text-[10px] text-slate-400">胜方瓜分</p>
                        <p className="text-sm font-bold text-emerald-400">{settlement.winnerPool.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Camps with support bars */}
                  <div className="space-y-2 mb-3">
                    {topic.camps.map((camp, ci) => {
                      const support = topic.camp_supports?.[ci] || 0;
                      const percent = totalSupport > 0 ? (support / totalSupport) * 100 : 0;
                      const isWinner = ci === winnerIdx && status === 'ended';
                      const color = getCampColor(ci);

                      return (
                        <div key={ci} className={`relative rounded-xl overflow-hidden ${isWinner ? 'ring-1 ring-amber-400/40' : ''}`}>
                          <div className="bg-slate-700/40 rounded-xl p-2.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                {isWinner && <Crown size={12} className="text-amber-400" />}
                                <span className={`text-sm font-bold ${color.text}`}>{camp}</span>
                                {isWinner && (
                                  <span className="text-[10px] bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">
                                    胜出
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{support.toLocaleString()} 豆</span>
                                <span className={`text-xs font-bold ${color.text}`}>{percent.toFixed(1)}%</span>
                              </div>
                            </div>
                            {/* Progress bar */}
                            <div className="h-2 bg-slate-600/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05 + ci * 0.03 }}
                                className={`h-full rounded-full ${color.bar}`}
                                style={{ opacity: isWinner ? 1 : 0.7 }}
                              />
                            </div>
                            {/* Support button */}
                            {status === 'active' && (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => handleOpenSupport(e, topic, ci)}
                                className={`mt-2 w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${color.light} border ${color.border} hover:opacity-80 transition-opacity`}
                              >
                                <ArrowUpRight size={12} /> 支持
                              </motion.button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <img
                        src={topic.creator?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.creator_id}`}
                        alt=""
                        className="w-6 h-6 rounded-full border border-slate-600"
                      />
                      <span className="text-xs text-slate-400">{topic.creator?.nickname || '匿名'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <TrendingUp size={10} /> {topic.heat || 0}热度
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        {topic.camps.length} 阵营
                      </span>
                    </div>
                  </div>

                  {/* AI召唤 & 详情 */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/30">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleAiSummon(e, topic)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/25"
                    >
                      <Bot size={14} /> AI召唤
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/topic/${topic.id}`)}
                      className="flex items-center gap-1 px-4 py-2 bg-slate-700 text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-600"
                    >
                      <span>详情</span>
                      <ChevronRight size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Support Modal */}
      <AnimatePresence>
        {supportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50"
            onClick={() => setSupportModal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-slate-800 rounded-t-3xl p-6 border-t border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4" />

              <h3 className="text-lg font-bold text-slate-100 mb-1">支持阵营</h3>
              <p className="text-sm text-slate-400 mb-4">
                为 <span className={`font-bold ${getCampColor(supportModal.campIndex).text}`}>
                  "{supportModal.topic.camps[supportModal.campIndex]}"
                </span> 投入辩豆
              </p>

              <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-400">支持数量</span>
                  <span className="text-xs text-slate-500">可用: {(user?.points ?? 0).toLocaleString()} 辩豆</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={supportAmount}
                    onChange={(e) => setSupportAmount(e.target.value)}
                    placeholder={`${SUPPORT_MIN} - ${SUPPORT_MAX}`}
                    min={SUPPORT_MIN}
                    max={SUPPORT_MAX}
                    className="flex-1 bg-slate-600/50 rounded-xl px-4 py-3 text-lg font-bold text-slate-100 outline-none border border-slate-600 focus:border-emerald-500/50 placeholder-slate-500"
                  />
                  <Coins size={20} className="text-amber-400" />
                </div>
                {/* Quick amounts */}
                <div className="flex gap-2 mt-3">
                  {[50, 100, 200, 500].map(amount => (
                    <motion.button
                      key={amount}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSupportAmount(String(amount))}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                        supportAmount === String(amount)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-600/50 text-slate-400 border border-transparent'
                      }`}
                    >
                      {amount}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Settlement preview */}
              <div className="bg-slate-700/30 rounded-xl p-3 mb-4">
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  <Shield size={10} /> 如果该阵营胜出，支持者按比例瓜分 70% 奖池
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                    <p className="text-slate-500">当前奖池</p>
                    <p className="text-amber-400 font-bold">{(supportModal.topic.support_pool || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                    <p className="text-slate-500">你的投入后</p>
                    <p className="text-emerald-400 font-bold">
                      {((supportModal.topic.support_pool || 0) + (parseInt(supportAmount) || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSupportModal(null)}
                  className="flex-1 py-3.5 bg-slate-700 rounded-xl text-slate-300 font-bold"
                >
                  取消
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSupport}
                  disabled={!supportAmount || parseInt(supportAmount) < SUPPORT_MIN}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                  确认支持
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI召唤 Modal */}
      <AnimatePresence>
        {aiModalOpen && selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => { setAiModalOpen(false); setShowModelDropdown(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-3xl p-6 w-full max-w-sm relative overflow-hidden border border-slate-700"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-violet-400 to-teal-400" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">AI召唤</h3>
                  <p className="text-xs text-slate-400">{selectedTopic.title}</p>
                </div>
              </div>

              {/* 阵营展示 */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedTopic.camps.map((camp, ci) => {
                  const color = getCampColor(ci);
                  return (
                    <span key={ci} className={`text-xs px-2 py-1 rounded-full font-medium ${color.light}`}>
                      {camp}
                    </span>
                  );
                })}
              </div>

              <p className="text-sm text-slate-400 mb-4">输入你的观点，AI将为你分析各阵营并给出评判</p>

              {/* 模型选择 */}
              <div className="mb-4">
                <label className="text-xs text-slate-500 mb-2 block">选择AI裁判</label>
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl flex items-center justify-between text-slate-200 hover:border-violet-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${selectedModel.iconColor} flex items-center justify-center shadow-lg`}
                        dangerouslySetInnerHTML={{ __html: modelIconSVGs[selectedModel.icon] || '' }}
                      />
                      <div className="text-left">
                        <span className="text-sm font-medium block">{selectedModel.name}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showModelDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-700 border border-slate-600 rounded-xl overflow-hidden z-20 max-h-48 overflow-y-auto"
                      >
                        {defaultAIModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model);
                              setShowModelDropdown(false);
                            }}
                            className={`w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-slate-600 transition-colors ${
                              selectedModel.id === model.id ? 'bg-violet-500/20' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${model.iconColor} flex items-center justify-center shadow-md`}
                              dangerouslySetInnerHTML={{ __html: modelIconSVGs[model.icon] || '' }}
                            />
                            <div className="flex-1">
                              <div className="text-slate-200 text-sm font-medium">{model.name}</div>
                            </div>
                            {selectedModel.id === model.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-violet-400"
                              >
                                <Sparkles className="w-3 h-3" />
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="输入你的观点..."
                className="w-full h-24 p-4 bg-slate-700/50 rounded-2xl text-sm resize-none outline-none focus:ring-2 focus:ring-violet-500/50 border border-slate-600 text-slate-200 placeholder-slate-500"
              />
              <div className="flex gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setAiModalOpen(false); setShowModelDropdown(false); }}
                  className="flex-1 py-3 bg-slate-700 rounded-xl text-slate-300 font-bold"
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAiSubmit}
                  disabled={!aiInput.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-violet-500/25 disabled:opacity-50"
                >
                  召唤AI
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
