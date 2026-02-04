# /status 명령어로 모든 것 확인하기

> Claude Code 사용 중 모델, 설정, 사용량, 시스템 상태를 한눈에 확인하는 방법입니다.

---

## /status 명령어 실행

```
> /status
```

Tab 키로 3개 탭 전환 가능:
- **Status** - 현재 상태
- **Config** - 설정값
- **Usage** - 사용량

---

# 1. Status 탭 - 현재 상태

## 기본 정보

| 항목 | 설명 | 예시 |
|------|------|------|
| **Version** | Claude Code 버전 | 2.0.69 |
| **Session ID** | 현재 세션 고유 ID | a1874647-b40a-... |
| **cwd** | 작업 중인 폴더 | C:\Projects\MyApp |
| **Login method** | 로그인 방식 | Claude Max Account |
| **Organization** | 소속 조직 | My Organization |
| **Email** | 로그인 이메일 | user@email.com |

## Model - 사용 중인 모델

| 항목 | 설명 |
|------|------|
| **Model** | 현재 모델 (opus / sonnet) |

**확인 포인트:**
- 원하는 모델로 작업 중인지 확인
- opus는 더 똑똑하지만 사용량 소모 큼
- sonnet은 가볍고 빠름

## Memory - 로드된 파일

| 항목 | 설명 |
|------|------|
| **project** | 프로젝트에서 로드된 파일들 |

**로드되는 파일 예시:**
```
CLAUDE.md
.claude/rules/01_file-naming.md
.claude/rules/02_save-location.md
...
```

**확인 포인트:**
- CLAUDE.md가 제대로 로드되었는지
- rules 파일들이 인식되었는지

## System Diagnostics - 시스템 진단

| 경고 | 의미 | 해결 |
|------|------|------|
| ⚠️ Large CLAUDE.md | CLAUDE.md가 40K 초과 | 파일 분리 또는 정리 |

**확인 포인트:**
- 경고가 있으면 성능에 영향 줄 수 있음
- CLAUDE.md가 너무 크면 rules 폴더로 분리

---

# 2. Config 탭 - 설정 확인

Enter/Space로 설정값 변경 가능

## 주요 설정 항목

| 설정 | 설명 | 기본값 |
|------|------|--------|
| **Auto-compact** | 컨텍스트 자동 압축 | true |
| **Show tips** | 팁 표시 여부 | true |
| **Thinking mode** | 사고 과정 표시 | true |
| **Rewind code** | 코드 되돌리기(체크포인트) | true |
| **Verbose output** | 상세 출력 | false |
| **Terminal progress bar** | 진행률 표시 | Default |

## 외관 설정

| 설정 | 설명 | 옵션 |
|------|------|------|
| **Theme** | 테마 | Dark mode / Light mode |
| **Output style** | 출력 스타일 | default |
| **Editor mode** | 에디터 모드 | normal |

## 모델 설정

| 설정 | 설명 | 옵션 |
|------|------|------|
| **Model** | 사용 모델 | opus / sonnet |
| **Default permission mode** | 기본 권한 모드 | Default |

## 연동 설정

| 설정 | 설명 | 기본값 |
|------|------|--------|
| **Respect .gitignore** | .gitignore 파일 존중 | true |
| **Notifications** | 알림 | Auto |
| **Auto-connect to IDE** | IDE 자동 연결 | false |
| **Use custom API key** | 커스텀 API 키 | false |

---

# 3. Usage 탭 - 사용량 확인

## 사용량 항목

| 항목 | 의미 |
|------|------|
| **Current session** | 현재 세션 사용량 (%) |
| **Current week (all models)** | 주간 전체 모델 사용량 |
| **Current week (Sonnet only)** | 주간 Sonnet만 사용량 |
| **Resets** | 리셋 시간 (Asia/Seoul) |

**예시:**
```
Current session           100% used
Current week (all models)  42% used
  Resets Dec 28, 2am (Asia/Seoul)
Current week (Sonnet only)  4% used
  Resets Dec 28, 11am (Asia/Seoul)
```

## Extra usage

| 상태 | 의미 |
|------|------|
| Extra usage not enabled | 추가 사용량 비활성화 |
| `/extra-usage to enable` | 활성화 명령어 안내 |

---

# 4. /extra-usage - 한도 초과 대응

주간 한도 초과 시:

```
> /extra-usage
```

| 로그인 옵션 | 대상 |
|------------|------|
| Claude account with subscription | Pro, Max, Team, Enterprise |
| Anthropic Console account | API 과금 사용자 |

---

# 5. 상황별 확인 가이드

## 세션 시작할 때

| 확인 | 탭 | 이유 |
|------|-----|------|
| Model | Status | 원하는 모델인지 |
| Memory | Status | CLAUDE.md 로드 여부 |
| Diagnostics | Status | 경고 있는지 |

## 작업 중간에

| 확인 | 탭 | 이유 |
|------|-----|------|
| Current session | Usage | 세션 사용량 |
| Thinking mode | Config | 사고 모드 on/off |

## 속도가 느려질 때

| 확인 | 탭 | 이유 |
|------|-----|------|
| Current session | Usage | 100% 근접 여부 |
| Auto-compact | Config | 자동 압축 켜져있는지 |
| System Diagnostics | Status | 경고 있는지 |

## 한도 걱정될 때

| 확인 | 탭 | 이유 |
|------|-----|------|
| Current week | Usage | 주간 사용량 |
| Resets | Usage | 리셋 시간 |
| Extra usage | Usage | 추가 사용량 가능 여부 |

---

# 6. 토큰 절약 팁

## 토큰이란

| 언어 | 환산 |
|------|------|
| 영어 | 1단어 ≈ 1토큰 |
| 한글 | 1글자 ≈ 2~3토큰 |

## 토큰 많이 쓰는 작업

| 작업 | 소모량 |
|------|--------|
| 대용량 파일 읽기 | 높음 |
| 전체 코드베이스 검색 | 높음 |
| 긴 대화 유지 | 누적 |
| 반복 수정 요청 | 높음 |

## 절약하는 방법

```
❌ "전체 코드 읽어줘"
✅ "src/auth/login.js만 읽어줘"

❌ "어딘가에 버그가 있어"
✅ "login 함수에서 null 에러가 나"
```

---

# 요약

| 명령어 | 용도 |
|--------|------|
| `/status` | 모델, 설정, 사용량, 시스템 상태 확인 |
| `/extra-usage` | 추가 사용량 활성화 |

| 탭 | 확인 내용 |
|----|----------|
| Status | 버전, 모델, 메모리, 진단 |
| Config | 설정값 확인/변경 |
| Usage | 세션/주간 사용량, 리셋 시간 |

**습관:** 세션 시작 시 `/status`로 상태 점검!

---

*작성일: 2025-12-22*
