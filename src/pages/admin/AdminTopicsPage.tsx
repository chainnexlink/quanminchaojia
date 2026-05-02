import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Topic, DebateType } from '../../types';
const formatNumber = (num: number) => num.toLocaleString();

export function AdminTopicsPage() {
  const navigate = useNavigate();
  const { topics, fetchTopics, user } = useStore();
  const [filter, setFilter] = useState<'all' | 'culture' | 'local'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'ended' | 'pending'>('all');

  useEffect(() => {
    fetchTopics();
  }, []);

  const filteredTopics = topics.filter(t => {
    if (filter !== 'all' && t.debate_type !== filter) return false;
    if (statusFilter === 'active') return t.status === 'active';
    if (statusFilter === 'ended') return t.status === 'ended';
    if (statusFilter === 'pending') return t.status === 'pending_review';
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      ended: 'bg-gray-100 text-gray-700',
      pending_review: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700'
    };
    const labels: Record<string, string> = {
      active: '进行中',
      ended: '已结束',
      pending_review: '待审核',
      rejected: '已拒绝'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getTypeBadge = (type: DebateType) => (
    <span className={`px-2 py-1 rounded-full text-xs ${
      type === 'culture' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
    }`}>
      {type === 'culture' ? '文化差异' : '本地辩论'}
    </span>
  );

  return (
    <div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'culture', label: '文化差异' },
            { key: 'local', label: '本地辩论' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === item.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {[
            { key: 'all', label: '全部状态' },
            { key: 'active', label: '进行中' },
            { key: 'ended', label: '已结束' },
            { key: 'pending', label: '待审核' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === item.key
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 border-b last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{topic.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(topic.debate_type as DebateType)}
                    {getStatusBadge(topic.status ?? '')}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>参与: {formatNumber(topic.total_participants || 0)}</span>
                    <span>豆池: {formatNumber(topic.support_pool || 0)}</span>
                    <span>{topic.created_at ? new Date(topic.created_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {topic.status === 'pending_review' && (
                    <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg">
                      通过
                    </button>
                  )}
                  <button className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg">
                    下架
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
