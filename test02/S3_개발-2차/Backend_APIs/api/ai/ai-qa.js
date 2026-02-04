/**
 * @task S3BA1
 * @description AI Q&A API - Gemini, ChatGPT, Perplexity 지원
 */

const { sendMessage, VALID_PROVIDERS, UsageLimiter } = require('../Backend_Infrastructure/ai');
const { withSubscription } = require('../Security/lib/subscription');
const { createClient } = require('@supabase/supabase-js');

const usageLimiter = new UsageLimiter();

async function handler(req, res) {
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

  const userId = req.user.id;
  const userTier = req.subscription?.plan || 'free';

  const limitCheck = await usageLimiter.checkLimit(userId, userTier);
  if (!limitCheck.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: limitCheck.reason,
      remaining: limitCheck.remaining,
      limit: limitCheck.limit
    });
  }

  let learningContext = context || '';
  if (contentId) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
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
  }

  const systemPrompt = `당신은 SSALWorks의 AI 튜터입니다.
사용자가 학습 콘텐츠에 대해 질문하면 친절하고 정확하게 답변해주세요.
${learningContext ? '\n참고 콘텐츠:\n' + learningContext : ''}`;

  try {
    const result = await sendMessage(provider, question, { systemPrompt, maxTokens: 2048 });
    if (!result.success) {
      return res.status(500).json({ error: 'AI service error', details: result.error, provider });
    }
    const totalTokens = result.usage?.total_tokens || 0;
    await usageLimiter.logUsage(userId, totalTokens, result.model);
    return res.status(200).json({
      success: true,
      answer: result.content,
      provider: result.provider,
      model: result.model,
      usage: result.usage,
      remaining: limitCheck.remaining - 1
    });
  } catch (error) {
    console.error('AI Q&A Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = withSubscription('ai-qa')(handler);
