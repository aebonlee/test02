# Memory MCP, Supabase MCP 등 외부 서비스 연동하는 MCP 서버 설정하기

> 이 문서는 MCP(Model Context Protocol) 서버를 설정하여 Claude Code 기능을 확장하는 방법을 설명합니다.

---

## MCP란 무엇인가

MCP는 Claude Code에 추가 기능을 연결하는 프로토콜입니다. Memory(세션 간 기억), Supabase(DB 접근), GitHub(PR 관리) 등 다양한 서버를 추가할 수 있습니다.

---

## 자주 사용하는 MCP 서버

| 서버 | 용도 | 사용 예시 |
|------|------|----------|
| `memory` | 세션 간 정보 유지 | 이전 대화 맥락 기억 |
| `supabase` | DB 쿼리 직접 실행 | MCP로 INSERT 해줘 |
| `github` | PR, Issue 직접 관리 | PR 목록 가져와줘 |
| `filesystem` | 파일 접근 확장 | 특정 폴더 탐색 |

---

## 설치 및 추가

```bash
# MCP 서버 추가
claude mcp add memory
claude mcp add supabase

# 설치된 서버 확인
claude mcp list

# 서버 제거
claude mcp remove memory
```

---

## 설정 파일 위치

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

---

## 설정 파일 예시

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://xxx.supabase.co",
        "SUPABASE_KEY": "your-key"
      }
    }
  }
}
```

---

## 권장 조합

| 용도 | 권장 서버 |
|------|----------|
| 기본 사용 | Memory + Filesystem |
| 풀스택 개발 | Memory + Supabase + GitHub |
| DB 중심 작업 | Memory + Supabase |

---

## Claude Code에게 요청하기

```
"MCP 서버 목록 확인해줘"
"Supabase MCP로 users 테이블 조회해줘"
"Memory MCP에 이 정보 저장해줘"
```

---

*상세 내용: `외부_연동_설정_Guide/MCP_설정_가이드.md` 참조*
