import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Eye, Filter } from 'lucide-react';

interface Report {
  id: string;
  type: 'topic' | 'comment' | 'user';
  targetId: string;
  reason: string;
  reporter: string;
  status: 'pending' | 'processing' | 'resolved';
  createdAt: string;
}

const mockReports: Report[] = [
  { id: '1', type: 'topic', targetId: 't1', reason: '虚假信息', reporter: '用户A', status: 'pending', createdAt: '2024-01-15' },
  { id: '2', type: 'comment', targetId: 'c1', reason: '人身攻击', reporter: '用户B', status: 'processing', createdAt: '2024-01-14' },
  { id: '3', type: 'user', targetId: 'u1', reason: '恶意刷屏', reporter: '用户C', status: 'resolved', createdAt: '2024-01-13' },
];

export function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  const handleProcess = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'processing' } : r));
  };

  const handleResolve = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
    };
    const labels = { pending: '待处理', processing: '处理中', resolved: '已处理' };
    return <span className={`px-2 py-1 rounded text-xs ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div>
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={filter} onChange={e => setFilter(e.target.value as any)} className="text-sm border rounded-lg px-3 py-2">
              <option value="all">全部</option>
              <option value="pending">待处理</option>
              <option value="processing">处理中</option>
              <option value="resolved">已处理</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          {filteredReports.map(report => (
            <motion.div key={report.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{report.type}</span>
                    {getStatusBadge(report.status)}
                    <span className="text-xs text-gray-400">{report.createdAt}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{report.reason}</p>
                  <p className="text-xs text-gray-500">举报人: {report.reporter}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedReport(report)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  {report.status === 'pending' && (
                    <button onClick={() => handleProcess(report.id)} className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg">
                      处理
                    </button>
                  )}
                  {report.status === 'processing' && (
                    <button onClick={() => handleResolve(report.id)} className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      完成
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedReport(null)}>
            <motion.div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold mb-4">举报详情</h3>
              <div className="space-y-3 text-sm">
                <p><span className="text-gray-500">类型:</span> {selectedReport.type}</p>
                <p><span className="text-gray-500">目标ID:</span> {selectedReport.targetId}</p>
                <p><span className="text-gray-500">原因:</span> {selectedReport.reason}</p>
                <p><span className="text-gray-500">举报人:</span> {selectedReport.reporter}</p>
                <p><span className="text-gray-500">状态:</span> {getStatusBadge(selectedReport.status)}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="w-full mt-6 py-2 bg-gray-100 rounded-lg text-sm">关闭</button>
            </motion.div>
          </div>
        )}
    </div>
  );
}
