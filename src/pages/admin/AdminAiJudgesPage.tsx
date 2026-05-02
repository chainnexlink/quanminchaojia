import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, RefreshCw, Settings, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AiJudgment {
  id: string;
  topicId: string;
  topicTitle: string;
  content: string;
  result: string;
  boostPercent: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

const mockJudgments: AiJudgment[] = [
  {
    id: '1',
    topicId: 't1',
    topicTitle: '豆腐脑吃咸还是甜？',
    content: '从营养角度分析...',
    result: '支持咸派',
    boostPercent: 15,
    status: 'completed',
    createdAt: '2026-04-29 10:30'
  },
  {
    id: '2',
    topicId: 't2',
    topicTitle: '冬天应该穿秋裤吗？',
    content: '从健康角度分析...',
    result: '支持穿秋裤',
    boostPercent: 8,
    status: 'completed',
    createdAt: '2026-04-28 15:20'
  },
  {
    id: '3',
    topicId: 't3',
    topicTitle: '粽子甜咸之争',
    content: '分析中...',
    result: '',
    boostPercent: 0,
    status: 'pending',
    createdAt: '2026-04-29 09:00'
  },
];

export function AdminAiJudgesPage() {
  const navigate = useNavigate();
  const [judgments, setJudgments] = useState<AiJudgment[]>(mockJudgments);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredJudgments = judgments.filter(j =>
    filter === 'all' ? true : j.status === filter
  );

  const handleRejudge = (id: string) => {
    setJudgments(prev => prev.map(j =>
      j.id === id ? { ...j, status: 'pending' } : j
    ));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700'
    };
    const labels = { completed: '已完成', pending: '处理中', failed: '失败' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const selected = judgments.find(j => j.id === selectedId);

  return (
    <div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'completed', 'pending', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {f === 'all' ? '全部' : f === 'completed' ? '已完成' : f === 'pending' ? '处理中' : '失败'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredJudgments.map((j) => (
            <motion.div
              key={j.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-sm">{j.topicTitle}</span>
                </div>
                {getStatusBadge(j.status)}
              </div>

              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{j.content}</p>

              {j.status === 'completed' && (
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                  <span>结果: {j.result}</span>
                  <span className="text-green-600">+{j.boostPercent}% 加成</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{j.createdAt}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedId(j.id)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRejudge(j.id)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedId(null)}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              AI评判详情
            </h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500">话题:</span> {selected.topicTitle}</p>
              <p><span className="text-gray-500">内容:</span> {selected.content}</p>
              {selected.result && <p><span className="text-gray-500">结果:</span> {selected.result}</p>}
              {selected.boostPercent > 0 && (
                <p><span className="text-gray-500">加成:</span> +{selected.boostPercent}%</p>
              )}
              <p><span className="text-gray-500">状态:</span> {getStatusBadge(selected.status)}</p>
              <p><span className="text-gray-500">时间:</span> {selected.createdAt}</p>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="w-full mt-6 py-2 bg-gray-100 rounded-lg text-sm"
            >
              关闭
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
