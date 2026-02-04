# CLAUDE.md 파일로 프로젝트 작업 규칙 정리하기

> 이 문서는 CLAUDE.md 파일을 활용하여 프로젝트 작업 규칙을 정리하는 방법을 설명합니다.

---

## CLAUDE.md란

프로젝트 루트에 위치한 파일로, Claude Code가 세션 시작 시 자동으로 읽어 프로젝트 규칙을 파악합니다.

---

## 파일 위치

```
프로젝트/
├── .claude/
│   └── CLAUDE.md   ← 여기
└── ...
```

또는 프로젝트 루트:
```
프로젝트/
├── CLAUDE.md   ← 여기
└── ...
```

---

## CLAUDE.md에 포함할 내용

| 항목 | 예시 |
|------|------|
| 프로젝트 개요 | 무슨 프로젝트인지 |
| 기술 스택 | React, Node.js, Supabase |
| 폴더 구조 | 주요 폴더 설명 |
| 코딩 규칙 | 네이밍, 스타일 |
| 작업 규칙 | 파일 저장 위치, 승인 필요 사항 |

---

## 예시 내용

```markdown
# 프로젝트 규칙

## 기술 스택
- Frontend: React + Vite
- Backend: Supabase Edge Functions
- DB: Supabase PostgreSQL

## 폴더 구조
- Production/Frontend/ : 프론트엔드 코드
- Production/api/ : API 코드

## 코딩 규칙
- 파일명: kebab-case (예: login-page.js)
- 변수명: camelCase
```

---

## CLAUDE.md 생성 요청

```
"이 프로젝트의 CLAUDE.md 파일 만들어줘"
"프로젝트 규칙 정리해서 CLAUDE.md에 저장해줘"
```

---

## CLAUDE.md 업데이트

새로운 규칙이 생기면:
```
"CLAUDE.md에 이 규칙 추가해줘"
```

---

## 효과

| 장점 | 설명 |
|------|------|
| 일관성 | 모든 세션에서 같은 규칙 적용 |
| 자동화 | 매번 설명할 필요 없음 |
| 문서화 | 규칙이 기록되어 있음 |

---

## 규칙 확인

```
"현재 프로젝트 규칙 알려줘"
"CLAUDE.md 내용 보여줘"
```

---

*상세 내용: `작업_규칙_CLAUDE.md에_업데이트하기.md` 참조*
