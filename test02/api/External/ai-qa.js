/**
 * @task S3BA1, S5BA3, S5S2
 * @description AI Q&A API - Gemini, ChatGPT, Perplexity 지원
 * 로그인한 사용자는 모두 AI 기능 사용 가능 (구독 체크 없음)
 * 토큰 사용량을 api_usage_log 테이블에 기록
 * 크레딧 차감 기능 구현 (2025-12-30)
 * Rate Limiting 적용 (2025-12-30)
 */

const { sendMessage, VALID_PROVIDERS } = require('../Backend_Infra/ai');
const { createClient } = require('@supabase/supabase-js');
const { checkRateLimit } = require('../Backend_Infra/rate-limiter');

// Provider 매핑 (api_costs 테이블용)
const PROVIDER_MAP = {
  chatgpt: 'openai',
  openai: 'openai',
  gemini: 'google',
  google: 'google',
  perplexity: 'perplexity'
};

// 기본 크레딧 비용 (api_costs 테이블 조회 실패 시)
const DEFAULT_CREDIT_COSTS = {
  openai: 2,      // gpt-4o-mini
  google: 1,      // gemini-2.5-flash
  perplexity: 3   // sonar
};

/**
 * 모델별 크레딧 비용 조회
 */
async function getModelCreditCost(supabase, provider, model) {
  const dbProvider = PROVIDER_MAP[provider] || provider;

  try {
    const { data, error } = await supabase
      .from('api_costs')
      .select('credit_cost')
      .eq('provider', dbProvider)
      .eq('model_name', model)
      .single();

    if (data && data.credit_cost) {
      return data.credit_cost;
    }
  } catch (e) {
    console.error('Failed to get credit cost:', e);
  }

  return DEFAULT_CREDIT_COSTS[dbProvider] || 2;
}

/**
 * 사용자 크레딧 잔액 조회
 */
async function getUserCreditBalance(supabase, userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('credit_balance')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.credit_balance || 0;
  } catch (e) {
    console.error('Failed to get credit balance:', e);
    return 0;
  }
}

/**
 * 크레딧 차감 및 이력 기록
 */
async function deductCredits(supabase, userId, amount, provider, model) {
  try {
    // 1. 현재 잔액 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credit_balance')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const currentBalance = userData?.credit_balance || 0;
    const newBalance = Math.max(0, currentBalance - amount);

    // 2. 잔액 업데이트
    const { error: updateError } = await supabase
      .from('users')
      .update({ credit_balance: newBalance })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 3. 크레딧 이력 기록
    await supabase.from('credit_history').insert({
      user_id: userId,
      amount: -amount,
      balance_after: newBalance,
      type: 'usage',
      description: `AI Q&A (${provider}/${model})`,
      reference_id: null
    });

    return { success: true, newBalance };
  } catch (e) {
    console.error('Failed to deduct credits:', e);
    return { success: false, error: e.message };
  }
}

// AI 사용 로그 저장
async function logAIUsage(supabase, userId, provider, model, usage, responseTimeMs, creditCost) {
  try {
    await supabase.from('api_usage_log').insert({
      user_id: userId,
      endpoint: '/api/ai-qa',
      method: 'POST',
      ai_model: `${provider}/${model}`,
      input_tokens: usage?.prompt_tokens || null,
      output_tokens: usage?.completion_tokens || null,
      cost_credits: creditCost,
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

  // Rate Limiting 체크 (30회/분)
  const rateLimitError = checkRateLimit(req, res, 'aiQA');
  if (rateLimitError) {
    return res.status(rateLimitError.status).json(rateLimitError.body);
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

  // 크레딧 비용 조회 (기본값 사용)
  const dbProvider = PROVIDER_MAP[provider] || provider;
  let creditCost = DEFAULT_CREDIT_COSTS[dbProvider] || 2;

  // 로그인 사용자의 크레딧 확인
  if (userId && supabase) {
    const balance = await getUserCreditBalance(supabase, userId);

    if (balance < creditCost) {
      return res.status(402).json({
        error: 'Insufficient credits',
        code: 'INSUFFICIENT_CREDITS',
        required: creditCost,
        balance: balance,
        message: '크레딧이 부족합니다. 충전 후 이용해주세요.'
      });
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
        learningContext = `[참고 콘텐츠: ${content.title}]\n${content.description || ''}\n\n${content.content}`;
      }
    } catch (e) {
      console.error('Failed to load learning content:', e);
    }
  }

  // 학습 콘텐츠가 있으면 질문에 포함
  const fullQuestion = learningContext
    ? `${learningContext}\n\n질문: ${question}`
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

    // 정확한 크레딧 비용 조회 (모델 확정 후)
    if (supabase) {
      creditCost = await getModelCreditCost(supabase, result.provider, result.model);
    }

    // 크레딧 차감 (로그인 사용자만)
    let newBalance = null;
    if (userId && supabase) {
      const deductResult = await deductCredits(supabase, userId, creditCost, result.provider, result.model);
      if (deductResult.success) {
        newBalance = deductResult.newBalance;
      }
    }

    // 사용 로그 저장 (Supabase 연결 시에만)
    if (supabase) {
      await logAIUsage(supabase, userId, result.provider, result.model, result.usage, responseTimeMs, creditCost);
    }

    return res.status(200).json({
      success: true,
      answer: result.content,
      provider: result.provider,
      model: result.model,
      usage: result.usage,
      creditUsed: creditCost,
      remainingBalance: newBalance
    });
  } catch (error) {
    console.error('AI Q&A Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
