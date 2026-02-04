# Supabase CRUD 작업 방법

> Supabase 데이터베이스에 CRUD 작업 시 반드시 이 방법을 따르세요.

---

## 핵심 원칙

**PO(사람)에게 SQL 실행을 요청하지 마라. AI가 직접 실행해야 한다.**

---

## 우선순위

| 순위 | 방법 | 사용 조건 |
|:----:|------|----------|
| **1** | REST API (Node.js) | **기본 방법** - 항상 작동 |
| 2 | Supabase MCP | MCP 연결 시 |
| 3 | Supabase CLI | CLI 설치 시 |
| 4 | Dashboard SQL Editor | 최후 수단 (PO 수동) |

---

## 방법 1: REST API (Node.js) - 기본 방법

```
URL: https://{프로젝트}.supabase.co/rest/v1/{테이블명}
인증: apikey + Authorization 헤더에 SERVICE_ROLE_KEY
```

| 작업 | HTTP | 경로 예시 |
|------|------|----------|
| 조회 | GET | `/rest/v1/project_sal_grid?select=*` |
| 생성 | POST | `/rest/v1/project_sal_grid` |
| 수정 | PATCH | `/rest/v1/project_sal_grid?task_id=eq.S5U2` |
| 삭제 | DELETE | `/rest/v1/project_sal_grid?task_id=eq.S5U2` |

**환경변수**: `P3_프로토타입_제작/Database/.env`

---

## 결정 흐름

```
REST API (Node.js) → MCP → CLI → Dashboard (최후)
```

---

## PO(사람)에게 요청해야 하는 경우

아래 조건을 **모두** 만족할 때만 PO에게 요청:

1. REST API 시도 → 실패 (3회 이상)
2. MCP 시도 → 실패 또는 연결 안 됨
3. CLI 시도 → 설치 안 됨 또는 실패

**위 3가지 모두 실패한 경우에만:**
- "모든 방법 시도 후 실패했습니다. Dashboard에서 실행해주세요."
- SQL 파일 생성하여 제공

---

## 상세 문서

`부수적_고유기능/콘텐츠/Tips/데이터베이스/Claude_Code로_Supabase_CRUD_하는_방법.md`
