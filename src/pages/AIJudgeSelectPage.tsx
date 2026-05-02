import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Zap,
  Crown,
  CheckCircle,
  Coins,
  Bot,
  ChevronDown,
  ChevronUp,
  Cpu,
  Loader2
} from 'lucide-react';
import { defaultAIModels, AIModelConfig, getSavedAIModels } from '../services/aiModels';
import { callAIJudge, AIJudgeResponse } from '../services/aiService';
import { useStore } from '../store';

interface AIJudgePersonality {
  id: string;
  name: string;
  avatar: string;
  description: string;
  style: 'balanced' | 'strict' | 'humorous' | 'wise' | 'enthusiastic' | 'analytical';
  styleName: string;
  cost: number;
  features: string[];
  color: string;
  popular?: boolean;
}

const aiPersonalities: AIJudgePersonality[] = [
  {
    id: 'balanced',
    name: '公正仲裁者',
    avatar: '⚖️',
    description: '中立客观，善于发现双方观点中的合理之处',
    style: 'balanced',
    styleName: '理性分析型',
    cost: 20,
    features: ['中立评判', '逻辑分析', '公平裁决'],
    color: 'from-blue-500 to-cyan-500',
    popular: true
  },
  {
    id: 'strict',
    name: '严厉审判官',
    avatar: '👨‍⚖️',
    description: '言辞犀利，直击要害，不留情面',
    style: 'strict',
    styleName: '犀利批判型',
    cost: 30,
    features: ['犀利点评', '直击要害', '高战力加成'],
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'humorous',
    name: '幽默调解员',
    avatar: '🎭',
    description: '风趣幽默，用轻松的方式化解争论',
    style: 'humorous',
    styleName: '幽默风趣型',
    cost: 25,
    features: ['幽默点评', '轻松化解', '额外积分'],
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'wise',
    name: '智慧长者',
    avatar: '🧙‍♂️',
    description: '经验丰富，从历史和文化角度分析',
    style: 'wise',
    styleName: '睿智洞察型',
    cost: 35,
    features: ['深度分析', '文化视角', '超高加成'],
    color: 'from-violet-500 to-purple-500',
    popular: true
  },
  {
    id: 'enthusiastic',
    name: '热血评论员',
    avatar: '🔥',
    description: '激情澎湃，为你的阵营加油助威',
    style: 'enthusiastic',
    styleName: '激情助威型',
    cost: 20,
    features: ['阵营偏向', '激情点评', '士气加成'],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'analytical',
    name: '数据分析师',
    avatar: '📊',
    description: '用数据和事实说话，理性客观',
    style: 'analytical',
    styleName: '数据驱动型',
    cost: 25,
    features: ['数据分析', '事实依据', '精准预测'],
    color: 'from-emerald-500 to-teal-500'
  }
];

export function AIJudgeSelectPage() {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const { user, topics } = useStore();
  
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(defaultAIModels[0].id);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIJudgeResponse | null>(null);
  const [models, setModels] = useState<AIModelConfig[]>(defaultAIModels);

  useEffect(() => {
    const saved = getSavedAIModels();
    if (saved.length > 0) {
      setModels(saved);
    }
  }, []);

  const topic = topics.find(t => t.id === topicId);
  const selectedPersonalityData = aiPersonalities.find(p => p.id === selectedPersonality);
  const selectedModelData = models.find(m => m.id === selectedModel);

  const handleSelectPersonality = (personalityId: string) => {
    setSelectedPersonality(personalityId);
    setShowConfirm(true);
  };

  const handleCallAI = async () => {
    if (!selectedPersonalityData || !selectedModelData || !topic) return;
    
    setLoading(true);
    try {
      const request = {
        topicTitle: topic.title,
        topicDesc: '',
        camp1Name: topic.camps?.[0] || '北方',
        camp2Name: topic.camps?.[1] || '南方',
        camp1Posts: [] as string[],
        camp2Posts: [] as string[],
        userContent: '请评判这个话题',
        judgeStyle: selectedPersonalityData.style
      };

      const response = await callAIJudge(selectedModelData, request);
      setResult(response);
    } catch (error) {
      console.error('AI调用失败:', error);
      // 使用模拟数据作为后备
      const mockResponse = await import('../services/aiService').then(m => 
        m.mockCallAIJudge({
          topicTitle: topic.title,
          topicDesc: '',
          camp1Name: topic.camps?.[0] || '北方',
          camp2Name: topic.camps?.[1] || '南方',
          camp1Posts: [],
          camp2Posts: [],
          userContent: '',
          judgeStyle: selectedPersonalityData.style
        })
      );
      setResult(mockResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResult = () => {
    setResult(null);
    setShowConfirm(false);
    setSelectedPersonality(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-700/50 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h1 className="font-semibold text-lg text-slate-100">选择AI裁判</h1>
      </div>

      <div className="p-4">
        {/* Model Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-medium text-slate-200">选择AI模型</span>
            </div>
            <button 
              onClick={() => setShowModelSelect(!showModelSelect)}
              className="flex items-center gap-1 text-xs text-violet-400"
            >
              {showModelSelect ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showModelSelect ? '收起' : '切换'}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-100">{selectedModelData?.name}</p>
              <p className="text-xs text-slate-400">{models.filter(m => m.enabled).length} 个模型可用</p>
            </div>
          </div>

          {showModelSelect && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-slate-700/50 space-y-2"
            >
              {models.filter(m => m.enabled).map(model => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setShowModelSelect(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    selectedModel === model.id 
                      ? 'bg-violet-500/20 border border-violet-500/50' 
                      : 'bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    selectedModel === model.id ? 'bg-violet-500 text-white' : 'bg-slate-600 text-slate-300'
                  }`}>
                    {model.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-200">{model.name}</p>
                    <p className="text-xs text-slate-500">{model.model}</p>
                  </div>
                  {selectedModel === model.id && (
                    <CheckCircle className="w-5 h-5 text-violet-400" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100">召唤AI裁判</h2>
              <p className="text-xs text-slate-400">选择AI性格和模型，获得专业评判和战力加成</p>
            </div>
          </div>
        </motion.div>

        {/* AI Personalities Grid */}
        <div className="grid grid-cols-2 gap-3">
          {aiPersonalities.map((personality, index) => (
            <motion.button
              key={personality.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectPersonality(personality.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                selectedPersonality === personality.id
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              {/* Popular Badge */}
              {personality.popular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  热门
                </div>
              )}

              {/* Avatar */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${personality.color} flex items-center justify-center text-2xl mb-3`}>
                {personality.avatar}
              </div>

              {/* Name & Style */}
              <h3 className="font-bold text-slate-100 mb-1">{personality.name}</h3>
              <p className={`text-xs bg-gradient-to-r ${personality.color} bg-clip-text text-transparent mb-2`}>
                {personality.styleName}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{personality.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-3">
                {personality.features.map((feature, i) => (
                  <span key={i} className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Cost */}
              <div className="flex items-center gap-1 text-amber-400">
                <Coins className="w-4 h-4" />
                <span className="font-bold">{personality.cost}</span>
                <span className="text-xs text-slate-500">积分</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && selectedPersonalityData && !result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setShowConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${selectedPersonalityData.color} flex items-center justify-center text-3xl mb-4`}>
                {selectedPersonalityData.avatar}
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">{selectedPersonalityData.name}</h3>
              <p className="text-sm text-slate-400">{selectedPersonalityData.description}</p>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">AI模型</span>
                <span className="text-slate-200 font-medium">{selectedModelData?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">消耗积分</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {selectedPersonalityData.cost}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">预计加成</span>
                <span className="text-violet-400 font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  +5%~15%
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-slate-700 text-slate-200 rounded-xl font-medium"
              >
                取消
              </button>
              <button
                onClick={handleCallAI}
                disabled={loading}
                className={`flex-1 py-3 bg-gradient-to-r ${selectedPersonalityData.color} text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    召唤中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    确认召唤
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Result Modal */}
      {result && selectedPersonalityData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-sm"
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${selectedPersonalityData.color} flex items-center justify-center text-3xl mb-4`}>
                {selectedPersonalityData.avatar}
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-1">{selectedPersonalityData.name}</h3>
              <p className="text-xs text-slate-400">评判结果</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-700/50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">评判总结</p>
                <p className="text-slate-200">{result.summary}</p>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">点评</p>
                <p className="text-slate-200 italic">"{result.taunt}"</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">倾向阵营</p>
                  <p className={`font-bold ${
                    result.favoredCamp === 1 ? 'text-cyan-400' : 
                    result.favoredCamp === 2 ? 'text-pink-400' : 'text-slate-300'
                  }`}>
                    {result.favoredCamp === 0 ? '平局' : result.favoredCamp === 1 ? '阵营1' : '阵营2'}
                  </p>
                </div>
                <div className="flex-1 bg-violet-500/20 border border-violet-500/30 rounded-xl p-3 text-center">
                  <p className="text-xs text-violet-300 mb-1">战力加成</p>
                  <p className="font-bold text-violet-400">+{result.boostPercent}%</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCloseResult}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium"
            >
              收下奖励
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
