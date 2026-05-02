import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Image, Video, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Evidence {
  id: string;
  topicId: string;
  topicTitle: string;
  userId: string;
  username: string;
  type: 'image' | 'video';
  url: string;
  camp: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const mockEvidence: Evidence[] = [
  { id: '1', topicId: 't1', topicTitle: '豆腐脑甜咸之争', userId: 'u1', username: '用户A', type: 'image', url: 'https://picsum.photos/200', camp: '甜党', status: 'pending', createdAt: '2026-04-29 10:30' },
  { id: '2', topicId: 't2', topicTitle: '南北供暖差异', userId: 'u2', username: '用户B', type: 'video', url: 'https://example.com/video.mp4', camp: '暖气派', status: 'approved', createdAt: '2026-04-28 15:20' },
];

export function AdminEvidencePage() {
  const navigate = useNavigate();
  const [evidence, setEvidence] = useState<Evidence[]>(mockEvidence);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selected, setSelected] = useState<Evidence | null>(null);

  const filtered = evidence.filter(e => filter === 'all' ? true : e.status === filter);

  const handleApprove = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
  };

  const handleReject = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
  };

  const handleDelete = (id: string) => {
    setEvidence(prev => prev.filter(e => e.id !== id));
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
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
              {f === 'all' ? '全部' : f === 'pending' ? '待审核' : f === 'approved' ? '已通过' : '已拒绝'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map(e => (
            <motion.div key={e.id} className="bg-white rounded-xl p-3 shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                {e.type === 'image' ? <img src={e.url} className="w-full h-full object-cover rounded-lg" /> : <Video className="w-8 h-8 text-gray-400" />}
              </div>
              <p className="text-sm font-medium line-clamp-1">{e.topicTitle}</p>
              <p className="text-xs text-gray-500">{e.username} · {e.camp}</p>
              <div className="flex items-center justify-between mt-2">
                {getStatusBadge(e.status)}
                <div className="flex gap-1">
                  <button onClick={() => setSelected(e)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"><Eye size={14} /></button>
                  {e.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(e.id)} className="p-1.5 text-green-500 hover:bg-green-50 rounded"><CheckCircle size={14} /></button>
                      <button onClick={() => handleReject(e.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><XCircle size={14} /></button>
                    </>
                  )}
                  <button onClick={() => handleDelete(e.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <motion.div className="bg-white rounded-xl p-4 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              {selected.type === 'image' ? <img src={selected.url} className="w-full h-full object-cover rounded-lg" /> : <Video className="w-12 h-12 text-gray-400" />}
            </div>
            <p className="font-medium">{selected.topicTitle}</p>
            <p className="text-sm text-gray-500">{selected.username} · {selected.camp}</p>
            <p className="text-xs text-gray-400 mt-2">{selected.createdAt}</p>
            <button onClick={() => setSelected(null)} className="w-full mt-4 py-2 bg-gray-100 rounded-lg text-sm">关闭</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
