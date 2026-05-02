import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Trash2, CheckSquare, Square, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FavoriteItem {
  id: string;
  type: 'topic' | 'product';
  title: string;
  subtitle?: string;
  image?: string;
  savedAt: string;
}

const mockFavorites: FavoriteItem[] = [
  { id: '1', type: 'topic', title: '豆腐脑甜咸之争', subtitle: '3.2万人参与', savedAt: '2026-04-28' },
  { id: '2', type: 'product', title: '限定马克杯', subtitle: '500豆', savedAt: '2026-04-27' },
];

export function MyFavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>(mockFavorites);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    setFavorites(prev => prev.filter(f => !selectedIds.includes(f.id)));
    setSelectedIds([]);
    setIsEditMode(false);
  };

  const handleCancelFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">我的收藏</h1>
          <button
            onClick={() => {
              setIsEditMode(!isEditMode);
              setSelectedIds([]);
            }}
            className="ml-auto text-sm text-violet-400"
          >
            {isEditMode ? '完成' : '管理'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {favorites.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex items-center gap-3"
          >
            {isEditMode && (
              <button onClick={() => toggleSelect(item.id)} className="p-1">
                {selectedIds.includes(item.id) ? (
                  <CheckSquare className="w-5 h-5 text-violet-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </button>
            )}
            <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
              {item.type === 'topic' ? (
                <MessageSquare className="w-6 h-6 text-slate-400" />
              ) : (
                <Heart className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div className="flex-1 cursor-pointer" onClick={() => item.type === 'topic' ? navigate(`/topic/${item.id}`) : navigate('/shop')}>
              <p className="font-medium text-sm text-slate-200">{item.title}</p>
              <p className="text-xs text-slate-500">{item.subtitle}</p>
            </div>
            {!isEditMode && (
              <button
                onClick={() => handleCancelFavorite(item.id)}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {isEditMode && selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700/50">
          <button
            onClick={handleDelete}
            className="w-full py-3 bg-red-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            删除选中 ({selectedIds.length})
          </button>
        </div>
      )}
    </div>
  );
}
