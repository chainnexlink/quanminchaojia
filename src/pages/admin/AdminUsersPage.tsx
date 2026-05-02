import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Ban, CheckCircle, User, Shield, MoreVertical } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  avatar: string;
  email: string;
  status: 'active' | 'banned';
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  topicsCount: number;
  votesCount: number;
}

const mockUsers: UserData[] = [
  { id: '1', username: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', email: 'zhangsan@meoo.local', status: 'active', role: 'user', createdAt: '2024-01-15', topicsCount: 12, votesCount: 156 },
  { id: '2', username: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', email: 'lisi@meoo.local', status: 'active', role: 'moderator', createdAt: '2024-01-10', topicsCount: 8, votesCount: 89 },
  { id: '3', username: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', email: 'wangwu@meoo.local', status: 'banned', role: 'user', createdAt: '2024-01-05', topicsCount: 3, votesCount: 45 },
  { id: '4', username: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', email: 'zhaoliu@meoo.local', status: 'active', role: 'admin', createdAt: '2024-01-01', topicsCount: 25, votesCount: 312 },
];

export function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'banned' : 'active' }
        : user
    ));
  };

  return (
    <div>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="active">正常</option>
              <option value="banned">已封禁</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">用户</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">角色</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">注册时间</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">话题/投票</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">状态</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'moderator' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        {user.role === 'user' && <User className="w-3 h-3" />}
                        {user.role === 'admin' ? '管理员' : user.role === 'moderator' ? '版主' : '用户'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.createdAt}</td>
                    <td className="py-3 px-4 text-gray-600">{user.topicsCount} / {user.votesCount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        {user.status === 'active' ? '正常' : '已封禁'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              未找到匹配的用户
            </div>
          )}
        </div>
    </div>
  );
}
