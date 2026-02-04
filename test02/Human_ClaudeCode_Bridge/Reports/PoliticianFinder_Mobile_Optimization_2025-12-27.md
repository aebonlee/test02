# PoliticianFinder 모바일 최적화 작업 리포트

**작업일:** 2025-12-27
**프로젝트:** PoliticianFinder (정치인 평가 플랫폼)
**위치:** `C:\Development_PoliticianFinder_com\Developement_Real_PoliticianFinder\1_Frontend`

---

## 작업 요약

| # | 작업 내용 | 상태 | 커밋 해시 |
|---|----------|:----:|----------|
| 1 | 정치인 목록 페이지 링크 수정 | ✅ | - |
| 2 | 커뮤니티 게시글 모바일 메타데이터 표시 | ✅ | - |
| 3 | 홈 화면 TOP 10 카드 클릭 가능하게 수정 | ✅ | - |
| 4 | 정치인 프로필 수정 버튼 본인만 표시 | ✅ | 7f17f89 |
| 5 | Vercel 배포 확인 | ⚠️ | GitHub Secrets 미설정 |

---

## 상세 내용

### 1. 정치인 목록 페이지 링크 수정

**문제:**
- 정치인 목록에서 정치인을 클릭해도 상세페이지로 이동하지 않음

**원인:**
- `window.location.href` 사용 (Next.js 방식 아님)
- Next.js `Link` 컴포넌트 미사용

**수정 파일:**
- `src/app/politicians/page.tsx`

**수정 내용:**
```tsx
import Link from 'next/link';

// 데스크탑 테이블: 이름 셀에 Link 적용
<Link href={`/politicians/${p.id}`}>{p.name}</Link>

// 모바일 카드: 전체 카드를 Link로 래핑
<Link
  key={p.rank}
  href={`/politicians/${p.id}`}
  className="block bg-white rounded-xl shadow-md..."
>
```

---

### 2. 커뮤니티 게시글 모바일 메타데이터 표시

**문제:**
- 모바일에서 비공감(👎), 공유 숫자가 `hidden sm:inline`으로 숨겨져 있음

**수정 파일:**
- `src/app/community/page.tsx` (lines 328-335)

**수정 내용:**
```tsx
{/* 2줄: 통계 정보 - 모바일에서도 전부 표시 */}
<div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
  <span>조회 {post.views}</span>
  <span className="text-red-600">👍 {post.like_count}</span>
  <span className="text-gray-400">👎 {post.dislike_count}</span>  {/* hidden 제거 */}
  <span>💬 {post.comment_count}</span>
  <span>공유 {post.share_count}</span>  {/* hidden 제거 */}
</div>
```

---

### 3. 홈 화면 TOP 10 카드 클릭 가능하게 수정

**문제:**
- 1-3위는 이름만 클릭 가능
- 4-10위는 카드 전체가 클릭 안 됨

**수정 파일:**
- `src/app/page.tsx` (lines 709-905)

**수정 내용:**
- 1위, 2-3위, 4-10위 카드 모두 `<div>` → `<Link>` 변경
- 카드 전체가 클릭 가능하도록 수정

---

### 4. 정치인 프로필 수정 버튼 본인만 표시

**문제:**
- 프로필 수정 버튼이 모든 사용자에게 표시됨

**해결:**
- 기존 정치인 인증 시스템 활용 (`getPoliticianSession()`)

**수정 파일:**
- `src/app/politicians/[id]/page.tsx`

**수정 내용:**

1. **상태 추가:**
```tsx
const [isOwnProfile, setIsOwnProfile] = useState(false);
```

2. **세션 확인 로직:**
```tsx
useEffect(() => {
  const checkOwnProfile = () => {
    const session = getPoliticianSession();
    if (session && session.politician_id === politicianId) {
      const expiresAt = new Date(session.expires_at);
      if (expiresAt > new Date()) {
        setIsOwnProfile(true);
        return;
      }
    }
    setIsOwnProfile(false);
  };

  checkOwnProfile();

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'politician_session') {
      checkOwnProfile();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [politicianId]);
```

3. **조건부 렌더링:**
```tsx
{isOwnProfile && (
  <Link href={`/politicians/${politicianId}/edit`}>
    프로필 수정 (본인)
  </Link>
)}
```

**작동 방식:**
| 상황 | 버튼 표시 |
|------|:--------:|
| 비로그인 사용자 | ❌ |
| 일반 회원 로그인 | ❌ |
| 정치인 A → 정치인 B 프로필 | ❌ |
| 정치인 A → 정치인 A 프로필 | ✅ |
| 세션 만료된 정치인 | ❌ |

---

### 5. Vercel 배포 실패

**상태:** ⚠️ 실패

**GitHub Actions 로그:**
```
Error: No existing credentials found. Please run `vercel login` or pass "--token"
VERCEL_ORG_ID: (empty)
VERCEL_PROJECT_ID: (empty)
```

**원인:**
- GitHub Secrets에 Vercel 인증 정보 미설정

**필요 조치:**
1. Vercel 대시보드 → Settings → Tokens에서 토큰 생성
2. Vercel 프로젝트 설정에서 ORG_ID, PROJECT_ID 확인
3. GitHub 저장소 → Settings → Secrets and variables → Actions에서:
   - `VERCEL_TOKEN` 추가
   - `VERCEL_ORG_ID` 추가
   - `VERCEL_PROJECT_ID` 추가

---

## 빌드 결과

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (142/142)

/politicians/[id] - 19.5 kB / 118 kB (Dynamic)
```

---

## 다음 작업

1. GitHub Secrets 설정 후 배포 재시도
2. 모바일 실제 기기 테스트 (배포 후)
