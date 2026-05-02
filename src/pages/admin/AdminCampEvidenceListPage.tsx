import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Image, Video, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Evidence {
  id: string;
  userId: string;
  username: string;
  campIndex: number;
  campName: string;
  type: 'image' | 'video';
  url: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  likes: number;
}

const mockEvidence: Evidence[] = [
  { id: '1', userId: 'u1', username: '用户A', campIndex: 0, campName: '咸党', type: 'image', url: '', description: '咸豆腐脑最好吃', status: 'approved', createdAt: '2026-04-29', likes: 56 },
  { id: '2', userId: 'u2', username: '用户B', campIndex: 1, campName: '甜党', type: 'video', url: '', description: '甜豆腐脑才是正宗', status: 'pending', createdAt: '2026-04-28', likes: 23 },
];

export function AdminCampEvidenceListPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [evidence, setEvidence] = useState<Evidence[]>(mockEvidence);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewingEvidence, setViewingEvidence] = useState<Evidence | null>(null);

  const filtered = evidence.filter(e => filter === 'all' ? true : e.status === filter);

  const handleApprove = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
  };

  const handleReject = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
    const labels: Record<string, string> = { pending: '待审核', approved: '已通过', rejected: '已拒绝' };
    return <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              {f === 'all' ? '全部' : f === 'pending' ? '待审核' : f === 'approved' ? '已通过' : '已拒绝'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(e => (
            <motion.div key={e.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {e.type === 'image' ? <Image className="w-6 h-6 text-gray-400" /> : <Video className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{e.username}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">{e.campName}</span>
                    {getStatusBadge(e.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{e.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{e.createdAt}</span>
                    <span>点赞: {e.likes}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setViewingEvidence(e)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm flex items-center justify-center gap-1">
                  <Eye size={14} /> 查看
                </button>
                {e.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(e.id)} className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm flex items-center justify-center gap-1">
                      <CheckCircle size={14} /> 通过
                    </button>
                    <button onClick={() => handleReject(e.id)} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm flex items-center justify-center gap-1">
                      <XCircle size={14} /> 拒绝
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {viewingEvidence && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setViewingEvidence(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold">{viewingEvidence.username}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">{viewingEvidence.campName}</span>
              {getStatusBadge(viewingEvidence.status)}
            </div>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              {viewingEvidence.type === 'image' ? <Image className="w-12 h-12 text-gray-300" /> : <Video className="w-12 h-12 text-gray-300" />}
            </div>
            <p className="text-sm text-gray-700 mb-2">{viewingEvidence.description}</p>
            <p className="text-xs text-gray-400 mb-4">{viewingEvidence.createdAt} · 点赞: {viewingEvidence.likes}</p>
            <button onClick={() => setViewingEvidence(null)} className="w-full py-2 bg-gray-100 rounded-lg text-sm">关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}
