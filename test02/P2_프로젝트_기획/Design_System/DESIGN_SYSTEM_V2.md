# SSALWorks Design System v3.0

> **Theme**: Organic Growth (유기적 성장)
> **Keywords**: Growth, Warmth, Professional, Trust
> **Target**: Non-technical Founders (Avoiding "Dark Mode" Developer Tool look)

---

## 1. Color Palette (4-Layer System)

> 12개 핵심 색상으로 구성된 단순화된 색상 시스템. Badge/Alert/Toast는 규칙 기반으로 파생.

---

### Layer 1: Core (핵심 4색)

> 브랜드 + 액션 통합. 서비스의 주요 인터랙션 색상.

| Role | Name | Hex | Dark | 용도 |
| :--- | :--- | :--- | :--- | :--- |
| **Brand** | Navy Blue | `#2C4A8A` | `#1F3563` | Header, Footer |
| **Action-1** | Amber Gold | `#D97706` | `#B45309` | 우측 사이드바 CTA |
| **Action-2** | Emerald | `#10B981` | `#059669` | 좌측 사이드바, Control Space, **=Success** |
| **Action-3** | Blue | `#3B82F6` | `#2563EB` | 확인/검증, **=Info** |

---

### Layer 2: Accent (콘텐츠 2색)

> 학습 콘텐츠, 특수 섹션 구분.

| Role | Name | Hex | Gradient | 용도 |
| :--- | :--- | :--- | :--- | :--- |
| **Content-1** | Violet | `#8B5CF6` | `→ #7C3AED` | Tips 섹션 |
| **Content-2** | Indigo | `#667eea` | `→ #764ba2` | Learning Books 섹션 |

---

### Layer 3: Semantic (상태 2색)

> Success(=Emerald), Info(=Blue)는 Core에서 재사용. 추가 상태만 정의.

| Role | Name | Hex | 용도 |
| :--- | :--- | :--- | :--- |
| **Warning** | Yellow | `#ffc107` | 진행중, 주의 |
| **Error** | Red | `#EF4444` | 오류, 실패 |

---

### Layer 4: Neutral (중립 Gray Scale)

> 배경, 텍스트, 테두리 등 UI 기반.

| Role | Hex | Usage |
| :--- | :--- | :--- |
| **Text-Primary** | `#212529` | 주요 텍스트 |
| **Text-Secondary** | `#495057` | 보조 텍스트 |
| **Text-Muted** | `#6c757d` | 힌트, 비활성, **=Neutral 상태** |
| **Border** | `#dee2e6` | 테두리 |
| **BG-Page** | `#f8f9fa` | 페이지 배경 |
| **BG-Surface** | `#ffffff` | 카드, 모달, 패널 |

---

## 1.1 파생 색상 규칙

> Badge, Alert, Toast는 Core/Semantic 색상에서 규칙 기반으로 파생.

### Badge (뱃지)
```
배경: 해당 색상 + 15% 투명도
텍스트: 해당 색상 Dark 버전
```
| Status | Background | Text |
| :--- | :--- | :--- |
| Success | `rgba(16,185,129,0.15)` | `#059669` |
| Warning | `rgba(255,193,7,0.15)` | `#92400E` |
| Error | `rgba(239,68,68,0.15)` | `#B91C1C` |
| Info | `rgba(59,130,246,0.15)` | `#1D4ED8` |
| Neutral | `rgba(108,117,125,0.15)` | `#495057` |

### Toast (토스트 알림)
```
배경: 해당 색상 Solid
텍스트: White (Warning만 Dark)
```
| Type | Background | Text |
| :--- | :--- | :--- |
| Success | `#10B981` | White |
| Warning | `#ffc107` | `#212529` |
| Error | `#EF4444` | White |
| Info | `#3B82F6` | White |

### Alert Box (알림 박스)
```
배경: Badge 배경과 동일
Border: 해당 색상 Solid (left 4px)
텍스트: Badge 텍스트와 동일
```

---

## 1.2 UI Zone별 색상 맵

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: --color-navy                                           │
├────────────────┬───────────────────────┬────────────────────────┤
│ LEFT SIDEBAR   │ CENTER (Control Space)│ RIGHT SIDEBAR          │
│ --color-emerald│ --color-emerald       │ --color-amber          │
│                │                       │ --color-violet (Tips)  │
│ 프로세스/프로젝트│ SAL Grid Status:     │ --color-indigo (Books) │
│                │ ✅ --color-emerald    │                        │
│                │ ⏳ --color-warning    │ Verify: --color-blue   │
│                │ ❌ --color-error      │                        │
│                │ ⏸️ --text-muted       │                        │
├────────────────┴───────────────────────┴────────────────────────┤
│  FOOTER: --color-navy or --bg-surface                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1.3 CSS Variables (단순화)

```css
:root {
    /* ===== Layer 1: Core (4색) ===== */
    --color-navy: #2C4A8A;
    --color-navy-dark: #1F3563;
    --color-amber: #D97706;
    --color-amber-dark: #B45309;
    --color-emerald: #10B981;
    --color-emerald-dark: #059669;
    --color-blue: #3B82F6;
    --color-blue-dark: #2563EB;

    /* ===== Layer 2: Accent (2색) ===== */
    --color-violet: #8B5CF6;
    --color-violet-dark: #7C3AED;
    --color-indigo: #667eea;
    --color-indigo-dark: #764ba2;

    /* ===== Layer 3: Semantic (2색) ===== */
    --color-warning: #ffc107;
    --color-error: #EF4444;
    /* Success = --color-emerald, Info = --color-blue */

    /* ===== Layer 4: Neutral ===== */
    --text-primary: #212529;
    --text-secondary: #495057;
    --text-muted: #6c757d;
    --border-color: #dee2e6;
    --bg-page: #f8f9fa;
    --bg-surface: #ffffff;

    /* ===== 호환성 Alias ===== */
    --primary: var(--color-emerald);
    --secondary: var(--color-amber);
    --tertiary: var(--color-navy);
    --success: var(--color-emerald);
    --warning: var(--color-warning);
    --danger: var(--color-error);
    --info: var(--color-blue);
}

---

## 2. Typography

**Font Family**:
- `Pretendard` (Primary Korean/English) - *Recommended for web*
- Fallback: `Malgun Gothic`, `sans-serif`

**Scale**:
- **Display**: 28px (Bold)
- **H1**: 24px (Bold)
- **H2**: 20px (SemiBold)
- **H3**: 18px (SemiBold)
- **Body**: 15px (Regular)
- **Small**: 13px (Regular)
- **Tiny**: 11px (Medium)

---

## 3. Spacing & Layout

**Grid System**:
- 4px Base Unit (Tailwind Default)
- **Layout**: 3-Column Grid (Left Sidebar - Control Space - Right Sidebar)
    - Left: 240px (Fixed) - 프로세스/프로젝트 네비게이션
    - Center: Flex (Fluid) - Control Space (SAL Grid, 뷰어 등)
    - Right: 280px (Fixed) - 액션 버튼, 콘텐츠 바로가기

**Margin-Bottom 4단계 규칙** (2025-12-17 확정):
| 단계 | 용도 | 간격 | 적용 대상 |
| :--- | :--- | :--- | :--- |
| **1단계** | Section (섹션 제목) | `13px` | h2, stats-bar, grid-area, sidebar-title 등 |
| **2단계** | Group (그룹/카테고리) | `10px` | h3, project-list, area-header, search-area 등 |
| **3단계** | Item (개별 항목) | `6px` | h4, task-title 등 |
| **4단계** | Detail (세부 요소) | `4px` | h5 등 |

**사이드바 섹션 간격** (좌우 동일):
| 속성 | 값 | 설명 |
| :--- | :--- | :--- |
| `margin-bottom` | `12px` | 섹션 아래 여백 |
| `padding-bottom` | `12px` | 섹션 내부 하단 패딩 |
| `border-bottom` | `1px solid` | 구분선 |
| **총 간격** | **25px** | 12 + 12 + 1 = 25px |

**섹션 내부 h3 아래 간격**:
- `.sidebar-section h3`: `margin-bottom: 8px`
- h3 다음 요소에 추가 margin-top 없음 (일관성 유지)

**Radius**:
- **Small**: 4px (Buttons)
- **Medium**: 8px (Cards)
- **Large**: 12px (Modals)

---

## 4. Components

### Buttons
| Type | Background | Text | Border | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Brand** | Navy Blue | White | - | Header 내 주요 버튼 |
| **Action-Primary** | Amber Gold | White | - | 우측 사이드바 CTA |
| **Action-Secondary** | Emerald Green | White | - | 좌측/중앙 영역 액션 |
| **Secondary** | White | Slate-700 | Slate-300 | 보조 버튼 |
| **Ghost** | Transparent | Slate-600 | - | 텍스트 버튼 |
| **Verify** | Blue | White | - | 확인/검증 버튼 |

### Cards
- White Background
- Border: 1px solid Slate-200
- Shadow: `shadow-sm` (Tailwind)
- Hover: `shadow-md`, `border-emerald-200` (좌측/중앙) 또는 `border-amber-200` (우측)

### Navigation
- **Left Sidebar**: White Background, Emerald-500 Active States
- **Right Sidebar**: White Background, Amber-500 Active States
- **Active Item (Left)**: Emerald-50 Background, Emerald-600 Text, Emerald-500 Left Border
- **Active Item (Right)**: Amber-50 Background, Amber-600 Text
- **Menu Item**: Slate-700 Text, Hover: 해당 영역 색상-50 Background
- **Submenu**: Indented 16px, Slate-600 Text, Smaller Font (13px)

### Modals
- **Overlay**: rgba(0,0,0,0.5) Background, z-index: 10000
- **Content**: White Background, 420px Width, Centered (top: 50%, left: 50%, transform: translate(-50%, -50%))
- **Border Radius**: 16px
- **Shadow**: 0 10px 40px rgba(0,0,0,0.2)
- **Animation**: modalZoomIn (0.3s ease-out), modalZoomOut (0.3s ease-in)
- **Header**: 24px Font, Bold, Slate-900 Color
- **Body**: 15px Font, Slate-700 Color, 14px Padding
- **Footer Button**: Full Width, 12px Padding, Blue Background (#007bff)

### Input Fields
- **Text Input**: White Background, Border: 1px solid Slate-300
- **Focus**: Border: Emerald-500, Box-Shadow: 0 0 0 3px Emerald-100
- **Disabled**: Slate-100 Background, Slate-400 Text
- **Error**: Border: Red-500, Box-Shadow: 0 0 0 3px Red-100
- **Height**: 40px (Default), 32px (Small)
- **Padding**: 12px Horizontal

### Textarea
- **Same as Text Input** with additional:
- **Min Height**: 120px
- **Resize**: Vertical Only

### Alerts & Toasts
- **Success**: Emerald-50 Background, Emerald-800 Text, Emerald-500 Left Border
- **Warning**: Amber-50 Background (#fff3cd), Amber-800 Text, Amber-500 Left Border (#ffc107)
- **Error**: Red-50 Background, Red-800 Text, Red-500 Left Border
- **Info**: Blue-50 Background, Blue-800 Text, Blue-500 Left Border
- **Border Width**: 4px (Left)
- **Padding**: 14px
- **Radius**: 8px

### Badges
- **Primary**: Emerald-100 Background, Emerald-800 Text
- **Secondary**: Slate-100 Background, Slate-800 Text
- **Warning**: Amber-100 Background, Amber-800 Text
- **Padding**: 4px 8px
- **Font Size**: 12px
- **Radius**: 4px

### Progress Bar
- **Track**: Slate-200 Background
- **Fill**: Emerald-500 Background
- **Height**: 8px
- **Radius**: 4px
- **Animation**: Smooth transition (0.3s ease)

### Tooltips
- **Background**: Slate-900
- **Text**: White
- **Font Size**: 13px
- **Padding**: 8px 12px
- **Radius**: 6px
- **Arrow**: 6px Triangle, Same Color as Background
- **Max Width**: 200px

### Dropdowns
- **Menu**: White Background, Border: 1px solid Slate-200
- **Shadow**: 0 4px 6px rgba(0,0,0,0.1)
- **Item**: 14px Font, Slate-700 Text
- **Hover**: Emerald-50 Background, Emerald-700 Text
- **Active**: Emerald-500 Background, White Text
- **Padding**: 10px 16px per Item

### Tables
- **Header**: Slate-100 Background, Slate-900 Text, 14px Font (Bold)
- **Row**: White Background, Slate-700 Text
- **Hover**: Slate-50 Background
- **Border**: 1px solid Slate-200 (Bottom)
- **Padding**: 12px per Cell
- **Alternating Rows**: Optional Slate-50 Background (Zebra Stripe)

---

## 5. Animations

### Keyframes Defined

**modalZoomIn**:
```css
@keyframes modalZoomIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

**modalZoomOut**:
```css
@keyframes modalZoomOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}
```

**fadeIn**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**fadeOut**:
```css
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

**Usage**:
- Modals: 0.3s duration
- Toasts: 0.5s duration
- Hover States: 0.2s transition
- All Smooth: `transition: all 0.3s ease`

---

## 6. Icons

**Icon Library**:
- Font Awesome 6.x (CDN) - For general UI icons
- Custom SVG Icons - For brand-specific icons

**Icon Sizes**:
- Small: 14px
- Medium: 18px (Default)
- Large: 24px
- XLarge: 32px

**Icon Colors** (영역별):
| 영역 | Default | Active | Disabled |
| :--- | :--- | :--- | :--- |
| **Header/Footer** | White | White | Slate-400 |
| **Left Sidebar** | Slate-600 | Emerald-600 | Slate-400 |
| **Control Space** | Slate-600 | Emerald-600 | Slate-400 |
| **Right Sidebar** | Slate-600 | Amber-600 | Slate-400 |
| **Content (Purple)** | White | White | Slate-400 |
- **Error**: Red-500 (전역)

---

## 7. Responsive Breakpoints

**Breakpoints** (Tailwind CSS):
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

**Layout Adaptations**:
- **Desktop (≥1024px)**: 3-Column Layout (Left Sidebar - Control Space - Right Sidebar)
- **Tablet (768px - 1023px)**: 2-Column Layout (Control Space - Right Sidebar, Left Sidebar Collapsible)
- **Mobile (<768px)**: 1-Column Layout (Control Space Only, Sidebars Hidden/Drawer)

---

## 8. Accessibility

**Focus States** (영역별):
- **Header/Footer**: 3px solid White outline with 2px offset
- **Left Sidebar/Control Space**: 3px solid Emerald-500 outline with 2px offset
- **Right Sidebar**: 3px solid Amber-500 outline with 2px offset
- **Verification Actions**: 3px solid Blue-500 outline with 2px offset
- Skip to Content Link (Hidden, Visible on Focus)

**Color Contrast**:
- Text/Background: Minimum WCAG AA (4.5:1)
- Large Text: Minimum WCAG AA (3:1)

**Keyboard Navigation**:
- Tab Order: Logical (Top to Bottom, Left to Right)
- Escape Key: Close Modals/Dropdowns
- Enter/Space: Activate Buttons/Links

**Screen Readers**:
- All Images: `alt` attribute
- All Interactive Elements: ARIA labels
- Modal Focus Trap: Enabled

---

## 9. Implementation Notes

### CSS Framework
- **Tailwind CSS v3.x** (Utility-First)
- Custom Components: Extended with `@layer components`

### File Structure
```
/css
  ├── tailwind.config.js    # Tailwind Configuration
  ├── globals.css           # Global Styles + Tailwind Imports
  ├── components.css        # Custom Component Styles
  └── animations.css        # Keyframe Animations
```

### CDN Links (Prototype)
- Tailwind CSS: `https://cdn.tailwindcss.com`
- Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- Pretendard Font: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css`

---

## 10. Brand Assets

### Logo
- **Format**: SVG (Vector)
- **Primary Color**: Navy Blue (#2C4A8A)
- **Accent Color**: Amber Gold (#D97706)
- **Secondary Accent**: Emerald Green (#10B981)
- **Variations**:
  - Full Logo (Text + Icon)
  - Icon Only (Square)
  - Wordmark Only (Text)
  - Reversed (White on Navy background)

### Favicon
- **Sizes**: 16×16, 32×32, 48×48, 64×64
- **Format**: ICO + PNG

---

## 11. Version History

| Version | Date | Changes |
| :--- | :--- | :--- |
| v1.0 | 2025-11-10 | Initial Design System |
| v2.0 | 2025-12-01 | Components Section Complete |
| v2.1 | 2025-12-17 | Spacing 4단계 규칙 추가 |
| v3.0 | 2025-12-24 | 6-Layer Color System 도입 |
| v3.1 | 2025-12-24 | **4-Layer로 단순화**: 12개 핵심 색상, 중복 제거 (Success=Emerald, Info=Blue), Badge/Alert/Toast 규칙 기반 파생 |
| **v3.2** | **2025-12-30** | **Amber 색상 변경**: #F59E0B → #D97706, #D97706 → #B45309 (사용자 피드백: 눈부심 감소) |

---

## 12. Color Quick Reference (빠른 참조)

### 4-Layer 핵심 색상 (12개)

| Layer | Role | Hex | CSS Variable |
| :--- | :--- | :--- | :--- |
| **Core** | Navy (Brand) | `#2C4A8A` | `--color-navy` |
| **Core** | Amber (Action-1) | `#D97706` | `--color-amber` |
| **Core** | Emerald (Action-2, Success) | `#10B981` | `--color-emerald` |
| **Core** | Blue (Action-3, Info) | `#3B82F6` | `--color-blue` |
| **Accent** | Violet (Tips) | `#8B5CF6` | `--color-violet` |
| **Accent** | Indigo (Books) | `#667eea` | `--color-indigo` |
| **Semantic** | Yellow (Warning) | `#ffc107` | `--color-warning` |
| **Semantic** | Red (Error) | `#EF4444` | `--color-error` |
| **Neutral** | Text Primary | `#212529` | `--text-primary` |
| **Neutral** | Text Muted | `#6c757d` | `--text-muted` |
| **Neutral** | Border | `#dee2e6` | `--border-color` |
| **Neutral** | BG Page | `#f8f9fa` | `--bg-page` |

### 파생 규칙 요약
| 용도 | 규칙 |
| :--- | :--- |
| **Badge BG** | Core/Semantic 색상 + 15% 투명도 |
| **Badge Text** | Core/Semantic Dark 버전 |
| **Toast** | Core/Semantic 색상 + White 텍스트 |
| **Alert Box** | Badge BG + Core/Semantic Border (left 4px) |

---

**Document Complete**

This design system is now ready for implementation across the SSALWorks platform.
The v3.0 color system reflects the actual implementation in `Production/index.html` with a logical 5-layer structure.

## 관련 문서

| 문서 | 내용 |
| :--- | :--- |
| `CLOSE_BUTTON_RULES.md` | 닫기 버튼 유형별 규칙 (Type A~D) |

