import { motion } from 'framer-motion';
import { Zap, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    desc: string;
    northPower: number;
    southPower: number;
    northAvatar?: string;
    southAvatar?: string;
  };
  index: number;
}

export function TopicCard({ topic, index }: TopicCardProps) {
  const navigate = useNavigate();
  const total = topic.northPower + topic.southPower;
  const northPct = total > 0 ? (topic.northPower / total) * 100 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">{topic.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{topic.desc}</p>
      </div>

      {/* Battle Arena */}
      <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-red-500/10" />

        {/* VS Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white font-black text-xs">VS</span>
          </motion.div>
        </div>

        {/* Avatars Battle */}
        <div className="flex items-center justify-between mb-4">
          {/* North */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                {topic.northAvatar ? (
                  <img src={topic.northAvatar} alt="" className="w-full h-full rounded-full" />
                ) : (
                  <Zap size={24} className="text-white" />
                )}
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                北
              </div>
            </div>
            <span className="text-blue-400 font-bold text-sm mt-2">{topic.northPower}</span>
          </motion.div>

          {/* South */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30"
              >
                {topic.southAvatar ? (
                  <img src={topic.southAvatar} alt="" className="w-full h-full rounded-full" />
                ) : (
                  <Flame size={24} className="text-white" />
                )}
              </motion.div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                南
              </div>
            </div>
            <span className="text-red-400 font-bold text-sm mt-2">{topic.southPower}</span>
          </motion.div>
        </div>

        {/* Progress Bar with Glow */}
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${northPct}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${100 - northPct}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="h-full bg-gradient-to-r from-red-600 to-red-400 absolute right-0 top-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
          </motion.div>
        </div>

        {/* Percentage */}
        <div className="flex justify-between text-xs mt-2">
          <span className="text-blue-400 font-medium">{northPct.toFixed(1)}%</span>
          <span className="text-red-400 font-medium">{(100 - northPct).toFixed(1)}%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/topic/${topic.id}`)}
          className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20"
        >
          支持北方
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/topic/${topic.id}`)}
          className="flex-1 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20"
        >
          支持南方
        </motion.button>
      </div>
    </motion.div>
  );
}
