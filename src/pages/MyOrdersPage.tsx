import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MessageSquare, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

interface Order {
  id: string;
  itemName: string;
  points: number;
  status: 'pending' | 'shipped' | 'delivered' | 'completed';
  date: string;
  tracking?: string;
}

const mockOrders: Order[] = [
  { id: '1', itemName: '免广告卡', points: 50, status: 'completed', date: '2026-04-28' },
  { id: '2', itemName: '限定马克杯', points: 500, status: 'shipped', date: '2026-04-25', tracking: 'SF123456789' },
  { id: '3', itemName: '话题置顶券', points: 200, status: 'pending', date: '2026-04-29' },
];

export function MyOrdersPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipped' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = mockOrders.filter(o => filter === 'all' ? true : o.status === filter);

  const getStatus = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      shipped: 'bg-blue-500/20 text-blue-400',
      delivered: 'bg-violet-500/20 text-violet-400',
      completed: 'bg-green-500/20 text-green-400'
    };
    const labels: Record<string, string> = { pending: '待发货', shipped: '配送中', delivered: '待收货', completed: '已完成' };
    return <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>{labels[status]}</span>;
  };

  const handleAfterSale = () => {
    showToast('售后申请已提交，客服会尽快联系您', 'success');
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">我的订单</h1>
        </div>
      </div>

      <div className="flex gap-2 p-4 bg-slate-800/50 border-b border-slate-700/50">
        {['all', 'pending', 'shipped', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              filter === f ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/50'
            }`}
          >
            {f === 'all' ? '全部' : f === 'pending' ? '待发货' : f === 'shipped' ? '配送中' : '已完成'}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {filtered.length > 0 ? (
          filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedOrder(order)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-sm text-slate-200">{order.itemName}</span>
                </div>
                {getStatus(order.status)}
              </div>
              <p className="text-amber-400 font-bold text-sm">-{order.points}豆</p>
              <p className="text-xs text-slate-500 mt-1">{order.date}</p>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm mb-4">暂无订单</p>
            <button onClick={() => navigate('/shop')} className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-sm font-medium">
              去商城看看
            </button>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <motion.div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-4 text-slate-100">订单详情</h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-slate-500">商品:</span> <span className="text-slate-200">{selectedOrder.itemName}</span></p>
              <p><span className="text-slate-500">积分:</span> <span className="text-slate-200">{selectedOrder.points}豆</span></p>
              <p><span className="text-slate-500">状态:</span> {getStatus(selectedOrder.status)}</p>
              <p><span className="text-slate-500">时间:</span> <span className="text-slate-200">{selectedOrder.date}</span></p>
              {selectedOrder.tracking && (
                <p><span className="text-slate-500">物流:</span> <span className="text-slate-200">{selectedOrder.tracking}</span></p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAfterSale} className="flex-1 py-2 bg-slate-700 text-slate-200 rounded-lg text-sm hover:bg-slate-600 transition-colors">申请售后</button>
              <button onClick={() => setSelectedOrder(null)} className="flex-1 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg text-sm">关闭</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
