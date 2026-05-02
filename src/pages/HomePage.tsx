import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Flame, Clock, MapPin, Users, ChevronRight, Swords, Trophy, TrendingUp, MessageCircle, Bot, Zap, Shield, Target, Crown, Sparkles, Heart, Share2, MessageSquare, Bookmark, ChevronDown, Coffee, Home, Globe, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Tables } from '../supabase/types';
import { defaultAIModels, type AIModelConfig, modelIconSVGs } from '../services/aiModels';
import { calculateDisplayVotes } from '../services/aiBoostService';
import { useToast } from '../components/Toast';

type Topic = Tables<'topics'> & {
  creator?: Partial<Tables<'profiles'>>;
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  category?: string;
};

const cultureTopics: Topic[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: '豆腐脑甜咸之争',
    debate_type: 'culture',
    creator_id: 'user1',
    camps: ['甜党', '咸党'],
    raw_votes: [1250, 980],
    ai_boost_percents: [5, 3],
    final_votes: [1313, 1009],
    total_participants: 2232,
    heat: 95,
    expire_at: null,
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-20T10:00:00Z',
    updated_at: null,
    creator: { nickname: '美食家', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
    likes: 342,
    comments: 128,
    shares: 56,
    isLiked: false,
    isBookmarked: false,
    category: 'food'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: '南北供暖差异',
    debate_type: 'culture',
    creator_id: 'user2',
    camps: ['南方应该供暖', '南方不需要供暖'],
    raw_votes: [890, 1120],
    ai_boost_percents: [8, 6],
    final_votes: [961, 1187],
    total_participants: 2148,
    heat: 88,
    expire_at: null,
    ai_boost_expire_at: null,
    leading_camp: 1,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-18T14:30:00Z',
    updated_at: null,
    creator: { nickname: '暖气君', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    likes: 289,
    comments: 95,
    shares: 42,
    isLiked: true,
    isBookmarked: false,
    category: 'regional'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: '粽子甜咸大战',
    debate_type: 'culture',
    creator_id: 'user4',
    camps: ['甜粽', '咸粽'],
    raw_votes: [2100, 1850],
    ai_boost_percents: [3, 4],
    final_votes: [2163, 1924],
    total_participants: 4087,
    heat: 92,
    expire_at: null,
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-22T08:00:00Z',
    updated_at: null,
    creator: { nickname: '粽子达人', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
    likes: 567,
    comments: 234,
    shares: 89,
    isLiked: false,
    isBookmarked: true,
    category: 'food'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: '奶茶加不加珍珠',
    debate_type: 'culture',
    creator_id: 'user5',
    camps: ['必须加', '不加'],
    raw_votes: [3200, 890],
    ai_boost_percents: [2, 1],
    final_votes: [3264, 899],
    total_participants: 4163,
    heat: 78,
    expire_at: null,
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-21T16:00:00Z',
    updated_at: null,
    creator: { nickname: '奶茶控', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
    likes: 423,
    comments: 156,
    shares: 67,
    isLiked: false,
    isBookmarked: false,
    category: 'food'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    title: '过年该回谁家',
    debate_type: 'culture',
    creator_id: 'user8',
    camps: ['回男方家', '回女方家'],
    raw_votes: [1560, 1780],
    ai_boost_percents: [4, 5],
    final_votes: [1622, 1869],
    total_participants: 3491,
    heat: 90,
    expire_at: null,
    ai_boost_expire_at: null,
    leading_camp: 1,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-23T12:00:00Z',
    updated_at: null,
    creator: { nickname: '年味达人', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8' },
    likes: 478,
    comments: 198,
    shares: 73,
    isLiked: false,
    isBookmarked: false,
    category: 'custom'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    title: '北方澡堂文化能接受吗',
    debate_type: 'culture',
    creator_id: 'user9',
    camps: ['完全接受', '无法理解'],
    raw_votes: [980, 1450],
    ai_boost_percents: [3, 2],
    final_votes: [1009, 1479],
    total_participants: 2488,
    heat: 85,
    expire_at: null,
    ai_boost_expire_at: null,
    leading_camp: 1,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-24T09:00:00Z',
    updated_at: null,
    creator: { nickname: '南方人小李', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9' },
    likes: 356,
    comments: 167,
    shares: 58,
    isLiked: false,
    isBookmarked: false,
    category: 'lifestyle'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    title: '早餐吃粥还是面包',
    debate_type: 'culture',
    creator_id: 'user10',
    camps: ['中式粥点', '西式面包'],
    raw_votes: [2200, 1600],
    ai_boost_percents: [4, 3],
    final_votes: [2288, 1648],
    total_participants: 3936,
    heat: 82,
    expire_at: null,
    ai_boost_expire_at: null,
    leading_camp: 0,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-25T07:00:00Z',
    updated_at: null,
    creator: { nickname: '早起鸟', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10' },
    likes: 298,
    comments: 142,
    shares: 45,
    isLiked: false,
    isBookmarked: false,
    category: 'food'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    title: '方言该不该在公共场合讲',
    debate_type: 'culture',
    creator_id: 'user11',
    camps: ['可以讲', '应该说普通话'],
    raw_votes: [1100, 1350],
    ai_boost_percents: [2, 3],
    final_votes: [1122, 1391],
    total_participants: 2513,
    heat: 76,
    expire_at: null,
    ai_boost_expire_at: null,
    leading_camp: 1,
    cover_image: null,
    status: 'approved',
    support_pool: 0,
    sponsored_by: null,
    created_at: '2026-04-26T11:00:00Z',
    updated_at: null,
    creator: { nickname: '语言学家', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11' },
    likes: 234,
    comments: 119,
    shares: 38,
    isLiked: false,
    isBookmarked: false,
    category: 'regional'
  }
];

export function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'lifestyle' | 'regional' | 'custom'>('all');
  const [loading, setLoading] = useState(true);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModelConfig>(defaultAIModels[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([...cultureTopics]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const getDisplayVotes = (topic: Topic) => {
    return calculateDisplayVotes(
      topic.raw_votes || [0, 0],
      topic.ai_boost_percents,
      topic.ai_boost_expire_at,
      topic.debate_type
    );
  };

  const getCampPercent = (topic: Topic, index: number) => {
    const { displayVotes } = getDisplayVotes(topic);
    const total = displayVotes.reduce((a, b) => a + b, 0);
    if (total === 0) return 50;
    return (displayVotes[index] / total) * 100;
  };

  const handleAiSummon = (e: React.MouseEvent, topic: Topic) => {
    e.stopPropagation();
    setSelectedTopic(topic);
    setAiModalOpen(true);
  };

  const handleAiSubmit = () => {
    if (!aiInput.trim() || !selectedTopic) return;
    navigate(`/topic/${selectedTopic.id}?ai=true&content=${encodeURIComponent(aiInput)}`);
    setAiModalOpen(false);
    setAiInput('');
  };

  const handleLike = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    const target = topics.find(t => t.id === topicId);
    const willLike = !target?.isLiked;
    setTopics(prev => prev.map(t => 
      t.id === topicId 
        ? { ...t, isLiked: !t.isLiked, likes: t.isLiked ? (t.likes || 0) - 1 : (t.likes || 0) + 1 }
        : t
    ));
    showToast(willLike ? '已点赞' : '已取消点赞', willLike ? 'success' : 'info');
  };

  const handleBookmark = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    const target = topics.find(t => t.id === topicId);
    const willBookmark = !target?.isBookmarked;
    setTopics(prev => prev.map(t => 
      t.id === topicId 
        ? { ...t, isBookmarked: !t.isBookmarked }
        : t
    ));
    showToast(willBookmark ? '已收藏' : '已取消收藏', willBookmark ? 'success' : 'info');
  };

  const handleShare = (e: React.MouseEvent, topic: Topic) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#/share/${topic.id}`;
    if (navigator.share) {
      navigator.share({
        title: topic.title,
        text: `${topic.camps?.[0]} vs ${topic.camps?.[1]}，快来参与讨论！`,
        url: shareUrl
      }).catch(() => {
        navigate(`/share/${topic.id}`);
      });
    } else {
      navigate(`/share/${topic.id}`);
    }
  };

  const categoryLabels: Record<string, { label: string; gradient: string }> = {
    food: { label: '饮食文化', gradient: 'from-orange-400 to-amber-400' },
    lifestyle: { label: '生活习惯', gradient: 'from-emerald-400 to-teal-400' },
    regional: { label: '地域差异', gradient: 'from-violet-400 to-purple-400' },
    custom: { label: '民俗传统', gradient: 'from-rose-400 to-pink-400' },
  };

  const TopicCard = ({ topic, index }: { topic: Topic; index: number }) => {
    const campPercent = getCampPercent(topic, 0);
    const catInfo = categoryLabels[topic.category || 'food'] || categoryLabels.food;
    const isHovered = hoveredCard === topic.id;
    const camp1Wins = campPercent > 50;
    const { displayVotes, activeBoosts, isBoostActive } = getDisplayVotes(topic);
    
    return (
      <motion.div
        key={topic.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01, y: -2 }}
        onHoverStart={() => setHoveredCard(topic.id)}
        onHoverEnd={() => setHoveredCard(null)}
        className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 cursor-pointer"
        style={{
          boxShadow: isHovered 
            ? '0 20px 40px -10px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.3)' 
            : '0 4px 20px -4px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400" />
        
        <div className="p-4">
          <div onClick={() => navigate(`/topic/${topic.id}`)}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 bg-gradient-to-r ${catInfo.gradient} text-white`}
                  >
                    <Crown size={10} />
                    {catInfo.label}
                  </motion.span>
                  {(topic.heat || 0) > 90 && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-xs bg-gradient-to-r from-orange-400 to-red-400 text-white px-2 py-1 rounded-full flex items-center gap-1 font-bold"
                    >
                      <Flame size={10} /> 热门
                    </motion.span>
                  )}
                </div>
                <h3 className="font-bold text-slate-100 text-lg leading-tight">{topic.title}</h3>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                  <Users size={10} />
                  <span className="font-medium">{topic.total_participants || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                    <TrendingUp size={10} />
                    <span className="font-medium">{topic.heat || 0}</span>
                  </div>
              </div>
            </div>

            <div className="relative mb-4 bg-slate-700/30 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <motion.div 
                  className={`flex items-center gap-2 ${camp1Wins ? 'text-cyan-400' : 'text-slate-500'}`}
                  animate={camp1Wins ? { x: [0, -2, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Shield className={`w-5 h-5 ${camp1Wins ? 'text-cyan-400' : 'text-slate-600'}`} />
                  <span className={`font-bold ${camp1Wins ? 'text-cyan-300' : 'text-slate-500'}`}>{topic.camps?.[0]}</span>
                  {camp1Wins && <Crown className="w-4 h-4 text-amber-400" />}
                </motion.div>
                <span className="text-slate-500 text-xs font-bold px-2">VS</span>
                <motion.div 
                  className={`flex items-center gap-2 ${!camp1Wins ? 'text-pink-400' : 'text-slate-500'}`}
                  animate={!camp1Wins ? { x: [0, 2, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {!camp1Wins && <Crown className="w-4 h-4 text-amber-400" />}
                  <span className={`font-bold ${!camp1Wins ? 'text-pink-300' : 'text-slate-500'}`}>{topic.camps?.[1]}</span>
                  <Target className={`w-5 h-5 ${!camp1Wins ? 'text-pink-400' : 'text-slate-600'}`} />
                </motion.div>
              </div>
              
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${campPercent}%` }}
                  transition={{ duration: 1, delay: index * 0.1, type: "spring" }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-cyan-300"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - campPercent}%` }}
                  transition={{ duration: 1, delay: index * 0.1, type: "spring" }}
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-pink-400 to-pink-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                  </motion.div>
                </div>
              </div>
              
              <div className="flex justify-between text-xs mt-2">
                <motion.span 
                  className={`font-bold ${camp1Wins ? 'text-cyan-400' : 'text-slate-500'}`}
                  animate={camp1Wins ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {displayVotes[0]} 票
                  {isBoostActive && activeBoosts[0] > 0 && (
                    <span className="text-green-400 ml-1 text-[10px]">+{activeBoosts[0]}%</span>
                  )}
                </motion.span>
                <motion.span 
                  className={`font-bold ${!camp1Wins ? 'text-pink-400' : 'text-slate-500'}`}
                  animate={!camp1Wins ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {displayVotes[1]} 票
                  {isBoostActive && activeBoosts[1] > 0 && (
                    <span className="text-green-400 ml-1 text-[10px]">+{activeBoosts[1]}%</span>
                  )}
                </motion.span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); navigate(`/user/${topic.creator_id}`); }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <img
                  src={topic.creator?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.creator_id}`}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-slate-600"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-800" />
              </div>
              <span className="text-xs font-medium text-slate-300">{topic.creator?.nickname || '匿名'}</span>
            </motion.div>
            
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleLike(e, topic.id)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  topic.isLiked 
                    ? 'text-pink-400 bg-pink-400/10' 
                    : 'text-slate-400 hover:text-pink-400 hover:bg-pink-400/10'
                }`}
              >
                <Heart size={14} className={topic.isLiked ? 'fill-current' : ''} />
                <span>{topic.likes || 0}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(`/topic/${topic.id}#comments`)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
              >
                <MessageSquare size={14} />
                <span>{topic.comments || 0}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleShare(e, topic)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
              >
                <Share2 size={14} />
                <span>{topic.shares || 0}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleBookmark(e, topic.id)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  topic.isBookmarked 
                    ? 'text-amber-400 bg-amber-400/10' 
                    : 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10'
                }`}
              >
                <Bookmark size={14} className={topic.isBookmarked ? 'fill-current' : ''} />
              </motion.button>
            </div>
          </div>
          
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
              <span>参与PK</span>
              <ChevronRight size={14} />
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const displayedTopics = activeTab === 'all' 
    ? topics 
    : topics.filter(t => t.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-900 text-white px-4 pt-3 pb-4 relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-slate-800/80 rounded-full flex items-center px-4 py-2 border border-slate-700/50">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="搜索话题"
              onClick={() => navigate('/search')}
              className="bg-transparent outline-none text-sm ml-2 flex-1 cursor-pointer text-slate-200 placeholder-slate-500"
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/ranking')}
            className="flex-1 bg-slate-800/60 rounded-xl p-3 cursor-pointer border border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
                <Swords className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-slate-400">今日PK</span>
            </div>
            <p className="text-lg font-bold text-slate-100">12,580</p>
            <p className="text-xs text-slate-500">场辩论进行中</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/topic/550e8400-e29b-41d4-a716-446655440001')}
            className="flex-1 bg-slate-800/60 rounded-xl p-3 cursor-pointer border border-slate-700/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-slate-400">热门话题</span>
            </div>
            <p className="text-base font-bold text-slate-100">豆腐脑甜咸</p>
            <p className="text-xs text-slate-500">95热度</p>
          </motion.div>
        </div>
      </div>

      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md shadow-lg shadow-slate-900/50 border-b border-slate-700/50">
        <div className="flex px-4 py-3 gap-2 overflow-x-auto no-scrollbar">
          {[
            { key: 'all', label: '全部', icon: TrendingUp },
            { key: 'food', label: '饮食文化', icon: Coffee },
            { key: 'lifestyle', label: '生活习惯', icon: Home },
            { key: 'regional', label: '地域差异', icon: Globe },
            { key: 'custom', label: '民俗传统', icon: Star }
          ].map(tab => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'food' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Coffee className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">饮食文化</span>
              </div>
              <p className="text-sm text-white/90">甜咸之争、南北饮食、美食习惯大讨论</p>
            </motion.div>
          )}

          {activeTab === 'lifestyle' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">生活习惯</span>
              </div>
              <p className="text-sm text-white/90">洗澡习惯、作息方式、生活差异大PK</p>
            </motion.div>
          )}

          {activeTab === 'regional' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl p-4 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">地域差异</span>
              </div>
              <p className="text-sm text-white/90">南北方言、供暖差异、地域文化大碰撞</p>
            </motion.div>
          )}

          {activeTab === 'custom' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-4 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">民俗传统</span>
              </div>
              <p className="text-sm text-white/90">过年回谁家、节日习俗、传统文化讨论</p>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-8 text-slate-400">加载中...</div>
        ) : (
          <div className="space-y-4">
            {displayedTopics.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} index={i} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {aiModalOpen && selectedTopic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setAiModalOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-3xl p-6 w-full max-w-sm relative overflow-hidden border border-slate-700"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">AI召唤</h3>
                  <p className="text-xs text-slate-400">{selectedTopic.title}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">输入你的观点，AI将为你分析并助力你支持的阵营</p>

              <div className="mb-4">
                <label className="text-xs text-slate-500 mb-2 block">选择AI模型</label>
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl flex items-center justify-between text-slate-200 hover:border-violet-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${selectedModel.iconColor} flex items-center justify-center shadow-lg`}
                        dangerouslySetInnerHTML={{ __html: modelIconSVGs[selectedModel.icon] || '' }}
                      />
                      <span className="text-sm font-medium">{selectedModel.name}</span>
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
                  onClick={() => setAiModalOpen(false)}
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
