# PoliticianFinder 성능 최적화 리포트

**작성일**: 2026-01-03
**프로젝트**: PoliticianFinder (정치인 평가 플랫폼)
**위치**: `C:\Development_PoliticianFinder_com\Developement_Real_PoliticianFinder\1_Frontend`

---

## 요약

총 6개 성능 최적화 항목을 완료하였습니다.

| # | 항목 | 상태 | 예상 효과 |
|---|------|:----:|----------|
| 1 | 폰트 최적화 (next/font) | ✅ | 외부 요청 제거, FOIT/FOUT 방지 |
| 2 | 이미지 최적화 (next/image) | ✅ | WebP/AVIF 자동 변환, 반응형, 지연 로딩 |
| 3 | Dead Code 제거 | ✅ | recharts ~400KB 번들 크기 절감 |
| 4 | 번들 분석기 설치 | ✅ | 번들 시각화 분석 가능 |
| 5 | 아이콘 라이브러리 통일 | ✅ | heroicons 제거, ~50-100KB 절감 |
| 6 | next.config.mjs 최적화 | ✅ | 이미지 도메인, 번들 분석기 통합 |

---

## 상세 수정 내역

### 1. 폰트 최적화 (next/font 적용)

**파일**: `src/app/layout.tsx`

**변경 전**:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

**변경 후**:
```tsx
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// html 태그에 적용
<html lang="ko" suppressHydrationWarning className={notoSansKr.className}>
```

**효과**:
- 외부 Google Fonts 요청 제거 (빌드 시 폰트 다운로드)
- FOIT(Flash of Invisible Text) / FOUT(Flash of Unstyled Text) 방지
- 폰트 파일 자동 최적화 및 셀프 호스팅

---

### 2. 이미지 최적화 (next/image 변환)

**수정된 파일 (7개)**:
1. `src/app/mypage/page.tsx` - 프로필 이미지 2개
2. `src/app/users/[id]/followers/page.tsx` - 프로필 이미지 1개
3. `src/app/users/[id]/following/page.tsx` - 프로필 이미지 2개
4. `src/app/politicians/[id]/page.tsx` - 프로필 이미지 1개
5. `src/app/politicians/[id]/profile/page.tsx` - 프로필 이미지 1개
6. `src/app/notices/[id]/page.tsx` - 공지사항 이미지 1개
7. `next.config.mjs` - 외부 이미지 도메인 설정

**변경 전**:
```tsx
<img src={imageUrl} alt="..." className="..." />
```

**변경 후**:
```tsx
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="..."
  width={...}
  height={...}
  className="..."
/>
```

**next.config.mjs 이미지 설정**:
```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.brandfetch.io', pathname: '/**' },
    { protocol: 'https', hostname: 'cdn.simpleicons.org', pathname: '/**' },
    { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/**' },
  ],
},
```

**효과**:
- WebP/AVIF 자동 변환 (최대 80% 용량 감소)
- 반응형 이미지 자동 생성
- 지연 로딩(Lazy Loading) 기본 적용
- 레이아웃 시프트 방지

---

### 3. Dead Code 제거 (recharts 미사용 코드)

**파일**: `src/app/politicians/[id]/page.tsx`

**제거된 코드**:
```tsx
// 제거: recharts import
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// 제거: 12개월 차트 데이터 (CHART_DATA_FULL)
const CHART_DATA_FULL = [ /* 12개월 데이터 */ ];

// 제거: ChartPeriod 타입 및 상수
type ChartPeriod = '1M' | '3M' | '6M' | '1Y';
const CHART_PERIODS = [...];

// 제거: 차트 관련 상태
const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('3M');
const chartData = useMemo(() => {...}, [chartPeriod]);
```

**효과**:
- recharts 라이브러리 (~400KB) 번들에서 제외
- 미사용 코드 정리로 유지보수성 향상

---

### 4. 번들 분석기 설치

**설치 패키지**: `@next/bundle-analyzer`

**파일**: `next.config.mjs`

```javascript
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
```

**사용법**:
```bash
ANALYZE=true npm run build
```

**효과**:
- 번들 크기 시각화 분석
- 큰 의존성 식별 가능
- 최적화 우선순위 결정에 도움

---

### 5. 아이콘 라이브러리 통일

**파일**: `src/components/layout/MobileTabBar.tsx`

**변경 전**:
```tsx
import { HomeIcon, UserGroupIcon, ... } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, ... } from '@heroicons/react/24/solid';
```

**변경 후**:
```tsx
import { Home, Users, MessageSquare, UserCircle, LucideIcon } from 'lucide-react';
```

**아이콘 매핑**:
| Heroicons | Lucide-react |
|-----------|--------------|
| HomeIcon | Home |
| UserGroupIcon | Users |
| ChatBubbleLeftRightIcon | MessageSquare |
| UserCircleIcon | UserCircle |

**패키지 제거**:
```bash
npm uninstall @heroicons/react
```

**효과**:
- 중복 아이콘 라이브러리 제거
- 번들 크기 ~50-100KB 절감
- 일관된 아이콘 스타일

---

## Git 커밋 이력

```
707af66 refactor: 아이콘 라이브러리 통일 (heroicons → lucide-react)
93f4d21 perf: Dead Code 제거 및 번들 분석기 추가
2e3ae15 perf: 폰트 및 이미지 최적화
```

---

## 추가 개선 가능 영역 (향후 작업)

| 영역 | 내용 | 우선순위 |
|------|------|:--------:|
| 접근성 | aria-label, 키보드 네비게이션, 색상 대비 | 중 |
| SEO | 메타데이터, 구조화 데이터, sitemap | 중 |
| 에러 핸들링 | Error Boundary, 로딩 상태, 폴백 UI | 중 |
| 테스트 | 단위 테스트, E2E 테스트 | 낮음 |
| PWA | 오프라인 지원, 앱 설치 | 낮음 |

---

**작성자**: Claude Code
**검증**: 빌드 성공 확인
