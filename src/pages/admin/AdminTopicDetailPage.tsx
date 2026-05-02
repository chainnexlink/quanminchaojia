import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MessageSquare, Bot, CheckCircle, XCircle, Edit3 } from 'lucide-react';

interface TopicDetail {
  id: string;
  title: string;
  debate_type: 'culture' | 'local';
  camps: string[];
  raw_votes: number[];
  ai_boost_percents: number[];
  support_pool: number;
  status: string;
  created_at: string;
  expire_at?: string;
  creator: { id: string; nickname: string; avatar_url: string };
  total_participants: number;
  comments_count: number;
}

const mockTopic: TopicDetail = {
  id: '1',
  title: '豆腐脑吃咸还是甜？',
  debate_type: 'culture',
  camps: ['咸党', '甜党', '辣党'],
  raw_votes: [1250, 980, 320],
  ai_boost_percents: [5, 3, 0],
  support_pool: 0,
  status: 'active',
  created_at: '2024-01-15',
  creator: { id: 'u1', nickname: '张三', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
  total_participants: 2550,
  comments_count: 128
};

const mockComments = [
  { id: '1', user: '用户A', content: '必须咸的！', time: '2小时前', status: 'normal' },
  { id: '2', user: '用户B', content: '甜的才好吃', time: '3小时前', status: 'normal' },
];

const mockAiJudgments = [
  { id: '1', camp: '咸党', boost: 5, reason: '论据充分，引用历史文献', time: '1天前' },
  { id: '2', camp: '甜党', boost: 3, reason: '观点清晰，有数据支撑', time: '2天前' },
];

export function AdminTopicDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<TopicDetail>(mockTopic);
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'ai'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  const totalVotes = topic.raw_votes.reduce((a, b) => a + b, 0);

  const handleStatusChange = (status: string) => {
    setTopic({ ...topic, status });
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <button onClick={() => setIsEditing(!isEditing)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
          <Edit3 className="w-4 h-4" />
        </button>
        {topic.status === 'pending_review' && (
          <>
            <button onClick={() => handleStatusChange('active')} className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg">
              通过
            </button>
            <button onClick={() => handleStatusChange('rejected')} className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg">
              拒绝
            </button>
          </>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded text-xs ${topic.debate_type === 'culture' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
              {topic.debate_type === 'culture' ? '文化差异' : '本地辩论'}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${topic.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
              {topic.status === 'active' ? '进行中' : topic.status === 'pending_review' ? '待审核' : '已结束'}
            </span>
          </div>
          {isEditing ? (
            <input value={topic.title} onChange={(e) => setTopic({ ...topic, title: e.target.value })} className="w-full p-2 border rounded-lg" />
          ) : (
            <h2 className="text-lg font-bold mb-2">{topic.title}</h2>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <img src={topic.creator.avatar_url} className="w-6 h-6 rounded-full" />
            <span>{topic.creator.nickname}</span>
            <span>·</span>
            <span>{topic.created_at}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {[{ key: 'overview', label: '概览', icon: Users }, { key: 'comments', label: '评论', icon: MessageSquare }, { key: 'ai', label: 'AI评判', icon: Bot }].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 ${activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3">投票统计</h3>
              <div className="space-y-3">
                {topic.camps.map((camp, i) => {
                  const percent = totalVotes > 0 ? (topic.raw_votes[i] / totalVotes) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{camp}</span>
                        <span>{topic.raw_votes[i]}票 ({percent.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="h-full bg-blue-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold">{topic.total_participants}</p>
                  <p className="text-xs text-gray-500">参与人数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{topic.comments_count}</p>
                  <p className="text-xs text-gray-500">评论数</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="bg-white rounded-xl shadow-sm">
            {mockComments.map(c => (
              <div key={c.id} className="p-4 border-b last:border-0">
                <div className="flex justify-between">
                  <span className="font-medium">{c.user}</span>
                  <span className="text-xs text-gray-400">{c.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-3">
            {mockAiJudgments.map(j => (
              <div key={j.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">{j.camp}</span>
                  <span className="text-green-600 text-sm">+{j.boost}%</span>
                </div>
                <p className="text-sm text-gray-600">{j.reason}</p>
                <p className="text-xs text-gray-400 mt-1">{j.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
