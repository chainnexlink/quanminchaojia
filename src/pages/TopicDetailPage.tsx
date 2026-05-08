import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share2, Bot, Clock, Users, Zap, ChevronDown, Sparkles, Timer, TrendingUp, Crown, MapPin, Coins, Shield, ArrowUpRight, AlertCircle, Flame, Flag, Ban, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import type { Database } from '../supabase/types';
import { defaultAIModels, type AIModelConfig, modelIconSVGs } from '../services/aiModels';
import { callAIJudge as callAIJudgeAPI, type AIJudgeRequest } from '../services/aiService';
import { checkDailyCallLimit, applyAIBoost, calculateDisplayVotes } from '../services/aiBoostService';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { checkContent } from '../services/contentModeration';

const campColors = [
  { bg: 'from-cyan-500 to-blue-500', text: 'text-cyan-400', bar: 'bg-cyan-400', light: 'bg-cyan-400/15 text-cyan-400', border: 'border-cyan-500/30' },
  { bg: 'from-pink-500 to-rose-500', text: 'text-pink-400', bar: 'bg-pink-400', light: 'bg-pink-400/15 text-pink-400', border: 'border-pink-500/30' },
  { bg: 'from-amber-500 to-orange-500', text: 'text-amber-400', bar: 'bg-amber-400', light: 'bg-amber-400/15 text-amber-400', border: 'border-amber-500/30' },
  { bg: 'from-emerald-500 to-green-500', text: 'text-emerald-400', bar: 'bg-emerald-400', light: 'bg-emerald-400/15 text-emerald-400', border: 'border-emerald-500/30' },
  { bg: 'from-violet-500 to-purple-500', text: 'text-violet-400', bar: 'bg-violet-400', light: 'bg-violet-400/15 text-violet-400', border: 'border-violet-500/30' },
  { bg: 'from-red-500 to-rose-600', text: 'text-red-400', bar: 'bg-red-400', light: 'bg-red-400/15 text-red-400', border: 'border-red-500/30' },
];
function getCampColor(index: number) { return campColors[index % campColors.length]; }

function getTimeRemainingDetail(expireAt: string | null): { text: string; urgent: boolean; expired: boolean } {
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

const SETTLEMENT = { WINNER_RATIO: 0.70, CREATOR_RATIO: 0.05, PLATFORM_RATIO: 0.05, OPERATIONS_RATIO: 0.20 };

type Topic = Database['public']['Tables']['topics']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];

export function TopicDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, voteTopic, supportTopic, saveAIJudgment, addComment: storeAddComment, fetchComments, blockedUsers } = useStore();
  const { showToast } = useToast();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [supportAmount, setSupportAmount] = useState(10);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiResult, setAiResult] = useState<{ summary: string; taunt: string; favoredCamp: number; boostPercent: number } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModelConfig>(defaultAIModels[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [comments, setComments] = useState<(Comment & { profile?: Partial<Profile> })[]>([]);
  const [newComment, setNewComment] = useState('');
  const [voting, setVoting] = useState(false);
  const [campSupports, setCampSupports] = useState<number[]>([]);
  const [selectedCampForSupport, setSelectedCampForSupport] = useState<number | null>(null);
  const [localSupportAmount, setLocalSupportAmount] = useState('');

  useEffect(() => {
    if (id) {
      loadTopic();
      loadComments();
    }
  }, [id]);

  const loadTopic = async () => {
    if (!id) return;
    try {
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (topicError || !topicData) {
        console.log('Topic not found in DB, using mock data for id:', id);
        const mockTopics: Record<string, Topic> = {
          '550e8400-e29b-41d4-a716-446655440001': {
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
            updated_at: null
          },
          '550e8400-e29b-41d4-a716-446655440002': {
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
            updated_at: null
          },
          '550e8400-e29b-41d4-a716-446655440003': {
            id: '550e8400-e29b-41d4-a716-446655440003',
            title: '周末聚餐去哪吃',
            debate_type: 'local',
            creator_id: 'user3',
            camps: ['火锅', '烧烤', '日料', '川菜'],
            raw_votes: [45, 38, 22, 18],
            ai_boost_percents: [0, 0, 0, 0],
            final_votes: [45, 38, 22, 18],
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
            updated_at: null
          },
          'local-001': {
            id: 'local-001',
            title: '周末聚餐去哪吃',
            debate_type: 'local',
            creator_id: 'user3',
            camps: ['火锅', '烧烤', '日料', '川菜'],
            raw_votes: [45, 38, 22, 18],
            ai_boost_percents: [0, 0, 0, 0],
            final_votes: [45, 38, 22, 18],
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
            updated_at: null
          },
          'local-002': {
            id: 'local-002',
            title: '周末羽毛球约战选场地',
            debate_type: 'local',
            creator_id: 'user6',
            camps: ['奥体中心', '社区球馆'],
            raw_votes: [32, 28],
            ai_boost_percents: [0, 0],
            final_votes: [32, 28],
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
            updated_at: null
          },
          'local-003': {
            id: 'local-003',
            title: '五一去哪玩',
            debate_type: 'local',
            creator_id: 'user7',
            camps: ['周边游', '宅家', '自驾远游', '出国'],
            raw_votes: [89, 56, 34, 12],
            ai_boost_percents: [0, 0, 0, 0],
            final_votes: [89, 56, 34, 12],
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
            updated_at: null
          },
          'local-004': {
            id: 'local-004',
            title: '公司团建方案投票',
            debate_type: 'local',
            creator_id: 'user8',
            camps: ['密室逃脱', '户外拓展', 'KTV', '桌游', '剧本杀'],
            raw_votes: [28, 22, 15, 18, 32],
            ai_boost_percents: [0, 0, 0, 0, 0],
            final_votes: [28, 22, 15, 18, 32],
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
            updated_at: null
          },
          'local-005': {
            id: 'local-005',
            title: '最好吃的早餐是什么',
            debate_type: 'local',
            creator_id: 'user9',
            camps: ['包子油条', '煎饼果子', '肠粉', '豆浆配烧饼'],
            raw_votes: [120, 95, 88, 67],
            ai_boost_percents: [0, 0, 0, 0],
            final_votes: [120, 95, 88, 67],
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
            updated_at: null
          }
        };
        const mockTopic = mockTopics[id] || {
          id: id,
          title: '话题详情',
          debate_type: 'culture',
          creator_id: 'user1',
          camps: ['支持方', '反对方'],
          raw_votes: [100, 80],
          ai_boost_percents: [0, 0],
          final_votes: [100, 80],
          total_participants: 180,
          heat: 50,
          expire_at: null,
          ai_boost_expire_at: null,
          leading_camp: 0,
          cover_image: null,
          status: 'approved',
          support_pool: 0,
          sponsored_by: null,
          created_at: new Date().toISOString(),
          updated_at: null
        };
        setTopic(mockTopic as Topic);
        // 为同城话题生成camp_supports模拟数据
        if (mockTopic.debate_type === 'local') {
          const mockCampSupportsMap: Record<string, number[]> = {
            'local-001': [1200, 980, 650, 450],
            'local-002': [800, 700],
            'local-003': [2100, 1500, 1200, 800],
            'local-004': [800, 650, 450, 520, 1780],
            'local-005': [3200, 2500, 1800, 1000],
            '550e8400-e29b-41d4-a716-446655440003': [1200, 980, 650, 450],
          };
          setCampSupports(mockCampSupportsMap[id] || (mockTopic.camps || []).map(() => Math.floor(Math.random() * 1000 + 200)));
        }
        const mockCreators: Record<string, string> = {
          'local-001': '吃货小王', 'local-002': '运动达人', 'local-003': '旅行家',
          'local-004': 'HR小姐姐', 'local-005': '早餐达人',
        };
        setCreator({ id: '', nickname: mockCreators[id] || '话题发起人', avatar_url: '', bio: null, camp: null, cash_balance: null, created_at: null, points: null, season_power: null, total_power: null, updated_at: null } as any);
        return;
      }
      setTopic(topicData);
      const { data: creatorData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', topicData.creator_id || '')
        .maybeSingle();
      setCreator(creatorData || { id: '', nickname: '匿名用户', avatar_url: '', bio: null, camp: null, cash_balance: null, created_at: null, points: null, season_power: null, total_power: null, updated_at: null } as any);
    } catch (err) {
      console.error('Load topic error:', err);
    }
  };

  const handleVote = async (campIndex: number) => {
    if (!topic || !user) {
      showToast('请先登录', 'error');
      return;
    }
    if (voting) return;
    setVoting(true);
    try {
      await voteTopic(topic.id, campIndex);
      setUserVote(campIndex);
      showToast(`已投票给「${topic.camps?.[campIndex] || ''}」`, 'success');
      loadTopic();
    } catch (err) {
      showToast('投票失败', 'error');
    } finally {
      setVoting(false);
    }
  };

  const handleSupport = async () => {
    if (!topic || userVote === null || !user) return;
    const userPoints = user.points ?? 0;
    if (userPoints < supportAmount) {
      showToast('辩豆不足', 'error');
      return;
    }
    try {
      await supportTopic(topic.id, userVote, supportAmount);
      showToast(`成功支持 ${supportAmount} 辩豆`, 'success');
      setShowSupportModal(false);
      loadTopic();
    } catch (err) {
      showToast('支持失败', 'error');
    }
  };

  const [boostMessage, setBoostMessage] = useState<string | null>(null);

  const handleAiCall = async () => {
    if (!topic || !aiContent.trim() || !user) return;
    const userPoints = user.points ?? 0;
    if (userPoints < 20) {
      showToast('辩豆不足20，无法召唤AI', 'error');
      return;
    }

    // 1. 检查每日召唤次数限制（每人每天3次）
    const dailyCheck = await checkDailyCallLimit(user.id);
    if (!dailyCheck.canCall) {
      showToast(dailyCheck.reason || '今日次数已用完', 'error');
      return;
    }

    setAiLoading(true);
    setBoostMessage(null);
    try {
      // 2. 构建AI请求
      const request: AIJudgeRequest = {
        topicTitle: topic.title || '',
        topicDesc: '',
        camp1Name: topic.camps?.[0] || '阵营1',
        camp2Name: topic.camps?.[1] || '阵营2',
        camp1Posts: [],
        camp2Posts: [],
        userContent: aiContent,
        judgeStyle: 'balanced'
      };
      // 获取该话题的评论作为双方观点
      const { data: campComments } = await supabase
        .from('comments')
        .select('content, camp_index')
        .eq('topic_id', topic.id)
        .limit(20);
      if (campComments) {
        request.camp1Posts = campComments.filter(c => c.camp_index === 0).map(c => c.content || '').slice(0, 5);
        request.camp2Posts = campComments.filter(c => c.camp_index === 1).map(c => c.content || '').slice(0, 5);
      }

      // 3. 调用真实 AI API
      const result = await callAIJudgeAPI(selectedModel, request);

      // 4. 保存AI判定结果到数据库 + 扣除辩豆
      await saveAIJudgment(topic.id, aiContent, result);
      setAiResult(result);

      // 5. 应用加成规则（仅文化差异辩论有加成效果）
      const isLocal = topic.debate_type === 'local';
      if (!isLocal && userVote !== null) {
        const boostResult = await applyAIBoost(topic.id, result.favoredCamp, userVote, isLocal);
        setBoostMessage(boostResult.reason);
        if (boostResult.boostApplied) {
          showToast(`AI裁判已出结果！${boostResult.reason}`, 'success');
        } else {
          showToast('AI裁判已出结果！', 'success');
          if (boostResult.reason) {
            showToast(boostResult.reason, 'info');
          }
        }
      } else {
        showToast('AI裁判已出结果！', 'success');
        if (isLocal) {
          setBoostMessage('同城辩论不受AI加成影响');
        } else if (userVote === null) {
          setBoostMessage('未投票，AI加成不生效');
        }
      }

      setShowAiModal(false);
      setAiContent('');
      showToast(`今日剩余召唤次数: ${dailyCheck.dailyRemaining - 1}`, 'info');
      loadTopic();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI召唤失败';
      showToast(msg, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const isMockTopic = (topicId: string) => {
    return topicId.startsWith('local-') || topicId.startsWith('550e8400-');
  };

  const handleComment = async () => {
    if (!topic || !newComment.trim() || !user) {
      if (!user) showToast('请先登录', 'error');
      return;
    }
    // 内容审核 - 敏感词检测
    const contentCheck = checkContent(newComment);
    if (!contentCheck.passed) {
      showToast('评论包含违规内容，请修改后重试', 'error');
      return;
    }
    if (isMockTopic(topic.id)) {
      const localComment = {
        id: `local-comment-${Date.now()}`,
        topic_id: topic.id,
        user_id: user.id,
        content: newComment.trim(),
        camp_index: userVote ?? 0,
        likes: 0,
        created_at: new Date().toISOString(),
        images: null,
        is_hot: false,
        replies: 0,
        profile: { nickname: user.nickname || '我', avatar_url: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}` }
      } as Comment & { profile?: Partial<Profile> };
      setComments(prev => [localComment, ...prev]);
      setNewComment('');
      showToast('评论发送成功', 'success');
      return;
    }
    try {
      await storeAddComment(topic.id, newComment, userVote ?? 0);
      setNewComment('');
      await loadComments();
      showToast('评论发送成功', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '评论失败';
      showToast(msg, 'error');
    }
  };

  const loadComments = async () => {
    if (!id) return;
    if (isMockTopic(id)) {
      if (comments.length === 0) {
        setComments([
          { id: 'mock-c1', topic_id: id, user_id: 'u1', content: '这个话题太有意思了！', camp_index: 0, likes: 5, created_at: new Date(Date.now() - 3600000).toISOString(), images: null, is_hot: null, replies: null, profile: { nickname: '辩论达人', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1' } },
          { id: 'mock-c2', topic_id: id, user_id: 'u2', content: '我支持另一方，理由很充分', camp_index: 1, likes: 3, created_at: new Date(Date.now() - 7200000).toISOString(), images: null, is_hot: null, replies: null, profile: { nickname: '理性派', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2' } },
        ] as (Comment & { profile?: Partial<Profile> })[]);
      }
      return;
    }
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('topic_id', id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) {
      const profileIds = [...new Set(data.map(c => c.user_id).filter((id): id is string => id !== null))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nickname, avatar_url, camp')
        .in('id', profileIds.length > 0 ? profileIds : ['none']);
      const profileMap = new Map((profiles || []).map(p => [p.id, p]));
      setComments(data.map(c => ({ ...c, profile: c.user_id ? profileMap.get(c.user_id) || undefined : undefined })));
    }
  };

  if (!topic) return <div className="p-4 text-slate-300">加载中...</div>;

  const isLocal = topic.debate_type === 'local';
  const isEnded = topic.expire_at ? new Date(topic.expire_at) < new Date() : false;
  const { displayVotes, activeBoosts, isBoostActive } = calculateDisplayVotes(
    topic.raw_votes || [0, 0],
    topic.ai_boost_percents,
    topic.ai_boost_expire_at,
    topic.debate_type
  );
  const totalVotes = displayVotes.reduce((a, b) => a + b, 0) || 0;
  const totalRawVotes = topic.raw_votes?.reduce((a, b) => a + b, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <span className="font-semibold text-slate-100 flex-1">话题详情</span>
        <button onClick={() => navigate(`/report/topic/${id}`)} className="p-2 hover:bg-slate-700/50 rounded-full" title="举报">
          <Flag className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded-full text-xs ${isLocal ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {isLocal ? '同城辩论' : '文化差异'}
          </span>
          {isLocal && topic.expire_at && (
            <span className="flex items-center gap-1 text-xs text-orange-400">
              <Clock className="w-3 h-3" />
              {isEnded ? '已结束' : '进行中'}
            </span>
          )}
        </div>
        <h1 className="text-xl font-bold mb-2 text-slate-100">{topic.title}</h1>
        {creator && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <img src={creator.avatar_url || ''} className="w-6 h-6 rounded-full" />
            <span>{creator.nickname}</span>
          </div>
        )}
      </div>

      {/* ===== 同城话题专属区域 ===== */}
      {isLocal && (
        <>
          {/* 倒计时 + 状态 */}
          {topic.expire_at && (
            <div className={`p-4 ${isEnded ? 'bg-slate-700/50' : 'bg-gradient-to-r from-emerald-600 to-teal-600'} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{isEnded ? '已结束' : '距离截止'}</span>
                </div>
                {!isEnded && (
                  <span className={`font-bold text-lg ${getTimeRemainingDetail(topic.expire_at).urgent ? 'text-red-300 animate-pulse' : ''}`}>
                    {getTimeRemainingDetail(topic.expire_at).text}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 奖池 + 统计 */}
          <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl px-4 py-3 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="text-xs text-slate-400">奖池总额</span>
                  </div>
                  <span className="text-xl font-bold text-amber-400">{(topic.support_pool || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Coins size={10} className="text-amber-400/60" />
                  <span className="text-[10px] text-slate-500">辩豆</span>
                  <span className="text-[10px] text-slate-600 mx-1">|</span>
                  <Users size={10} className="text-slate-500" />
                  <span className="text-[10px] text-slate-500">{topic.total_participants} 人参与</span>
                  <span className="text-[10px] text-slate-600 mx-1">|</span>
                  <span className="text-[10px] text-slate-500">{topic.camps?.length || 0} 阵营</span>
                </div>
              </div>
            </div>
          </div>

          {/* 结算规则 */}
          <div className="px-4 pt-3">
            <div className="bg-slate-800/60 rounded-xl p-3 border border-amber-500/20 flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-amber-400 font-bold">结算规则：</span>
                胜方支持者分 <span className="text-emerald-400 font-bold">70%</span> 奖池 |
                创建者 <span className="text-cyan-400 font-bold">5%</span> |
                平台 <span className="text-slate-300 font-bold">5%</span> |
                运营回流 <span className="text-violet-400 font-bold">20%</span>
              </p>
            </div>
          </div>

          {/* 多阵营支持条 */}
          <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4 mt-2">
            <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              阵营支持
            </h3>
            <div className="space-y-2">
              {topic.camps?.map((camp, ci) => {
                const support = campSupports[ci] || 0;
                const totalSupport = campSupports.reduce((a, b) => a + b, 0) || 1;
                const percent = (support / totalSupport) * 100;
                const votes = topic.raw_votes?.[ci] || 0;
                const color = getCampColor(ci);
                const isWinner = !isEnded ? false : ci === (topic.camps || []).reduce((maxIdx, _, idx) => (campSupports[idx] || 0) > (campSupports[maxIdx] || 0) ? idx : maxIdx, 0);

                return (
                  <div key={ci} className={`relative rounded-xl overflow-hidden ${isWinner ? 'ring-1 ring-amber-400/40' : ''}`}>
                    <div className="bg-slate-700/40 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {isWinner && <Crown size={12} className="text-amber-400" />}
                          <span className={`text-sm font-bold ${color.text}`}>{camp}</span>
                          {isWinner && (
                            <span className="text-[10px] bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">胜出</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{support.toLocaleString()} 豆</span>
                          <span className={`text-xs font-bold ${color.text}`}>{percent.toFixed(1)}%</span>
                        </div>
                      </div>
                      {/* 支持条 */}
                      <div className="h-2.5 bg-slate-600/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, delay: ci * 0.05 }}
                          className={`h-full rounded-full ${color.bar}`}
                          style={{ opacity: isWinner ? 1 : 0.7 }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-slate-500">{votes} 人支持</span>
                        {/* 支持按钮 */}
                        {!isEnded && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setSelectedCampForSupport(ci); setLocalSupportAmount(''); }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${color.light} border ${color.border}`}
                          >
                            <ArrowUpRight size={10} /> 支持
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI召唤按钮 - 同城 */}
            <button
              onClick={() => setShowAiModal(true)}
              className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Bot className="w-5 h-5" />
              召唤AI裁判 (20辩豆)
            </button>
          </div>
        </>
      )}

      {/* ===== 文化话题区域（保持原有逻辑） ===== */}
      {!isLocal && (
        <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-100">阵营投票</h3>
            {isBoostActive && (
              <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>AI加成生效中</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {topic.camps?.map((camp, i) => {
              const rawVotes = topic.raw_votes?.[i] || 0;
              const votes = displayVotes[i] || 0;
              const percent = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
              const aiBoost = activeBoosts[i] || 0;
              const hasBoost = isBoostActive && aiBoost > 0;
              return (
                <div key={i} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-200">{camp}</span>
                    <div className="flex items-center gap-2">
                      {hasBoost && (
                        <span className="text-xs text-green-400">({rawVotes}+{aiBoost}%)</span>
                      )}
                      <span className="text-sm text-slate-400">{votes}票 ({percent.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="h-8 bg-slate-700/50 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className={`h-full ${i === 0 ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                    />
                  </div>
                  {hasBoost && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                      <Bot className="w-3 h-3" />
                      <span>AI加成 +{aiBoost}%（24h有效）</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleVote(i)}
                    disabled={userVote !== null}
                    className={`mt-2 w-full py-2 rounded-lg text-sm font-medium ${
                      userVote === i
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {userVote === i ? '已投票' : '投票'}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowAiModal(true)}
            className="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Bot className="w-5 h-5" />
            召唤AI裁判 (20辩豆)
          </button>
        </div>
      )}

      {aiResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4 mt-2"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-100">
            <Bot className="w-5 h-5 text-violet-400" />
            AI裁判结果
          </h3>
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-sm text-slate-400 mb-1">AI分析</p>
              <p className="text-slate-200">{aiResult.summary}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">AI吐槽</p>
              <p className="text-slate-300 italic">"{aiResult.taunt}"</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">AI倾向</p>
                <p className="font-bold text-violet-400">
                  {aiResult.favoredCamp === 0 ? '平局' : topic?.camps?.[aiResult.favoredCamp - 1] || '未知'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">加成效果</p>
                <p className="font-bold text-green-400">
                  {isBoostActive
                    ? `+${activeBoosts[0] > 0 ? activeBoosts[0] : activeBoosts[1]}%`
                    : '无变化'}
                </p>
              </div>
            </div>
            {boostMessage && (
              <div className="mt-2 px-3 py-2 bg-slate-700/50 rounded-lg text-xs text-slate-400 flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{boostMessage}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4 mt-2">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-100">
          <MessageCircle className="w-5 h-5" />
          评论 ({comments.length})
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="发表你的观点..."
            className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500"
          />
          <button
            onClick={handleComment}
            className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full text-sm"
          >
            发送
          </button>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.filter(c => !blockedUsers.includes(c.user_id)).map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-700/30 rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={comment.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`}
                    alt=""
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="text-sm font-medium text-slate-300">{comment.profile?.nickname || '匿名用户'}</span>
                  {comment.camp_index !== null && topic?.camps?.[comment.camp_index] && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      comment.camp_index === 0 ? 'bg-violet-500/20 text-violet-400' : 'bg-pink-500/20 text-pink-400'
                    }`}>
                      {topic.camps[comment.camp_index]}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 ml-auto">
                    {comment.created_at ? new Date(comment.created_at).toLocaleDateString('zh-CN') : ''}
                  </span>
                </div>
                <p className="text-sm text-slate-300 pl-9">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2 pl-9">
                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-pink-400">
                    <Heart className="w-3 h-3" /> {comment.likes || 0}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">暂无评论，来发表第一条评论吧</div>
        )}
      </div>

      {/* 同城按阵营支持 Modal */}
      <AnimatePresence>
        {selectedCampForSupport !== null && topic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50"
            onClick={() => setSelectedCampForSupport(null)}
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
                为 <span className={`font-bold ${getCampColor(selectedCampForSupport).text}`}>
                  "{topic.camps?.[selectedCampForSupport]}"
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
                    value={localSupportAmount}
                    onChange={(e) => setLocalSupportAmount(e.target.value)}
                    placeholder="10 - 1000"
                    min={10}
                    max={1000}
                    className="flex-1 bg-slate-600/50 rounded-xl px-4 py-3 text-lg font-bold text-slate-100 outline-none border border-slate-600 focus:border-emerald-500/50 placeholder-slate-500"
                  />
                  <Coins size={20} className="text-amber-400" />
                </div>
                <div className="flex gap-2 mt-3">
                  {[50, 100, 200, 500].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setLocalSupportAmount(String(amount))}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                        localSupportAmount === String(amount)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-600/50 text-slate-400 border border-transparent'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-3 mb-4">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Shield size={10} /> 如果该阵营胜出，支持者按比例瓜分 70% 奖池
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCampForSupport(null)}
                  className="flex-1 py-3.5 bg-slate-700 rounded-xl text-slate-300 font-bold"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const amount = parseInt(localSupportAmount);
                    if (isNaN(amount) || amount < 10 || amount > 1000) {
                      showToast('支持数量需在 10-1000 辩豆之间', 'error');
                      return;
                    }
                    if ((user?.points ?? 0) < amount) {
                      showToast('辩豆不足', 'error');
                      return;
                    }
                    const ci = selectedCampForSupport;
                    setCampSupports(prev => {
                      const newSupports = [...prev];
                      newSupports[ci] = (newSupports[ci] || 0) + amount;
                      return newSupports;
                    });
                    showToast(`成功支持 "${topic.camps?.[ci]}"，消耗 ${amount} 辩豆`, 'success');
                    setSelectedCampForSupport(null);
                  }}
                  disabled={!localSupportAmount || parseInt(localSupportAmount) < 10}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                  确认支持
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 文化话题旧支持 Modal (保留兼容) */}
      <AnimatePresence>
        {showSupportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-sm">
              <h3 className="font-bold text-lg mb-4 text-slate-100">使用辩豆支持</h3>
              <input
                type="number"
                value={supportAmount}
                onChange={(e) => setSupportAmount(Number(e.target.value))}
                min={10}
                max={1000}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl mb-4 text-slate-200 outline-none focus:border-violet-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="flex-1 py-3 bg-slate-700 text-slate-200 rounded-xl"
                >
                  取消
                </button>
                <button
                  onClick={handleSupport}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold"
                >
                  确认支持
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-100">
                <Bot className="w-5 h-5" />
                召唤AI裁判
              </h3>

              <div className="mb-4">
                <label className="text-sm text-slate-400 mb-2 block">选择AI模型</label>
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl flex items-center justify-between text-slate-200 hover:border-violet-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedModel.iconColor} flex items-center justify-center shadow-lg`}
                        dangerouslySetInnerHTML={{ __html: modelIconSVGs[selectedModel.icon] || '' }}
                      />
                      <span className="font-medium">{selectedModel.name}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showModelDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-700 border border-slate-600 rounded-xl overflow-hidden z-10 max-h-60 overflow-y-auto"
                      >
                        {defaultAIModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model);
                              setShowModelDropdown(false);
                            }}
                            className={`w-full px-3 py-3 flex items-center gap-3 text-left hover:bg-slate-600 transition-colors ${
                              selectedModel.id === model.id ? 'bg-violet-500/20' : ''
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${model.iconColor} flex items-center justify-center shadow-md`}
                              dangerouslySetInnerHTML={{ __html: modelIconSVGs[model.icon] || '' }}
                            />
                            <div className="flex-1">
                              <div className="text-slate-200 font-medium">{model.name}</div>
                            </div>
                            {selectedModel.id === model.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-violet-400"
                              >
                                <Sparkles className="w-4 h-4" />
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
                value={aiContent}
                onChange={(e) => setAiContent(e.target.value)}
                placeholder="输入你的观点，让AI裁判为你分析..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl mb-4 resize-none text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500"
              />

              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-slate-400">消耗辩豆</span>
                <span className="text-amber-400 font-semibold">20 豆</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="flex-1 py-3 bg-slate-700 text-slate-200 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAiCall}
                  disabled={!aiContent.trim() || aiLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                >
                  {aiLoading ? '分析中...' : '召唤AI'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
