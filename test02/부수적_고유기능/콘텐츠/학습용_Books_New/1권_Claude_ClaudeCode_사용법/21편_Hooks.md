# 21편 | Hooks

---

Claude Code는 특정 이벤트가 발생할 때 자동으로 명령어를 실행하는 Hooks 기능을 제공한다. 파일 저장 전 린트 실행, 커밋 전 테스트 실행 등 반복적인 작업을 자동화할 수 있다. 이 편에서는 Hooks의 개념과 설정 방법을 살펴본다.

## 1. Hooks 개요

### 1-1 Hooks란

Hooks는 특정 이벤트에 반응해서 셸 명령어를 자동 실행하는 기능이다. "이 일이 발생하면 이것을 실행해라"를 정의한다.

```
[이벤트 발생]
      ↓
[Hook 조건 확인]
      ↓
[조건 일치 시 명령어 실행]
      ↓
[결과에 따라 진행/중단]
```

### 1-2 이벤트 기반 동작

Hooks는 Claude Code의 도구 실행을 감지해서 동작한다.

```
사용자: 이 파일 저장해줘

Claude: [Write 도구 실행 시도]
              ↓
        [PreToolUse Hook 실행]
              ↓ (통과)
        [Write 도구 실행]
              ↓
        [PostToolUse Hook 실행]
              ↓
        파일 저장 완료
```

### 1-3 Hooks 사용 시점

**적합한 경우:**
- 파일 저장 시 자동 포맷팅
- 커밋 전 린트/테스트 실행
- 특정 도구 사용 시 알림
- 위험한 명령어 차단

**부적합한 경우:**
- 복잡한 비즈니스 로직
- 사용자 입력이 필요한 작업
- 장시간 실행되는 작업

## 2. Hook 유형

### 2-1 PreToolUse (도구 실행 전)

도구가 실행되기 **전에** 명령어를 실행한다.

```
[도구 실행 요청]
      ↓
[PreToolUse Hook 실행]
      ↓
  ├── 성공 → 도구 실행 진행
  └── 실패 → 도구 실행 차단
```

**용도:**
- 실행 전 검증
- 조건 확인
- 위험 명령 차단

**예시:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "echo '명령어 실행 전 확인'"
      }
    ]
  }
}
```

### 2-2 PostToolUse (도구 실행 후)

도구가 실행된 **후에** 명령어를 실행한다.

```
[도구 실행]
      ↓
[PostToolUse Hook 실행]
      ↓
[후속 작업 완료]
```

**용도:**
- 결과 후처리
- 로깅
- 알림 발송
- 자동 포맷팅

**예시:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "npx prettier --write $FILE_PATH"
      }
    ]
  }
}
```

### 2-3 Notification (알림)

특정 이벤트 발생 시 알림을 보낸다.

**용도:**
- 작업 완료 알림
- 에러 발생 알림
- 상태 변경 알림

**예시:**
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "Bash",
        "command": "notify-send 'Claude Code' '명령어 실행 완료'"
      }
    ]
  }
}
```

### 2-4 Stop (중단)

특정 조건에서 작업을 중단한다.

**용도:**
- 위험 명령어 차단
- 조건 불충족 시 중단
- 권한 검증

**예시:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(rm -rf)",
        "command": "exit 1"
      }
    ]
  }
}
```

`exit 1`을 반환하면 해당 도구 실행이 차단된다.

## 3. Hooks 설정

### 3-1 설정 파일 위치

Hooks는 Claude Code 설정 파일에서 정의한다.

**프로젝트 설정:**
```
프로젝트/
└── .claude/
    └── settings.json
```

**전역 설정:**
```
~/.claude/settings.json
```

### 3-2 설정 구조

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "도구명 또는 패턴",
        "command": "실행할 셸 명령어"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "도구명 또는 패턴",
        "command": "실행할 셸 명령어"
      }
    ]
  }
}
```

**구성 요소:**
- `matcher`: 어떤 도구에 반응할지
- `command`: 실행할 명령어

### 3-3 매처 (Matcher) 패턴

매처는 어떤 도구 호출에 반응할지를 정의한다.

**도구명 직접 지정:**
```json
"matcher": "Write"
```
→ Write 도구 사용 시 반응

**패턴 사용:**
```json
"matcher": "Bash(npm *)"
```
→ npm으로 시작하는 Bash 명령에 반응

**모든 도구:**
```json
"matcher": "*"
```
→ 모든 도구 사용 시 반응

**환경 변수:**
Hook 명령어에서 사용 가능한 변수:
- `$TOOL_NAME`: 도구 이름
- `$FILE_PATH`: 파일 경로 (해당되는 경우)
- `$COMMAND`: 실행된 명령어 (Bash의 경우)

## 4. 활용 예시

### 4-1 커밋 전 린트 실행

Git 커밋 전에 린트를 실행해서 코드 품질을 확인한다.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "command": "npm run lint"
      }
    ]
  }
}
```

**동작:**
```
사용자: 커밋해줘

Claude: [git commit 실행 시도]
              ↓
        [npm run lint 실행]
              ↓
  ├── 린트 통과 → 커밋 진행
  └── 린트 실패 → 커밋 차단
```

### 4-2 파일 저장 시 포맷팅

파일 저장 후 자동으로 코드를 포맷팅한다.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "npx prettier --write $FILE_PATH"
      }
    ]
  }
}
```

**동작:**
```
사용자: 이 코드 저장해줘

Claude: [Write 도구로 파일 저장]
              ↓
        [Prettier로 자동 포맷팅]
              ↓
        포맷팅된 파일 완성
```

### 4-3 빌드 완료 알림

빌드가 완료되면 알림을 보낸다.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash(npm run build*)",
        "command": "notify-send 'Claude Code' '빌드 완료!'"
      }
    ]
  }
}
```

**Windows의 경우:**
```json
{
  "command": "powershell -Command \"[System.Windows.Forms.MessageBox]::Show('빌드 완료!')\""
}
```

### 4-4 위험 명령 차단

위험한 명령어 실행을 차단한다.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(rm -rf /)",
        "command": "echo '위험한 명령어 차단됨' && exit 1"
      },
      {
        "matcher": "Bash(DROP DATABASE*)",
        "command": "echo 'DB 삭제 명령 차단됨' && exit 1"
      }
    ]
  }
}
```

**동작:**
```
사용자: rm -rf / 실행해줘

Claude: [명령 실행 시도]
              ↓
        [PreToolUse Hook 실행]
              ↓
        [exit 1 반환 → 차단됨]
              ↓
        "위험한 명령어가 차단되었습니다."
```

## 5. 정리

### Hook 유형 요약

| Hook 유형 | 실행 시점 | 용도 |
|-----------|----------|------|
| PreToolUse | 도구 실행 전 | 검증, 차단 |
| PostToolUse | 도구 실행 후 | 후처리, 포맷팅 |
| Notification | 이벤트 발생 시 | 알림 |
| Stop (exit 1) | 조건 불충족 시 | 실행 차단 |

### 설정 예시 정리

**완전한 설정 예시:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "command": "npm run lint && npm test"
      },
      {
        "matcher": "Bash(rm -rf*)",
        "command": "echo '삭제 명령 검토 필요' && exit 1"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "npx prettier --write $FILE_PATH"
      },
      {
        "matcher": "Bash(npm run build*)",
        "command": "notify-send 'Claude Code' '빌드 완료'"
      }
    ]
  }
}
```

### 주의사항

- Hook 명령어가 실패하면 (exit 1) 도구 실행이 차단됨
- 장시간 실행되는 Hook은 작업 흐름을 방해할 수 있음
- Hook 피드백은 사용자 메시지처럼 처리됨
- 복잡한 로직은 별도 스크립트로 분리 권장

---

**작성일: 2025-12-20 / 글자수: 약 3,600자 / 작성자: Claude / 프롬프터: 써니**

