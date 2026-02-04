/**
 * Single Page Mobile Test
 */

const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const iPhone12 = devices['iPhone 12'];
const screenshotDir = path.join(__dirname, '../screenshots-mobile');

function createServer(port = 8890) {
    const server = http.createServer((req, res) => {
        let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);

        const extname = path.extname(filePath);
        let contentType = 'text/html';

        if (extname === '.js') contentType = 'text/javascript';
        else if (extname === '.css') contentType = 'text/css';
        else if (extname === '.json') contentType = 'application/json';
        else if (extname === '.png') contentType = 'image/png';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });

    return new Promise((resolve) => {
        server.listen(port, () => {
            console.log(`🌐 Server: http://localhost:${port}`);
            resolve(server);
        });
    });
}

async function testPage(pageName) {
    const server = await createServer(8890);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        ...iPhone12,
        locale: 'ko-KR'
    });
    const page = await context.newPage();

    try {
        console.log(`\nTesting ${pageName}...`);

        // 더 긴 타임아웃과 load 대신 domcontentloaded 사용
        await page.goto(`http://localhost:8890/${pageName}`, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        // 더 긴 대기 시간
        await page.waitForTimeout(5000);

        const baseName = pageName.replace('.html', '');

        // 스크린샷
        await page.screenshot({
            path: path.join(screenshotDir, `${baseName}-full.png`),
            fullPage: true
        });

        await page.screenshot({
            path: path.join(screenshotDir, `${baseName}-viewport.png`),
            fullPage: false
        });

        // 간단한 분석
        const analysis = await page.evaluate(() => {
            const buttons = document.querySelectorAll('button, .btn, a.button');
            const buttonData = [];
            buttons.forEach((btn, i) => {
                const rect = btn.getBoundingClientRect();
                buttonData.push({
                    index: i,
                    text: btn.textContent.trim().substring(0, 30),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    accessible: rect.width >= 44 && rect.height >= 44
                });
            });

            return {
                buttons: buttonData,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    scrollWidth: document.documentElement.scrollWidth,
                    scrollHeight: document.documentElement.scrollHeight
                }
            };
        });

        console.log('\n결과:');
        console.log(`- 뷰포트: ${analysis.viewport.width}x${analysis.viewport.height}px`);
        console.log(`- 총 버튼: ${analysis.buttons.length}개`);
        console.log(`- 접근 가능 버튼: ${analysis.buttons.filter(b => b.accessible).length}개`);

        console.log('\n✅ 완료!');
        console.log(`📁 ${screenshotDir}/${baseName}-*.png`);

    } catch (error) {
        console.error('❌ 오류:', error.message);
    } finally {
        await browser.close();
        server.close();
    }
}

const pageName = process.argv[2] || 'index.html';
testPage(pageName).catch(console.error);
