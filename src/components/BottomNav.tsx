import { motion } from 'framer-motion';
import { Home, MessageSquare, User, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { key: 'home', label: '首页', icon: Home, path: '/home' },
  { key: 'topics', label: '话题', icon: MessageSquare, path: '/topics' },
  { key: 'publish', label: '发布', icon: Plus, path: '/publish', isCenter: true },
  { key: 'messages', label: '消息', icon: MessageSquare, path: '/notifications' },
  { key: 'profile', label: '我的', icon: User, path: '/profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 px-4 py-2 z-50">
      <div className="max-w-[680px] mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <motion.button
                key={item.key}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center -mt-4 shadow-lg shadow-violet-500/30"
              >
                <Icon size={24} className="text-white" />
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-violet-500/20' : ''}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
