import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Zap, Flame, Crown, Sparkles } from 'lucide-react';

interface ImmersiveTopicProps {
  topic: {
    id: string;
    title: string;
    desc: string;
    northPower: number;
    southPower: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ImmersiveTopic({ topic, isOpen, onClose }: ImmersiveTopicProps) {
  const [phase, setPhase] = useState<'idle' | 'battle' | 'result'>('idle');
  const [winner, setWinner] = useState<'north' | 'south' | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([]);

  const total = topic.northPower + topic.southPower;
  const northPercent = total > 0 ? (topic.northPower / total) * 100 : 50;

  useEffect(() => {
    if (isOpen && phase === 'idle') {
      setPhase('battle');
      const p = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: i % 2 === 0 ? '#3b82f6' : '#ef4444'
      }));
      setParticles(p);
      
      setTimeout(() => {
        setPhase('result');
        setWinner(topic.northPower > topic.southPower ? 'north' : 'south');
      }, 3000);
    }
  }, [isOpen, topic, phase]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        
        {/* Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: p.id * 0.1 }}
          />
        ))}

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-6">
          {/* Title */}
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-black text-white mb-8 text-center"
          >
            {topic.title}
          </motion.h2>

          {/* Battle Arena */}
          <div className="w-full max-w-md">
            {/* North */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-4 mb-6"
            >
              <motion.div
                animate={phase === 'battle' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50"
              >
                <Zap size={32} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <div className="text-blue-400 font-bold text-lg">北方阵营</div>
                <div className="text-white text-2xl font-black">{topic.northPower.toLocaleString()}</div>
              </div>
              {winner === 'north' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Crown size={40} className="text-yellow-400" />
                </motion.div>
              )}
            </motion.div>

            {/* Progress Bar */}
            <div className="h-6 bg-gray-800 rounded-full overflow-hidden relative mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${northPercent}%` }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${100 - northPercent}%` }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-red-600 to-red-400 absolute right-0"
              />
              
              {/* VS Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black px-4 py-1 rounded-full text-sm"
                >
                  VS
                </motion.div>
              </div>
            </div>

            {/* South */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-4"
            >
              <motion.div
                animate={phase === 'battle' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50"
              >
                <Flame size={32} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <div className="text-red-400 font-bold text-lg">南方阵营</div>
                <div className="text-white text-2xl font-black">{topic.southPower.toLocaleString()}</div>
              </div>
              {winner === 'south' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Crown size={40} className="text-yellow-400" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Result */}
          {phase === 'result' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1 }}
                className="text-6xl mb-4"
              >
                <Sparkles className="text-yellow-400 mx-auto" size={64} />
              </motion.div>
              <div className={`text-2xl font-black ${winner === 'north' ? 'text-blue-400' : 'text-red-400'}`}>
                {winner === 'north' ? '北方阵营领先！' : '南方阵营领先！'}
              </div>
            </motion.div>
          )}

          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setPhase('idle'); onClose(); }}
            className="mt-8 px-8 py-3 bg-white/20 rounded-full text-white font-medium"
          >
            关闭
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
