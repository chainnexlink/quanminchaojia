import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MessageCircle, FileText, Phone, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqs = [
  { id: '1', question: '如何获得辩豆？', answer: '每日签到可获得5辩豆，参与投票获得2辩豆，发布话题获得10辩豆，邀请好友注册获得50辩豆。完成每日任务和观看广告也可以获得辩豆。' },
  { id: '2', question: '辩豆有什么用？', answer: '辩豆是平台积分，可以在积分商城兑换虚拟商品（免广告卡、双倍积分卡等）和实物商品（限定周边、数码配件等）。参与越多，辩豆越多！' },
  { id: '3', question: '如何切换阵营？', answer: '个人中心点击阵营标签，消耗100辩豆即可切换。每个赛季切换次数有限，请谨慎选择。' },
  { id: '4', question: '什么是AI裁判？', answer: 'AI裁判是智能评判系统，你可以在话题详情页召唤AI裁判分析你的观点。AI会给出评判结果并为优质观点所属阵营提供战力加成。每天有3次免费召唤机会。' },
  { id: '5', question: '如何发布话题？', answer: '点击底部导航栏中间的"+"按钮，填写话题标题、设置阵营选项后提交。话题经过审核后将显示在首页。热门话题的创建者可获得额外奖励。' },
  { id: '6', question: '什么是战力值？', answer: '战力值是你在平台上的综合实力评分。通过投票、评论、上传佐证、AI召唤等行为积累战力值。赛季结束时按照战力排名发放奖励。' },
  { id: '7', question: '辩豆可以兑换什么？', answer: '辩豆可在积分商城兑换免广告卡、双倍积分卡、专属头像框等虚拟商品，也可兑换限定周边、数码配件等实物商品。商品定期上新，敬请关注。' },
  { id: '8', question: '如何邀请好友？', answer: '进入"个人中心-邀请好友"，复制你的专属邀请链接或生成邀请海报分享给好友。好友注册成功后，你和好友都能获得辩豆奖励。' },
  { id: '9', question: '话题投票后可以修改吗？', answer: '话题投票后不可修改投票方向，但可以继续参与评论和上传佐证。请在投票前仔细了解各阵营观点。' },
  { id: '10', question: '如何举报不当内容？', answer: '在话题或评论详情页右上角点击"..."菜单，选择"举报"，选择举报原因并提交。我们会在24小时内处理。' },
  { id: '11', question: '积分商城的商品多久发货？', answer: '虚拟商品即时到账。实物商品在3-5个工作日内发货，物流信息可在"我的订单"中查看。' },
  { id: '12', question: '账号被封了怎么办？', answer: '如果账号被封禁，请联系客服申诉。客服会在1-3个工作日内处理。严重违规行为将永久封禁且不可申诉。' },
];

export function HelpPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs = faqs.filter(f => f.question.includes(searchQuery));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700/50 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-lg font-semibold text-slate-100">帮助反馈</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索问题"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: MessageCircle, label: '在线客服', color: 'bg-violet-500/20 text-violet-400', action: () => navigate('/support') },
            { icon: FileText, label: '意见反馈', color: 'bg-green-500/20 text-green-400', action: () => navigate('/support') },
            { icon: Phone, label: '联系我们', color: 'bg-pink-500/20 text-pink-400', action: () => navigate('/contact') },
          ].map(item => (
            <button key={item.label} onClick={item.action} className={`p-4 rounded-xl ${item.color} flex flex-col items-center gap-2 bg-slate-800/50 border border-slate-700/50`}>
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <h3 className="font-medium mb-3 flex items-center gap-2 text-slate-200">
          <HelpCircle className="w-4 h-4" /> 常见问题
        </h3>
        <div className="space-y-2">
          {filteredFaqs.map(faq => (
            <motion.div
              key={faq.id}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between"
              >
                <span className="font-medium text-sm text-slate-200">{faq.question}</span>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${expandedId === faq.id ? 'rotate-90' : ''}`} />
              </button>
              {expandedId === faq.id && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-400 mt-2 pt-2 border-t border-slate-700/50">
                  {faq.answer}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
