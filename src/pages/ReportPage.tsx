import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Flag } from 'lucide-react';
import { useState } from 'react';

const reportReasons = [
  { id: 'spam', label: '垃圾广告' },
  { id: 'abuse', label: '辱骂攻击' },
  { id: 'porn', label: '色情低俗' },
  { id: 'political', label: '政治敏感' },
  { id: 'fraud', label: '诈骗信息' },
  { id: 'other', label: '其他原因' }
];

export function ReportPage() {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [selectedReason, setSelectedReason] = useState('');
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;
    setSubmitted(true);
    setTimeout(() => navigate(-1), 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100">举报成功</h2>
          <p className="text-slate-400 mt-2">我们会尽快处理您的举报</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <span className="font-semibold text-slate-100">举报{type === 'post' ? '帖子' : '评论'}</span>
      </div>

      <div className="p-4">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 text-slate-300 mb-4">
            <Flag className="w-5 h-5 text-red-400" />
            <span className="font-medium">选择举报原因</span>
          </div>
          <div className="space-y-2">
            {reportReasons.map(reason => (
              <button
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  selectedReason === reason.id
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                {reason.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4">
          <span className="font-medium text-slate-300">补充说明（选填）</span>
          <textarea
            value={detail}
            onChange={e => setDetail(e.target.value)}
            placeholder="请详细描述举报原因..."
            rows={4}
            className="w-full mt-2 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none resize-none focus:border-violet-500"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!selectedReason}
          className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          提交举报
        </motion.button>
      </div>
    </div>
  );
}
