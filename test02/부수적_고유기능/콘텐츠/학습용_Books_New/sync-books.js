/**
 * Books 동기화 스크립트
 *
 * 각 권 폴더의 파일을 읽어서 viewer.html을 자동 업데이트합니다.
 * - 상단 개수 (총 XX편)
 * - 목차 개수 (XX편)
 * - BOOKS_DATA 파일 목록
 *
 * 사용법: node sync-books.js
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const BOOKS_DIR = __dirname;

const BOOKS = [
    {
        id: 'book1',
        name: '1권: Claude/Claude Code 사용법',
        folder: '1권_Claude_ClaudeCode_사용법'
    },
    {
        id: 'book2',
        name: '2권: 풀스택 웹사이트 개발 기초지식',
        folder: '2권_풀스택_웹사이트_개발_기초지식'
    },
    {
        id: 'book3',
        name: '3권: 프로젝트 관리 방법',
        folder: '3권_프로젝트_관리_방법'
    }
];

// 각 권의 파일 목록 읽기
function loadBookFiles() {
    const result = {};
    let totalCount = 0;

    BOOKS.forEach(book => {
        const folderPath = path.join(BOOKS_DIR, book.folder);
        const files = fs.readdirSync(folderPath)
            .filter(f => f.endsWith('.md'))
            .sort();

        result[book.id] = {
            name: book.name,
            folder: book.folder,
            files: files
        };
        totalCount += files.length;

        console.log(`   ${book.name}: ${files.length}편`);
    });

    return { books: result, totalCount };
}

// BOOKS_DATA 문자열 생성
function generateBooksData(books) {
    let lines = [];

    Object.entries(books).forEach(([bookId, bookData], idx) => {
        const comma = idx < Object.keys(books).length - 1 ? ',' : '';
        lines.push(`            '${bookId}': {`);
        lines.push(`                name: '${bookData.name}',`);
        lines.push(`                folder: '${bookData.folder}',`);
        lines.push(`                files: [`);

        bookData.files.forEach((file, fIdx) => {
            const fComma = fIdx < bookData.files.length - 1 ? ',' : '';
            lines.push(`                    '${file}'${fComma}`);
        });

        lines.push(`                ]`);
        lines.push(`            }${comma}`);
    });

    return lines.join('\n');
}

// viewer.html 업데이트
function updateViewerFile(totalCount, booksData) {
    const viewerPath = path.join(BOOKS_DIR, 'viewer.html');

    if (!fs.existsSync(viewerPath)) {
        console.log(`  ⚠️ 파일 없음: viewer.html`);
        return false;
    }

    let content = fs.readFileSync(viewerPath, 'utf8');
    let updated = false;

    // 1. 상단 "(총 XX편)" 업데이트
    const totalPattern = /\(총 \d+편\)/g;
    if (totalPattern.test(content)) {
        content = content.replace(totalPattern, `(총 ${totalCount}편)`);
        console.log(`  ✅ 총 편수 업데이트: ${totalCount}편`);
        updated = true;
    }

    // 2. 목차 "(XX편)" 업데이트
    const tocPattern = /목차 \(\d+편\)/;
    if (tocPattern.test(content)) {
        content = content.replace(tocPattern, `목차 (${totalCount}편)`);
        console.log(`  ✅ 목차 편수 업데이트: ${totalCount}편`);
    }

    // 3. BOOKS 객체 교체
    const dataPattern = /const BOOKS = \{[\s\S]*?\n        \};/;
    const replacement = `const BOOKS = {\n${booksData}\n        };`;

    if (dataPattern.test(content)) {
        content = content.replace(dataPattern, replacement);
        console.log(`  ✅ BOOKS_DATA 업데이트 완료`);
        updated = true;
    } else {
        console.log(`  ⚠️ BOOKS_DATA 패턴 못 찾음`);
    }

    if (updated) {
        fs.writeFileSync(viewerPath, content, 'utf8');
        console.log(`  ✅ viewer.html 저장 완료`);
    }

    return updated;
}

// 메인 실행
function main() {
    console.log('');
    console.log('🔄 Books 동기화 시작...');
    console.log('');

    // 1. 파일 목록 로드
    console.log('📄 각 권 폴더에서 파일 읽기...');
    const { books, totalCount } = loadBookFiles();
    console.log(`   ────────────────`);
    console.log(`   총 ${totalCount}편`);
    console.log('');

    // 2. BOOKS_DATA 생성
    const booksData = generateBooksData(books);

    // 3. viewer.html 업데이트
    console.log('📝 viewer.html 업데이트...');
    updateViewerFile(totalCount, booksData);

    console.log('');
    console.log('✅ 동기화 완료!');
    console.log('');
}

main();
