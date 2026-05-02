import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Trash2, Filter, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BrowseRecord {
  id: string;
  topicId: string;
  title: string;
  viewedAt: string;
  type: 'culture' | 'local';
}

const mockRecords: BrowseRecord[] = [
  { id: '1', topicId: '550e8400-e29b-41d4-a716-446655440001', title: '豆腐脑甜咸之争', viewedAt: '2026-04-29 10:30', type: 'culture' },
  { id: '2', topicId: '550e8400-e29b-41d4-a716-446655440002', title: '南北供暖差异', viewedAt: '2026-04-28 15:20', type: 'culture' },
  { id: '3', topicId: '550e8400-e29b-41d4-a716-446655440003', title: '周末聚餐去哪吃', viewedAt: '2026-04-27 09:00', type: 'local' },
];

export function BrowseHistoryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<BrowseRecord[]>(mockRecords);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredRecords = records.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'today') return r.viewedAt.includes('2026-04-29');
    return true;
  });

  const handleClear = () => {
    setRecords([]);
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">浏览历史</h1>
          <button onClick={() => setShowClearConfirm(true)} className="ml-auto p-2 text-red-400 hover:bg-red-500/20 rounded-full">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'today', 'week'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                filter === f ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/50'
              }`}
            >
              {f === 'all' ? '全部' : f === 'today' ? '今天' : '本周'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredRecords.map((record, i) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/topic/${record.topicId}`)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      record.type === 'culture' ? 'bg-violet-500/20 text-violet-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {record.type === 'culture' ? '文化差异' : '本地辩论'}
                    </span>
                  </div>
                  <p className="font-medium text-sm text-slate-200">{record.title}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {record.viewedAt}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-2" />
            <p>暂无浏览记录</p>
          </div>
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 w-full max-w-sm text-center">
            <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2 text-slate-100">清空历史</h3>
            <p className="text-sm text-slate-400 mb-4">确定要清空所有浏览记录吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-2 bg-slate-700 text-slate-200 rounded-lg">取消</button>
              <button onClick={handleClear} className="flex-1 py-2 bg-red-500 text-white rounded-lg">确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
