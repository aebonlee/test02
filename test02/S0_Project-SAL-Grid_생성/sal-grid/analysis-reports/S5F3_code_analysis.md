# S5F3: 코드 분할 분석 결과

## 분석 정보
- **Task ID**: S5F3
- **분석일**: 2026-01-02
- **분석 대상**: index.html, admin-dashboard.html

---

## 1. 파일 크기 현황

| 파일 | 크기 | 줄 수 |
|------|------|-------|
| `index.html` | 716KB | 14,210줄 |
| `pages/admin-dashboard.html` | 312KB | 7,523줄 |
| **총계** | **1,028KB** | **21,733줄** |

---

## 2. index.html 구조 분석

### 2.1 CSS 블록

| 범위 | 줄 수 | 내용 |
|------|-------|------|
| 11-3156 | ~3,145줄 | 메인 CSS (변수, 레이아웃, 헤더, 푸터, 사이드바) |
| 7168-7268 | ~100줄 | 추가 CSS |
| 7604-7704 | ~100줄 | 추가 CSS |
| 7700-7800 | ~100줄 | 추가 CSS |
| 11360-11460 | ~100줄 | 추가 CSS |
| **CSS 총계** | **~3,545줄** | **약 49% 차지** |

### 2.2 외부 JS CDN

| 줄 번호 | 라이브러리 |
|---------|-----------|
| 3159 | @supabase/supabase-js@2 |
| 3162 | dompurify@3.0.6 |
| 3165 | marked.min.js |
| 11601 | socket.io@4.7.2 |

### 2.3 인라인 JavaScript 블록

| 범위 | 줄 수 | 주요 내용 |
|------|-------|----------|
| 3173-3184 | ~11줄 | 비밀번호 재설정/이메일 리다이렉트 |
| 4823-10320 | **~5,497줄** | 사이드바, 프로세스, 가이드, 템플릿, 모달 |
| 11481-11598 | ~117줄 | customConfirm, Phase 진행률 로드 |
| 11602-14149 | ~2,547줄 | Supabase 초기화, 인증, 알림, 프로젝트 |
| **JS 총계** | **~8,172줄** | **약 58% 차지** |

### 2.4 외부 JS 파일 참조

| 줄 번호 | 파일 |
|---------|------|
| 14150 | /Briefings_OrderSheets/Briefings/guides.js |
| 14151 | /Briefings_OrderSheets/OrderSheet_Templates/ordersheets.js |
| 14152 | /부수적_고유기능/콘텐츠/외부_연동_설정_Guide/service-guides.js |

---

## 3. admin-dashboard.html 구조 분석

### 3.1 CSS 블록

| 범위 | 줄 수 | 내용 |
|------|-------|------|
| 15-1490 | ~1,475줄 | 관리자 대시보드 CSS |

### 3.2 외부 JS CDN

| 줄 번호 | 라이브러리 |
|---------|-----------|
| 10 | chart.js@4.4.0 |
| 12 | dompurify@3.0.6 |
| 14 | @supabase/supabase-js@2 |

### 3.3 인라인 JavaScript 블록

| 범위 | 줄 수 | 주요 내용 |
|------|-------|----------|
| 2904-7521 | ~4,617줄 | 관리자 대시보드 로직 전체 |

---

## 4. 공통 코드 식별

### 4.1 중복 CDN (분리 불필요, 각 페이지에서 로드)
- @supabase/supabase-js@2
- dompurify@3.0.6

### 4.2 공통 CSS (main.css로 분리 대상)

| 카테고리 | 예상 줄 수 | 내용 |
|----------|-----------|------|
| CSS 변수 (:root) | ~70줄 | 색상, 그림자, 반경, 전환 |
| 기본 리셋 (* 선택자) | ~10줄 | margin, padding, box-sizing |
| Typography (h1-h6) | ~60줄 | 폰트 크기, 굵기, 줄높이 |
| 레이아웃 (.layout-container) | ~20줄 | 그리드 설정 |
| **공통 CSS 총계** | **~160줄** | 재사용 가능 |

### 4.3 공통 JS (분리 대상)

| 모듈명 | 예상 줄 수 | 주요 함수 |
|--------|-----------|----------|
| **supabase-init.js** | ~80줄 | Supabase 클라이언트 초기화, SUPABASE_URL, SUPABASE_ANON_KEY |
| **auth.js** | ~300줄 | checkAuthStatus(), logoutFromMain(), showLoggedInUI(), showLoggedOutUI(), onAuthStateChange |
| **common.js** | ~100줄 | showStatus(), formatTimeAgo(), DOMPurify 래퍼 |

### 4.4 UI 컴포넌트 JS (분리 대상)

| 모듈명 | 예상 줄 수 | 주요 함수 |
|--------|-----------|----------|
| **sidebar.js** | ~600줄 | loadSidebarStructure(), renderSidebarFromJSON(), toggleProcess(), toggleKnowledge(), toggleProcessPrep() |
| **modal.js** | ~300줄 | openGuideModal(), closeGuidePopup(), openGuideModalFromUrl(), customConfirm() |
| **toast.js** | ~50줄 | showStatus() |
| **navigation.js** | ~250줄 | loadPhaseProgressFromDB(), updateStageProgress(), loadStageGateStatus() |

---

## 5. 의존성 맵

```
index.html
├── CDN (외부 라이브러리)
│   ├── @supabase/supabase-js@2
│   ├── dompurify@3.0.6
│   ├── marked.min.js
│   └── socket.io@4.7.2
│
├── 분리 대상 CSS
│   └── assets/css/main.css (공통 스타일)
│
├── 분리 대상 JS (로딩 순서 중요!)
│   ├── 1. assets/js/supabase-init.js (첫 번째 - 클라이언트 초기화)
│   ├── 2. assets/js/auth.js (두 번째 - supabase 클라이언트 필요)
│   ├── 3. assets/js/common.js (세 번째 - 유틸리티)
│   ├── 4. assets/js/sidebar.js (네 번째 - UI)
│   ├── 5. assets/js/modal.js (다섯 번째 - UI)
│   └── 6. assets/js/navigation.js (여섯 번째 - 진행률)
│
└── 기존 외부 JS
    ├── /Briefings_OrderSheets/Briefings/guides.js
    ├── /Briefings_OrderSheets/OrderSheet_Templates/ordersheets.js
    └── /부수적_고유기능/콘텐츠/외부_연동_설정_Guide/service-guides.js
```

---

## 6. 분리 대상 모듈 상세

### 6.1 supabase-init.js

```javascript
// 포함할 코드
- SUPABASE_URL, SUPABASE_ANON_KEY 상수
- window.supabaseClient 초기화
- initSupabase() 함수 일부
```

**의존성:** 없음 (독립 실행)

### 6.2 auth.js

```javascript
// 포함할 함수
- checkAuthStatus()
- logoutFromMain()
- showLoggedInUI()
- showLoggedOutUI()
- onAuthStateChange 리스너
- loadUserProject()
- loadInProgressProject()
```

**의존성:** supabase-init.js

### 6.3 common.js

```javascript
// 포함할 함수
- showStatus() // 토스트 메시지
- formatTimeAgo() // 시간 표시
- customConfirm() // 커스텀 확인 다이얼로그
- IS_PRODUCTION 상수
```

**의존성:** 없음

### 6.4 sidebar.js

```javascript
// 포함할 함수
- SIDEBAR_STRUCTURE 데이터
- loadSidebarStructure()
- renderSidebarFromJSON()
- generatePhaseHTML()
- toggleProcess()
- toggleProcessPrep()
- toggleKnowledge()
- toggleKnowledgeSmall()
- toggleProcessTiny()
```

**의존성:** common.js

### 6.5 modal.js

```javascript
// 포함할 함수
- openGuideModalFromUrl()
- openGuideModalWithConfirm()
- closeGuidePopup()
- showReportModal()
- initDragPopup()
```

**의존성:** common.js

### 6.6 navigation.js

```javascript
// 포함할 함수
- loadPhaseProgressFromDB()
- updateStageProgress()
- updateSpecialProgress()
- updatePrepProgressByCode()
- resetAllProgressToZero()
- loadStageGateStatus()
- loadGridStats()
```

**의존성:** supabase-init.js

---

## 7. 예상 결과

### 7.1 분할 후 파일 크기 예상

| 파일 | Before | After | 감소율 |
|------|--------|-------|--------|
| index.html | 716KB | ~100KB | **~86%** |
| admin-dashboard.html | 312KB | ~180KB | ~42% |

### 7.2 신규 생성 파일

| 파일 | 예상 크기 |
|------|----------|
| assets/css/main.css | ~60KB |
| assets/js/supabase-init.js | ~3KB |
| assets/js/auth.js | ~12KB |
| assets/js/common.js | ~5KB |
| assets/js/sidebar.js | ~25KB |
| assets/js/modal.js | ~12KB |
| assets/js/navigation.js | ~10KB |
| **외부 파일 총계** | **~127KB** |

### 7.3 성능 개선 예상

- **초기 로딩**: HTML 파싱 시간 단축 (큰 인라인 스크립트 제거)
- **캐싱 효과**: 외부 JS/CSS 파일은 브라우저 캐시 활용 가능
- **반복 방문**: 캐시된 파일 재사용으로 로딩 속도 50%+ 개선 예상

---

## 8. 위험 요소 및 주의사항

### 8.1 스크립트 로딩 순서

```html
<!-- 반드시 이 순서 유지! -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="/assets/js/supabase-init.js"></script>
<script src="/assets/js/auth.js"></script>
<script src="/assets/js/common.js"></script>
<script src="/assets/js/sidebar.js"></script>
<script src="/assets/js/modal.js"></script>
<script src="/assets/js/navigation.js"></script>
```

### 8.2 전역 변수 관리

현재 전역 변수로 사용되는 항목:
- `window.supabaseClient`
- `currentSelectedProject`
- `SIDEBAR_STRUCTURE`
- `PROJECT_CONFIGS`

**해결 방안:** 각 모듈에서 window 객체에 명시적으로 할당

### 8.3 DOM 로드 타이밍

모든 JS 파일에 `defer` 속성 추가하여 DOM 로드 후 실행 보장

```html
<script defer src="/assets/js/supabase-init.js"></script>
```

---

## 9. Phase별 작업 순서

| Phase | 작업 | 테스트 항목 |
|-------|------|-----------|
| Phase 2 | CSS 분리 → main.css | 스타일 정상 적용, 반응형 |
| Phase 3 | 공통 JS 분리 (supabase, auth, common) | 로그인/로그아웃 동작 |
| Phase 4 | UI JS 분리 (sidebar, modal) | 사이드바, 모달 동작 |
| Phase 5 | index.html 최소화 | 전체 기능 동작 |
| Phase 6 | admin-dashboard.html 적용 | 관리자 기능 동작 |
| Phase 7 | 최종 검증 | 성능 측정, 브라우저 호환성 |

---

**분석 완료**

Phase 1 분석이 완료되었습니다. Phase 2(CSS 분리)를 진행할 준비가 되었습니다.
