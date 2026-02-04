# Welcome 템플릿 시스템 설계

## 📋 목적

사용자 상태에 따라 다른 환영 메시지 및 가이드를 보여주는 시스템

---

## 🎯 4가지 사용자 상태별 템플릿

### 1. signup_welcome (회원가입 완료 시)

**트리거**: 회원가입 완료 직후

**주요 내용**:
- 환영 메시지
- 첫 프로젝트 만들기 가이드
- 프로젝트 생성 후 플로우 설명
- 도움 리소스 안내

**CTA**: "+ 새 프로젝트 만들기" 버튼

---

### 2. login_welcome (로그인 시)

**트리거**: 로그인 완료 시

**주요 내용**:
- 재방문 환영 메시지
- 현재 프로젝트 상태 요약
- 대기 중인 작업 개수
- 오늘의 할 일 목록
- 빠른 액션 링크

**동적 데이터**:
- `{current_project_status}`: 현재 프로젝트 진행 상황
- `{pending_orders_count}`: 대기 중인 Order 개수
- `{today_tasks}`: 오늘 할 일 목록

---

### 3. refresh_current (프로젝트 진행 중 새로고침)

**트리거**: 프로젝트가 활성화된 상태에서 새로고침

**주요 내용**:
- 현재 프로젝트 상태
- Inbox 상태 (새로 도착한 작업 결과)
- 대기 중인 Order 목록
- 다음 단계 제안
- 빠른 액션 링크

**동적 데이터**:
- `{project_name}`: 프로젝트 이름
- `{progress}`: 진행률 (%)
- `{current_phase}`: 현재 Phase
- `{inbox_status}`: Inbox 상태
- `{pending_orders}`: 대기 중인 Order 목록
- `{next_steps}`: 다음 단계 제안
- `{current_work}`: 현재 작업 중인 내용

---

### 4. project_created (새 프로젝트 생성 완료 시)

**트리거**: 새 프로젝트 생성 완료 직후

**주요 내용**:
- 프로젝트 생성 축하 메시지
- 프로젝트 정보 요약
- 전체 Phase 구조 소개
- 추천 시작 단계
- Order 작성 방법 상세 가이드
- 작업 플로우 다이어그램
- 유용한 리소스 안내

**동적 데이터**:
- `{project_name}`: 프로젝트 이름
- `{project_description}`: 프로젝트 설명
- `{created_at}`: 생성 일시

**CTA**: 좌측 사이드바 단계 클릭 유도

---

## 🔧 구현 방법

### 1. 템플릿 파일

**파일명**: `Web_ClaudeCode_Bridge/welcome_templates.json`

**구조**:
```json
{
  "signup_welcome": {
    "name": "회원가입 환영 템플릿",
    "trigger": "회원가입 완료 시",
    "template": "마크다운 템플릿 내용..."
  },
  "login_welcome": { ... },
  "refresh_current": { ... },
  "project_created": { ... }
}
```

### 2. API 엔드포인트

#### 전체 템플릿 조회
```
GET http://localhost:3030/welcome-templates
```

**응답**:
```json
{
  "success": true,
  "templates": { ... }
}
```

#### 특정 템플릿 조회
```
GET http://localhost:3030/welcome-template/:type
```

**예시**:
- `GET /welcome-template/signup_welcome`
- `GET /welcome-template/login_welcome`
- `GET /welcome-template/refresh_current`
- `GET /welcome-template/project_created`

**응답**:
```json
{
  "success": true,
  "template": {
    "name": "회원가입 환영 템플릿",
    "trigger": "회원가입 완료 시",
    "template": "마크다운 내용..."
  }
}
```

### 3. Dashboard 통합 방법

#### JavaScript 로직 (dashboard-mockup.html)

```javascript
// 페이지 로드 시 사용자 상태 확인
window.addEventListener('DOMContentLoaded', async () => {
    const userState = getUserState(); // 'signup', 'login', 'refresh', 'project_created'
    await loadWelcomeTemplate(userState);
});

// Welcome 템플릿 로드 함수
async function loadWelcomeTemplate(state) {
    const typeMap = {
        'signup': 'signup_welcome',
        'login': 'login_welcome',
        'refresh': 'refresh_current',
        'project_created': 'project_created'
    };

    const type = typeMap[state];

    try {
        const response = await fetch(`http://localhost:3030/welcome-template/${type}`);
        const data = await response.json();

        if (data.success) {
            let template = data.template.template;

            // 동적 데이터 치환
            template = replaceDynamicData(template, state);

            // Editor에 표시
            document.getElementById('editor').value = template;
        }
    } catch (error) {
        console.error('Welcome 템플릿 로드 실패:', error);
    }
}

// 동적 데이터 치환 함수
function replaceDynamicData(template, state) {
    if (state === 'login') {
        template = template.replace('{current_project_status}', getCurrentProjectStatus());
        template = template.replace('{pending_orders_count}', getPendingOrdersCount());
        template = template.replace('{today_tasks}', getTodayTasks());
    } else if (state === 'refresh') {
        template = template.replace('{project_name}', getProjectName());
        template = template.replace('{progress}', getProgress());
        template = template.replace('{current_phase}', getCurrentPhase());
        template = template.replace('{inbox_status}', getInboxStatus());
        template = template.replace('{pending_orders}', getPendingOrders());
        template = template.replace('{next_steps}', getNextSteps());
        template = template.replace('{current_work}', getCurrentWork());
    } else if (state === 'project_created') {
        template = template.replace('{project_name}', getProjectName());
        template = template.replace('{project_description}', getProjectDescription());
        template = template.replace('{created_at}', new Date().toLocaleString('ko-KR'));
    }

    return template;
}

// 사용자 상태 판별 함수
function getUserState() {
    // localStorage나 sessionStorage에서 상태 확인
    const isNewUser = localStorage.getItem('is_new_user') === 'true';
    const hasProject = localStorage.getItem('current_project') !== null;
    const justCreatedProject = sessionStorage.getItem('just_created_project') === 'true';

    if (isNewUser) {
        localStorage.removeItem('is_new_user');
        return 'signup';
    } else if (justCreatedProject) {
        sessionStorage.removeItem('just_created_project');
        return 'project_created';
    } else if (hasProject) {
        return 'refresh';
    } else {
        return 'login';
    }
}
```

#### 상태 저장 시점

**회원가입 시**:
```javascript
// 회원가입 성공 시
function onSignupSuccess() {
    localStorage.setItem('is_new_user', 'true');
    window.location.reload();
}
```

**로그인 시**:
```javascript
// 로그인 성공 시
function onLoginSuccess() {
    // 특별한 플래그 없음 (기본 상태)
    window.location.reload();
}
```

**프로젝트 생성 시**:
```javascript
// 프로젝트 생성 성공 시
function onProjectCreated(projectData) {
    localStorage.setItem('current_project', JSON.stringify(projectData));
    sessionStorage.setItem('just_created_project', 'true');
    window.location.reload();
}
```

**새로고침 시**:
```javascript
// 페이지 로드 시 자동 판별
// localStorage에 current_project가 있으면 'refresh' 상태
```

---

## 📊 상태 전환 다이어그램

```
[회원가입] → signup_welcome → [프로젝트 생성] → project_created
                                        ↓
[로그인] → login_welcome ← [새로고침] ← refresh_current
            ↓                              ↑
       [프로젝트 없음]              [프로젝트 있음]
```

---

## 🎨 UI/UX 고려사항

### 1. 템플릿 표시 위치
- **중앙 Editor 영역**에 마크다운 형식으로 표시
- 읽기 전용 또는 수정 가능하도록 설정

### 2. CTA (Call-to-Action) 버튼
- 템플릿 하단에 명확한 다음 단계 버튼
- 예: "[+ 새 프로젝트 만들기]", "[Order 작성하기]"

### 3. 자동 닫기
- 사용자가 사이드바 항목을 클릭하면 자동으로 템플릿 닫기
- 또는 "닫기" 버튼 제공

### 4. 재표시 방지
- 각 템플릿은 세션당 1회만 표시
- sessionStorage 활용하여 중복 표시 방지

---

## 🔄 동적 데이터 수집 함수 예시

```javascript
// 현재 프로젝트 상태
function getCurrentProjectStatus() {
    const project = JSON.parse(localStorage.getItem('current_project') || '{}');
    if (!project.name) return '진행 중인 프로젝트가 없습니다.';
    return `**${project.name}** (진행률: ${project.progress || 0}%)`;
}

// 대기 중인 Order 개수
function getPendingOrdersCount() {
    // API 호출 또는 localStorage에서 가져오기
    return 3;
}

// 오늘의 할 일
function getTodayTasks() {
    // API 호출 또는 localStorage에서 가져오기
    return `- Phase 1: 디렉토리 구조 검토\n- Phase 2: Docker 설정 완료 확인`;
}

// Inbox 상태
function getInboxStatus() {
    // API 호출: GET /outbox/files
    return `📥 **3개의 새 결과**가 도착했습니다!`;
}

// 대기 중인 Order 목록
function getPendingOrders() {
    return `1. **Phase 1 > 디렉토리 구조** - 대기 중\n2. **Phase 2 > Docker 설정** - 진행 중`;
}

// 다음 단계
function getNextSteps() {
    return `1. Inbox의 작업 결과 확인\n2. Phase 1 완료 검증\n3. Phase 2 시작`;
}

// 현재 작업
function getCurrentWork() {
    return `Phase 1 > 디렉토리 구조 설계`;
}
```

---

## ✅ 완료 체크리스트

- [x] welcome_templates.json 파일 생성
- [x] 4가지 템플릿 작성 완료
  - [x] signup_welcome
  - [x] login_welcome
  - [x] refresh_current
  - [x] project_created
- [x] inbox_server.js에 API 엔드포인트 추가
  - [x] GET /welcome-templates
  - [x] GET /welcome-template/:type
- [x] 서버 시작 메시지에 엔드포인트 추가
- [ ] Dashboard HTML에 JavaScript 로직 추가 (다음 단계)
- [ ] 동적 데이터 수집 함수 구현 (다음 단계)
- [ ] 상태 저장/복원 로직 구현 (다음 단계)
- [ ] UI/UX 테스트 (다음 단계)

---

## 📝 다음 작업

Dashboard HTML 파일에 다음 기능 추가:

1. **페이지 로드 시 사용자 상태 판별**
2. **해당 상태의 Welcome 템플릿 로드**
3. **동적 데이터 치환**
4. **Editor에 표시**
5. **상태 전환 로직 구현**

---

## 🔗 관련 파일

- `Web_ClaudeCode_Bridge/welcome_templates.json` - 템플릿 데이터
- `Web_ClaudeCode_Bridge/inbox_server.js` - API 서버 (수정 완료)
- `1_기획/1-3_UI_UX_Design/Mockup/dashboard-mockup.html` - Dashboard (수정 필요)
