/**
 * ============================================================
 * 학습콘텐츠 동기화 스크립트
 * ============================================================
 *
 * 목적: MD 파일 → HTML 변환 → GitHub Pages 배포 → Supabase DB 등록
 *
 * 사용법:
 *   node sync-learning-contents.js                    # 전체 동기화
 *   node sync-learning-contents.js --dry-run          # 변경 사항만 확인
 *   node sync-learning-contents.js --path="특정/경로" # 특정 폴더만 처리
 *   node sync-learning-contents.js --force            # 강제 전체 재등록
 *
 * 필수 환경 변수 (.env 파일):
 *   SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_ANON_KEY=eyJxxx...
 *   GITHUB_PAGES_BASE_URL=https://xxx.github.io/repo-name
 *
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================
// 설정
// ============================================================

const CONFIG = {
    // 소스 경로
    contentSourceDir: path.resolve(__dirname, '../../학습용_Books'),

    // 출력 경로 (GitHub Pages 배포용)
    htmlOutputDir: path.resolve(__dirname, '../Frontend/Prototype/pages/learning/contents'),

    // 템플릿 경로
    templatePath: path.resolve(__dirname, 'templates/learning-content.html'),

    // GitHub Pages 기본 URL (환경 변수에서 읽거나 기본값 사용)
    githubPagesBaseUrl: process.env.GITHUB_PAGES_BASE_URL || 'https://your-username.github.io/your-repo',

    // Supabase 설정 (환경 변수에서 읽음)
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_ANON_KEY || '',

    // 처리 옵션
    dryRun: false,
    forceSyncAll: false,
    targetPath: null
};

// ============================================================
// 명령행 인수 파싱
// ============================================================

function parseArgs() {
    const args = process.argv.slice(2);

    for (const arg of args) {
        if (arg === '--dry-run') {
            CONFIG.dryRun = true;
        } else if (arg === '--force') {
            CONFIG.forceSyncAll = true;
        } else if (arg.startsWith('--path=')) {
            CONFIG.targetPath = arg.substring(7);
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        }
    }
}

function printHelp() {
    console.log(`
학습콘텐츠 동기화 스크립트
==========================

사용법:
  node sync-learning-contents.js [옵션]

옵션:
  --dry-run          실제 저장 없이 변경 사항만 확인
  --force            모든 파일 강제 재처리 (해시 무시)
  --path="경로"      특정 폴더만 처리
  --help, -h         도움말 표시

예시:
  node sync-learning-contents.js
  node sync-learning-contents.js --dry-run
  node sync-learning-contents.js --path="1_웹개발_기초"
  node sync-learning-contents.js --force
`);
}

// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * 파일 내용의 MD5 해시 생성
 */
function getFileHash(content) {
    return crypto.createHash('md5').update(content, 'utf8').digest('hex');
}

/**
 * YAML Frontmatter 파싱
 */
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { metadata: null, body: content };
    }

    const yamlContent = match[1];
    const body = match[2];

    // 간단한 YAML 파싱 (라이브러리 없이)
    const metadata = {};
    const lines = yamlContent.split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        // 숫자 변환
        if (/^\d+$/.test(value)) {
            value = parseInt(value, 10);
        }

        // 배열 처리 (간단한 형태만)
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        }

        metadata[key] = value;
    }

    return { metadata, body };
}

/**
 * Markdown을 HTML로 변환 (간단한 변환기)
 */
function markdownToHtml(markdown) {
    let html = markdown;

    // 코드 블록 (```language ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // 인라인 코드 (`code`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 헤더 (## Header)
    html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

    // 굵은 글씨 (**bold**)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // 기울임 (*italic*)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 링크 [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // 이미지 ![alt](url)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%;">');

    // 순서 없는 목록
    html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');

    // 순서 있는 목록
    html = html.replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>');

    // 목록 그룹화 (연속된 <li> 태그를 <ul>로 감싸기)
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
        return '<ul>' + match.trim() + '</ul>';
    });

    // 인용 (> quote)
    html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');

    // 수평선 (---)
    html = html.replace(/^---$/gm, '<hr>');

    // 단락 (빈 줄로 구분)
    html = html.split(/\n\n+/).map(para => {
        para = para.trim();
        if (!para) return '';
        if (para.startsWith('<h') || para.startsWith('<ul') ||
            para.startsWith('<ol') || para.startsWith('<pre') ||
            para.startsWith('<blockquote') || para.startsWith('<hr')) {
            return para;
        }
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }).join('\n\n');

    return html;
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 디렉토리 내 모든 MD 파일 찾기
 */
function findMdFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) {
        console.warn(`경고: 디렉토리가 존재하지 않음 - ${dir}`);
        return fileList;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findMdFiles(filePath, fileList);
        } else if (file.endsWith('.md')) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

/**
 * 디렉토리 생성 (재귀적)
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// ============================================================
// HTML 템플릿 처리
// ============================================================

/**
 * HTML 템플릿 로드
 */
function loadTemplate() {
    if (fs.existsSync(CONFIG.templatePath)) {
        return fs.readFileSync(CONFIG.templatePath, 'utf8');
    }

    // 기본 템플릿
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} - SSAL Works 학습콘텐츠</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7;
            color: #333;
            background: #f8f9fa;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 24px;
        }

        .breadcrumb {
            font-size: 14px;
            color: #666;
            margin-bottom: 24px;
        }

        .breadcrumb span {
            color: #999;
            margin: 0 8px;
        }

        .content-header {
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e9ecef;
        }

        .content-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #212529;
            margin-bottom: 12px;
        }

        .content-header .description {
            font-size: 16px;
            color: #6c757d;
        }

        .content-body {
            background: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .content-body h1 { font-size: 28px; margin: 32px 0 16px; }
        .content-body h2 { font-size: 24px; margin: 28px 0 14px; color: #343a40; }
        .content-body h3 { font-size: 20px; margin: 24px 0 12px; color: #495057; }
        .content-body h4 { font-size: 18px; margin: 20px 0 10px; color: #6c757d; }

        .content-body p {
            margin-bottom: 16px;
        }

        .content-body ul, .content-body ol {
            margin: 16px 0;
            padding-left: 24px;
        }

        .content-body li {
            margin-bottom: 8px;
        }

        .content-body pre {
            background: #f1f3f4;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 16px 0;
        }

        .content-body code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
        }

        .content-body p code {
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .content-body blockquote {
            border-left: 4px solid #4ECDC4;
            padding-left: 16px;
            margin: 16px 0;
            color: #666;
            font-style: italic;
        }

        .content-body a {
            color: #4ECDC4;
            text-decoration: none;
        }

        .content-body a:hover {
            text-decoration: underline;
        }

        .content-body img {
            max-width: 100%;
            border-radius: 8px;
            margin: 16px 0;
        }

        .content-body hr {
            border: none;
            border-top: 1px solid #e9ecef;
            margin: 32px 0;
        }

        .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #e9ecef;
            font-size: 13px;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="breadcrumb">
            {{DEPTH1}}<span>/</span>{{DEPTH2}}{{DEPTH3_BREADCRUMB}}
        </div>

        <div class="content-header">
            <h1>{{TITLE}}</h1>
            <p class="description">{{DESCRIPTION}}</p>
        </div>

        <div class="content-body">
            {{CONTENT}}
        </div>

        <div class="footer">
            SSAL Works 학습콘텐츠 | 마지막 업데이트: {{UPDATE_DATE}}
        </div>
    </div>
</body>
</html>`;
}

/**
 * 템플릿에 데이터 적용
 */
function applyTemplate(template, data) {
    let html = template;

    html = html.replace(/\{\{TITLE\}\}/g, escapeHtml(data.title || '제목 없음'));
    html = html.replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(data.description || ''));
    html = html.replace(/\{\{DEPTH1\}\}/g, escapeHtml(data.depth1 || ''));
    html = html.replace(/\{\{DEPTH2\}\}/g, escapeHtml(data.depth2 || ''));
    html = html.replace(/\{\{DEPTH3_BREADCRUMB\}\}/g, data.depth3 ? `<span>/</span>${escapeHtml(data.depth3)}` : '');
    html = html.replace(/\{\{CONTENT\}\}/g, data.content);
    html = html.replace(/\{\{UPDATE_DATE\}\}/g, new Date().toISOString().split('T')[0]);

    return html;
}

// ============================================================
// Supabase API 호출
// ============================================================

/**
 * Supabase에서 기존 레코드 조회
 */
async function fetchExistingRecord(sourcePath) {
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) {
        console.warn('  ⚠️ Supabase 설정이 없어 DB 조회를 건너뜁니다.');
        return null;
    }

    const url = `${CONFIG.supabaseUrl}/rest/v1/learning_contents?source_path=eq.${encodeURIComponent(sourcePath)}&select=id,content_hash`;

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': CONFIG.supabaseKey,
                'Authorization': `Bearer ${CONFIG.supabaseKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error(`  ❌ DB 조회 오류: ${error.message}`);
        return null;
    }
}

/**
 * Supabase에 레코드 삽입
 */
async function insertRecord(record) {
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) {
        console.warn('  ⚠️ Supabase 설정이 없어 DB 삽입을 건너뜁니다.');
        return false;
    }

    const url = `${CONFIG.supabaseUrl}/rest/v1/learning_contents`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': CONFIG.supabaseKey,
                'Authorization': `Bearer ${CONFIG.supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(record)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return true;
    } catch (error) {
        console.error(`  ❌ DB 삽입 오류: ${error.message}`);
        return false;
    }
}

/**
 * Supabase 레코드 업데이트
 */
async function updateRecord(id, record) {
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) {
        console.warn('  ⚠️ Supabase 설정이 없어 DB 업데이트를 건너뜁니다.');
        return false;
    }

    const url = `${CONFIG.supabaseUrl}/rest/v1/learning_contents?id=eq.${id}`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': CONFIG.supabaseKey,
                'Authorization': `Bearer ${CONFIG.supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(record)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return true;
    } catch (error) {
        console.error(`  ❌ DB 업데이트 오류: ${error.message}`);
        return false;
    }
}

// ============================================================
// 파일 처리
// ============================================================

/**
 * 단일 MD 파일 처리
 */
async function processFile(filePath, index, total) {
    const relativePath = path.relative(CONFIG.contentSourceDir, filePath);
    const fileName = path.basename(filePath, '.md');

    console.log(`\n[${index}/${total}] ${relativePath}`);

    // 파일 읽기
    const content = fs.readFileSync(filePath, 'utf8');
    const contentHash = getFileHash(content);

    // Frontmatter 파싱
    const { metadata, body } = parseFrontmatter(content);

    if (!metadata) {
        console.log('  ⚠️ Frontmatter가 없습니다. 건너뜁니다.');
        return { status: 'skipped', reason: 'no_frontmatter' };
    }

    // 필수 필드 확인
    if (!metadata.depth1 || !metadata.title) {
        console.log('  ⚠️ 필수 필드(depth1, title)가 없습니다. 건너뜁니다.');
        return { status: 'skipped', reason: 'missing_required_fields' };
    }

    console.log(`  - depth1: ${metadata.depth1}`);
    console.log(`  - depth2: ${metadata.depth2 || '(없음)'}`);
    console.log(`  - depth3: ${metadata.depth3 || '(없음)'}`);
    console.log(`  - title: ${metadata.title}`);

    // 기존 레코드 확인 (해시 비교)
    const existingRecord = await fetchExistingRecord(relativePath);

    if (existingRecord && existingRecord.content_hash === contentHash && !CONFIG.forceSyncAll) {
        console.log('  ✓ 변경 없음 (해시 동일)');
        return { status: 'unchanged' };
    }

    // Dry run 모드
    if (CONFIG.dryRun) {
        console.log(`  📋 [DRY-RUN] ${existingRecord ? 'UPDATE' : 'INSERT'} 예정`);
        return { status: existingRecord ? 'would_update' : 'would_insert' };
    }

    // MD → HTML 변환
    const htmlContent = markdownToHtml(body);
    const template = loadTemplate();
    const fullHtml = applyTemplate(template, {
        title: metadata.title,
        description: metadata.description || '',
        depth1: metadata.depth1,
        depth2: metadata.depth2 || '',
        depth3: metadata.depth3 || '',
        content: htmlContent
    });

    // HTML 파일 저장
    const htmlFileName = fileName + '.html';
    const htmlSubDir = path.join(
        CONFIG.htmlOutputDir,
        sanitizePathComponent(metadata.depth1),
        metadata.depth2 ? sanitizePathComponent(metadata.depth2) : ''
    );

    ensureDir(htmlSubDir);
    const htmlFilePath = path.join(htmlSubDir, htmlFileName);
    fs.writeFileSync(htmlFilePath, fullHtml, 'utf8');
    console.log('  ✅ HTML 변환 완료');

    // GitHub Pages URL 생성
    const relativeHtmlPath = path.relative(
        path.resolve(__dirname, '../Frontend/Prototype'),
        htmlFilePath
    ).replace(/\\/g, '/');
    const url = `${CONFIG.githubPagesBaseUrl}/${relativeHtmlPath}`;

    // DB 레코드 준비
    const dbRecord = {
        depth1: metadata.depth1,
        depth2: metadata.depth2 || null,
        depth3: metadata.depth3 || null,
        title: metadata.title,
        description: metadata.description || null,
        url: url,
        display_order: metadata.display_order || 0,
        source_path: relativePath,
        content_hash: contentHash,
        is_active: true
    };

    // DB 저장/업데이트
    let dbSuccess = false;
    if (existingRecord) {
        dbSuccess = await updateRecord(existingRecord.id, dbRecord);
        if (dbSuccess) {
            console.log('  ✅ DB 업데이트 완료 (UPDATE)');
        }
    } else {
        dbSuccess = await insertRecord(dbRecord);
        if (dbSuccess) {
            console.log('  ✅ DB 등록 완료 (INSERT)');
        }
    }

    return {
        status: existingRecord ? 'updated' : 'inserted',
        dbSuccess
    };
}

/**
 * 경로 컴포넌트 sanitize
 */
function sanitizePathComponent(str) {
    return str
        .replace(/[<>:"/\\|?*]/g, '_')
        .replace(/\s+/g, '_')
        .trim();
}

// ============================================================
// 메인 실행
// ============================================================

async function main() {
    parseArgs();

    console.log('='.repeat(60));
    console.log('[학습콘텐츠 동기화 시작]');
    console.log('='.repeat(60));

    if (CONFIG.dryRun) {
        console.log('🔍 DRY-RUN 모드: 실제 변경 없이 확인만 수행합니다.\n');
    }

    if (CONFIG.forceSyncAll) {
        console.log('⚡ FORCE 모드: 모든 파일을 강제로 재처리합니다.\n');
    }

    // 소스 디렉토리 확인
    let scanDir = CONFIG.contentSourceDir;
    if (CONFIG.targetPath) {
        scanDir = path.join(CONFIG.contentSourceDir, CONFIG.targetPath);
    }

    console.log(`스캔 대상: ${scanDir}`);
    console.log('-'.repeat(60));

    // MD 파일 찾기
    const mdFiles = findMdFiles(scanDir);

    if (mdFiles.length === 0) {
        console.log('\n⚠️ 처리할 MD 파일이 없습니다.');
        console.log('학습용_Books/ 폴더에 .md 파일을 추가하세요.');
        return;
    }

    console.log(`발견된 MD 파일: ${mdFiles.length}개`);

    // 결과 통계
    const stats = {
        total: mdFiles.length,
        inserted: 0,
        updated: 0,
        unchanged: 0,
        skipped: 0,
        failed: 0
    };

    // 각 파일 처리
    for (let i = 0; i < mdFiles.length; i++) {
        const result = await processFile(mdFiles[i], i + 1, mdFiles.length);

        switch (result.status) {
            case 'inserted':
            case 'would_insert':
                stats.inserted++;
                break;
            case 'updated':
            case 'would_update':
                stats.updated++;
                break;
            case 'unchanged':
                stats.unchanged++;
                break;
            case 'skipped':
                stats.skipped++;
                break;
            default:
                stats.failed++;
        }
    }

    // 결과 출력
    console.log('\n' + '='.repeat(60));
    console.log('[동기화 완료]');
    console.log('='.repeat(60));
    console.log(`  - 처리된 파일: ${stats.total}개`);
    console.log(`  - 신규 등록: ${stats.inserted}개`);
    console.log(`  - 업데이트: ${stats.updated}개`);
    console.log(`  - 변경 없음: ${stats.unchanged}개`);
    console.log(`  - 건너뜀: ${stats.skipped}개`);
    console.log(`  - 실패: ${stats.failed}개`);

    if (CONFIG.dryRun) {
        console.log('\n📋 DRY-RUN 모드였습니다. 실제 변경을 적용하려면 --dry-run 옵션을 제거하세요.');
    }
}

// 실행
main().catch(error => {
    console.error('\n❌ 오류 발생:', error.message);
    process.exit(1);
});
