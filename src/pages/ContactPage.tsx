import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MessageCircle, Phone, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ContactPage() {
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: MessageCircle,
      title: '在线客服',
      desc: '7x24小时在线',
      action: () => navigate('/support'),
      color: 'bg-violet-500/20 text-violet-400'
    },
    {
      icon: Mail,
      title: '邮件联系',
      desc: 'support@meoo.app',
      action: () => alert('邮箱已复制'),
      color: 'bg-green-500/20 text-green-400'
    },
    {
      icon: Phone,
      title: '客服热线',
      desc: '400-888-8888',
      action: () => alert('电话已复制'),
      color: 'bg-pink-500/20 text-pink-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">联系我们</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">需要帮助？</h2>
          <p className="text-sm opacity-90">我们随时为您提供支持，选择以下方式联系我们</p>
        </div>

        <div className="space-y-3">
          {contactMethods.map((method, index) => (
            <motion.button
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={method.action}
              className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.color}`}>
                <method.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-slate-200">{method.title}</h3>
                <p className="text-sm text-slate-500">{method.desc}</p>
              </div>
              <span className="text-slate-500">→</span>
            </motion.button>
          ))}
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <h3 className="font-medium mb-4 flex items-center gap-2 text-slate-200">
            <Clock className="w-4 h-4" /> 服务时间
          </h3>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex justify-between">
              <span>在线客服</span>
              <span className="text-green-400">7×24小时</span>
            </div>
            <div className="flex justify-between">
              <span>电话客服</span>
              <span className="text-slate-300">9:00-21:00</span>
            </div>
            <div className="flex justify-between">
              <span>邮件回复</span>
              <span className="text-slate-300">24小时内</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-4">
          <p>© 2026 全民嘲珈 版权所有</p>
        </div>
      </div>
    </div>
  );
}
