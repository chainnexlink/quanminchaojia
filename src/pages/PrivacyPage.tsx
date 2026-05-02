import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PrivacyPage() {
  const navigate = useNavigate();

  const privacyItems = [
    { title: '信息收集', content: '我们收集您在使用服务时提供的信息，包括注册信息、使用记录、设备信息等，用于提供和改进服务。' },
    { title: '信息使用', content: '我们使用您的信息来提供、维护和改进服务，进行用户身份验证，发送服务通知等。' },
    { title: '信息保护', content: '我们采取各种安全措施保护您的信息安全，包括数据加密、访问控制等，防止未经授权的访问。' },
    { title: '信息共享', content: '我们不会将您的个人信息出售给第三方，仅在法律要求或获得您同意的情况下共享信息。' },
    { title: 'Cookie使用', content: '我们使用Cookie和类似技术来改善用户体验，您可以在浏览器设置中管理Cookie偏好。' },
    { title: '用户权利', content: '您有权访问、更正、删除您的个人信息，也可以随时注销账户，我们将依法处理您的请求。' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">隐私政策</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100">隐私保护政策</h2>
              <p className="text-xs text-slate-500">最后更新：2026年4月</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            全民嘲珈非常重视您的隐私保护。本政策说明了我们如何收集、使用、保护和共享您的个人信息。请您仔细阅读，了解我们的隐私实践。
          </p>
        </div>

        <div className="space-y-3">
          {privacyItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
            >
              <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-200">
                <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
          <h3 className="font-medium text-violet-300 mb-2">联系我们</h3>
          <p className="text-sm text-violet-400">
            如果您对隐私政策有任何疑问，请通过客服中心联系我们。
          </p>
        </div>

        <div className="text-center text-xs text-slate-500 pt-4">
          <p>© 2026 全民嘲珈 版权所有</p>
        </div>
      </div>
    </div>
  );
}
