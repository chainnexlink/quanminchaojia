import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface VoteAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  camp: 'north' | 'south';
  onConfirm: () => void;
}

export function VoteAnimation({ isOpen, onClose, camp, onConfirm }: VoteAnimationProps) {
  const [stage, setStage] = useState<'select' | 'animate' | 'success'>('select');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([]);

  useEffect(() => {
    if (stage === 'animate') {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: camp === 'north' ? '#3b82f6' : '#ef4444'
      }));
      setParticles(newParticles);
      setTimeout(() => {
        setStage('success');
        onConfirm();
      }, 1500);
    }
  }, [stage, camp, onConfirm]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      >
        {stage === 'select' && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 w-80 text-center"
          >
            <h3 className="text-xl font-bold mb-4">确认投票</h3>
            <p className="text-gray-600 mb-6">为{camp === 'north' ? '北方' : '南方'}阵营投票</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600"
              >
                取消
              </button>
              <button
                onClick={() => setStage('animate')}
                className={`flex-1 py-3 rounded-xl text-white font-bold ${
                  camp === 'north' ? 'bg-blue-500' : 'bg-red-500'
                }`}
              >
                确认
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'animate' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: (p.x - 50) * 4,
                  y: (p.y - 50) * 4,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute w-4 h-4 rounded-full"
                style={{ backgroundColor: p.color }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold ${
                camp === 'north' ? 'bg-blue-500' : 'bg-red-500'
              }`}
            >
              {camp === 'north' ? '北' : '南'}
            </motion.div>
          </div>
        )}

        {stage === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">投票成功!</h3>
            <p className="text-white/80">战力 +1</p>
            <button
              onClick={() => { setStage('select'); onClose(); }}
              className="mt-6 px-6 py-2 bg-white/20 rounded-full text-white"
            >
              关闭
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
