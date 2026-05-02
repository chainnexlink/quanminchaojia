import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Bot, Swords, Trophy, Shield, Users, Zap, ChevronRight,
  Smartphone, Star, TrendingUp, MessageSquare, Award,
  ArrowRight, Menu, X, Download, Sparkles, Monitor
} from 'lucide-react';
import heroImage from '../assets/images/hero-debate.png';
import aiFeatureImage from '../assets/images/feature-ai-judge.png';

/* ------------------------------------------------------------------ */
/*  Animated section wrapper                                          */
/* ------------------------------------------------------------------ */
function FadeInSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats counter                                                     */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(current);
    }, 20);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: Bot,
    title: 'AI 智能裁判',
    desc: '8 大顶尖 AI 模型实时评判辩论，公平公正，无偏见仲裁每一场对决。',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
  },
  {
    icon: Swords,
    title: '实时对战辩论',
    desc: '选择阵营、提交论点、上传证据，与对手展开激烈的观点碰撞。',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
  },
  {
    icon: Trophy,
    title: '赛季排名系统',
    desc: '按赛季统计战绩，赢取荣誉勋章，登顶排行榜成为最强辩手。',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
  },
  {
    icon: Shield,
    title: '证据举证系统',
    desc: '上传图文证据支持你的观点，AI 自动审核确保内容真实可信。',
    gradient: 'from-sky-500 to-blue-600',
    glow: 'shadow-sky-500/20',
  },
  {
    icon: Sparkles,
    title: '积分奖励体系',
    desc: '参与辩论赚取辩豆，兑换精品商品，每日任务和广告激励持续回馈。',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/20',
  },
  {
    icon: Users,
    title: '社交互动圈',
    desc: '关注好友、分享观点、评论互动，构建你的辩论社交圈。',
    gradient: 'from-indigo-500 to-violet-600',
    glow: 'shadow-indigo-500/20',
  },
];

const steps = [
  { num: '01', title: '选择话题', desc: '浏览热门辩题或发起你自己的话题', icon: MessageSquare },
  { num: '02', title: '加入阵营', desc: '选择你的立场，提交精彩论点与证据', icon: Swords },
  { num: '03', title: 'AI 裁判', desc: 'AI 实时分析双方论点，给出公正评判', icon: Bot },
  { num: '04', title: '赢取奖励', desc: '获胜赢取积分和荣誉，提升段位排名', icon: Trophy },
];

const stats = [
  { value: 500000, suffix: '+', label: '注册用户' },
  { value: 120000, suffix: '+', label: '辩论话题' },
  { value: 8, suffix: '', label: 'AI 裁判模型' },
  { value: 37, suffix: '', label: '话题分类' },
];

const aiModels = [
  'DeepSeek V3', 'Qwen 2.5', 'GLM-4', 'LLaMA 3.3',
  'Gemma 2', 'Phi-4', 'Mistral Large', 'Kimi K2.5', 'Doubao',
];

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */
export function OfficialSitePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
      {/* ==================== NAVBAR ==================== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-slate-950/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Swords className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                全民吵珈
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {[
                ['features', '核心功能'],
                ['how-it-works', '使用流程'],
                ['ai-models', 'AI 模型'],
                ['download', '下载'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('download')}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                立即下载
              </button>
              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-violet-500/40 text-violet-300 text-sm font-medium hover:bg-violet-500/10 hover:border-violet-400/60 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Monitor className="w-3.5 h-3.5" />
                网页版
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-100"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/60 px-4 pb-6 pt-2"
          >
            {[
              ['features', '核心功能'],
              ['how-it-works', '使用流程'],
              ['ai-models', 'AI 模型'],
              ['download', '下载'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="block w-full text-left py-3 text-slate-300 hover:text-slate-100 text-base border-b border-slate-800/40"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('download')}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium"
            >
              立即下载
            </button>
            <button
              onClick={() => navigate('/home')}
              className="mt-2 w-full py-3 rounded-xl border border-violet-500/40 text-violet-300 font-medium flex items-center justify-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              进入网页版
            </button>
          </motion.div>
        )}
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6">
                <Zap className="w-3.5 h-3.5" />
                AI 驱动的全新辩论体验
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-slate-100">让每一场辩论</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-300 bg-clip-text text-transparent">
                  都有公正裁判
                </span>
              </h1>
              <p className="mt-6 text-lg lg:text-xl text-slate-400 leading-relaxed max-w-lg">
                全民吵珈 —— 国内首款 AI 裁判辩论平台。
                8 大 AI 模型实时评判，万千网友热议对决，
                用智慧赢取荣誉与奖励。
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo('download')}
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  免费下载
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollTo('features')}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-slate-700 text-slate-300 hover:border-violet-500/50 hover:text-slate-100 transition-all duration-300"
                >
                  了解更多
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Monitor className="w-5 h-5 text-violet-400" />
                  进入网页版
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-violet-400" />
                </button>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-slate-950 bg-gradient-to-br from-violet-400 to-purple-500"
                      style={{ zIndex: 5 - i }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="ml-1 text-sm text-amber-300 font-medium">4.9</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">50 万+ 用户的选择</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/10 border border-slate-800/50">
                <img
                  src={heroImage}
                  alt="全民吵珈 AI 辩论平台"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-4 top-1/4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-violet-400" />
                  <span className="text-sm font-medium text-slate-200">AI 评判中...</span>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -right-4 bottom-1/4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium text-slate-200">+120 辩豆</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="py-16 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <FadeInSection key={i} delay={i * 0.1} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-2 text-sm text-slate-500 font-medium">{stat.label}</p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <p className="text-sm font-semibold text-violet-400 tracking-wider uppercase mb-3">Core Features</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100">
              重新定义辩论体验
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              AI 赋能、社交互动、奖励激励 —— 三位一体的全新辩论生态
            </p>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                <div className="group relative h-full bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 lg:p-8 hover:border-slate-700/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg ${f.glow} mb-5`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-3">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AI FEATURE SHOWCASE ==================== */}
      <section className="py-20 lg:py-28 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeInSection>
              <div className="relative rounded-3xl overflow-hidden border border-slate-800/50 shadow-2xl shadow-violet-500/5">
                <img
                  src={aiFeatureImage}
                  alt="AI 智能裁判系统"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-transparent" />
              </div>
            </FadeInSection>
            <FadeInSection delay={0.15}>
              <p className="text-sm font-semibold text-violet-400 tracking-wider uppercase mb-3">AI Judge System</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
                8 大 AI 模型
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  多维度智能评判
                </span>
              </h2>
              <p className="mt-5 text-lg text-slate-400 leading-relaxed">
                每一场辩论都由多个 AI 模型从逻辑严密性、论据充分度、表达说服力等维度独立评分，
                交叉验证确保评判结果公正客观。
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  '多模型交叉评判，消除单一模型偏见',
                  '实时逐论点分析，即时反馈评判结果',
                  '自动检测逻辑谬误，提升辩论质量',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-violet-400" />
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <p className="text-sm font-semibold text-violet-400 tracking-wider uppercase mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100">
              四步开启辩论之旅
            </h2>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-violet-500/30" />

            {steps.map((step, i) => (
              <FadeInSection key={i} delay={i * 0.12} className="relative text-center">
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-1 sm:right-[calc(50%-2.5rem)] w-6 h-6 rounded-full bg-slate-950 border-2 border-violet-500 flex items-center justify-center text-xs font-bold text-violet-400 z-20">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-100">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AI MODELS ==================== */}
      <section id="ai-models" className="py-20 lg:py-28 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <p className="text-sm font-semibold text-violet-400 tracking-wider uppercase mb-3">AI Models</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100">
              强大的 AI 裁判阵容
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              集成国内外顶级大语言模型，每位 AI 裁判各有所长
            </p>
          </FadeInSection>

          <FadeInSection>
            <div className="flex flex-wrap justify-center gap-4">
              {aiModels.map((model, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-6 py-3 bg-slate-800/60 border border-slate-700/50 rounded-full text-sm font-medium text-slate-300 hover:border-violet-500/50 hover:text-violet-300 transition-colors duration-300 cursor-default"
                >
                  <span className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-violet-400" />
                    {model}
                  </span>
                </motion.div>
              ))}
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="mt-12 bg-gradient-to-r from-violet-500/5 via-purple-500/10 to-violet-500/5 border border-violet-500/10 rounded-2xl p-8 text-center">
              <p className="text-slate-300 text-lg">
                所有 AI 评判均在<span className="text-violet-300 font-semibold">安全加密后端</span>运行，
                用户数据<span className="text-violet-300 font-semibold">零泄露</span>，API 密钥绝不暴露于前端
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ==================== DOWNLOAD CTA ==================== */}
      <section id="download" className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
              <Smartphone className="w-3.5 h-3.5" />
              支持 iOS & Android
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 leading-tight">
              现在就加入
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                全民吵珈
              </span>
            </h2>
            <p className="mt-5 text-lg text-slate-400 max-w-xl mx-auto">
              免费下载，立即体验 AI 裁判辩论的全新乐趣。
              与百万辩手一起，为你的观点而战。
            </p>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button className="group flex items-center gap-3 px-6 py-3.5 bg-slate-100 text-slate-900 rounded-xl hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/10 hover:-translate-y-0.5">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-60 leading-tight">Download on the</div>
                  <div className="text-base font-semibold leading-tight">App Store</div>
                </div>
              </button>

              <button className="group flex items-center gap-3 px-6 py-3.5 bg-slate-100 text-slate-900 rounded-xl hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/10 hover:-translate-y-0.5">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-60 leading-tight">GET IT ON</div>
                  <div className="text-base font-semibold leading-tight">Google Play</div>
                </div>
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/home')}
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Monitor className="w-5 h-5 text-violet-400" />
                不想下载？直接使用网页版
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-violet-400" />
              </button>
            </div>

            <div className="mt-10 inline-flex flex-col items-center">
              <div className="w-36 h-36 bg-white rounded-2xl p-2 shadow-xl">
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400">扫码下载</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">扫描二维码，直接下载 App</p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Swords className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-200">全民吵珈</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                AI 驱动的辩论社交平台，让每一个观点都值得被尊重，让每一场辩论都有公正裁判。
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">产品</h4>
              <ul className="space-y-2.5">
                {['核心功能', 'AI 裁判', '积分商城', '赛季排名'].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">支持</h4>
              <ul className="space-y-2.5">
                {['帮助中心', '用户协议', '隐私政策', '联系客服'].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">关于</h4>
              <ul className="space-y-2.5">
                {['关于我们', '加入团队', '新闻动态', '商务合作'].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              Copyright &copy; {new Date().getFullYear()} 易采精品 版权所有
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">用户协议</span>
              <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">隐私政策</span>
              <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">ICP 备案号</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
