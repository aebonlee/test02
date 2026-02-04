/**
 * AI Tutor 화면 캡처 → PPT 생성 스크립트
 *
 * 사용법: node scripts/capture-ai-tutor-ppt.js
 */

const { chromium } = require('playwright');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

async function captureAndCreatePpt() {
    // AI Tutor 실제 페이지 URL (iframe에서 로드되는 페이지)
    const url = 'https://aitalker.co.kr/biz019';
    const outputDir = path.join(__dirname, '..', 'Human_ClaudeCode_Bridge', 'Reports');
    const screenshotPath = path.join(outputDir, 'AI_Tutor_Screenshot.png');
    const pptPath = path.join(outputDir, 'AI_Tutor_수정사항.pptx');

    // 출력 디렉토리 확인
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('📸 AI Tutor 화면 캡처 중...');
    console.log(`   URL: ${url}`);

    // 1. 스크린샷 캡처
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    try {
        await page.goto(url, {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // 페이지 로딩 대기
        await page.waitForTimeout(2000);

        // 스크린샷 촬영
        await page.screenshot({
            path: screenshotPath,
            fullPage: false
        });

        console.log(`✅ 스크린샷 저장: ${screenshotPath}`);

    } catch (error) {
        console.error('❌ 스크린샷 캡처 실패:', error.message);
        await browser.close();
        return;
    }

    await browser.close();

    // 2. PPT 생성
    console.log('\n📊 PPT 생성 중...');

    const pptx = new PptxGenJS();
    pptx.author = 'SSAL Works';
    pptx.title = 'AI Tutor UI 수정 사항';
    pptx.subject = 'UI 개선 요청';

    // 슬라이드 1: 제목 슬라이드
    const titleSlide = pptx.addSlide();
    titleSlide.addText('AI Tutor UI 수정 사항', {
        x: 0.5, y: 2.5, w: '90%', h: 1,
        fontSize: 36, bold: true, color: '2D5016',
        align: 'center'
    });
    titleSlide.addText('SSAL Works', {
        x: 0.5, y: 3.5, w: '90%', h: 0.5,
        fontSize: 18, color: '666666',
        align: 'center'
    });
    titleSlide.addText(new Date().toLocaleDateString('ko-KR'), {
        x: 0.5, y: 4.0, w: '90%', h: 0.5,
        fontSize: 14, color: '999999',
        align: 'center'
    });

    // 슬라이드 2: 스크린샷 + 수정 사항
    const contentSlide = pptx.addSlide();

    // 제목
    contentSlide.addText('AI Tutor 초기 화면', {
        x: 0.3, y: 0.2, w: '95%', h: 0.4,
        fontSize: 20, bold: true, color: '333333'
    });

    // 스크린샷 이미지
    const imageData = fs.readFileSync(screenshotPath);
    const base64Image = imageData.toString('base64');

    contentSlide.addImage({
        data: `image/png;base64,${base64Image}`,
        x: 0.3, y: 0.7, w: 6.5, h: 3.7
    });

    // 수정 사항 영역 (우측)
    contentSlide.addText('수정 사항', {
        x: 7.0, y: 0.7, w: 2.5, h: 0.3,
        fontSize: 14, bold: true, color: '333333'
    });

    contentSlide.addShape(pptx.ShapeType.rect, {
        x: 7.0, y: 1.1, w: 2.5, h: 3.3,
        fill: { color: 'F5F5F5' },
        line: { color: 'CCCCCC', width: 1 }
    });

    contentSlide.addText('1. \n\n2. \n\n3. \n\n4. \n\n5. ', {
        x: 7.1, y: 1.2, w: 2.3, h: 3.1,
        fontSize: 11, color: '666666',
        valign: 'top'
    });

    // 하단 안내
    contentSlide.addText('※ 수정이 필요한 부분을 표시하고 내용을 기재해 주세요.', {
        x: 0.3, y: 4.5, w: '95%', h: 0.3,
        fontSize: 10, color: '999999', italic: true
    });

    // 슬라이드 3: 빈 템플릿 (추가 수정 사항용)
    const extraSlide = pptx.addSlide();
    extraSlide.addText('추가 수정 사항', {
        x: 0.3, y: 0.2, w: '95%', h: 0.4,
        fontSize: 20, bold: true, color: '333333'
    });

    extraSlide.addShape(pptx.ShapeType.rect, {
        x: 0.3, y: 0.7, w: 9.2, h: 4.0,
        fill: { color: 'FAFAFA' },
        line: { color: 'DDDDDD', width: 1, dashType: 'dash' }
    });

    extraSlide.addText('추가 스크린샷이나 수정 사항을 여기에 기재해 주세요.', {
        x: 0.5, y: 2.5, w: 8.8, h: 0.5,
        fontSize: 14, color: 'AAAAAA',
        align: 'center'
    });

    // PPT 저장
    await pptx.writeFile({ fileName: pptPath });
    console.log(`✅ PPT 생성 완료: ${pptPath}`);

    console.log('\n========================================');
    console.log('📁 생성된 파일:');
    console.log(`   - 스크린샷: ${screenshotPath}`);
    console.log(`   - PPT 파일: ${pptPath}`);
    console.log('========================================');
}

captureAndCreatePpt().catch(console.error);
