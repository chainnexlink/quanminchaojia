import { motion } from 'framer-motion';
import { Zap, Flame, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const topics = [
  { id: '1', title: '豆腐脑甜咸之争', desc: '你吃甜的还是咸的？', category: '饮食', north: 12580, south: 18920 },
  { id: '2', title: '冬天暖气 vs 空调', desc: '哪种取暖方式更舒服？', category: '气候', north: 23400, south: 15600 },
  { id: '3', title: '粽子口味大战', desc: '甜粽党 vs 咸粽党', category: '饮食', north: 8900, south: 21200 },
];

export function TopicList() {
  const navigate = useNavigate();
  const { voteTopic } = useStore();

  return (
    <div className="px-4 py-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {topics.map((topic, i) => {
          const total = topic.north + topic.south;
          const northPct = total > 0 ? (topic.north / total) * 100 : 50;
          
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/topic/${topic.id}`)}
              className="flex-shrink-0 w-72 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">{topic.category}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
              
              <h3 className="font-bold text-gray-900 mb-1">{topic.title}</h3>
              <p className="text-gray-500 text-xs mb-3">{topic.desc}</p>

              {/* PK Bar */}
              <div className="bg-gray-900 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <Zap size={14} className="text-white" />
                  </motion.div>
                  
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${northPct}%` }}
                        className="h-full bg-blue-500"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - northPct}%` }}
                        className="h-full bg-red-500"
                      />
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <Flame size={14} className="text-white" />
                  </motion.div>
                </div>

                <div className="flex justify-between text-xs">
                  <motion.span
                    key={topic.north}
                    initial={{ scale: 1.5, color: '#60a5fa' }}
                    animate={{ scale: 1, color: '#9ca3af' }}
                    className="text-gray-400 font-bold"
                  >
                    {topic.north.toLocaleString()}
                  </motion.span>
                  <motion.span
                    key={topic.south}
                    initial={{ scale: 1.5, color: '#f87171' }}
                    animate={{ scale: 1, color: '#9ca3af' }}
                    className="text-gray-400 font-bold"
                  >
                    {topic.south.toLocaleString()}
                  </motion.span>
                </div>
              </div>

              {/* Vote Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); voteTopic(topic.id, 0); }}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold"
                >
                  支持北方
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); voteTopic(topic.id, 1); }}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-bold"
                >
                  支持南方
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
