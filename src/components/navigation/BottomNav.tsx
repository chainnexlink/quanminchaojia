import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MapPin, PlusCircle, Flame, User } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: '首页' },
  { path: '/local', icon: MapPin, label: '同城' },
  { path: '/publish', icon: PlusCircle, label: '发布', isCenter: true },
  { path: '/activity', icon: Flame, label: '活动中心' },
  { path: '/profile', icon: User, label: '我的' }
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname + location.search;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 px-2 pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex items-center justify-around pt-2 pb-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/home' && currentPath.startsWith(item.path));
          const isPublish = item.isCenter;
          const Icon = item.icon;

          if (isPublish) {
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.9 }}
                className="relative -mt-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-slate-400 mt-1 block">{item.label}</span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center px-3 py-1 relative"
            >
              <div className={`mb-1 transition-colors ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs ${isActive ? 'text-violet-400 font-medium' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1 w-6 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
