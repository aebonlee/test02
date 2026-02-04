# sal-grid

## 개요

프로젝트의 **실제 SAL Grid**를 설계하고 생성합니다. 매뉴얼에서 배운 개념을 적용하여 본인 프로젝트에 맞는 Task 계획을 수립합니다.

## SAL Grid 설계 요소

### Stage 정의 (S1~S5)

- S1: 개발 준비
- S2: 개발 1차
- S3: 개발 2차
- S4: 개발 3차
- S5: 개발 마무리

### Area 정의 (11개)

- M: 문서화 / BI / 백엔드 기반
- U: UI/UX 디자인 / BA / 백엔드 API
- F: 프론트엔드 / D / 데이터베이스
- S: 보안/인증 / T / 테스팅
- O: DevOps / E / 외부 연동
- C: 콘텐츠 시스템

### Task ID 규칙

**형식**: S[Stage][Area][Level]

```
S2BA1
│ │ └─ Level: 1 (첫 번째 Task)
│ └─── Area: BA (Backend APIs)
└───── Stage: S2 (개발 1차)
```

## 생성할 파일

- `TASK_PLAN.md`: 전체 Task 계획서
- `5x11_MATRIX.md`: 5×11 Stage-Area 매트릭스
- `TASK_DEPENDENCY_DIAGRAM.md`: Task 의존성 다이어그램
- `task-instructions/*.md`: 각 Task별 상세 지침
- `verification-instructions/*.md`: 각 Task별 검증 지침
- `stage-gates/*.md`: Stage Gate 검증 리포트

## 작업 순서

1. **Task Plan 작성**: 전체 작업 범위와 Task 목록 정의
2. **5×11 매트릭스 작성**: Stage-Area 교차점에 Task 배치
3. **Task Instruction 작성**: 각 Task별 상세 수행 지침
4. **Verification Instruction 작성**: 각 Task별 검증 기준
5. **의존성 다이어그램 작성**: Task 간 선후행 관계 정의

## 저장 위치

```
S0_Project-SAL-Grid_생성/
└── sal-grid/
    ├── TASK_PLAN.md
    ├── 5x11_MATRIX.md
    ├── TASK_DEPENDENCY_DIAGRAM.md
    ├── task-instructions/
    │   ├── S1D1_instruction.md
    │   └── ...
    ├── verification-instructions/
    │   ├── S1D1_verification.md
    │   └── ...
    └── stage-gates/
        ├── S1GATE_verification_report.md
        └── ...
```

