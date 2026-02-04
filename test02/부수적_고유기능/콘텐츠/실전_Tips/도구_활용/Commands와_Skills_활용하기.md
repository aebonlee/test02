# /Commands와 Skills 활용하기

## 1. /Commands

### /Commands란?

`/Commands`는 Claude Code에서 자주 쓰는 지시사항을 미리 적어두고, 슬래시(`/`) 한 단어로 실행하는 기능입니다.

```
매번 이렇게 말하는 대신:
"변경된 파일을 확인하고, 커밋 메시지를 작성하고, 커밋해줘"

한 단어로:
> /commit
```

### /Commands 만드는 방법

`.claude/commands/` 폴더에 마크다운 파일 하나를 만들면 끝입니다.

```
.claude/commands/commit.md   →   /commit 으로 호출
.claude/commands/review.md   →   /review 로 호출
```

파일 안에 Claude에게 시킬 지시사항을 적어둡니다:

```markdown
// .claude/commands/commit.md

변경된 파일을 확인하고,
커밋 메시지를 작성하고,
git commit을 실행해줘.
```

이게 전부입니다. 파일 하나가 곧 명령어 하나입니다.

### /Commands의 한계

- 마크다운 파일 하나가 전부
- 서브에이전트 분리 실행 불가
- 사용 도구 제한 불가
- 인자 전달 불가 (예: `/commit fix 버그` 같은 게 안 됨)

간단한 작업에는 충분하지만, 여러 단계를 거치는 작업에는 부족합니다.

---

## 2. Skills

### Skills란?

Skills는 `/Commands`보다 강력한 별도의 기능입니다.
설정(어떤 도구를 쓸지, 서브에이전트를 쓸지)과 절차(Step 1, 2, 3...)를 함께 정의할 수 있습니다.

`/Commands`가 **포스트잇에 한 줄 적어놓은 것**이라면,
Skills는 **업무 매뉴얼**입니다.

### Skills 만드는 방법

`.claude/skills/` 폴더에 스킬 이름으로 폴더를 만들고, 그 안에 `SKILL.md`를 넣습니다.

```
.claude/skills/news/
├── SKILL.md            ← 설정 + 절차 (필수)
├── reference.md        ← 참고 자료 (선택)
└── scripts/helper.py   ← 보조 스크립트 (선택)
```

### SKILL.md 작성법

파일은 두 부분으로 나뉩니다: **설정**과 **절차**.

```yaml
---
name: news
description: 투자 뉴스 수집 + GitHub Actions 실행/모니터링
allowed-tools: "Bash(gh *), Bash(curl *), Read, Grep"
---

Step 1: gh workflow run 실행 (뉴스 수집 트리거)
Step 2: gh run list로 상태 모니터링
Step 3: 완료되면 로그 확인
Step 4: 결과 보고 (수집 N건, 저장 N건)
(실패 시) 에러 로그 분석 + 원인 보고
```

| 부분 | 역할 |
|------|------|
| `---` 사이 (설정) | 이름, 설명, 사용할 도구 지정 |
| `---` 아래 (절차) | Claude가 순서대로 실행할 단계 |

### Skills의 강점

- **서브에이전트 분리 실행** (`context: fork`) — 메인 대화와 분리해서 실행
- **사용 도구 제한** (`allowed-tools`) — 지정한 도구만 사용 가능
- **인자 전달** (`$ARGUMENTS`) — `/news 2026-01-30`처럼 값 전달 가능
- **동적 컨텍스트** (`` !'gh pr diff' ``) — 실행 전에 명령어 결과를 미리 가져옴
- **참고 파일 첨부** — 폴더에 참고 자료, 스크립트 함께 보관

### Skills 호출 방법

```
> /news
```

인자 전달:
```
> /news 2026-01-30
```

`$ARGUMENTS`에 `2026-01-30`이 들어가서, 특정 날짜 뉴스를 수집합니다.

---

## 3. /Commands vs Skills 비교

| 구분 | /Commands | Skills |
|------|-----------|--------|
| 위치 | `.claude/commands/commit.md` | `.claude/skills/news/SKILL.md` |
| 구조 | 파일 하나 | 폴더 (SKILL.md + 참고자료) |
| 성격 | 포스트잇 (단순 지시) | 업무 매뉴얼 (설정 + 절차) |
| 서브에이전트 | X | O |
| 도구 제한 | X | O |
| 인자 전달 | X | O |
| 동적 컨텍스트 | X | O |
| 참고 파일 첨부 | X | O |

### 언제 뭘 쓰나요?

```
"커밋해줘"
→ /Commands로 충분. 할 일이 하나.

"뉴스 수집 실행하고, 결과 확인하고, 실패하면 원인 분석해줘"
→ Skills 필요. 여러 단계가 연결된 작업.
```

기존 /Commands는 그대로 작동하므로 급하게 바꿀 필요는 없습니다.
새로 만들 때는 Skills로 만드는 게 좋습니다.

---

## 실전 활용 예시: 자동 + 수동 역할 분담

뉴스 수집처럼 **자동 실행과 수동 트리거가 둘 다 필요한 작업**에 Skills가 유용합니다.

| 역할 | 담당 | 자동/수동 |
|------|------|-----------|
| 매일 8시 뉴스 수집 + 이메일 | GitHub Actions | 자동 |
| 수동 재실행, 결과 확인, 장애 분석 | `/news` 스킬 | 수동 |

자동 수집은 GitHub Actions가 알아서 하고, `/news` 스킬은 "오늘 뉴스 안 왔는데?" 같은 상황에서 수동으로 확인하거나 재실행할 때 쓰는 겁니다.

---

## 핵심 정리

| 항목 | 내용 |
|------|------|
| /Commands | `.claude/commands/`에 마크다운 파일 하나. 단순 지시용 |
| Skills | `.claude/skills/{이름}/SKILL.md`. 설정 + 절차 + 참고자료 |
| 호출 방법 | 둘 다 `/{이름}` |
| 새로 만들 때 | Skills 권장 |
| 기존 /Commands | 그대로 작동, 마이그레이션 불필요 |
