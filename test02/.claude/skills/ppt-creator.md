# PPT Creator Skill

**스크린샷 캡처 및 PowerPoint 프레젠테이션 생성 스킬**

---

## 프로젝트 컨텍스트

**프로젝트**: SSAL Works
**용도**: UI 화면 스크린샷을 PowerPoint에 삽입하여 수정 사항 기재용 문서 생성

---

## 기술 스택

- **스크린샷**: Playwright (npx playwright)
- **PPT 생성**: pptxgenjs (Node.js 라이브러리)
- **대안**: python-pptx (Python)

---

## 역할 및 책임

당신은 SSAL Works 프로젝트의 PPT 문서 작성자입니다:

1. **스크린샷 캡처**: 웹 페이지 화면을 PNG로 캡처
2. **PPT 생성**: 새 PowerPoint 파일 생성
3. **이미지 삽입**: 스크린샷을 PPT 슬라이드에 삽입
4. **텍스트 추가**: 제목, 설명 텍스트 추가

---

## 설치 요구사항

### pptxgenjs 설치
```bash
npm install pptxgenjs
```

### Playwright 설치 (스크린샷용)
```bash
npx playwright install chromium
```

---

## 사용 방법

### 1. 스크린샷 캡처

```javascript
// screenshot.js
const { chromium } = require('playwright');

async function captureScreenshot(url, outputPath) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(url);
    await page.screenshot({ path: outputPath, fullPage: false });
    await browser.close();
    console.log(`✅ 스크린샷 저장: ${outputPath}`);
}

// 사용 예시
captureScreenshot('https://www.ssalworks.ai.kr', 'screenshot.png');
```

### 2. PPT 생성 및 이미지 삽입

```javascript
// create-ppt.js
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

function createPptWithScreenshot(screenshotPath, outputPath, title) {
    const pptx = new PptxGenJS();

    // 슬라이드 추가
    const slide = pptx.addSlide();

    // 제목 추가
    slide.addText(title || 'UI 수정 사항', {
        x: 0.5,
        y: 0.3,
        w: '90%',
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: '333333'
    });

    // 스크린샷 이미지 추가
    const imageData = fs.readFileSync(screenshotPath);
    const base64Image = imageData.toString('base64');
    const ext = path.extname(screenshotPath).slice(1);

    slide.addImage({
        data: `image/${ext};base64,${base64Image}`,
        x: 0.5,
        y: 1.0,
        w: 9,
        h: 5.5
    });

    // 수정 사항 기재 영역 (빈 텍스트 박스)
    slide.addText('수정 사항을 여기에 기재하세요', {
        x: 0.5,
        y: 6.8,
        w: '90%',
        h: 0.5,
        fontSize: 14,
        color: '999999',
        italic: true
    });

    // PPT 파일 저장
    pptx.writeFile({ fileName: outputPath })
        .then(() => console.log(`✅ PPT 생성 완료: ${outputPath}`));
}

// 사용 예시
createPptWithScreenshot('screenshot.png', 'UI_수정사항.pptx', 'AI Tutor 초기 화면');
```

### 3. 통합 스크립트 (스크린샷 + PPT 생성)

```javascript
// capture-and-create-ppt.js
const { chromium } = require('playwright');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

async function captureAndCreatePpt(url, title, outputPptPath) {
    const screenshotPath = 'temp_screenshot.png';

    // 1. 스크린샷 캡처
    console.log('📸 스크린샷 캡처 중...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.screenshot({ path: screenshotPath });
    await browser.close();
    console.log('✅ 스크린샷 완료');

    // 2. PPT 생성
    console.log('📊 PPT 생성 중...');
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    // 제목
    slide.addText(title, {
        x: 0.5, y: 0.3, w: '90%', h: 0.5,
        fontSize: 24, bold: true, color: '333333'
    });

    // 이미지
    const imageData = fs.readFileSync(screenshotPath);
    slide.addImage({
        data: `image/png;base64,${imageData.toString('base64')}`,
        x: 0.5, y: 1.0, w: 9, h: 5.5
    });

    // 수정사항 영역
    slide.addText('[ 수정 사항 기재 ]', {
        x: 0.5, y: 6.8, w: '90%', h: 0.5,
        fontSize: 14, color: '666666'
    });

    await pptx.writeFile({ fileName: outputPptPath });
    console.log(`✅ PPT 생성 완료: ${outputPptPath}`);

    // 임시 스크린샷 삭제
    fs.unlinkSync(screenshotPath);
}

// CLI 사용
const args = process.argv.slice(2);
if (args.length >= 3) {
    captureAndCreatePpt(args[0], args[1], args[2]);
} else {
    console.log('사용법: node capture-and-create-ppt.js <URL> <제목> <출력파일.pptx>');
}
```

---

## 실행 예시

### AI Tutor 화면 캡처 → PPT 생성

```bash
# 1. 의존성 설치 (최초 1회)
npm install pptxgenjs playwright

# 2. 스크립트 실행
node capture-and-create-ppt.js "https://www.ssalworks.ai.kr" "AI Tutor 초기 화면" "AI_Tutor_수정사항.pptx"
```

---

## 출력 파일 위치

생성된 PPT 파일 저장 위치:
```
Human_ClaudeCode_Bridge/Reports/UI_수정사항/
├── AI_Tutor_수정사항.pptx
├── Dashboard_수정사항.pptx
└── ...
```

---

## 주의사항

1. **Playwright 브라우저 필요**: 최초 실행 시 `npx playwright install chromium` 필요
2. **네트워크 필요**: 웹 페이지 캡처 시 인터넷 연결 필요
3. **로그인 필요 페이지**: 로그인이 필요한 페이지는 쿠키/세션 설정 필요

---

## 스킬 호출 방법

```
사용자: "ppt-creator 스킬을 사용해서 AI Tutor 초기 화면을 캡처해서 PPT로 만들어줘"
```

또는

```
사용자: ".claude/skills/ppt-creator.md 파일의 가이드라인을 따라 스크린샷 PPT를 만들어줘"
```

---

*마지막 업데이트: 2025-12-28*
*버전: 1.0*
*SSAL Works 프로젝트 전용*
