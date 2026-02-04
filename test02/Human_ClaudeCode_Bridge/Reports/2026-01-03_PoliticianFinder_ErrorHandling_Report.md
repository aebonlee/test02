# PoliticianFinder 에러 핸들링 개선 리포트

**작성일**: 2026-01-03
**프로젝트**: PoliticianFinder
**커밋**: b83b46c

---

## 요약

Next.js App Router의 에러 핸들링 개선 작업을 완료하였습니다.

---

## 개선 항목

### 1. 기존 구현 확인

| 파일 | 상태 | 내용 |
|------|:----:|------|
| `error.tsx` | ✅ 이미 존재 | 페이지별 에러 핸들러, 다크모드 지원 |
| `not-found.tsx` | ✅ 이미 존재 | 404 페이지, 모바일 최적화 |

---

### 2. not-found.tsx 다크모드 추가

**변경 전**: 라이트모드만 지원

**변경 후**: 다크모드 완전 지원

```tsx
// 배경
from-primary-50 to-white → dark:from-gray-900 dark:to-gray-800

// 텍스트
text-gray-900 → dark:text-white
text-gray-600 → dark:text-gray-300

// 버튼
bg-white → dark:bg-gray-700
text-primary-600 → dark:text-primary-400
```

---

### 3. global-error.tsx 신규 생성

**파일**: `src/app/global-error.tsx`

**용도**: 루트 레이아웃(layout.tsx)에서 발생하는 에러 처리

**특징**:
- `<html>`, `<body>` 태그 직접 렌더링 (필수)
- 다크모드 기본 적용 (루트 레이아웃 테마 접근 불가)
- 에러 로깅 (개발환경: 콘솔, 프로덕션: Sentry 준비)
- 다시 시도 / 홈으로 이동 버튼

```tsx
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body className="bg-gray-900 text-white">
        {/* 에러 UI */}
      </body>
    </html>
  );
}
```

---

## 에러 핸들링 구조

```
Next.js App Router 에러 처리 계층

├── global-error.tsx     ← 루트 레이아웃 에러 (최상위)
│
├── error.tsx (app/)     ← 모든 페이지 공통 에러
│
├── error.tsx (하위 폴더) ← 해당 라우트 전용 에러 (옵션)
│
└── not-found.tsx        ← 404 에러 전용
```

---

## 수정/생성된 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/app/not-found.tsx` | 다크모드 스타일 추가 |
| `src/app/global-error.tsx` | 신규 생성 (루트 에러 핸들러) |

---

## 기존 error.tsx 기능 (참고)

이미 구현된 기능:
- ✅ 에러 로깅 (개발/프로덕션 분기)
- ✅ reset() 함수로 재시도
- ✅ 다크모드 지원
- ✅ 모바일 최적화 (min-h-touch 터치 타겟)
- ✅ 에러 ID(digest) 표시 (개발환경)
- ✅ 고객센터 링크

---

## 후속 작업 (권장)

1. **Sentry 연동**: 프로덕션 에러 모니터링
2. **API 에러 핸들링**: 공통 API 에러 처리 로직
3. **에러 바운더리 테스트**: 의도적 에러 발생 테스트

---

**작성자**: Claude Code
