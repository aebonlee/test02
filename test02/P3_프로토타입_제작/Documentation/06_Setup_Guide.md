# 설치 및 설정 가이드

**프로젝트:** SSALWorks Dashboard 프로토타입
**작성일:** 2025-12-02
**버전:** 1.0

---

## 목차

1. [사전 준비](#사전-준비)
2. [Supabase 프로젝트 생성](#supabase-프로젝트-생성)
3. [데이터베이스 설정](#데이터베이스-설정)
4. [프론트엔드 설정](#프론트엔드-설정)
5. [Admin Dashboard 설정](#admin-dashboard-설정)
6. [테스트 및 검증](#테스트-및-검증)
7. [문제 해결](#문제-해결)

---

## 사전 준비

### 필요한 도구

1. **웹 브라우저**
   - Chrome (권장)
   - Firefox, Edge, Safari 등

2. **텍스트 에디터** (선택)
   - VS Code (권장)
   - Notepad++
   - 메모장

3. **Supabase 계정**
   - https://supabase.com 회원가입 (무료)

### 준비 사항

- [ ] 인터넷 연결
- [ ] Supabase 계정 생성
- [ ] 프로젝트 파일 다운로드/복사

---

## Supabase 프로젝트 생성

### 1. Supabase 로그인

1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인

### 2. 새 프로젝트 생성

1. **Dashboard에서 "New Project" 클릭**

2. **프로젝트 정보 입력**
   ```
   Name: SSALWorks Dashboard
   Database Password: (강력한 비밀번호 생성)
   Region: Northeast Asia (Seoul) - 권장
   Pricing Plan: Free
   ```

3. **"Create new project" 클릭**
   - 생성까지 약 2분 소요

### 3. API 키 확인

프로젝트 생성 후:

1. 좌측 사이드바 → **Settings** (⚙️)
2. **API** 탭 클릭
3. 다음 정보 복사:

```
Project URL:
https://YOUR-PROJECT-ID.supabase.co

anon public (공개 키):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ 중요:** 이 정보는 나중에 Frontend/Admin Dashboard에서 사용됩니다!

---

## 데이터베이스 설정

### SQL 스크립트 실행 순서

**위치:** `C:\!SSAL_Works_Private\P3_프로토타입_제작\Database\`

**실행 순서:**
1. `01_create_notices.sql`
2. `02_notices_rls.sql`
3. `03_notices_sample_data.sql`
4. `06_create_learning_contents.sql`
5. `07_learning_contents_rls.sql`
6. `08_learning_contents_sample_data.sql`

---

### 1. 공지사항 테이블 생성

#### 1-1. SQL Editor 열기

1. Supabase Dashboard
2. 좌측 사이드바 → **SQL Editor**
3. "New query" 클릭

#### 1-2. 공지사항 테이블 생성

**파일:** `01_create_notices.sql`

```sql
-- 파일 내용 전체 복사
-- SQL Editor에 붙여넣기
-- "Run" 버튼 클릭 (또는 Ctrl+Enter)
```

**실행 결과:**
```
Success. No rows returned
```

#### 1-3. RLS 정책 설정

**파일:** `02_notices_rls.sql`

```sql
-- 새 쿼리 생성
-- 파일 내용 복사 → 붙여넣기 → Run
```

#### 1-4. 샘플 데이터 입력

**파일:** `03_notices_sample_data.sql`

```sql
-- 새 쿼리 생성
-- 파일 내용 복사 → 붙여넣기 → Run
```

**실행 결과:**
```
Success. 3 rows returned
```

---

### 2. 학습 콘텐츠 테이블 생성

#### 2-1. 테이블 생성

**파일:** `06_create_learning_contents.sql`

```sql
-- 새 쿼리 생성
-- 파일 내용 복사 → 붙여넣기 → Run
```

#### 2-2. RLS 정책 설정

**파일:** `07_learning_contents_rls.sql`

```sql
-- 새 쿼리 생성
-- 파일 내용 복사 → 붙여넣기 → Run
```

#### 2-3. 샘플 데이터 입력 (75개)

**파일:** `08_learning_contents_sample_data.sql`

```sql
-- 새 쿼리 생성
-- 파일 내용 복사 → 붙여넣기 → Run
```

**실행 결과:**
```
Success. 75 rows returned
```

---

### 3. 데이터 확인

#### Table Editor로 확인

1. 좌측 사이드바 → **Table Editor**
2. `notices` 테이블 선택
   - 3개 공지사항 확인
3. `learning_contents` 테이블 선택
   - 75개 학습 콘텐츠 확인

---

## 프론트엔드 설정

**파일 위치:**
```
C:\!SSAL_Works_Private\P3_프로토타입_제작\Frontend\Prototype\prototype_index_최종개선.html
```

### 1. Supabase 설정 값 입력

#### 파일 열기

1. 텍스트 에디터로 `prototype_index_최종개선.html` 열기
2. Ctrl+F로 검색: `SUPABASE_URL`
3. 해당 부분 찾기 (약 Line 7971)

#### API 키 입력

**수정 전:**
```javascript
const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**수정 후:**
```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';  // ← 본인의 Project URL
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';  // ← 본인의 anon public key
```

#### 저장

- Ctrl+S로 저장

### 2. 브라우저로 열기

1. 파일 탐색기에서 `prototype_index_최종개선.html` 찾기
2. **우클릭 → Chrome으로 열기**

### 3. 동작 확인

#### 3-1. 콘솔 확인

- F12 → Console 탭
- 다음 메시지 확인:

```
✅ Supabase 클라이언트 초기화 완료 (Frontend)
📋 공지사항 로드 시작 (Frontend)
✅ 공지사항 로드 성공: 3 개
📚 학습 콘텐츠 로드 시작 (Frontend)
✅ 학습 콘텐츠 로드 성공: 75 개
```

#### 3-2. UI 확인

**우측 사이드바 확인:**

1. **학습 콘텐츠 섹션** (최상단)
   - 대분류 3개 표시
   - 클릭하여 펼치기/접기 테스트
   - 검색창에 "HTML" 입력 → 검색 결과 확인

2. **공지사항 섹션** (하단)
   - 공지사항 3개 표시
   - 클릭 → 상세 팝업 표시 확인

---

## Admin Dashboard 설정

**파일 위치:**
```
C:\!SSAL_Works_Private\P3_프로토타입_제작\Frontend\Prototype\admin-dashboard_prototype.html
```

### 1. Supabase 설정 값 입력

#### 파일 열기 및 수정

1. 텍스트 에디터로 `admin-dashboard_prototype.html` 열기
2. Ctrl+F로 검색: `SUPABASE_URL`
3. API 키 입력 (Frontend와 동일)

```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
```

4. 저장 (Ctrl+S)

### 2. 브라우저로 열기

1. `admin-dashboard_prototype.html` 우클릭
2. Chrome으로 열기

### 3. 동작 확인

#### 공지사항 관리

1. 좌측 사이드바 → "공지사항 관리" 클릭
2. 목록에 3개 공지사항 표시 확인
3. "공지사항 추가" 버튼 테스트
   - 제목: "테스트 공지사항"
   - 내용: "테스트 내용"
   - "추가" 클릭
   - 성공 메시지 및 목록 업데이트 확인

#### 학습 콘텐츠 관리

1. 좌측 사이드바 → "학습 콘텐츠 관리" 클릭
2. 트리 구조 표시 확인
3. 대분류 펼치기/접기 테스트
4. "+소분류" 버튼 테스트

---

## 테스트 및 검증

### Node.js 테스트 스크립트 실행 (선택)

**필요 조건:** Node.js 설치

#### 1. 공지사항 테스트

```bash
cd C:\!SSAL_Works_Private\P3_프로토타입_제작\Database
node test_http_direct.js
```

**예상 결과:**
```
✅ 성공! 3 개 공지사항 로드됨
```

#### 2. 학습 콘텐츠 테스트

```bash
node test_learning_contents.js
```

**예상 결과:**
```
✅ 모든 검증 통과!

Database 검증 완료:
  - 총 75개 학습 콘텐츠
  - 3개 대분류
  - 각 대분류당 5×5 구조
  - 모든 필수 필드 존재
```

---

## 환경별 설정

### 개발 환경

```javascript
const SUPABASE_URL = 'https://dev-project.supabase.co';
const SUPABASE_ANON_KEY = 'dev-anon-key';
```

### 프로덕션 환경

```javascript
const SUPABASE_URL = 'https://prod-project.supabase.co';
const SUPABASE_ANON_KEY = 'prod-anon-key';
```

**⚠️ 주의:** 프로덕션 환경에서는 반드시 별도 프로젝트 사용!

---

## 문제 해결

### 문제 1: "Supabase 클라이언트가 초기화되지 않았습니다"

**원인:**
- SUPABASE_URL 또는 SUPABASE_ANON_KEY가 잘못됨

**해결:**
1. Supabase Dashboard → Settings → API 확인
2. HTML 파일의 값과 일치하는지 확인
3. 따옴표 누락 여부 확인

---

### 문제 2: 데이터가 표시되지 않음

**원인:**
- SQL 스크립트 미실행
- RLS 정책 설정 안 됨

**해결:**
1. Supabase → Table Editor에서 데이터 확인
2. 데이터 없으면 → 샘플 데이터 SQL 재실행
3. F12 → Console에서 오류 메시지 확인

---

### 문제 3: CORS 오류

**증상:**
```
Access to fetch at '...' from origin 'null' has been blocked by CORS policy
```

**원인:**
- 파일을 `file://` 프로토콜로 직접 열었을 때 발생

**해결 방법:**

**방법 1: Chrome 설정으로 열기 (간단)**
```bash
chrome.exe --allow-file-access-from-files --disable-web-security --user-data-dir="C:\temp"
```

**방법 2: 로컬 서버 사용 (권장)**

Python 3 설치 후:
```bash
cd C:\!SSAL_Works_Private\P3_프로토타입_제작\Frontend\Prototype
python -m http.server 8000
```

브라우저에서:
```
http://localhost:8000/prototype_index_최종개선.html
```

**방법 3: VS Code Live Server 확장 설치**
1. VS Code → Extensions
2. "Live Server" 검색 및 설치
3. HTML 파일 우클릭 → "Open with Live Server"

---

### 문제 4: SQL 실행 오류

**증상:**
```
relation "notices" already exists
```

**원인:**
- 테이블이 이미 존재함

**해결:**
- 테이블 삭제 후 재생성:

```sql
DROP TABLE IF EXISTS notices CASCADE;
DROP TABLE IF EXISTS learning_contents CASCADE;

-- 그 다음 CREATE TABLE 스크립트 실행
```

---

## 백업 및 복구

### 데이터 백업

#### Supabase Dashboard에서

1. Table Editor → `notices`
2. 우측 상단 "Export" 버튼
3. CSV 또는 JSON 선택
4. `learning_contents`도 동일하게 백업

#### SQL 덤프

```sql
-- SQL Editor에서 실행
SELECT * FROM notices;
-- 결과를 복사하여 저장

SELECT * FROM learning_contents;
-- 결과를 복사하여 저장
```

### 데이터 복구

1. Supabase Dashboard → Table Editor
2. 테이블 선택
3. "Insert" → "Insert row"
4. 백업 데이터 입력

또는 SQL로 일괄 복구:
```sql
INSERT INTO notices (title, content, important)
VALUES
('제목1', '내용1', true),
('제목2', '내용2', false);
```

---

## 체크리스트

### 초기 설정 완료 체크리스트

- [ ] Supabase 프로젝트 생성
- [ ] API 키 확인 및 복사
- [ ] `notices` 테이블 생성
- [ ] `notices` RLS 정책 설정
- [ ] `notices` 샘플 데이터 입력
- [ ] `learning_contents` 테이블 생성
- [ ] `learning_contents` RLS 정책 설정
- [ ] `learning_contents` 샘플 데이터 입력 (75개)
- [ ] Frontend HTML 파일에 API 키 입력
- [ ] Admin Dashboard HTML 파일에 API 키 입력
- [ ] Frontend 브라우저 테스트
- [ ] Admin Dashboard 브라우저 테스트
- [ ] 공지사항 표시 확인
- [ ] 학습 콘텐츠 표시 확인
- [ ] 검색 기능 테스트
- [ ] CRUD 기능 테스트

---

## 다음 단계

설정 완료 후:

1. **Admin Dashboard Guide 참고**
   - 공지사항/학습 콘텐츠 관리 방법 학습

2. **커스터마이징**
   - 샘플 데이터 삭제 및 실제 데이터 입력
   - CSS 스타일 수정
   - 추가 기능 개발

3. **배포 준비**
   - 프로덕션 Supabase 프로젝트 생성
   - 도메인 연결
   - HTTPS 설정

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2025-12-02 | 1.0 | 초안 작성 | Claude Code |

---

**문서 끝**
