import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Edit2, Trash2, Users, Trophy, Clock, MapPin, Flame,
  Calendar, CheckCircle, X, Search, Filter, MoreVertical, Eye, Play, Pause,
  ChevronRight, TrendingUp, Award, UserCheck, BarChart3, PieChart,
  ChevronDown, CheckSquare, Square, Download, Share2, MessageSquare, Star,
  Target, Zap, Crown, Gift, AlertCircle, Check, XCircle, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  title: string;
  desc: string;
  category: 'debate' | 'offline' | 'challenge';
  participants: number;
  endTime: string;
  startTime: string;
  status: 'active' | 'ended' | 'draft' | 'paused';
  hot: boolean;
  location?: string;
  coverImage?: string;
  rewardPoints: number;
  maxParticipants?: number;
  views: number;
  likes: number;
  comments: number;
  conversionRate: number;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  joinTime: string;
  status: 'active' | 'completed' | 'dropped';
  points: number;
  camp?: string;
}

const mockActivities: Activity[] = [
  { id: '1', title: '南北甜咸大PK', desc: '豆腐脑甜咸之争，参与投票赢取积分', category: 'debate', participants: 31500, startTime: '2026-04-20', endTime: '2026-05-01', status: 'active', hot: true, rewardPoints: 100, views: 125000, likes: 8500, comments: 3200, conversionRate: 25.2 },
  { id: '2', title: '冬季取暖方式', desc: '暖气 vs 空调，你站哪边？', category: 'debate', participants: 28900, startTime: '2026-04-18', endTime: '2026-05-02', status: 'active', hot: true, rewardPoints: 80, views: 98000, likes: 6200, comments: 2100, conversionRate: 29.5 },
  { id: '3', title: '周末线下聚会', desc: '北京站，面对面交流', category: 'offline', participants: 50, startTime: '2026-05-05', endTime: '2026-05-05', status: 'draft', hot: false, location: '北京', maxParticipants: 100, rewardPoints: 200, views: 1200, likes: 180, comments: 45, conversionRate: 4.2 },
  { id: '4', title: '粽子口味大战', desc: '甜粽 vs 咸粽', category: 'debate', participants: 0, startTime: '2026-05-20', endTime: '2026-06-01', status: 'draft', hot: false, rewardPoints: 120, views: 0, likes: 0, comments: 0, conversionRate: 0 },
  { id: '5', title: '每日签到挑战', desc: '连续签到7天赢大奖', category: 'challenge', participants: 15000, startTime: '2026-04-01', endTime: '2026-04-30', status: 'ended', hot: false, rewardPoints: 50, views: 45000, likes: 3200, comments: 890, conversionRate: 33.3 },
];

const mockParticipants: Participant[] = [
  { id: '1', name: '小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', joinTime: '2026-04-20 10:30', status: 'active', points: 100, camp: '甜党' },
  { id: '2', name: '小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', joinTime: '2026-04-20 11:15', status: 'completed', points: 100, camp: '咸党' },
  { id: '3', name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', joinTime: '2026-04-20 14:20', status: 'active', points: 80, camp: '甜党' },
  { id: '4', name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', joinTime: '2026-04-21 09:00', status: 'dropped', points: 20, camp: '咸党' },
  { id: '5', name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', joinTime: '2026-04-21 16:45', status: 'active', points: 100, camp: '甜党' },
];

const categoryLabels: Record<string, string> = {
  debate: '辩论',
  offline: '线下',
  challenge: '挑战'
};

const categoryColors: Record<string, string> = {
  debate: 'from-blue-500 to-cyan-500',
  offline: 'from-purple-500 to-pink-500',
  challenge: 'from-amber-500 to-orange-500'
};

const categoryBgColors: Record<string, string> = {
  debate: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  offline: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  challenge: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
};

export function AdminActivityPage() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Activity | null>(null);
  const [showParticipants, setShowParticipants] = useState<Activity | null>(null);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [sortBy, setSortBy] = useState<'time' | 'participants' | 'views'>('time');
  const [participantFilter, setParticipantFilter] = useState<string>('all');
  const [form, setForm] = useState({
    title: '',
    desc: '',
    category: 'debate' as Activity['category'],
    endTime: '',
    startTime: '',
    hot: false,
    location: '',
    rewardPoints: 0,
    maxParticipants: undefined as number | undefined
  });

  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchesStatus = filterStatus === 'all' || act.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || act.category === filterCategory;
      const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         act.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'time') return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      if (sortBy === 'participants') return b.participants - a.participants;
      if (sortBy === 'views') return b.views - a.views;
      return 0;
    });
  }, [activities, filterStatus, filterCategory, searchQuery, sortBy]);

  const filteredParticipants = useMemo(() => {
    if (participantFilter === 'all') return mockParticipants;
    return mockParticipants.filter(p => p.status === participantFilter);
  }, [participantFilter]);

  const handleSave = () => {
    if (editing) {
      setActivities(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a));
    } else {
      setActivities(prev => [...prev, {
        id: Date.now().toString(),
        ...form,
        participants: 0,
        status: 'draft',
        views: 0,
        likes: 0,
        comments: 0,
        conversionRate: 0
      }]);
    }
    setShowModal(false);
    setEditing(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      title: '',
      desc: '',
      category: 'debate',
      endTime: '',
      startTime: '',
      hot: false,
      location: '',
      rewardPoints: 0,
      maxParticipants: undefined
    });
  };

  const handleDelete = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    setShowDeleteConfirm(null);
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleBatchDelete = () => {
    setActivities(prev => prev.filter(a => !selectedItems.has(a.id)));
    setSelectedItems(new Set());
    setShowBatchActions(false);
  };

  const handleBatchStatusChange = (status: Activity['status']) => {
    setActivities(prev => prev.map(a => selectedItems.has(a.id) ? { ...a, status } : a));
    setSelectedItems(new Set());
    setShowBatchActions(false);
  };

  const handleStatusChange = (id: string, newStatus: Activity['status']) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllSelection = () => {
    if (selectedItems.size === filteredActivities.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredActivities.map(a => a.id)));
    }
  };

  const openEdit = (act: Activity) => {
    setEditing(act);
    setForm({
      title: act.title,
      desc: act.desc,
      category: act.category,
      endTime: act.endTime,
      startTime: act.startTime,
      hot: act.hot,
      location: act.location || '',
      rewardPoints: act.rewardPoints,
      maxParticipants: act.maxParticipants
    });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setShowModal(true);
  };

  const openDetail = (act: Activity) => {
    setShowDetail(act);
  };

  const openParticipants = (act: Activity) => {
    setShowParticipants(act);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      ended: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      paused: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    const labels: Record<string, string> = {
      active: '进行中',
      ended: '已结束',
      draft: '草稿',
      paused: '已暂停'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getParticipantStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-blue-500/20 text-blue-400',
      completed: 'bg-green-500/20 text-green-400',
      dropped: 'bg-slate-500/20 text-slate-400'
    };
    const labels: Record<string, string> = {
      active: '进行中',
      completed: '已完成',
      dropped: '已退出'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const stats = {
    total: activities.length,
    active: activities.filter(a => a.status === 'active').length,
    draft: activities.filter(a => a.status === 'draft').length,
    ended: activities.filter(a => a.status === 'ended').length,
    totalParticipants: activities.reduce((sum, a) => sum + a.participants, 0),
    totalViews: activities.reduce((sum, a) => sum + a.views, 0),
    totalLikes: activities.reduce((sum, a) => sum + a.likes, 0),
    avgConversion: activities.filter(a => a.conversionRate > 0).reduce((sum, a) => sum + a.conversionRate, 0) / activities.filter(a => a.conversionRate > 0).length || 0
  };

  return (
    <div>
      {/* Action Bar */}
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
          <Plus size={16} /> 新建活动
        </button>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: '总活动', value: stats.total, icon: Trophy, color: 'from-violet-500 to-purple-500', trend: '+12%' },
          { label: '进行中', value: stats.active, icon: Play, color: 'from-green-500 to-emerald-500', trend: '+5%' },
          { label: '总参与', value: stats.totalParticipants.toLocaleString(), icon: Users, color: 'from-blue-500 to-cyan-500', trend: '+28%' },
          { label: '总浏览', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'from-amber-500 to-orange-500', trend: '+35%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <span className="text-xs text-green-400 font-medium">{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-slate-100 mt-3">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="px-4 pb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'active', label: '进行中' },
            { key: 'draft', label: '草稿' },
            { key: 'ended', label: '已结束' },
            { key: 'paused', label: '已暂停' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterStatus === tab.key
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: '全部类型' },
            { key: 'debate', label: '辩论' },
            { key: 'offline', label: '线下' },
            { key: 'challenge', label: '挑战' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterCategory(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterCategory === tab.key
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索活动..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-500/50"
          >
            <option value="time">按时间</option>
            <option value="participants">按参与</option>
            <option value="views">按浏览</option>
          </select>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedItems.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4"
        >
          <div className="flex items-center gap-3 p-3 bg-violet-500/10 border border-violet-500/30 rounded-xl">
            <span className="text-sm text-violet-400">已选择 {selectedItems.size} 项</span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => handleBatchStatusChange('active')}
                className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-colors"
              >
                批量发布
              </button>
              <button
                onClick={() => handleBatchStatusChange('paused')}
                className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/30 transition-colors"
              >
                批量暂停
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors"
              >
                批量删除
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-600 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity List */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={toggleAllSelection}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300"
          >
            {selectedItems.size === filteredActivities.length && filteredActivities.length > 0 ? (
              <CheckSquare size={18} className="text-violet-400" />
            ) : (
              <Square size={18} />
            )}
            全选
          </button>
        </div>
        <AnimatePresence>
          {filteredActivities.map((act, i) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-slate-800/50 border rounded-xl p-4 transition-all ${
                selectedItems.has(act.id) ? 'border-violet-500/50 bg-violet-500/5' : 'border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleSelection(act.id)}
                  className="mt-1"
                >
                  {selectedItems.has(act.id) ? (
                    <CheckSquare size={20} className="text-violet-400" />
                  ) : (
                    <Square size={20} className="text-slate-600" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColors[act.category]} flex items-center justify-center`}>
                      {act.category === 'debate' ? <Trophy size={14} className="text-white" /> :
                       act.category === 'offline' ? <MapPin size={14} className="text-white" /> :
                       <Flame size={14} className="text-white" />}
                    </div>
                    <h3 className="font-medium text-slate-100 truncate">{act.title}</h3>
                    {act.hot && (
                      <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-red-500 to-rose-500 text-white px-2 py-0.5 rounded-full">
                        <Flame size={10} /> 热门
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryBgColors[act.category]}`}>
                      {categoryLabels[act.category]}
                    </span>
                    {getStatusBadge(act.status)}
                  </div>
                  <p className="text-sm text-slate-400 mb-3 line-clamp-1">{act.desc}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {act.participants.toLocaleString()} 参与
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {act.views.toLocaleString()} 浏览
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} />
                      {act.likes.toLocaleString()} 点赞
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {act.startTime} ~ {act.endTime}
                    </span>
                    {act.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {act.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-amber-400">
                      <Trophy size={12} />
                      {act.rewardPoints} 积分
                    </span>
                    <span className="flex items-center gap-1 text-green-400">
                      <TrendingUp size={12} />
                      {act.conversionRate.toFixed(1)}% 转化
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => openDetail(act)}
                    className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                    title="详情"
                  >
                    <BarChart3 size={16} />
                  </button>
                  <button
                    onClick={() => openParticipants(act)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="参与者"
                  >
                    <Users size={16} />
                  </button>
                  <button
                    onClick={() => openEdit(act)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(act.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p>暂无活动</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-100">{editing ? '编辑活动' : '新建活动'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-700 rounded-lg">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">活动标题</label>
                  <input
                    placeholder="输入活动标题"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">活动描述</label>
                  <textarea
                    placeholder="输入活动描述"
                    value={form.desc}
                    onChange={e => setForm({ ...form, desc: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">活动类型</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'debate', label: '辩论', icon: Trophy },
                      { key: 'offline', label: '线下', icon: MapPin },
                      { key: 'challenge', label: '挑战', icon: Flame },
                    ].map(type => (
                      <button
                        key={type.key}
                        onClick={() => setForm({ ...form, category: type.key as Activity['category'] })}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                          form.category === type.key
                            ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                            : 'bg-slate-700/30 border-slate-600/30 text-slate-400 hover:bg-slate-700/50'
                        }`}
                      >
                        <type.icon size={18} />
                        <span className="text-xs">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {form.category === 'offline' && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">活动地点</label>
                    <input
                      placeholder="输入活动地点"
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">开始时间</label>
                    <input
                      type="date"
                      value={form.startTime}
                      onChange={e => setForm({ ...form, startTime: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">结束时间</label>
                    <input
                      type="date"
                      value={form.endTime}
                      onChange={e => setForm({ ...form, endTime: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">奖励积分</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.rewardPoints || ''}
                      onChange={e => setForm({ ...form, rewardPoints: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  {form.category === 'offline' && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">人数上限</label>
                      <input
                        type="number"
                        placeholder="不限"
                        value={form.maxParticipants || ''}
                        onChange={e => setForm({ ...form, maxParticipants: parseInt(e.target.value) || undefined })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hot}
                    onChange={e => setForm({ ...form, hot: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-500 text-violet-500 focus:ring-violet-500/50"
                  />
                  <span className="text-sm text-slate-300">标记为热门活动</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium text-slate-300 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.title || !form.desc}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[showDetail.category]} flex items-center justify-center`}>
                    {showDetail.category === 'debate' ? <Trophy size={18} className="text-white" /> :
                     showDetail.category === 'offline' ? <MapPin size={18} className="text-white" /> :
                     <Flame size={18} className="text-white" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{showDetail.title}</h3>
                    <p className="text-xs text-slate-400">{categoryLabels[showDetail.category]} · {getStatusBadge(showDetail.status)}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetail(null)} className="p-1 hover:bg-slate-700 rounded-lg">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: '参与人数', value: showDetail.participants.toLocaleString(), icon: Users, color: 'blue' },
                  { label: '浏览量', value: showDetail.views.toLocaleString(), icon: Eye, color: 'amber' },
                  { label: '点赞数', value: showDetail.likes.toLocaleString(), icon: Heart, color: 'rose' },
                  { label: '评论数', value: showDetail.comments.toLocaleString(), icon: MessageSquare, color: 'cyan' },
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-700/30 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon size={14} className={`text-${stat.color}-400`} />
                      <span className="text-xs text-slate-400">{stat.label}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-100">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Conversion Rate */}
              <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">转化率</span>
                  <span className="text-lg font-bold text-green-400">{showDetail.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-600/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${Math.min(showDetail.conversionRate * 2, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">参与人数 / 浏览量</p>
              </div>

              {/* Time Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-slate-400">活动时间</span>
                  <span className="text-slate-200">{showDetail.startTime} ~ {showDetail.endTime}</span>
                </div>
                {showDetail.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-slate-400">活动地点</span>
                    <span className="text-slate-200">{showDetail.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Trophy size={16} className="text-slate-400" />
                  <span className="text-slate-400">奖励积分</span>
                  <span className="text-amber-400">{showDetail.rewardPoints} 积分</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDetail(null); openParticipants(showDetail); }}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium text-slate-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Users size={16} /> 查看参与者
                </button>
                <button
                  onClick={() => { setShowDetail(null); openEdit(showDetail); }}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> 编辑活动
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Participants Modal */}
      <AnimatePresence>
        {showParticipants && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">参与者管理</h3>
                  <p className="text-xs text-slate-400">{showParticipants.title}</p>
                </div>
                <button onClick={() => setShowParticipants(null)} className="p-1 hover:bg-slate-700 rounded-lg">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Filter */}
              <div className="flex gap-2 mb-4">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'active', label: '进行中' },
                  { key: 'completed', label: '已完成' },
                  { key: 'dropped', label: '已退出' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setParticipantFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      participantFilter === tab.key
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Participant List */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredParticipants.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-200">{p.name}</span>
                        {getParticipantStatusBadge(p.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span>{p.joinTime}</span>
                        {p.camp && <span className="text-violet-400">{p.camp}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-amber-400">{p.points}</span>
                      <span className="text-xs text-slate-500 ml-1">积分</span>
                    </div>
                  </div>
                ))}
                {filteredParticipants.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">暂无参与者</p>
                  </div>
                )}
              </div>

              {/* Export */}
              <button className="w-full mt-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium text-slate-300 transition-colors flex items-center justify-center gap-2">
                <Download size={16} /> 导出参与者列表
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">确认删除</h3>
                  <p className="text-sm text-slate-400">删除后无法恢复</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium text-slate-300 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-500/25 transition-all"
                >
                  删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
