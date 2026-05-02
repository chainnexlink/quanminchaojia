import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

export function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { topics, user } = useStore();
  const { showToast } = useToast();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');

  const mockPost = {
    id: id || '1',
    user: { nickname: '辩论达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=post1' },
    camp: 'north',
    content: '这是一个精彩的辩论帖子，分享了对话题的深入思考。',
    images: [] as string[],
    likes: 24,
    comments: [
      { id: 'c1', user: { nickname: '用户A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=a' }, content: '说得好！' },
      { id: 'c2', user: { nickname: '用户B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b' }, content: '有道理' },
    ]
  };
  const post = mockPost;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <span className="font-semibold text-slate-100">帖子详情</span>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4 mb-2">
        <div className="flex items-center gap-3 mb-4">
          <img src={post.user.avatar} alt="" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-medium text-slate-200">{post.user.nickname}</div>
            <div className={`text-xs ${post.camp === 'north' ? 'text-blue-400' : 'text-red-400'}`}>
              {post.camp === 'north' ? '北方阵营' : '南方阵营'}
            </div>
          </div>
        </div>

        <p className="text-slate-200 mb-4">{post.content}</p>

        {post.images.length > 0 && (
          <img src={post.images[0]} alt="" className="w-full rounded-xl mb-4" />
        )}

        <div className="flex items-center gap-6 text-slate-400">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1 ${liked ? 'text-red-500' : ''}`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{post.likes + (liked ? 1 : 0)}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </span>
          <button onClick={() => navigate(`/share/${id}`)} className="flex items-center gap-1">
            <Share2 className="w-5 h-5" />
            <span>分享</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <h3 className="font-semibold text-slate-100 mb-4">评论 ({post.comments.length})</h3>
        <div className="space-y-4">
          {post.comments.map((c: any) => (
            <div key={c.id} className="flex gap-3">
              <img src={c.user.avatar} alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-200">{c.user.nickname}</div>
                <p className="text-slate-300 text-sm">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-slate-800 border-t border-slate-700/50 p-3 flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="写评论..."
          className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500"
        />
        <button
          onClick={() => { if (comment.trim()) { showToast('评论发送成功', 'success'); setComment(''); } }}
          className={`p-2 ${comment.trim() ? 'text-violet-400' : 'text-slate-600'}`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
