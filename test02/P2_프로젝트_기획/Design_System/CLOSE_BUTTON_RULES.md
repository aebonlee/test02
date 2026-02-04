# Close Button Rules (닫기 버튼 규칙)

> 작성일: 2025-12-24
> 버전: v1.0

---

## 1. 개요

SSALWorks UI에서 사용되는 닫기 버튼의 일관성 규칙을 정의합니다.

---

## 2. 버튼 유형별 규칙

### Type A: 모달 헤더 닫기 버튼

**위치:** 모달/팝업 헤더 우측 상단

**패턴:** `✕ 닫기` (아이콘 + 텍스트)

```html
<button style="
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 13px;
    cursor: pointer;
    padding: 6px 14px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;">
    ✕ 닫기
</button>
```

**적용 대상:**
- Grid 전체화면 모달
- Translation 전체화면 모달
- Outbox 모달
- 질문 이력 모달
- 서비스 가이드 모달
- Tips 전체뷰어 모달
- 이미 연결됨 안내 모달
- AI Tutor 닫기 버튼
- 서약서 모달 (agreementModal)
- 서약 완료 안내 모달 (agreementSuccessModal)
- 로그인 필요 안내 모달 (loginRequiredModal)
- 빌더 계정 필요 모달 (builderRequiredModal)
- 프로젝트 등록 모달 (addProjectModal)
- 내 문의 내역 모달 (myInquiriesModal)

**배경색 변형:**
| 컨텍스트 | 배경색 |
|----------|--------|
| 어두운 헤더 | `rgba(255, 255, 255, 0.2)` |
| 밝은/컬러 헤더 | `#6c757d` |

---

### Type B: 모달 하단 닫기 버튼

**위치:** 모달/팝업 하단 우측 정렬

**패턴:** `닫기` (텍스트만)

```html
<button style="
    padding: 8px 24px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;">
    닫기
</button>
```

**적용 대상:**
- Notice 모달
- FAQ 모달
- Tips 개별항목 모달
- 복사 완료 모달
- 가이드 팝업

**배경색 변형:**
| 컨텍스트 | 배경색 |
|----------|--------|
| 일반 (회색) | `#6c757d` / `#6b7280` |
| Tips (보라색) | `#8B5CF6` |

---

### Type C: 사이드바 닫기 버튼 (모바일)

**위치:** 사이드바 상단 우측

**패턴:** `✕` (아이콘만)

```html
<button class="sidebar-close-btn" onclick="closeSidebar()">✕</button>
```

```css
.sidebar-close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6c757d;
    display: none; /* 모바일에서만 표시 */
}
```

**적용 대상:**
- 좌측 사이드바
- 우측 사이드바

---

### Type D: 인라인 삭제/초기화 버튼

**위치:** 입력필드 내부, 태그/항목 옆

**패턴:** `×` 또는 `✕` (아이콘만, 소형)

```html
<!-- 검색 초기화 -->
<button style="background: none; border: none; cursor: pointer; color: #6c757d; font-size: 16px;">×</button>

<!-- 항목 삭제 -->
<span style="cursor: pointer; color: #EF4444;">✕</span>
```

**적용 대상:**
- 검색 입력 초기화
- 첨부파일 삭제
- 태그 삭제

---

## 3. 요약표

| 유형 | 위치 | 패턴 | 크기 | 배경 |
|------|------|------|------|------|
| **Type A** | 모달 헤더 | `✕ 닫기` | 13px | 반투명/컬러 |
| **Type B** | 모달 하단 | `닫기` | 14px | 회색/컬러 |
| **Type C** | 사이드바 | `✕` | 24px | 투명 |
| **Type D** | 인라인 | `×` / `✕` | 16px | 투명 |

---

## 4. 결정 트리

```
닫기 버튼이 필요한가?
    │
    ├─ 모달/팝업인가?
    │   ├─ 헤더 위치 → Type A: ✕ 닫기
    │   └─ 하단 위치 → Type B: 닫기
    │
    ├─ 사이드바인가?
    │   └─ Type C: ✕ (모바일)
    │
    └─ 인라인 요소인가?
        └─ Type D: × 또는 ✕
```

---

## 5. 금지 사항

- ❌ 모달 헤더에 아이콘만 (`×`) 사용 금지
- ❌ 사이드바 닫기에 텍스트 (`닫기`) 추가 금지
- ❌ 인라인 삭제에 텍스트 (`삭제`) 추가 금지 (공간 부족)

---

## 6. 관련 파일

- `Production/index.html` - 메인 대시보드
- `P2_프로젝트_기획/Design_System/DESIGN_SYSTEM_V2.md` - 전체 디자인 시스템

---

**Document Created**: 2025-12-24
