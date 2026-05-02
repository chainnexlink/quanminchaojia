import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';

export function EvidenceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { topics } = useStore();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');

  const evidence = ([] as any[]).find((p: any) => p.id === id);

  if (!evidence) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <p className="text-slate-400">佐证不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <span className="font-semibold text-slate-100">佐证详情</span>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4 mb-2">
        <div className="flex items-center gap-3 mb-4">
          <img src={evidence.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-medium text-slate-200">{evidence.user?.nickname || '用户'}</div>
            <div className={`text-xs ${evidence.camp === 'north' ? 'text-cyan-400' : 'text-pink-400'}`}>
              {evidence.camp === 'north' ? '北方阵营' : '南方阵营'}
            </div>
          </div>
        </div>

        <p className="text-slate-200 mb-4">{evidence.content}</p>

        {evidence.images?.length > 0 && (
          <img src={evidence.images[0]} alt="" className="w-full rounded-xl mb-4" />
        )}

        <div className="flex items-center gap-6 text-slate-400">
          <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1 ${liked ? 'text-red-400' : ''}`}>
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{(evidence.likes || 0) + (liked ? 1 : 0)}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-5 h-5" />
            <span>{evidence.comments?.length || 0}</span>
          </span>
          <button className="flex items-center gap-1">
            <Share2 className="w-5 h-5" />
            <span>分享</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4">
        <h3 className="font-semibold mb-4 text-slate-200">评论 ({evidence.comments?.length || 0})</h3>
        <div className="space-y-4">
          {evidence.comments?.map((c: any) => (
            <div key={c.id} className="flex gap-3">
              <img src={c.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-200">{c.user?.nickname || '用户'}</div>
                <p className="text-slate-400 text-sm">{c.content}</p>
              </div>
            </div>
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
