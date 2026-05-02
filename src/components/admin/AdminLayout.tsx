import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { path: '/admin', icon: 'fa-chart-line', label: '概览' },
  { path: '/admin/users', icon: 'fa-users', label: '用户管理' },
  { path: '/admin/topics', icon: 'fa-comments', label: '话题管理' },
  { path: '/admin/withdrawals', icon: 'fa-money-bill-wave', label: '提现管理' },
  { path: '/admin/reports', icon: 'fa-flag', label: '举报管理' },
  { path: '/admin/ai-judges', icon: 'fa-robot', label: 'AI裁决' },
  { path: '/admin/settings', icon: 'fa-cog', label: '系统设置' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        className="bg-white border-r border-gray-200 fixed h-full z-20"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <motion.span
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className="font-bold text-xl text-indigo-600"
          >
            嘲珈后台
          </motion.span>
        </div>
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <i className={`fas ${item.icon} w-5 text-center`} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3 text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      <div
        className="flex-1 flex flex-col transition-all"
        style={{ marginLeft: sidebarOpen ? 240 : 64 }}
      >
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className={`fas fa-${sidebarOpen ? 'chevron-left' : 'bars'} text-gray-600`} />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">管理员</span>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-indigo-600 text-sm" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
