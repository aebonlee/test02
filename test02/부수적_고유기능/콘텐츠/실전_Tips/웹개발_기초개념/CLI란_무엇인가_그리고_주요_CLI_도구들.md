# CLI란 무엇인가, 그리고 주요 CLI 도구들

> 이 문서는 CLI의 정확한 의미와 Supabase CLI, Vercel CLI, GitHub CLI의 차이를 명확히 설명합니다.

---

## CLI란 무엇인가

**CLI = Command Line Interface (커맨드라인 인터페이스)**

- 마우스 대신 **키보드로 명령어를 입력**하여 컴퓨터를 제어하는 방식
- 검은 화면(터미널, 명령 프롬프트)에서 텍스트 명령어로 작업
- **프로그램이 아니라 방식(인터페이스)을 의미하는 개념**

### CLI vs GUI

| 방식 | 설명 | 예시 |
|------|------|------|
| **GUI** (Graphical User Interface) | 마우스로 클릭하여 작업 | 내 컴퓨터 → 문서 폴더 클릭 |
| **CLI** (Command Line Interface) | 키보드로 명령어 입력 | `cd Documents` 입력 |

---

## CLI (개념) vs CLI 프로그램 (도구)

### ⚠️ 중요한 구분

| 항목 | CLI (개념) | Supabase CLI (프로그램) |
|------|-----------|----------------------|
| **정체** | 인터페이스 방식 | 구체적인 프로그램 |
| **의미** | 명령줄로 작업하는 방식 | Supabase 전용 명령어 도구 |
| **설치** | 설치 불필요 (터미널 자체) | 설치 필요 |
| **사용** | 터미널에서 명령어 입력 | `supabase` 명령어 실행 |

**예시:**
```bash
# CLI (개념) = 이 터미널 화면 자체
C:\Users\YourName> _

# Supabase CLI (프로그램) = 설치 후 사용 가능한 명령어
C:\Users\YourName> supabase login
```

---

## Supabase CLI로 할 수 있는 것

**Supabase CLI** = Supabase 데이터베이스와 프로젝트를 터미널에서 관리하는 도구

### 설치

```bash
npm install -g supabase
```

### 주요 기능

| 명령어 | 설명 |
|--------|------|
| `supabase login` | Supabase 계정 로그인 |
| `supabase init` | 로컬 프로젝트 초기화 |
| `supabase start` | 로컬 Supabase 서버 시작 |
| `supabase db push` | 데이터베이스 스키마 배포 |
| `supabase db pull` | 원격 스키마를 로컬로 가져오기 |
| `supabase migration new <name>` | 새 마이그레이션 파일 생성 |
| `supabase gen types typescript` | TypeScript 타입 자동 생성 |

**할 수 있는 작업:**
- 데이터베이스 스키마 관리 (생성, 수정, 배포)
- 로컬 개발 환경 구축
- 마이그레이션 파일 관리
- TypeScript 타입 자동 생성

---

## Vercel CLI로 할 수 있는 것

**Vercel CLI** = 웹사이트를 Vercel에 배포하고 관리하는 도구

### 설치

```bash
npm install -g vercel
```

### 주요 기능

| 명령어 | 설명 |
|--------|------|
| `vercel login` | Vercel 계정 로그인 |
| `vercel` | 프로젝트 배포 (미리보기) |
| `vercel --prod` | 프로덕션 배포 |
| `vercel env pull` | 환경변수 다운로드 |
| `vercel env add` | 환경변수 추가 |
| `vercel logs` | 배포 로그 확인 |
| `vercel domains` | 도메인 관리 |

**할 수 있는 작업:**
- 웹사이트 배포 (미리보기, 프로덕션)
- 환경변수 관리
- 배포 로그 및 상태 확인
- 도메인 설정

---

## GitHub CLI로 할 수 있는 것

**GitHub CLI (gh)** = GitHub 저장소, 이슈, Pull Request를 터미널에서 관리하는 도구

### 설치

```bash
# Windows (winget)
winget install GitHub.cli

# macOS (brew)
brew install gh
```

### 주요 기능

| 명령어 | 설명 |
|--------|------|
| `gh auth login` | GitHub 계정 로그인 |
| `gh repo clone <repo>` | 저장소 복제 |
| `gh repo create` | 새 저장소 생성 |
| `gh pr create` | Pull Request 생성 |
| `gh pr view <number>` | Pull Request 확인 |
| `gh pr merge <number>` | Pull Request 병합 |
| `gh issue create` | 이슈 생성 |
| `gh issue list` | 이슈 목록 |

**할 수 있는 작업:**
- 저장소 생성, 복제, 관리
- Pull Request 생성 및 병합
- 이슈 생성 및 관리
- GitHub Actions 워크플로우 확인

---

## Claude Code에서 CLI 도구 사용

Claude Code는 자동으로 다음 CLI 도구들을 사용합니다:

```
Claude Code가 말하면:
"Supabase CLI로 데이터베이스를 푸시하겠습니다"
  → supabase db push 실행

"Vercel로 배포하겠습니다"
  → vercel --prod 실행

"GitHub에 Pull Request를 생성하겠습니다"
  → gh pr create 실행
```

---

## CLI를 알아야 하는 이유

1. **Claude Code 지시 이해**
   - "npm install을 실행하겠습니다" 의미 파악
   - "supabase db push를 실행하겠습니다" 이해

2. **실행 결과 확인**
   - 명령어가 성공했는지 실패했는지 판단
   - 에러 메시지 읽고 이해

3. **간단한 작업 직접 수행**
   - 폴더 이동: `cd 폴더명`
   - 파일 확인: `ls` (macOS/Linux), `dir` (Windows)
   - Git 상태 확인: `git status`

4. **문제 해결**
   - 오류 발생 시 상황 파악
   - Claude Code에게 정확한 에러 메시지 전달

---

## 실전 워크플로우 예시

### Supabase CLI 실전 사용 시나리오

**시나리오: 데이터베이스 스키마 변경 및 배포**

```bash
# 1. 로컬 Supabase 시작
supabase start
# → Docker 컨테이너 실행, 로컬 DB 접근 가능

# 2. 새 마이그레이션 파일 생성
supabase migration new add_user_profile_table
# → supabase/migrations/20250126_add_user_profile_table.sql 생성

# 3. SQL 작성 (에디터에서)
# CREATE TABLE user_profiles (...);

# 4. 로컬에서 마이그레이션 적용
supabase db reset
# → 로컬 DB에 스키마 적용, 테스트 가능

# 5. 원격 배포
supabase db push
# → 프로덕션 DB에 스키마 배포

# 6. TypeScript 타입 자동 생성
supabase gen types typescript --local > types/database.types.ts
# → 프론트엔드에서 타입 안전성 확보
```

### Vercel CLI 실전 사용 시나리오

**시나리오: 웹사이트 배포 및 환경변수 관리**

```bash
# 1. 로그인
vercel login
# → 브라우저에서 인증

# 2. 미리보기 배포 (테스트용)
vercel
# → https://your-project-abc123.vercel.app 생성

# 3. 미리보기 확인 후 프로덕션 배포
vercel --prod
# → https://your-project.com 배포

# 4. 환경변수 설정
vercel env add SUPABASE_URL production
# → 프로덕션 환경변수 추가

# 5. 환경변수 로컬로 가져오기
vercel env pull .env.local
# → 로컬 개발에서 동일한 환경변수 사용

# 6. 배포 로그 확인
vercel logs https://your-project.com
# → 에러 발생 시 로그로 디버깅
```

### GitHub CLI 실전 사용 시나리오

**시나리오: Pull Request 생성 및 병합**

```bash
# 1. 로그인
gh auth login
# → GitHub 계정 인증

# 2. 새 브랜치 작업 후 PR 생성
git checkout -b feature/add-login
# 코드 작성 및 커밋
git add .
git commit -m "feat: 로그인 기능 추가"
git push origin feature/add-login

# 3. Pull Request 생성 (CLI로)
gh pr create --title "로그인 기능 추가" --body "Google OAuth 로그인 구현"
# → 브라우저 열지 않고 PR 생성

# 4. PR 확인
gh pr view 123
# → PR #123 상세 정보 확인

# 5. PR 병합
gh pr merge 123 --squash
# → 커밋 합치고 병합

# 6. 브랜치 삭제
git branch -d feature/add-login
git push origin --delete feature/add-login
```

---

## 자주 발생하는 에러와 해결 방법

### Supabase CLI 에러

| 에러 메시지 | 원인 | 해결 방법 |
|------------|------|----------|
| `Docker is not running` | Docker 미실행 | Docker Desktop 실행 후 재시도 |
| `supabase: command not found` | 설치 안 됨 | `npm install -g supabase` 실행 |
| `Migration failed` | SQL 구문 오류 | 마이그레이션 파일 SQL 문법 확인 |
| `Connection refused` | 로컬 서버 미실행 | `supabase start` 먼저 실행 |

### Vercel CLI 에러

| 에러 메시지 | 원인 | 해결 방법 |
|------------|------|----------|
| `vercel: command not found` | 설치 안 됨 | `npm install -g vercel` 실행 |
| `Not authorized` | 로그인 안 됨 | `vercel login` 실행 |
| `Build failed` | 빌드 에러 | `vercel logs`로 에러 확인 |
| `Deployment exceeded limit` | 무료 플랜 초과 | Pro 플랜 업그레이드 또는 오래된 배포 삭제 |

### GitHub CLI 에러

| 에러 메시지 | 원인 | 해결 방법 |
|------------|------|----------|
| `gh: command not found` | 설치 안 됨 | `winget install GitHub.cli` 실행 |
| `Not logged in` | 인증 안 됨 | `gh auth login` 실행 |
| `PR already exists` | 중복 PR | 기존 PR 확인 후 업데이트 |
| `Repository not found` | 권한 없음 | 저장소 접근 권한 확인 |

---

## Claude Code와 CLI 협업 실전 예시

### 예시 1: 데이터베이스 스키마 변경

**사용자:** "users 테이블에 profile_image 컬럼을 추가해줘"

**Claude Code 응답:**
```
1. 마이그레이션 파일을 생성하겠습니다.
   명령어: supabase migration new add_profile_image

2. SQL 파일을 작성했습니다.
   파일: supabase/migrations/20250126_add_profile_image.sql

3. 로컬에서 테스트하겠습니다.
   명령어: supabase db reset

4. 프로덕션에 배포하겠습니다.
   명령어: supabase db push

완료! users 테이블에 profile_image 컬럼이 추가되었습니다.
```

### 예시 2: 웹사이트 배포

**사용자:** "프로덕션에 배포해줘"

**Claude Code 응답:**
```
1. 코드 변경사항을 커밋하겠습니다.
   명령어: git add . && git commit -m "feat: 로그인 UI 개선"

2. 프로덕션 배포를 시작합니다.
   명령어: vercel --prod

배포 완료!
URL: https://your-project.com
배포 시간: 45초
```

### 예시 3: Pull Request 생성

**사용자:** "PR 만들어줘"

**Claude Code 응답:**
```
1. 브랜치를 푸시하겠습니다.
   명령어: git push origin feature/login-ui

2. Pull Request를 생성하겠습니다.
   명령어: gh pr create --title "로그인 UI 개선" --body "반응형 디자인 적용"

PR 생성 완료!
PR #45: https://github.com/user/repo/pull/45
```

---

## 핵심 정리

| 개념 | 설명 |
|------|------|
| **CLI** | Command Line Interface의 약자. 터미널에서 명령어를 입력하는 방식 |
| **Supabase CLI** | Supabase 데이터베이스를 관리하는 프로그램 |
| **Vercel CLI** | Vercel에 웹사이트를 배포하는 프로그램 |
| **GitHub CLI** | GitHub를 관리하는 프로그램 |

**기억할 것:**
- CLI = 방식/개념
- Supabase CLI, Vercel CLI, GitHub CLI = 구체적인 프로그램/도구
- 각 CLI 도구는 설치 후 사용 가능
- 명령어를 전부 외울 필요 없음. 개념과 용도만 이해하면 충분.
