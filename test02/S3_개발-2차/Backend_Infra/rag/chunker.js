/**
 * @task S3BI2
 * @description 텍스트 청킹 모듈 - RAG 파이프라인용
 */

/**
 * 텍스트를 지정된 크기의 청크로 분할
 * @param {string} text - 분할할 텍스트
 * @param {number} chunkSize - 청크 크기 (기본 1000자)
 * @param {number} overlap - 오버랩 크기 (기본 200자)
 * @returns {string[]} 청크 배열
 */
function chunkText(text, chunkSize = 1000, overlap = 200) {
    if (!text || text.length === 0) {
        return [];
    }

    // 짧은 텍스트는 그대로 반환
    if (text.length <= chunkSize) {
        return [text];
    }

    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));

        // 다음 청크 시작점 (오버랩 적용)
        start = end - overlap;

        // 마지막 청크 처리
        if (start + overlap >= text.length) break;
    }

    return chunks;
}

/**
 * 마크다운 파일에서 제목 추출
 * @param {string} content - 마크다운 내용
 * @param {string} fallback - 기본값 (파일명 등)
 * @returns {string} 제목
 */
function extractTitle(content, fallback = 'Untitled') {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1].trim() : fallback;
}

/**
 * 마크다운 프론트매터 제거
 * @param {string} content - 마크다운 내용
 * @returns {string} 프론트매터 제거된 내용
 */
function removeFrontmatter(content) {
    const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
    return content.replace(frontmatterRegex, '').trim();
}

module.exports = {
    chunkText,
    extractTitle,
    removeFrontmatter
};
