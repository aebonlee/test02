# PoliticianFinder SEO 개선 리포트

**작성일**: 2026-01-03
**프로젝트**: PoliticianFinder
**커밋**: c172dd7

---

## 요약

Next.js App Router를 활용한 종합적인 SEO 개선 작업을 완료하였습니다.

---

## 개선 항목

### 1. 메타데이터 확장 (layout.tsx)

**기존:**
```typescript
export const metadata = {
  title: 'PoliticianFinder - 훌륭한 정치인 찾기',
  description: 'AI 기반 정치인 평가 플랫폼',
};
```

**변경:**
```typescript
export const metadata: Metadata = {
  // 타이틀 템플릿 (하위 페이지에서 자동 적용)
  title: {
    default: 'PoliticianFinder - 훌륭한 정치인 찾기',
    template: '%s | PoliticianFinder',
  },

  // 상세 설명
  description: 'AI 기반 정치인 평가 플랫폼. 객관적인 데이터로 정치인의 활동, 공약 이행률, 청렴도를 분석합니다.',

  // SEO 키워드
  keywords: ['정치인', '국회의원', 'AI 평가', '공약 이행률', '청렴도', '정치인 찾기', '정치인 평가'],

  // 저자 정보
  authors: [{ name: 'PoliticianFinder Team' }],
  creator: 'PoliticianFinder',
  publisher: 'PoliticianFinder',

  // ... (상세 내용은 코드 참조)
};
```

---

### 2. Open Graph 태그

| 속성 | 값 |
|------|-----|
| type | website |
| locale | ko_KR |
| siteName | PoliticianFinder |
| title | PoliticianFinder - 훌륭한 정치인 찾기 |
| description | AI 기반 정치인 평가 플랫폼... |
| image | /og-image.png (1200x630) |

**효과**: Facebook, LinkedIn, KakaoTalk 등에서 링크 공유 시 미리보기 카드 표시

---

### 3. Twitter Card

| 속성 | 값 |
|------|-----|
| card | summary_large_image |
| title | PoliticianFinder - 훌륭한 정치인 찾기 |
| description | AI 기반 정치인 평가 플랫폼... |
| images | /og-image.png |

**효과**: Twitter/X에서 링크 공유 시 대형 이미지 카드 표시

---

### 4. sitemap.ts (동적 사이트맵)

**파일**: `src/app/sitemap.ts`

```typescript
// 정적 페이지 자동 포함
- / (홈) - priority: 1.0, changeFrequency: daily
- /politicians - priority: 0.9, changeFrequency: daily
- /community - priority: 0.8, changeFrequency: hourly
- /connection - priority: 0.7, changeFrequency: weekly
- /auth/login - priority: 0.5, changeFrequency: monthly
- /auth/signup - priority: 0.5, changeFrequency: monthly
```

**접근 URL**: `https://politicianfinder.com/sitemap.xml`

---

### 5. robots.ts (동적 robots.txt)

**파일**: `src/app/robots.ts`

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /mypage/
Disallow: /notifications/
Disallow: /auth/
Disallow: /_next/
Disallow: /admin/

Sitemap: https://politicianfinder.com/sitemap.xml
```

**효과**:
- 검색 엔진 크롤러에게 접근 가능/불가능 경로 명시
- 사이트맵 위치 자동 안내
- 개인정보 페이지 크롤링 방지

---

### 6. 로봇 설정 (Googlebot 최적화)

```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
},
```

**효과**: Google 검색 결과에서 대형 이미지 미리보기, 긴 스니펫 허용

---

## 수정/생성된 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/app/layout.tsx` | 메타데이터 확장 (69줄 추가) |
| `src/app/sitemap.ts` | 동적 사이트맵 생성기 (신규) |
| `src/app/robots.ts` | 동적 robots.txt 생성기 (신규) |

---

## 후속 작업 (권장)

1. **og-image.png 생성**: 1200x630px 소셜 공유 이미지 필요
2. **Google Search Console 등록**: 사이트 소유권 확인 후 sitemap 제출
3. **Naver Search Advisor 등록**: 국내 검색 최적화
4. **동적 정치인 페이지 sitemap 추가**: DB에서 정치인 목록 가져와 sitemap에 추가

---

## 빌드 결과

```
✓ Compiled successfully
✓ /sitemap.xml - 0 B (동적 생성)
✓ /robots.txt - 0 B (동적 생성)
```

---

**작성자**: Claude Code
