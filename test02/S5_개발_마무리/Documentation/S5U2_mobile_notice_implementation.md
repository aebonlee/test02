# S5U2: 모바일 배너 구현 문서

> **Task ID**: S5U2
> **Task Name**: 반응형 디자인 최적화
> **작업일**: 2025-12-25
> **작업자**: Claude Code

---

## 1. 배경

SSAL Works는 **PC 중심 서비스**입니다. 모바일에서는 기능 제한이 있으므로, 사용자에게 이를 안내하는 배너가 필요합니다.

---

## 2. 기능별 모바일 사용성 분석

### 2.1 분석 결과 요약

| 구분 | 개수 | 설명 |
|------|:---:|------|
| **가능** | 8개 | 학습용 Books, Tips, 공지사항, 알림, 프로필/구독/크레딧 조회 |
| **조회만** | 9개 | Project 열람, Order Sheet 보기, SAL Grid 보기, 가이드 읽기, 이력 조회 |
| **불가** | 10개 | Project 등록, Order Sheet 작성/복사, Claude Code 연동, Task 관리, Stage Gate, AI 문의, Sunny 문의, 보안 설정, Report 수신 |

### 2.2 상세 분석

#### 1. 프로젝트 실행 및 관리 (좌측 사이드바)

| 세부 기능 | 모바일 사용성 | 이유 |
|----------|:---:|------|
| 예시 Project 열람 | 조회만 | 읽기는 가능, 편집 불가 |
| 완료 Project 확인 | 조회만 | 읽기는 가능 |
| 진행중 Project 선택 | 조회만 | 선택은 가능, 작업은 어려움 |
| 새 Project 등록 | 불가 | 폼 입력, 설정 복잡 |
| 진행 프로세스 확인 | 조회만 | 진행률 확인만 가능 |

#### 2. Order Sheet 발행 (Control Space)

| 세부 기능 | 모바일 사용성 | 이유 |
|----------|:---:|------|
| Order Sheet 템플릿 | 조회만 | 템플릿 보기만 가능 |
| Order Sheet 작성 | 불가 | 긴 문서 편집 불가능 |
| Order Sheet 복사 | 불가 | PC에서 Claude Code로 붙여넣기 필요 |
| Claude Code 연동 | 불가 | PC 터미널 필요 |
| 결과 Report 수신 | 불가 | 로컬 파일 시스템 접근 불가 |

#### 3. PROJECT SAL GRID (중앙 하단)

| 세부 기능 | 모바일 사용성 | 이유 |
|----------|:---:|------|
| 3차원 Task 관리 | 조회만 | 보기만 가능 |
| Grid 뷰어 (2D/3D) | 조회만 | 모바일용 뷰어 별도 있음 |
| Task 상태 관리 | 불가 | 상태 변경은 PC 필요 |
| Stage Gate 검증 | 불가 | 승인 작업은 PC 필요 |

#### 4. 학습용 Books (우측 사이드바)

| 세부 기능 | 모바일 사용성 | 이유 |
|----------|:---:|------|
| 3권 80편 콘텐츠 읽기 | 가능 | 읽기 전용 |
| 콘텐츠 검색 | 가능 | 검색 가능 |

#### 5. 외부 연동 가이드 (우측 사이드바)

| 세부 기능 | 모바일 사용성 | 이유 |
|----------|:---:|------|
| 5가지 설정 가이드 읽기 | 조회만 | 읽기만 가능, 실제 설정은 PC 필요 |

#### 6. Tips (우측 사이드바)

| 세부 기능 | 모바일 사용성 | 이유 |
|----------|:---:|------|
| 54개 Tips 읽기 | 가능 | 읽기 전용 |
| Tips 검색 | 가능 | 검색 가능 |

#### 7. 다른 AI에게 묻기 (우측 사이드바)

| 세부 기능 | 모바일 사용성 | 이유 |
|----------|:---:|------|
| ChatGPT/Gemini/Perplexity 문의 | 불가 | 긴 질문 작성 어려움, 크레딧 소모 |
| 질문/답변 이력 조회 | 조회만 | 읽기만 가능 |

#### 8. Sunny에게 묻기 (우측 사이드바)

| 세부 기능 | 모바일 사용성 | 이유 |
|----------|:---:|------|
| 문의 작성 | 불가 | 긴 글 작성, 파일 첨부 어려움 |
| 답변 확인 | 조회만 | 읽기만 가능 |

#### 부가 기능

| 세부 기능 | 모바일 사용성 | 이유 |
|----------|:---:|------|
| 프로필 조회 | 가능 | |
| 구독 상태 확인 | 가능 | |
| 크레딧 잔액 확인 | 가능 | |
| 설정 변경 | 불가 | 보안 설정 등 PC 권장 |
| 공지사항 확인 | 가능 | 읽기 전용 |
| 인앱 알림 확인 | 가능 | 읽기 전용 |

---

## 3. 모바일 배너 메시지

### 3.1 확정 메시지

```
📱 모바일에서는 조회만 가능합니다. 작업은 PC에서 해주세요.
```

### 3.2 메시지 커버리지

| 메시지 | 커버하는 기능 |
|--------|-------------|
| "조회만 가능합니다" | 조회만 9개 기능 |
| "작업은 PC에서 해주세요" | 불가 10개 기능 |

---

## 4. 구현 내용

### 4.1 HTML

```html
<div class="mobile-notice">
    📱 모바일에서는 조회만 가능합니다. 작업은 PC에서 해주세요.
</div>
```

### 4.2 CSS

```css
.mobile-notice {
    display: none;
    background: linear-gradient(135deg, #FEF3C7, #FDE68A);
    color: #92400E;
    padding: 12px 16px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    position: sticky;
    top: 0;
    z-index: 999;
}

@media (max-width: 768px) {
    .mobile-notice { display: block; }
}
```

### 4.3 적용 대상 페이지

| # | 페이지 | responsive.css 상태 | 작업 내용 |
|---|--------|:---:|------|
| 1 | index.html | 주석처리 | HTML + 인라인 CSS |
| 2 | admin-dashboard.html | 연결됨 | HTML만 |
| 3 | viewer.html | 연결됨 | HTML만 |
| 4 | manual.html | 연결됨 | HTML만 |
| 5 | login.html | 연결됨 | HTML만 |
| 6 | signup.html | 연결됨 | HTML만 |
| 7 | reset-password.html | 연결됨 | HTML만 |
| 8 | books-viewer.html | 연결됨 | HTML만 |
| 9 | learning-viewer.html | 연결됨 | HTML만 |
| 10 | tips-viewer.html | 연결됨 | HTML만 |

---

## 5. 참고 문서

- 기능 목록: `P2_프로젝트_기획/Service_Introduction/빌더_계정_개설자에게_제공하는_기능.md`
- 모바일 체크리스트: `Human_ClaudeCode_Bridge/Reports/Mobile_Optimization_Checklist.md`
- Task Instruction: `S0_Project-SAL-Grid_생성/sal-grid/task-instructions/S5U2_instruction.md`

---

*문서 작성: 2025-12-25*
