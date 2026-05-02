import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MessageSquare, Share2, Heart } from 'lucide-react';
import { useState } from 'react';

interface TopicDetailModalProps {
  topic: {
    id: number;
    title: string;
    desc: string;
    category: string;
    north: number;
    south: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const comments = [
  { id: 1, user: '用户A', content: '支持北方！', camp: 'north', likes: 10 },
  { id: 2, user: '用户B', content: '南方更好', camp: 'south', likes: 8 },
];

export function TopicDetailModal({ topic, isOpen, onClose }: TopicDetailModalProps) {
  const [camp, setCamp] = useState<'north' | 'south' | null>(null);
  if (!topic) return null;

  const total = topic.north + topic.south;
  const northPct = total > 0 ? (topic.north / total) * 100 : 50;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white w-full max-w-md rounded-t-2xl p-4 max-h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{topic.title}</h3>
              <button onClick={onClose}><X size={20} /></button>
            </div>

            <p className="text-gray-500 text-sm mb-4">{topic.desc}</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-600 font-bold">北方 {topic.north}</span>
                <span className="text-red-600 font-bold">南方 {topic.south}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                <motion.div initial={{ width: 0 }} animate={{ width: `${northPct}%` }} className="h-full bg-blue-500" />
                <motion.div initial={{ width: 0 }} animate={{ width: `${100 - northPct}%` }} className="h-full bg-red-500" />
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCamp('north')}
                className={`flex-1 py-3 rounded-xl font-bold ${camp === 'north' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}
              >
                支持北方
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCamp('south')}
                className={`flex-1 py-3 rounded-xl font-bold ${camp === 'south' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'}`}
              >
                支持南方
              </motion.button>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-bold mb-2">评论</h4>
              {comments.map(c => (
                <div key={c.id} className="flex gap-2 mb-2">
                  <span className="font-medium">{c.user}</span>
                  <span className={`text-xs px-1 rounded ${c.camp === 'north' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                    {c.camp === 'north' ? '北' : '南'}
                  </span>
                  <span className="text-gray-600">{c.content}</span>
                </div>
              ))}
            </div>

            <motion.button whileTap={{ scale: 0.95 }} className="w-full mt-4 py-3 border rounded-xl flex items-center justify-center gap-2">
              <Share2 size={18} /> 分享
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
