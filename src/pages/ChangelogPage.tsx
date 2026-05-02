import { motion } from 'framer-motion';
import { ArrowLeft, GitBranch, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ChangelogPage() {
  const navigate = useNavigate();

  const versions = [
    {
      version: 'v1.2.0',
      date: '2026-04-29',
      isNew: true,
      changes: [
        '新增活动日历功能',
        '优化话题详情页体验',
        '修复已知问题',
        '提升系统稳定性'
      ]
    },
    {
      version: 'v1.1.0',
      date: '2026-04-15',
      isNew: false,
      changes: [
        '新增积分商城',
        '支持收货地址管理',
        '优化用户界面',
        '新增邀请奖励'
      ]
    },
    {
      version: 'v1.0.0',
      date: '2026-04-01',
      isNew: false,
      changes: [
        '全新上线',
        '支持话题辩论',
        '支持同城活动',
        '支持积分奖励'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">版本更新</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100">版本历史</h2>
              <p className="text-xs text-slate-500">当前版本 v1.2.0</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {versions.map((ver, index) => (
            <motion.div
              key={ver.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-slate-100">{ver.version}</span>
                  {ver.isNew && (
                    <span className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" /> 最新
                    </span>
                  )}
                </div>
                <span className="text-sm text-slate-500">{ver.date}</span>
              </div>
              <ul className="space-y-2">
                {ver.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 flex-shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
