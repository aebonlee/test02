# PoliticianFinder PWA 구현 리포트

**작성일**: 2026-01-03
**프로젝트**: PoliticianFinder
**커밋**: 574a01e

---

## 요약

Progressive Web App (PWA) 기본 지원을 구현하였습니다. 모바일에서 홈 화면에 추가하면 네이티브 앱처럼 작동합니다.

---

## 구현 항목

### 1. manifest.ts (Web App Manifest)

**파일**: `src/app/manifest.ts`

**생성 결과**: `/manifest.webmanifest` (0 B, 동적 생성)

**주요 설정**:

| 속성 | 값 | 설명 |
|------|-----|------|
| name | PoliticianFinder - 훌륭한 정치인 찾기 | 전체 이름 |
| short_name | PoliticianFinder | 홈 화면 표시 이름 |
| display | standalone | 네이티브 앱처럼 표시 |
| background_color | #ffffff | 스플래시 배경색 |
| theme_color | #f97316 | 상태바 색상 (주황) |
| orientation | portrait-primary | 세로 모드 기본 |
| start_url | / | 시작 URL |

**아이콘 설정**:
```typescript
icons: [
  { src: '/icons/icon-192x192.png', sizes: '192x192', purpose: 'maskable' },
  { src: '/icons/icon-512x512.png', sizes: '512x512', purpose: 'any' },
  { src: '/icons/apple-touch-icon.png', sizes: '180x180' },
]
```

**바로가기 (Shortcuts)**:
- 정치인 검색 → /politicians
- 커뮤니티 → /community

---

### 2. Viewport 설정 (layout.tsx)

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f97316' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
};
```

**효과**:
- 라이트/다크 모드에 따라 상태바 색상 자동 변경
- 사용자 확대 허용 (접근성)

---

### 3. iOS Safari 지원 (layout.tsx)

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="PoliticianFinder" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```

**효과**: iOS Safari에서 "홈 화면에 추가" 시 전체 화면 앱처럼 작동

---

## 수정/생성된 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/app/manifest.ts` | Web App Manifest (신규) |
| `src/app/layout.tsx` | Viewport 설정, iOS 메타태그 추가 |

---

## 후속 작업 (필수)

### 아이콘 파일 생성 필요

아래 경로에 실제 아이콘 이미지 추가 필요:

```
public/icons/
├── icon-192x192.png   (192x192, maskable)
├── icon-512x512.png   (512x512)
├── apple-touch-icon.png (180x180)
├── search-icon.png    (96x96, 바로가기용)
└── community-icon.png (96x96, 바로가기용)
```

**아이콘 생성 도구**:
- [Real Favicon Generator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://www.pwabuilder.com/)

### Service Worker (선택)

오프라인 지원을 위해 추후 Service Worker 추가 가능:
- next-pwa 패키지 사용 권장
- 캐싱 전략 설정

---

## PWA 테스트 방법

### Chrome DevTools

1. F12 → Application 탭
2. Manifest 섹션에서 설정 확인
3. Service Workers 섹션 확인

### Lighthouse

1. Chrome DevTools → Lighthouse 탭
2. "Progressive Web App" 체크
3. "Generate report" 실행

### 모바일 테스트

1. Chrome (Android): 메뉴 → "홈 화면에 추가"
2. Safari (iOS): 공유 → "홈 화면에 추가"

---

**작성자**: Claude Code
