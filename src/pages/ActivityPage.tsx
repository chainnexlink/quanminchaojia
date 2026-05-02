import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock, ChevronRight, Gift, Flame, Calendar, MapPin, CheckCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useToast } from '../components/Toast';

const activities = [
  { id: '550e8400-e29b-41d4-a716-446655440001', title: '南北甜咸大PK', desc: '豆腐脑甜咸之争', participants: 31500, endTime: '2天后结束', hot: true, category: 'debate', location: '全国', status: 'ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440002', title: '冬季取暖方式', desc: '暖气 vs 空调', participants: 28900, endTime: '3天后结束', hot: true, category: 'debate', location: '全国', status: 'ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440003', title: '周末线下聚会', desc: '北京站', participants: 50, endTime: '5天后开始', hot: false, category: 'offline', location: '北京', status: 'upcoming' },
];

const myRegistrations = [
  { id: 1, title: '南北甜咸大PK', status: 'registered', checkIn: false },
  { id: 3, title: '周末线下聚会', status: 'registered', checkIn: true },
];

export function ActivityPage() {
  const navigate = useNavigate();
  const { user, addPoints } = useStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'debate' | 'offline'>('all');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMyActivities, setShowMyActivities] = useState(false);
  const [checkedIn, setCheckedIn] = useState<number[]>([]);

  const filteredActivities = activities.filter(a => 
    activeTab === 'all' ? true : a.category === activeTab
  );

  const handleCheckIn = (id: number) => {
    if (checkedIn.includes(id)) {
      showToast('已签到过了', 'info');
      return;
    }
    setCheckedIn(prev => [...prev, id]);
    addPoints(10);
    showToast('签到成功！+10积分', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-4 py-6 text-white">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center shadow-lg">
            <Flame size={18} className="text-white" />
          </div>
          活动中心
        </h1>
        <p className="text-sm opacity-90 mt-1">参与话题PK，赢取积分奖励</p>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowCalendar(true)}
            className="flex-1 py-2 bg-white/20 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
              <Calendar size={14} />
            </div>
            活动日历
          </button>
          <button
            onClick={() => setShowMyActivities(true)}
            className="flex-1 py-2 bg-white/20 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
              <CheckCircle size={14} />
            </div>
            我的活动
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            {['all', 'debate', 'offline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeTab === tab ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {tab === 'all' ? '全部' : tab === 'debate' ? '辩论' : '线下'}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/activity/history')} className="text-sm text-slate-400">
            历史活动 →
          </button>
        </div>

        <div className="space-y-3">
          {filteredActivities.map((act, i) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/activity/challenge/${act.id}`)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100">{act.title}</h3>
                    {act.hot && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">热门</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      act.category === 'debate' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {act.category === 'debate' ? '辩论' : '线下'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{act.desc}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-slate-700 rounded flex items-center justify-center">
                        <Users size={10} />
                      </div>
                      {act.participants.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-slate-700 rounded flex items-center justify-center">
                        <Clock size={10} />
                      </div>
                      {act.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-slate-700 rounded flex items-center justify-center">
                        <MapPin size={10} />
                      </div>
                      {act.location}
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCalendar(false)}>
          <motion.div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-100"><Calendar size={20} /> 活动日历</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => <span key={d} className="text-slate-500">{d}</span>)}
              {Array.from({ length: 30 }, (_, i) => (
                <button key={i} className={`p-2 rounded-lg ${[5, 12, 20].includes(i) ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'hover:bg-slate-700 text-slate-300'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <button onClick={() => setShowCalendar(false)} className="w-full mt-4 py-2 bg-slate-700 text-slate-200 rounded-lg">关闭</button>
          </motion.div>
        </div>
      )}

      {showMyActivities && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowMyActivities(false)}>
          <motion.div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-100"><CheckCircle size={20} /> 我的活动</h3>
            <div className="space-y-3">
              {myRegistrations.map(item => (
                <div key={item.id} className="p-3 bg-slate-700/50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm text-slate-200">{item.title}</p>
                    <p className="text-xs text-slate-500">{(item.checkIn || checkedIn.includes(item.id)) ? '已签到' : '未签到'}</p>
                  </div>
                  {!item.checkIn && !checkedIn.includes(item.id) ? (
                    <button 
                      onClick={() => handleCheckIn(item.id)}
                      className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs rounded-lg"
                    >
                      签到
                    </button>
                  ) : (
                    <span className="text-xs text-green-400">已签到</span>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setShowMyActivities(false)} className="w-full mt-4 py-2 bg-slate-700 text-slate-200 rounded-lg">关闭</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
