# Claude Code 설치 방법 (완전 초보자용)

> 컴퓨터를 처음 다루는 분도 이 안내만 따라하면 Claude Code를 설치할 수 있습니다.

---

## 설치 순서 (반드시 이 순서대로!)

```
1. Node.js 설치
      ↓
2. Git 설치
      ↓
3. Claude Code 설치
```

**왜 이 순서인가요?**
- Node.js: Claude Code가 실행되는 환경 (필수)
- Git: 코드 버전 관리 도구 (필수)
- 둘 다 먼저 설치해야 Claude Code가 작동합니다

---

## Step 1: Node.js 설치

### 1-1. Node.js 다운로드

1. 인터넷 브라우저(크롬, 엣지 등)를 엽니다
2. 주소창에 `nodejs.org` 입력하고 Enter
3. **초록색 "Get Node.js®" 버튼** 클릭하여 다운로드
   - 파일명 예시: `node-v22.xx.x-x64.msi`

### 1-2. Node.js 설치

1. 다운로드된 파일을 더블클릭
2. 설치 마법사가 열리면 **"Next"** 계속 클릭
3. **"Install"** 클릭
4. 설치 완료되면 **"Finish"** 클릭

> **설치 위치는 건드리지 마세요!** 자동으로 `C:\Program Files\nodejs\`에 설치됩니다. 모든 설정은 기본값 그대로 Next만 누르면 됩니다.

### 1-3. 설치 확인 (명령 프롬프트에서)

**명령 프롬프트(CMD) 여는 방법:**

1. 키보드에서 **Windows 키** 누르기 (키보드 왼쪽 아래 창문 모양)
2. `cmd` 입력
3. **"명령 프롬프트"** 클릭

**확인 명령어 입력:**

검은 화면이 열리면 아래 명령어를 입력하고 Enter:

```
node --version
```

**성공 시 결과:** `v20.x.x` 같은 버전 번호가 나옴

```
npm --version
```

**성공 시 결과:** `10.x.x` 같은 버전 번호가 나옴

---

## Step 2: Git 설치

### 2-1. Git 다운로드

1. 브라우저에서 `git-scm.com` 접속
2. 큰 **"Download for Windows"** 버튼 클릭
3. 파일이 자동으로 다운로드됨

### 2-2. Git 설치

1. 다운로드된 파일 더블클릭
2. **"Next"** 계속 클릭
3. **중요!** "Adjusting your PATH environment" 화면에서:
   - **"Git from the command line and also from 3rd-party software"** 선택 (기본값)
   - 이게 선택되어 있어야 CMD에서 git 명령어가 작동합니다
   - **Claude Code가 Git Bash를 사용하므로 이 설정이 필수입니다**
4. 나머지는 **"Next"** 계속 클릭 (모두 기본값 그대로)
5. **"Install"** 클릭
6. 완료되면 **"Finish"** 클릭

> **설치 위치는 건드리지 마세요!** 자동으로 `C:\Program Files\Git\`에 설치됩니다.
>
> **참고:** 마지막 화면의 "Launch Git Bash" 체크박스는 체크 안 해도 됩니다. 이건 설치 후 Git Bash를 바로 열어주는 것일 뿐, Claude Code 작동과 무관합니다.

### 2-3. 설치 확인

1. **기존 CMD 창을 닫고** 새로 열기 (중요!)
   - Windows 키 → `cmd` → Enter
2. 아래 명령어 입력:

```
git --version
```

**성공 시 결과:** `git version 2.x.x` 같은 버전 정보가 나옴

---

## Step 3: Claude Code 설치

### 3-1. 명령 프롬프트 열기

1. Windows 키 누르기
2. `cmd` 입력
3. **"명령 프롬프트"** 클릭

### 3-2. Claude Code 설치 명령어 실행

아래 명령어를 **복사**해서 CMD에 **붙여넣기**:

```
npm install -g @anthropic-ai/claude-code
```

**복사/붙여넣기 방법:**
1. 위 명령어를 마우스로 드래그해서 선택
2. Ctrl + C (복사)
3. CMD 창에서 **마우스 오른쪽 클릭** (붙여넣기됨)
4. Enter 누르기

**설치 중:** 여러 줄의 텍스트가 나오면서 설치 진행 (1~2분 소요)

### 3-3. 설치 확인

설치가 끝나면 아래 명령어로 확인:

```
claude --version
```

**성공 시 결과:** `1.x.x` 같은 버전 번호가 나옴

---

## Claude Code 처음 실행하기 (설치 직후)

설치할 때 사용한 CMD 창에서 바로 실행합니다.

1. 작업할 폴더로 이동 (cd 명령어 사용):

```
cd C:\Projects\내프로젝트
```

> **cd란?** change directory의 약자. 폴더를 이동하는 명령어입니다.

2. Claude Code 실행:

```
claude
```

3. Enter 누르기

**폴더 경로 쉽게 복사하는 방법:**
1. 파일 탐색기에서 원하는 폴더 열기
2. 주소창 클릭 (폴더 경로가 선택됨)
3. Ctrl + C로 복사
4. CMD에서 `cd ` 입력 후 마우스 오른쪽 클릭 (붙여넣기)

---

## 두 번째 실행부터 (폴더에서 바로)

다음부터는 폴더에서 바로 터미널을 열 수 있습니다.

1. 파일 탐색기에서 작업할 폴더를 **마우스 오른쪽 클릭**
2. **"터미널에서 열기"** 클릭 (Windows 11)
   - Windows 10: **"PowerShell 창 열기"**
3. `claude` 입력 후 Enter

### 처음 실행 시 로그인

1. 자동으로 브라우저가 열림
2. Anthropic 계정으로 로그인
3. 로그인 완료 후 터미널로 돌아오면 사용 가능!

**필요한 구독:**
- Claude Pro ($20/월) 또는 Claude Max ($100/월)
- 또는 Anthropic API 키 + 크레딧 충전

### 로그인 후 첫 번째로 할 일

Claude Code가 실행되면 아래와 같이 입력하세요:

```
개발 환경 확인해 줘
```

Claude Code가 현재 컴퓨터의 개발 환경(Node.js, Git, npm 등)이 제대로 설치되어 있는지 자동으로 확인해줍니다.

---

## 흔한 오류와 해결 방법

### 오류 1: 'node'를 찾을 수 없습니다

```
'node'은(는) 내부 또는 외부 명령... 이 아닙니다
```

**해결:**
1. CMD 창 닫기
2. 컴퓨터 재시작
3. 다시 CMD 열고 `node --version` 확인
4. 안 되면 Node.js 재설치

---

### 오류 2: 'git'을 찾을 수 없습니다

```
'git'은(는) 내부 또는 외부 명령... 이 아닙니다
```

**해결:**
1. CMD 창 닫기
2. 새 CMD 창 열기
3. 다시 `git --version` 확인
4. 안 되면 Git 재설치 (PATH 설정 확인!)

---

### 오류 2-1: Claude Code가 Git Bash를 찾지 못합니다

Claude Code 실행 시 Git Bash 관련 오류가 나오면:

**해결 방법 1: Git 재설치**
- Git을 다시 설치하면서 "Git from the command line and also from 3rd-party software" 옵션 선택

**해결 방법 2: 환경변수 직접 설정**
1. Windows 키 → "환경 변수" 검색 → "시스템 환경 변수 편집" 클릭
2. "환경 변수" 버튼 클릭
3. "사용자 변수"에서 "새로 만들기" 클릭
4. 변수 이름: `CLAUDE_CODE_GIT_BASH_PATH`
5. 변수 값: `C:\Program Files\Git\bin\bash.exe`
6. 확인 → CMD 창 다시 열기

---

### 오류 3: npm 권한 오류

```
Error: EPERM: operation not permitted
```

**해결:**
1. CMD 창 닫기
2. Windows 키 → `cmd` 입력
3. **"관리자 권한으로 실행"** 클릭 (마우스 오른쪽 버튼으로 선택)
4. 다시 설치 명령어 실행:

```
npm install -g @anthropic-ai/claude-code
```

---

### 오류 4: 'claude'를 찾을 수 없습니다

```
'claude'은(는) 내부 또는 외부 명령... 이 아닙니다
```

**해결:**
1. CMD 창 완전히 닫기
2. 새 CMD 창 열기
3. 다시 `claude --version` 확인
4. 안 되면 아래 명령어로 실행:

```
npx @anthropic-ai/claude-code
```

---

### 오류 5: Node.js 버전이 낮습니다

```
Error: Node.js version must be >= 18
```

**해결:**
1. `nodejs.org`에서 최신 LTS 버전 다운로드
2. 기존 버전 위에 덮어쓰기 설치
3. CMD 재시작 후 `node --version`으로 확인

---

### 오류 6: Claude Code가 아무 반응 없이 종료됨 (Node.js 버전이 너무 높음)

**증상:**
- `claude` 명령어 실행 시 아무 반응 없이 바로 종료됨
- `claude --version`은 정상 출력됨
- `claude --help`도 정상 출력됨
- `claude login` 등 모든 명령어가 무반응

**원인:** Node.js 버전이 너무 최신 (v24 이상) - Claude Code와 호환성 문제

**해결:**

1. 기존 Node.js 제거
   - Windows 키 → "앱 및 기능" 검색 → Node.js 찾아서 제거

2. PC 재시작

3. Node.js LTS 버전 설치
   - `nodejs.org` 접속
   - **22.x LTS** (왼쪽 초록 버튼) 다운로드
   - 설치 (기본 설정으로 진행)

4. 확인 및 실행

```
node --version
```

`v22.x.x`가 나오면 정상. 다시 `claude` 실행하면 작동합니다.

> **핵심:** Node.js는 반드시 **LTS 버전 (v20 또는 v22)** 사용! 최신 버전(v24+)은 호환성 문제가 발생할 수 있습니다.

---

## 업데이트 방법

Claude Code를 최신 버전으로 업데이트하려면:

```
npm update -g @anthropic-ai/claude-code
```

---

## 제거 방법

Claude Code를 삭제하려면:

```
npm uninstall -g @anthropic-ai/claude-code
```

---

## 문제가 계속될 때

모든 것을 처음부터 다시 설치:

1. Node.js 완전 제거
   - 제어판 → 프로그램 제거 → Node.js 선택 → 제거
2. Git 완전 제거
   - 제어판 → 프로그램 제거 → Git 선택 → 제거
3. 컴퓨터 재시작
4. Step 1부터 다시 시작

---

*관련 문서: `02_Claude_Code_설치_전에_Node.js와_Git을_설치하는_이유.md`*
