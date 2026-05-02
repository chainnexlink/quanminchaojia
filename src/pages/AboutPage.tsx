import { motion } from 'framer-motion';
import { ArrowLeft, Info, FileText, Shield, GitBranch, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AboutPage() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: FileText, label: '用户协议', path: '/terms' },
    { icon: Shield, label: '隐私政策', path: '/privacy' },
    { icon: GitBranch, label: '版本更新', path: '/changelog' },
    { icon: Mail, label: '联系我们', path: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">关于我们</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">嘲</span>
          </div>
          <h2 className="text-xl font-bold mb-1 text-slate-100">全民嘲珈</h2>
          <p className="text-sm text-slate-400">版本 1.0.0</p>
          <p className="text-xs text-slate-500 mt-2">让每一次争论都有价值</p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-slate-700/30 ${
                index !== menuItems.length - 1 ? 'border-b border-slate-700/50' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left font-medium text-slate-200">{item.label}</span>
              <span className="text-slate-500">→</span>
            </motion.button>
          ))}
        </div>

        <div className="text-center text-xs text-slate-500 pt-4">
          <p>© 2026 全民嘲珈 版权所有</p>
        </div>
      </div>
    </div>
  );
}
