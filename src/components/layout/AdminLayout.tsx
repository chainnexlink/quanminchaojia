import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, MessageSquare, DollarSign, AlertTriangle,
  Settings, Bell, FileText, Bot, Coins, ShoppingBag, Heart,
  UserCheck, Shield, Gift, Award, Trophy, Tv, ChevronDown,
  Menu, X, LogOut, ChevronRight, Zap, Vote
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  title: string;
  path: string;
  icon: any;
  badge?: string;
}

const navGroups: NavGroup[] = [
  {
    label: '概览',
    items: [
      { title: '仪表盘', path: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    label: '用户管理',
    items: [
      { title: '用户列表', path: '/admin/users', icon: Users },
      { title: '关注管理', path: '/admin/follows', icon: UserCheck },
      { title: '阵营切换', path: '/admin/camp-switch', icon: Shield },
    ]
  },
  {
    label: '内容管理',
    items: [
      { title: '话题管理', path: '/admin/topics', icon: MessageSquare },
      { title: '评论管理', path: '/admin/comments', icon: FileText },
      { title: '佐证管理', path: '/admin/evidence', icon: FileText },
      { title: '投票记录', path: '/admin/votes', icon: Vote },
      { title: 'AI裁判', path: '/admin/ai-judges', icon: Bot },
    ]
  },
  {
    label: '财务管理',
    items: [
      { title: '提现审核', path: '/admin/withdrawals', icon: DollarSign, badge: '28' },
      { title: '积分管理', path: '/admin/points', icon: Coins },
      { title: '现金管理', path: '/admin/cash', icon: DollarSign },
      { title: '奖励管理', path: '/admin/rewards', icon: Gift },
    ]
  },
  {
    label: '运营管理',
    items: [
      { title: '活动管理', path: '/admin/activity', icon: Zap },
      { title: '商城管理', path: '/admin/shop', icon: ShoppingBag },
      { title: '排行榜', path: '/admin/ranking', icon: Trophy },
      { title: '每日任务', path: '/admin/daily-tasks', icon: Award },
      { title: '广告奖励', path: '/admin/ad-rewards', icon: Tv },
    ]
  },
  {
    label: '系统',
    items: [
      { title: '举报处理', path: '/admin/reports', icon: AlertTriangle, badge: '15' },
      { title: '通知管理', path: '/admin/notifications', icon: Bell },
      { title: '系统日志', path: '/admin/logs', icon: FileText },
      { title: '系统设置', path: '/admin/settings', icon: Settings },
    ]
  }
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const currentPath = location.pathname;

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const isActive = (path: string) => {
    if (path === '/admin') return currentPath === '/admin';
    return currentPath.startsWith(path);
  };

  const getCurrentPageTitle = () => {
    for (const group of navGroups) {
      for (const item of group.items) {
        if (isActive(item.path)) return item.title;
      }
    }
    if (currentPath.includes('/admin/user/')) return '用户详情';
    if (currentPath.includes('/admin/topic/')) return '话题详情';
    if (currentPath.includes('/admin/camp-evidence/')) return '阵营佐证';
    return '后台管理';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-30 bg-slate-900 text-white transition-all duration-300 flex flex-col ${
        sidebarCollapsed ? 'w-16' : 'w-60'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-700/50 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                吵
              </div>
              <span className="font-bold text-lg">吵架管理后台</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 mx-auto bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
              吵
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-1">
              {!sidebarCollapsed && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-300"
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${collapsedGroups.has(group.label) ? '-rotate-90' : ''}`} />
                </button>
              )}
              {!collapsedGroups.has(group.label) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        title={sidebarCollapsed ? item.title : undefined}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative group ${
                          active
                            ? 'bg-violet-600/20 text-violet-300 font-medium'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-r-full" />
                        )}
                        <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-violet-400' : ''}`} />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            {item.badge && (
                              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                        {sidebarCollapsed && item.badge && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-700/50 p-3 flex-shrink-0">
          <button
            onClick={() => navigate('/home')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>返回前台</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <X className="w-5 h-5 text-gray-600" />}
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{getCurrentPageTitle()}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <span className="text-sm font-medium text-gray-700">管理员</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
