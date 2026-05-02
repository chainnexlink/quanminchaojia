import { motion } from 'framer-motion';
import { ArrowLeft, Check, MapPin, Shield, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export function CampSwitchPage() {
  const navigate = useNavigate();
  const { user, switchCamp } = useStore();

  const camps = [
    {
      id: 'north',
      name: '北方阵营',
      icon: Shield,
      traits: ['豪爽直率', '爱吃咸口', '暖气护体'],
      regions: '东北、华北、西北'
    },
    {
      id: 'south',
      name: '南方阵营',
      icon: Swords,
      traits: ['细腻温和', '爱吃甜口', '抗寒体质'],
      regions: '华东、华南、西南'
    }
  ];

  const handleSwitch = () => {
    switchCamp();
    setTimeout(() => navigate('/profile'), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="font-bold text-lg text-white">切换阵营</h1>
      </div>

      <div className="p-4">
        <p className="text-sm text-slate-400 text-center mb-6">
          选择你的阵营，为家乡而战！可随时切换
        </p>

        <div className="space-y-4">
          {camps.map((camp, index) => {
            const isActive = user?.camp === camp.id;
            const isNorth = camp.id === 'north';
            const Icon = camp.icon;

            return (
              <motion.div
                key={camp.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => !isActive && handleSwitch()}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                  isActive
                    ? isNorth
                      ? 'border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/10'
                      : 'border-pink-500 bg-gradient-to-br from-pink-500/20 to-rose-500/10'
                    : 'border-slate-700 bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        isNorth 
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-500' 
                          : 'bg-gradient-to-br from-pink-400 to-rose-500'
                      }`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className={`font-bold text-xl ${
                        isNorth ? 'text-cyan-400' : 'text-pink-400'
                      }`}>
                        {camp.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{camp.regions}</p>
                    </div>
                  </div>
                  {isActive && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isNorth ? 'bg-cyan-500' : 'bg-pink-500'
                      }`}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-2">
                  {camp.traits.map((trait, i) => (
                    <motion.span
                      key={trait}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        isNorth
                          ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                          : 'bg-pink-400/20 text-pink-300 border border-pink-400/30'
                      }`}
                    >
                      {trait}
                    </motion.span>
                  ))}
                </div>
                
                {!isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-3 border-t border-slate-700/50"
                  >
                    <span className={`text-sm font-medium ${
                      isNorth ? 'text-cyan-400' : 'text-pink-400'
                    }`}>
                      点击切换到此阵营 →
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-violet-400" />
            <span className="font-medium text-slate-200">阵营说明</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            阵营切换不受定位限制，可随时自由更换。选择阵营后将参与对应阵营的PK对战，为家乡荣誉而战！
          </p>
        </motion.div>
      </div>
    </div>
  );
}
