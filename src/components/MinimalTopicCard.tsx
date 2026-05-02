import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';

interface MinimalTopicCardProps {
  topic: {
    id: string;
    title: string;
    desc: string;
    northPower: number;
    southPower: number;
    likes?: number;
  };
  onVote: (camp: 'north' | 'south') => void;
}

export function MinimalTopicCard({ topic, onVote }: MinimalTopicCardProps) {
  const [hovered, setHovered] = useState(false);
  const total = topic.northPower + topic.southPower;
  const northPct = total > 0 ? (topic.northPower / total) * 100 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden"
    >
      {/* Subtle gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-gray-200 to-red-400" />

      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{topic.title}</h3>
        <p className="text-gray-500 text-sm mt-1">{topic.desc}</p>
      </div>

      {/* Minimal Progress Bar */}
      <div className="relative mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>北 {topic.northPower}</span>
          <span>南 {topic.southPower}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${northPct}%` }}
            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 relative"
          >
            {hovered && (
              <motion.div
                className="absolute inset-0 bg-white/40"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Micro Vote Buttons */}
      <div className="flex gap-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onVote('north')}
          className="flex-1 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          支持北方
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onVote('south')}
          className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
        >
          支持南方
        </motion.button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between text-gray-400 text-sm">
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ scale: 1.1 }} className="flex items-center gap-1 hover:text-red-500">
            <Heart size={16} />
            <span>{topic.likes || 0}</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} className="flex items-center gap-1 hover:text-blue-500">
            <MessageCircle size={16} />
            <span>评论</span>
          </motion.button>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} className="hover:text-green-500">
          <Share2 size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}
