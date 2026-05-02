import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Zap, Flame, Crown } from 'lucide-react';

interface PKBattleEffectProps {
  northPower: number;
  southPower: number;
  isActive: boolean;
  onComplete?: () => void;
}

export function PKBattleEffect({ northPower, southPower, isActive, onComplete }: PKBattleEffectProps) {
  const [phase, setPhase] = useState<'idle' | 'charge' | 'clash' | 'result'>('idle');
  const [winner, setWinner] = useState<'north' | 'south' | null>(null);
  
  const total = northPower + southPower;
  const northPercent = total > 0 ? (northPower / total) * 100 : 50;
  
  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('charge');
      setTimeout(() => setPhase('clash'), 800);
      setTimeout(() => {
        setPhase('result');
        setWinner(northPower > southPower ? 'north' : 'south');
      }, 2000);
      setTimeout(() => {
        onComplete?.();
        setPhase('idle');
      }, 4000);
    }
  }, [isActive, northPower, southPower]);

  if (!isActive && phase === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      >
        <div className="w-full max-w-md px-6">
          {/* VS Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-white font-black text-2xl">VS</span>
            </div>
          </motion.div>

          {/* North Side */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: phase === 'clash' ? 20 : 0, 
              opacity: 1,
              scale: phase === 'result' && winner === 'north' ? 1.1 : 1
            }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div 
                animate={phase === 'charge' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Zap size={24} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <div className="text-blue-400 font-bold">北方阵营</div>
                <div className="text-white text-2xl font-black">{northPower.toLocaleString()}</div>
              </div>
              {winner === 'north' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Crown size={32} className="text-yellow-400" />
                </motion.div>
              )}
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${northPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 relative"
              >
                {phase === 'clash' && (
                  <motion.div
                    className="absolute right-0 top-0 bottom-0 w-4 bg-white/50"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Lightning Effect */}
          {phase === 'clash' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <svg width="200" height="200" viewBox="0 0 200 200">
                <motion.path
                  d="M100,20 L90,80 L110,80 L100,180"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  fill="none"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          )}

          {/* South Side */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ 
              x: phase === 'clash' ? -20 : 0, 
              opacity: 1,
              scale: phase === 'result' && winner === 'south' ? 1.1 : 1
            }}
            className="mt-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div 
                animate={phase === 'charge' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
              >
                <Flame size={24} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <div className="text-red-400 font-bold">南方阵营</div>
                <div className="text-white text-2xl font-black">{southPower.toLocaleString()}</div>
              </div>
              {winner === 'south' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Crown size={32} className="text-yellow-400" />
                </motion.div>
              )}
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${100 - northPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-red-500 to-red-400 relative"
              >
                {phase === 'clash' && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-4 bg-white/50"
                    animate={{ x: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Result Text */}
          {phase === 'result' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mt-8"
            >
              <div className={`text-3xl font-black ${winner === 'north' ? 'text-blue-400' : 'text-red-400'}`}>
                {winner === 'north' ? '北方阵营获胜！' : '南方阵营获胜！'}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
