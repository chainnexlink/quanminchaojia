import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Download, Vote, User, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VoteRecord {
  id: string;
  userId: string;
  username: string;
  topicId: string;
  topicTitle: string;
  camp: string;
  campIndex: number;
  points: number;
  createdAt: string;
}

const mockVotes: VoteRecord[] = [
  { id: '1', userId: 'u1', username: '用户A', topicId: 't1', topicTitle: '豆腐脑甜咸之争', camp: '咸党', campIndex: 0, points: 0, createdAt: '2026-04-29 10:30' },
  { id: '2', userId: 'u2', username: '用户B', topicId: 't1', topicTitle: '豆腐脑甜咸之争', camp: '甜党', campIndex: 1, points: 50, createdAt: '2026-04-29 09:15' },
  { id: '3', userId: 'u3', username: '用户C', topicId: 't2', topicTitle: '南北供暖差异', camp: '暖气派', campIndex: 0, points: 100, createdAt: '2026-04-28 16:00' },
];

export function AdminVotesPage() {
  const navigate = useNavigate();
  const [votes] = useState<VoteRecord[]>(mockVotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const topics = ['all', '豆腐脑甜咸之争', '南北供暖差异'];

  const filteredVotes = votes.filter(v => {
    const matchesSearch = v.username.includes(searchQuery) || v.topicTitle.includes(searchQuery);
    const matchesTopic = selectedTopic === 'all' || v.topicTitle === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const handleExport = () => {
    alert('导出投票数据');
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={handleExport} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm">
          <Download size={16} /> 导出
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户或话题"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            {topics.map(t => (
              <option key={t} value={t}>{t === 'all' ? '全部话题' : t}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredVotes.map((vote, index) => (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 border-b last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Vote className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{vote.username}</span>
                    <span className="text-xs text-gray-400">投票给</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">{vote.camp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{vote.topicTitle}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{vote.createdAt}</span>
                    {vote.points > 0 && (
                      <span className="text-amber-600">+{vote.points} 辩豆</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
