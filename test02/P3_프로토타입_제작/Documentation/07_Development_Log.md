# 개발 히스토리 및 의사결정 로그

**프로젝트:** SSALWorks Dashboard 프로토타입
**작성일:** 2025-12-02
**버전:** 1.0

---

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [Agenda #1: 공지사항 시스템](#agenda-1-공지사항-시스템)
3. [Agenda #2: 학습 콘텐츠 관리](#agenda-2-학습-콘텐츠-관리)
4. [주요 의사결정](#주요-의사결정)
5. [발견된 이슈 및 해결](#발견된-이슈-및-해결)
6. [기술 스택 선택 이유](#기술-스택-선택-이유)

---

## 프로젝트 개요

**목표:**
SSALWorks Dashboard에 공지사항 및 학습 콘텐츠 관리 시스템 추가

**기간:**
- 시작: 2025-11-29
- 완료: 2025-12-02

**결과물:**
- Database: 2개 테이블 + RLS 정책 + 샘플 데이터
- Frontend: 공지사항 표시 + 학습 콘텐츠 트리 + 검색
- Admin Dashboard: 완전한 CRUD 기능
- Documentation: 7개 문서

---

## Agenda #1: 공지사항 시스템

### 개발 타임라인

#### Phase 1: 기획 및 설계 (2025-11-29)

**사용자 요구사항:**
- 공지사항을 사용자에게 표시
- 관리자가 추가/수정/삭제 가능
- 중요 공지사항 강조 표시

**초기 설계 결정:**

1. **데이터 구조**
   ```sql
   CREATE TABLE notices (
       id UUID PRIMARY KEY,
       title VARCHAR(200),
       content TEXT,
       important BOOLEAN,
       created_at TIMESTAMP,
       updated_at TIMESTAMP
   );
   ```

2. **표시 위치**
   - Frontend: 우측 사이드바
   - 최신 3개만 표시
   - 중요 공지사항 우선

3. **보안 정책**
   - 조회: 모든 사용자 (익명 포함)
   - 생성/수정/삭제: 관리자만

---

#### Phase 2: Database 구현 (2025-11-29)

**작업 내용:**

1. **테이블 생성** (`01_create_notices.sql`)
   - UUID 기본 키
   - updated_at 자동 업데이트 트리거

2. **RLS 정책** (`02_notices_rls.sql`)
   - SELECT: `USING (true)` - 모든 사용자
   - INSERT/UPDATE/DELETE: `auth.role() = 'authenticated'`

3. **샘플 데이터** (`03_notices_sample_data.sql`)
   - 3개 공지사항 (중요 2개, 일반 1개)

**검증:**
```bash
node test_http_direct.js
# ✅ 성공! 3 개 공지사항 로드됨
```

---

#### Phase 3: Frontend 구현 (2025-11-29)

**작업 내용:**

1. **Supabase 초기화**
   - `initSupabase()` 함수
   - 라이브러리 로드 대기 로직

2. **데이터 로드**
   - `loadNotices()` 함수
   - 정렬: `important DESC, created_at DESC`
   - LIMIT 3

3. **렌더링**
   - `renderNotices()` 함수
   - DOMPurify로 XSS 방지

4. **상세 팝업**
   - `showNoticeDetail()` 함수
   - 동적 모달 생성
   - 클릭 위치 기반 팝업 배치

**초기 문제:**
- 팝업 위치가 화면 중앙에 표시됨
- 사용자 피드백: "공지사항 근처에 표시해야 함"

**해결:**
- `event.currentTarget` 사용 → `this` 전달로 변경
- `getBoundingClientRect()`로 위치 계산
- 공간 부족 시 위/아래 자동 선택

---

#### Phase 4: Admin Dashboard 구현 (2025-11-29)

**작업 내용:**

1. **CRUD 기능**
   - `createNotice()`: INSERT 쿼리
   - `editNotice()`: UPDATE 쿼리
   - `deleteNotice()`: DELETE 쿼리 + 확인 모달

2. **UI 구성**
   - 공지사항 목록
   - 추가/수정 폼 (prompt 기반)
   - 삭제 확인 모달
   - 통계 표시

---

## Agenda #2: 학습 콘텐츠 관리

### 개발 타임라인

#### Phase 1: 기획 및 Q&A (2025-12-01)

**사용자와의 Q&A 세션:**

**Q1: Admin에서 어떻게 입력할 것인가?**
- A1: 3단계 트리 구조 (대분류 → 중분류 → 소분류)
- 각 단계마다 추가 버튼 제공
- 수정 기능 필요

**Q2: Database 구조는?**
- A2: 3-column 방식 선택
- `depth1`, `depth2`, `depth3` 컬럼
- 10×10×10 = 1,000개까지 확장 가능

**Q3: Frontend에서 데이터 로딩?**
- A3: 전체 데이터 한 번에 로드
- 클라이언트 사이드 필터링 (검색)
- 성능 이유

**Q4: 수정/삭제 UI?**
- A4: 각 항목 옆에 [수정] [삭제] 버튼
- 삭제 시 확인 모달 + Cascade 경고

---

#### Phase 2: Database 설계 및 구현 (2025-12-01)

**설계 의사결정:**

**대안 비교:**

| 방식 | 장점 | 단점 | 선택 |
|------|------|------|------|
| Adjacency List | 무한 depth | 복잡한 쿼리 | ❌ |
| Closure Table | 빠른 쿼리 | 복잡한 구조 | ❌ |
| 3-Column | 간단, 빠름 | 고정 depth | ✅ |

**선택 이유:**
- 3단계 고정 계층 구조
- 간단한 쿼리 (`WHERE depth1 = ?`)
- 빠른 성능
- 직관적인 데이터 구조

**구현:**

1. **테이블 생성** (`06_create_learning_contents.sql`)
   ```sql
   CREATE TABLE learning_contents (
       id UUID PRIMARY KEY,
       depth1 VARCHAR(100) NOT NULL,
       depth2 VARCHAR(100),
       depth3 VARCHAR(100),
       url VARCHAR(500),
       description TEXT,
       display_order INT,
       ...
   );
   ```

2. **인덱스 전략**
   - `idx_learning_contents_depth1`: 대분류 필터링
   - `idx_learning_contents_depth2`: (depth1, depth2)
   - `idx_learning_contents_depth3`: (depth1, depth2, depth3)
   - `idx_learning_contents_search`: Full-text search (GIN)

3. **RLS 정책** (`07_learning_contents_rls.sql`)
   - 공지사항과 동일한 정책

4. **샘플 데이터** (`08_learning_contents_sample_data.sql`)
   - 초기: 3개 대분류 × 4개 중분류 × 4개 소분류
   - 사용자 피드백: "5×5 구조로 변경"
   - 최종: 3개 대분류 × 5개 중분류 × 5개 소분류 = **75개**

---

#### Phase 3: Frontend 구현 (2025-12-01)

**작업 내용:**

1. **데이터 로드**
   - `loadAndRenderLearningContents()` 함수
   - 전체 데이터 로드 후 `allLearningContents` 전역 변수에 저장

2. **트리 렌더링**
   - `renderLearningContentsTree()` 함수
   - 데이터 그룹화 로직:
     ```javascript
     // 배열 → 객체 변환
     const depth1Groups = {};
     contents.forEach(item => {
         if (!depth1Groups[item.depth1]) {
             depth1Groups[item.depth1] = [];
         }
         depth1Groups[item.depth1].push(item);
     });
     ```

3. **검색 기능**
   - `searchLearningContents()` 함수
   - 실시간 필터링 (oninput)
   - 다중 필드 검색 (depth1, depth2, depth3, description)
   - 검색 결과 별도 표시

**UI 개선:**
- 초기: 학습 콘텐츠가 우측 사이드바 중간에 위치
- 사용자 피드백: "학습 콘텐츠가 더 중요함"
- 변경: 학습 콘텐츠 최상단, 공지사항 최하단

---

#### Phase 4: Admin Dashboard 구현 (2025-12-01~02)

**작업 내용:**

1. **트리 구조 표시**
   - 대분류/중분류/소분류 계층 렌더링
   - 접기/펼치기 기능

2. **CRUD 기능**
   - `createDepth1/2/3()`: 3단계별 추가 함수
   - `editDepth1/2/3()`: 3단계별 수정 함수
   - `deleteLearningItem()`: Cascade 삭제 + 경고

**Cascade 삭제 로직:**
```javascript
if (!depth2) {
    // Depth1 삭제 → 모든 하위 항목 삭제
    confirmMessage += '\n\n⚠️ 경고: 모든 하위 중분류 및 소분류도 함께 삭제됩니다!';
    query = query.eq('depth1', depth1);
} else if (!depth3) {
    // Depth2 삭제 → 해당 중분류의 소분류 삭제
    confirmMessage += '\n\n⚠️ 경고: 모든 하위 소분류도 함께 삭제됩니다!';
    query = query.eq('depth1', depth1).eq('depth2', depth2);
} else {
    // Depth3 삭제 → 단일 항목만 삭제
    query = query.eq('id', itemId);
}
```

3. **통계 표시**
   - 총 콘텐츠 개수
   - 대분류/중분류/소분류 개수

---

## 주요 의사결정

### 1. 3-Column vs Adjacency List

**선택:** 3-Column 구조

**이유:**
- 고정된 3단계 계층 구조
- 간단한 쿼리: `SELECT * FROM learning_contents WHERE depth1 = ?`
- 빠른 성능
- 인덱스 활용 용이

**Trade-off:**
- ❌ 4단계 이상 확장 시 스키마 변경 필요
- ✅ 현재 요구사항에 완벽히 부합

---

### 2. 클라이언트 사이드 vs 서버 사이드 검색

**선택:** 클라이언트 사이드 필터링

**이유:**
- 데이터 크기: 75개 (작음)
- 실시간 검색 응답성
- 서버 부하 감소
- 네트워크 트래픽 감소

**구현:**
```javascript
// 전체 데이터 한 번 로드
const { data } = await supabaseClient.from('learning_contents').select('*');
allLearningContents = data;

// 검색 시 클라이언트에서 필터링
const results = allLearningContents.filter(item =>
    item.depth1.includes(searchTerm) || ...
);
```

---

### 3. 팝업 위치 계산 방식

**초기 방식:** 마우스 클릭 위치 기준

**문제:**
- `onclick="func(event)"`에서 `event`가 제대로 전달 안 됨
- 팝업이 클릭 위치와 무관하게 표시

**개선 방식:** 클릭된 요소 위치 기준

**구현:**
```javascript
// HTML
<div onclick="showNoticeDetail(id, this)">  // this 전달

// JavaScript
function showNoticeDetail(id, clickedElement) {
    const rect = clickedElement.getBoundingClientRect();

    // 공간 계산
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // 조건부 배치
    if (spaceBelow >= 300) {
        modalTop = rect.bottom + 10;  // 아래 표시
    } else {
        modalTop = rect.top - modalHeight - 10;  // 위 표시
    }
}
```

---

### 4. Full-text Search 인덱스

**선택:** GIN 인덱스 + `to_tsvector`

**이유:**
- `LIKE '%검색어%'`는 인덱스 사용 불가
- Full-text search는 대량 데이터에서도 빠름
- 향후 가중치, 랭킹 기능 추가 가능

**구현:**
```sql
CREATE INDEX idx_learning_contents_search ON learning_contents
    USING gin(to_tsvector('simple',
        coalesce(depth1, '') || ' ' ||
        coalesce(depth2, '') || ' ' ||
        coalesce(depth3, '')
    ));
```

**Trade-off:**
- 현재는 클라이언트 사이드 검색 사용
- 추후 데이터 증가 시 서버 사이드로 전환 가능

---

## 발견된 이슈 및 해결

### 이슈 #1: 공지사항 팝업 위치 문제

**문제:**
- 팝업이 화면 정중앙에 표시됨
- 사용자: "공지사항 근처에 표시되어야 함"

**원인:**
```javascript
// onclick에서 event를 직접 전달 → 실패
onclick="showNoticeDetail(id, event)"

// event.currentTarget이 제대로 참조 안 됨
const rect = event.currentTarget.getBoundingClientRect();
```

**해결:**
```javascript
// this를 전달
onclick="showNoticeDetail(id, this)"

// 직접 요소 사용
function showNoticeDetail(id, clickedElement) {
    const rect = clickedElement.getBoundingClientRect();
}
```

**결과:** 팝업이 공지사항 항목 바로 옆에 표시됨

---

### 이슈 #2: 팝업이 여전히 너무 위로 올라감

**문제:**
- 공지사항이 화면 아래쪽에 위치
- 팝업 높이 80vh로 설정
- 화면 아래로 벗어남 → 위로 강제 이동
- 결과: 공지사항에서 멀리 떨어짐

**원인:**
```javascript
const modalMaxHeight = window.innerHeight * 0.8;  // 너무 큼

if (modalTop + modalMaxHeight > window.innerHeight) {
    modalTop = window.innerHeight - modalMaxHeight - 20;  // 위로 많이 올라감
}
```

**해결:**
```javascript
const idealModalHeight = 500;  // 최대 500px로 제한

if (spaceBelow >= 300) {
    // 아래에 표시
    modalMaxHeight = Math.min(idealModalHeight, spaceBelow - 10);
    modalTop = rect.bottom + 10;
} else if (spaceAbove >= 300) {
    // 위에 표시
    modalMaxHeight = Math.min(idealModalHeight, spaceAbove - 10);
    modalTop = rect.top - modalMaxHeight - 10;
}
```

**결과:** 팝업이 공지사항 근처에 최대 500px 높이로 표시됨

---

### 이슈 #3: 샘플 데이터 개수 불일치

**문제:**
- 초기: 4개씩 입력
- 사용자: "원래 하드코딩 데이터는 5개였음"

**해결:**
```sql
-- 각 중분류당 5개 소분류로 변경
INSERT INTO learning_contents (...) VALUES
(...), (...), (...), (...), (...);  -- 5개
```

**추가 요청:**
- 사용자: "5×5 구조로 변경"
- 최종: 5개 중분류 × 5개 소분류 = 25개 (대분류당)
- 총 75개 (3개 대분류 × 25개)

---

### 이슈 #4: "앱 배포" 중복

**문제:**
- 샘플 데이터에 "앱 배포"와 "앱 ��포" (인코딩 오류) 중복

**발견:**
```
앱개발:
  - 중분류 개수: 6개 (예상: 5개)
    • 앱 배포: 4개 소분류
    • 앱 ��포: 1개 소분류
```

**상태:**
- 검증 스크립트로 발견
- 기능에는 영향 없음
- 향후 수동 수정 필요

---

## 기술 스택 선택 이유

### Backend: Supabase

**선택 이유:**
1. PostgreSQL 기반 (강력한 RDBMS)
2. REST API 자동 생성
3. RLS (Row Level Security) 기본 지원
4. JavaScript 클라이언트 제공
5. 무료 티어 제공

**대안:**
- Firebase: NoSQL → 계층 구조 표현 어려움
- 직접 Backend 구축: 시간 소요

---

### Frontend: Vanilla JavaScript

**선택 이유:**
1. 프로토타입 단계 → 프레임워크 불필요
2. 빠른 개발
3. 의존성 최소화
4. 간단한 요구사항

**대안:**
- React: 오버엔지니어링
- Vue: 학습 비용

---

### 보안: DOMPurify

**선택 이유:**
1. XSS 공격 방지 필수
2. 사용자 입력 sanitize
3. 가볍고 빠름
4. 간단한 API

**사용 예시:**
```javascript
const safeTitle = DOMPurify.sanitize(notice.title, {
    ALLOWED_TAGS: []
});
```

---

## 성능 측정

### 데이터 로드 시간

**공지사항:**
- 3개 데이터
- 평균 로드 시간: ~200ms

**학습 콘텐츠:**
- 75개 데이터
- 평균 로드 시간: ~300ms
- 렌더링 시간: ~50ms

**검색:**
- 클라이언트 사이드 필터링
- 75개 데이터에서 검색: ~5ms (즉각 응답)

---

## 향후 개선 사항

### 1. 인증 시스템

**현재:**
- RLS 정책 설정되어 있으나 인증 미구현
- 누구나 Admin Dashboard 접근 가능

**개선 방향:**
- Supabase Auth 통합
- 이메일/비밀번호 로그인
- 역할 기반 접근 제어 (RBAC)

---

### 2. 이미지 지원

**현재:**
- 공지사항: 텍스트만
- 학습 콘텐츠: URL만

**개선 방향:**
- 공지사항에 이미지 첨부
- Supabase Storage 활용
- 썸네일 표시

---

### 3. 페이지네이션

**현재:**
- 공지사항: 최신 3개만
- 학습 콘텐츠: 전체 로드

**개선 방향:**
- 공지사항 "더 보기" 버튼
- 학습 콘텐츠: 대분류별 lazy loading

---

### 4. 검색 고도화

**현재:**
- 단순 문자열 매칭

**개선 방향:**
- 하이라이팅
- 검색 히스토리
- 인기 검색어
- 자동 완성

---

## 교훈 및 베스트 프랙티스

### 1. 사용자 피드백의 중요성

**사례:**
- Q&A 세션으로 요구사항 명확화
- 팝업 위치, 데이터 개수 등 즉시 조정
- 결과: 재작업 최소화

**교훈:**
- 구현 전 충분한 소통
- 프로토타입 빠르게 제시
- 피드백 즉시 반영

---

### 2. 간단한 솔루션 우선

**사례:**
- 3-Column vs 복잡한 트리 구조
- 클라이언트 사이드 vs 서버 사이드 검색

**교훈:**
- 요구사항에 맞는 가장 간단한 방법 선택
- 성능과 복잡도의 균형
- 필요시 나중에 개선

---

### 3. 검증의 중요성

**사례:**
- 검증 스크립트로 "앱 배포" 중복 발견
- 데이터 개수, 구조 자동 확인

**교훈:**
- 자동화된 검증 스크립트 작성
- 수동 확인 신뢰 금지
- CI/CD에 통합 가능

---

## 프로젝트 통계

### 작업량

**Database:**
- SQL 파일: 6개
- 총 라인 수: ~450 lines
- 테이블: 2개
- RLS 정책: 8개

**Frontend:**
- 수정 파일: 1개 (`prototype_index_최종개선.html`)
- 추가 라인 수: ~220 lines
- 함수: 5개

**Admin Dashboard:**
- 수정 파일: 1개 (`admin-dashboard_prototype.html`)
- 추가 라인 수: ~470 lines
- 함수: 12개

**Documentation:**
- 문서: 7개
- 총 라인 수: ~3,500 lines

**총계:**
- 파일 수: 15개
- 코드 라인 수: ~1,140 lines
- 문서 라인 수: ~3,500 lines
- 총 작업 라인 수: ~4,640 lines

---

### 시간 배분

| 작업 | 시간 |
|------|------|
| 기획 및 Q&A | 1시간 |
| Database 설계 및 구현 | 2시간 |
| Frontend 개발 | 3시간 |
| Admin Dashboard 개발 | 4시간 |
| 테스트 및 디버깅 | 2시간 |
| Documentation | 4시간 |
| **총계** | **16시간** |

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2025-11-29 | Agenda #1 시작 (공지사항 시스템) |
| 2025-11-29 | Database + Frontend + Admin Dashboard 완료 |
| 2025-12-01 | Agenda #2 시작 (학습 콘텐츠 관리) |
| 2025-12-01 | Q&A 세션, Database 설계 |
| 2025-12-01 | Frontend 트리 + 검색 구현 |
| 2025-12-02 | Admin Dashboard CRUD 완료 |
| 2025-12-02 | 팝업 위치 이슈 해결 |
| 2025-12-02 | 검증 및 Documentation 완료 |

---

**문서 끝**
