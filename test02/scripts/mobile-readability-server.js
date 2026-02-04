/**
 * Mobile Readability Verification with HTTP Server
 * 작성일: 2025-12-24
 */

const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const iPhone12 = devices['iPhone 12'];
const screenshotDir = path.join(__dirname, '../screenshots-mobile');

if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

// 간단한 HTTP 서버 생성
function createServer(port = 8889) {
    const server = http.createServer((req, res) => {
        let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);

        // 확장자 확인
        const extname = path.extname(filePath);
        let contentType = 'text/html';

        if (extname === '.js') contentType = 'text/javascript';
        else if (extname === '.css') contentType = 'text/css';
        else if (extname === '.json') contentType = 'application/json';
        else if (extname === '.png') contentType = 'image/png';
        else if (extname === '.jpg') contentType = 'image/jpg';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error: ' + error.code);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });

    return new Promise((resolve) => {
        server.listen(port, () => {
            console.log(`🌐 HTTP Server running at http://localhost:${port}`);
            resolve(server);
        });
    });
}

async function analyzePage(page, pageName) {
    console.log(`\n📱 Analyzing ${pageName}...`);

    const analysis = await page.evaluate(() => {
        const results = {
            buttons: [],
            fontSizes: {},
            viewport: {},
            issues: [],
            navigation: {},
            contentStructure: {}
        };

        // 1. 버튼 분석
        const buttons = document.querySelectorAll('button, .btn, a.button, [role="button"], input[type="submit"]');
        buttons.forEach((btn, index) => {
            const rect = btn.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(btn);
            const width = rect.width;
            const height = rect.height;
            const isAccessible = width >= 44 && height >= 44;

            results.buttons.push({
                index,
                text: btn.textContent.trim().substring(0, 50) || btn.value || btn.title || 'No text',
                width: Math.round(width),
                height: Math.round(height),
                fontSize: computedStyle.fontSize,
                isAccessible,
                visible: rect.top < window.innerHeight && rect.bottom > 0
            });

            if (!isAccessible && (btn.textContent.trim().length > 0 || btn.value)) {
                results.issues.push(`버튼 터치 영역 부족: "${btn.textContent.trim().substring(0, 30) || btn.value}" (${Math.round(width)}x${Math.round(height)}px, 권장: 44x44px)`);
            }
        });

        // 2. 폰트 크기 분석
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, li, td, th');
        const fontSizeCount = {};
        const smallTextElements = [];

        textElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            const fontSize = parseFloat(computedStyle.fontSize);
            const text = el.textContent.trim();

            if (fontSize > 0 && text.length > 0) {
                const key = `${fontSize}px`;
                fontSizeCount[key] = (fontSizeCount[key] || 0) + 1;

                // 너무 작은 폰트 체크 (14px 미만 권장)
                if (fontSize < 14 && text.length > 10) {
                    smallTextElements.push({ fontSize, text: text.substring(0, 50) });
                }
            }
        });
        results.fontSizes = fontSizeCount;

        if (smallTextElements.length > 0) {
            results.issues.push(`가독성 낮은 텍스트 ${smallTextElements.length}개 발견 (14px 미만)`);
        }

        // 3. 뷰포트 정보
        results.viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            scrollWidth: document.documentElement.scrollWidth,
            scrollHeight: document.documentElement.scrollHeight,
            hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };

        if (results.viewport.hasHorizontalScroll) {
            results.issues.push(`가로 스크롤 발생 (페이지 너비: ${results.viewport.scrollWidth}px, 뷰포트: ${results.viewport.width}px)`);
        }

        // 4. 네비게이션 분석
        const nav = document.querySelector('nav, [role="navigation"], .navigation, .nav');
        if (nav) {
            const navRect = nav.getBoundingClientRect();
            results.navigation = {
                exists: true,
                visible: navRect.top < window.innerHeight,
                height: Math.round(navRect.height),
                position: window.getComputedStyle(nav).position
            };
        }

        // 5. 핵심 콘텐츠 위치 (fold 위)
        const mainContent = document.querySelector('main, [role="main"], .main-content, .content');
        if (mainContent) {
            const contentRect = mainContent.getBoundingClientRect();
            results.contentStructure = {
                startsAboveFold: contentRect.top < window.innerHeight,
                topPosition: Math.round(contentRect.top)
            };
        }

        // 6. 콘텐츠 오버플로우 체크
        const overflowElements = [];
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 5) {
                const tag = el.tagName.toLowerCase();
                const cls = el.className ? `.${el.className.split(' ')[0]}` : '';
                overflowElements.push(`${tag}${cls}`);
            }
        });

        if (overflowElements.length > 0) {
            results.issues.push(`콘텐츠 오버플로우 ${overflowElements.length}개 요소`);
        }

        return results;
    });

    // 결과 출력
    console.log('\n📊 검증 결과:');
    console.log(`- 가로 스크롤: ${analysis.viewport.hasHorizontalScroll ? '❌ 발생함' : '✅ 없음'}`);
    console.log(`- 뷰포트: ${analysis.viewport.width}x${analysis.viewport.height}px`);
    console.log(`- 콘텐츠 크기: ${analysis.viewport.scrollWidth}x${analysis.viewport.scrollHeight}px`);

    console.log('\n📝 폰트 크기 분포:');
    const sortedFonts = Object.entries(analysis.fontSizes)
        .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    sortedFonts.forEach(([size, count]) => {
        const sizeNum = parseFloat(size);
        const status = sizeNum < 14 ? '⚠️' : sizeNum >= 16 ? '✅' : '➖';
        console.log(`   ${status} ${size}: ${count}개 ${sizeNum < 14 ? '(권장: 14px 이상)' : ''}`);
    });

    console.log('\n🔘 버튼 터치 영역:');
    const accessibleButtons = analysis.buttons.filter(b => b.isAccessible).length;
    const totalButtons = analysis.buttons.length;
    const percentage = totalButtons > 0 ? Math.round((accessibleButtons / totalButtons) * 100) : 0;
    console.log(`   ${percentage >= 80 ? '✅' : percentage >= 50 ? '⚠️' : '❌'} ${accessibleButtons}/${totalButtons} 버튼이 터치 가능 (${percentage}%)`);

    analysis.buttons.slice(0, 15).forEach(btn => {
        const status = btn.isAccessible ? '✅' : '❌';
        console.log(`   ${status} "${btn.text}" (${btn.width}x${btn.height}px)${btn.visible ? '' : ' [화면 밖]'}`);
    });

    if (analysis.navigation.exists) {
        console.log('\n🧭 네비게이션:');
        console.log(`   ${analysis.navigation.visible ? '✅' : '❌'} 초기 화면에서 ${analysis.navigation.visible ? '보임' : '안 보임'}`);
        console.log(`   높이: ${analysis.navigation.height}px`);
    }

    if (analysis.issues.length > 0) {
        console.log('\n⚠️ 발견된 문제:');
        analysis.issues.forEach((issue, i) => {
            if (i < 15) console.log(`   ${i + 1}. ${issue}`);
        });
        if (analysis.issues.length > 15) {
            console.log(`   ... 외 ${analysis.issues.length - 15}개 문제`);
        }
    } else {
        console.log('\n✅ 문제 없음!');
    }

    return {
        pageName,
        analysis,
        timestamp: new Date().toISOString()
    };
}

async function main() {
    console.log('🚀 Mobile Readability Verification 시작...');
    console.log(`📱 디바이스: iPhone 12 (${iPhone12.viewport.width}x${iPhone12.viewport.height})`);

    // HTTP 서버 시작
    const server = await createServer(8889);

    // 브라우저 시작
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        ...iPhone12,
        locale: 'ko-KR'
    });
    const page = await context.newPage();

    const results = [];
    const pages = ['index.html', 'viewer.html', 'manual.html'];

    for (const pageName of pages) {
        try {
            console.log('\n' + '='.repeat(60));
            console.log(`${pages.indexOf(pageName) + 1}. ${pageName}`);
            console.log('='.repeat(60));

            await page.goto(`http://localhost:8889/${pageName}`, {
                waitUntil: 'networkidle',
                timeout: 30000
            });
            await page.waitForTimeout(2000);

            // 스크린샷
            const baseName = pageName.replace('.html', '');
            await page.screenshot({
                path: path.join(screenshotDir, `${baseName}-full.png`),
                fullPage: true
            });
            await page.screenshot({
                path: path.join(screenshotDir, `${baseName}-viewport.png`),
                fullPage: false
            });

            const result = await analyzePage(page, pageName);
            results.push(result);
        } catch (error) {
            console.error(`❌ ${pageName} 검증 실패:`, error.message);
        }
    }

    // 브라우저 종료
    await browser.close();

    // 서버 종료
    server.close();

    // 결과 저장
    const reportPath = path.join(screenshotDir, 'mobile-readability-report.json');
    const totalIssues = results.reduce((sum, r) => sum + r.analysis.issues.length, 0);

    fs.writeFileSync(reportPath, JSON.stringify({
        device: 'iPhone 12',
        viewport: iPhone12.viewport,
        results,
        summary: {
            totalPages: results.length,
            pagesWithHorizontalScroll: results.filter(r => r.analysis.viewport.hasHorizontalScroll).length,
            totalIssues,
            averageButtonAccessibility: Math.round(
                results.reduce((sum, r) => {
                    const total = r.analysis.buttons.length;
                    const accessible = r.analysis.buttons.filter(b => b.isAccessible).length;
                    return sum + (total > 0 ? accessible / total : 0);
                }, 0) / results.length * 100
            )
        },
        timestamp: new Date().toISOString()
    }, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('✅ 검증 완료!');
    console.log(`📁 스크린샷: ${screenshotDir}`);
    console.log(`📄 리포트: ${reportPath}`);
    console.log('='.repeat(60));

    // 종합 요약
    console.log('\n📋 종합 요약:');
    console.log(`\n총 검증 페이지: ${results.length}`);
    console.log(`총 발견 문제: ${totalIssues}개`);

    results.forEach(result => {
        const accessibleButtons = result.analysis.buttons.filter(b => b.isAccessible).length;
        const totalButtons = result.analysis.buttons.length;
        const percentage = totalButtons > 0 ? Math.round((accessibleButtons / totalButtons) * 100) : 0;

        console.log(`\n${result.pageName}:`);
        console.log(`  - 가로 스크롤: ${result.analysis.viewport.hasHorizontalScroll ? '❌ 발생' : '✅ 없음'}`);
        console.log(`  - 발견 문제: ${result.analysis.issues.length}개`);
        console.log(`  - 버튼 접근성: ${percentage}% (${accessibleButtons}/${totalButtons})`);
        console.log(`  - 최소 폰트: ${Math.min(...Object.keys(result.analysis.fontSizes).map(s => parseFloat(s)))}`);
    });

    // 개선 제안
    if (totalIssues > 0) {
        console.log('\n\n💡 개선 제안:');
        console.log('1. 버튼 크기: 최소 44x44px 권장 (Apple Human Interface Guidelines)');
        console.log('2. 폰트 크기: 본문 텍스트 최소 14-16px 권장');
        console.log('3. 터치 간격: 버튼 사이 최소 8px 간격 유지');
        console.log('4. 가로 스크롤: max-width: 100%, overflow-x: hidden 적용');
    }
}

main().catch(console.error);
