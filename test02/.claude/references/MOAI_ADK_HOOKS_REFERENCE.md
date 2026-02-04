# MOAI-ADK 훅(Hooks) 레퍼런스

> 출처: https://github.com/modu-ai/moai-adk
> 작성일: 2025-01-15
> 용도: 향후 훅 추가 시 참고용

---

## 개요

MOAI-ADK는 Claude Code용 **12개 훅**을 5개 카테고리로 제공합니다.
훅은 Claude의 동작을 자동으로 제어하고 품질을 관리합니다.

---

## 훅 카테고리 요약

| 카테고리 | 훅 수 | 실행 시점 |
|----------|:-----:|----------|
| Pre-tool | 2개 | 도구 실행 **전** |
| Post-tool | 5개 | 도구 실행 **후** |
| Pre-commit | 1개 | 커밋 **전** |
| Session | 3개 | 세션 시작/종료 |
| Stop | 1개 | 작업 종료 시점 |

---

## 1. Pre-tool 훅 (도구 실행 전) - 2개

### 1.1 pre_tool__security_guard.py ⭐

**목적**: 파일 수정 전 보안 검사

```
실행 시점: Write, Edit 도구 사용 전
기능: 위험한 파일 수정 차단
```

| 패턴 | 동작 | 대상 파일 |
|------|------|----------|
| **DENY** | 절대 차단 | `.env`, `secrets.json`, `.ssh/`, `*.pem`, `.git/`, `.aws/` |
| **ASK** | 사용자 확인 | `package-lock.json`, `tsconfig.json`, `Dockerfile`, CI/CD 설정 |
| **ALLOW** | 자동 승인 | 일반 소스 코드 |

**민감 콘텐츠 검사**:
- 개인 키, 인증서
- API 키 (OpenAI, GitHub, AWS, Google 등)

**보안 메커니즘**:
- 심볼릭 링크 방지
- 프로젝트 경계 검증 (경로 탈주 공격 방어)

---

### 1.2 pre_tool__tdd_enforcer.py

**목적**: TDD(테스트 주도 개발) 강제

```
실행 시점: Write 도구 사용 전
기능: 테스트 파일 존재 여부 확인
```

| 모드 | 동작 |
|------|------|
| `warn` (기본) | 경고만 표시, 진행 허용 |
| `enforce` | 테스트 없으면 사용자 확인 요청 |
| `off` | 검사 비활성화 |

**테스트 파일 패턴**:
- Python: `tests/test_{파일명}.py`
- TypeScript/JS: `{파일명}.test.{확장자}`

**예외 처리** (검사 스킵):
- 테스트, 설정, 문서 파일
- JSON, YAML 구성 파일
- `.min.` 축소 파일

---

## 2. Post-tool 훅 (도구 실행 후) - 5개

### 2.1 post_tool__linter.py ⭐

**목적**: 파일 작성 후 자동 린팅

```
실행 시점: Write, Edit 도구 사용 후
기능: 코드 품질 문제 즉시 피드백
```

| 언어 | 린터 |
|------|------|
| Python | ruff, mypy |
| JavaScript/TypeScript | eslint, biome |
| Go | golint |
| Rust | clippy |

**작동 흐름**:
```
1. 파일 작성 완료
     ↓
2. 린팅 대상 여부 판단
     ↓
3. 적절한 린터 선택 및 실행
     ↓
4. 이슈 분석 (최대 5개)
     ↓
5. Claude에게 피드백 제공
```

**종료 코드**:
- `0`: 성공 (문제 없거나 자동 수정됨)
- `2`: 심각한 에러 (Claude 수정 필요)

**스킵 대상**:
- JSON, 이미지, 폰트, 마크다운
- `node_modules`, `.git`, `venv`

---

### 2.2 post_tool__coverage_guard.py

**목적**: 코드 작성 후 커버리지 검사

```
실행 시점: Write 도구 사용 후
기능: 테스트 커버리지 자동 측정
```

| 언어 | 커버리지 도구 |
|------|-------------|
| Python | coverage.py |
| TypeScript/JS | vitest, jest |

**종료 코드**:
- `0`: 커버리지 정상
- `2`: 커버리지 미달 (경고)

---

### 2.3 post_tool__ast_grep_scan.py

**목적**: AST 기반 코드 분석

```
실행 시점: Write 도구 사용 후
기능: 코드 패턴 분석 및 문제 감지
```

---

### 2.4 post_tool__code_formatter.py

**목적**: 자동 코드 포맷팅

```
실행 시점: Write 도구 사용 후
기능: 코드 스타일 자동 정리
```

---

### 2.5 post_tool__lsp_diagnostic.py

**목적**: LSP 진단 정보 수집

```
실행 시점: Write 도구 사용 후
기능: 언어 서버 오류/경고 수집
```

---

## 3. Pre-commit 훅 (커밋 전) - 1개

### 3.1 pre_commit__tag_validator.py

**목적**: 커밋 전 태그/메타데이터 검증

```
실행 시점: git commit 전
기능: 커밋 메시지, 태그 형식 검증
```

---

## 4. Session 훅 (세션 관리) - 3개

### 4.1 session_start__show_project_info.py ⭐

**목적**: 세션 시작 시 프로젝트 상태 표시

```
실행 시점: Claude Code 세션 시작
기능: Git 정보, SPEC 진행도, 테스트 상태 표시
```

**수집 정보**:
| 항목 | 내용 |
|------|------|
| Git | 브랜치, 마지막 커밋, 변경 파일 수 |
| SPEC | 완료된 SPEC 개수 |
| 테스트 | 커버리지, 테스트 결과 |
| 버전 | moai-adk 버전, 업데이트 확인 |

**위험도 평가**:
```
LOW/MEDIUM/HIGH 자동 계산:
- 미완료 SPEC 50% 미만 → +15점
- 변경 파일 20개 초과 → +10점
- 실패한 테스트 → +12점
```

**다국어 지원**:
- 한국어 (`님`)
- 일본어 (`さん`)
- 중국어, 영어

**출력 예시**:
```
🚀 MoAI-ADK Session Started
   📦 Version: 0.25.4 (latest)
   🔄 Changes: 3
   🌿 Branch: main
   🔧 Github-Flow: trunk | Auto Branch: Yes
   🔨 Last Commit: abc1234 Fix: improve performance
   👋 다시 오신 것을 환영합니다, 홍길동님!
```

---

### 4.2 session_end__auto_cleanup.py

**목적**: 세션 종료 시 자동 정리

```
실행 시점: Claude Code 세션 종료
기능: 임시 파일, 캐시 정리
```

---

### 4.3 session_end__rank_submit.py

**목적**: 세션 종료 시 순위/통계 제출

```
실행 시점: Claude Code 세션 종료
기능: 작업 통계, 품질 점수 기록
```

---

## 5. Stop 훅 (작업 종료) - 1개

### 5.1 stop__loop_controller.py ⭐

**목적**: 자동 피드백 루프 제어

```
실행 시점: Claude 작업 완료 시점
기능: 품질 조건 달성 여부 확인, 자동 재시도
```

**완료 조건 확인**:
- LSP 오류 0개
- 테스트 전체 통과
- 코드 커버리지 임계값 달성
- 완료 마커 (`<moai>DONE</moai>`) 감지

**루프 제어**:
| 상황 | 종료 코드 | 동작 |
|------|:--------:|------|
| 모든 조건 충족 | `0` | 루프 종료 |
| 조건 미충족 | `1` | Claude 계속 작업 |
| 최대 반복 도달 | `0` | 강제 종료 |

**자동 피드백**:
```
사람 개입 없이 자동으로:
1. 코드 품질 검증
2. 문제 발견 시 Claude에게 수정 요청
3. 품질 달성 시 자동 완료
```

---

## 현재 프로젝트와 비교

### 현재 SSAL Works 훅

| 훅 | 위치 |
|-----|------|
| Pre-commit | `.git/hooks/pre-commit` (sync-to-root.js) |
| (기타 없음) | - |

### MOAI-ADK에서 추천하는 훅

| 우선순위 | 훅 | 이유 |
|:--------:|-----|------|
| 1 | `security_guard` | 보안 파일 보호 필수 |
| 2 | `linter` | 코드 품질 자동 관리 |
| 3 | `session_start` | 프로젝트 상태 가시성 |
| 4 | `loop_controller` | 자동 품질 검증 |
| 5 | `tdd_enforcer` | 테스트 문화 강화 |

---

## 훅 적용 방법 (나중에 참고)

### 파일 구조

```
.claude/
└── hooks/
    ├── PreToolUse/
    │   ├── security_guard.py
    │   └── tdd_enforcer.py
    ├── PostToolUse/
    │   ├── linter.py
    │   └── coverage_guard.py
    ├── SessionStart/
    │   └── show_project_info.py
    └── Stop/
        └── loop_controller.py
```

### settings.json 설정

```json
{
  "hooks": {
    "enabled": true,
    "preToolUse": ["security_guard", "tdd_enforcer"],
    "postToolUse": ["linter", "coverage_guard"],
    "sessionStart": ["show_project_info"],
    "stop": ["loop_controller"]
  }
}
```

---

## 참고 링크

- **MOAI-ADK GitHub**: https://github.com/modu-ai/moai-adk
- **훅 폴더**: `src/moai_adk/templates/.claude/hooks/moai/`
- **Claude Code 훅 문서**: https://docs.anthropic.com/claude-code/hooks

---

*이 문서는 향후 훅 추가 시 참고용으로 작성되었습니다.*
