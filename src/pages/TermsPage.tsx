import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TermsPage() {
  const navigate = useNavigate();

  const terms = [
    { title: '服务条款', content: '欢迎使用全民嘲珈平台服务。本条款是您与平台之间的协议，使用本服务即表示您同意遵守本条款。' },
    { title: '用户行为规范', content: '用户在使用本平台服务时，应遵守国家法律法规，不得发布违法违规内容，不得侵犯他人合法权益。' },
    { title: '知识产权', content: '用户发布的内容版权归用户所有，但用户授予本平台非独占的使用权，用于平台运营和推广。' },
    { title: '免责声明', content: '本平台对用户发布的内容不承担法律责任，但会依法配合相关部门进行调查处理。' },
    { title: '协议修改', content: '本平台有权随时修改本协议，修改后的协议将在平台上公布，继续使用视为接受新协议。' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">用户协议</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100">用户服务协议</h2>
              <p className="text-xs text-slate-500">最后更新：2026年4月</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            欢迎使用全民嘲珈！本协议是您与全民嘲珈平台之间关于使用平台服务的协议。请您仔细阅读本协议，一旦您使用本平台服务，即表示您已充分阅读、理解并同意接受本协议的全部内容。
          </p>
        </div>

        <div className="space-y-3">
          {terms.map((term, index) => (
            <motion.div
              key={term.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
            >
              <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-200">
                <span className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                {term.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{term.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center text-xs text-slate-500 pt-4">
          <p>© 2026 全民嘲珈 版权所有</p>
        </div>
      </div>
    </div>
  );
}
