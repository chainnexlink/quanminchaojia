import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ShoppingBag, Trophy, FileText, Gift, Headphones, ChevronRight, ChevronDown, Bell, Search, Wallet, Star, Package, Heart, Clock, UserPlus, HelpCircle, Info, Ticket, MessageCircle, Shield, Edit3, Video, CheckSquare } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { isMiniProgram } from '../services/platformService';

interface MenuGroup {
  title: string;
  defaultOpen: boolean;
  items: { icon: typeof FileText; label: string; path: string; color: string }[];
}

export function ProfilePage() {
  const { user } = useStore();
  const navigate = useNavigate();
  const isApp = !isMiniProgram();

  const menuGroups: MenuGroup[] = [
    {
      title: '我的内容',
      defaultOpen: true,
      items: [
        { icon: FileText, label: '我的作品', path: '/my-posts', color: 'from-blue-500 to-cyan-500' },
        { icon: Package, label: '我的订单', path: '/my-orders', color: 'from-emerald-500 to-teal-500' },
        { icon: Heart, label: '我的收藏', path: '/my-favorites', color: 'from-rose-500 to-pink-500' },
        { icon: Clock, label: '浏览历史', path: '/browse-history', color: 'from-amber-500 to-orange-500' },
      ],
    },
    {
      title: '福利中心',
      defaultOpen: false,
      items: [
        { icon: ShoppingBag, label: '积分商城', path: '/shop', color: 'from-violet-500 to-purple-500' },
        { icon: Gift, label: '奖励中心', path: '/rewards', color: 'from-red-500 to-rose-500' },
        { icon: CheckSquare, label: '每日任务', path: '/daily-task', color: 'from-green-500 to-emerald-500' },
        { icon: Video, label: '看广告赚积分', path: '/ad-reward', color: 'from-amber-500 to-orange-500' },
        { icon: Ticket, label: '优惠券', path: '/my-coupons', color: 'from-pink-500 to-rose-500' },
      ],
    },
    {
      title: '社交互动',
      defaultOpen: false,
      items: [
        { icon: Trophy, label: '赛季战绩', path: '/ranking', color: 'from-yellow-500 to-amber-500' },
        { icon: UserPlus, label: '邀请好友', path: '/invite', color: 'from-green-500 to-emerald-500' },
        { icon: MessageCircle, label: '关注', path: '/follow', color: 'from-blue-500 to-cyan-500' },
        { icon: Bell, label: '消息中心', path: '/messages', color: 'from-indigo-500 to-purple-500' },
      ],
    },
    {
      title: '系统服务',
      defaultOpen: false,
      items: [
        { icon: Edit3, label: '编辑资料', path: '/edit-profile', color: 'from-sky-500 to-blue-500' },
        { icon: HelpCircle, label: '帮助反馈', path: '/help', color: 'from-sky-500 to-blue-500' },
        { icon: Info, label: '关于我们', path: '/about', color: 'from-indigo-500 to-violet-500' },
        { icon: Headphones, label: '客服中心', path: '/support', color: 'from-cyan-500 to-sky-500' },
        { icon: Settings, label: '设置', path: '/settings', color: 'from-slate-500 to-slate-400' },
        { icon: Shield, label: '后台管理', path: '/admin', color: 'from-rose-500 to-red-500' },
      ],
    },
  ];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    menuGroups.forEach(g => { init[g.title] = g.defaultOpen; });
    return init;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const isGuest = user?.id === 'guest';

  if (!user) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* 头部 */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">个人中心</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/search')} className="p-2 hover:bg-white/10 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/notifications')} className="p-2 hover:bg-white/10 rounded-full">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/10 rounded-full">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <img src={user.avatar_url || ''} alt={user.nickname} className="w-20 h-20 rounded-full border-4 border-white/30" />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{user.nickname}</h2>
            {isGuest ? (
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium bg-white text-purple-600"
                >
                  登录
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white"
                >
                  注册
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/camp-switch')}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  user.camp === 'north' ? 'bg-blue-400 text-white' : 'bg-red-400 text-white'
                }`}
              >
                {user.camp === 'north' ? '北方阵营' : '南方阵营'}
                <span className="text-xs opacity-70">切换</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 -mt-4 space-y-4">
        {/* 我的资产 */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 cursor-pointer" onClick={() => navigate('/profile/wallet')}>
          <h3 className="text-sm text-slate-400 mb-3">我的资产</h3>
          <div className={`grid ${isApp ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
            <div className="text-center cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate('/profile/points'); }}>
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Wallet className="w-4 h-4" />
                <span className="text-lg font-bold">{user.points}</span>
              </div>
              <p className="text-xs text-slate-400">辩豆</p>
              {isApp && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/recharge'); }}
                  className="mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full hover:bg-amber-500/30"
                >
                  充值
                </button>
              )}
            </div>
            {isApp && (
            <div className="text-center cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate('/profile/cash'); }}>
              <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                <span className="text-lg font-bold">¥{user.cash_balance || 0}</span>
              </div>
              <p className="text-xs text-slate-400">现金</p>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/withdraw'); }}
                className="mt-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full hover:bg-green-500/30"
              >
                提现
              </button>
            </div>
            )}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-lg font-bold">{user.total_power}</span>
              </div>
              <p className="text-xs text-slate-400">战力</p>
              {isApp && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/convert-power'); }}
                  className="mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full hover:bg-purple-500/30"
                >
                  转积分
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 对战数据 */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 cursor-pointer" onClick={() => navigate('/profile/achievements')}>
          <h3 className="text-sm text-slate-400 mb-3">对战数据</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700/50 rounded-xl cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate('/ranking'); }}>
              <span className="text-2xl font-bold text-slate-100">{user.total_power}</span>
              <p className="text-xs text-slate-400 mt-1">全局总战力</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate('/ranking'); }}>
              <span className="text-2xl font-bold text-violet-400">{user.season_power}</span>
              <p className="text-xs text-violet-300 mt-1">本赛季战力</p>
            </div>
          </div>
        </div>

        {/* 分组折叠菜单 */}
        {menuGroups.map((group) => (
          <div key={group.title} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleGroup(group.title)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30"
            >
              <span className="font-semibold text-slate-200">{group.title}</span>
              <motion.div animate={{ rotate: openGroups[group.title] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {openGroups[group.title] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-700/50">
                    {group.items.map((item, index) => (
                      <motion.button
                        key={item.label}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 ${
                          index !== group.items.length - 1 ? 'border-b border-slate-700/30' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.color} text-white`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="flex-1 text-left text-sm text-slate-200">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* 版权信息 */}
        <div className="text-center py-8 mt-4">
          <p className="text-xs text-slate-500">Copyright &copy; {new Date().getFullYear()} 易采精品 版权所有</p>
        </div>
      </div>
    </div>
  );
}
