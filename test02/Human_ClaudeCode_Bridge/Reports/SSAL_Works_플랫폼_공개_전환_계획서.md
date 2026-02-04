# SSAL Works 플랫폼 공개 전환 계획서

작성일: 2025-12-22
수정일: 2025-12-24

---

## 1. GitHub 전략

**결정: Public 유지 + 법적 보호 (당당한 공개)**

- GitHub Private 변경 시 불이익: Stars/Watchers 삭제, Fork 처리 문제 등
- Public 유지하면서 법적 보호 수단 확보:
  - 소프트웨어 등록
  - 상표 등록
  - 필요시 특허 등록
- "당당하게 공개, 뺏길 사람 있으면 뺏겨라" 전략

---

## 2. Google Drive 공유 전략

**결정: 보안 파일 제외하고 업로드**

- Google Drive는 "다운로드, 인쇄, 복사" 한 묶음으로만 제한/허용
- 다운로드 제한하고 싶은 파일은 아예 업로드하지 않음
- 이용자 다운로드 편의성: GitHub보다 Google Drive가 편리

---

## 3. .gitignore 전략

**결정: 그대로 유지**

- .gitignore만으로는 이미 올라간 파일 제외 안 됨 (삭제 필요)
- GitHub를 백업 용도로도 사용하므로 현재 상태 유지
- 공개하기 싫은 파일은 Google Drive에서 제외

---

## 4. 제외 항목

| 항목 | 결정 | 이유 |
|------|------|------|
| .env.example | 불필요 | Google Drive에 안 넣으니까 |
| 키 플레이스홀더 교체 | 불필요 | 업로드 시 해당 파일 제외 |
| README.md 시작 가이드 | 불필요 | 웹사이트 푸터에 이미 있음 |

---

## 5. 일반화 작업 (계획)

다음 항목들을 범용 버전으로 일반화 작업 예정:

1. **CLAUDE.md 일반화**
   - 현재 399줄 → 약 150-200줄 예상
   - SSALWorks 전용 부분 제거/템플릿화
   - 범용 가능 부분 유지 (폴더 생성 금지, 검증/문서화, Production 이중 저장 등)

2. **Order Sheet 템플릿 일반화**
   - SSALWorks 전용 항목 제거
   - 범용 프로젝트에 적용 가능하도록 수정

3. **안내문(Briefing) 일반화**
   - 브랜드명 템플릿화
   - 범용 가이드 형태로 수정

4. **SAL Grid Viewer 일반화** ⭐ (신규)
   - Supabase Key 하드코딩 제거
   - 2가지 모드 구현 (데모 보기 / 내 DB 연결)
   - 설정 모달 추가 (URL/Key 입력)
   - localStorage 저장 기능

5. **Development_Process_Monitor 일반화** ⭐ (신규)
   - SSALWorks 전용 설정 제거
   - 범용 프로젝트에 적용 가능하도록 수정
   - 사이드바 생성 도구 템플릿화

---

## 6. 패키지 정의

### SSAL Works Development Setup Package
(SSAL Works 개발 환경 설정 패키지)

---

SSAL Works 플랫폼에서 [닉네임] 개발자 님의
웹사이트 개발 프로젝트를 시작하기 위한
필수적인 폴더와 파일이 들어있는 패키지입니다.

---

**[패키지 내용물]**

**기본 폴더:**
- 표준 디렉터리 구조 (P0~P3, S0~S5, Production 등)
- .claude 폴더 (CLAUDE.md, commands, skills, subagents, work_logs 등)
- Human_ClaudeCode_Bridge 폴더 (bridge_server.js, Orders, Reports 등)
- Development_Process_Monitor 폴더 (사이드바 생성 도구)
- Briefings_OrderSheets 폴더 (Briefings/ + OrderSheet_Templates/)

**SAL Grid 폴더:** ⭐ (신규)
```
S0_Project-SAL-Grid_생성/
├── manual/
│   └── PROJECT_SAL_GRID_MANUAL.md    ⭐ AI 필수 준수 규칙 포함
├── supabase/
│   ├── schema.sql                     테이블 스키마
│   └── seed_project_sal_grid.sql      ⭐ 상단 규칙 주석 포함
├── sal-grid/
│   ├── task-instructions/
│   │   └── TEMPLATE_instruction.md    ⭐ 규칙 포함 템플릿
│   ├── verification-instructions/
│   ├── task-results/
│   └── stage-gates/
└── viewer/
    ├── viewer.html                    Grid 뷰어
    └── viewer.css                     뷰어 스타일
```

**기본 파일:**
- Project_Directory_Structure.md (프로젝트 디렉터리 구조 안내)
- Project_Status.md (프로젝트 진행 상태 관리)

---

**[추가 설치 안내]**

다음 도구들은 이 패키지에 포함되어 있지 않습니다.
패키지 다운로드 후 Claude Code를 실행하고 설치를 요청하세요.

**1. Git (버전 관리 시스템)**
- 코드 변경 이력을 추적하고 관리하는 도구입니다.
- 여러 버전의 코드를 저장하고, 필요할 때 이전 버전으로 되돌릴 수 있습니다.
- GitHub와 연동하여 코드를 백업하고 공유할 수 있습니다.
- 요청 예시: "Git 설치해 줘"

**2. Node.js (JavaScript 런타임)**
- JavaScript 코드를 컴퓨터에서 실행할 수 있게 해주는 환경입니다.
- 웹 브라우저 없이도 JavaScript를 실행할 수 있습니다.
- 개발 서버 실행, 빌드 도구 사용 등에 필요합니다.
- 요청 예시: "Node.js 설치해 줘"

**3. npm 패키지 (Node Package Manager)**
- 프로젝트에 필요한 외부 라이브러리들을 설치하고 관리합니다.
- package.json 파일에 정의된 모든 패키지를 한 번에 설치합니다.
- npm install 명령어로 설치합니다.
- 요청 예시: "npm 패키지 설치해 줘"

---

**[Claude Code에게 요청하는 방법]**

패키지 다운로드 후 Claude Code를 실행하고 다음과 같이 요청하세요:

```
"프로젝트 개발 환경 설정을 위한 필수 도구 다 설치해 줘"
```

Claude Code가 Git, Node.js 설치 여부를 확인하고,
npm 패키지 설치까지 자동으로 진행합니다.

---

## 7. SAL Grid Viewer 배포 방식 ⭐ (신규)

### 문제: Supabase 계정 공유 불가

현재 viewer.html에는 Supabase URL/Key가 하드코딩되어 있음:
```javascript
const SUPABASE_URL = 'https://xxx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIs...';
```

→ 이대로 배포하면 모든 사용자가 **동일한 DB**에 접속하게 됨

### 해결: 2가지 모드 제공

```
┌─────────────────────────────────────────────────────┐
│                   viewer.html                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│   [📖 데모 보기]          [🔗 내 DB 연결]            │
│         │                        │                  │
│         ▼                        ▼                  │
│   읽기 전용 샘플            Supabase 설정 안내       │
│   (Grid 기능 체험)          (자기 계정 만들기)        │
│                                  │                  │
│                                  ▼                  │
│                           자기 프로젝트에서          │
│                           직접 Grid 운영            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 모드 설명

| 모드 | 용도 | Supabase 필요 |
|------|------|--------------|
| **데모 보기** | Grid 기능 체험, 샘플 데이터 조회 | ❌ (읽기 전용) |
| **내 DB 연결** | 자기 프로젝트에서 Grid 운영 | ✅ (자기 계정) |

### 사용자 여정

```
1. viewer.html 열기
2. "데모 보기" 클릭 → 샘플 Grid로 기능 체험
3. 마음에 들면 "내 DB 연결" 클릭
4. Supabase 가입/설정 안내 따라하기
5. schema.sql 실행 (테이블 생성)
6. 자기 URL/Key 입력
7. 자기 프로젝트에서 Grid 운영!
```

### viewer.html 수정 필요 사항 (공개 전환 전 완료 필수)

- [ ] 모드 선택 UI: 첫 화면에 "데모 보기" / "내 DB 연결" 버튼
- [ ] 설정 모달: Supabase URL/Key 입력 폼
- [ ] localStorage 저장: 입력한 설정 브라우저에 저장
- [ ] Supabase 설정 가이드: 연결 방법 안내 링크/문서
- [ ] 하드코딩된 Key 제거: 원본 제작자 Key 노출 방지

### 장점

- ✅ 원본 제작자의 Supabase Key 노출 안 됨
- ✅ 각 사용자가 자신의 DB에서 독립적으로 운영
- ✅ 데모 모드로 기능 체험 후 도입 결정 가능
- ✅ Supabase 무료 티어로 비용 부담 없음

---

## 8. 다운로드 패키지 제공 방법 ⭐ (신규)

### 이용자 입장

- 다운로드 버튼 클릭 → ZIP 파일 받음 → 압축 해제 → 끝
- 기술적인 부분 전혀 신경 안 써도 됨

### 제작자(PO) 작업

**추천 방식: GitHub Releases**

```
[만드는 방법]
1. GitHub 레포지토리 → Releases → Create new release
2. 버전 태그 입력 (예: v1.0.0)
3. ZIP 파일을 Assets에 첨부
4. Publish release

[웹사이트에서]
<a href="https://github.com/유저명/레포명/releases/latest/download/패키지.zip">
  다운로드
</a>
```

**장점**: 버전 관리 자동, 영구 링크, 안정적

### 대안

| 방법 | 장점 | 단점 |
|------|------|------|
| **GitHub Releases** | 버전 관리 자동, 안정적 | GitHub 계정 필요 |
| **Google Drive** | 간단, 무료, 대용량 | 링크 복잡 |
| **Vercel 호스팅** | 같은 도메인, 빠름 | 용량 제한 (100MB) |

---

## 9. 브랜드명 표기 규칙

- **올바른 표기**: SSAL Works (띄어쓰기)
- **잘못된 표기**: SSALWorks
- **호칭**: "OOO 개발자 님" (당신 사용 금지)
- **분류**: 플랫폼 (프로젝트 아님)

---

## 10. 공개 전환 전 체크리스트 ⭐ (신규)

### 필수 작업

- [ ] **viewer.html 2가지 모드 구현** (섹션 7 참조)
- [ ] **CLAUDE.md 일반화** (섹션 5 참조)
- [ ] **Order Sheet 템플릿 일반화** (섹션 5 참조)
- [ ] **Briefing 일반화** (섹션 5 참조)
- [ ] **Development_Process_Monitor 일반화** ⭐ (신규)
- [ ] **Supabase Key 하드코딩 제거**

### 검증 작업

- [ ] 배포 패키지 구성 확인 (섹션 6 참조)
- [ ] SAL Grid 규칙 4곳 일치 확인:
  - .claude/CLAUDE.md
  - S0_Project-SAL-Grid_생성/manual/PROJECT_SAL_GRID_MANUAL.md
  - S0_Project-SAL-Grid_생성/supabase/seed_project_sal_grid.sql
  - S0_Project-SAL-Grid_생성/sal-grid/task-instructions/TEMPLATE_instruction.md
- [ ] 데모 모드 정상 작동 확인
- [ ] 내 DB 연결 모드 정상 작동 확인

---

## 작성자

🤖 Generated with [Claude Code](https://claude.com/claude-code)
