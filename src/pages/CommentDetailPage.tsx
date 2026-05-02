import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Flag, Send } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

export function CommentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { topics } = useStore();
  const { showToast } = useToast();
  const [liked, setLiked] = useState(false);
  const [reply, setReply] = useState('');
  const [replyLikes, setReplyLikes] = useState<Record<string, boolean>>({});

  const mockComments: Record<string, { user: { nickname: string; avatar: string }; content: string; likes: number }> = {
    default: { user: { nickname: '辩论达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' }, content: '这个话题非常有意思，双方各有道理。', likes: 12 }
  };

  const comment = mockComments[id || ''] || mockComments['default'];

  const replies = [
    { id: 'r1', user: { nickname: '用户A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=a' }, content: '说得好！', likes: 5, time: '10分钟前' },
    { id: 'r2', user: { nickname: '用户B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b' }, content: '我也这么觉得', likes: 3, time: '30分钟前' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <span className="font-semibold text-slate-100">评论详情</span>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4 mb-2">
        <div className="flex gap-3">
          <img src={comment.user.avatar} alt="" className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="font-medium text-slate-200">{comment.user.nickname}</div>
            <p className="text-slate-300 mt-1">{comment.content}</p>
            <div className="flex items-center gap-4 mt-3 text-slate-400 text-sm">
              <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1 ${liked ? 'text-red-500' : ''}`}>
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{liked ? 1 : 0}</span>
              </button>
              <button className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{replies.length}</span>
              </button>
              <button onClick={() => navigate(`/report/comment/${id}`)} className="flex items-center gap-1">
                <Flag className="w-4 h-4" />
                <span>举报</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <h3 className="font-semibold text-slate-100 mb-4">回复 ({replies.length})</h3>
        <div className="space-y-4">
          {replies.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-3">
              <img src={r.user.avatar} alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-200">{r.user.nickname}</div>
                <p className="text-slate-300 text-sm">{r.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span>{r.time}</span>
                  <button
                    onClick={() => setReplyLikes(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                    className={`flex items-center gap-1 ${replyLikes[r.id] ? 'text-red-400' : ''}`}
                  >
                    <Heart className={`w-3 h-3 ${replyLikes[r.id] ? 'fill-current' : ''}`} />
                    <span>{r.likes + (replyLikes[r.id] ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-slate-800 border-t border-slate-700/50 p-3 flex gap-2">
        <input
          type="text"
          value={reply}
          onChange={e => setReply(e.target.value)}
          placeholder="写回复..."
          className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500"
        />
        <button
          onClick={() => {
            if (reply.trim()) {
              showToast('回复成功', 'success');
              setReply('');
            }
          }}
          className={`p-2 ${reply.trim() ? 'text-violet-400' : 'text-slate-600'}`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
