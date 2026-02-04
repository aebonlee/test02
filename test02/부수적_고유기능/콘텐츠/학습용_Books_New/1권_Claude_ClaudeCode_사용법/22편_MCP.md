# 22편 | MCP

---

Claude Code는 MCP(Model Context Protocol)를 통해 외부 서비스와 연결할 수 있다. 데이터베이스, 파일 시스템, 브라우저 등 다양한 도구를 Claude Code에 추가할 수 있다. 이 편에서는 MCP의 개념과 활용법을 살펴본다.

## 1. MCP 개요

### 1-1 MCP란

MCP(Model Context Protocol)는 Claude Code의 기능을 확장하는 표준 프로토콜이다. 외부 도구와 서비스를 Claude Code에 연결하는 방법을 정의한다.

```
[Claude Code] ←── MCP ──→ [외부 서비스]
                          - 데이터베이스
                          - 파일 시스템
                          - 브라우저
                          - API 서비스
```

### 1-2 MCP가 필요한 이유

Claude Code의 기본 도구만으로는 처리하기 어려운 작업이 있다.

**기본 도구의 한계:**
- 데이터베이스 직접 접근 불가
- 브라우저 자동화 불가
- 특정 서비스 API 연동 불가

**MCP로 해결:**
- 다양한 외부 서비스 연결
- 새로운 도구 추가
- 기능 무한 확장

### 1-3 MCP 작동 방식

```
[사용자 요청]
      ↓
[Claude Code]
      ↓
[MCP 서버 호출]
      ↓
[외부 서비스 실행]
      ↓
[결과 반환]
      ↓
[Claude Code가 처리]
```

MCP 서버는 Claude Code와 외부 서비스 사이의 다리 역할을 한다.

## 2. MCP 서버

### 2-1 MCP 서버란

MCP 서버는 특정 기능을 제공하는 독립 프로그램이다. Claude Code가 필요할 때 서버에 요청을 보내고 결과를 받는다.

```
Claude Code
    │
    ├── MCP 서버 A (파일 시스템)
    ├── MCP 서버 B (데이터베이스)
    └── MCP 서버 C (브라우저)
```

### 2-2 공식 제공 서버

Anthropic과 커뮤니티에서 제공하는 검증된 서버들이다.

| 서버 | 기능 |
|------|------|
| @modelcontextprotocol/server-filesystem | 파일 시스템 접근 |
| @modelcontextprotocol/server-memory | 영구 기억 저장 |
| @modelcontextprotocol/server-puppeteer | 브라우저 자동화 (Puppeteer) |
| @playwright/mcp | 브라우저 자동화 (Playwright) |
| @modelcontextprotocol/server-postgres | PostgreSQL 연결 |
| @modelcontextprotocol/server-sqlite | SQLite 연결 |

### 2-3 커뮤니티 서버

개발자 커뮤니티에서 만든 다양한 서버들이 있다.

- GitHub 연동 서버
- Slack 연동 서버
- Notion 연동 서버
- Google Drive 연동 서버
- 그 외 다수

## 3. MCP 설정

### 3-1 설정 파일 위치

MCP 서버는 Claude Code 설정 파일에서 정의한다.

**프로젝트 설정:**
```
프로젝트/
└── .claude/
    └── settings.json
```

**전역 설정:**
```
~/.claude/settings.json
```

### 3-2 서버 추가 방법

settings.json에 MCP 서버를 추가한다.

```json
{
  "mcpServers": {
    "서버이름": {
      "command": "실행 명령어",
      "args": ["인자1", "인자2"],
      "env": {
        "환경변수": "값"
      }
    }
  }
}
```

**예시 - Memory 서버:**
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

**예시 - PostgreSQL 서버:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/db"
      }
    }
  }
}
```

### 3-3 /mcp 명령어

현재 연결된 MCP 서버를 확인하고 관리한다.

```
/mcp
→ 연결된 MCP 서버 목록
→ 각 서버에서 제공하는 도구
→ 서버 상태 (연결됨/끊김)
```

## 4. 주요 MCP 서버

### 4-1 filesystem (파일 시스템)

지정된 디렉토리의 파일에 접근한다.

**설정:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/허용할/경로"
      ]
    }
  }
}
```

**제공 도구:**
- 파일 읽기/쓰기
- 디렉토리 목록
- 파일 검색

### 4-2 memory (기억 저장)

대화 간에 정보를 기억하고 공유한다.

**설정:**
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

**제공 도구:**
- 정보 저장 (create_entities)
- 정보 조회 (read_entities)
- 관계 생성 (create_relations)

**활용:**
```
사용자: 이 프로젝트의 DB 비밀번호는 abc123이야. 기억해둬.

Claude: [memory 서버로 저장]
        DB 비밀번호를 기억했습니다.

--- 나중에 ---

사용자: DB 비밀번호가 뭐였지?

Claude: [memory 서버에서 조회]
        DB 비밀번호는 abc123입니다.
```

### 4-3 브라우저 자동화 (Puppeteer / Playwright)

웹 브라우저를 자동으로 제어한다. Puppeteer와 Playwright 두 가지 옵션이 있다.

**Puppeteer 설정:**
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

**Playwright 설정 (권장):**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

> **Puppeteer vs Playwright:** Playwright는 Microsoft가 개발한 최신 브라우저 자동화 도구로, 접근성 트리 기반으로 작동하여 더 빠르고 안정적이다. Chromium, Firefox, WebKit을 모두 지원한다.

**제공 도구:**
- 페이지 열기
- 스크린샷 캡처
- 요소 클릭
- 폼 입력
- JavaScript 실행

**활용:**
```
사용자: 로그인 페이지 스크린샷 찍어줘

Claude: [puppeteer/playwright 서버 사용]
        1. 브라우저 열기
        2. 로그인 페이지로 이동
        3. 스크린샷 캡처
        4. 이미지 저장

        스크린샷을 저장했습니다: login-page.png
```

### 4-4 기타 유용한 서버

**PostgreSQL:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

**SQLite:**
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "--db-path",
        "./database.db"
      ]
    }
  }
}
```

## 5. 실전 활용

### 5-1 외부 서비스 연동

Supabase와 연동하는 예시:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "supabase-mcp-server"],
      "env": {
        "SUPABASE_URL": "https://xxx.supabase.co",
        "SUPABASE_KEY": "your-api-key"
      }
    }
  }
}
```

**활용:**
```
사용자: users 테이블에서 최근 가입자 10명 조회해줘

Claude: [supabase MCP 서버 사용]

        최근 가입자 10명:
        1. user001 - 2025-12-20
        2. user002 - 2025-12-19
        ...
```

### 5-2 데이터베이스 연결

PostgreSQL 데이터베이스에 직접 쿼리를 실행한다.

```
사용자: 지난달 매출 합계 조회해줘

Claude: [postgres MCP 서버 사용]
        SELECT SUM(amount) FROM sales
        WHERE created_at >= '2025-11-01'

        지난달 매출 합계: 12,345,678원
```

### 5-3 자동화 워크플로우

여러 MCP 서버를 조합해서 복잡한 작업을 자동화한다.

```
사용자: 웹사이트에서 가격 정보 수집해서 DB에 저장해줘

Claude:
1. [puppeteer] 웹사이트 접속
2. [puppeteer] 가격 정보 추출
3. [postgres] DB에 저장

완료:
- 50개 상품 가격 수집
- prices 테이블에 저장
```

## 6. MCP의 위상과 다른 AI 시스템 비교

### 6-1 MCP의 업계 표준화

MCP는 1년 만에 AI 업계의 사실상 표준이 되었다.

**주요 이정표:**
- **2024년 11월**: Anthropic이 오픈소스로 공개
- **2025년 3월**: OpenAI가 MCP 채택 (ChatGPT, Agents SDK)
- **2025년 4월**: Google이 Gemini에서 MCP 지원 발표
- **2025년 12월**: Linux Foundation의 Agentic AI Foundation(AAIF)에 기부

**현재 규모 (2025년 12월):**
- 월간 SDK 다운로드: 9,700만 건
- 활성 MCP 서버: 10,000개 이상
- 지원 플랫폼: ChatGPT, Claude, Cursor, Gemini, Microsoft Copilot, VS Code

### 6-2 Agentic AI Foundation (AAIF)

MCP는 이제 Linux Foundation 산하 AAIF에서 관리된다.

**공동 창립사:**
- Anthropic, Block, OpenAI

**후원사:**
- Google, Microsoft, AWS, Cloudflare, Bloomberg

**의미:**
- 특정 회사 종속 없는 중립적 표준
- Kubernetes, PyTorch, Node.js와 같은 수준의 거버넌스

### 6-3 다른 AI 확장 시스템과 비교

| 항목 | MCP | GPT Actions | Gemini Extensions |
|------|-----|-------------|-------------------|
| 표준화 | Open Standard (AAIF) | OpenAI 전용 | Google 전용 |
| 실행 위치 | 로컬 | 클라우드 | 클라우드 |
| 지원 범위 | 멀티플랫폼 | ChatGPT만 | Gemini만 |
| 데이터 보안 | 높음 (로컬) | 중간 | 중간 |

**MCP의 차별점:**
- 로컬 실행으로 민감한 데이터 보호
- 모든 주요 AI 플랫폼에서 지원
- 오픈소스로 누구나 서버 개발 가능

## 7. 정리

### MCP 서버 요약

| 서버 | 용도 | 주요 기능 |
|------|------|----------|
| filesystem | 파일 접근 | 읽기, 쓰기, 검색 |
| memory | 기억 저장 | 정보 저장/조회 |
| puppeteer | 브라우저 | 자동화, 스크린샷 |
| playwright | 브라우저 (권장) | 자동화, 멀티브라우저 |
| postgres | PostgreSQL | SQL 쿼리 |
| sqlite | SQLite | 로컬 DB |

### 설정 예시

**완전한 설정 예시:**
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/user/projects"
      ]
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### 주의사항

- MCP 서버는 별도 프로세스로 실행됨
- 환경 변수로 민감한 정보 전달 시 주의
- 필요한 서버만 활성화 (리소스 절약)
- 서버 업데이트 주기적으로 확인

---

**작성일: 2025-12-20 / 수정일: 2025-12-22 / 글자수: 약 5,500자 / 작성자: Claude / 프롬프터: 써니**

