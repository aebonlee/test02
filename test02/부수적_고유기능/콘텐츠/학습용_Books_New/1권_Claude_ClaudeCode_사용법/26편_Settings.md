# 26편 | Settings

---

Claude Code는 다양한 설정을 통해 동작을 커스터마이징할 수 있다. 프로젝트별 설정과 전역 설정을 구분해서 관리하고, 권한을 세밀하게 조절할 수 있다. 이 편에서는 Settings 구조와 주요 설정을 살펴본다.

## 1. Settings 개요

### 1-1 설정 파일 종류

Claude Code는 두 가지 설정 파일을 사용한다.

| 파일 | 위치 | 적용 범위 |
|------|------|----------|
| 프로젝트 설정 | `.claude/settings.json` | 해당 프로젝트만 |
| 전역 설정 | `~/.claude/settings.json` | 모든 프로젝트 |

### 1-2 설정 우선순위

프로젝트 설정이 전역 설정보다 우선한다.

```
[설정 적용 순서]

1. 프로젝트 설정 (.claude/settings.json)
      ↓ (없으면)
2. 전역 설정 (~/.claude/settings.json)
      ↓ (없으면)
3. 기본값
```

### 1-3 /config 명령어

설정 화면을 열어 옵션을 변경한다.

```
/config

→ 설정 메뉴 표시
  - 모델 선택
  - 권한 설정
  - 출력 스타일
  - 기타 옵션
```

## 2. 프로젝트 설정

### 2-1 .claude/settings.json

프로젝트 루트에 `.claude/settings.json` 파일을 만든다.

```
프로젝트/
└── .claude/
    └── settings.json
```

### 2-2 주요 설정 항목

```json
{
  "model": "claude-sonnet",
  "permissions": {
    "allow": ["Read", "Write", "Bash"],
    "deny": []
  },
  "hooks": {},
  "mcpServers": {}
}
```

| 항목 | 설명 |
|------|------|
| model | 사용할 모델 |
| permissions | 도구 사용 권한 |
| hooks | 이벤트 Hook 설정 |
| mcpServers | MCP 서버 설정 |

### 2-3 설정 예시

**기본 설정:**
```json
{
  "model": "claude-sonnet"
}
```

**권한 포함:**
```json
{
  "model": "claude-sonnet",
  "permissions": {
    "allow": ["Read", "Write", "Edit", "Glob", "Grep"],
    "deny": ["Bash"]
  }
}
```

**MCP 서버 포함:**
```json
{
  "model": "claude-sonnet",
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

**Hook 포함:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "npx prettier --write $FILE_PATH"
      }
    ]
  }
}
```

## 3. 전역 설정

### 3-1 ~/.claude/settings.json

홈 디렉토리의 `.claude/settings.json` 파일이다.

```
Windows: C:\Users\사용자명\.claude\settings.json
Mac/Linux: ~/.claude/settings.json
```

### 3-2 전역 vs 프로젝트 설정

| 구분 | 전역 설정 | 프로젝트 설정 |
|------|----------|--------------|
| 위치 | 홈 디렉토리 | 프로젝트 폴더 |
| 범위 | 모든 프로젝트 | 해당 프로젝트 |
| 우선순위 | 낮음 | 높음 |
| 용도 | 기본값 설정 | 프로젝트별 커스텀 |

**전역 설정에 적합한 것:**
- 기본 모델 선택
- 공통 MCP 서버 (memory 등)
- 일반적인 권한 설정

**프로젝트 설정에 적합한 것:**
- 프로젝트 전용 Hook
- 프로젝트별 MCP 서버
- 특수한 권한 설정

### 3-3 설정 병합

같은 항목이 있으면 프로젝트 설정이 우선한다.

```
전역: { "model": "claude-opus" }
프로젝트: { "model": "claude-sonnet" }
결과: claude-sonnet 사용
```

**mcpServers는 병합:**
```
전역: { "mcpServers": { "memory": {...} } }
프로젝트: { "mcpServers": { "postgres": {...} } }
결과: memory와 postgres 모두 사용
```

## 4. 권한 설정

### 4-1 /permissions 명령어

도구 사용 권한을 관리한다.

```
/permissions

→ 권한 설정 메뉴
  - 허용된 도구 목록
  - 차단된 도구 목록
  - 자동 승인 설정
```

### 4-2 도구별 권한

각 도구의 사용 여부를 설정할 수 있다.

**허용 (allow):**
```json
{
  "permissions": {
    "allow": ["Read", "Write", "Edit", "Glob", "Grep"]
  }
}
```

**차단 (deny):**
```json
{
  "permissions": {
    "deny": ["Bash"]
  }
}
```

**특정 패턴만 허용:**
```json
{
  "permissions": {
    "allow": [
      "Read",
      "Bash(npm *)",
      "Bash(git *)"
    ]
  }
}
```

### 4-3 자동 승인 설정

일부 도구는 실행 전 승인을 요청한다. 자동 승인을 설정하면 확인 없이 실행된다.

**기본 동작:**
```
Claude: 이 파일을 수정해도 될까요?
        [예] [아니오]
```

**자동 승인 설정:**
```json
{
  "permissions": {
    "allow": ["Write(**/*.js)"]
  }
}
```
→ .js 파일 수정 시 자동 승인

**주의:** 자동 승인은 신뢰할 수 있는 작업에만 설정

## 5. 정리

### 설정 파일 요약

| 파일 | 위치 | 용도 |
|------|------|------|
| 프로젝트 | `.claude/settings.json` | 프로젝트별 설정 |
| 전역 | `~/.claude/settings.json` | 기본 설정 |

### 주요 설정 항목

| 항목 | 설명 | 예시 |
|------|------|------|
| model | 모델 선택 | "claude-sonnet" |
| permissions | 권한 설정 | allow, deny |
| hooks | 이벤트 Hook | PreToolUse, PostToolUse |
| mcpServers | MCP 서버 | memory, filesystem |

### 권장 설정

**전역 설정 (기본값):**
```json
{
  "model": "claude-sonnet",
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

**프로젝트 설정 (필요 시):**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "npx prettier --write $FILE_PATH"
      }
    ]
  },
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

---

**작성일: 2025-12-20 / 글자수: 약 3,000자 / 작성자: Claude / 프롬프터: 써니**

