# PoliticianFinder 개선 분석 보고서

> **분석일**: 2026-01-03
> **프로젝트**: PoliticianFinder (정치인 평가 플랫폼)
> **위치**: `C:\Development_PoliticianFinder_com\Developement_Real_PoliticianFinder\1_Frontend`
> **기술 스택**: Next.js 14+, Tailwind CSS, TypeScript

---

## 1. 추가 개선 가능 영역 (모바일 최적화 이후)

| # | 영역 | 현재 상태 | 개선 효과 | 우선순위 |
|---|------|----------|----------|:--------:|
| 1 | **성능 최적화** | 미확인 | 페이지 로드 속도 향상 | 🔴 높음 |
| 2 | **접근성 (A11y)** | 부분 구현 | 장애인 사용성, 법적 준수 | 🔴 높음 |
| 3 | **SEO 최적화** | 미확인 | 검색 엔진 노출 향상 | 🟡 중간 |
| 4 | **에러 핸들링 통일** | 분산됨 | 사용자 경험 일관성 | 🟡 중간 |
| 5 | **테스트 커버리지** | 미확인 | 안정성 향상 | 🟡 중간 |
| 6 | **PWA** | 미구현 | 앱처럼 설치 가능 | 🟢 낮음 |

### 영역별 상세 설명

#### 1. 성능 최적화
- 이미지 최적화 (next/image)
- 폰트 최적화 (next/font)
- 코드 스플리팅 (dynamic import)
- 번들 크기 분석 및 최적화

#### 2. 접근성 (A11y)
- ARIA 레이블 추가
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 색상 대비율 검사

#### 3. SEO 최적화
- 메타 태그 완성 (Open Graph, Twitter Card)
- 구조화된 데이터 (JSON-LD)
- 사이트맵 생성
- 로봇.txt 최적화

#### 4. 에러 핸들링 통일
- Error Boundary 컴포넌트
- 공통 에러 페이지 (404, 500)
- API 에러 처리 통일
- 토스트 알림 시스템

#### 5. 테스트 커버리지
- Jest 설정 최적화
- E2E 테스트 (Playwright)
- 컴포넌트 테스트
- API 통합 테스트

#### 6. PWA (Progressive Web App)
- manifest.json
- Service Worker
- 오프라인 지원
- 푸시 알림

---

## 2. 성능 최적화 점검 결과

### 요약표

| 항목 | 현재 상태 | 권장 조치 | 우선순위 |
|------|----------|----------|:--------:|
| 이미지 최적화 | ⚠️ 26개 `<img>` 사용 | next/image 변환 | 🔴 높음 |
| 폰트 최적화 | ⚠️ 외부 Google Fonts | next/font 사용 | 🔴 높음 |
| 코드 스플리팅 | ⚠️ 일부만 적용 | recharts 등 동적 로딩 | 🟡 중간 |
| 번들 분석 | ❌ 미설치 | @next/bundle-analyzer 설치 | 🟡 중간 |
| 빌드 크기 | 527MB (.next) | 최적화 필요 | 🟡 중간 |
| 지연 로딩 | ⚠️ 1개만 적용 | 이미지에 적용 | 🟢 낮음 |

---

### 상세 분석

#### 2.1 이미지 최적화 (우선순위: 높음)

**현재 상태:**
- `next/image` 사용: 3개 파일만
  - `src/app/admin/components/AdminSidebar.tsx`
  - `src/app/page.tsx`
  - `src/components/ui/ImageGallery.tsx`
- `<img>` 태그 사용: 26개 인스턴스

**문제점:**
- 일반 `<img>` 태그는 자동 최적화 없음
- WebP/AVIF 변환 없음
- 반응형 이미지 없음
- lazy loading 자동 적용 안 됨

**권장 조치:**
```tsx
// Before
<img src="/profile.jpg" alt="프로필" />

// After
import Image from 'next/image';
<Image src="/profile.jpg" alt="프로필" width={100} height={100} />
```

**주요 수정 대상 파일:**
- `src/app/mypage/page.tsx` (프로필 이미지)
- `src/app/notices/[id]/page.tsx`
- `src/app/page.tsx` (AI 로고 이미지)

---

#### 2.2 폰트 최적화 (우선순위: 높음)

**현재 상태:**
- 외부 Google Fonts CDN 사용

```html
<!-- layout.tsx에서 발견 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

**문제점:**
- 외부 요청으로 FOIT/FOUT 발생 가능
- 렌더링 차단 리소스
- 개인정보 (IP) 노출

**권장 조치:**
```tsx
// layout.tsx
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoSansKr.className}>
      {children}
    </html>
  );
}
```

**효과:**
- 빌드 타임에 폰트 다운로드
- 자체 호스팅으로 외부 요청 제거
- FOIT/FOUT 방지

---

#### 2.3 코드 스플리팅 (우선순위: 중간)

**현재 상태:**
- `dynamic()` 사용: 2개 컴포넌트만
  - Header
  - MobileTabBar

```tsx
// layout.tsx
const Header = dynamic(() => import('./components/header'), { ssr: false });
const MobileTabBar = dynamic(() => import('@/components/layout/MobileTabBar'), { ssr: false });
```

**문제점:**
- 무거운 라이브러리 (recharts ~400KB) 동적 로딩 안 됨
- 초기 번들에 모든 코드 포함

**권장 조치:**
```tsx
// recharts 동적 로딩
const Chart = dynamic(() => import('./components/Chart'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />
});
```

**recharts 사용 파일:**
- `src/app/politicians/[id]/components/RatingChart.tsx` (1개)

---

#### 2.4 번들 분석 (우선순위: 중간)

**현재 상태:**
- `@next/bundle-analyzer` 미설치

**권장 조치:**
```bash
npm install @next/bundle-analyzer
```

```js
// next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

```bash
# 분석 실행
ANALYZE=true npm run build
```

---

#### 2.5 무거운 의존성 (우선순위: 중간)

**package.json 분석:**

| 패키지 | 크기 (추정) | 문제점 |
|--------|------------|--------|
| puppeteer | ~300MB | 서버 전용인데 클라이언트에 포함? |
| recharts | ~400KB | 동적 로딩 필요 |
| @sentry/nextjs | ~200KB | 프로덕션만 필요 |
| lucide-react | ~150KB | @heroicons/react와 중복 |
| @heroicons/react | ~100KB | lucide-react와 중복 |

**아이콘 라이브러리 중복:**
- lucide-react: `src/app/politicians/[id]/page.tsx`
- @heroicons/react: `src/app/politicians/page.tsx`

**권장 조치:**
1. 하나의 아이콘 라이브러리로 통일
2. Tree-shaking 확인
3. puppeteer를 devDependencies로 이동 (또는 서버 전용 확인)

---

#### 2.6 빌드 크기 (우선순위: 중간)

**현재 상태:**
- `.next` 폴더: 527MB

**권장 조치:**
1. 번들 분석 후 불필요한 의존성 제거
2. 이미지 최적화로 빌드 캐시 크기 감소
3. 트리 쉐이킹 확인

---

#### 2.7 지연 로딩 (우선순위: 낮음)

**현재 상태:**
- `loading="lazy"` 적용: 1개만

**권장 조치:**
- `next/image`로 변환하면 자동 적용됨
- 일반 `<img>`에는 수동으로 `loading="lazy"` 추가

---

## 3. 권장 작업 순서

| 순서 | 작업 | 예상 효과 | 난이도 |
|:----:|------|----------|:------:|
| 1 | next/font 적용 | FOIT/FOUT 방지, 외부 요청 제거 | 쉬움 |
| 2 | @next/bundle-analyzer 설치 | 번들 크기 파악 | 쉬움 |
| 3 | next/image 변환 (26개) | 이미지 자동 최적화 | 중간 |
| 4 | recharts 동적 로딩 | 초기 로드 감소 | 쉬움 |
| 5 | 아이콘 라이브러리 통일 | 번들 크기 감소 | 중간 |
| 6 | next.config.mjs 최적화 | 전체 빌드 최적화 | 쉬움 |

---

## 4. next.config.mjs 권장 설정

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },

  // 압축 활성화
  compress: true,

  // 실험적 기능
  experimental: {
    optimizeCss: true, // CSS 최적화
  },

  // WebAssembly 지원 (기존)
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });
    return config;
  },
};

export default nextConfig;
```

---

## 5. 결론

**현재 상태:**
- 모바일 최적화: ✅ 완료 (Phase 1-3)
- 성능 최적화: ⚠️ 개선 필요

**우선순위 높은 작업:**
1. next/font 적용 (폰트 최적화)
2. next/image 변환 (이미지 최적화)

**수정작업 예정:** 추후 진행

---

*Generated: 2026-01-03*
*Status: 분석 완료, 수정 대기*
