/**
 * @task S3T1
 * @description RAG 파이프라인 테스트
 */

const { chunkText, extractTitle, removeFrontmatter } = require('../Backend_Infra/rag/chunker');

describe('RAG Pipeline Tests', () => {
    describe('Chunker', () => {
        test('should return empty array for empty text', () => {
            const chunks = chunkText('');
            expect(chunks).toEqual([]);
        });

        test('should return single chunk for short text', () => {
            const text = 'This is a short text.';
            const chunks = chunkText(text, 1000, 200);
            expect(chunks.length).toBe(1);
            expect(chunks[0]).toBe(text);
        });

        test('should chunk long text correctly', () => {
            const text = 'A'.repeat(2500);
            const chunks = chunkText(text, 1000, 200);

            // 2500자를 1000/200 오버랩으로 청킹하면 약 3개
            expect(chunks.length).toBe(3);
            expect(chunks[0].length).toBe(1000);
        });

        test('should apply overlap correctly', () => {
            const text = 'A'.repeat(1500);
            const chunks = chunkText(text, 1000, 200);

            // 첫 청크 끝 200자와 두 번째 청크 시작 200자가 겹쳐야 함
            expect(chunks[0].slice(-200)).toBe(chunks[1].slice(0, 200));
        });
    });

    describe('Title Extraction', () => {
        test('should extract title from markdown heading', () => {
            const content = '# My Title\n\nSome content here.';
            const title = extractTitle(content, 'fallback');
            expect(title).toBe('My Title');
        });

        test('should return fallback if no heading found', () => {
            const content = 'No heading here, just content.';
            const title = extractTitle(content, 'fallback-title');
            expect(title).toBe('fallback-title');
        });

        test('should handle heading with special characters', () => {
            const content = '# SSAL Works: AI 기반 프로젝트 관리\n\nContent';
            const title = extractTitle(content, 'fallback');
            expect(title).toBe('SSAL Works: AI 기반 프로젝트 관리');
        });
    });

    describe('Frontmatter Removal', () => {
        test('should remove YAML frontmatter', () => {
            const content = '---\ntitle: Test\ndate: 2026-01-01\n---\n\n# Content';
            const result = removeFrontmatter(content);
            expect(result).toBe('# Content');
        });

        test('should return content unchanged if no frontmatter', () => {
            const content = '# Just Content\n\nNo frontmatter here.';
            const result = removeFrontmatter(content);
            expect(result).toBe(content);
        });

        test('should handle empty frontmatter', () => {
            const content = '---\n---\n\nContent after empty frontmatter';
            const result = removeFrontmatter(content);
            expect(result).toBe('Content after empty frontmatter');
        });
    });
});
