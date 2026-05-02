import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, User, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LogEntry {
  id: string;
  type: 'login' | 'operation' | 'security';
  user: string;
  action: string;
  target: string;
  ip: string;
  time: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', type: 'login', user: '管理员A', action: '登录', target: '后台系统', ip: '192.168.1.1', time: '2026-04-29 14:30:00' },
  { id: '2', type: 'operation', user: '管理员B', action: '审核通过', target: '话题#1234', ip: '192.168.1.2', time: '2026-04-29 14:25:00' },
  { id: '3', type: 'security', user: '系统', action: '拦截异常登录', target: '用户张三', ip: '10.0.0.5', time: '2026-04-29 14:20:00' },
  { id: '4', type: 'operation', user: '管理员A', action: '提现审核', target: '提现#5678', ip: '192.168.1.1', time: '2026-04-29 14:15:00' },
];

export function AdminLogsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'login' | 'operation' | 'security'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockLogs.filter(log => {
    if (filter !== 'all' && log.type !== filter) return false;
    if (searchQuery && !log.user.includes(searchQuery) && !log.action.includes(searchQuery)) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'login': return <User className="w-4 h-4" />;
      case 'operation': return <Settings className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'login': return 'bg-blue-100 text-blue-700';
      case 'operation': return 'bg-green-100 text-green-700';
      case 'security': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户或操作..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">全部</option>
            <option value="login">登录</option>
            <option value="operation">操作</option>
            <option value="security">安全</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 border-b last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTypeStyle(log.type)}`}>
                  {getIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{log.user}</span>
                    <span className="text-xs text-gray-400">{log.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {log.action} <span className="text-gray-400">→</span> {log.target}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">IP: {log.ip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
