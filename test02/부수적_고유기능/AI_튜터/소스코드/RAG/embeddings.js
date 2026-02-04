/**
 * @task S3BI2
 * @description Gemini 임베딩 생성 및 벡터 검색 모듈
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini 클라이언트 초기화
let genAI = null;

function getGenAI() {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

/**
 * Gemini 임베딩 생성 (768차원, 무료)
 * @param {string} text - 임베딩할 텍스트
 * @returns {Promise<number[]>} 768차원 임베딩 벡터
 */
async function generateEmbedding(text) {
    if (!text || text.trim().length === 0) {
        throw new Error('임베딩할 텍스트가 비어있습니다.');
    }

    const model = getGenAI().getGenerativeModel({ model: 'embedding-001' });
    const result = await model.embedContent(text);

    return result.embedding.values;
}

/**
 * 벡터 유사도 검색 (Supabase RPC 함수 사용)
 * @param {object} supabase - Supabase 클라이언트
 * @param {number[]} queryEmbedding - 쿼리 임베딩 벡터
 * @param {object} options - 검색 옵션
 * @returns {Promise<object[]>} 유사 문서 배열
 */
async function searchSimilarContent(supabase, queryEmbedding, options = {}) {
    const {
        matchThreshold = 0.5,
        matchCount = 5
    } = options;

    const { data, error } = await supabase.rpc('search_content', {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount
    });

    if (error) {
        console.error('벡터 검색 오류:', error);
        throw error;
    }

    return data || [];
}

/**
 * 질문에 대한 유사 문서 검색 (임베딩 생성 + 검색 통합)
 * @param {object} supabase - Supabase 클라이언트
 * @param {string} question - 사용자 질문
 * @param {object} options - 검색 옵션
 * @returns {Promise<object[]>} 유사 문서 배열
 */
async function findRelevantDocuments(supabase, question, options = {}) {
    // 질문 임베딩 생성
    const queryEmbedding = await generateEmbedding(question);

    // 유사 문서 검색
    const documents = await searchSimilarContent(supabase, queryEmbedding, options);

    return documents;
}

module.exports = {
    generateEmbedding,
    searchSimilarContent,
    findRelevantDocuments
};
