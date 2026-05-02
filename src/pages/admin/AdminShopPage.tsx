import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  points: number;
  stock: number;
  type: 'ticket' | 'adfree' | 'physical';
  status: 'active' | 'inactive';
}

const mockItems: ShopItem[] = [
  { id: '1', name: '免广告卡', description: '24小时免广告', points: 50, stock: 999, type: 'adfree', status: 'active' },
  { id: '2', name: '话题置顶券', description: '话题置顶24小时', points: 200, stock: 50, type: 'ticket', status: 'active' },
];

const mockRecords = [
  { id: '1', user: '用户A', item: '免广告卡', points: 50, time: '2026-04-29 10:30' },
  { id: '2', user: '用户B', item: '话题置顶券', points: 200, time: '2026-04-29 09:15' },
];

export function AdminShopPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(mockItems);
  const [activeTab, setActiveTab] = useState<'items' | 'records'>('items');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', points: 0, stock: 0 });

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i
    ));
  };

  const openForm = (item: ShopItem | null) => {
    setEditingItem(item);
    setFormData(item ? { name: item.name, description: item.description, points: item.points, stock: item.stock } : { name: '', description: '', points: 0, stock: 0 });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
    } else {
      setItems(prev => [...prev, { id: Date.now().toString(), ...formData, type: 'ticket', status: 'active' }]);
    }
    setShowForm(false);
  };

  return (
    <div>

      <div className="flex gap-2 p-4 border-b bg-white">
        {[{ key: 'items', label: '商品管理' }, { key: 'records', label: '兑换记录' }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'items' && (
        <div className="p-4">
          <button
            onClick={() => openForm(null)}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 mb-4"
          >
            <Plus className="w-5 h-5" /> 添加商品
          </button>

          <div className="space-y-3">
            {items.map(item => (
              <motion.div
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.status === 'active' ? '上架' : '下架'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-amber-600 font-bold">{item.points}积分</span>
                      <span className="text-gray-400">库存: {item.stock}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openForm(item)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(item.id)}
                  className={`mt-3 w-full py-2 rounded-lg text-sm font-medium ${
                    item.status === 'active'
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {item.status === 'active' ? '下架商品' : '上架商品'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="p-4 space-y-3">
          {mockRecords.map(record => (
            <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{record.user}</p>
                  <p className="text-sm text-gray-500">{record.item}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-600 font-bold">-{record.points}</p>
                  <p className="text-xs text-gray-400">{record.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">{editingItem ? '编辑商品' : '添加商品'}</h3>
            <div className="space-y-4">
              <input placeholder="商品名称" className="w-full px-4 py-3 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="商品描述" className="w-full px-4 py-3 border rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input type="number" placeholder="所需积分" className="w-full px-4 py-3 border rounded-lg" value={formData.points} onChange={e => setFormData({...formData, points: Number(e.target.value)})} />
              <input type="number" placeholder="库存数量" className="w-full px-4 py-3 border rounded-lg" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-100 rounded-lg">取消</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-blue-500 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
