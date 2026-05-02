// AI模型配置管理
export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'deepseek' | 'doubao' | 'zhipu' | 'openai' | 'siliconflow' | 'moonshot' | 'custom';
  apiKey: string;       // 前端留空，实际密钥由后端管理
  baseUrl: string;      // 前端留空，由后端代理转发
  model: string;
  maxTokens: number;
  temperature: number;
  enabled: boolean;
  icon: string;
  iconColor: string;
}

// 性格池：每次AI召唤随机抽取，不绑定固定模型，避免审美疲劳
export interface AIPersonality {
  label: string;       // 短标签
  description: string; // 完整性格描述
}

export const AI_PERSONALITIES: AIPersonality[] = [
  { label: '学术毒舌', description: '冷静理性的学术派裁判，说话逻辑严密像论文答辩导师，喜欢用"首先...其次...综上"的句式，偶尔冒出一句冷幽默让人措手不及，点评时会不动声色地拆解双方逻辑漏洞' },
  { label: '国学大师', description: '饱读诗书的老学究，说话喜欢引经据典，动不动就"古人云""子曰"，用历史典故和文化角度分析辩论，点评时带着看破红尘的淡然，偶尔来一句文言文夹杂大白话的混搭风' },
  { label: '脱口秀担当', description: '脱口秀主持人风格，毒舌但不伤人，擅长抓住双方观点里最好笑的矛盾进行吐槽，语言节奏感很强，喜欢用反问句和排比句制造笑果，点评完让人又气又想笑' },
  { label: '热血解说', description: '热血中二的解说员，说话夸张带感叹号，喜欢用"这波操作绝了！""直接封神！"之类的表达，把普通的辩论点评成史诗级对决，让人感觉每次辩论都是世纪大战' },
  { label: '温柔一刀', description: '温柔但心里有数的知心姐姐，说话和和气气但每句话都戳重点，擅长从情感和人性角度分析问题，安慰完输的一方顺便教做人，表面温柔实际上最狠' },
  { label: '数据极客', description: '理工科直男风格的数据极客，喜欢量化一切，说话全是"从概率上来说""数据表明""置信度为"，把辩论搞得像学术报告，虽然枯燥但总能说到点上，偶尔吐槽双方都不够严谨' },
  { label: '傲娇评论家', description: '优雅傲慢的评论家，说话带着居高临下的优越感，喜欢用"有趣""不过如此""差强人意"之类的词，点评时像品红酒一样品味双方观点，偶尔流露出"你们还是太嫩了"的态度' },
  { label: '阴阳大师', description: '阴阳怪气的嘲讽大师，表面在夸实际在损，擅长反话正说和正话反说，每句话都有两层意思，让人分不清到底是在支持还是在嘲讽，是全场最阴间的裁判' },
  { label: '网络冲浪', description: '互联网冲浪达人，说话全是网络梗和流行语，"绝绝子""芭比Q了""这谁顶得住啊"张口就来，用年轻人的方式解读辩论，点评里夹杂弹幕风格的吐槽' },
  { label: '接地气大爷', description: '接地气的社区大爷，说话大白话不绕弯子，有啥说啥，喜欢用生活中的例子打比方，"这事儿吧就跟那啥一样"，虽然糙但每句都在理，偶尔蹦出几句歇后语' },
];

// 随机抽取一个性格
export function getRandomPersonality(): AIPersonality {
  return AI_PERSONALITIES[Math.floor(Math.random() * AI_PERSONALITIES.length)];
}

// API 密钥已迁移至后端 .env，前端不再持有任何密钥
// 所有 AI 请求通过后端 /api/ai/judge 代理转发

// 模型图标SVG字符串映射
export const modelIconSVGs: Record<string, string> = {
  deepseek: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 2L4 8v16l12 6 12-6V8L16 2zm0 4l8 4-8 4-8-4 8-4zm-8 6.5l8 4v8l-8-4v-8zm16 0v8l-8 4v-8l8-4z"/></svg>',
  qwen: '<svg viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8v16M8 16h16" stroke="currentColor" stroke-width="2"/></svg>',
  glm: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 4l12 7v10l-12 7L4 21V11l12-7z"/><circle cx="16" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  llama: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M8 8h16v16H8zM12 4v4M20 4v4M12 24v4M20 24v4"/></svg>',
  gemma: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 4l10 6v12l-10 6-10-6V10l10-6z"/><circle cx="16" cy="16" r="5"/></svg>',
  phi: '<svg viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 6v20M10 12h12" stroke="currentColor" stroke-width="2"/></svg>',
  mistral: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M4 16c0-6 5-10 12-10s12 4 12 10-5 10-12 10S4 22 4 16z"/><path d="M8 16h16M12 10l8 6-8 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  qvq: '<svg viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="4"/><path d="M24 8l4-4M8 24l-4 4"/></svg>',
  kimi: '<svg viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="20" r="3"/></svg>',
  doubao: '<svg viewBox="0 0 32 32" fill="currentColor"><rect x="6" y="6" width="20" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 12h8M12 16h8M12 20h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

// 默认模型配置（密钥由后端管理，前端仅存显示信息）
export const defaultAIModels: AIModelConfig[] = [
  {
    id: 'siliconflow-deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'siliconflow',
    apiKey: '',
    baseUrl: '',
    model: 'deepseek-ai/DeepSeek-V3',
    maxTokens: 4096,
    temperature: 0.7,
    enabled: true,
    icon: 'deepseek',
    iconColor: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'siliconflow-qwen2.5-72b',
    name: '通义千问 2.5-72B',
    provider: 'siliconflow',
    apiKey: '',
    baseUrl: '',
    model: 'Qwen/Qwen2.5-72B-Instruct',
    maxTokens: 4096,
    temperature: 0.7,
    enabled: true,
    icon: 'qwen',
    iconColor: 'from-orange-500 to-red-500',
  },
  {
    id: 'siliconflow-glm4-9b',
    name: '智谱 GLM-4-9B',
    provider: 'siliconflow',
    apiKey: '',
    baseUrl: '',
    model: 'THUDM/glm-4-9b-chat',
    maxTokens: 4096,
    temperature: 0.8,
    enabled: true,
    icon: 'glm',
    iconColor: 'from-purple-600 to-pink-500',
  },
  {
    id: 'siliconflow-llama3.3-70b',
    name: 'Llama 3.3-70B',
    provider: 'siliconflow',
    apiKey: '',
    baseUrl: '',
    model: 'meta-llama/Llama-3.3-70B-Instruct',
    maxTokens: 4096,
    temperature: 0.8,
    enabled: true,
    icon: 'llama',
    iconColor: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'siliconflow-gemma2-27b',
    name: 'Gemma 2-27B',
    provider: 'siliconflow',
    apiKey: '',
    baseUrl: '',
    model: 'google/gemma-2-27b-it',
    maxTokens: 4096,
    temperature: 0.6,
    enabled: true,
    icon: 'gemma',
    iconColor: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'siliconflow-phi4',
    name: 'Phi-4',
    provider: 'siliconflow',
    apiKey: '',
    baseUrl: '',
    model: 'microsoft/phi-4',
    maxTokens: 4096,
    temperature: 0.6,
    enabled: true,
    icon: 'phi',
    iconColor: 'from-sky-500 to-blue-600',
  },
  {
    id: 'siliconflow-mistral-large',
    name: 'Mistral Large',
    provider: 'siliconflow',
    apiKey: '',
    baseUrl: '',
    model: 'mistralai/Mistral-Large-Instruct-2411',
    maxTokens: 4096,
    temperature: 0.7,
    enabled: true,
    icon: 'mistral',
    iconColor: 'from-amber-500 to-orange-500',
  },
  {
    id: 'siliconflow-qvq-72b',
    name: 'QVQ-72B-Preview',
    provider: 'siliconflow',
    apiKey: '',
    baseUrl: '',
    model: 'Qwen/QVQ-72B-Preview',
    maxTokens: 4096,
    temperature: 0.8,
    enabled: true,
    icon: 'qvq',
    iconColor: 'from-rose-500 to-pink-500',
  },
  {
    id: 'siliconflow-kimi-k2.5',
    name: 'Kimi K2.5',
    provider: 'siliconflow',
    apiKey: '',
    baseUrl: '',
    model: 'Pro/moonshotai/Kimi-K2.5',
    maxTokens: 4096,
    temperature: 0.8,
    enabled: true,
    icon: 'kimi',
    iconColor: 'from-violet-500 to-indigo-500',
  },
  {
    id: 'doubao-ep',
    name: '豆包',
    provider: 'doubao',
    apiKey: '',
    baseUrl: '',
    model: 'ep-20260430101109-rq6bd',
    maxTokens: 4096,
    temperature: 0.7,
    enabled: true,
    icon: 'doubao',
    iconColor: 'from-cyan-500 to-blue-500',
  }
];

// 本地存储键名
const AI_MODELS_STORAGE_KEY = 'ai_models_config';

// 获取保存的模型配置
export function getSavedAIModels(): AIModelConfig[] {
  try {
    const saved = localStorage.getItem(AI_MODELS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load AI models config:', e);
  }
  return defaultAIModels;
}

// 保存模型配置
export function saveAIModels(models: AIModelConfig[]): void {
  try {
    localStorage.setItem(AI_MODELS_STORAGE_KEY, JSON.stringify(models));
  } catch (e) {
    console.error('Failed to save AI models config:', e);
  }
}

// 更新单个模型配置
export function updateAIModel(modelId: string, updates: Partial<AIModelConfig>): void {
  const models = getSavedAIModels();
  const index = models.findIndex(m => m.id === modelId);
  if (index !== -1) {
    models[index] = { ...models[index], ...updates };
    saveAIModels(models);
  }
}

// 获取启用的模型（密钥已移至后端，仅检查 enabled 状态）
export function getEnabledModels(): AIModelConfig[] {
  return getSavedAIModels().filter(m => m.enabled);
}

// 获取默认启用的第一个模型
export function getDefaultModel(): AIModelConfig | null {
  const enabled = getEnabledModels();
  return enabled.length > 0 ? enabled[0] : null;
}
