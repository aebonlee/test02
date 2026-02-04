# Design System 4-Layer 단순화 계획

> 작성일: 2025-12-24
> 버전: v3.1 (6-Layer → 4-Layer)

---

## 1. 변경 배경

### 기존 문제점 (6-Layer)
- 중복 색상 존재 (Action-2 = Status Success, Action-3 = Status Info)
- Badge/Alert/Toast별 개별 색상 정의로 복잡성 증가
- 총 20개+ 색상 정의 → 관리 어려움

### 단순화 목표
- 중복 제거
- 규칙 기반 파생 색상 사용
- 총 12개 핵심 색상으로 압축 (40% 감소)

---

## 2. 4-Layer 구조

### Layer 1: Core (핵심 4색)

| Role | Name | Hex | Dark | 용도 |
|------|------|-----|------|------|
| **Brand** | Navy Blue | `#2C4A8A` | `#1F3563` | Header, Footer |
| **Action-1** | Amber Gold | `#F59E0B` | `#D97706` | 우측 사이드바 CTA |
| **Action-2** | Emerald | `#10B981` | `#059669` | 좌측 사이드바, Control Space, **Success** |
| **Action-3** | Blue | `#3B82F6` | `#2563EB` | 확인/검증, **Info** |

### Layer 2: Accent (콘텐츠 2색)

| Role | Name | Hex | Gradient | 용도 |
|------|------|-----|----------|------|
| **Content-1** | Violet | `#8B5CF6` | `→ #7C3AED` | Tips 섹션 |
| **Content-2** | Indigo | `#667eea` | `→ #764ba2` | Learning Books 섹션 |

### Layer 3: Semantic (상태 2색)

> Emerald(Success), Blue(Info)는 Core에서 재사용

| Role | Name | Hex | 용도 |
|------|------|-----|------|
| **Warning** | Yellow | `#ffc107` | 진행중, 주의 |
| **Error** | Red | `#EF4444` | 오류, 실패 |

### Layer 4: Neutral (중립 Gray Scale)

| Role | Hex | 용도 |
|------|-----|------|
| **Text-Primary** | `#212529` | 주요 텍스트 |
| **Text-Secondary** | `#495057` | 보조 텍스트 |
| **Text-Muted** | `#6c757d` | 힌트, 비활성 |
| **Border** | `#dee2e6` | 테두리 |
| **BG-Page** | `#f8f9fa` | 페이지 배경 |
| **BG-Surface** | `#ffffff` | 카드, 모달 |

---

## 3. 파생 색상 규칙

### Badge (뱃지)
```css
/* 규칙: Core/Semantic 색상 + 15% 투명도 */
.badge-success { background: rgba(16, 185, 129, 0.15); color: #059669; }
.badge-warning { background: rgba(255, 193, 7, 0.15); color: #92400E; }
.badge-error   { background: rgba(239, 68, 68, 0.15); color: #B91C1C; }
.badge-info    { background: rgba(59, 130, 246, 0.15); color: #1D4ED8; }
.badge-neutral { background: rgba(108, 117, 125, 0.15); color: #495057; }
```

### Toast (토스트 알림)
```css
/* 규칙: Core/Semantic 색상 + White 텍스트 */
.toast-success { background: #10B981; color: white; }
.toast-warning { background: #ffc107; color: #212529; }
.toast-error   { background: #EF4444; color: white; }
.toast-info    { background: #3B82F6; color: white; }
```

### Alert Box (알림 박스)
```css
/* 규칙: Badge BG + Core/Semantic Border (left 4px) */
.alert-success { background: rgba(16, 185, 129, 0.15); border-left: 4px solid #10B981; }
.alert-warning { background: rgba(255, 193, 7, 0.15); border-left: 4px solid #ffc107; }
.alert-error   { background: rgba(239, 68, 68, 0.15); border-left: 4px solid #EF4444; }
.alert-info    { background: rgba(59, 130, 246, 0.15); border-left: 4px solid #3B82F6; }
```

---

## 4. CSS Variables (신규)

```css
:root {
    /* ===== Layer 1: Core ===== */
    --color-navy: #2C4A8A;
    --color-navy-dark: #1F3563;
    --color-amber: #F59E0B;
    --color-amber-dark: #D97706;
    --color-emerald: #10B981;
    --color-emerald-dark: #059669;
    --color-blue: #3B82F6;
    --color-blue-dark: #2563EB;

    /* ===== Layer 2: Accent ===== */
    --color-violet: #8B5CF6;
    --color-violet-dark: #7C3AED;
    --color-indigo: #667eea;
    --color-indigo-dark: #764ba2;

    /* ===== Layer 3: Semantic ===== */
    --color-warning: #ffc107;
    --color-error: #EF4444;
    /* Success = --color-emerald */
    /* Info = --color-blue */

    /* ===== Layer 4: Neutral ===== */
    --text-primary: #212529;
    --text-secondary: #495057;
    --text-muted: #6c757d;
    --border-color: #dee2e6;
    --bg-page: #f8f9fa;
    --bg-surface: #ffffff;
}
```

---

## 5. UI Zone 매핑

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: --color-navy                                       │
├────────────────┬───────────────────────┬────────────────────┤
│ LEFT SIDEBAR   │ CENTER (Control Space)│ RIGHT SIDEBAR      │
│ --color-emerald│ --color-emerald       │ --color-amber      │
│                │                       │ --color-violet     │
│                │ Status:               │ --color-indigo     │
│                │ ✅ --color-emerald    │                    │
│                │ ⏳ --color-warning    │                    │
│                │ ❌ --color-error      │                    │
├────────────────┴───────────────────────┴────────────────────┤
│  FOOTER: --color-navy or --bg-surface                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. 삭제 예정 색상

| 기존 | 대체 |
|------|------|
| `--status-success` | `--color-emerald` |
| `--status-info` | `--color-blue` |
| `--badge-success-bg` | `rgba(var(--color-emerald), 0.15)` |
| `--badge-warning-bg` | `rgba(var(--color-warning), 0.15)` |
| 기타 개별 Badge/Alert 색상 | 규칙 기반 생성 |

---

## 7. 작업 체크리스트

- [ ] DESIGN_SYSTEM_V2.md 업데이트 (v3.1)
- [ ] Production/index.html CSS Variables 수정
- [ ] 중복 색상 변수 제거
- [ ] AI 1차 검증
- [ ] PO 테스트

---

**Document Created**: 2025-12-24
