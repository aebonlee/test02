# Slash Commands로 자주 쓰는 작업 빠르게 실행하기

> 이 문서는 Claude Code의 Slash Commands를 활용하여 반복 작업을 효율화하는 방법을 설명합니다.

---

## Slash Commands란

슬래시(/)로 시작하는 명령어로, 특정 작업을 빠르게 실행할 수 있습니다.

---

## 기본 명령어

| 명령어 | 기능 |
|--------|------|
| /help | 도움말 표시 |
| /clear | 대화 내용 초기화 |
| /exit | Claude Code 종료 |
| /compact | 컨텍스트 압축 |

---

## 사용 방법

터미널에서 슬래시로 시작하는 명령어 입력:
```
/help
/clear
```

---

## 커스텀 Slash Command 만들기

`.claude/commands/` 폴더에 마크다운 파일 생성:

```markdown
# .claude/commands/deploy.md

이 프로젝트를 Vercel에 배포해줘.
1. 빌드 확인
2. git push
3. 배포 상태 확인
```

사용:
```
/deploy
```

---

## 커스텀 명령어 예시

| 파일명 | 용도 |
|--------|------|
| deploy.md | 배포 프로세스 |
| test.md | 테스트 실행 |
| review.md | 코드 리뷰 요청 |
| status.md | 프로젝트 상태 확인 |

---

## 명령어 작성 팁

```markdown
# .claude/commands/morning.md

아침 작업 시작 루틴:
1. work_logs/current.md 읽어줘
2. 어제 마지막 작업 요약해줘
3. 오늘 할 일 정리해줘
```

---

## Slash Commands vs 직접 입력

| 상황 | 추천 |
|------|------|
| 반복 작업 | Slash Command |
| 일회성 요청 | 직접 입력 |
| 복잡한 프로세스 | Slash Command |
| 간단한 질문 | 직접 입력 |

---

## 명령어 목록 확인

```
/help commands
```

---

## 프로젝트별 명령어

각 프로젝트마다 `.claude/commands/` 폴더에 프로젝트에 맞는 명령어를 정의할 수 있습니다.

---

*상세 내용: `Skills_활용하기.md` 참조*
