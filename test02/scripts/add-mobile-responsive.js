/**
 * 모든 주요 HTML 페이지에 모바일 반응형 요소 추가
 */
const fs = require('fs');
const path = require('path');

const PRODUCTION_DIR = path.join(__dirname, '..');

// 수정할 페이지 목록 (레이아웃이 있는 페이지들)
const PAGES_TO_MODIFY = [
    'manual.html',
    'viewer.html',
    'pages/admin-dashboard.html',
    'books-viewer.html',
    'learning-viewer.html',
    'tips-viewer.html',
    'pages/manual/index.html'
];

// 추가할 CSS 링크
const CSS_LINK = '<link rel="stylesheet" href="/assets/css/responsive.css">';

// 추가할 오버레이와 모바일 버튼
const OVERLAY_HTML = '<div class="sidebar-overlay" onclick="closeSidebar()"></div>';

const MOBILE_BTN_HTML = '<button class="mobile-menu-btn" onclick="toggleSidebar()">☰</button>';

// 추가할 JavaScript
const JS_CODE = `
<script>
// 모바일 반응형 사이드바 토글
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) {
        sidebar.classList.remove('open');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ESC 키로 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSidebar();
    }
});
</script>
`;

function processFile(filePath) {
    const fullPath = path.join(PRODUCTION_DIR, filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`❌ 파일 없음: ${filePath}`);
        return false;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    let modified = false;

    // 1. responsive.css 링크 추가 (없으면)
    if (!content.includes('responsive.css')) {
        content = content.replace('</head>', `    ${CSS_LINK}\n</head>`);
        modified = true;
        console.log(`  + responsive.css 추가`);
    }

    // 2. 오버레이 추가 (없으면)
    if (!content.includes('sidebar-overlay')) {
        content = content.replace('<body>', `<body>\n    ${OVERLAY_HTML}`);
        modified = true;
        console.log(`  + sidebar-overlay 추가`);
    }

    // 3. 모바일 버튼 추가 (헤더에)
    if (!content.includes('mobile-menu-btn')) {
        // 헤더 내부에 추가 시도
        if (content.includes('<div class="header">') || content.includes('class="header"')) {
            // header 시작 후 첫 번째 > 다음에 추가
            content = content.replace(
                /(<(?:div|header)[^>]*class="[^"]*header[^"]*"[^>]*>)/,
                `$1\n        ${MOBILE_BTN_HTML}`
            );
            modified = true;
            console.log(`  + mobile-menu-btn 추가 (헤더)`);
        }
    }

    // 4. JavaScript 추가 (없으면)
    if (!content.includes('toggleSidebar') && !content.includes('toggleLeftSidebar')) {
        content = content.replace('</body>', `${JS_CODE}\n</body>`);
        modified = true;
        console.log(`  + JavaScript 추가`);
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`✅ 수정됨: ${filePath}`);
        return true;
    } else {
        console.log(`⏭️ 이미 적용됨: ${filePath}`);
        return false;
    }
}

console.log('=== 모바일 반응형 요소 추가 시작 ===\n');

let modifiedCount = 0;
for (const page of PAGES_TO_MODIFY) {
    console.log(`처리 중: ${page}`);
    if (processFile(page)) {
        modifiedCount++;
    }
    console.log('');
}

console.log(`=== 완료: ${modifiedCount}개 파일 수정됨 ===`);
