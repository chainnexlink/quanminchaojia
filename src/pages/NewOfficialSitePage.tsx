import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Bot, Swords, Trophy, Shield, Users, Zap, ChevronRight, ChevronDown,
  Smartphone, Star, TrendingUp, MessageSquare, Award, Search,
  ArrowRight, Menu, X, Sparkles, Play, Target, Coins, Upload,
  Flame, Heart, Eye, Crown, Gift, CheckCircle, Lock, Bell,
  BarChart3, Bookmark, Share2, Flag, ShoppingBag, Wallet,
  Clock, Calendar, Medal, UserPlus, ThumbsUp, Image, FileText,
  Settings, HelpCircle, Mail, Phone, MapPin, Globe, Layers,
  Monitor, Cpu, Database, ShieldCheck, AlertTriangle, Ban
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function RevealOnScroll({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>{children}</motion.div>
  );
}

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let cur = 0;
    const step = Math.ceil(end / 40);
    const t = setInterval(() => { cur += step; if (cur >= end) { cur = end; clearInterval(t); } setVal(cur); }, 30);
    return () => clearInterval(t);
  }, [isInView, end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function SectionTitle({ tag, title, desc }: { tag: string; title: string; desc?: string }) {
  return (
    <RevealOnScroll className="text-center mb-12">
      <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">{tag}</span>
      <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-white">{title}</h2>
      {desc && <p className="mt-2 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">{desc}</p>}
    </RevealOnScroll>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Tabs                                                         */
/* ------------------------------------------------------------------ */
type PageTab = 'home' | 'product' | 'terms' | 'privacy' | 'about';

const tabItems: { key: PageTab; label: string }[] = [
  { key: 'home', label: '首页' },
  { key: 'product', label: '产品展示' },
  { key: 'terms', label: '用户协议' },
  { key: 'privacy', label: '隐私政策' },
  { key: 'about', label: '关于我们' },
];

/* ================================================================== */
/*  MAIN COMPONENT                                                    */
/* ================================================================== */
export function NewOfficialSitePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const switchTab = (tab: PageTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] text-slate-200 overflow-x-hidden">

      {/* ======= NAV ======= */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f0f14]/95 backdrop-blur-lg border-b border-amber-500/10 shadow-lg' : 'bg-[#0f0f14]/80 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => switchTab('home')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-amber-100">全民嘲家</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {tabItems.map(t => (
                <button key={t.key} onClick={() => switchTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-amber-500/15 text-amber-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                  {t.label}
                </button>
              ))}
              <button onClick={() => navigate('/onboarding')} className="ml-3 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all">
                免费体验
              </button>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-400">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-[#16161d]/98 backdrop-blur-xl px-4 pb-4 pt-2 border-t border-slate-800/50">
            {tabItems.map(t => (
              <button key={t.key} onClick={() => switchTab(t.key)}
                className={`block w-full text-left py-3 border-b border-slate-800/30 ${activeTab === t.key ? 'text-amber-300 font-semibold' : 'text-slate-300'}`}>
                {t.label}
              </button>
            ))}
            <button onClick={() => { setMenuOpen(false); navigate('/onboarding'); }} className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold">免费体验</button>
          </motion.div>
        )}
      </nav>

      {/* ======= CONTENT ======= */}
      <div className="pt-16">
        {activeTab === 'home' && <HomePage navigate={navigate} switchTab={switchTab} />}
        {activeTab === 'product' && <ProductPage navigate={navigate} />}
        {activeTab === 'terms' && <TermsPage />}
        {activeTab === 'privacy' && <PrivacyPage />}
        {activeTab === 'about' && <AboutPage />}
      </div>

      {/* ======= FOOTER ======= */}
      <footer className="border-t border-slate-800/40 bg-[#0a0a0f] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-200">全民嘲家</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">全民嘲家是一款AI驱动的辩论社交平台，致力于让每一场争论都有公正裁判，让每一个观点都值得被尊重。用户可以发起话题、选择阵营、投票辩论并赢取奖励。</p>
              <div className="mt-4 space-y-1.5">
                <p className="text-xs text-slate-500 flex items-center gap-2"><Phone className="w-3 h-3 text-amber-500" /> 客服热线：4006600783</p>
                <p className="text-xs text-slate-500 flex items-center gap-2"><Mail className="w-3 h-3 text-amber-500" /> 邮箱：support@yicaijingpin.com</p>
                <p className="text-xs text-slate-500 flex items-center gap-2"><MapPin className="w-3 h-3 text-amber-500" /> 广东省深圳市南山区科技园</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">产品功能</h4>
              <ul className="space-y-2">
                {['话题广场', '阵营PK投票', 'AI裁判系统', '积分商城', '赛季排名', '佐证上传'].map(t => (
                  <li key={t}><span onClick={() => switchTab('product')} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{t}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">服务支持</h4>
              <ul className="space-y-2">
                <li><span onClick={() => switchTab('terms')} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">用户协议</span></li>
                <li><span onClick={() => switchTab('privacy')} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">隐私政策</span></li>
                <li><span onClick={() => switchTab('about')} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">关于我们</span></li>
                <li><a href="tel:4006600783" className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">联系客服</a></li>
                <li><span onClick={() => navigate('/help')} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">帮助中心</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">关于</h4>
              <ul className="space-y-2">
                <li><span onClick={() => switchTab('about')} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">公司介绍</span></li>
                <li><span onClick={() => navigate('/changelog')} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">更新日志</span></li>
                <li><a href="tel:4006600783" className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">商务合作</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <p className="text-[11px] text-slate-600">Copyright &copy; {new Date().getFullYear()} 易采精品 (yicaijingpin.com) 版权所有</p>
                <span className="text-[11px] text-slate-600">客服热线：4006600783</span>
              </div>
              <div className="flex items-center gap-4">
                <span onClick={() => switchTab('terms')} className="text-[11px] text-slate-600 hover:text-slate-400 cursor-pointer">用户协议</span>
                <span onClick={() => switchTab('privacy')} className="text-[11px] text-slate-600 hover:text-slate-400 cursor-pointer">隐私政策</span>
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-600 hover:text-slate-400 cursor-pointer">粤ICP备2026015135号</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================== */
/*  HOME TAB                                                          */
/* ================================================================== */
function HomePage({ navigate, switchTab }: { navigate: (p: string) => void; switchTab: (t: PageTab) => void }) {
  const hotTopics = [
    { title: '豆腐脑甜咸之争', camps: ['甜党', '咸党'], votes: [12500, 9800], heat: 95 },
    { title: '粽子甜咸大战', camps: ['甜粽', '咸粽'], votes: [21000, 18500], heat: 92 },
    { title: '过年该回谁家', camps: ['回男方家', '回女方家'], votes: [15600, 17800], heat: 90 },
    { title: '南北供暖差异', camps: ['南方应供暖', '不需要供暖'], votes: [8900, 11200], heat: 88 },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative pt-16 lg:pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div onClick={() => switchTab('about')} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-6 cursor-pointer hover:bg-amber-500/20 transition-colors">
                <Flame className="w-3.5 h-3.5" /> AI驱动的辩论社交平台
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                <span onClick={() => switchTab('about')} className="text-white cursor-pointer hover:text-amber-100 transition-colors">全民嘲家</span>
                <br />
                <span onClick={() => switchTab('product')} className="bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                  让争论变得有价值
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                全民嘲家是一款创新的<span onClick={() => switchTab('product')} className="text-amber-400 cursor-pointer hover:underline">AI辩论社交应用</span>，用户可以就生活中的<span onClick={() => navigate('/home')} className="text-cyan-400 cursor-pointer hover:underline">争议话题</span>选择阵营、发表观点、<span onClick={() => switchTab('product')} className="text-emerald-400 cursor-pointer hover:underline">上传佐证</span>，并由<span onClick={() => switchTab('product')} className="text-violet-400 cursor-pointer hover:underline">8大AI模型</span>担任裁判公正评判。参与辩论还能赚取<span onClick={() => navigate('/shop')} className="text-pink-400 cursor-pointer hover:underline">辩豆奖励</span>，在<span onClick={() => navigate('/shop')} className="text-pink-400 cursor-pointer hover:underline">积分商城</span>兑换好礼。
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => navigate('/onboarding')} className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5">
                  立即体验 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => switchTab('product')} className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all">
                  <Layers className="w-5 h-5" /> 查看功能
                </button>
                <button onClick={() => navigate('/register')} className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-all">
                  <UserPlus className="w-5 h-5" /> 免费注册
                </button>
              </div>
            </motion.div>

            {/* App preview cards - all clickable */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
              {hotTopics.slice(0, 3).map((t, i) => {
                const total = t.votes[0] + t.votes[1];
                const pct = Math.round((t.votes[0] / total) * 100);
                return (
                  <div key={i} onClick={() => navigate('/home')} className="bg-[#1a1a24] border border-slate-800/60 rounded-2xl p-4 cursor-pointer hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-200 hover:text-amber-300 transition-colors">{t.title}</span>
                      <span onClick={(e) => { e.stopPropagation(); navigate('/ranking'); }} className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full flex items-center gap-1 hover:bg-red-500/30 cursor-pointer">
                        <Flame className="w-2.5 h-2.5" /> {t.heat}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-cyan-400 hover:underline cursor-pointer">{t.camps[0]}</span>
                      <span className="text-pink-400 hover:underline cursor-pointer">{t.camps[1]}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, delay: 0.5 + i * 0.15 }} className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-l-full" />
                      <motion.div initial={{ width: 0 }} animate={{ width: `${100 - pct}%` }} transition={{ duration: 1.2, delay: 0.5 + i * 0.15 }} className="h-full bg-gradient-to-l from-pink-400 to-pink-300 rounded-r-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>{t.votes[0].toLocaleString()} 票</span>
                      <span>{t.votes[1].toLocaleString()} 票</span>
                    </div>
                  </div>
                );
              })}
              <button onClick={() => navigate('/home')} className="w-full py-2.5 text-sm text-amber-400 hover:text-amber-300 bg-[#1a1a24] border border-slate-800/60 rounded-xl hover:border-amber-500/30 transition-colors flex items-center justify-center gap-1">
                查看全部热门话题 <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS - all clickable */}
      <section className="py-12 border-y border-slate-800/40 bg-[#13131a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { val: 500000, suf: '+', label: '累计注册用户', icon: Users, color: 'text-amber-400', action: () => switchTab('about') },
              { val: 1200000, suf: '+', label: '辩论场次', icon: Swords, color: 'text-cyan-400', action: () => navigate('/home') },
              { val: 3500000, suf: '+', label: '累计投票数', icon: Heart, color: 'text-pink-400', action: () => navigate('/ranking') },
              { val: 860000, suf: '+', label: '辩豆发放量', icon: Coins, color: 'text-emerald-400', action: () => navigate('/shop') },
            ].map((s, i) => (
              <RevealOnScroll key={i} delay={i * 0.08}>
                <div onClick={s.action} className="cursor-pointer hover:bg-slate-800/40 rounded-xl p-3 transition-colors group">
                  <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                  <div className={`text-2xl sm:text-3xl font-black ${s.color}`}><CountUp end={s.val} suffix={s.suf} /></div>
                  <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-300 transition-colors">{s.label} &rsaquo;</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* APP INTRO - all clickable */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle tag="App Introduction" title="全民嘲家 —— 应用介绍" desc="一款让争论变得有趣、有价值的AI辩论社交平台" />

          <div className="grid lg:grid-cols-2 gap-8">
            <RevealOnScroll>
              <div onClick={() => switchTab('product')} className="bg-[#1a1a24] border border-slate-800/50 rounded-2xl p-6 sm:p-8 h-full cursor-pointer hover:border-amber-500/20 transition-colors group">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Swords className="w-5 h-5 text-amber-400" /> 应用简介
                  <ChevronRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  「<span className="text-amber-300">全民嘲家</span>」是由<span onClick={(e) => { e.stopPropagation(); switchTab('about'); }} className="text-amber-400 hover:underline">易采精品团队</span>开发的一款创新社交应用程序。平台以生活中的<span className="text-cyan-300">争议话题</span>为核心，让用户通过选择阵营、发表观点、上传佐证等方式参与辩论对决。
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  应用独创性地引入了<span className="text-violet-300">AI裁判系统</span>，集成<span className="text-violet-300">DeepSeek</span>、<span className="text-violet-300">Qwen</span>、<span className="text-violet-300">GLM-4</span>等<span className="text-violet-300">8大</span>国内外领先的人工智能大语言模型，能够从逻辑性、证据充分性、表达质量等多个维度对辩论双方进行客观、公正的评判。
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  用户在参与辩论的过程中可以获得「<span className="text-pink-300">辩豆</span>」奖励，辩豆可在平台内<span className="text-pink-300">积分商城</span>兑换各类商品和服务，真正实现"有价值的争论"。
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <div className="space-y-4">
                {[
                  { icon: Target, color: 'from-cyan-500 to-blue-500', title: '应用定位', desc: '面向全年龄段用户的轻社交辩论平台，专注于生活争议话题的趣味化讨论', action: () => navigate('/home') },
                  { icon: Bot, color: 'from-violet-500 to-purple-500', title: '核心技术', desc: '基于多模型AI裁判系统，融合NLP自然语言处理技术，实现观点质量智能评估', action: () => switchTab('product') },
                  { icon: Shield, color: 'from-emerald-500 to-teal-500', title: '内容安全', desc: '多层内容审核机制（AI预审+人工复审），确保平台内容健康、文明、合规', action: () => switchTab('privacy') },
                  { icon: Users, color: 'from-amber-500 to-orange-500', title: '目标用户', desc: '18-45岁对社会话题感兴趣、喜欢表达观点的活跃社交用户群体', action: () => navigate('/register') },
                ].map((item, i) => (
                  <div key={i} onClick={item.action} className="bg-[#1a1a24] border border-slate-800/50 rounded-xl p-4 flex gap-4 cursor-pointer hover:border-amber-500/20 transition-colors group">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1">{item.title} <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" /></h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* CORE FEATURES OVERVIEW - all clickable */}
      <section className="py-16 lg:py-24 bg-[#13131a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle tag="Core Features" title="六大核心功能模块" desc="涵盖话题浏览、投票对决、AI评判、社交互动、积分奖励、赛季排名全链路" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: MessageSquare, color: 'from-cyan-500 to-blue-500', title: '1. 话题广场', desc: '海量争议话题实时更新，支持分类浏览（生活、文化、社会、情感等），用户可浏览热门话题、最新话题，也可自主发起话题供全平台讨论。', subs: [{ t: '话题分类筛选', p: '/home' }, { t: '热度排行榜', p: '/ranking' }, { t: '自主发起话题', p: '/publish' }, { t: '话题搜索功能', p: '/search' }] },
              { icon: Swords, color: 'from-amber-500 to-orange-500', title: '2. 阵营PK投票', desc: '每个话题设有正反两个阵营，用户选择支持方后一键投票。投票后可查看实时比分、双方阵营人数、票数趋势图等数据。', subs: [{ t: '一键阵营选择', p: '/home' }, { t: '实时票数展示', p: '/home' }, { t: '投票趋势分析', p: '/ranking' }, { t: '阵营切换机制', p: '/camp-switch' }] },
              { icon: Bot, color: 'from-violet-500 to-purple-500', title: '3. AI裁判系统', desc: '集成8大AI大模型（DeepSeek V3、Qwen 2.5、GLM-4等），用户可召唤AI裁判从逻辑性、证据性、表达力等维度客观评判双方观点。', subs: [{ t: '8大AI模型可选', p: '/home' }, { t: '多维度评判分析', p: '/home' }, { t: '战力值加成', p: '/ranking' }, { t: '每日免费召唤', p: '/daily-task' }] },
              { icon: Image, color: 'from-emerald-500 to-teal-500', title: '4. 佐证与互动', desc: '用户可在辩论区发表文字评论，上传图片佐证支持自己的观点。支持评论点赞、回复、佐证排名等社交互动功能。', subs: [{ t: '图文评论发表', p: '/home' }, { t: '佐证上传与审核', p: '/home' }, { t: '评论点赞回复', p: '/home' }, { t: '佐证质量排名', p: '/evidence-rank' }] },
              { icon: Coins, color: 'from-pink-500 to-rose-500', title: '5. 积分奖励体系', desc: '用户通过投票、评论、签到、邀请好友等行为获得辩豆奖励。辩豆可在积分商城兑换虚拟和实物商品，参与越多奖励越丰厚。', subs: [{ t: '多途径赚辩豆', p: '/rewards' }, { t: '积分商城兑换', p: '/shop' }, { t: '赛季排名奖励', p: '/ranking' }, { t: '每日签到奖励', p: '/daily-task' }] },
              { icon: Trophy, color: 'from-yellow-500 to-amber-500', title: '6. 赛季排名系统', desc: '按赛季周期进行排名竞赛，根据用户辩论表现计算段位等级。赛季末根据排名发放专属奖励，激励用户持续参与。', subs: [{ t: '段位等级体系', p: '/ranking' }, { t: '个人/阵营排行', p: '/ranking' }, { t: '赛季专属奖励', p: '/rewards' }, { t: '成就徽章系统', p: '/profile/achievements' }] },
            ].map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.06}>
                <div onClick={() => switchTab('product')} className="h-full bg-[#1a1a24] border border-slate-800/50 rounded-2xl p-5 hover:border-amber-500/20 transition-colors cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1">{item.title} <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" /></h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">{item.desc}</p>
                  <ul className="space-y-1.5">
                    {item.subs.map((s, j) => (
                      <li key={j} onClick={(e) => { e.stopPropagation(); navigate(s.p); }} className="flex items-center gap-2 text-xs text-slate-500 hover:text-amber-400 cursor-pointer transition-colors">
                        <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {s.t}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.3} className="text-center mt-10">
            <button onClick={() => switchTab('product')} className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-medium transition-all text-sm">
              查看完整功能详情 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </RevealOnScroll>
        </div>
      </section>

      {/* AI MODELS - all clickable */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle tag="AI Powered" title="8大AI裁判模型" desc="集成国内外顶尖大语言模型，多角度分析评判" />
          <RevealOnScroll>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'DeepSeek V3', desc: '深度求索研发，擅长逻辑推理和深度分析', strength: '逻辑分析' },
                { name: 'Qwen 2.5', desc: '阿里通义千问，中文理解能力出众', strength: '中文理解' },
                { name: 'GLM-4', desc: '智谱AI旗下模型，综合能力均衡', strength: '综合评判' },
                { name: 'LLaMA 3.3', desc: 'Meta开源模型，多语言跨文化视角', strength: '多元视角' },
                { name: 'Gemma 2', desc: 'Google轻量模型，快速响应效率高', strength: '快速响应' },
                { name: 'Phi-4', desc: '微软小参数模型，推理准确性高', strength: '精准推理' },
                { name: 'Mistral Large', desc: '法国Mistral研发，欧洲视角思辨', strength: '思辨能力' },
                { name: 'Doubao', desc: '字节跳动豆包模型，贴近年轻用户', strength: '年轻化表达' },
              ].map((m, i) => (
                <div key={i} onClick={() => switchTab('product')} className="bg-[#1a1a24] border border-slate-800/50 rounded-xl p-4 hover:border-violet-500/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors">{m.name}</span>
                    <ChevronRight className="w-3 h-3 text-slate-700 ml-auto group-hover:text-violet-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{m.desc}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-violet-500/15 text-violet-300 rounded-full">擅长: {m.strength}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="py-12 bg-[#13131a] border-y border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h3 className="text-lg font-bold text-white mb-6 text-center">快速导航</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: MessageSquare, label: '话题广场', path: '/home', color: 'text-cyan-400' },
              { icon: Search, label: '搜索话题', path: '/search', color: 'text-blue-400' },
              { icon: Trophy, label: '排行榜', path: '/ranking', color: 'text-amber-400' },
              { icon: ShoppingBag, label: '积分商城', path: '/shop', color: 'text-pink-400' },
              { icon: Wallet, label: '我的钱包', path: '/profile/wallet', color: 'text-emerald-400' },
              { icon: Star, label: '每日任务', path: '/daily-task', color: 'text-yellow-400' },
              { icon: Users, label: '邀请好友', path: '/invite', color: 'text-violet-400' },
              { icon: Bell, label: '消息通知', path: '/notifications', color: 'text-orange-400' },
              { icon: Bookmark, label: '我的收藏', path: '/my-favorites', color: 'text-red-400' },
              { icon: Settings, label: '账号设置', path: '/settings', color: 'text-slate-400' },
              { icon: HelpCircle, label: '帮助中心', path: '/help', color: 'text-teal-400' },
              { icon: FileText, label: '用户协议', path: '', color: 'text-slate-400', tab: 'terms' as PageTab },
            ].map((item, i) => (
              <div key={i} onClick={() => item.tab ? switchTab(item.tab) : navigate(item.path)}
                className="flex items-center gap-3 bg-[#1a1a24] border border-slate-800/50 rounded-xl p-3 cursor-pointer hover:border-amber-500/20 transition-colors group">
                <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0 group-hover:scale-110 transition-transform`} />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                <ChevronRight className="w-3 h-3 text-slate-700 ml-auto group-hover:text-amber-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <RevealOnScroll>
            <Crown className="w-12 h-12 text-amber-400 mx-auto mb-5" />
            <h2 onClick={() => switchTab('about')} className="text-2xl sm:text-3xl lg:text-4xl font-black text-white cursor-pointer hover:text-amber-100 transition-colors">立即加入全民嘲家</h2>
            <p className="mt-3 text-slate-400 max-w-md mx-auto">
              <span onClick={() => navigate('/register')} className="text-amber-400 cursor-pointer hover:underline">免费注册</span>，30秒上手，和<span onClick={() => switchTab('about')} className="text-amber-400 cursor-pointer hover:underline">50万用户</span>一起为观点而战。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/register')} className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5">
                免费注册 <ArrowRight className="w-5 h-5 inline ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/login')} className="px-8 py-3.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all">登录账号</button>
              <button onClick={() => navigate('/home')} className="px-8 py-3.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all">游客浏览</button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
              <span onClick={() => switchTab('terms')} className="cursor-pointer hover:text-amber-400 transition-colors">用户协议</span>
              <span className="text-slate-700">|</span>
              <span onClick={() => switchTab('privacy')} className="cursor-pointer hover:text-amber-400 transition-colors">隐私政策</span>
              <span className="text-slate-700">|</span>
              <span onClick={() => switchTab('about')} className="cursor-pointer hover:text-amber-400 transition-colors">关于我们</span>
              <span className="text-slate-700">|</span>
              <a href="tel:4006600783" className="cursor-pointer hover:text-amber-400 transition-colors">客服: 4006600783</a>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}

/* ================================================================== */
/*  PRODUCT PAGE (3-4级功能详情)                                       */
/* ================================================================== */
function ProductPage({ navigate }: { navigate: (p: string) => void }) {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  const modules = [
    {
      icon: MessageSquare, color: 'from-cyan-500 to-blue-500',
      title: '话题广场', subtitle: '海量话题，随时开吵',
      level2: [
        {
          title: '1.1 话题浏览与发现',
          desc: '话题广场是应用的核心入口，展示平台上所有正在进行的辩论话题。支持多种浏览方式和筛选条件，帮助用户快速找到感兴趣的话题。',
          level3: [
            { title: '热门话题排行', items: ['按热度值排序（综合投票数、评论数、分享数计算）', '实时更新热度榜单，每5分钟刷新一次', '支持查看24小时、本周、本月热度榜', '热度值超过90的话题标注"爆"标识'] },
            { title: '最新话题列表', items: ['按发布时间倒序展示最新话题', '支持下拉刷新加载最新内容', '新话题发布后30秒内全平台可见', '支持预览话题摘要和双方阵营'] },
            { title: '话题分类筛选', items: ['生活争议类（饮食习惯、生活方式等）', '文化差异类（南北差异、地域文化等）', '社会热点类（时事话题、社会现象等）', '情感关系类（家庭、友情、恋爱等）', '科技数码类（产品对比、技术选择等）', '娱乐休闲类（影视、游戏、音乐等）'] },
            { title: '搜索功能', items: ['支持关键词搜索话题标题和内容', '搜索结果按相关度和热度综合排序', '支持搜索历史记录保存', '热门搜索词推荐展示'] },
          ],
        },
        {
          title: '1.2 话题详情页',
          desc: '话题详情页是辩论的主战场，集成了投票、评论、佐证、AI裁判等全部核心功能。',
          level3: [
            { title: '话题信息展示', items: ['话题标题、描述、发起人信息', '双方阵营名称和各自的投票占比', '实时投票进度条（动态动画展示）', '话题热度值、总参与人数、评论数'] },
            { title: '阵营选择与投票', items: ['展示正反双方阵营及其支持理由', '用户点击选择支持的阵营后一键投票', '投票后可查看实时票数和百分比', '投票结果实时更新，无需刷新页面'] },
            { title: '评论辩论区', items: ['支持发表文字评论表达观点', '评论按热度/时间排序切换', '评论支持点赞、回复、举报', '评论显示用户阵营标识（蓝/红色标记）'] },
            { title: '分享与收藏', items: ['一键分享话题到社交平台', '收藏感兴趣的话题到个人收藏夹', '分享成功后获得额外辩豆奖励', '生成话题海报图片用于分享'] },
          ],
        },
        {
          title: '1.3 话题发起',
          desc: '用户可以自主发起话题，设定辩论双方阵营，提交审核通过后面向全平台用户开放讨论。',
          level3: [
            { title: '发起流程', items: ['填写话题标题（5-50字）', '编写话题详细描述（选填，最多500字）', '设定正反两个阵营的名称', '选择话题所属分类标签'] },
            { title: '辅助功能', items: ['话题模板库（提供热门话题格式参考）', '草稿箱自动保存（防止编辑丢失）', '图片上传（支持为话题配图）', '预览功能（发布前预览话题效果）'] },
            { title: '审核机制', items: ['AI自动预审（检测违规内容）', '人工复审（确保话题质量）', '审核通常在1小时内完成', '不通过会告知原因，支持修改重提'] },
          ],
        },
      ],
    },
    {
      icon: Bot, color: 'from-violet-500 to-purple-500',
      title: 'AI裁判系统', subtitle: '8大AI模型公正评判',
      level2: [
        {
          title: '2.1 AI模型介绍',
          desc: '平台集成了国内外8大顶尖人工智能大语言模型，每个模型都有独特的分析视角和评判风格。',
          level3: [
            { title: '国内模型', items: ['DeepSeek V3 —— 深度求索研发，逻辑推理能力强', 'Qwen 2.5 —— 阿里通义千问，中文理解最佳', 'GLM-4 —— 智谱AI，综合能力均衡稳定', 'Doubao —— 字节跳动豆包，贴近年轻用户语言风格'] },
            { title: '国际模型', items: ['LLaMA 3.3 —— Meta开源模型，多语言跨文化分析', 'Gemma 2 —— Google轻量模型，响应速度快', 'Phi-4 —— 微软小参数模型，推理准确性高', 'Mistral Large —— 法国研发，欧洲视角思辨'] },
          ],
        },
        {
          title: '2.2 裁判召唤流程',
          desc: '用户在话题详情页可主动召唤AI裁判对当前辩论进行评判。',
          level3: [
            { title: '召唤方式', items: ['在话题详情页点击"召唤AI裁判"按钮', '从8个AI模型中选择一个作为裁判', '每个用户每日可免费召唤3次AI裁判', '超出免费次数可使用辩豆购买额外次数'] },
            { title: '评判维度', items: ['逻辑性评分 —— 评估双方论点的逻辑严密程度', '证据性评分 —— 评估佐证材料的充分性和可信度', '表达力评分 —— 评估观点表达的清晰度和说服力', '综合评分 —— 加权计算得出最终评判结果'] },
            { title: '评判结果', items: ['生成详细的评判报告（含各维度得分）', 'AI裁判会指出双方观点的优劣', '评判结果为所在阵营增加战力值', '用户可对AI评判结果进行评价反馈'] },
          ],
        },
        {
          title: '2.3 公平保障机制',
          desc: '为确保评判的公正性，平台设计了多重保障机制。',
          level3: [
            { title: '技术保障', items: ['多模型交叉验证，避免单一模型偏差', 'AI模型定期更新迭代，保持评判质量', '评判算法透明化，用户可查看评分依据', '异常评判自动检测和人工干预'] },
            { title: '规则保障', items: ['同一话题同一用户召唤不同模型结果独立', '战力值加成有上限，防止刷分', '恶意调用行为自动识别和限制', '用户投诉评判结果的处理渠道'] },
          ],
        },
      ],
    },
    {
      icon: Image, color: 'from-emerald-500 to-teal-500',
      title: '佐证与社交互动', subtitle: '上传证据、深度讨论',
      level2: [
        {
          title: '3.1 佐证上传系统',
          desc: '用户可以为自己支持的阵营上传图文佐证材料，增强观点说服力。',
          level3: [
            { title: '上传功能', items: ['支持上传图片作为佐证（最多9张/条）', '佐证需附带文字说明（20-500字）', '支持从相册选取或直接拍照上传', '上传前支持图片裁剪和编辑'] },
            { title: '佐证展示', items: ['佐证按所属阵营分组展示', '支持按时间、热度、质量排序', '佐证详情页支持图片放大浏览', '优质佐证标注"精华"标识'] },
            { title: '佐证审核', items: ['AI自动检测违规图片和文字', '人工审核确保内容真实性', '审核不通过会告知具体原因', '支持申诉和重新提交'] },
          ],
        },
        {
          title: '3.2 社交互动功能',
          desc: '平台提供丰富的社交互动功能，让用户之间产生更多有价值的交流。',
          level3: [
            { title: '关注与粉丝', items: ['关注感兴趣的辩手，接收其动态推送', '粉丝列表和关注列表管理', '互相关注的用户标注"互关"标识', '个人主页展示粉丝数和关注数'] },
            { title: '消息通知', items: ['评论回复、点赞提醒实时推送', '系统公告和活动通知', '新关注用户提醒', '话题状态变更通知（如话题结束）'] },
            { title: '用户主页', items: ['展示用户个人信息和简介', '历史参与话题和发表观点记录', '获得的成就徽章展示', '段位等级和战力值展示'] },
            { title: '举报与反馈', items: ['支持举报违规内容（评论/佐证/话题）', '举报类型分类（色情、暴力、广告等）', '举报处理进度可追踪', '恶意举报行为反向处罚'] },
          ],
        },
      ],
    },
    {
      icon: Coins, color: 'from-pink-500 to-rose-500',
      title: '积分奖励体系', subtitle: '参与即赚，辩豆兑好礼',
      level2: [
        {
          title: '4.1 辩豆获取途径',
          desc: '辩豆是平台的虚拟积分货币，用户通过多种方式获取。',
          level3: [
            { title: '日常任务', items: ['每日签到 +5辩豆（连续签到递增至+15）', '每日首次投票 +2辩豆', '每日首条评论 +5辩豆', '观看激励视频 +3辩豆/次（每日上限5次）'] },
            { title: '参与奖励', items: ['投票参与 +2辩豆/次', '发表评论 +5辩豆/条', '上传佐证 +8辩豆/条', '召唤AI裁判 +10辩豆/次'] },
            { title: '社交奖励', items: ['邀请好友注册 +50辩豆/人', '好友首次投票额外 +20辩豆', '分享话题到社交平台 +3辩豆/次', '内容被标为精华 +30辩豆'] },
            { title: '赛季奖励', items: ['赛季排名Top10 额外奖池分配', '段位晋升奖励（白银+100、黄金+200...）', '赛季MVP特别奖励 +1000辩豆', '阵营胜利方全员奖励'] },
          ],
        },
        {
          title: '4.2 积分商城',
          desc: '辩豆可在积分商城兑换各类商品和虚拟服务。',
          level3: [
            { title: '虚拟商品', items: ['免广告卡（7天/30天）', '双倍辩豆卡（限时有效）', '专属头像框和个性标识', 'AI裁判额外召唤次数'] },
            { title: '实物商品', items: ['平台限定周边（T恤、马克杯等）', '数码配件（数据线、手机壳等）', '日用品和零食礼包', '节日限定礼盒'] },
            { title: '商城规则', items: ['商品定期上新，限量商品先到先得', '兑换后物流状态全程可追踪', '虚拟商品即时发放到账户', '实物商品支持填写收货地址'] },
          ],
        },
        {
          title: '4.3 辩豆使用规则',
          desc: '辩豆的获取、使用和管理遵循平台统一规则。',
          level3: [
            { title: '获取规则', items: ['辩豆通过投票、评论、签到、邀请等行为免费获取', '每日获取辩豆无上限，参与越多获得越多', '特殊活动期间辩豆奖励翻倍', '赛季排名靠前额外奖励辩豆'] },
            { title: '使用规则', items: ['辩豆可在积分商城兑换虚拟和实物商品', '兑换后不支持退换（质量问题除外）', '辩豆不可转让给其他用户', '账号注销后辩豆将被清零'] },
          ],
        },
      ],
    },
    {
      icon: Trophy, color: 'from-yellow-500 to-amber-500',
      title: '赛季与排名', subtitle: '段位竞技，荣耀追逐',
      level2: [
        {
          title: '5.1 赛季机制',
          desc: '平台按固定周期举办赛季竞赛，激励用户持续参与和提升。',
          level3: [
            { title: '赛季规则', items: ['每个赛季为期30天', '赛季开始时所有用户段位重置', '赛季期间通过参与辩论获得赛季积分', '赛季结束后根据积分排名发放奖励'] },
            { title: '段位体系', items: ['青铜 → 白银 → 黄金 → 铂金 → 钻石 → 大师 → 王者', '每个段位分为I、II、III三个小段', '晋升需达到对应段位的积分门槛', '段位标识在个人主页和评论中展示'] },
          ],
        },
        {
          title: '5.2 排行榜系统',
          desc: '多维度排行榜展示平台内最活跃和最优秀的辩手。',
          level3: [
            { title: '排行榜类型', items: ['个人积分榜 —— 按赛季积分排名', '战力值榜 —— 按AI裁判给予的战力排名', '人气榜 —— 按粉丝数和互动量排名', '阵营榜 —— 各阵营综合战力排名'] },
            { title: '排行奖励', items: ['日榜Top3获得专属标识（当日有效）', '周榜Top10获得额外辩豆奖励', '赛季总榜Top100进入荣誉殿堂', '排名第一获得限定"嘲王"称号'] },
          ],
        },
        {
          title: '5.3 成就系统',
          desc: '用户在平台使用过程中可解锁各类成就徽章。',
          level3: [
            { title: '成就类型', items: ['参与类 —— 首次投票、首次评论、首次发起话题等', '数量类 —— 累计投票100次、评论500条等', '品质类 —— 获得10次精华、AI高分评价等', '社交类 —— 粉丝破百、互关50人等'] },
            { title: '徽章展示', items: ['解锁的徽章在个人主页展示', '可选择最多3个徽章作为主力展示', '稀有徽章有特殊动效和边框', '集齐系列徽章获得额外奖励'] },
          ],
        },
      ],
    },
    {
      icon: Settings, color: 'from-slate-500 to-slate-600',
      title: '账户与安全', subtitle: '全方位保障用户安全',
      level2: [
        {
          title: '6.1 账户管理',
          desc: '提供完善的账户管理功能，用户可以自主管理个人信息和偏好设置。',
          level3: [
            { title: '个人信息', items: ['头像、昵称、个人简介编辑', '性别、生日等基础信息设置', '收货地址管理（用于商城兑换）', '账号绑定（手机号、邮箱）'] },
            { title: '偏好设置', items: ['通知推送开关管理', '话题分类偏好设置', '深色/浅色模式切换', '字体大小调整'] },
          ],
        },
        {
          title: '6.2 安全功能',
          desc: '多层安全保障机制，保护用户账户和数据安全。',
          level3: [
            { title: '账户安全', items: ['密码登录（支持密码修改）', '邮箱验证码登录', '异常登录检测和提醒', '账号锁定和解锁机制'] },
            { title: '内容安全', items: ['AI+人工双重内容审核', '敏感词过滤和替换', '图片违规内容自动检测', '用户举报快速响应处理'] },
            { title: '隐私保护', items: ['用户数据加密传输和存储', '个人信息展示可控（隐私设置）', '不向第三方出售用户数据', '支持用户数据导出和账号注销'] },
          ],
        },
      ],
    },
  ];

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle tag="Product Features" title="全民嘲家 · 产品功能详情"
          desc="全面展示应用的核心功能模块，从话题浏览到AI裁判，从积分奖励到赛季排名，六大模块覆盖完整用户体验链路" />

        {/* Module Accordion */}
        <div className="space-y-4">
          {modules.map((mod, mi) => (
            <RevealOnScroll key={mi} delay={mi * 0.05}>
              <div className="bg-[#1a1a24] border border-slate-800/50 rounded-2xl overflow-hidden">
                {/* Module Header */}
                <button
                  onClick={() => setExpandedModule(expandedModule === mi ? null : mi)}
                  className="w-full flex items-center gap-4 p-5 sm:p-6 hover:bg-slate-800/20 transition-colors text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center flex-shrink-0`}>
                    <mod.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                    <p className="text-sm text-slate-400">{mod.subtitle}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${expandedModule === mi ? 'rotate-180' : ''}`} />
                </button>

                {/* Module Content (Level 2-4) */}
                {expandedModule === mi && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 sm:px-6 pb-6 border-t border-slate-800/30">
                    {mod.level2.map((l2, l2i) => (
                      <div key={l2i} className="mt-6">
                        <h4 className="text-base font-bold text-amber-300 mb-2">{l2.title}</h4>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">{l2.desc}</p>

                        <div className="grid sm:grid-cols-2 gap-3">
                          {l2.level3.map((l3, l3i) => (
                            <div key={l3i} className="bg-[#14141c] border border-slate-800/30 rounded-xl p-4">
                              <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                {l3.title}
                              </h5>
                              <ul className="space-y-1.5">
                                {l3.items.map((item, ii) => (
                                  <li key={ii} className="text-xs text-slate-500 flex items-start gap-2 leading-relaxed">
                                    <CheckCircle className="w-3 h-3 text-emerald-500/60 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  TERMS PAGE                                                         */
/* ================================================================== */
function TermsPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">用户协议</h1>
        <p className="text-sm text-slate-500 mb-8">最近更新日期：2026年4月1日 &nbsp;|&nbsp; 生效日期：2026年4月1日</p>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mt-0">一、总则</h2>
            <p>1.1 欢迎您使用「全民嘲家」应用程序（以下简称"本应用"或"平台"）。本应用由易采精品（深圳）科技有限公司（以下简称"我们"）开发和运营。</p>
            <p>1.2 请您在使用本应用前仔细阅读并理解本用户协议（以下简称"本协议"）的全部内容。当您注册、登录或以其他方式使用本应用时，即表示您已阅读、理解并同意接受本协议的全部条款。</p>
            <p>1.3 如果您不同意本协议的任何条款，请立即停止使用本应用。我们保留随时修改本协议的权利，修改后的协议将在应用内公布并通知用户。</p>
            <p>1.4 如果您是未满18周岁的未成年人，请在法定监护人的陪同下阅读本协议，并在取得监护人同意的前提下使用本应用。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">二、账号注册与管理</h2>
            <p>2.1 用户需使用有效的电子邮箱地址注册账号，并设置符合安全要求的密码（不少于6位字符）。注册时需填写昵称（2-12个字符）。</p>
            <p>2.2 用户应确保注册信息的真实性、准确性和完整性。因提供虚假信息导致的任何后果由用户自行承担。</p>
            <p>2.3 用户有义务妥善保管账号和密码，因用户自身原因导致的账号安全问题，由用户自行承担。发现账号被盗用应立即联系客服。</p>
            <p>2.4 每位用户仅允许注册一个账号。禁止注册批量账号、买卖账号等行为。违反此规定的账号将被永久封禁。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">三、用户行为规范</h2>
            <p>3.1 用户在使用本应用时，须遵守中华人民共和国相关法律法规，不得利用本应用从事任何违法违规活动。</p>
            <p>3.2 用户发布的内容（包括但不限于话题、评论、佐证等）不得含有以下内容：</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-400">
              <li>违反国家法律法规的内容</li>
              <li>涉及色情、暴力、恐怖主义的内容</li>
              <li>侵犯他人知识产权、肖像权、隐私权的内容</li>
              <li>散布谣言、虚假信息的内容</li>
              <li>含有人身攻击、辱骂、歧视性言论的内容</li>
              <li>广告、垃圾信息、恶意营销的内容</li>
              <li>其他违反社会公序良俗的内容</li>
            </ul>
            <p>3.3 禁止使用任何技术手段进行刷票、刷评论、刷积分等作弊行为。一经发现，将扣除违规所得并视情节严重程度给予警告、限制功能或永久封禁等处罚。</p>
            <p>3.4 用户应尊重他人的观点和表达权利，理性辩论、文明交流。鼓励基于事实和逻辑的讨论，反对无理取闹和人身攻击。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">四、虚拟货币（辩豆）规则</h2>
            <p>4.1 辩豆是平台内的虚拟积分，通过参与辩论、完成任务等方式免费获取，不可通过人民币直接购买。</p>
            <p>4.2 辩豆可用于积分商城兑换商品和服务。兑换后不支持退换（商品质量问题除外）。</p>
            <p>4.3 辩豆仅限在平台积分商城内使用，不可转让、赠送或兑换为法定货币。</p>
            <p>4.4 通过作弊、漏洞利用等非正常途径获取的辩豆，平台有权予以追回并对相关账号进行处罚。</p>
            <p>4.5 用户账号被封禁或注销后，账号内的辩豆将被清零，平台不予退还。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">五、AI裁判服务</h2>
            <p>5.1 AI裁判功能基于第三方人工智能大语言模型提供，评判结果仅供参考和娱乐，不代表平台立场。</p>
            <p>5.2 AI裁判的评判结果受限于当前AI技术水平，可能存在不准确或有偏差的情况。用户应理性看待评判结果。</p>
            <p>5.3 每日免费AI裁判召唤次数以平台公告为准。超出免费次数后的使用需消耗辩豆。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">六、知识产权</h2>
            <p>6.1 本应用的所有内容（包括但不限于界面设计、图标、文案、代码等）的知识产权归平台所有。</p>
            <p>6.2 用户在平台发布的原创内容，知识产权归用户所有。但用户授予平台在全球范围内免费的、非独占的使用许可，用于平台的展示、推广和运营。</p>
            <p>6.3 未经平台书面许可，任何人不得以任何方式复制、转载、传播本应用的内容。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">七、免责声明</h2>
            <p>7.1 用户发布的内容不代表平台观点和立场。因用户发布内容引发的任何争议和法律责任由用户自行承担。</p>
            <p>7.2 因不可抗力（包括但不限于自然灾害、政策变化、网络故障等）导致的服务中断或数据丢失，平台不承担责任。</p>
            <p>7.3 平台有权根据运营需要调整功能和服务内容，包括但不限于修改辩豆获取规则、商城商品价格等。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">八、协议的终止</h2>
            <p>8.1 用户可随时通过注销账号的方式终止本协议。注销后账号数据将被删除且不可恢复。</p>
            <p>8.2 如用户严重违反本协议条款，平台有权单方面终止对该用户的服务并封禁其账号。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">九、其他</h2>
            <p>9.1 本协议的解释和执行适用中华人民共和国法律。因本协议引发的争议，双方应协商解决；协商不成的，提交平台所在地有管辖权的人民法院诉讼解决。</p>
            <p>9.2 本协议的任何条款如被认定为无效或不可执行，不影响其余条款的效力。</p>
            <p>9.3 如您对本协议有任何疑问，请通过客服热线 4006600783 或邮箱 support@yicaijingpin.com 联系我们。</p>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PRIVACY PAGE                                                       */
/* ================================================================== */
function PrivacyPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">隐私政策</h1>
        <p className="text-sm text-slate-500 mb-8">最近更新日期：2026年4月1日 &nbsp;|&nbsp; 生效日期：2026年4月1日</p>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mt-0">一、引言</h2>
            <p>易采精品（深圳）科技有限公司（以下简称"我们"）深知个人信息对您的重要性，我们将按照法律法规的规定，保护您的个人信息及隐私安全。我们制定本隐私政策并特别提示：希望您在使用「全民嘲家」应用及相关服务前仔细阅读并理解本隐私政策，以便做出适当的选择。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">二、我们收集的信息</h2>
            <p>2.1 <strong className="text-white">注册信息：</strong>当您注册全民嘲家账号时，我们会收集您的电子邮箱地址、密码（加密存储）和昵称。</p>
            <p>2.2 <strong className="text-white">个人资料信息：</strong>您可以选择性地填写头像、性别、生日、个人简介等信息。这些信息为非必填项。</p>
            <p>2.3 <strong className="text-white">使用信息：</strong>我们会收集您在使用应用过程中产生的信息，包括投票记录、评论内容、浏览历史、收藏记录等。</p>
            <p>2.4 <strong className="text-white">设备信息：</strong>为了保障应用的正常运行和安全性，我们可能会收集您的设备型号、操作系统版本、设备标识符、网络状态等信息。</p>
            <p>2.5 <strong className="text-white">积分信息：</strong>当您使用辩豆进行兑换时，我们会记录您的兑换记录和积分变动信息，用于保障交易准确性。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">三、信息的使用</h2>
            <p>我们收集的信息将用于以下目的：</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-400">
              <li>提供、维护和改进应用的核心功能和服务</li>
              <li>验证用户身份，保障账号安全</li>
              <li>处理辩豆兑换等虚拟物品交易请求</li>
              <li>向您推送个性化的话题推荐和通知消息</li>
              <li>进行数据统计和分析，优化产品体验</li>
              <li>预防、检测和调查欺诈、安全威胁等违法违规行为</li>
              <li>遵守适用法律法规的要求</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">四、信息的共享与披露</h2>
            <p>4.1 我们不会将您的个人信息出售给任何第三方。</p>
            <p>4.2 在以下情况下，我们可能会共享您的信息：</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-400">
              <li>获得您的明确同意后</li>
              <li>为完成积分商城兑换等服务，可能需要与合作方共享必要信息</li>
              <li>AI裁判功能可能需要将您的辩论内容（匿名化处理后）发送至AI模型服务商进行分析</li>
              <li>根据法律法规的要求或政府机关的强制性要求</li>
              <li>为保护我们、用户或公众的权益、财产或安全</li>
            </ul>
            <p>4.3 我们与AI模型服务商的数据交互均经过脱敏处理，不会传输可以识别您个人身份的信息。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">五、信息的存储与安全</h2>
            <p>5.1 您的个人信息存储在中华人民共和国境内的服务器上，存储期限为实现收集目的所必要的最短时间。</p>
            <p>5.2 我们采用业界标准的安全技术措施保护您的个人信息，包括但不限于数据加密传输（HTTPS/TLS）、数据库加密存储、访问控制、安全审计等。</p>
            <p>5.3 密码采用不可逆加密方式存储，即使数据库泄露也无法还原明文密码。</p>
            <p>5.4 尽管我们采取了上述安全措施，但请您理解互联网并非绝对安全的环境。我们建议您使用强密码，并定期更换密码。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">六、您的权利</h2>
            <p>6.1 <strong className="text-white">访问权：</strong>您可以在应用的"个人资料"页面查看和修改您的个人信息。</p>
            <p>6.2 <strong className="text-white">删除权：</strong>您可以删除您发布的内容（评论、佐证等），也可以通过注销账号来删除全部个人数据。</p>
            <p>6.3 <strong className="text-white">注销权：</strong>您可以在"设置"中申请注销账号。注销后，我们将在30个工作日内删除您的个人信息（法律法规要求保留的除外）。</p>
            <p>6.4 <strong className="text-white">通知管理：</strong>您可以在"通知设置"中自主管理各类推送通知的开关。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">七、未成年人保护</h2>
            <p>7.1 我们高度重视对未成年人个人信息的保护。如果您是未满14周岁的未成年人，请在法定监护人的指导下使用本应用，并请法定监护人仔细阅读本隐私政策。</p>
            <p>7.2 如果我们发现在未获得法定监护人同意的情况下收集了未成年人的个人信息，我们将尽快删除相关信息。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">八、隐私政策的更新</h2>
            <p>8.1 我们可能会不时更新本隐私政策。更新后的隐私政策将在应用内公布，重大变更将通过弹窗等方式通知您。</p>
            <p>8.2 更新后继续使用本应用即表示您同意接受更新后的隐私政策。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">九、联系我们</h2>
            <p>如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：</p>
            <ul className="list-none pl-0 space-y-1 text-slate-400">
              <li>公司名称：易采精品（深圳）科技有限公司</li>
              <li>客服热线：4006600783</li>
              <li>电子邮箱：support@yicaijingpin.com</li>
              <li>办公地址：广东省深圳市南山区科技园</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  ABOUT PAGE                                                         */
/* ================================================================== */
function AboutPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle tag="About Us" title="关于我们" desc="易采精品 —— 全民嘲家的开发者与运营者" />

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <RevealOnScroll>
            <div className="bg-[#1a1a24] border border-slate-800/50 rounded-2xl p-6 sm:p-8 h-full">
              <h3 className="text-xl font-bold text-white mb-4">公司介绍</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                易采精品（深圳）科技有限公司成立于深圳市南山区，是一家专注于互联网社交产品开发的创新型科技企业。公司致力于利用人工智能技术提升用户的社交体验，打造有价值、有温度的线上互动平台。
              </p>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                「全民嘲家」是公司旗下的核心产品，于2026年正式上线运营。产品以"让争论变得有价值"为理念，创新性地将AI大模型技术与辩论社交场景结合，为用户提供了一个理性讨论、公平对决的平台。
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                我们的团队由一群对社交产品充满热情的工程师、设计师和运营人员组成，团队成员来自互联网、人工智能等领域，具备丰富的产品开发和运营经验。
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="space-y-4">
              <div className="bg-[#1a1a24] border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">企业愿景</h3>
                <p className="text-sm text-slate-400 leading-relaxed">成为中国领先的AI社交平台，让每一个观点都值得被尊重，让每一场争论都有公正裁判。</p>
              </div>
              <div className="bg-[#1a1a24] border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">核心价值观</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Shield, label: '公平公正', desc: '多模型AI裁判保障评判公正' },
                    { icon: Users, label: '尊重多元', desc: '包容不同观点和表达方式' },
                    { icon: Sparkles, label: '技术驱动', desc: '持续引入前沿AI技术' },
                    { icon: Heart, label: '用户至上', desc: '用户体验是产品第一优先级' },
                  ].map((v, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <v.icon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-white">{v.label}</p>
                        <p className="text-xs text-slate-500">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#1a1a24] border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">发展历程</h3>
                <div className="space-y-3">
                  {[
                    { date: '2025年Q3', event: '项目立项，核心团队组建' },
                    { date: '2025年Q4', event: '产品原型设计，AI裁判系统研发' },
                    { date: '2026年Q1', event: '内测版本发布，种子用户测试' },
                    { date: '2026年Q2', event: '正式上线运营，持续迭代优化' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-amber-400 font-semibold">{m.date}</span>
                        <p className="text-sm text-slate-400">{m.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Contact Info */}
        <RevealOnScroll>
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/15 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">联系方式</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Globe, label: '官方网站', value: 'yicaijingpin.com', link: true },
                { icon: Phone, label: '客服热线', value: '4006600783' },
                { icon: Mail, label: '联系邮箱', value: 'support@yicaijingpin.com' },
                { icon: MapPin, label: '办公地址', value: '广东省深圳市南山区科技园' },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">{c.label}</p>
                    <p className="text-sm font-medium text-white">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-amber-500/10 text-center">
              <p className="text-xs text-slate-500">版权所有 &copy; {new Date().getFullYear()} 易采精品（深圳）科技有限公司 &nbsp;|&nbsp; 粤ICP备2026015135号</p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
