# 웹사이트 디자인/UX/가독성 점검 보고서

**점검일시**: 2024-12-24
**점검자**: Claude Code
**점검 대상**: SSAL Works 웹사이트 전체

---

## 1. 점검 요약

| 항목 | 발견 수 | 심각도 |
|------|--------|--------|
| 디자인 규칙 위반 | 15+ | 높음 |
| 가독성 문제 | 3 | 중간 |
| UX 문제 | 5 | 중간 |
| 반응형 문제 | 2 | 낮음 |
| 일관성 문제 | 10+ | 높음 |

**총평**: 기능은 작동하나, 디자인 시스템 일관성과 유지보수성에 심각한 문제가 있습니다. 특히 색상 테마가 파일마다 다르고, 하드코딩된 값이 많아 향후 디자인 변경 시 대량 수정이 필요합니다.

---

## 2. 프로젝트 디자인 규칙 (기준)

```css
:root {
    /* 메인 테마 - Emerald Green */
    --primary: #10B981;
    --primary-dark: #059669;

    /* 서브 테마 - Amber Gold */
    --secondary: #F59E0B;
    --secondary-dark: #D97706;

    /* 3차 테마 - Navy Blue */
    --tertiary: #2C4A8A;
    --tertiary-dark: #1F3563;

    /* 상태 색상 */
    --success: #10B981;
    --warning: #ffc107;
    --danger: #EF4444;
    --info: #3B82F6;
    --neutral: #64748B;

    /* 배경 */
    --bg-light: #f8f9fa;
    --bg-white: #ffffff;
    --border-color: #dee2e6;
    --border-radius: 8px;
}
```

---

## 3. 디자인 규칙 준수 문제

### 3.1 색상 테마 불일치 (심각)

| 파일 | Primary 색상 | Secondary 색상 | 상태 |
|------|-------------|---------------|------|
| index.html | #10B981 (에메랄드) | #F59E0B (앰버) | 표준 |
| admin-dashboard.html | #6B5CCC (보라) | #CC785C (오렌지) | 불일치 |
| auth.css | #2C4A8A (네이비) | #F59E0B (앰버) | 부분 불일치 |
| inquiries.css | #667eea (보라) | - | 불일치 |
| payment-methods.css | #667eea (보라) | - | 불일치 |

**admin-dashboard.html (라인 24-29)**
```css
/* 현재 - 프로젝트 표준과 다름 */
--primary: #6B5CCC;
--primary-dark: #5847B3;
--secondary: #CC785C;
--secondary-dark: #B35A44;
```

**권장 수정**:
```css
--primary: #10B981;
--primary-dark: #059669;
--secondary: #F59E0B;
--secondary-dark: #D97706;
```

---

### 3.2 하드코딩된 색상 사용

**shared.css**
| 라인 | 현재 코드 | 권장 수정 |
|------|----------|----------|
| 43 | `background-color: #3b82f6;` | `var(--info)` |
| 54 | `background-color: #2563eb;` | `var(--info)` darker |
| 179 | `border-color: #3b82f6;` | `var(--info)` |

**admin.css**
| 라인 | 현재 코드 | 권장 수정 |
|------|----------|----------|
| 33 | `color: #3b82f6;` | `var(--primary)` |
| 176 | `background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);` | `var(--primary)` 계열 |
| 212 | `color: #3b82f6;` | `var(--primary)` |

---

## 4. 가독성 문제

### 4.1 너무 작은 폰트 크기

| 파일 | 라인 | 현재 | 권장 |
|------|------|------|------|
| index.html | 54 | `font-size: 11px;` (footer) | 12px 이상 |
| admin.css | 73 | `.badge { font-size: 11px; }` | 12px |

### 4.2 색상 대비 주의 필요

- inquiries.css (라인 15): `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`
- payment-methods.css (라인 15): 동일한 그라디언트 사용

---

## 5. UX 문제

### 5.1 버튼 클릭 영역 불일치

| 파일 | 버튼 클래스 | 패딩 | 상태 |
|------|------------|------|------|
| shared.css | .btn-primary | 10px 20px | 적절 |
| shared.css | .btn-info | 6px 12px | 너무 작음 |

**권장**: 모든 버튼 최소 패딩 `10px 16px`, 최소 클릭 영역 44x44px

### 5.2 비일관적인 border-radius

| 파일 | 사용값 |
|------|--------|
| index.html | 8px (변수) |
| auth.css | 10px, 20px |
| inquiries.css | 12px, 16px |
| payment-methods.css | 16px |

**권장 수정**: CSS 변수 체계화
```css
--border-radius-sm: 6px;
--border-radius: 8px;
--border-radius-md: 12px;
--border-radius-lg: 16px;
```

### 5.3 인라인 JavaScript 스타일 조작

**signup.html (라인 158-159)**
```html
<!-- 현재 - 권장하지 않음 -->
onmouseover="this.style.borderColor='var(--primary)'; this.style.background='#f8f9fa';"
onmouseout="this.style.borderColor='var(--border-color)'; this.style.background='white';"
```

**권장 수정**: CSS `:hover` 가상 클래스 사용

---

## 6. 반응형 문제

### 6.1 고정 픽셀 값 사용

| 파일 | 라인 | 코드 | 비고 |
|------|------|------|------|
| admin.css | 15 | `.admin-sidebar { width: 260px; }` | 태블릿 고려 필요 |
| admin.css | 62 | `grid-template-columns: 180px 1fr;` | 태블릿 고려 필요 |

### 6.2 미디어 쿼리 부재

- shared.css: 반응형 미디어 쿼리 없음
- 모바일에서 버튼 크기/폰트 조정 필요

---

## 7. 일관성 문제

### 7.1 버튼 스타일 불일치

**shared.css**
```css
.btn-primary {
    padding: 10px 20px;
    background-color: #3b82f6;
    border-radius: 8px;
}
```

**auth.css**
```css
.btn-primary {
    padding: 14px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: 10px;
}
```

**inquiries.css**
```css
.submit-button {
    padding: 12px 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
}
```

---

## 8. 우선순위별 수정 권장사항

### 긴급 (일관성 심각)

1. **admin-dashboard.html 색상 변수 수정**
   - `#6B5CCC` → `#10B981`
   - `#CC785C` → `#F59E0B`

2. **inquiries.css, payment-methods.css 색상 통일**
   - `#667eea` → `#10B981` 또는 `var(--primary)`

3. **shared.css, admin.css 하드코딩 색상 제거**
   - `#3b82f6` → `var(--info)` 또는 `var(--primary)`

### 높음 (UX 개선)

4. **버튼 스타일 통일**
   - 전역 버튼 클래스 정의
   - 최소 클릭 영역 보장

5. **인라인 스타일 제거**
   - signup.html 등 인라인 스타일을 CSS 클래스로 분리

### 중간 (가독성)

6. **폰트 크기 조정**
   - 11px → 12px 이상

7. **border-radius 변수 체계화**

### 낮음 (선택적)

8. **반응형 개선**
   - 미디어 쿼리 추가

---

## 9. 수정 예시 코드

### 예시 1: admin-dashboard.html 색상 통일

```css
/* 수정 전 */
:root {
    --primary: #6B5CCC;
    --primary-dark: #5847B3;
    --secondary: #CC785C;
    --secondary-dark: #B35A44;
}

/* 수정 후 */
:root {
    --primary: #10B981;
    --primary-dark: #059669;
    --secondary: #F59E0B;
    --secondary-dark: #D97706;
    --tertiary: #2C4A8A;
    --tertiary-dark: #1F3563;
}
```

### 예시 2: shared.css 하드코딩 제거

```css
/* 수정 전 */
.btn-primary {
    background-color: #3b82f6;
}

/* 수정 후 */
.btn-primary {
    background-color: var(--primary);
}
```

### 예시 3: 인라인 스타일 제거

```html
<!-- 수정 전 -->
<span style="color: #999; font-weight: normal;">(필수)</span>

<!-- 수정 후 -->
<span class="text-muted">(필수)</span>
```

```css
/* auth.css에 추가 */
.text-muted {
    color: var(--neutral);
    font-weight: normal;
}
```

---

## 10. 다음 단계

1. PO 검토 및 우선순위 확정
2. 긴급 항목부터 순차 수정
3. 수정 후 전체 테스트
4. 필요시 추가 점검 진행

---

**보고서 작성**: Claude Code
**파일 위치**: Human_ClaudeCode_Bridge/Reports/design_audit_report_20251224.md
