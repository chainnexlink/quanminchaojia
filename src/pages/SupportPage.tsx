import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, HelpCircle, Flag, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

const faqs = [
  { q: '如何获得积分？', a: '参与投票、上传佐证、每日签到均可获得积分' },
  { q: '赛季战力会清空吗？', a: '每期赛季结束后临时战力会清空，永久积分保留' },
  { q: '如何切换阵营？', a: '在个人中心点击阵营标签即可自由切换' }
];

export function SupportPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleAction = (label: string) => {
    if (label === '在线客服') {
      showToast('正在连接客服，请稍候...', 'info');
      navigate('/contact');
    } else if (label === '反馈建议') {
      navigate('/contact');
    } else if (label === '举报入口') {
      navigate('/report/general/0');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">客服中心</h1>
      </div>

      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white mb-4"
        >
          <h2 className="text-xl font-bold mb-2">需要帮助？</h2>
          <p className="text-sm opacity-90 mb-4">遇到问题随时联系我们</p>
          <button onClick={() => handleAction('在线客服')} className="bg-white text-violet-600 px-6 py-2 rounded-full text-sm font-medium">
            在线客服
          </button>
        </motion.div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden mb-4">
          {[
            { icon: MessageCircle, label: '在线客服', desc: '7x24小时在线' },
            { icon: FileText, label: '反馈建议', desc: '帮助我们改进' },
            { icon: Flag, label: '举报入口', desc: '违规内容举报' }
          ].map((item, i) => (
            <button
              key={item.label}
              onClick={() => handleAction(item.label)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-slate-700/30 ${i < 2 ? 'border-b border-slate-700/50' : ''}`}
            >
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-slate-200">{item.label}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          ))}
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-slate-100">常见问题</h3>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-700/50 last:border-0 pb-3 last:pb-0">
                <div className="font-medium text-sm mb-1 text-slate-200">{faq.q}</div>
                <div className="text-xs text-slate-400">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
