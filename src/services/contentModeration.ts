// 内容审核服务 - 敏感词过滤
// 用于用户生成内容(UGC)的前端预过滤，满足 App Store 审核要求 1.2

// 敏感词库（基础版本，可后续扩展或对接第三方服务）
const SENSITIVE_WORDS: string[] = [
  // 色情低俗
  '色情', '裸体', '性爱', '嫖娼', '卖淫', '援交',
  // 暴力恐怖
  '杀人', '炸弹', '恐怖袭击', '自杀方法',
  // 赌博诈骗
  '赌博网站', '网赌', '杀猪盘', '诈骗',
  // 违禁品
  '毒品', '冰毒', '大麻出售', '枪支买卖',
  // 人身攻击（严重）
  '去死', '全家死',
];

// 构建正则匹配（支持中间插入特殊字符干扰的情况）
function buildPattern(word: string): RegExp {
  // 为每个字之间允许插入0-2个干扰字符（空格、符号等）
  const chars = word.split('');
  const pattern = chars.join('[\\s\\*\\.·_\\-]{0,2}');
  return new RegExp(pattern, 'gi');
}

let patterns: RegExp[] | null = null;

function getPatterns(): RegExp[] {
  if (!patterns) {
    patterns = SENSITIVE_WORDS.map(buildPattern);
  }
  return patterns;
}

export interface ContentCheckResult {
  passed: boolean;
  matched: string[];
  filtered: string;  // 替换后的文本
}

// 检查内容是否包含敏感词
export function checkContent(text: string): ContentCheckResult {
  if (!text || text.trim().length === 0) {
    return { passed: true, matched: [], filtered: text };
  }

  const allPatterns = getPatterns();
  const matched: string[] = [];
  let filtered = text;

  for (let i = 0; i < allPatterns.length; i++) {
    const pattern = allPatterns[i];
    // 重置 lastIndex
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      matched.push(SENSITIVE_WORDS[i]);
      // 替换为 ***
      pattern.lastIndex = 0;
      filtered = filtered.replace(pattern, '***');
    }
  }

  return {
    passed: matched.length === 0,
    matched,
    filtered,
  };
}

// 快速检测（只返回是否通过）
export function isContentSafe(text: string): boolean {
  return checkContent(text).passed;
}

// 过滤内容（替换敏感词并返回）
export function filterContent(text: string): string {
  return checkContent(text).filtered;
}
