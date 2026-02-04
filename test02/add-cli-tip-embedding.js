const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'P3_프로토타입_제작/Database/.env.local');
require('dotenv').config({ path: envPath });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

function chunkText(text, maxChars = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + maxChars, text.length);
        chunks.push(text.substring(start, end));
        start = end - overlap;

        if (start >= text.length - overlap) break;
    }

    return chunks;
}

async function addCLITipEmbedding() {
    console.log('═══════════════════════════════════════════════');
    console.log('  CLI Tips 문서 임베딩 생성');
    console.log('═══════════════════════════════════════════════\n');

    const filePath = path.join(__dirname, '부수적_고유기능/콘텐츠/실전_Tips/웹개발_기초개념/CLI란_무엇인가_그리고_주요_CLI_도구들.md');

    if (!fs.existsSync(filePath)) {
        console.error(`❌ 파일을 찾을 수 없습니다: ${filePath}`);
        return;
    }

    console.log(`📄 파일: CLI란_무엇인가_그리고_주요_CLI_도구들.md\n`);

    const content = fs.readFileSync(filePath, 'utf-8');

    // 제목 추출
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'CLI란 무엇인가 그리고 주요 CLI 도구들';

    console.log(`📌 제목: ${title}`);
    console.log(`📏 파일 크기: ${content.length} 자\n`);

    // 청크 생성
    const chunks = chunkText(content, 1000, 200);
    console.log(`🔪 청크 수: ${chunks.length}개\n`);

    // 기존 임베딩 삭제
    console.log('🗑️  기존 임베딩 삭제 중...');
    const { error: deleteError } = await supabase
        .from('content_embeddings')
        .delete()
        .eq('content_type', 'tips')
        .eq('content_id', 'CLI란_무엇인가_그리고_주요_CLI_도구들');

    if (deleteError) {
        console.error('삭제 에러:', deleteError.message);
    } else {
        console.log('✅ 기존 임베딩 삭제 완료\n');
    }

    // 임베딩 생성 및 저장
    console.log('🔄 임베딩 생성 및 저장 중...\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        try {
            // 임베딩 생성
            const embedding = await generateEmbedding(chunk);

            // DB에 저장
            const { error: insertError } = await supabase
                .from('content_embeddings')
                .insert({
                    content_type: 'tips',
                    content_id: 'CLI란_무엇인가_그리고_주요_CLI_도구들',
                    title: title,
                    content: chunk,
                    chunk_index: i,
                    embedding: embedding,
                    metadata: {
                        total_chunks: chunks.length
                    }
                });

            if (insertError) {
                console.error(`❌ 청크 ${i + 1}/${chunks.length} 저장 실패:`, insertError.message);
                errorCount++;
            } else {
                console.log(`✅ 청크 ${i + 1}/${chunks.length} 저장 완료`);
                successCount++;
            }

            // API 요청 제한 회피 (0.5초 대기)
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(`❌ 청크 ${i + 1}/${chunks.length} 처리 실패:`, error.message);
            errorCount++;
        }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('  완료!');
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ 성공: ${successCount}개 청크`);
    console.log(`❌ 실패: ${errorCount}개 청크`);
    console.log('═══════════════════════════════════════════════\n');
}

addCLITipEmbedding().catch(console.error);
