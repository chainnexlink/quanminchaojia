import { AIModelConfig, getRandomPersonality } from './aiModels';

export interface AIJudgeRequest {
  topicTitle: string;
  topicDesc: string;
  camp1Name: string;
  camp2Name: string;
  camp1Posts: string[];
  camp2Posts: string[];
  userContent: string;
  judgeStyle: 'balanced' | 'strict' | 'humorous' | 'wise' | 'enthusiastic' | 'analytical';
}

export interface AIJudgeResponse {
  summary: string;
  taunt: string;
  favoredCamp: 0 | 1 | 2;
  boostPercent: number;
  reasoning?: string;
}

// 后端 API 地址
const API_BASE = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3267/api';

// 根据随机性格生成系统提示词
function getSystemPrompt(): string {
  const baseFormat = `
你必须严格按照以下JSON格式输出结果，不要输出任何其他内容：
{
  "summary": "评判总结（50字以内）",
  "taunt": "吐槽点评（30字以内）",
  "favoredCamp": 0或1或2,
  "boostPercent": 5到15之间的数字
}
其中 favoredCamp: 0表示平局，1表示阵营1更有理，2表示阵营2更有理。`;

  // 每次调用随机抽一个性格，避免审美疲劳
  const personality = getRandomPersonality();
  return `你是全民嘲家辩论平台的AI裁判。你的性格特点：${personality.description}

请完全按照上述性格特点来说话和评判。你要做的是分析辩论双方的观点，给出你风格化的评判。
${baseFormat}`;
}

// 构建用户提示词
function buildUserPrompt(request: AIJudgeRequest): string {
  const { topicTitle, topicDesc, camp1Name, camp2Name, camp1Posts, camp2Posts, userContent } = request;
  
  return `请作为AI裁判评判以下话题：

话题：${topicTitle}
描述：${topicDesc}

阵营1「${camp1Name}」的观点：
${camp1Posts.map((p, i) => `${i + 1}. ${p}`).join('\n')}

阵营2「${camp2Name}」的观点：
${camp2Posts.map((p, i) => `${i + 1}. ${p}`).join('\n')}

用户召唤时说的话：${userContent || '请评判这个话题'}

请严格按照以下JSON格式输出结果：
{
  "summary": "评判总结",
  "taunt": "吐槽点评",
  "favoredCamp": 0或1或2,
  "boostPercent": 数字
}`;
}

// 解析 AI 响应内容为结构化结果
function parseAIResponse(content: string): AIJudgeResponse {
  const fallback: AIJudgeResponse = {
    summary: 'AI评判完成',
    taunt: '观点很有意思！',
    favoredCamp: 0,
    boostPercent: 8.0
  };
  try {
    return JSON.parse(content);
  } catch {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch { /* regex fallback also failed */ }
    return fallback;
  }
}

// 通过后端代理调用 AI（密钥不暴露在前端）
async function callViaProxy(model: AIModelConfig, request: AIJudgeRequest): Promise<AIJudgeResponse> {
  const messages = [
    { role: 'system', content: getSystemPrompt() },
    { role: 'user', content: buildUserPrompt(request) }
  ];

  const response = await fetch(`${API_BASE}/ai/judge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Timestamp': String(Date.now())
    },
    body: JSON.stringify({
      modelId: model.id,
      messages,
      maxTokens: model.maxTokens,
      temperature: model.temperature
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(err.error || `AI服务错误: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'AI返回异常');
  }

  return parseAIResponse(data.content);
}

// 统一的AI调用接口（全部走后端代理）
export async function callAIJudge(
  model: AIModelConfig,
  request: AIJudgeRequest
): Promise<AIJudgeResponse> {
  return callViaProxy(model, request);
}

// 模拟AI调用（用于测试）
export async function mockCallAIJudge(
  request: AIJudgeRequest
): Promise<AIJudgeResponse> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const styles: Record<string, AIJudgeResponse> = {
    balanced: {
      summary: '双方观点都有合理之处，阵营1逻辑更清晰，阵营2情感更真挚。',
      taunt: '你们两边说得都有道理，但都不够完美~',
      favoredCamp: 1,
      boostPercent: 8.5
    },
    strict: {
      summary: '阵营1论据充分但缺乏深度，阵营2观点新颖但逻辑有漏洞。',
      taunt: '这样的论证水平，还需要再磨练磨练！',
      favoredCamp: 1,
      boostPercent: 12.0
    },
    humorous: {
      summary: '阵营1像严谨的教授，阵营2像感性的诗人，各有千秋！',
      taunt: '你们这是在辩论还是在说相声啊？',
      favoredCamp: 0,
      boostPercent: 6.0
    },
    wise: {
      summary: '从历史长河看，这种争论反映了人类对美好生活的不同追求。',
      taunt: '千年之后，谁还记得今天的胜负？',
      favoredCamp: 2,
      boostPercent: 13.5
    },
    enthusiastic: {
      summary: '太精彩了！双方都为各自阵营拼尽全力，这就是辩论的魅力！',
      taunt: '燃起来了！这才是真正的南北大战！',
      favoredCamp: 1,
      boostPercent: 10.0
    },
    analytical: {
      summary: '数据显示阵营1论据支持率62%，阵营2情感共鸣度78%。',
      taunt: '数据不会说谎，但情感难以量化。',
      favoredCamp: 2,
      boostPercent: 11.5
    }
  };
  
  return styles[request.judgeStyle] || styles.balanced;
}
