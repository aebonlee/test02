// Puppeteer로 브라우저 테스트
const puppeteer = require('puppeteer');
const path = require('path');

async function testNoticesInBrowser() {
    console.log('');
    console.log('═'.repeat(80));
    console.log('  브라우저 자동 테스트 시작');
    console.log('═'.repeat(80));
    console.log('');

    let browser;
    try {
        // Puppeteer 브라우저 시작
        console.log('🌐 브라우저 시작 중...');
        browser = await puppeteer.launch({
            headless: false, // 화면 보이게
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // 콘솔 메시지 캡처
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            if (type === 'error') {
                console.log(`   [브라우저 ERROR] ${text}`);
            } else if (type === 'warn') {
                console.log(`   [브라우저 WARN] ${text}`);
            } else {
                console.log(`   [브라우저 LOG] ${text}`);
            }
        });

        // 페이지 오류 캡처
        page.on('pageerror', error => {
            console.error(`   [페이지 오류] ${error.message}`);
        });

        // 테스트 페이지 열기
        const testFile = path.join(__dirname, 'test_supabase_direct.html');
        console.log('📄 테스트 페이지 로드 중:', testFile);
        await page.goto(`file:///${testFile.replace(/\\/g, '/')}`);

        // 5초 대기 (Supabase 응답 대기)
        console.log('⏳ Supabase 응답 대기 중 (5초)...');
        await page.waitForTimeout(5000);

        // 결과 가져오기
        const result = await page.$eval('#result', el => el.textContent);

        console.log('');
        console.log('═'.repeat(80));
        console.log('  테스트 결과');
        console.log('═'.repeat(80));
        console.log(result);
        console.log('═'.repeat(80));
        console.log('');

        // 스크린샷 저장
        await page.screenshot({ path: 'test_result.png', fullPage: true });
        console.log('📸 스크린샷 저장: test_result.png');
        console.log('');

        // 10초 후 종료
        console.log('⏳ 10초 후 브라우저 종료...');
        await page.waitForTimeout(10000);

    } catch (error) {
        console.error('');
        console.error('❌ 테스트 실패:', error.message);
        console.error(error.stack);
    } finally {
        if (browser) {
            await browser.close();
            console.log('✅ 브라우저 종료');
        }
    }
}

testNoticesInBrowser();
