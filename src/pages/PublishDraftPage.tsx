import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Edit3 } from 'lucide-react';
import { useState } from 'react';

const mockDrafts = [
  { id: '1', title: '南北差异讨论', content: '今天想聊聊...', time: '2小时前' },
  { id: '2', title: '美食PK', content: '火锅vs烧烤...', time: '昨天' }
];

export function PublishDraftPage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState(mockDrafts);

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">草稿箱</h1>
        <span className="text-slate-500 text-sm">{drafts.length}</span>
      </div>

      <div className="p-4 space-y-3">
        {drafts.map((draft, i) => (
          <motion.div
            key={draft.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-slate-100">{draft.title}</h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{draft.content}</p>
                <span className="text-xs text-slate-500 mt-2">{draft.time}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-violet-400 hover:bg-violet-500/10 rounded-full">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteDraft(draft.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
