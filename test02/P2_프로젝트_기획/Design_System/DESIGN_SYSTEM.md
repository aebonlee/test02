# SSALWorks Design System

> 전문적이고 일관된 사용자 경험을 위한 디자인 시스템
>
> 최종 업데이트: 2025-11-18

---

## 목차

1. [디자인 원칙](#디자인-원칙)
2. [색상 체계 (Color Palette)](#색상-체계-color-palette)
3. [타이포그래피 (Typography)](#타이포그래피-typography)
4. [간격 체계 (Spacing)](#간격-체계-spacing)
5. [레이아웃 (Layout)](#레이아웃-layout)
6. [컴포넌트 (Components)](#컴포넌트-components)
7. [애니메이션 & 효과 (Effects)](#애니메이션--효과-effects)
8. [접근성 (Accessibility)](#접근성-accessibility)
9. [반응형 디자인 (Responsive)](#반응형-디자인-responsive)
10. [디자인 토큰 (Design Tokens)](#디자인-토큰-design-tokens)

---

## 디자인 원칙

### 핵심 가치

**1. 명확성 (Clarity)**
- 사용자가 무엇을 해야 하는지 즉시 이해할 수 있어야 함
- 복잡한 정보를 단순하고 명확하게 전달

**2. 일관성 (Consistency)**
- 전체 플랫폼에서 동일한 패턴과 스타일 사용
- 예측 가능한 사용자 경험 제공

**3. 효율성 (Efficiency)**
- 최소한의 클릭으로 최대한의 결과
- 자주 사용하는 기능에 쉽게 접근

**4. 접근성 (Accessibility)**
- 모든 사용자가 사용할 수 있는 디자인
- WCAG 2.1 AA 수준 준수

**5. 시각적 조화 (Visual Harmony)**
- 균형 잡힌 색상과 간격
- 전문적이면서도 친근한 느낌

---

## 색상 체계 (Color Palette)

### 주요 색상 (Primary Colors)

#### Primary - Purple (메인 브랜드)
```css
/* 주요 용도: 헤더, 주요 UI 요소, 브랜드 아이덴티티 */
--primary: #6B5CCC;          /* 메인 퍼플 */
--primary-dark: #5847B3;     /* 어두운 퍼플 (호버, 강조) */
--primary-light: #8B7FDD;    /* 밝은 퍼플 (비활성화, 배경) */
--primary-alpha-10: rgba(107, 92, 204, 0.1);   /* 10% 투명도 */
--primary-alpha-15: rgba(107, 92, 204, 0.15);  /* 15% 투명도 */
```

**사용 예시:**
- 헤더 배경 (그라데이션)
- 메인 네비게이션
- 선택된 항목 강조
- 브랜드 로고

**색상 이론:**
- 보라색은 창의성, 지혜, 신뢰를 상징
- 학습 및 프로젝트 관리 플랫폼에 적합

#### Secondary - Orange (액션 전용) ✅ 승인됨
```css
/* ⭐ 전용 용도: 사용자 액션 (Actions) - 클릭해서 뭔가 하는 것 */
--secondary: #CC785C;        /* 메인 오렌지 */
--secondary-dark: #B35A44;   /* 어두운 오렌지 (호버) */
--secondary-light: #E09D8C;  /* 밝은 오렌지 (비활성화) */
--secondary-alpha-05: rgba(204, 120, 92, 0.05);  /* 5% 투명도 */
```

**사용 예시:**
- ✅ 버튼 클릭 (제출, 저장, 확인, 질문하기)
- ✅ 다운로드, 업로드 액션
- ✅ 호출 행동(CTA - Call To Action)
- ✅ 사용자가 직접 행동을 취하는 모든 요소

**❌ 사용하지 말아야 할 곳:**
- ❌ 상태 표시 (완료, 진행중 등)
- ❌ 선택된 메뉴 강조
- ❌ 결과 표시

**색상 이론:**
- 오렌지는 에너지, 행동, 열정을 상징
- 사용자 액션을 유도하는데 가장 효과적

#### Tertiary - Teal (상태 & 선택 전용) ✅ 승인됨
```css
/* ⭐ 전용 용도: 상태 표시 & 선택 (Status & Selection) - 결과 보여주거나 선택된 것 */
--tertiary: #20808D;         /* 메인 틸 */
--tertiary-dark: #1A6B75;    /* 어두운 틸 */
--tertiary-light: #4DA8B3;   /* 밝은 틸 */
```

**사용 예시:**
- ✅ 완료/성공 결과 표시
- ✅ 선택된 메뉴/항목 강조
- ✅ 활성화된 상태 표시
- ✅ Hover 효과 (선택 가능함을 나타냄)
- ✅ 진행 바 (완료 상태)
- ✅ 선택된 AI 버튼

**❌ 사용하지 말아야 할 곳:**
- ❌ 액션 버튼 (클릭해서 실행하는 것)
- ❌ CTA (Call To Action)

**색상 이론:**
- 틸은 평온, 안정, 완성을 상징
- 완료 상태와 선택된 항목을 표현하기에 최적

### 상태 색상 (Status Colors)

#### Success (성공)
```css
--success: #20808D;          /* 성공 상태 (tertiary와 동일) */
--success-bg: #d4edda;       /* 성공 배경 */
--success-text: #155724;     /* 성공 텍스트 */
--success-border: #c3e6cb;   /* 성공 테두리 */
```

**사용 예시:**
- 작업 완료 메시지
- 성공 알림
- 100% 진행 상태
- 확인/승인 표시

#### Warning (경고)
```css
--warning: #ffc107;          /* 경고 상태 */
--warning-bg: #fff3cd;       /* 경고 배경 */
--warning-text: #856404;     /* 경고 텍스트 */
--warning-border: #ffeaa7;   /* 경고 테두리 */
```

**사용 예시:**
- 진행 중 상태
- 주의 필요 알림
- 불완전한 작업
- 검토 필요 항목

#### Danger/Error (오류)
```css
--danger: #dc3545;           /* 오류 상태 */
--danger-bg: #f8d7da;        /* 오류 배경 */
--danger-text: #721c24;      /* 오류 텍스트 */
--danger-border: #f5c6cb;    /* 오류 테두리 */
```

**사용 예시:**
- 오류 메시지
- 삭제 확인
- 실패 상태
- 위험 경고

#### Info (정보)
```css
--info: #0099ff;             /* 정보 상태 */
--info-bg: #d1ecf1;          /* 정보 배경 */
--info-text: #0c5460;        /* 정보 텍스트 */
--info-border: #bee5eb;      /* 정보 테두리 */
```

**사용 예시:**
- 안내 메시지
- 도움말
- 팁과 힌트
- 일반 알림

#### Neutral (중립)
```css
--neutral: #6c757d;          /* 중립/비활성 상태 */
--neutral-bg: #e2e3e5;       /* 중립 배경 */
--neutral-text: #383d41;     /* 중립 텍스트 */
```

**사용 예시:**
- 비활성화 요소
- 보조 정보
- 대기 중 상태
- 회색 텍스트

### 기본 색상 (Base Colors)

#### Background (배경)
```css
--bg-light: #f8f9fa;         /* 밝은 배경 (페이지 배경) */
--bg-white: #ffffff;         /* 화이트 배경 (카드, 패널) */
--bg-dark: #212529;          /* 어두운 배경 */
--bg-overlay: rgba(0, 0, 0, 0.5);  /* 모달 오버레이 */
```

#### Text (텍스트)
```css
--text-primary: #000000;     /* 주요 텍스트 (순수 검정) ✅ 승인됨 */
--text-secondary: #666666;   /* 보조 텍스트 */
--text-tertiary: #999999;    /* 3차 텍스트 (placeholder 등) */
--text-inverse: #ffffff;     /* 역전 텍스트 (어두운 배경 위) */
```

#### Border (테두리)
```css
--border-color: #dee2e6;     /* 기본 테두리 */
--border-light: #e9ecef;     /* 밝은 테두리 */
--border-dark: #ced4da;      /* 어두운 테두리 */
```

### 색상 사용 가이드라인

#### 명암비 (Contrast Ratio)
```
최소 명암비 요구사항 (WCAG 2.1 AA):
- 일반 텍스트: 4.5:1
- 큰 텍스트 (18pt+): 3:1
- UI 컴포넌트: 3:1
```

**검증된 조합:**
```css
/* ✅ 통과 (4.52:1) */
color: var(--text-primary);      /* #212529 */
background: var(--bg-white);      /* #ffffff */

/* ✅ 통과 (7.21:1) */
color: var(--text-inverse);      /* #ffffff */
background: var(--primary);      /* #6B5CCC */

/* ✅ 통과 (4.68:1) */
color: var(--text-secondary);    /* #6c757d */
background: var(--bg-white);      /* #ffffff */
```

#### 색상 조합 권장사항

**✅ 좋은 예시:**
```css
/* Primary와 White */
background: var(--primary);
color: white;

/* Secondary와 White */
background: var(--secondary);
color: white;

/* Success 배경과 텍스트 */
background: var(--success-bg);
color: var(--success-text);
border: 1px solid var(--success-border);
```

**❌ 피해야 할 예시:**
```css
/* 명암비 부족 */
background: var(--bg-light);
color: var(--text-tertiary);  /* 너무 밝음 */

/* 색상 충돌 */
background: var(--primary);
color: var(--secondary);  /* 두 메인 색상 충돌 */
```

---

## 타이포그래피 (Typography)

### 폰트 패밀리 (Font Family)

#### 기본 폰트 스택 ✅ 승인됨
```css
--font-family-base: 'Malgun Gothic', '맑은 고딕', 'Noto Sans KR', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-heading: 'Malgun Gothic', '맑은 고딕', 'Segoe UI', 'Arial', sans-serif;
--font-family-mono: 'Consolas', 'Monaco', 'Courier New', monospace;
--font-family-korean: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
```

**폰트 선택 이유:**
- **Malgun Gothic (맑은 고딕)**: 최우선 사용, Windows 기본 폰트, 한글 가독성 우수 ✅
- **Noto Sans KR**: 대체 폰트, Google Fonts 무료
- **Inter**: 영문 가독성 우수, 모던한 느낌
- **System Fonts**: 빠른 로딩, 네이티브 느낌
- **Consolas/Monaco**: 코드/데이터 표시에 최적

### 폰트 크기 (Font Size)

#### 스케일 시스템 (Type Scale)
```css
/* Display - 큰 제목, 랜딩 페이지 */
--font-size-display: 28px;       /* 헤더 로고 */
--line-height-display: 1.2;

/* Heading 1 - 페이지 제목 */
--font-size-h1: 24px;
--line-height-h1: 1.3;

/* Heading 2 - 주요 섹션 제목 */
--font-size-h2: 20px;
--line-height-h2: 1.4;

/* Heading 3 - 하위 섹션 제목 */
--font-size-h3: 16px;
--line-height-h3: 1.5;

/* Heading 4 - 카드/컴포넌트 제목 */
--font-size-h4: 14px;
--line-height-h4: 1.5;

/* Body - 본문 텍스트 */
--font-size-base: 14px;
--line-height-base: 1.6;

/* Body Large - 강조 본문 */
--font-size-lg: 15px;
--line-height-lg: 1.6;

/* Body Small - 보조 텍스트 */
--font-size-sm: 13px;
--line-height-sm: 1.5;

/* Caption - 캡션, 힌트 */
--font-size-xs: 12px;
--line-height-xs: 1.4;

/* Tiny - 작은 레이블, 배지 */
--font-size-2xs: 11px;
--line-height-2xs: 1.4;

/* Micro - 최소 크기 텍스트 */
--font-size-3xs: 10px;
--line-height-3xs: 1.3;

/* Mini - 매우 작은 텍스트 */
--font-size-4xs: 9px;
--line-height-4xs: 1.2;

/* Ultra Mini - 극소 텍스트 */
--font-size-5xs: 7px;
--line-height-5xs: 1.2;
```

#### 폰트 크기 사용 가이드

| 요소 | 크기 | 사용 예시 |
|------|------|-----------|
| 헤더 로고 | 28px | SSALWorks 로고 |
| 페이지 제목 | 20-24px | "프로젝트 관리", "작업 공간" |
| 섹션 제목 | 16px | "현황 보드", "작업 목록" |
| 카드 제목 | 14px | 작업 카드 제목 |
| 본문 텍스트 | 14px | 설명, 내용 |
| 버튼 텍스트 | 11-13px | 액션 버튼 |
| 레이블/힌트 | 10-12px | 입력 필드 레이블 |
| 배지/태그 | 9-10px | 상태 배지 |
| 작은 아이콘 텍스트 | 7px | 트리 화살표 |

### 폰트 굵기 (Font Weight)

```css
--font-weight-light: 300;        /* 가벼운 텍스트 (거의 사용 안 함) */
--font-weight-regular: 400;      /* 일반 텍스트 */
--font-weight-medium: 500;       /* 중간 강조 */
--font-weight-semibold: 600;     /* 강조 텍스트 */
--font-weight-bold: 700;         /* 굵은 텍스트 */
--font-weight-extrabold: 800;    /* 매우 굵은 텍스트 (로고) */
```

#### 폰트 굵기 사용 가이드

| 굵기 | 값 | 사용 예시 |
|------|-----|-----------|
| Light | 300 | 보조 정보 (드물게 사용) |
| Regular | 400 | 본문 텍스트, 설명 |
| Medium | 500 | 버튼, 탭, 메뉴 항목 |
| Semibold | 600 | 제목, 강조 텍스트 |
| Bold | 700 | 주요 제목, 중요 정보 |
| Extrabold | 800 | 로고, 특별한 강조 |

### 타이포그래피 조합 예시

#### 헤더
```css
.header-logo {
    font-family: var(--font-family-heading);
    font-size: var(--font-size-display);     /* 28px */
    font-weight: var(--font-weight-extrabold); /* 800 */
    line-height: var(--line-height-display);  /* 1.2 */
    letter-spacing: -0.5px;
}
```

#### 페이지 제목
```css
.page-title {
    font-family: var(--font-family-base);
    font-size: var(--font-size-h1);          /* 24px */
    font-weight: var(--font-weight-bold);    /* 700 */
    line-height: var(--line-height-h1);      /* 1.3 */
    color: var(--primary-dark);
}
```

#### 본문 텍스트
```css
.body-text {
    font-family: var(--font-family-base);
    font-size: var(--font-size-base);        /* 14px */
    font-weight: var(--font-weight-regular); /* 400 */
    line-height: var(--line-height-base);    /* 1.6 */
    color: var(--text-primary);
}
```

#### 버튼 텍스트
```css
.button-text {
    font-family: var(--font-family-base);
    font-size: var(--font-size-2xs);         /* 11px */
    font-weight: var(--font-weight-semibold); /* 600 */
    letter-spacing: 0.3px;
}
```

### 타이포그래피 접근성

#### 읽기 쉬운 텍스트 작성

**✅ 좋은 예시:**
```css
/* 적절한 행간 (1.5 이상) */
p {
    line-height: 1.6;
}

/* 적절한 단어 간격 */
.readable-text {
    word-spacing: 0.05em;
}

/* 적절한 문단 간격 */
p + p {
    margin-top: 1em;
}
```

**❌ 피해야 할 예시:**
```css
/* 너무 좁은 행간 */
p {
    line-height: 1.1;  /* 읽기 어려움 */
}

/* 너무 작은 폰트 */
.small-text {
    font-size: 8px;  /* 가독성 낮음 */
}
```

---

## 간격 체계 (Spacing)

### 기본 간격 단위

```css
/* 4px 기반 스케일 시스템 */
--spacing-0: 0;
--spacing-1: 2px;      /* 0.25 × 8 */
--spacing-2: 4px;      /* 0.5 × 8 */
--spacing-3: 6px;      /* 0.75 × 8 */
--spacing-4: 8px;      /* 1 × 8 (기본 단위) */
--spacing-6: 10px;     /* 1.25 × 8 */
--spacing-8: 12px;     /* 1.5 × 8 */
--spacing-10: 14px;    /* 1.75 × 8 */
--spacing-12: 16px;    /* 2 × 8 */
--spacing-16: 20px;    /* 2.5 × 8 */
--spacing-20: 24px;    /* 3 × 8 */
--spacing-24: 32px;    /* 4 × 8 */
--spacing-32: 40px;    /* 5 × 8 */
```

**간격 선택 가이드:**

| 간격 | 값 | 사용 예시 |
|------|-----|-----------|
| 0 | 0px | 간격 제거 |
| 1 | 2px | 배지 내부 padding |
| 2 | 4px | 작은 요소 간격 |
| 3 | 6px | 아이콘과 텍스트 간격 |
| 4 | 8px | 기본 요소 간격 |
| 6 | 10px | 버튼 padding |
| 8 | 12px | 카드 내부 간격 |
| 10 | 14px | 섹션 내부 간격 |
| 12 | 16px | 패널 padding |
| 16 | 20px | 페이지 여백 |
| 20 | 24px | 헤더 padding |
| 24 | 32px | 섹션 간격 |
| 32 | 40px | 큰 섹션 간격 |

### 구체적인 간격 사용

#### Padding (내부 여백)

```css
/* 버튼 */
.button {
    padding: var(--spacing-6) var(--spacing-8);  /* 10px 12px */
}

.button-large {
    padding: var(--spacing-8) var(--spacing-12);  /* 12px 16px */
}

/* 카드 */
.card {
    padding: var(--spacing-10);  /* 14px */
}

.card-large {
    padding: var(--spacing-12);  /* 16px */
}

/* 헤더 */
.header {
    padding: 0 var(--spacing-24);  /* 0 32px */
}

/* 사이드바 */
.sidebar {
    padding: var(--spacing-12) var(--spacing-4);  /* 16px 8px */
}
```

#### Margin (외부 여백)

```css
/* 요소 간격 */
.element-gap-small {
    margin-bottom: var(--spacing-2);  /* 4px */
}

.element-gap-medium {
    margin-bottom: var(--spacing-4);  /* 8px */
}

.element-gap-large {
    margin-bottom: var(--spacing-8);  /* 12px */
}

/* 섹션 간격 */
.section {
    margin-bottom: var(--spacing-12);  /* 16px */
}

.section-large {
    margin-bottom: var(--spacing-16);  /* 20px */
}
```

#### Gap (Flexbox/Grid 간격)

```css
/* 작은 간격 */
.flex-gap-small {
    gap: var(--spacing-2);  /* 4px */
}

/* 중간 간격 */
.flex-gap-medium {
    gap: var(--spacing-4);  /* 8px */
}

/* 큰 간격 */
.flex-gap-large {
    gap: var(--spacing-8);  /* 12px */
}

/* 그리드 간격 */
.grid-gap {
    gap: var(--spacing-8);  /* 12px */
}
```

---

## 레이아웃 (Layout)

### Grid 시스템

#### 메인 레이아웃
```css
.layout-container {
    display: grid;
    grid-template-columns: 180px 1fr 280px;  /* 좌측 | 중앙 | 우측 */
    grid-template-rows: 70px 1fr 60px;       /* 헤더 | 본문 | 푸터 */
    min-height: 100vh;
    max-width: 1800px;
    margin: 0 auto;
}
```

**레이아웃 구성:**
```
┌─────────────────────────────────────────┐
│           Header (70px)                 │  ← 전체 너비
├──────────┬────────────────┬─────────────┤
│  Left    │    Center      │    Right    │
│ Sidebar  │   Workspace    │   Sidebar   │
│ (180px)  │     (1fr)      │   (280px)   │  ← 본문
│          │                │             │
│          │                │             │
├──────────┴────────────────┴─────────────┤
│           Footer (60px)                 │  ← 전체 너비
└─────────────────────────────────────────┘
```

#### 반응형 Grid
```css
/* 태블릿 (768px ~ 1024px) */
@media (max-width: 1024px) {
    .layout-container {
        grid-template-columns: 160px 1fr 240px;
    }
}

/* 모바일 (~ 768px) */
@media (max-width: 768px) {
    .layout-container {
        grid-template-columns: 1fr;  /* 단일 컬럼 */
        grid-template-rows: 60px auto auto auto 60px;
    }
}
```

### 컨테이너

#### 최대 너비
```css
--container-max-width: 1800px;   /* 전체 레이아웃 */
--content-max-width: 1200px;     /* 콘텐츠 영역 */
--text-max-width: 800px;         /* 텍스트 영역 */
```

#### 컨테이너 클래스
```css
.container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-16);
}

.container-content {
    max-width: var(--content-max-width);
    margin: 0 auto;
}

.container-text {
    max-width: var(--text-max-width);
    margin: 0 auto;
}
```

---

## 컴포넌트 (Components)

### 버튼 (Buttons)

#### 기본 버튼
```css
.btn {
    padding: var(--spacing-6) var(--spacing-8);  /* 10px 12px */
    font-size: var(--font-size-2xs);             /* 11px */
    font-weight: var(--font-weight-semibold);    /* 600 */
    border-radius: var(--border-radius);         /* 8px */
    border: 2px solid;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-3);                       /* 6px */
    min-width: 100px;
}
```

#### 버튼 variants
```css
/* Primary 버튼 */
.btn-primary {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.btn-primary:hover {
    background: var(--primary-dark);
    border-color: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

/* Secondary 버튼 */
.btn-secondary {
    background: white;
    color: #333;
    border-color: #999;
}

.btn-secondary:hover {
    background: var(--tertiary);
    color: white;
    border-color: var(--tertiary);
}

/* Success 버튼 */
.btn-success {
    background: var(--success);
    color: white;
    border-color: var(--success);
}

.btn-success:hover {
    background: var(--tertiary-dark);
    border-color: var(--tertiary-dark);
}

/* 헤더 버튼 */
.btn-header {
    padding: var(--spacing-4) var(--spacing-12);
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    color: white;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
}

.btn-header:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
}
```

#### 버튼 크기
```css
/* 작은 버튼 */
.btn-sm {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--font-size-3xs);
    min-width: 60px;
}

/* 중간 버튼 (기본) */
.btn-md {
    padding: var(--spacing-6) var(--spacing-8);
    font-size: var(--font-size-2xs);
    min-width: 100px;
}

/* 큰 버튼 */
.btn-lg {
    padding: var(--spacing-8) var(--spacing-12);
    font-size: var(--font-size-base);
    min-width: 120px;
}
```

### 카드 (Cards)

#### 기본 카드
```css
.card {
    background: var(--bg-white);
    border-radius: var(--border-radius);
    padding: var(--spacing-10);
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}
```

#### 작업 카드
```css
.task-card {
    background: white;
    border-radius: var(--border-radius);
    padding: var(--spacing-10);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 4px solid;
    position: relative;
    overflow: hidden;
}

.task-card.completed {
    border-left-color: var(--success);
}

.task-card.in-progress {
    border-left-color: var(--warning);
}

.task-card.pending {
    border-left-color: var(--neutral);
}

.task-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}
```

### 입력 필드 (Input Fields)

#### 텍스트 입력
```css
.input {
    width: 100%;
    padding: var(--spacing-8);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    font-family: var(--font-family-base);
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
    color: var(--text-primary);
    transition: border-color 0.2s ease;
}

.input:focus {
    outline: none;
    border-color: var(--primary);
}

.input::placeholder {
    color: var(--text-tertiary);
}

.input:disabled {
    background: var(--bg-light);
    color: var(--text-secondary);
    cursor: not-allowed;
}
```

#### 텍스트 영역
```css
.textarea {
    width: 100%;
    min-height: 100px;
    padding: var(--spacing-8);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    font-family: var(--font-family-korean);
    font-size: var(--font-size-xs);
    line-height: var(--line-height-base);
    resize: vertical;
    transition: border-color 0.2s ease;
}

.textarea:focus {
    outline: none;
    border-color: var(--neutral);
}
```

### 배지 (Badges)

#### 상태 배지
```css
.badge {
    padding: var(--spacing-1) var(--spacing-4);
    border-radius: 12px;
    font-size: var(--font-size-3xs);
    font-weight: var(--font-weight-semibold);
    display: inline-block;
}

.badge-completed {
    background: var(--success-bg);
    color: var(--success-text);
}

.badge-in-progress {
    background: var(--warning-bg);
    color: var(--warning-text);
}

.badge-pending {
    background: var(--neutral-bg);
    color: var(--neutral-text);
}

/* 작은 배지 (프로젝트 상태) */
.badge-sm {
    font-size: var(--font-size-4xs);
    padding: var(--spacing-1) var(--spacing-3);
    border-radius: 10px;
}
```

### 진행 바 (Progress Bar)

```css
.progress-bar {
    width: 100%;
    height: 5px;
    background: var(--bg-light);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--success);
    transition: width 0.3s ease;
}

/* Process Progress Bar */
.process-progress {
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
}

.process-progress-fill {
    height: 100%;
    background: var(--success);
    transition: width 0.3s ease;
}

/* 활성 상태 */
.active .process-progress-fill {
    background: linear-gradient(90deg, var(--warning) 0%, #ffca2c 100%);
}
```

### 사이드바 (Sidebar)

#### 좌측 사이드바 (프로세스)
```css
.left-sidebar {
    background: var(--bg-white);
    border-right: 1px solid var(--border-color);
    padding: var(--spacing-12) var(--spacing-4) var(--spacing-12) var(--spacing-8);
    overflow-y: auto;
}

.sidebar-title {
    font-size: var(--font-size-h4);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-12);
    color: var(--text-primary);
}
```

#### 우측 사이드바 (콘텐츠 & 지원)
```css
.right-sidebar {
    background: var(--bg-white);
    border-left: 1px solid var(--border-color);
    padding: var(--spacing-12);
    overflow-y: auto;
}

.sidebar-section {
    margin-bottom: var(--spacing-4);
    padding-bottom: var(--spacing-4);
    border-bottom: 1px solid var(--border-color);
}

.sidebar-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}
```

### 헤더 (Header)

```css
.header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacing-24);
    box-shadow: var(--shadow-md);
    position: relative;
    z-index: 100;
}

.header-logo {
    font-size: var(--font-size-display);
    font-weight: var(--font-weight-extrabold);
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    letter-spacing: -0.5px;
}

.header-tagline {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.3px;
    opacity: 0.95;
}
```

### 알림 (Notifications)

```css
.notification {
    background: white;
    border-radius: var(--border-radius);
    padding: var(--spacing-8) var(--spacing-12);
    box-shadow: var(--shadow-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    animation: slideInDown 0.3s ease-out;
}

.notification-success {
    border: 2px solid var(--success);
}

.notification-warning {
    border: 2px solid var(--warning);
}

.notification-error {
    border: 2px solid var(--danger);
}

.notification-info {
    border: 2px solid var(--info);
}
```

---

## 애니메이션 & 효과 (Effects)

### Transition (전환 효과)

```css
/* 기본 전환 */
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

#### 일반적인 사용
```css
/* 버튼 호버 */
.button {
    transition: all var(--transition-base);
}

/* 카드 호버 */
.card {
    transition: transform var(--transition-base),
                box-shadow var(--transition-base);
}

/* 입력 필드 포커스 */
.input {
    transition: border-color var(--transition-base);
}
```

### Shadow (그림자)

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.2);
```

#### 그림자 사용 가이드

| 그림자 | 사용 예시 |
|--------|-----------|
| sm | 카드, 작은 컴포넌트 |
| md | 버튼 호버, 헤더 |
| lg | 모달, 드롭다운 |
| xl | 팝업, 중요한 오버레이 |

### Border Radius (모서리 둥글기)

```css
--border-radius-sm: 4px;      /* 작은 요소 */
--border-radius: 8px;         /* 기본 */
--border-radius-md: 6px;      /* 중간 */
--border-radius-lg: 12px;     /* 큰 요소 */
--border-radius-full: 50%;    /* 원형 */
```

### 애니메이션

#### Keyframes
```css
@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
```

#### 애니메이션 사용
```css
.animated-enter {
    animation: slideInDown 0.3s ease-out;
}

.fade-in {
    animation: fadeIn 0.4s ease-in;
}

.loading {
    animation: pulse 1.5s ease-in-out infinite;
}
```

### 호버 효과

```css
/* 버튼 호버 */
.btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

/* 카드 호버 */
.card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}

/* 메뉴 아이템 호버 */
.menu-item:hover {
    background: linear-gradient(90deg, rgba(255, 140, 0, 0.05) 0%, transparent 100%);
    transform: translateX(3px);
}
```

---

## 접근성 (Accessibility)

### 색상 명암비

**WCAG 2.1 AA 기준 준수:**
```
일반 텍스트: 최소 4.5:1
큰 텍스트 (18pt 이상): 최소 3:1
UI 컴포넌트: 최소 3:1
```

### 포커스 표시

```css
/* 포커스 아웃라인 */
*:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}

/* 버튼 포커스 */
.btn:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}

/* 입력 필드 포커스 */
.input:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px var(--primary-alpha-10);
}
```

### 키보드 네비게이션

```css
/* 탭 순서 표시 */
.interactive:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}

/* 마우스 클릭 시 아웃라인 제거 */
.interactive:focus:not(:focus-visible) {
    outline: none;
}
```

### 스크린 리더

```html
<!-- 좋은 예시 -->
<button aria-label="프로젝트 추가">
    <span aria-hidden="true">+</span>
</button>

<img src="logo.png" alt="SSALWorks 로고">

<!-- 나쁜 예시 -->
<button>
    <span>+</span>  <!-- 설명 없음 -->
</button>

<img src="logo.png">  <!-- alt 없음 -->
```

---

## 반응형 디자인 (Responsive)

### 브레이크포인트

```css
--breakpoint-xs: 480px;
--breakpoint-sm: 768px;
--breakpoint-md: 1024px;
--breakpoint-lg: 1280px;
--breakpoint-xl: 1440px;
--breakpoint-2xl: 1800px;
```

### 미디어 쿼리

```css
/* Mobile First 접근 */
.component {
    /* 모바일 스타일 (기본) */
}

/* 태블릿 */
@media (min-width: 768px) {
    .component {
        /* 태블릿 스타일 */
    }
}

/* 데스크톱 */
@media (min-width: 1024px) {
    .component {
        /* 데스크톱 스타일 */
    }
}

/* 큰 화면 */
@media (min-width: 1440px) {
    .component {
        /* 큰 화면 스타일 */
    }
}
```

### 반응형 레이아웃 예시

```css
/* 데스크톱 (기본) */
.layout-container {
    grid-template-columns: 180px 1fr 280px;
}

/* 태블릿 */
@media (max-width: 1024px) {
    .layout-container {
        grid-template-columns: 160px 1fr 240px;
    }
}

/* 모바일 */
@media (max-width: 768px) {
    .layout-container {
        grid-template-columns: 1fr;
    }

    .left-sidebar,
    .right-sidebar {
        display: none;  /* 모바일에서 숨김 */
    }
}
```

---

## 디자인 토큰 (Design Tokens)

### 전체 토큰 정의 (CSS Variables)

```css
:root {
    /* ===== Colors ===== */

    /* Primary */
    --primary: #6B5CCC;
    --primary-dark: #5847B3;
    --primary-light: #8B7FDD;
    --primary-alpha-10: rgba(107, 92, 204, 0.1);
    --primary-alpha-15: rgba(107, 92, 204, 0.15);

    /* Secondary */
    --secondary: #CC785C;
    --secondary-dark: #B35A44;
    --secondary-light: #E09D8C;
    --secondary-alpha-05: rgba(204, 120, 92, 0.05);

    /* Tertiary */
    --tertiary: #20808D;
    --tertiary-dark: #1A6B75;
    --tertiary-light: #4DA8B3;

    /* Status */
    --success: #20808D;
    --success-bg: #d4edda;
    --success-text: #155724;
    --success-border: #c3e6cb;

    --warning: #ffc107;
    --warning-bg: #fff3cd;
    --warning-text: #856404;
    --warning-border: #ffeaa7;

    --danger: #dc3545;
    --danger-bg: #f8d7da;
    --danger-text: #721c24;
    --danger-border: #f5c6cb;

    --info: #0099ff;
    --info-bg: #d1ecf1;
    --info-text: #0c5460;
    --info-border: #bee5eb;

    --neutral: #6c757d;
    --neutral-bg: #e2e3e5;
    --neutral-text: #383d41;

    /* Base */
    --bg-light: #f8f9fa;
    --bg-white: #ffffff;
    --bg-dark: #212529;
    --bg-overlay: rgba(0, 0, 0, 0.5);

    --text-primary: #212529;
    --text-secondary: #6c757d;
    --text-tertiary: #adb5bd;
    --text-inverse: #ffffff;

    --border-color: #dee2e6;
    --border-light: #e9ecef;
    --border-dark: #ced4da;

    /* ===== Typography ===== */

    /* Font Family - ✅ 승인됨: 맑은 고딕 우선 */
    --font-family-base: 'Malgun Gothic', '맑은 고딕', 'Noto Sans KR', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-family-heading: 'Malgun Gothic', '맑은 고딕', 'Segoe UI', 'Arial', sans-serif;
    --font-family-mono: 'Consolas', 'Monaco', 'Courier New', monospace;
    --font-family-korean: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;

    /* Font Size */
    --font-size-display: 28px;
    --font-size-h1: 24px;
    --font-size-h2: 20px;
    --font-size-h3: 16px;
    --font-size-h4: 14px;
    --font-size-base: 14px;
    --font-size-lg: 15px;
    --font-size-sm: 13px;
    --font-size-xs: 12px;
    --font-size-2xs: 11px;
    --font-size-3xs: 10px;
    --font-size-4xs: 9px;
    --font-size-5xs: 7px;

    /* Line Height */
    --line-height-display: 1.2;
    --line-height-h1: 1.3;
    --line-height-h2: 1.4;
    --line-height-h3: 1.5;
    --line-height-h4: 1.5;
    --line-height-base: 1.6;
    --line-height-lg: 1.6;
    --line-height-sm: 1.5;
    --line-height-xs: 1.4;
    --line-height-2xs: 1.4;
    --line-height-3xs: 1.3;
    --line-height-4xs: 1.2;
    --line-height-5xs: 1.2;

    /* Font Weight */
    --font-weight-light: 300;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;

    /* ===== Spacing ===== */

    --spacing-0: 0;
    --spacing-1: 2px;
    --spacing-2: 4px;
    --spacing-3: 6px;
    --spacing-4: 8px;
    --spacing-6: 10px;
    --spacing-8: 12px;
    --spacing-10: 14px;
    --spacing-12: 16px;
    --spacing-16: 20px;
    --spacing-20: 24px;
    --spacing-24: 32px;
    --spacing-32: 40px;

    /* ===== Effects ===== */

    /* Border Radius */
    --border-radius-sm: 4px;
    --border-radius: 8px;
    --border-radius-md: 6px;
    --border-radius-lg: 12px;
    --border-radius-full: 50%;

    /* Shadow */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
    --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.2);

    /* Transition */
    --transition-fast: 0.15s ease;
    --transition-base: 0.2s ease;
    --transition-slow: 0.3s ease;

    /* ===== Layout ===== */

    --container-max-width: 1800px;
    --content-max-width: 1200px;
    --text-max-width: 800px;

    /* ===== Z-index ===== */

    --z-index-dropdown: 1000;
    --z-index-sticky: 1020;
    --z-index-fixed: 1030;
    --z-index-modal-backdrop: 1040;
    --z-index-modal: 1050;
    --z-index-popover: 1060;
    --z-index-tooltip: 1070;
}
```

---

## 개선 제안

### 현재 디자인 분석

#### 강점
1. **일관된 색상 체계**: 3가지 주요 색상(Purple, Orange, Teal)이 명확하게 정의됨
2. **체계적인 간격**: 8px 기반 간격 시스템 사용
3. **명확한 레이아웃**: Grid 기반 3단 레이아웃
4. **부드러운 전환**: 일관된 transition 효과

#### 개선 필요 사항

**1. 폰트 크기 체계화**
```css
/* 현재: 산발적인 폰트 크기 (7px, 9px, 10px, 11px, 12px, 13px, 14px...) */
/* 개선: 명확한 Type Scale 정의 */

:root {
    --font-size-base: 14px;
    --font-size-scale: 1.2;  /* Major Second */
}

/* 예시: 1.2 비율로 확장 */
h1: 28px (14 × 2)
h2: 23px (14 × 1.6)
h3: 19px (14 × 1.4)
body: 14px (기본)
small: 12px (14 ÷ 1.2)
```

**2. 접근성 개선**

```css
/* 개선 전: 포커스 표시 없음 */
.button {
    /* no focus state */
}

/* 개선 후: 명확한 포커스 표시 */
.button:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}
```

**3. 다크 모드 지원**

```css
/* 다크 모드 토큰 추가 */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-light: #1a1a1a;
        --bg-white: #2d2d2d;
        --text-primary: #f8f9fa;
        --text-secondary: #adb5bd;
        --border-color: #444;
    }
}
```

**4. 반응형 타이포그래피**

```css
/* 개선: 화면 크기에 따른 폰트 크기 조정 */
:root {
    --font-size-base: 14px;
}

@media (max-width: 768px) {
    :root {
        --font-size-base: 13px;  /* 모바일: 작게 */
    }
}

@media (min-width: 1440px) {
    :root {
        --font-size-base: 15px;  /* 큰 화면: 크게 */
    }
}
```

**5. 컴포넌트 상태 명확화**

```css
/* 모든 인터랙티브 요소에 명확한 상태 정의 */
.button {
    /* default */
}

.button:hover {
    /* hover */
}

.button:active {
    /* active */
}

.button:focus {
    /* focus */
}

.button:disabled {
    /* disabled */
    opacity: 0.5;
    cursor: not-allowed;
}
```

### 현대적인 디자인 트렌드 반영

**1. Glassmorphism (유리 효과)**
```css
.glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}
```

**2. Neumorphism (부드러운 그림자)**
```css
.neumorphic {
    background: #f0f0f3;
    box-shadow:
        6px 6px 12px rgba(163, 177, 198, 0.6),
        -6px -6px 12px rgba(255, 255, 255, 0.5);
}
```

**3. 미세한 애니메이션**
```css
.micro-animation {
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.micro-animation:hover {
    transform: scale(1.02);
}
```

---

## 사용 예시

### 완전한 컴포넌트 예시

```html
<!-- 작업 카드 -->
<div class="task-card completed">
    <div class="task-header">
        <span class="task-id">P1BA1</span>
        <span class="badge badge-completed">완료</span>
    </div>
    <h3 class="task-title">회원가입 API 구현</h3>
    <div class="task-progress">
        <div class="progress-bar">
            <div class="progress-fill" style="width: 100%"></div>
        </div>
        <span class="progress-text">100%</span>
    </div>
</div>

<style>
.task-card {
    background: var(--bg-white);
    border-radius: var(--border-radius);
    padding: var(--spacing-10);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: all var(--transition-base);
    border-left: 4px solid var(--success);
}

.task-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-4);
}

.task-id {
    font-weight: var(--font-weight-bold);
    color: var(--secondary);
    font-size: var(--font-size-xs);
}

.task-title {
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-6);
    color: var(--text-primary);
    font-size: var(--font-size-xs);
}

.task-progress {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
}

.progress-bar {
    flex: 1;
    height: 5px;
    background: var(--bg-light);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--success);
    transition: width var(--transition-slow);
}

.progress-text {
    font-size: var(--font-size-2xs);
    font-weight: var(--font-weight-semibold);
    color: var(--text-secondary);
}
</style>
```

---

## 추가 리소스

### 디자인 도구
- **Figma**: UI/UX 디자인 및 프로토타입
- **Adobe Color**: 색상 팔레트 생성
- **Coolors**: 색상 조합 탐색
- **Type Scale**: 타이포그래피 스케일 생성

### 접근성 검사 도구
- **WAVE**: 웹 접근성 평가 도구
- **axe DevTools**: 브라우저 확장 프로그램
- **Contrast Checker**: 명암비 검사

### 참고 디자인 시스템
- **Material Design** (Google)
- **Fluent Design** (Microsoft)
- **Polaris** (Shopify)
- **Ant Design** (Alibaba)
- **Tailwind CSS**

---

## 버전 관리

**Version 1.0.0** (2025-11-18)
- 초기 디자인 시스템 구축
- dashboard-mockup.html 기반 분석
- 색상, 타이포그래피, 간격, 레이아웃 정의
- 주요 컴포넌트 스타일 가이드라인
- 접근성 및 반응형 디자인 가이드

---

## 문의 및 기여

디자인 시스템에 대한 문의사항이나 개선 제안은 프로젝트 팀에 문의하세요.

**유지보수 담당:** SSALWorks Design Team
**최종 업데이트:** 2025-11-18

---

**이 문서는 SSALWorks 프로젝트의 공식 디자인 시스템 가이드라인입니다.**
