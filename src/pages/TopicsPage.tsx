import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Users, Flame, ChevronRight, ChevronDown, Zap, TrendingUp, Heart, MapPin, Crown, Target, Shield, Clock, Sparkles, Coins, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { defaultAIModels, type AIModelConfig, modelIconSVGs } from '../services/aiModels';

const categories = ['全部', '饮食', '气候', '文化', '生活'];

interface TopicItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  camps: string[];
  raw_votes: number[];
  total_participants: number;
  heat: number;
  debate_type: 'culture' | 'local';
  expire_at?: string | null;
  support_pool?: number;
  camp_supports?: number[];
}

const mockTopics: TopicItem[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: '豆腐脑甜咸之争',
    category: '饮食',
    desc: '南北饮食文化的经典对决',
    camps: ['甜党', '咸党'],
    raw_votes: [1250, 980],
    total_participants: 2232,
    heat: 95,
    debate_type: 'culture'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: '南北供暖差异',
    category: '气候',
    desc: '南方冬天到底该不该供暖',
    camps: ['南方应该供暖', '南方不需要供暖'],
    raw_votes: [890, 1120],
    total_participants: 2148,
    heat: 88,
    debate_type: 'culture'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: '粽子甜咸大战',
    category: '饮食',
    desc: '端午节必战话题',
    camps: ['甜粽', '咸粽'],
    raw_votes: [2100, 1850],
    total_participants: 4087,
    heat: 92,
    debate_type: 'culture'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: '奶茶加不加珍珠',
    category: '饮食',
    desc: '奶茶党的信仰之争',
    camps: ['必须加', '不加'],
    raw_votes: [3200, 890],
    total_participants: 4163,
    heat: 78,
    debate_type: 'culture'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: '周末聚餐去哪吃',
    category: '生活',
    desc: '同城吃货的终极选择',
    camps: ['火锅', '烧烤', '日料', '川菜'],
    raw_votes: [45, 38, 22, 18],
    total_participants: 123,
    heat: 72,
    debate_type: 'local',
    expire_at: '2026-05-05T23:59:59Z',
    support_pool: 3280,
    camp_supports: [1200, 980, 650, 450],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: '周末羽毛球约战选场地',
    category: '生活',
    desc: '运动达人的周末安排',
    camps: ['奥体中心', '社区球馆'],
    raw_votes: [32, 28],
    total_participants: 60,
    heat: 45,
    debate_type: 'local',
    expire_at: '2026-05-03T18:00:00Z',
    support_pool: 1500,
    camp_supports: [800, 700],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    title: '五一去哪玩',
    category: '生活',
    desc: '假期安排大讨论',
    camps: ['周边游', '宅家', '自驾远游'],
    raw_votes: [89, 56, 34],
    total_participants: 179,
    heat: 85,
    debate_type: 'local',
    expire_at: '2026-05-01T08:00:00Z',
    support_pool: 5600,
    camp_supports: [2100, 1500, 2000],
  }
];

const campColors = [
  { text: 'text-cyan-400', bar: 'bg-cyan-400', light: 'bg-cyan-400/15 text-cyan-400' },
  { text: 'text-pink-400', bar: 'bg-pink-400', light: 'bg-pink-400/15 text-pink-400' },
  { text: 'text-amber-400', bar: 'bg-amber-400', light: 'bg-amber-400/15 text-amber-400' },
  { text: 'text-emerald-400', bar: 'bg-emerald-400', light: 'bg-emerald-400/15 text-emerald-400' },
  { text: 'text-violet-400', bar: 'bg-violet-400', light: 'bg-violet-400/15 text-violet-400' },
];

function getCampColor(index: number) {
  return campColors[index % campColors.length];
}

function getTimeRemaining(expireAt: string | null | undefined): { text: string; urgent: boolean; expired: boolean } {
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

export function TopicsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModelConfig>(defaultAIModels[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const filtered = mockTopics.filter(t =>
    (activeCategory === '全部' || t.category === activeCategory) &&
    t.title.includes(searchQuery)
  );

  const getCampPercent = (topic: TopicItem, index: number) => {
    const total = topic.raw_votes?.reduce((a, b) => a + b, 0) || 0;
    if (total === 0) return 50;
    return (topic.raw_votes[index] / total) * 100;
  };

  const handleAiSummon = (e: React.MouseEvent, topic: TopicItem) => {
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

  // 文化话题卡片（Mode 1: 无时间限制，双阵营投票对决）
  const CultureCard = ({ topic, index }: { topic: TopicItem; index: number }) => {
    const campPercent = getCampPercent(topic, 0);
    const camp1Wins = campPercent > 50;

    return (
      <motion.div
        key={topic.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01, y: -2 }}
        className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 cursor-pointer relative overflow-hidden"
        style={{ boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.3)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400" />

        <div onClick={() => navigate(`/topic/${topic.id}`)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 bg-violet-400/20 text-violet-400">
                  <Crown size={10} /> 文化
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-full">{topic.category}</span>
                {topic.heat > 90 && (
                  <span className="text-xs bg-orange-400/20 text-orange-400 px-2 py-1 rounded-full flex items-center gap-1 font-bold">
                    <Flame size={10} /> 热门
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-100 text-lg">{topic.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{topic.desc}</p>
            </div>
            <ChevronRight size={24} className="text-slate-500 mt-1" />
          </div>

          <div className="mt-4 bg-slate-700/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <motion.div
                className={`flex items-center gap-2 ${camp1Wins ? 'text-cyan-400' : 'text-slate-500'}`}
                animate={camp1Wins ? { x: [0, -2, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Shield className={`w-4 h-4 ${camp1Wins ? 'text-cyan-400' : 'text-slate-600'}`} />
                <span className={`font-bold text-sm ${camp1Wins ? 'text-cyan-300' : 'text-slate-500'}`}>{topic.camps[0]}</span>
                {camp1Wins && <Crown className="w-3 h-3 text-amber-400" />}
              </motion.div>
              <span className="text-slate-500 text-xs font-bold">VS</span>
              <motion.div
                className={`flex items-center gap-2 ${!camp1Wins ? 'text-pink-400' : 'text-slate-500'}`}
                animate={!camp1Wins ? { x: [0, 2, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {!camp1Wins && <Crown className="w-3 h-3 text-amber-400" />}
                <span className={`font-bold text-sm ${!camp1Wins ? 'text-pink-300' : 'text-slate-500'}`}>{topic.camps[1]}</span>
                <Target className={`w-4 h-4 ${!camp1Wins ? 'text-pink-400' : 'text-slate-600'}`} />
              </motion.div>
            </div>

            <div className="relative h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${campPercent}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-cyan-300"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${100 - campPercent}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-pink-400 to-pink-300"
              />
            </div>

            <div className="flex justify-between text-xs mt-2">
              <span className={`font-bold ${camp1Wins ? 'text-cyan-400' : 'text-slate-500'}`}>{topic.raw_votes[0]} 票</span>
              <span className={`font-bold ${!camp1Wins ? 'text-pink-400' : 'text-slate-500'}`}>{topic.raw_votes[1]} 票</span>
            </div>
          </div>
        </div>

        {/* Footer: 参与信息 + AI召唤 */}
        <div className="flex items-center gap-4 mt-3 text-slate-400 text-xs">
          <span className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-full">
            <Users size={12} /> {topic.total_participants} 参与
          </span>
          <span className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-full">
            <Flame size={12} /> {topic.heat} 热度
          </span>
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
      </motion.div>
    );
  };

  // 同城话题卡片（Mode 2: 有时间限制、奖池、多阵营支持条）
  const LocalCard = ({ topic, index }: { topic: TopicItem; index: number }) => {
    const timeInfo = getTimeRemaining(topic.expire_at);
    const totalSupport = topic.camp_supports?.reduce((a, b) => a + b, 0) || 0;

    return (
      <motion.div
        key={topic.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01, y: -2 }}
        className={`bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border cursor-pointer relative overflow-hidden ${
          timeInfo.expired ? 'border-slate-600/50 opacity-80' : 'border-slate-700/50'
        }`}
        style={{ boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.3)' }}
      >
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          timeInfo.expired
            ? 'bg-slate-600'
            : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
        }`} />

        <div onClick={() => navigate(`/topic/${topic.id}`)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900">
                  <MapPin size={10} /> 同城
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-full">{topic.category}</span>
                {/* 倒计时 */}
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium ${
                  timeInfo.expired
                    ? 'bg-slate-600/50 text-slate-400'
                    : timeInfo.urgent
                      ? 'bg-red-400/15 text-red-400 animate-pulse'
                      : 'bg-amber-400/15 text-amber-400'
                }`}>
                  <Clock size={10} /> {timeInfo.text}
                </span>
                {topic.heat > 80 && !timeInfo.expired && (
                  <span className="text-xs bg-orange-400/20 text-orange-400 px-2 py-1 rounded-full flex items-center gap-1 font-bold">
                    <Flame size={10} /> 热门
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-100 text-lg">{topic.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{topic.desc}</p>
            </div>
            <ChevronRight size={24} className="text-slate-500 mt-1" />
          </div>

          {/* 奖池 */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl px-3 py-2 border border-amber-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  <span className="text-xs text-slate-400">奖池</span>
                </div>
                <span className="text-lg font-bold text-amber-400">{(topic.support_pool || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Coins size={10} className="text-amber-400/60" />
                <span className="text-[10px] text-slate-500">辩豆</span>
                <span className="text-[10px] text-slate-600 mx-1">|</span>
                <Users size={10} className="text-slate-500" />
                <span className="text-[10px] text-slate-500">{topic.total_participants} 人参与</span>
              </div>
            </div>
          </div>

          {/* 多阵营支持条 */}
          <div className="mt-3 space-y-1.5">
            {topic.camps.map((camp, ci) => {
              const support = topic.camp_supports?.[ci] || 0;
              const percent = totalSupport > 0 ? (support / totalSupport) * 100 : 0;
              const color = getCampColor(ci);

              return (
                <div key={ci} className="bg-slate-700/40 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${color.text}`}>{camp}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{support.toLocaleString()} 豆</span>
                      <span className={`text-[10px] font-bold ${color.text}`}>{percent.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-600/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 + ci * 0.03 }}
                      className={`h-full rounded-full ${color.bar}`}
                      style={{ opacity: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer: 热度 + AI召唤 */}
        <div className="flex items-center gap-4 mt-3 text-slate-400 text-xs">
          <span className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-full">
            <Flame size={12} /> {topic.heat} 热度
          </span>
          <span className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-full">
            {topic.camps.length} 阵营
          </span>
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
            <span>详情</span>
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-900 text-white px-4 pt-3 pb-4 relative">
        <h1 className="text-lg font-bold mb-3 flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          话题广场
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-800/80 rounded-full flex items-center px-4 py-2 border border-slate-700/50">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="搜索话题"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm ml-2 flex-1 text-slate-200 placeholder-slate-500"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-slate-800/80 rounded-full border border-slate-700/50"
          >
            <Filter size={18} className="text-slate-400" />
          </motion.button>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
        <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/topics/hot')}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg"
            >
              <Flame size={14} className="inline mr-1" /> 热门
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/topics/new')}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700"
            >
              <TrendingUp size={14} className="inline mr-1" /> 最新
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/topics/follow')}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700"
            >
              <Heart size={14} className="inline mr-1" /> 关注
            </motion.button>
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filtered.map((topic, i) =>
          topic.debate_type === 'local'
            ? <LocalCard key={topic.id} topic={topic} index={i} />
            : <CultureCard key={topic.id} topic={topic} index={i} />
        )}
      </div>

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

              <p className="text-sm text-slate-400 mb-4">输入你的观点，AI将为你分析并给出评判</p>

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
