# GitHub Push/Pull로 작업 변경사항을 원격 저장소에 동기화하기

> 이 문서는 GitHub를 통해 작업을 동기화하고 버전 관리하는 방법을 설명합니다.

---

## 왜 GitHub를 사용하는가

여러 환경(로컬, 웹 Claude, 팀원)에서 작업할 때 코드를 동기화해줍니다. 변경 이력이 모두 기록되어 이전 상태로 돌아갈 수 있습니다.

---

## 기본 명령어

### Push: 로컬 → GitHub

```bash
git status                           # 변경 파일 확인
git add .                            # 스테이징
git commit -m "feat: 기능 구현"       # 커밋
git push origin main                 # 업로드
```

### Pull: GitHub → 로컬

```bash
git pull origin main
```

---

## Claude Code에게 요청

```
"현재 변경사항 GitHub에 Push해줘"
"GitHub에서 최신 변경사항 Pull해줘"
"git status 확인해줘"
```

---

## 커밋 메시지

```
<타입>: <설명>

feat: 회원가입 API 구현
fix: 로그인 버튼 오류 수정
docs: README 업데이트
```

| 타입 | 의미 |
|------|------|
| feat | 새 기능 |
| fix | 버그 수정 |
| docs | 문서 수정 |
| refactor | 리팩토링 |
| test | 테스트 코드 |

---

## 충돌 해결

```
"Git 충돌 해결해줘"
```

수동 해결: 충돌 파일에서 `<<<<<<` ~ `>>>>>>` 부분 수정 후 다시 커밋

---

## Best Practice

1. **작업 시작 전 Pull**: `git pull origin main`
2. **작은 단위로 커밋**: 기능별로 나누어 커밋
3. **Push 전 Pull**: 충돌 최소화
4. **민감정보 제외**: .gitignore에 추가

---

## 주의사항

- Push 전에 항상 Pull 먼저
- API 키, 비밀번호는 절대 커밋 금지
- 같은 파일 동시 수정 피하기

---

*Git 공식 문서: https://git-scm.com/doc*
