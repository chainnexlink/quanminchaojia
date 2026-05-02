import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, MapPin, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  { id: '1', name: '张三', phone: '138****8888', address: '北京市朝阳区xxx街道123号', isDefault: true },
  { id: '2', name: '李四', phone: '139****9999', address: '上海市浦东新区xxx路456号', isDefault: false },
];

export function SettingsAddressPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', address: '' });

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleAdd = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) return;
    const addr: Address = {
      id: Date.now().toString(),
      name: newAddress.name,
      phone: newAddress.phone,
      address: newAddress.address,
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, addr]);
    setNewAddress({ name: '', phone: '', address: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">收货地址</h1>
      </div>

      <div className="p-4 space-y-3">
        {addresses.map((addr, index) => (
          <motion.div
            key={addr.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-200">{addr.name}</span>
                <span className="text-slate-400 text-sm">{addr.phone}</span>
              </div>
              <button onClick={() => handleDelete(addr.id)} className="p-1 text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-400 text-sm mb-3">{addr.address}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleSetDefault(addr.id)}
                className={`flex items-center gap-1 text-sm ${addr.isDefault ? 'text-violet-400' : 'text-slate-500'}`}
              >
                <Check className={`w-4 h-4 ${addr.isDefault ? 'opacity-100' : 'opacity-0'}`} />
                {addr.isDefault ? '默认地址' : '设为默认'}
              </button>
            </div>
          </motion.div>
        ))}

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 border border-dashed border-slate-600 rounded-xl text-slate-400 flex items-center justify-center gap-2 hover:border-slate-500 hover:text-slate-300"
          >
            <Plus className="w-5 h-5" /> 添加新地址
          </button>
        )}

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
          >
            <h3 className="font-medium mb-4 text-slate-200">添加新地址</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="收货人姓名"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500"
              />
              <input
                type="text"
                placeholder="手机号码"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500"
              />
              <textarea
                placeholder="详细地址"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 resize-none"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 bg-slate-700 rounded-lg text-sm text-slate-200"
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2 bg-violet-500 text-white rounded-lg text-sm"
              >
                保存
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {addresses.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-slate-500">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p>暂无收货地址</p>
        </div>
      )}
    </div>
  );
}
