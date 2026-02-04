# Order Sheet - SAL-Grid

> **버전**: 5.4
> **단계**: S0-2 (SAL-Grid)
> **목적**: 프로젝트의 실제 SAL Grid 설계 및 생성

---

# PART A: 표준 내용

## A1. AI 준수 사항

**AI가 반드시 지켜야 할 사항:**

1. 이 Order Sheet를 100% 이해할 때까지 작업 시작 금지
2. 규칙 파일(`.claude/rules/`) 확인 전 파일 생성/저장 금지
3. 불명확한 점은 추측 금지, 반드시 질문
4. 작업 순서 (A3 참조) 건너뛰거나 변경 금지
5. 거짓 기록 절대 금지

---

## A2. 작업 내용

**수행할 작업:**

1. Stage 및 Area 정의
   - Stage 정의 (S1~S5)
   - Area 코드 정의 (11개)
   - Task ID 규칙 적용 (S[Stage][Area][Level])

2. Task 목록 생성
   - Stage별 Task 목록 작성
   - Task별 상세 정보 (22개 속성)
   - 의존성 관계 정의

3. sal-grid 폴더 구조 생성
   - task-instructions/ 폴더
   - verification-instructions/ 폴더
   - stage-gates/ 폴더

4. Instruction 파일 작성
   - 각 Task별 Task Instruction
   - 각 Task별 Verification Instruction

---

## A3. AI 작업 순서 (5단계)

### 1단계: Order Sheet 완전 이해

**체크리스트**:
- [ ] A2 작업 내용 확인
- [ ] A4 산출물 확인
- [ ] PART_B 특별 지시사항/참고사항 확인

**출력**: `'Order Sheet 확인 완료. 단계: S0-2'`

---

### 2단계: 문의사항 질문

**질문 형식**:
```
[S0-2] 질문: {내용}
옵션 A: {옵션1}
옵션 B: {옵션2}
```

**출력**: 질문 목록 또는 `'질문 없음'`

---

### 3단계: 실행 (Execution)

**체크리스트**:
- [ ] Stage/Area 정의 완료
- [ ] TASK_PLAN.md 작성
- [ ] sal-grid 폴더 구조 생성
- [ ] Task Instruction 파일 생성
- [ ] Verification Instruction 파일 생성

---

### 4단계: 검증 (Verification)

**체크리스트**:
- [ ] Task ID 규칙이 준수되는가?
- [ ] 모든 Area가 정의되었는가?
- [ ] 의존성 관계가 올바른가?
- [ ] 모든 Task에 Instruction 파일이 있는가?

**출력**: `'검증 완료'`

---

### 5단계: 완료 보고 (Report)

**보고서 생성**:
- 파일명: `S0-2_completion_report.md`
- 저장 위치: `Human_ClaudeCode_Bridge/Reports/`

**보고 내용**:
- 생성된 Task 수
- Stage별 Task 분포
- 다음 단계 안내 (S0-3 Method)

---

## A4. 산출물

| 산출물 | 저장 위치 |
|--------|----------|
| TASK_PLAN.md | `S0_Project-SAL-Grid_생성/sal-grid/` |
| Task Instruction 파일들 | `S0_Project-SAL-Grid_생성/sal-grid/task-instructions/` |
| Verification Instruction 파일들 | `S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/` |
| 완료 보고서 | `Human_ClaudeCode_Bridge/Reports/` |

---

## A5. 참조 문서

| 항목 | 위치 |
|------|------|
| 규칙 파일 | `.claude/rules/` |
| 매뉴얼 (S0-1에서 검토) | `S0_Project-SAL-Grid_생성/manual/PROJECT_SAL_GRID_MANUAL.md` |
| Briefing | `Briefings_OrderSheets/Briefings/S0/S0-2_Briefing.md` |

---

# PART B: 프로젝트별 추가 내용

## B1. 특별 지시사항

**Area 코드 정의 (11개):**

| 코드 | 영역 | 설명 |
|-----|------|------|
| M | Documentation | 문서화 |
| U | Design | UI/UX 디자인 |
| F | Frontend | 프론트엔드 |
| BI | Backend Infrastructure | 백엔드 기반 |
| BA | Backend APIs | 백엔드 API |
| D | Database | 데이터베이스 |
| S | Security | 보안/인증 |
| T | Testing | 테스트 |
| O | DevOps | 운영/배포 |
| E | External | 외부 연동 |
| C | Content | 콘텐츠 시스템 |

**Task ID 형식**: `S[Stage][Area][Level]`
- 예: S1S1, S2F1, S3BA2

---

## B2. 참고사항

**PO로부터 입력 필요:**
- 프로젝트 개발 범위
- Stage별 개발 계획
- 초기 Task 목록 (이미 정의된 것이 있다면)

**sal-grid 폴더 구조:**
```
S0_Project-SAL-Grid_생성/
└── sal-grid/
    ├── TASK_PLAN.md
    ├── task-instructions/
    │   ├── S1S1_instruction.md
    │   ├── S1D1_instruction.md
    │   └── ...
    ├── verification-instructions/
    │   ├── S1S1_verification.md
    │   ├── S1D1_verification.md
    │   └── ...
    └── stage-gates/
        ├── S1GATE_verification_report.md
        └── ...
```

**S0-2 완료 후:**
- S0-3 (Method 선택) 진행

---

> 본 Order Sheet는 템플릿입니다. Project Owner가 프로젝트에 맞게 자유롭게 수정할 수 있습니다.
