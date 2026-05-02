import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Ticket, Sparkles, Package, ShoppingCart, MapPin, ClipboardList, Plus, Minus, Trash2, CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'virtual' | 'physical' | 'ticket' | 'adfree';
  stock: number;
}

const categories = [
  { id: 'all', name: '全部' },
  { id: 'virtual', name: '虚拟道具' },
  { id: 'physical', name: '实物周边' },
  { id: 'ticket', name: '卡券' },
];

const mockOrders = [
  { id: '1', itemName: '免广告卡', points: 50, status: 'completed', date: '2026-04-28' },
  { id: '2', itemName: '限定马克杯', points: 500, status: 'shipping', date: '2026-04-25' },
];

const mockAddresses = [
  { id: '1', name: '张三', phone: '138****8888', address: '北京市朝阳区xxx街道', isDefault: true },
];

export function ShopPage() {
  const navigate = useNavigate();
  const { user, shopItems } = useStore();
  const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'orders' | 'address'>('shop');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{ item: ShopItem; quantity: number }[]>([]);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const filteredItems = selectedCategory === 'all'
    ? shopItems
    : shopItems.filter(item => item.type === selectedCategory || (selectedCategory === 'virtual' && item.type === 'adfree'));

  const cartTotal = cart.reduce((sum, c) => sum + c.item.points * c.quantity, 0);

  const addToCart = (item: ShopItem) => {
    const existing = cart.find(c => c.item.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.item.id === itemId) {
        const newQty = Math.max(1, c.quantity + delta);
        return { ...c, quantity: newQty };
      }
      return c;
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.item.id !== itemId));
  };

  const handleCheckout = () => {
    if (cartTotal > (user?.points ?? 0)) {
      alert('积分不足');
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">积分商城</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm">{user?.points ?? 0}豆</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-2 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
        {[
          { key: 'shop', icon: ShoppingBag, label: '商城' },
          { key: 'cart', icon: ShoppingCart, label: '购物车' },
          { key: 'orders', icon: ClipboardList, label: '订单' },
          { key: 'address', icon: MapPin, label: '地址' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${
              activeTab === tab.key ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'text-slate-400'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'shop' && (
          <motion.div className="p-4">
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === cat.id ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedItem(item)}
                  className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 cursor-pointer"
                >
                  <div className="aspect-square bg-slate-700/50 rounded-lg mb-3 flex items-center justify-center">
                    {item.type === 'ticket' ? <Ticket className="w-10 h-10 text-slate-400" /> :
                     item.type === 'adfree' ? <Sparkles className="w-10 h-10 text-slate-400" /> :
                     <Package className="w-10 h-10 text-slate-400" />}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1 text-slate-200">{item.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-amber-400 font-bold text-sm">{item.points}豆</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                      className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full text-xs"
                    >
                      加入购物车
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'cart' && (
          <motion.div className="p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                <p>购物车是空的</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map(({ item, quantity }) => (
                    <div key={item.id} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-slate-200">{item.name}</h3>
                        <p className="text-amber-400 font-bold">{item.points}豆</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-slate-700 rounded">
                          <Minus className="w-4 h-4 text-slate-300" />
                        </button>
                        <span className="w-8 text-center text-slate-200">{quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-slate-700 rounded">
                          <Plus className="w-4 h-4 text-slate-300" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400">合计</span>
                    <span className="text-xl font-bold text-amber-400">{cartTotal}豆</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={cartTotal > (user?.points ?? 0)}
                    className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium disabled:bg-slate-700 disabled:text-slate-500"
                  >
                    {cartTotal > (user?.points ?? 0) ? '积分不足' : '立即兑换'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div className="p-4 space-y-3">
            {mockOrders.map(order => (
              <div 
                key={order.id} 
                onClick={() => navigate(`/my-orders/${order.id}`)}
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-slate-200">{order.itemName}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status === 'completed' ? '已完成' : '配送中'}
                  </span>
                </div>
                <p className="text-amber-400 font-bold">-{order.points}豆</p>
                <p className="text-xs text-slate-500 mt-1">{order.date}</p>
              </div>
            ))}
            <button 
              onClick={() => navigate('/my-orders')}
              className="w-full py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl text-slate-300 flex items-center justify-center gap-2"
            >
              查看全部订单 <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {activeTab === 'address' && (
          <motion.div className="p-4">
            {mockAddresses.map(addr => (
              <div 
                key={addr.id} 
                onClick={() => navigate('/settings/address')}
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-3 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-slate-200">{addr.name}</span>
                    <span className="text-slate-400 ml-2">{addr.phone}</span>
                  </div>
                  {addr.isDefault && (
                    <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-1 rounded">默认</span>
                  )}
                </div>
                <p className="text-sm text-slate-400">{addr.address}</p>
              </div>
            ))}
            <button 
              onClick={() => navigate('/settings/address')}
              className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> 管理收货地址
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
          <motion.div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2 text-slate-100">{selectedItem.name}</h3>
            <p className="text-slate-400 mb-4">{selectedItem.description}</p>
            <p className="text-2xl font-bold text-amber-400 mb-4">{selectedItem.points}豆</p>
            <div className="flex gap-3">
              <button onClick={() => setSelectedItem(null)} className="flex-1 py-2 bg-slate-700 text-slate-200 rounded-lg">关闭</button>
              <button onClick={() => { addToCart(selectedItem); setSelectedItem(null); }} className="flex-1 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg">加入购物车</button>
            </div>
          </motion.div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 w-full max-w-sm text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2 text-slate-100">兑换成功</h3>
            <p className="text-slate-400 mb-4">已扣除 {cartTotal} 辩豆</p>
            <button onClick={() => { setShowCheckout(false); setCart([]); setActiveTab('orders'); }} className="w-full py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg">查看订单</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
