/**
 * Mobile Readability Verification Script
 * 작성일: 2025-12-24
 *
 * iPhone 12 에뮬레이션으로 모바일 가독성 검증
 */

const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

// iPhone 12 설정
const iPhone12 = devices['iPhone 12'];

// 스크린샷 저장 디렉토리
const screenshotDir = path.join(__dirname, '../screenshots-mobile');

// 디렉토리 생성
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

async function analyzePage(page, pageName) {
    console.log(`\n📱 Analyzing ${pageName}...`);

    // 가로 스크롤 확인
    const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    // 주요 요소 검증
    const analysis = await page.evaluate(() => {
        const results = {
            buttons: [],
            fontSizes: {},
            viewport: {},
            issues: []
        };

        // 1. 버튼 분석
        const buttons = document.querySelectorAll('button, .btn, a.button, [role="button"]');
        buttons.forEach((btn, index) => {
            const rect = btn.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(btn);
            const width = rect.width;
            const height = rect.height;
            const isAccessible = width >= 44 && height >= 44;

            results.buttons.push({
                index,
                text: btn.textContent.trim().substring(0, 50),
                width: Math.round(width),
                height: Math.round(height),
                fontSize: computedStyle.fontSize,
                isAccessible,
                className: btn.className
            });

            if (!isAccessible && btn.textContent.trim().length > 0) {
                results.issues.push(`버튼 ${index} "${btn.textContent.trim().substring(0, 30)}" 터치 영역 부족: ${Math.round(width)}x${Math.round(height)}px`);
            }
        });

        // 2. 폰트 크기 분석
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, li');
        const fontSizeCount = {};
        textElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            const fontSize = parseFloat(computedStyle.fontSize);
            if (fontSize > 0 && el.textContent.trim().length > 0) {
                const key = `${fontSize}px`;
                fontSizeCount[key] = (fontSizeCount[key] || 0) + 1;

                // 너무 작은 폰트 체크 (12px 미만)
                if (fontSize < 12 && el.textContent.trim().length > 10) {
                    results.issues.push(`텍스트 가독성 낮음: ${fontSize}px - "${el.textContent.trim().substring(0, 30)}"`);
                }
            }
        });
        results.fontSizes = fontSizeCount;

        // 3. 뷰포트 정보
        results.viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            scrollWidth: document.documentElement.scrollWidth,
            scrollHeight: document.documentElement.scrollHeight
        };

        // 4. 콘텐츠 오버플로우 체크
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 10) {
                results.issues.push(`콘텐츠 오버플로우: ${el.tagName}.${el.className} (${Math.round(rect.right)}px)`);
            }
        });

        return results;
    });

    // 결과 출력
    console.log('\n📊 검증 결과:');
    console.log(`- 가로 스크롤: ${hasHorizontalScroll ? '❌ 발생함' : '✅ 없음'}`);
    console.log(`- 뷰포트: ${analysis.viewport.width}x${analysis.viewport.height}px`);
    console.log(`- 스크롤 영역: ${analysis.viewport.scrollWidth}x${analysis.viewport.scrollHeight}px`);

    console.log('\n📝 폰트 크기 분포:');
    const sortedFonts = Object.entries(analysis.fontSizes)
        .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    sortedFonts.forEach(([size, count]) => {
        const status = parseFloat(size) < 12 ? '⚠️' : '✅';
        console.log(`   ${status} ${size}: ${count}개`);
    });

    console.log('\n🔘 버튼 터치 영역:');
    const accessibleButtons = analysis.buttons.filter(b => b.isAccessible).length;
    const totalButtons = analysis.buttons.length;
    console.log(`   ${accessibleButtons}/${totalButtons} 버튼이 터치 가능 (44x44px 이상)`);

    analysis.buttons.slice(0, 10).forEach(btn => {
        const status = btn.isAccessible ? '✅' : '❌';
        console.log(`   ${status} "${btn.text}" (${btn.width}x${btn.height}px)`);
    });

    if (analysis.issues.length > 0) {
        console.log('\n⚠️ 발견된 문제:');
        analysis.issues.slice(0, 10).forEach(issue => {
            console.log(`   - ${issue}`);
        });
        if (analysis.issues.length > 10) {
            console.log(`   ... 외 ${analysis.issues.length - 10}개 문제`);
        }
    }

    return {
        pageName,
        hasHorizontalScroll,
        analysis,
        timestamp: new Date().toISOString()
    };
}

async function main() {
    console.log('🚀 Mobile Readability Verification 시작...');
    console.log(`📱 디바이스: iPhone 12 (${iPhone12.viewport.width}x${iPhone12.viewport.height})`);

    // 브라우저 시작
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        ...iPhone12,
        locale: 'ko-KR'
    });
    const page = await context.newPage();

    const results = [];

    // 1. index.html 검증
    try {
        console.log('\n' + '='.repeat(60));
        console.log('1. index.html - 메인 대시보드');
        console.log('='.repeat(60));

        await page.goto('file:///C:/!SSAL_Works_Private/Production/index.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        await page.waitForTimeout(2000);

        // 스크린샷
        await page.screenshot({
            path: path.join(screenshotDir, 'index-full.png'),
            fullPage: true
        });
        await page.screenshot({
            path: path.join(screenshotDir, 'index-viewport.png'),
            fullPage: false
        });

        const result = await analyzePage(page, 'index.html');
        results.push(result);
    } catch (error) {
        console.error('❌ index.html 검증 실패:', error.message);
    }

    // 2. viewer.html 검증
    try {
        console.log('\n' + '='.repeat(60));
        console.log('2. viewer.html - 뷰어 페이지');
        console.log('='.repeat(60));

        await page.goto('file:///C:/!SSAL_Works_Private/Production/viewer.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(screenshotDir, 'viewer-full.png'),
            fullPage: true
        });
        await page.screenshot({
            path: path.join(screenshotDir, 'viewer-viewport.png'),
            fullPage: false
        });

        const result = await analyzePage(page, 'viewer.html');
        results.push(result);
    } catch (error) {
        console.error('❌ viewer.html 검증 실패:', error.message);
    }

    // 3. manual.html 검증
    try {
        console.log('\n' + '='.repeat(60));
        console.log('3. manual.html - 매뉴얼 페이지');
        console.log('='.repeat(60));

        await page.goto('file:///C:/!SSAL_Works_Private/Production/manual.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(screenshotDir, 'manual-full.png'),
            fullPage: true
        });
        await page.screenshot({
            path: path.join(screenshotDir, 'manual-viewport.png'),
            fullPage: false
        });

        const result = await analyzePage(page, 'manual.html');
        results.push(result);
    } catch (error) {
        console.error('❌ manual.html 검증 실패:', error.message);
    }

    // 브라우저 종료
    await browser.close();

    // 결과 저장
    const reportPath = path.join(screenshotDir, 'mobile-readability-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
        device: 'iPhone 12',
        viewport: iPhone12.viewport,
        results,
        summary: {
            totalPages: results.length,
            pagesWithHorizontalScroll: results.filter(r => r.hasHorizontalScroll).length,
            totalIssues: results.reduce((sum, r) => sum + r.analysis.issues.length, 0)
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
    results.forEach(result => {
        console.log(`\n${result.pageName}:`);
        console.log(`  - 가로 스크롤: ${result.hasHorizontalScroll ? '❌' : '✅'}`);
        console.log(`  - 발견된 문제: ${result.analysis.issues.length}개`);
        console.log(`  - 터치 가능 버튼: ${result.analysis.buttons.filter(b => b.isAccessible).length}/${result.analysis.buttons.length}`);
    });
}

main().catch(console.error);
