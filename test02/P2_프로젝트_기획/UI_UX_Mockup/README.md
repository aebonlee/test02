# UI/UX Mockup 폴더

> **업데이트**: 2025-12-02
> **목적**: UI/UX 설계 산출물 관리

---

## 📁 폴더 구조

```
1-6_UI_UX_Mockup/
├── README.md (이 파일)               ← 폴더 설명서
├── Wireframes/                      ← 와이어프레임 (화면 배치 설계도)
│   └── home_screen_wireframe.md    (작성 예정)
├── Mockups/                         ← 목업 (HTML 시각적 샘플)
│   ├── dashboard-mockup.html
│   ├── admin-dashboard.html
│   └── manual.html
├── Design_Specs/                    ← 디자인 명세 (개발자 인계용)
│   └── website_layout_structure.md
└── ADMIN_DASHBOARD_설계.md          ← 관리자 대시보드 종합 설계서
```

---

## 📋 각 폴더의 역할

### Wireframes/ (와이어프레임)
**목적**: 화면 배치 설계도 작성

**내용**:
- 저해상도 화면 구조도
- 각 영역의 크기 비율
- UI 요소 배치
- 사용자 동선

**언제 만드나**:
- 기획 단계 초기
- Mockup 제작 전

**누가 보나**:
- 기획자
- 디자이너
- 개발팀 (초기 구조 파악)

**예시**:
```
┌─────────────┬───────────────┬─────────────┐
│  좌측       │    중앙       │   우측      │
│ 사이드바    │  워크스페이스  │  사이드바   │
│ (20%)       │   (60%)       │  (20%)      │
└─────────────┴───────────────┴─────────────┘
```

---

### Mockups/ (목업)
**목적**: 시각적 샘플 제작 (HTML)

**내용**:
- HTML/CSS로 만든 고해상도 화면
- 실제 디자인 적용
- 색상, 폰트, 레이아웃 포함
- 일부 인터랙션 포함 가능

**언제 만드나**:
- Wireframe 완성 후
- 디자인 시스템 정의 후

**누가 보나**:
- 클라이언트 (검토용)
- 디자이너 (시각적 확인)
- 개발팀 (구현 참고)

**차이점**:
- Mockup ≠ Prototype
- Mockup: 시각적 샘플 (정적)
- Prototype: 실제 작동 (동적, DB 연동)

---

### Design_Specs/ (디자인 명세)
**목적**: 개발자 인계용 기술 명세서

**내용**:
- HTML 구조 (태그, 클래스명)
- CSS 스타일 (구체적 수치)
- JavaScript 함수명
- 컴포넌트 파일 경로
- 데이터 흐름

**언제 만드나**:
- Mockup 완성 후
- 개발팀 인계 전

**누가 보나**:
- 프론트엔드 개발자
- 백엔드 개발자 (구조 파악용)

**예시**:
```javascript
// 좌측 사이드바 구조
<div class="left-sidebar" style="width: 20%">
  <section class="process-section">
    <div class="progress-bar">
      <div class="progress-fill" style="width: 80%"></div>
    </div>
  </section>
</div>
```

---

## 🔄 작업 순서 (업계 표준)

```
1. Wireframes    → 화면 배치 설계
         ↓
2. Mockups       → 시각적 샘플 제작
         ↓
3. Design_Specs  → 개발팀 인계 명세 작성
         ↓
4. Prototype     → 실제 개발 (P3_프로토타입_제작/ 폴더)
```

---

## 📝 특별한 파일

### ADMIN_DASHBOARD_설계.md (루트에 위치)
**목적**: 관리자 대시보드 종합 설계서

**왜 하위 폴더에 넣지 않았나**:
- 기능 요구사항 + 와이어프레임 + 디자인 명세 모두 포함
- 하나의 독립적인 서브 프로젝트
- 한 곳에 모아두는 게 편함

**내용**:
- 1. 핵심 기능 (Requirements)
- 2. 화면 구성 (Wireframe)
- 3. 주요 기능 상세 (Specifications)
- 4. UI/UX 디자인 원칙
- 5. 기술 스택

---

## 💡 Tip: 문서 작성 시 주의사항

### Wireframe 작성 시
- ✅ 간단하고 명확하게
- ✅ 박스와 화살표로 구조 표현
- ✅ 픽셀 단위 대신 비율(%) 사용
- ❌ 색상, 폰트 등 시각적 요소 X

### Mockup 제작 시
- ✅ 디자인 시스템 (1-5_Design_System/) 준수
- ✅ 실제 데이터 사용 (더미 데이터)
- ✅ 반응형 디자인 고려
- ❌ 실제 DB 연동 X (정적 파일)

### Design_Specs 작성 시
- ✅ 구체적인 수치 명시 (px, %, rem)
- ✅ CSS 클래스명 명확히
- ✅ 컴포넌트 파일 경로 표기
- ❌ "적당히", "대충" 같은 모호한 표현 X

---

## 🔗 관련 문서

- **디자인 시스템**: `../1-5_Design_System/DESIGN_SYSTEM_V2.md`
- **사용자 플로우**: `../1-2_User_Flows/`
- **기능 요구사항**: `../1-3_Requirements/functional_requirements.md`
- **프로토타입**: `../../P3_프로토타입_제작/`

---

## ❓ FAQ

**Q: Wireframe과 Mockup의 차이는?**
A: Wireframe은 저해상도 구조도, Mockup은 고해상도 시각적 샘플입니다.

**Q: Mockup과 Prototype의 차이는?**
A: Mockup은 정적 HTML, Prototype은 DB 연동된 실제 작동 코드입니다.

**Q: 어떤 순서로 작업하나요?**
A: Wireframe → Mockup → Design_Specs → Prototype 순서입니다.

**Q: ADMIN_DASHBOARD_설계.md는 왜 루트에 있나요?**
A: 종합 설계서이므로 여러 폴더에 나누지 않고 한 곳에 모았습니다.

---

**문서 끝**
