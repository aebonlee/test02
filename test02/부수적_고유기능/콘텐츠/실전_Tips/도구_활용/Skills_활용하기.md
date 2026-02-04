# Claude Code Skills로 특정 작업 자동화하기

> 이 문서는 Claude Code의 Skills 기능을 활용하여 반복 작업을 자동화하는 방법을 설명합니다.

---

## Skills란

특정 작업 유형에 대한 전문 지침을 제공하여 Claude Code가 더 효과적으로 작업할 수 있게 하는 기능입니다.

---

## 내장 Skills 예시

| Skill | 용도 |
|-------|------|
| pdf | PDF 파일 읽기 및 분석 |
| xlsx | Excel 파일 처리 |
| playwright-mcp | 브라우저 자동화 테스트 |

---

## Skills 사용 방법

Claude Code가 자동으로 필요한 Skill을 감지하고 활성화합니다.

```
"이 PDF 파일 분석해줘"  → pdf skill 자동 활성화
"이 엑셀 데이터 읽어줘"  → xlsx skill 자동 활성화
```

---

## Skills의 이점

| 이점 | 설명 |
|------|------|
| 전문성 | 해당 작업에 최적화된 처리 |
| 일관성 | 항상 동일한 방식으로 처리 |
| 자동화 | 수동 설정 불필요 |

---

## 사용자 정의 Skills

프로젝트에 맞는 커스텀 Skill을 정의할 수 있습니다.

```markdown
# .claude/skills/my-skill.md

이 프로젝트의 특정 작업 규칙...
```

---

## Skills 확인

```
"사용 가능한 Skills 목록 보여줘"
"현재 활성화된 Skill이 뭐야?"
```

---

## Skills vs Slash Commands

| 구분 | Skills | Slash Commands |
|------|--------|----------------|
| 활성화 | 자동 | 수동 (/명령어) |
| 용도 | 작업 유형별 전문성 | 특정 동작 실행 |
| 지속성 | 세션 동안 | 한 번 실행 |

---

## 권장 사용 패턴

| 상황 | 권장 |
|------|------|
| PDF/Excel 작업 | Skill 자동 활성화 |
| 테스트 자동화 | playwright-mcp skill |
| 프로젝트 규칙 | 커스텀 skill 정의 |

---

*상세 내용: `Slash_Commands_활용하기.md` 참조*
