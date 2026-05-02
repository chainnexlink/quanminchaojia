import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, MessageSquare, DollarSign, AlertTriangle,
  TrendingUp, Activity, CheckCircle, Clock
} from 'lucide-react';

const stats = [
  { title: '总用户数', value: '12,580', icon: Users, color: 'bg-blue-500', trend: '+12%' },
  { title: '话题总数', value: '3,420', icon: MessageSquare, color: 'bg-green-500', trend: '+8%' },
  { title: '待审核提现', value: '28', icon: DollarSign, color: 'bg-orange-500', trend: '待处理' },
  { title: '待处理举报', value: '15', icon: AlertTriangle, color: 'bg-red-500', trend: '紧急' },
];

const recentActivities = [
  { id: 1, type: 'user', content: '新用户注册: 张三', time: '2分钟前' },
  { id: 2, type: 'topic', content: '新话题发布: 南北甜咸粽子大战', time: '5分钟前' },
  { id: 3, type: 'withdraw', content: '提现申请: ¥500', time: '10分钟前' },
  { id: 4, type: 'report', content: '举报: 话题内容违规', time: '15分钟前' },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();

  const menuItems = [
    { title: '用户管理', icon: Users, path: '/admin/users', count: 12580 },
    { title: '话题管理', icon: MessageSquare, path: '/admin/topics', count: 3420 },
    { title: '提现审核', icon: DollarSign, path: '/admin/withdrawals', count: 28 },
    { title: '举报处理', icon: AlertTriangle, path: '/admin/reports', count: 15 },
  ];

  return (
    <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs ${stat.trend.includes('+') ? 'text-green-500' : 'text-orange-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷入口</h2>
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <motion.button
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.count}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">最近动态</h2>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'report' ? 'bg-red-500' :
                    activity.type === 'withdraw' ? 'bg-orange-500' :
                    activity.type === 'topic' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.content}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
