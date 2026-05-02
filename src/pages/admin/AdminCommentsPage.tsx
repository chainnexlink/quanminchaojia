import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Ban, Search, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  topicTitle: string;
  topicId: string;
  createdAt: string;
  status: 'active' | 'deleted';
}

const mockComments: Comment[] = [
  { id: '1', content: '这个观点很有道理', author: '用户A', authorId: 'u1', topicTitle: '豆腐脑甜咸之争', topicId: 't1', createdAt: '2024-01-15 10:30', status: 'active' },
  { id: '2', content: '不同意你的看法', author: '用户B', authorId: 'u2', topicTitle: '南北供暖差异', topicId: 't2', createdAt: '2024-01-15 09:20', status: 'active' },
  { id: '3', content: '支持支持！', author: '用户C', authorId: 'u3', topicTitle: '粽子口味大战', topicId: 't3', createdAt: '2024-01-14 15:45', status: 'active' },
];

export function AdminCommentsPage() {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const topics = ['all', '豆腐脑甜咸之争', '南北供暖差异', '粽子口味大战'];

  const filteredComments = comments.filter(c => {
    const matchesSearch = c.content.includes(searchQuery) || c.author.includes(searchQuery);
    const matchesTopic = selectedTopic === 'all' || c.topicTitle === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const handleDelete = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const handleBanUser = (authorId: string) => {
    alert(`已封禁用户: ${authorId}`);
  };

  return (
    <div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索评论内容或作者"
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

        <div className="space-y-3">
          {filteredComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-800 mb-2">{comment.content}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span>{comment.author}</span>
                    <span>·</span>
                    <span>{comment.topicTitle}</span>
                    <span>·</span>
                    <span>{comment.createdAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                      删除
                    </button>
                    <button
                      onClick={() => handleBanUser(comment.authorId)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs"
                    >
                      <Ban className="w-3 h-3" />
                      封禁用户
                    </button>
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
