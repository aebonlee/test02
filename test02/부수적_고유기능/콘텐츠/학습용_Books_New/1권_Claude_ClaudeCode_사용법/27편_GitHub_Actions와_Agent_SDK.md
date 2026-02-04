# 27편 | GitHub Actions와 Agent SDK

---

Claude Code는 GitHub Actions와 연동해서 PR 리뷰를 자동화하고, Agent SDK를 통해 커스텀 에이전트를 구축할 수 있다. 이 편에서는 GitHub 연동과 Agent SDK 활용법을 살펴본다.

## 1. GitHub Actions 연동

### 1-1 GitHub Actions란

GitHub Actions는 GitHub 저장소에서 자동화 워크플로우를 실행하는 기능이다. PR 생성, 코드 푸시 등의 이벤트에 반응해서 작업을 수행한다.

```
[이벤트 발생]
      ↓
[GitHub Actions 실행]
      ↓
[자동화 작업 수행]
```

### 1-2 Claude Code 연동 설정

GitHub 저장소에 Claude Code를 연동한다.

**1단계: GitHub App 설치**
```
/install-github-app

→ GitHub 인증
→ 저장소 선택
→ 권한 부여
→ 설치 완료
```

**2단계: 워크플로우 파일 생성**
```yaml
# .github/workflows/claude.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]
  issue_comment:
    types: [created]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 1-3 @claude 멘션 사용

PR이나 이슈에서 @claude를 멘션하면 Claude Code가 응답한다.

**PR 댓글에서:**
```
@claude 이 변경사항 리뷰해줘
```

**Claude 응답:**
```
코드 리뷰 결과:

✅ 전반적으로 좋은 변경입니다.

개선 제안:
1. line 45: 에러 처리 추가 권장
2. line 78: 변수명 개선 가능

보안:
- 문제 없음
```

## 2. PR 자동화

### 2-1 PR 리뷰 자동화

PR이 생성되면 자동으로 코드 리뷰를 수행한다.

**자동 리뷰 항목:**
- 코드 품질
- 보안 취약점
- 성능 문제
- 테스트 커버리지
- 코딩 컨벤션

**리뷰 결과 예시:**
```
## 🔍 Claude Code Review

### 요약
3개 파일 변경, 2개 제안사항

### 상세 리뷰

#### src/api/auth.js
- ⚠️ Line 23: SQL 인젝션 위험
  ```js
  // 현재
  query(`SELECT * FROM users WHERE id = ${id}`)

  // 권장
  query('SELECT * FROM users WHERE id = $1', [id])
  ```

#### src/utils/helper.js
- 💡 Line 45: 성능 개선 가능
  불필요한 반복문 제거 권장
```

### 2-2 코드 제안

Claude Code가 개선된 코드를 직접 제안한다.

```
@claude 이 함수 최적화해줘

Claude:
현재 코드:
```js
function findUser(users, id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}
```

제안 코드:
```js
const findUser = (users, id) => users.find(u => u.id === id) ?? null;
```

변경 이유:
- Array.find() 사용으로 가독성 향상
- 화살표 함수로 간결화
```

### 2-3 자동 수정

Claude Code가 직접 수정 커밋을 생성할 수 있다.

```
@claude 이 버그 수정해줘

Claude:
버그를 수정하고 커밋을 생성했습니다.

커밋: fix: null 체크 추가 (abc1234)

변경 내용:
- src/api/user.js: null 체크 추가
- tests/user.test.js: 테스트 케이스 추가
```

## 3. Agent SDK 개요

### 3-1 Agent SDK란

Agent SDK는 Claude Code의 기능을 프로그래밍 방식으로 사용할 수 있게 해주는 개발 도구이다.

```
CLI (Claude Code):  터미널에서 대화형 사용
Agent SDK:          코드에서 프로그래밍 방식 사용
```

### 3-2 SDK vs CLI 차이

| 구분 | CLI | Agent SDK |
|------|-----|-----------|
| 사용 방식 | 터미널 대화 | 코드 호출 |
| 대상 | 개발자 직접 사용 | 자동화 시스템 |
| 인터페이스 | 대화형 | API |
| 용도 | 개발 작업 | 커스텀 에이전트 |

### 3-3 사용 시나리오

**커스텀 에이전트 구축:**
- 특정 도메인 전문 에이전트
- 회사 내부 도구 통합
- 자동화 파이프라인

**통합 시스템 개발:**
- CI/CD 파이프라인 통합
- 슬랙 봇 개발
- 내부 도구 연동

## 4. Agent SDK 활용

### 4-1 설치 및 설정

**설치:**
```bash
npm install @anthropic-ai/sdk
```

> **참고**: Agent SDK는 Anthropic SDK(`@anthropic-ai/sdk`)를 기반으로 구축된다. 정확한 패키지명과 API는 공식 문서(docs.anthropic.com)에서 최신 정보를 확인하는 것을 권장한다.

**API 키 설정:**
```bash
export ANTHROPIC_API_KEY=your-api-key
```

### 4-2 기본 사용법

**간단한 요청:**
```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const message = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "이 코드를 리뷰해줘" }
  ]
});

console.log(message.content);
```

**도구 사용 (Tool Use):**
```javascript
const message = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  tools: [{
    name: "run_command",
    description: "터미널 명령 실행",
    input_schema: {
      type: "object",
      properties: { command: { type: "string" } }
    }
  }],
  messages: [{ role: "user", content: "테스트 실행해줘" }]
});
```

### 4-3 커스텀 에이전트 구축

**코드 리뷰 에이전트:**
```javascript
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic();

async function reviewCode(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: `당신은 코드 리뷰 전문가입니다.
다음 항목을 검토하세요:
- 보안 취약점
- 성능 문제
- 코드 품질`,
    messages: [
      { role: "user", content: `이 코드를 리뷰해주세요:\n\n${code}` }
    ]
  });

  return message.content[0].text;
}

// 사용
const review = await reviewCode("src/api/auth.js");
```

**자동화 에이전트 (개념):**
```javascript
// 실제 Agent SDK가 출시되면 다음과 같은 패턴으로 사용 가능
async function autoFix(issue) {
  // 1. 이슈 분석
  const analysis = await analyzeIssue(issue);

  // 2. 수정 사항 적용 (Tool Use 활용)
  const fix = await applyFix(analysis);

  // 3. 테스트 실행
  const test = await runTests();

  return { analysis, fix, test };
}

// 현재는 Anthropic SDK의 Tool Use 기능으로 구현 가능
// 공식 Agent SDK 출시 시 더 간편한 API 제공 예정
```

## 5. 정리

### GitHub Actions 요약

| 기능 | 설명 | 사용법 |
|------|------|--------|
| 연동 설정 | GitHub App 설치 | /install-github-app |
| PR 리뷰 | 자동 코드 리뷰 | PR 생성 시 자동 |
| 멘션 | Claude 호출 | @claude 메시지 |
| 자동 수정 | 직접 커밋 생성 | @claude 수정해줘 |

### Agent SDK 요약

| 항목 | 내용 |
|------|------|
| 설치 | npm install @anthropic-ai/sdk |
| 용도 | 커스텀 에이전트, 자동화 |
| 장점 | 프로그래밍 방식 제어 |
| 대상 | 개발자, 시스템 통합 |
| 참고 | docs.anthropic.com에서 최신 정보 확인 |

### 활용 팁

**GitHub Actions:**
```
- PR마다 자동 리뷰 받기
- @claude로 빠른 피드백
- 보안 취약점 조기 발견
```

**Agent SDK:**
```
- 반복 작업 자동화
- 팀 전용 에이전트 구축
- CI/CD 파이프라인 통합
```

---

**작성일: 2025-12-20 / 수정일: 2025-12-22 / 글자수: 약 3,600자 / 작성자: Claude / 프롬프터: 써니**

