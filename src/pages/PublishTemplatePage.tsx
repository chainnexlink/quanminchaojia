import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Utensils, Thermometer, BookOpen, Home, MessageCircle } from 'lucide-react';

const templates = [
  { id: 'food', icon: Utensils, title: '美食对比', desc: '南北饮食差异', color: 'from-orange-400 to-red-500' },
  { id: 'climate', icon: Thermometer, title: '气候差异', desc: '南北方气候对比', color: 'from-blue-400 to-cyan-500' },
  { id: 'culture', icon: BookOpen, title: '文化习俗', desc: '传统习俗差异', color: 'from-purple-400 to-pink-500' },
  { id: 'life', icon: Home, title: '生活方式', desc: '日常生活习惯', color: 'from-green-400 to-emerald-500' },
  { id: 'chat', icon: MessageCircle, title: '自由话题', desc: '自定义话题', color: 'from-slate-400 to-slate-500' }
];

export function PublishTemplatePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <span className="font-semibold text-slate-100">选择模板</span>
      </div>

      <div className="p-4 space-y-3">
        {templates.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/publish')}
            className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white`}>
              <t.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-slate-100">{t.title}</h3>
              <p className="text-sm text-slate-400">{t.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
