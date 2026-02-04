# Feature 브랜치 만들고 Vercel Preview로 테스트 후 main에 병합하기

> 이 문서는 Feature 브랜치와 Vercel Preview를 활용하여 안전하게 배포하는 방법을 설명합니다.

---

## 왜 Feature 브랜치를 사용하는가

main 브랜치에 직접 Push하면 변경사항이 즉시 프로덕션에 배포됩니다. 버그가 있으면 실서비스가 바로 영향을 받습니다. Feature 브랜치에서 작업하고 Preview에서 테스트한 후 병합하면 안전합니다.

---

## 전체 워크플로우

```
1. Feature 브랜치 생성
   git checkout -b feature/design-update
    ↓
2. 작업 후 Push
   git push origin feature/design-update
    ↓
3. Vercel 자동 Preview 배포
   https://프로젝트-git-브랜치명-계정.vercel.app
    ↓
4. Preview에서 테스트
    ↓
5. 문제없으면 main에 병합
```

---

## 상세 단계

### 1단계: Feature 브랜치 생성

```bash
git checkout -b feature/design-update
```

브랜치 이름: `feature/기능명`, `fix/버그명`, `hotfix/긴급수정`

### 2단계: 작업 및 Push

```bash
git add .
git commit -m "feat: 디자인 업데이트"
git push origin feature/design-update
```

### 3단계: Preview에서 테스트

Preview URL에서 기능, 디자인, 에러 확인

### 4단계: main에 병합

```bash
git checkout main
git pull origin main
git merge feature/design-update
git push origin main
```

### 5단계: 정리

```bash
git branch -d feature/design-update
```

---

## Claude Code에게 요청하기

```
"feature/design-update 브랜치 만들어줘"
"feature 브랜치 main에 병합하고 Push해줘"
"병합 완료된 feature 브랜치 삭제해줘"
```

---

## 트러블슈팅

**Preview에서 데이터가 안 보임**: Vercel 환경 변수가 Preview에도 설정되어 있는지 확인

**충돌 발생**: `"merge conflict 해결해줘"`

---

*더 자세한 Vercel 설정은 Vercel 공식 문서를 참고하세요: https://vercel.com/docs*
