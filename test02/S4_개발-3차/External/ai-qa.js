/**
 * @task S3BA1
 * @description AI Q&A API - Gemini, ChatGPT, Perplexity 지원
 * 로그인한 사용자는 모두 AI 기능 사용 가능 (구독 체크 없음)
 * 토큰 사용량을 api_usage_log 테이블에 기록
 */

const { sendMessage, VALID_PROVIDERS } = require('../Backend_Infra/ai');
const { createClient } = require('@supabase/supabase-js');

// AI 사용 로그 저장
async function logAIUsage(supabase, userId, provider, model, usage, responseTimeMs) {
  try {
    await supabase.from('api_usage_log').insert({
      user_id: userId,
      endpoint: '/api/ai-qa',
      method: 'POST',
      ai_model: `${provider}/${model}`,
      input_tokens: usage?.prompt_tokens || null,
      output_tokens: usage?.completion_tokens || null,
      cost_credits: null, // 추후 계산 로직 추가
      response_time_ms: responseTimeMs,
      status_code: 200
    });
  } catch (error) {
    console.error('Failed to log AI usage:', error);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, provider, contentId, context } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!provider || !VALID_PROVIDERS.includes(provider)) {
    return res.status(400).json({
      error: 'Invalid provider',
      validProviders: VALID_PROVIDERS,
      message: 'Provider must be one of: gemini, chatgpt, perplexity'
    });
  }

  // Supabase 클라이언트 생성 (환경변수 없으면 null)
  let supabase = null;
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
      console.error('Supabase client creation failed:', e);
    }
  }

  // 사용자 ID 추출 (Authorization 헤더에서)
  let userId = null;
  if (supabase) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      } catch (e) {
        // 인증 실패해도 계속 진행 (익명 사용)
      }
    }
  }

  // 학습 콘텐츠 컨텍스트 (선택적)
  let learningContext = context || '';
  if (contentId && supabase) {
    try {
      const { data: content } = await supabase
        .from('learning_contents')
        .select('title, content, description')
        .eq('id', contentId)
        .single();
      if (content) {
        learningContext = `학습 콘텐츠: ${content.title}
설명: ${content.description || ''}
내용: ${content.content || ''}`;
      }
    } catch (e) {
      console.error('Failed to load learning content:', e);
    }
  }

  // 학습 콘텐츠가 있으면 질문에 포함
  const fullQuestion = learningContext
    ? `${question}\n\n[참고 콘텐츠]\n${learningContext}`
    : question;

  try {
    const startTime = Date.now();
    const result = await sendMessage(provider, fullQuestion, { maxTokens: 2048 });
    const responseTimeMs = Date.now() - startTime;

    if (!result.success) {
      return res.status(500).json({
        error: 'AI service error',
        details: result.error,
        provider
      });
    }

    // 사용 로그 저장 (Supabase 연결 시에만)
    if (supabase) {
      await logAIUsage(supabase, userId, result.provider, result.model, result.usage, responseTimeMs);
    }

    return res.status(200).json({
      success: true,
      answer: result.content,
      provider: result.provider,
      model: result.model,
      usage: result.usage
    });
  } catch (error) {
    console.error('AI Q&A Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
