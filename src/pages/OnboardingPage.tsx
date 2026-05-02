import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, Trophy, Wallet, Users, Zap, Gift,
  ChevronRight, CheckCircle, Flame, TrendingUp, Star,
  ArrowRight, Bot, Shield, Target, Coins, Award,
  Sparkles, Eye, ThumbsUp, Upload
} from 'lucide-react';

const slides = [
  {
    id: 1,
    title: '欢迎来到全民嘲家',
    subtitle: '让每一次争论都有价值',
    description: '全民嘲家是一个观点对战平台。你可以参与文化差异话题讨论，选择阵营投票、发表观点、上传佐证，在对决中赢取奖励。',
    icon: MessageCircle,
    color: 'from-violet-500 to-purple-500',
    features: [
      { icon: Eye, label: '浏览话题', desc: '发现热门文化争议话题' },
      { icon: ThumbsUp, label: '选阵营投票', desc: '为你支持的观点投票' },
      { icon: MessageCircle, label: '发表评论', desc: '说出你的观点和理由' },
    ]
  },
  {
    id: 2,
    title: '话题PK玩法',
    subtitle: '文化话题 VS 对战',
    description: '每个话题有两个或多个阵营。选择阵营后可以投票、评论、上传佐证图片来为你的阵营加油助力。',
    icon: Target,
    color: 'from-cyan-500 to-blue-500',
    features: [
      { icon: Shield, label: '选择阵营', desc: '支持你认同的观点阵营' },
      { icon: Upload, label: '上传佐证', desc: '图片/文字证明你的观点' },
      { icon: Flame, label: '热度排名', desc: '参与越多热度越高' },
    ]
  },
  {
    id: 3,
    title: 'AI智能裁判',
    subtitle: '公平公正的AI评判系统',
    description: '每天可以召唤AI裁判分析你的观点。AI会给出专业点评，并为优质观点所属阵营提供战力加成。支持多个AI模型选择。',
    icon: Bot,
    color: 'from-amber-500 to-orange-500',
    features: [
      { icon: Bot, label: '召唤AI', desc: '输入观点获得AI分析' },
      { icon: Zap, label: '战力加成', desc: '优质观点获得投票加成' },
      { icon: Star, label: '多AI模型', desc: '选择不同AI裁判评判' },
    ]
  },
  {
    id: 4,
    title: '赚取奖励',
    subtitle: '你的观点有价值',
    description: '发布热门话题、参与投票、完成日常任务、邀请好友都能获得辩豆积分奖励。辩豆可在商城兑换各种好礼。',
    icon: Wallet,
    color: 'from-emerald-500 to-green-500',
    features: [
      { icon: Coins, label: '赚辩豆', desc: '投票/评论/任务获得辩豆' },
      { icon: Gift, label: '商城兑换', desc: '辩豆兑换实物和虚拟商品' },
      { icon: TrendingUp, label: '赛季奖励', desc: '排名靠前赢取丰厚大奖' },
    ]
  },
  {
    id: 5,
    title: '赛季与排名',
    subtitle: '为荣誉而战',
    description: '每个赛季设有排行榜。参与话题积累战力值，赛季排名靠前可获得专属奖励。选择南方或北方阵营，为家乡荣誉而战！',
    icon: Trophy,
    color: 'from-pink-500 to-rose-500',
    features: [
      { icon: Award, label: '赛季排名', desc: '积累战力冲击排行榜' },
      { icon: Users, label: '阵营对战', desc: '南方vs北方，为荣誉而战' },
      { icon: Sparkles, label: '专属奖励', desc: '排名靠前赢取稀有奖励' },
    ]
  }
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    } else {
      navigate('/register');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const skip = () => {
    navigate('/register');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={skip}
          className="px-4 py-2 text-slate-400 text-sm hover:text-slate-200 transition-colors"
        >
          跳过
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-8 left-6 right-6 z-20">
        <div className="flex gap-1.5">
          {slides.map((_, index) => (
            <div key={index} className="flex-1 h-1 rounded-full bg-slate-700 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${slide.color}`}
                initial={false}
                animate={{ width: index < currentSlide ? '100%' : index === currentSlide ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pt-16 pb-4 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Icon */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-2xl`}
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold text-center text-slate-100 mb-1"
            >
              {slide.title}
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-center text-sm font-medium mb-4 bg-gradient-to-r ${slide.color} bg-clip-text text-transparent`}
            >
              {slide.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-center text-slate-400 text-sm mb-6 px-2 leading-relaxed"
            >
              {slide.description}
            </motion.p>

            {/* Feature Cards */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {slide.features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.08 }}
                    className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-xl p-3"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${slide.color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                      <FeatureIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200">{feature.label}</p>
                      <p className="text-xs text-slate-500">{feature.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6 pb-8">
        <div className="flex items-center justify-between gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-4 rounded-2xl transition-all ${
              currentSlide === 0 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className={`flex-1 py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r ${slide.color} shadow-lg`}
          >
            {currentSlide === slides.length - 1 ? (
              <>
                立即注册
                <CheckCircle className="w-5 h-5" />
              </>
            ) : (
              <>
                下一步
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>

        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-slate-500 text-xs">
            {currentSlide + 1} / {slides.length}
          </p>
          {currentSlide === slides.length - 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-slate-500"
            >
              已有账号？<span onClick={() => navigate('/login')} className="text-violet-400 cursor-pointer">登录</span>
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
