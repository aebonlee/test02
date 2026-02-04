// S3BA1: AI Q&A API - FAQ 제안
const { createClient } = require('@supabase/supabase-js');

/**
 * FAQ 제안 API Handler
 * FAQ 기반 유사 질문 제안 (AI 호출 없이 키워드 매칭)
 *
 * POST /api/ai/faq-suggest
 * Body: { question: string }
 *
 * Response: { success: boolean, suggestions: array, hasMatch: boolean }
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    // FAQ 테이블에서 유사 질문 검색 (간단한 키워드 매칭)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 질문에서 키워드 추출 (공백으로 분리, 조사/특수문자 제거)
    const keywords = question
      .toLowerCase()
      .replace(/[?!.,~@#$%^&*()]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 1);

    // FAQ에서 모든 질문 조회
    const { data: faqs, error } = await supabase
      .from('faqs')
      .select('id, question, answer, category')
      .eq('is_published', true)
      .limit(50);

    if (error) {
      console.error('FAQ query error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!faqs || faqs.length === 0) {
      return res.status(200).json({
        success: true,
        suggestions: [],
        hasMatch: false,
        message: 'No FAQs available'
      });
    }

    // 키워드 매칭으로 관련성 점수 계산
    const scored = faqs.map(faq => {
      const faqWords = faq.question.toLowerCase();
      const faqAnswerWords = faq.answer ? faq.answer.toLowerCase() : '';

      // 질문과 답변 모두에서 키워드 매칭
      const questionScore = keywords.filter(k => faqWords.includes(k)).length;
      const answerScore = keywords.filter(k => faqAnswerWords.includes(k)).length * 0.5;

      return {
        ...faq,
        score: questionScore + answerScore
      };
    });

    // 점수순 정렬 후 상위 3개 선택
    const suggestions = scored
      .filter(f => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => ({
        id: s.id,
        question: s.question,
        answer: s.answer,
        category: s.category,
        relevanceScore: Math.round(s.score * 100) / 100
      }));

    return res.status(200).json({
      success: true,
      suggestions: suggestions,
      hasMatch: suggestions.length > 0,
      totalFaqsSearched: faqs.length
    });

  } catch (error) {
    console.error('FAQ suggest error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// 인증 없이 접근 가능 (무료 기능)
module.exports = handler;
