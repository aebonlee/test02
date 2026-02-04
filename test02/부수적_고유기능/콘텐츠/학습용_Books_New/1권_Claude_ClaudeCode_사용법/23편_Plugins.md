# 23편 | Plugins

---

Claude Code는 여러 기능을 하나로 묶은 Plugin을 지원한다. Commands, Skills, Hooks 등을 패키지로 만들어 설치하고 공유할 수 있다. 이 편에서는 Plugin의 개념과 활용법을 살펴본다.

## 1. Plugins 개요

### 1-1 Plugins란

Plugin은 Claude Code의 기능을 확장하는 패키지이다. 여러 구성 요소를 하나로 묶어서 배포한다.

```
Plugin
├── Commands (슬래시 명령어)
├── Skills (전문 기능)
├── Hooks (이벤트 처리)
└── 설정 파일
```

### 1-2 Plugin vs MCP 차이

| 구분 | Plugin | MCP |
|------|--------|-----|
| 목적 | 내부 기능 확장 | 외부 서비스 연결 |
| 구성 | Commands, Skills, Hooks | 외부 서버 연동 |
| 실행 | Claude Code 내부 | 별도 프로세스 |
| 예시 | 코드 리뷰 패키지 | 데이터베이스 연결 |

**Plugin:** Claude Code 자체의 기능을 확장
**MCP:** 외부 서비스와 연결

### 1-3 Plugin 구성 요소

Plugin에 포함할 수 있는 요소:

| 요소 | 설명 | 위치 |
|------|------|------|
| Commands | 슬래시 명령어 | commands/ |
| Skills | 전문 처리 기능 | skills/ |
| Hooks | 이벤트 처리 | hooks/ |
| Subagents | 전문 에이전트 | subagents/ |
| 설정 | 기본 설정값 | manifest.json |

## 2. Plugin 설치

### 2-1 /plugin 명령어

Plugin을 관리하는 명령어이다.

```
/plugin
→ Plugin 관리 메뉴 표시
```

**주요 옵션:**
- 설치된 Plugin 목록
- 새 Plugin 설치
- Plugin 활성화/비활성화
- Plugin 제거

### 2-2 설치 방법

**npm 패키지로 설치:**
```
/plugin install @username/plugin-name
```

**로컬 경로에서 설치:**
```
/plugin install ./my-plugin
```

**GitHub에서 설치:**
```
/plugin install github:username/repo
```

### 2-3 활성화/비활성화

**활성화:**
```
/plugin enable plugin-name
```

**비활성화:**
```
/plugin disable plugin-name
```

**제거:**
```
/plugin uninstall plugin-name
```

## 3. Plugin 구조

### 3-1 매니페스트 파일

Plugin의 정보를 정의하는 manifest.json 파일이다.

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "플러그인 설명",
  "author": "작성자",
  "commands": ["commands/"],
  "skills": ["skills/"],
  "hooks": ["hooks/"],
  "subagents": ["subagents/"]
}
```

### 3-2 포함 가능한 요소

**Commands:**
```
plugin/
└── commands/
    ├── review.md
    ├── test.md
    └── deploy.md
```

**Skills:**
```
plugin/
└── skills/
    ├── code-analysis.md
    └── doc-generator.md
```

**Hooks:**
```
plugin/
└── hooks/
    └── settings.json
```

**Subagents:**
```
plugin/
└── subagents/
    ├── reviewer.md
    └── tester.md
```

### 3-3 디렉토리 구조

**완전한 Plugin 구조:**
```
my-plugin/
├── manifest.json          # 플러그인 정보
├── README.md              # 사용 설명서
├── commands/              # 슬래시 명령어
│   ├── review.md
│   └── test.md
├── skills/                # 전문 기능
│   └── analysis.md
├── hooks/                 # 이벤트 처리
│   └── settings.json
└── subagents/             # 전문 에이전트
    └── reviewer.md
```

## 4. Plugin 만들기

### 4-1 기본 구조 생성

**1단계: 폴더 생성**
```
mkdir my-plugin
cd my-plugin
```

**2단계: manifest.json 작성**
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "나만의 플러그인",
  "author": "작성자명",
  "commands": ["commands/"],
  "skills": ["skills/"]
}
```

**3단계: 폴더 구조 생성**
```
mkdir commands skills
```

### 4-2 Commands 추가

commands/ 폴더에 마크다운 파일을 추가한다.

**commands/review.md:**
```markdown
# review

코드를 리뷰하고 피드백을 제공합니다.

## 실행 작업
1. 변경된 파일 확인
2. 코드 품질 분석
3. 보안 취약점 검토
4. 개선 제안 작성

## 출력 형식
- 요약
- 문제점
- 제안사항
```

**commands/test.md:**
```markdown
# test

테스트를 실행하고 결과를 보고합니다.

## 실행 작업
1. 테스트 파일 탐색
2. 테스트 실행
3. 결과 분석
4. 리포트 생성
```

### 4-3 Skills 추가

skills/ 폴더에 마크다운 파일을 추가한다.

**skills/code-analysis.md:**
```markdown
# code-analysis

코드를 분석하는 전문 Skill입니다.

## 활성화 조건
- 코드 파일 분석 요청
- "분석", "검토" 키워드 포함

## 분석 항목
- 코드 구조
- 복잡도
- 의존성
- 모범 사례 준수

## 출력 형식
- 분석 요약
- 상세 결과
- 개선 권장사항
```

### 4-4 배포 방법

**npm으로 배포:**
```bash
npm init
npm publish
```

**GitHub으로 공유:**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

**로컬에서 사용:**
```
/plugin install ./my-plugin
```

## 5. 정리

### Plugin 구성 요약

| 파일/폴더 | 용도 |
|-----------|------|
| manifest.json | 플러그인 정보 정의 |
| commands/ | 슬래시 명령어 |
| skills/ | 전문 처리 기능 |
| hooks/ | 이벤트 처리 설정 |
| subagents/ | 전문 에이전트 |

### MCP와 비교

| 구분 | Plugin | MCP |
|------|--------|-----|
| 용도 | 내부 기능 확장 | 외부 연결 |
| 구성 | md 파일들 | 서버 프로그램 |
| 설치 | /plugin install | settings.json |
| 예시 | 코드 리뷰 도구 | DB 연결 |

### Plugin 활용 팁

- 반복 작업은 Commands로 만들기
- 전문 처리는 Skills로 만들기
- 자동화는 Hooks로 설정
- 복잡한 작업은 Subagents 활용
- 팀과 공유하려면 npm/GitHub 배포

---

**작성일: 2025-12-20 / 글자수: 약 3,200자 / 작성자: Claude / 프롬프터: 써니**

