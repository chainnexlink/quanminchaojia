import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, CheckCircle, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DailyTask {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'login' | 'vote' | 'share' | 'comment';
  targetCount: number;
  status: 'active' | 'inactive';
}

const mockTasks: DailyTask[] = [
  { id: '1', title: '每日登录', description: '登录应用', points: 10, type: 'login', targetCount: 1, status: 'active' },
  { id: '2', title: '参与投票', description: '参与3个话题投票', points: 20, type: 'vote', targetCount: 3, status: 'active' },
  { id: '3', title: '分享话题', description: '分享1个话题', points: 15, type: 'share', targetCount: 1, status: 'active' },
];

export function AdminDailyTaskPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<DailyTask[]>(mockTasks);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<DailyTask | null>(null);
  const [form, setForm] = useState<{ title: string; description: string; points: number; type: DailyTask['type']; targetCount: number }>({ title: '', description: '', points: 10, type: 'login', targetCount: 1 });

  const handleSave = () => {
    if (editing) {
      setTasks(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
    } else {
      setTasks(prev => [...prev, { id: Date.now().toString(), ...form, status: 'active' }]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t));
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm">
          <Plus size={16} /> 新建
        </button>
      </div>

      <div className="p-4 space-y-3">
        {tasks.map(task => (
          <motion.div key={task.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{task.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {task.status === 'active' ? '启用' : '禁用'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-amber-600">
                    <Gift size={14} /> {task.points}积分
                  </span>
                  <span className="text-gray-400">目标: {task.targetCount}次</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(task); setForm(task); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(task.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <button onClick={() => handleToggle(task.id)} className={`mt-3 w-full py-2 rounded-lg text-sm ${task.status === 'active' ? 'bg-gray-100 text-gray-600' : 'bg-green-500 text-white'}`}>
              {task.status === 'active' ? '禁用' : '启用'}
            </button>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold mb-4">{editing ? '编辑任务' : '新建任务'}</h3>
            <input placeholder="任务名称" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg mb-3 text-sm" />
            <input placeholder="任务描述" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg mb-3 text-sm" />
            <input type="number" placeholder="奖励积分" value={form.points} onChange={e => setForm({ ...form, points: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg mb-3 text-sm" />
            <input type="number" placeholder="目标次数" value={form.targetCount} onChange={e => setForm({ ...form, targetCount: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg mb-4 text-sm" />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm">取消</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
