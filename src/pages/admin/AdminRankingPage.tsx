import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Users, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: 'active' | 'ended' | 'upcoming';
}

const mockSeasons: Season[] = [
  { id: '1', name: '2026春季赛季', startDate: '2026-03-01', endDate: '2026-05-31', participants: 12580, status: 'active' },
  { id: '2', name: '2026冬季赛季', startDate: '2026-01-01', endDate: '2026-02-28', participants: 9800, status: 'ended' },
];

const mockRankings = [
  { rank: 1, user: '用户A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', power: 5200, topics: 45, votes: 320 },
  { rank: 2, user: '用户B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', power: 4800, topics: 38, votes: 280 },
  { rank: 3, user: '用户C', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', power: 4200, topics: 32, votes: 250 },
];

export function AdminRankingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'seasons' | 'rankings' | 'settings'>('seasons');
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      <div className="flex gap-2 p-4 border-b bg-white">
        {[{ key: 'seasons', label: '赛季管理', icon: Calendar }, { key: 'rankings', label: '榜单数据', icon: Trophy }, { key: 'settings', label: '规则配置', icon: Settings }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 ${
              activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'seasons' && (
        <div className="p-4">
          <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium mb-4">
            + 新建赛季
          </button>
          <div className="space-y-3">
            {mockSeasons.map(season => (
              <motion.div key={season.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{season.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    season.status === 'active' ? 'bg-green-100 text-green-600' :
                    season.status === 'ended' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {season.status === 'active' ? '进行中' : season.status === 'ended' ? '已结束' : '未开始'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {season.participants}</span>
                  <span>{season.startDate} ~ {season.endDate}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rankings' && (
        <div className="p-4 space-y-3">
          {mockRankings.map((item, i) => (
            <motion.div key={i} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                i === 0 ? 'bg-yellow-100 text-yellow-600' :
                i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {item.rank}
              </div>
              <img src={item.avatar} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="font-medium">{item.user}</p>
                <p className="text-xs text-gray-500">{item.topics}话题 · {item.votes}投票</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-600">{item.power}</p>
                <p className="text-xs text-gray-400">战力</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-medium mb-3">积分规则</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">发布话题</span>
                <input type="number" defaultValue={10} className="w-20 px-2 py-1 border rounded text-right" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">获得投票</span>
                <input type="number" defaultValue={5} className="w-20 px-2 py-1 border rounded text-right" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">评论被赞</span>
                <input type="number" defaultValue={2} className="w-20 px-2 py-1 border rounded text-right" />
              </div>
            </div>
          </div>
          <button className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium">保存设置</button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <motion.div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">新建赛季</h3>
            <input placeholder="赛季名称" className="w-full px-4 py-3 border rounded-xl mb-3" />
            <input type="date" className="w-full px-4 py-3 border rounded-xl mb-3" />
            <input type="date" className="w-full px-4 py-3 border rounded-xl mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 rounded-lg">取消</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-blue-500 text-white rounded-lg">创建</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
