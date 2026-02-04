# Miscellaneous Design Rules (기타 디자인 규칙)

> 작성일: 2025-12-24
> 버전: v1.0

---

## 1. Border Radius (모서리 둥글기)

### 3단계 스케일

| Level | Size | Name | 용도 | CSS Variable |
|-------|------|------|------|--------------|
| 1 | **4px** | Small | 버튼, 뱃지, 태그, 인풋 | `--radius-sm` |
| 2 | **8px** | Medium | 카드, 드롭다운, 팝오버 | `--radius-md` |
| 3 | **12px** | Large | 모달, 사이드바, 대형 컨테이너 | `--radius-lg` |

### 특수 케이스

| Size | 용도 |
|------|------|
| **50%** | 원형 (아바타, 알림뱃지) |
| **16px** | 특대형 카드 (허용) |

### 금지 항목

- ❌ 2px, 3px 사용 금지 → 4px 사용
- ❌ 6px 사용 금지 → 8px 사용
- ❌ 20px 사용 금지 → 12px 또는 16px 사용

### 마이그레이션

```
2px, 3px → 4px
6px → 8px
20px → 12px 또는 16px
```

---

## 2. Box Shadow (그림자)

### 3단계 스케일

| Level | Name | Value | 용도 | CSS Variable |
|-------|------|-------|------|--------------|
| 1 | **Small** | `0 2px 8px rgba(0,0,0,0.1)` | 버튼 hover, 작은 요소 | `--shadow-sm` |
| 2 | **Medium** | `0 4px 16px rgba(0,0,0,0.15)` | 카드, 드롭다운 | `--shadow-md` |
| 3 | **Large** | `0 10px 40px rgba(0,0,0,0.2)` | 모달, 팝업 | `--shadow-lg` |

### 특수 케이스

| Name | Value | 용도 |
|------|-------|------|
| **Sidebar** | `4px 0 20px rgba(0,0,0,0.15)` | 사이드바 |
| **Inset** | `inset 0 2px 4px rgba(0,0,0,0.1)` | 눌린 상태 |

### 금지 항목

- ❌ 하드코딩된 rgba 값 직접 사용 금지
- ❌ 0.25, 0.3 등 다양한 opacity 혼용 금지

### 통일 규칙

```css
/* 하드코딩 (금지) */
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

/* 변수 사용 (권장) */
box-shadow: var(--shadow-lg);
```

---

## 3. Padding (내부 여백)

### 4px 기반 단위 시스템

모든 padding은 4px의 배수로 설정

| 단위 | 값 | 용도 |
|------|-----|------|
| 1x | 4px | 태그 내부 |
| 2x | 8px | 버튼, 작은 요소 |
| 3x | 12px | 카드 내부 |
| 4x | 16px | 섹션 내부 |
| 5x | 20px | 모달 내부 |
| 6x | 24px | 대형 컨테이너 |

### 표준 조합

| 패턴 | 용도 | 예시 |
|------|------|------|
| `4px 8px` | 태그, 작은 뱃지 | `.status-badge` |
| `6px 12px` | 버튼 | `.action-btn` |
| `8px 16px` | 중형 버튼 | `.primary-btn` |
| `12px 16px` | 카드 내부 | `.card-body` |
| `16px 24px` | 모달 섹션 | `.modal-body` |
| `20px 24px` | 대형 모달 | `.modal-header` |

### 금지 항목

- ❌ 홀수 값 (5px, 7px, 9px 등) 사용 금지
- ❌ 10px 단독 사용 지양 → 8px 또는 12px 사용

---

## 4. Transition (애니메이션)

### 표준 속도

| Speed | Value | 용도 | CSS Variable |
|-------|-------|------|--------------|
| **Fast** | `0.15s` | hover 효과 | `--transition-fast` |
| **Normal** | `0.2s` | 일반 전환 | `--transition-normal` |
| **Slow** | `0.3s` | 모달, 큰 요소 | `--transition-slow` |

### 표준 easing

```css
transition-timing-function: ease;  /* 기본 */
transition-timing-function: ease-out;  /* 닫힘 */
transition-timing-function: ease-in-out;  /* 토글 */
```

### 통일 규칙

```css
/* 혼용 (금지) */
transition: all 0.2s;
transition: all 0.3s;

/* 통일 (권장) */
transition: all var(--transition-normal);
```

---

## 5. Button Height (버튼 높이)

### 3단계 스케일

| Size | Height | 용도 |
|------|--------|------|
| **Small** | 32px | 인라인 버튼, 태그 |
| **Medium** | 40px | 일반 버튼 |
| **Large** | 48px | 주요 CTA, 모바일 터치 |

### 모바일 최소 높이

- 터치 영역: **최소 44px** (iOS Human Interface Guidelines)

---

## 6. CSS Variables 추가

```css
:root {
    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;

    /* Box Shadow (기존 유지) */
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.2);

    /* Transition */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.2s ease;
    --transition-slow: 0.3s ease;
}
```

---

## 7. 마이그레이션 요약

| 항목 | 변경 전 | 변경 후 | 예상 수정 |
|------|---------|---------|----------|
| border-radius: 2px | 6개 | 4px | 6개 |
| border-radius: 3px | 3개 | 4px | 3개 |
| border-radius: 6px | 47개 | 8px | 47개 |
| border-radius: 20px | 4개 | 12px | 4개 |
| box-shadow 하드코딩 | 20개+ | var() | 20개+ |
| **총 예상** | | | **~80개** |

---

## 8. 체크리스트

적용 시 확인사항:

- [ ] border-radius가 4/8/12px 중 하나인가?
- [ ] box-shadow가 CSS 변수를 사용하는가?
- [ ] padding이 4px 배수인가?
- [ ] transition이 0.15/0.2/0.3s 중 하나인가?
- [ ] 모바일 버튼이 최소 44px인가?

---

**Document Created**: 2025-12-24
**Related**: DESIGN_SYSTEM_V2.md, FONT_SIZE_RULES.md, CLOSE_BUTTON_RULES.md
