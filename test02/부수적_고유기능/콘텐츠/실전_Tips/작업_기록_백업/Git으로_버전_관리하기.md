# Git으로 코드 버전 관리하고 백업하기

> 이 문서는 Git을 사용하여 코드 버전을 관리하고 안전하게 백업하는 방법을 설명합니다.

---

## 왜 Git을 사용하는가

| 이점 | 설명 |
|------|------|
| 버전 기록 | 모든 변경 이력 저장 |
| 복구 가능 | 이전 버전으로 되돌리기 |
| 협업 | 여러 명이 동시 작업 |
| 백업 | GitHub에 원격 저장 |

---

## Claude Code에게 Git 작업 요청

```
"이 변경사항 커밋해줘"
"main 브랜치로 푸시해줘"
"feature/login 브랜치 만들어줘"
```

---

## 기본 Git 명령어

| 명령어 | 설명 |
|--------|------|
| git status | 변경 파일 확인 |
| git add . | 모든 변경 스테이징 |
| git commit -m "메시지" | 커밋 |
| git push | 원격에 업로드 |
| git pull | 원격에서 가져오기 |

---

## 커밋 메시지 작성법

```
feat: 로그인 기능 추가
fix: 결제 버그 수정
docs: README 업데이트
refactor: 코드 정리
```

---

## 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| main | 배포 가능한 안정 버전 |
| develop | 개발 중인 버전 |
| feature/* | 새 기능 개발 |
| fix/* | 버그 수정 |

---

## Claude Code와 Git 연동

Claude Code는 Git 명령어를 직접 실행할 수 있습니다.

```
"현재 브랜치 상태 확인해줘"
"변경된 파일들 커밋하고 푸시해줘"
"어제 커밋 내역 보여줘"
```

---

## .gitignore 설정

민감 정보와 불필요한 파일 제외:
```
.env
node_modules/
*.log
```

---

## 복구 방법

```
"이전 커밋으로 되돌려줘"
"특정 파일만 이전 버전으로 복구해줘"
```

---

## GitHub 연동

1. GitHub에서 repository 생성
2. 로컬에서 연결: `git remote add origin [URL]`
3. 푸시: `git push -u origin main`

---

*상세 내용: `GitHub_Push_Pull로_작업_반영하기.md` 참조*
