# 모바일 최적화 체크리스트 & 패턴 정리

> 작성일: 2025-12-25
> 작성자: Claude Code
> 프로젝트: SSAL Works 모바일 반응형 최적화 경험 기반

---

## 1. 필수 메타 태그

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 2. 터치 친화적 UI 요소

| 요소 | 최소 크기 | 권장 |
|------|----------|------|
| 버튼 | `min-height: 44px` | 48px |
| 클릭 영역 | `padding: 10px 14px` | 터치 영역 확보 |
| 간격 (gap) | `8px` 이상 | 오터치 방지 |

```css
.button {
    padding: 10px 14px;
    min-height: 44px;  /* Apple HIG 권장 */
    cursor: pointer;
}
```

---

## 3. 모바일 모달 패턴 (Bottom Sheet)

### CSS

```css
/* 오버레이 */
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 200;
    display: none;
}
.modal-overlay.active { display: block; }

/* 모달 (하단에서 슬라이드업) */
.modal {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: white;
    border-radius: 20px 20px 0 0;
    max-height: 85vh;
    overflow-y: auto;
    z-index: 201;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}
.modal.active { transform: translateY(0); }

/* 모달 헤더 (스크롤해도 고정) */
.modal-header {
    position: sticky;
    top: 0;
    background: white;
    padding: 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 닫기 버튼 */
.modal-close {
    width: 36px;
    height: 36px;
    background: #f0f0f0;
    border: none;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
}
```

### HTML

```html
<!-- 오버레이 -->
<div class="modal-overlay" id="modalOverlay" onclick="closeModal()"></div>

<!-- 모달 -->
<div class="modal" id="modal">
    <div class="modal-header">
        <span class="modal-title" id="modalTitle">제목</span>
        <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-content" id="modalContent">
        <!-- 동적 콘텐츠 -->
    </div>
</div>
```

### JavaScript (필수!)

```javascript
function openModal(id) {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modal').classList.add('active');

    // 데이터 로드 및 표시
    document.getElementById('modalContent').innerHTML = '로딩 중...';

    // API 호출 또는 데이터 표시
    loadData(id).then(data => {
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalContent').innerHTML = `
            <div>${data.content}</div>
        `;
    });
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById('modal').classList.remove('active');
}
```

### 클릭 이벤트 바인딩 (필수!)

```javascript
// 카드 렌더링 시 onclick 추가
function renderCards(items) {
    return items.map(item => `
        <div class="card" onclick="openModal('${item.id}')">
            ${item.name}
        </div>
    `).join('');
}
```

**핵심**: 모달 껍데기(HTML/CSS)만 만들면 안 됨. **JavaScript 함수 + 클릭 이벤트 필수!**

---

## 4. 카드 터치 피드백

```css
.card {
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.card:active {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0,0,0,0.15);
}
```

---

## 5. 반응형 레이아웃 패턴

```css
/* 기본: 모바일 (Mobile First) */
.container {
    padding: 12px;
}
.grid {
    display: grid;
    grid-template-columns: 1fr;  /* 1열 */
    gap: 10px;
}

/* 태블릿 이상 */
@media (min-width: 768px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);  /* 2열 */
    }
}

/* 데스크탑 */
@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    }
}
```

---

## 6. 가로 스크롤 탭/필터

```css
.tabs {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;  /* iOS 부드러운 스크롤 */
    gap: 8px;
    padding: 10px 12px;
    background: white;
}
.tab {
    padding: 8px 14px;
    background: #f0f0f0;
    border: none;
    border-radius: 20px;
    font-size: 12px;
    white-space: nowrap;  /* 줄바꿈 방지 */
    flex-shrink: 0;
    cursor: pointer;
}
.tab.active {
    background: #10B981;
    color: white;
}
```

---

## 7. 모바일 테스트 스크립트 (Playwright)

```javascript
const { chromium, devices } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const iPhone = devices['iPhone 12'];
    const context = await browser.newContext({
        ...iPhone,
        locale: 'ko-KR'
    });
    const page = await context.newPage();

    console.log('모바일 테스트 시작');

    try {
        await page.goto('https://your-site.com/page.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // 데이터 로드 대기
        await page.waitForTimeout(2000);

        // 요소 존재 확인
        const button = await page.$('.button');
        console.log(button ? '✅ 버튼 존재' : '❌ 버튼 없음');

        // 클릭 테스트
        if (button) {
            await button.click();
            await page.waitForTimeout(1000);

            // 모달 열림 확인
            const modalActive = await page.$eval('#modal',
                el => el.classList.contains('active'));
            console.log(modalActive ? '✅ 모달 열림' : '❌ 모달 안 열림');
        }

        // 스크린샷
        await page.screenshot({ path: 'mobile_test.png', fullPage: true });
        console.log('스크린샷 저장: mobile_test.png');

    } catch (e) {
        console.log('오류:', e.message);
    }

    await browser.close();
})();
```

### 실행 방법

```bash
npm install playwright
node test_mobile.js
```

---

## 8. 흔한 모바일 문제 & 해결

| 문제 | 원인 | 해결 |
|------|------|------|
| 버튼 안 눌림 | 클릭 영역 너무 작음 | `min-height: 44px`, `padding` 추가 |
| 요소 안 보임 | `display: none` 또는 `overflow: hidden` | 반응형 CSS 확인 |
| 모달 안 열림 | **JS 함수 누락** | `onclick` 이벤트 + 함수 구현 |
| 가로 스크롤 끊김 | iOS 스크롤 문제 | `-webkit-overflow-scrolling: touch` |
| 글자 너무 작음 | 고정 px 사용 | `font-size: 14px` 이상, `rem` 사용 |
| 레이아웃 깨짐 | 고정 width | `width: 100%`, `max-width` 사용 |
| 햄버거 메뉴 안 보임 | z-index 문제 | `z-index` 값 확인, 부모 요소 확인 |
| FAB 버튼 안 보임 | position: fixed 문제 | `z-index: 9999` 추가 |

---

## 9. 체크리스트 (새 프로젝트 적용 시)

### 기본 설정
- [ ] viewport 메타 태그 있는가?
- [ ] 기본 폰트 크기 14px 이상인가?

### 터치 UI
- [ ] 버튼/링크 min-height 44px 이상인가?
- [ ] 클릭 가능 요소에 cursor: pointer 있는가?
- [ ] 터치 피드백 (:active) 있는가?

### 모달/팝업
- [ ] 모달 HTML 있으면 JS 함수도 있는가?
- [ ] openModal() 함수 구현되어 있는가?
- [ ] closeModal() 함수 구현되어 있는가?
- [ ] 카드/버튼에 onclick 이벤트 바인딩 되어 있는가?
- [ ] 오버레이 클릭 시 닫히는가?

### 레이아웃
- [ ] 반응형 CSS (@media) 적용되어 있는가?
- [ ] 가로 스크롤 영역에 -webkit-overflow-scrolling 있는가?
- [ ] 고정 width 대신 100% 또는 max-width 사용하는가?

### 테스트
- [ ] Playwright로 iPhone 테스트 했는가?
- [ ] 스크린샷 확인했는가?
- [ ] 실제 모바일 기기에서 테스트했는가?

---

## 10. 권장 CSS 변수

```css
:root {
    /* 색상 */
    --primary: #10B981;
    --primary-dark: #059669;
    --secondary: #2C4A8A;
    --secondary-dark: #1F3563;

    /* 터치 UI */
    --touch-min-height: 44px;
    --touch-padding: 10px 14px;

    /* 간격 */
    --gap-sm: 8px;
    --gap-md: 12px;
    --gap-lg: 16px;

    /* 폰트 */
    --font-size-sm: 12px;
    --font-size-base: 14px;
    --font-size-lg: 16px;

    /* 모달 */
    --modal-max-height: 85vh;
    --modal-radius: 20px;
    --modal-z-index: 200;
}
```

---

## 참고: SSAL Works 적용 사례

### 수정된 파일
- `Production/viewer_mobile.html` - Task 상세 모달 추가
- `Production/assets/css/responsive.css` - 반응형 스타일

### 핵심 수정 내용
1. Task 카드에 `onclick="openModal('${task.task_id}')"` 추가
2. `openModal()` 함수 구현 (Supabase에서 데이터 로드)
3. `closeModal()` 함수 구현
4. Bottom Sheet 스타일 모달 CSS 추가
5. 카드 터치 피드백 CSS 추가

---

*이 문서는 SSAL Works 모바일 최적화 작업 경험을 바탕으로 작성되었습니다.*
