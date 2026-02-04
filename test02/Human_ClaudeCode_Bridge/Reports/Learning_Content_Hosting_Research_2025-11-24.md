# 학습용 콘텐츠 호스팅 연구 보고서

**연구 날짜:** 2025-11-24
**주제:** Google Drive를 활용한 HTML 학습 콘텐츠 제공 방안

---

## 핵심 결론

❌ **Google Drive는 HTML 호스팅 불가능**
- 2016년에 웹 호스팅 기능 중단
- HTML 파일이 렌더링되지 않고 소스 코드만 표시됨

✅ **추천 대안: GitHub Pages** (완전 무료 + 무제한)

---

## 1. Google Drive HTML 호스팅 - 실행 불가

### 현재 상황 (2025년)
- Google은 2016년 8월 Google Drive 웹 호스팅 기능 중단
- HTML 파일을 공유해도 **소스 코드만 보임** (렌더링 안 됨)
- 우회 방법(DriveToWeb 등)도 구글이 보안 이슈로 차단

### 여전히 가능한 것
- ✅ 파일 저장 및 공유
- ✅ PDF 임베딩 (Google Docs Viewer)
- ✅ 이미지 임베딩
- ✅ 폴더 목록 보기

### 불가능한 것
- ❌ HTML 렌더링
- ❌ 웹사이트 호스팅
- ❌ HTML 파일 실행

---

## 2. 추천 솔루션: GitHub Pages

### 선택 이유
1. ✅ **완전 무료** (숨은 비용 없음)
2. ✅ **무제한 대역폭** (정적 사이트)
3. ✅ **Git 버전 관리** 내장
4. ✅ **업데이트 쉬움** (push만 하면 자동 배포)
5. ✅ **안정적이고 빠름** (GitHub CDN)
6. ✅ **HTTPS 기본 제공**
7. ✅ **CORS 문제 없음** (iframe 임베딩 가능)

### 설정 방법 (30분 소요)

**1단계: GitHub 저장소 생성 (5분)**
```
저장소명: ssalworks-learning-content
공개 설정: Public
```

**2단계: 폴더 구조 생성 (10분)**
```
learning-content/
├── index.html (목차)
├── lessons/
│   ├── web-development/
│   │   ├── 01-html-basics.html
│   │   ├── 02-css-fundamentals.html
│   │   └── 03-javascript-intro.html
│   ├── project-management/
│   │   ├── 01-agile-basics.html
│   │   └── 02-scrum-framework.html
│   └── ssal-tools/
│       ├── 01-dashboard-intro.html
│       └── 02-project-grid.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── README.md
```

**3단계: GitHub Pages 활성화 (2분)**
- Repository Settings → Pages
- Source: main branch
- Save

**4단계: 대시보드에 통합 (13분)**
- iframe 코드 추가
- 강의 선택 드롭다운 구현
- 테스트

### 접근 URL 형식
```
https://ssalworks.github.io/learning-content/lessons/web-development/01-html-basics.html
```

---

## 3. 대시보드 통합 코드

### HTML 구조
```html
<div class="learning-section">
    <div class="learning-content-header">
        <h2>학습용 콘텐츠</h2>
        <select id="lesson-selector" onchange="loadSelectedLesson()">
            <option value="">강의를 선택하세요</option>
            <optgroup label="웹 개발 기초">
                <option value="web-development/01-html-basics">HTML 기초</option>
                <option value="web-development/02-css-fundamentals">CSS 기초</option>
                <option value="web-development/03-javascript-intro">JavaScript 입문</option>
            </optgroup>
            <optgroup label="프로젝트 관리">
                <option value="project-management/01-agile-basics">애자일 기초</option>
                <option value="project-management/02-scrum-framework">스크럼 프레임워크</option>
            </optgroup>
        </select>
    </div>

    <div class="lesson-container" id="lesson-container">
        <div class="lesson-placeholder">
            <p>강의를 선택하면 여기에 콘텐츠가 표시됩니다.</p>
        </div>
    </div>
</div>
```

### CSS (반응형)
```css
.lesson-container {
    position: relative;
    width: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    min-height: 600px;
}

.lesson-container iframe {
    width: 100%;
    height: 800px;
    border: none;
}

/* 모바일 대응 */
@media (max-width: 768px) {
    .lesson-container iframe {
        height: 600px;
    }
}
```

### JavaScript
```javascript
const GITHUB_PAGES_BASE_URL = 'https://ssalworks.github.io/learning-content/lessons/';

function loadSelectedLesson() {
    const selector = document.getElementById('lesson-selector');
    const lessonPath = selector.value;

    if (!lessonPath) {
        showPlaceholder();
        return;
    }

    const container = document.getElementById('lesson-container');

    // 로딩 표시
    container.innerHTML = `
        <div class="lesson-loading">
            <div class="spinner"></div>
            <p>강의를 불러오는 중...</p>
        </div>
    `;

    // iframe 생성
    const iframe = document.createElement('iframe');
    iframe.src = `${GITHUB_PAGES_BASE_URL}${lessonPath}.html`;
    iframe.title = selector.options[selector.selectedIndex].text;
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';

    iframe.onload = function() {
        container.innerHTML = '';
        container.appendChild(iframe);

        // 시청 기록 저장
        trackLessonView(lessonPath);
        localStorage.setItem('lastViewedLesson', lessonPath);
    };

    iframe.onerror = function() {
        container.innerHTML = `
            <div class="lesson-placeholder">
                <p style="color: #ef4444;">강의를 불러오는데 실패했습니다.</p>
            </div>
        `;
    };
}

function trackLessonView(lessonPath) {
    // 시청 기록 저장
    const history = JSON.parse(localStorage.getItem('lessonHistory') || '[]');
    history.unshift({
        path: lessonPath,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('lessonHistory', JSON.stringify(history.slice(0, 10)));
}
```

---

## 4. 강의 HTML 템플릿

### 기본 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>강의 제목 - SSAL Works</title>

    <style>
        body {
            font-family: 'Pretendard', -apple-system, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }

        .lesson-header {
            border-bottom: 3px solid #10B981;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .lesson-title {
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
        }

        h2 {
            color: #1f2937;
            font-size: 24px;
            margin-top: 40px;
            border-left: 4px solid #10B981;
            padding-left: 16px;
        }

        .code-example {
            background: #1e1e1e;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            overflow-x: auto;
        }

        .tip-box {
            background: #ecfdf5;
            border-left: 4px solid #10B981;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .practice-exercise {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }

        @media (max-width: 768px) {
            body { padding: 15px; }
            .lesson-title { font-size: 24px; }
        }
    </style>
</head>
<body>
    <header class="lesson-header">
        <div>웹 개발 기초</div>
        <h1 class="lesson-title">HTML 기초 - 웹페이지의 구조</h1>
        <div>
            <span>난이도: 초급</span> •
            <span>소요 시간: 30분</span>
        </div>
    </header>

    <main>
        <section>
            <h2>학습 목표</h2>
            <ul>
                <li>HTML의 기본 개념 이해하기</li>
                <li>HTML 문서 구조 파악하기</li>
                <li>자주 사용하는 태그 익히기</li>
            </ul>
        </section>

        <section>
            <h2>1. HTML이란?</h2>
            <p>
                HTML(HyperText Markup Language)은 웹페이지의
                구조를 정의하는 마크업 언어입니다.
            </p>

            <div class="tip-box">
                <strong>💡 핵심:</strong> HTML은 웹페이지의 "뼈대"입니다.
            </div>
        </section>

        <section>
            <h2>2. 기본 구조</h2>
            <div class="code-example">
                <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="ko"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;페이지 제목&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;안녕하세요!&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
            </div>
        </section>

        <section>
            <h2>3. 실습 과제</h2>
            <div class="practice-exercise">
                <h3>📝 연습문제</h3>
                <p>자기소개 페이지를 만들어보세요:</p>
                <ol>
                    <li>제목(h1)에 이름 작성</li>
                    <li>문단(p)에 자기소개 작성</li>
                    <li>목록(ul)으로 취미 3가지 나열</li>
                </ol>
            </div>
        </section>
    </main>
</body>
</html>
```

---

## 5. 비용 분석

### 무료 한도

**GitHub Pages:**
- 저장소 크기: 1GB (충분함)
- 대역폭: 100GB/월 (충분함)
- 빌드: 시간당 10회
- **초과 시:** 보통 경고만, 실제 차단은 거의 없음

### 예상 사용량

**가정:**
- 강의 100개
- 파일당 평균 50KB
- 월 사용자 1,000명
- 사용자당 평균 5개 강의 시청

**계산:**
- 저장 용량: 100 × 50KB = 5MB (여유 충분)
- 대역폭: 1,000 × 5 × 50KB = 250MB/월 (여유 충분)

**결론:** 무료 한도로 충분히 가능

---

## 6. 대안 솔루션 비교

| 특징 | Google Drive | GitHub Pages | Netlify | Vercel |
|------|-------------|--------------|---------|---------|
| **HTML 호스팅** | ❌ 불가능 | ✅ 가능 | ✅ 가능 | ✅ 가능 |
| **비용** | 무료 저장소 | 완전 무료 | 100GB/월 무료 | 100GB/월 무료 |
| **커스텀 도메인** | ❌ 불가능 | ✅ 가능 | ✅ 가능 | ✅ 가능 |
| **HTTPS** | ✅ | ✅ | ✅ | ✅ |
| **설정 난이도** | - | ⭐⭐⭐⭐ 쉬움 | ⭐⭐⭐⭐⭐ 매우 쉬움 | ⭐⭐⭐⭐ 쉬움 |
| **버전 관리** | ❌ 없음 | ✅ Git 내장 | ✅ Git 연동 | ✅ Git 연동 |
| **CDN** | 제한적 | ✅ 글로벌 | ✅ 글로벌 | ✅ 엣지 네트워크 |
| **적합도** | - | 정적 HTML | 정적+폼 | React/Next.js |

---

## 7. 구현 로드맵

### Phase 1: 초기 설정 (1주차)

1. **GitHub 저장소 생성**
   - 저장소명: `ssalworks-learning-content`
   - README 초기화

2. **기본 구조 설정**
   - `/lessons` 폴더 생성
   - `/assets` 폴더 생성
   - 첫 번째 샘플 강의 추가

3. **GitHub Pages 활성화**
   - Settings → Pages → 활성화

4. **대시보드 통합 테스트**
   - iframe 추가
   - 데스크톱/모바일 테스트

### Phase 2: 콘텐츠 이전 (2-3주차)

1. **기존 콘텐츠 변환**
   - 템플릿 사용
   - 일관된 스타일 적용
   - 인터랙티브 요소 추가

2. **카테고리별 정리**
   - 웹 개발
   - 프로젝트 관리
   - SSAL 도구 사용법

3. **네비게이션 추가**
   - 강의 선택 드롭다운
   - 이전/다음 버튼
   - 진도 추적

### Phase 3: 고도화 (4주차 이후)

1. **기능 추가**
   - 코드 하이라이팅 (Prism.js)
   - 코드 플레이그라운드
   - 퀴즈 컴포넌트

2. **분석 통합**
   - 강의 시청 추적
   - 완료율 모니터링
   - 사용자 피드백 수집

3. **성능 최적화**
   - iframe 지연 로딩
   - 이미지 최적화
   - 캐싱 전략

---

## 8. 보안 및 CORS 고려사항

### CORS 설정

**GitHub Pages:**
- ✅ CORS 문제 없음
- ✅ iframe 임베딩 기본 허용
- ✅ 모든 도메인에서 로드 가능

### 보안 권장사항

**1. iframe Sandbox:**
```html
<iframe
    src="https://ssalworks.github.io/learning-content/lessons/lesson-01.html"
    sandbox="allow-scripts allow-same-origin"
    title="강의 콘텐츠"
></iframe>
```

**2. Content Security Policy:**
```html
<meta http-equiv="Content-Security-Policy"
      content="frame-src https://ssalworks.github.io;">
```

---

## 9. 업데이트 방법

### 콘텐츠 업데이트 절차

```bash
# 1. 저장소 클론
git clone https://github.com/ssalworks/learning-content.git
cd learning-content

# 2. 강의 파일 생성/수정
# lessons/web-development/01-html-basics.html 편집

# 3. 로컬에서 테스트
# 브라우저에서 파일 열어 확인

# 4. 커밋 및 푸시
git add .
git commit -m "HTML 기초 강의 업데이트"
git push origin main

# 5. 자동 배포
# 몇 분 내 GitHub Pages에 자동 배포됨
```

### 버전 관리 장점
- 모든 변경사항 추적
- 필요시 롤백 가능
- 팀 협업 용이
- 배포 전 리뷰 가능

---

## 10. 최종 권장사항

### ✅ 추천: GitHub Pages

**이유:**
1. 완전 무료 (숨은 비용 없음)
2. 설정이 간단함 (초보자도 가능)
3. 안정적 (GitHub/Microsoft 지원)
4. Git 버전 관리 내장
5. CORS 문제 없음
6. 빠른 글로벌 CDN
7. 정적 HTML 학습 콘텐츠에 최적

### 실행 계획

**즉시 실행 (이번 주):**
- GitHub 저장소 생성
- 샘플 강의 3개 작성
- 대시보드 임베딩 테스트

**단기 계획 (이번 달):**
- 기존 학습 콘텐츠 이전
- 카테고리별 정리
- 네비게이션 및 진도 추적 추가

**장기 계획 (다음 분기):**
- 인터랙티브 퀴즈 추가
- 분석 통합
- 사용자 피드백 수집
- 콘텐츠 라이브러리 확장

---

## 결론

**Google Drive는 HTML 호스팅이 불가능**하지만, **GitHub Pages는 더 나은 무료 대안**입니다:

- 더 안정적
- 유지보수 쉬움
- 버전 관리 내장
- 사용 사례에 완벽히 적합

구현이 간단하며, 1시간 이내에 작동하는 시스템을 구축할 수 있습니다.
사용자와 콘텐츠가 크게 증가해도 무료로 확장 가능합니다.

**권장 사항:** 즉시 GitHub Pages로 시작하세요.
나중에 폼 처리나 서버리스 함수 같은 고급 기능이 필요하면
Netlify나 Vercel로 마이그레이션할 수 있습니다.

---

**보고서 작성:** 2025-11-24
**연구 범위:** Google Drive 대안, 정적 호스팅 솔루션, iframe 임베딩 모범 사례
**권장 솔루션:** GitHub Pages + 반응형 iframe 임베딩
