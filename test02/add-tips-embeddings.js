/**
 * 실전 Tips 임베딩 추가 스크립트
 * 기존 임베딩은 유지하고 Tips만 추가
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 환경 변수 로드
const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 검증
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 실전 Tips 경로
const TIPS_PATH = path.join(__dirname, '부수적_고유기능/콘텐츠/실전_Tips');
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const DELAY_MS = 150;

function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
    if (!text || text.length === 0) return [];
    if (text.length <= chunkSize) return [text];

    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start = end - overlap;
        if (start + overlap >= text.length) break;
    }

    return chunks;
}

function extractTitle(content, fallback) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : fallback;
}

function removeFrontmatter(content) {
    return content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
}

async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

function findMdFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;

    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            findMdFiles(fullPath, files);
        } else if (item.endsWith('.md')) {
            files.push(fullPath);
        }
    }

    return files;
}

async function processFile(filePath, stats) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');

    const cleanContent = removeFrontmatter(content);
    const title = extractTitle(content, fileName);
    const chunks = chunkText(cleanContent);
    const relativePath = path.relative(__dirname, filePath);

    console.log(`  📄 ${fileName} (${chunks.length} chunks)`);

    for (let i = 0; i < chunks.length; i++) {
        try {
            const embedding = await generateEmbedding(chunks[i]);

            const { error } = await supabase.from('content_embeddings').insert({
                content_type: 'tips',
                content_id: fileName,
                chunk_index: i,
                title: title,
                content: chunks[i],
                embedding: embedding,
                metadata: {
                    file_path: relativePath,
                    total_chunks: chunks.length
                }
            });

            if (error) {
                console.error(`    ❌ Chunk ${i + 1}: ${error.message}`);
                stats.errors++;
            } else {
                stats.chunks++;
            }

            await new Promise(resolve => setTimeout(resolve, DELAY_MS));

        } catch (err) {
            console.error(`    ❌ Chunk ${i + 1}: ${err.message}`);
            stats.errors++;
        }
    }

    stats.files++;
}

async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('  실전 Tips 임베딩 추가');
    console.log('═══════════════════════════════════════════════');
    console.log(`  경로: ${TIPS_PATH}`);
    console.log(`  청크 크기: ${CHUNK_SIZE}자`);
    console.log(`  모델: Gemini embedding-001`);
    console.log('═══════════════════════════════════════════════\n');

    if (!fs.existsSync(TIPS_PATH)) {
        console.error('❌ 실전 Tips 경로가 존재하지 않습니다.');
        process.exit(1);
    }

    const files = findMdFiles(TIPS_PATH);
    console.log(`📁 발견된 파일: ${files.length}개\n`);

    const stats = { files: 0, chunks: 0, errors: 0 };
    const startTime = Date.now();

    for (const file of files) {
        await processFile(file, stats);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n═══════════════════════════════════════════════');
    console.log('  완료!');
    console.log('═══════════════════════════════════════════════');
    console.log(`  처리된 파일: ${stats.files}개`);
    console.log(`  생성된 청크: ${stats.chunks}개`);
    console.log(`  오류: ${stats.errors}개`);
    console.log(`  소요 시간: ${elapsed}초`);
    console.log('═══════════════════════════════════════════════\n');
}

main().catch(console.error);
