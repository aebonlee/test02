/**
 * @task S3BI2
 * @description AI 튜터 프롬프트 빌더
 */

/**
 * AI 튜터 시스템 프롬프트
 */
const SYSTEM_PROMPT = `당신은 SSAL Works에서 제공하는 학습 콘텐츠를 기반으로 웹 개발 및 프로젝트 관리를 가르치는 AI 튜터입니다.

## 역할
- 웹 개발 기술 (Next.js, Supabase, React 등) 사용법 설명
- 프로젝트 관리 및 개발 프로세스 가이드
- 학습 콘텐츠 기반 기술 교육

## 🚨 중요한 주의사항 (반드시 준수)
- **SSAL Works는 학습 플랫폼**입니다. 학습 콘텐츠에서 다루는 **외부 서비스(Supabase, GitHub 등)와 절대 혼동하지 마세요**.
- **예시**: "Supabase 사용법"을 설명할 때 → ✅ "supabase.com에 접속" / ❌ "SSAL Works에 로그인"
- **예시**: "GitHub 사용법"을 설명할 때 → ✅ "github.com에 접속" / ❌ "SSAL Works에서 GitHub를..."
- 참조 문서의 내용을 **정확히 그대로** 전달하세요. 임의로 "SSAL Works"를 추가하지 마세요.

## 규칙
1. 제공된 참조 문서를 **정확히** 기반으로 답변하세요. 문서에 명시된 URL, 서비스명을 그대로 사용하세요.
2. 참조 문서에 없는 내용은 "해당 내용은 현재 제공된 학습 자료에서 찾을 수 없습니다. 질문을 다르게 표현하거나 더 구체적으로 해주세요."라고 안내하세요.
3. 답변은 친절하고 명확하게 작성하세요.
4. 필요시 예시나 단계별 설명을 사용하세요.
5. 기술적인 내용은 초보자도 이해할 수 있게 쉽게 설명하세요.

## 답변 형식
- 마크다운 형식 사용 가능
- 리스트, 코드 블록 등 활용
- 핵심 내용은 굵게 표시`;

/**
 * 프롬프트 구성
 * @param {string} question - 사용자 질문
 * @param {object[]} contextDocs - 참조 문서 배열
 * @returns {object} 시스템 프롬프트, 사용자 프롬프트, 소스 정보
 */
function buildPrompt(question, contextDocs = []) {
    // 컨텍스트 문서 포맷팅
    let contextSection = '';

    if (contextDocs.length > 0) {
        const formattedDocs = contextDocs
            .map((doc, i) => {
                const title = doc.title || `문서 ${i + 1}`;
                const similarity = doc.similarity
                    ? ` (관련도: ${(doc.similarity * 100).toFixed(1)}%)`
                    : '';
                return `### [참조 ${i + 1}] ${title}${similarity}\n${doc.content}`;
            })
            .join('\n\n---\n\n');

        contextSection = `## 참조 문서\n\n${formattedDocs}\n\n---\n\n`;
    } else {
        contextSection = '## 참조 문서\n\n관련 문서를 찾을 수 없습니다.\n\n---\n\n';
    }

    // 소스 정보 추출
    const sources = contextDocs.map(doc => ({
        content_id: doc.content_id,
        title: doc.title,
        similarity: doc.similarity,
        content_type: doc.content_type
    }));

    return {
        systemPrompt: SYSTEM_PROMPT,
        userPrompt: `${contextSection}## 사용자 질문\n${question}`,
        sources
    };
}

/**
 * 대화 히스토리를 포함한 프롬프트 구성
 * @param {string} question - 현재 질문
 * @param {object[]} contextDocs - 참조 문서 배열
 * @param {object[]} history - 이전 대화 히스토리 [{role, content}]
 * @returns {object} 프롬프트 정보
 */
function buildPromptWithHistory(question, contextDocs = [], history = []) {
    const basePrompt = buildPrompt(question, contextDocs);

    // 히스토리가 있으면 추가
    if (history.length > 0) {
        const historySection = history
            .slice(-6) // 최근 6개 메시지만 사용 (토큰 절약)
            .map(msg => `**${msg.role === 'user' ? '사용자' : 'AI 튜터'}**: ${msg.content}`)
            .join('\n\n');

        basePrompt.userPrompt = `## 이전 대화\n${historySection}\n\n---\n\n${basePrompt.userPrompt}`;
    }

    return basePrompt;
}

module.exports = {
    buildPrompt,
    buildPromptWithHistory,
    SYSTEM_PROMPT
};
