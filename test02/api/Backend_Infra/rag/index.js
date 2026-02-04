/**
 * @task S3BI2
 * @description RAG (Retrieval-Augmented Generation) 파이프라인 메인 모듈
 */

const { generateEmbedding, searchSimilarContent, hybridSearchContent, findRelevantDocuments } = require('./embeddings');
const { buildPrompt, buildPromptWithHistory, SYSTEM_PROMPT } = require('./prompt-builder');
const { chunkText, extractTitle, removeFrontmatter } = require('./chunker');

/**
 * RAG 파이프라인 실행
 * @param {object} supabase - Supabase 클라이언트
 * @param {string} question - 사용자 질문
 * @param {object} options - 옵션
 * @returns {Promise<object>} RAG 결과 (프롬프트, 소스 등)
 */
async function ragPipeline(supabase, question, options = {}) {
    const {
        matchThreshold = 0.5,
        matchCount = 5,
        history = [],
        vectorWeight = 0.7,
        keywordWeight = 0.3
    } = options;

    try {
        // 1. 질문 임베딩 생성
        const queryEmbedding = await generateEmbedding(question);

        // 2. 하이브리드 검색 (벡터 + 키워드, 실패 시 벡터 전용 폴백)
        let similarDocs;
        try {
            similarDocs = await hybridSearchContent(supabase, queryEmbedding, question, {
                matchThreshold,
                matchCount,
                vectorWeight,
                keywordWeight
            });
        } catch (hybridError) {
            console.warn('하이브리드 검색 실패, 벡터 전용 폴백:', hybridError.message);
            similarDocs = await searchSimilarContent(supabase, queryEmbedding, {
                matchThreshold,
                matchCount
            });
        }

        // 3. 프롬프트 구성
        const promptData = history.length > 0
            ? buildPromptWithHistory(question, similarDocs, history)
            : buildPrompt(question, similarDocs);

        return {
            systemPrompt: promptData.systemPrompt,
            userPrompt: promptData.userPrompt,
            sources: promptData.sources,
            contextCount: similarDocs.length,
            hasContext: similarDocs.length > 0
        };
    } catch (error) {
        console.error('RAG 파이프라인 오류:', error);

        // 오류 발생 시 기본 프롬프트 반환
        const fallbackPrompt = buildPrompt(question, []);
        return {
            systemPrompt: fallbackPrompt.systemPrompt,
            userPrompt: fallbackPrompt.userPrompt,
            sources: [],
            contextCount: 0,
            hasContext: false,
            error: error.message
        };
    }
}

/**
 * 간단한 RAG 검색 (프롬프트 없이 문서만 검색)
 * @param {object} supabase - Supabase 클라이언트
 * @param {string} query - 검색 쿼리
 * @param {object} options - 옵션
 * @returns {Promise<object[]>} 관련 문서 배열
 */
async function searchDocuments(supabase, query, options = {}) {
    return await findRelevantDocuments(supabase, query, options);
}

// 모듈 내보내기
module.exports = {
    // 메인 파이프라인
    ragPipeline,
    searchDocuments,

    // 유틸리티 (하위 모듈에서 재내보내기)
    generateEmbedding,
    searchSimilarContent,
    hybridSearchContent,
    findRelevantDocuments,
    buildPrompt,
    buildPromptWithHistory,
    chunkText,
    extractTitle,
    removeFrontmatter,

    // 상수
    SYSTEM_PROMPT
};
