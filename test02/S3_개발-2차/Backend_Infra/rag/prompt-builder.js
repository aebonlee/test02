/**
 * @task S3BI2
 * @description AI 튜터 프롬프트 빌더
 */

/**
 * AI 튜터 시스템 프롬프트
 */
const SYSTEM_PROMPT = `당신은 SSAL Works의 AI 튜터입니다.
SSAL Works의 학습 콘텐츠를 기반으로 사용자의 질문에 답변합니다.

## 역할
- SSAL Works 서비스 사용법 안내
- 프로젝트 관리 및 개발 프로세스 설명
- AI 기반 서비스 이용 방법 가이드

## 규칙
1. 제공된 참조 문서를 기반으로 답변하세요.
2. 참조 문서에 없는 내용은 "해당 내용은 학습 자료에서 찾을 수 없습니다. 더 구체적인 질문을 해주시거나, SSAL Works 고객센터로 문의해주세요."라고 안내하세요.
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
                const score = doc.combined_score
                    ? ` (종합: ${(doc.combined_score * 100).toFixed(1)}%)`
                    : doc.similarity
                        ? ` (관련도: ${(doc.similarity * 100).toFixed(1)}%)`
                        : '';
                return `### [참조 ${i + 1}] ${title}${score}\n${doc.content}`;
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
        keyword_similarity: doc.keyword_similarity,
        combined_score: doc.combined_score,
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
