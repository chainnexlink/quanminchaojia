import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

const mockComments = [
  { id: '1', user: { name: '用户A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=a' }, content: '说得好！', likes: 5, time: '10分钟前' },
  { id: '2', user: { name: '用户B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b' }, content: '我也这么觉得', likes: 3, time: '30分钟前' }
];

export function EvidenceCommentsPage() {
  const { evidenceId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <span className="font-semibold text-slate-100">评论</span>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 mb-2">
        <div className="flex items-center gap-3 mb-3">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=evidence" alt="" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-medium text-slate-200">佐证作者</div>
            <div className="text-xs text-slate-500">2小时前</div>
          </div>
        </div>
        <p className="text-slate-300">这是佐证内容示例...</p>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4">
        <h3 className="font-semibold mb-4 text-slate-200">评论 ({mockComments.length})</h3>
        <div className="space-y-4">
          {mockComments.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-3">
              <img src={c.user.avatar} alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-200">{c.user.name}</div>
                <p className="text-slate-400 text-sm">{c.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>{c.time}</span>
                  <button onClick={() => toggleLike(c.id)} className={`flex items-center gap-1 ${liked.has(c.id) ? 'text-red-400' : ''}`}>
                    <Heart className={`w-3 h-3 ${liked.has(c.id) ? 'fill-current' : ''}`} />
                    <span>{c.likes + (liked.has(c.id) ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>回复</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700/50 p-3 flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="写评论..."
          className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-sm outline-none text-slate-200 placeholder-slate-500"
        />
        <button className="p-2 text-violet-400">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
