# Order Sheet - Project_Directory_Structure

> **버전**: 5.5
> **단계**: P0-1 (작업 디렉토리 구조 생성)
> **목적**: 표준 디렉토리 구조 생성확인 및 변경할 내용 반영

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

1. 표준 디렉토리 구조 생성확인 및 변경할 내용 반영
   - P0~P3 예비단계 폴더
   - S0~S5 실행단계 폴더

2. 프로젝트별 문서 작성
   - `Project_Directory_Structure.md` (프로젝트 구조 설명)
   - `Project_Status.md` (현재 상태 기록)

---

## A3. AI 작업 순서 (5단계)

### 1단계: Order Sheet 완전 이해

**체크리스트**:
- [ ] A2 작업 내용 확인
- [ ] A4 산출물 확인
- [ ] PART_B 특별 지시사항/참고사항 확인

**출력**: `'Order Sheet 확인 완료. 단계: P0-1'`

---

### 2단계: 문의사항 질문

**질문 형식**:
```
[P0-1] 질문: {내용}
옵션 A: {옵션1}
옵션 B: {옵션2}
```

**출력**: 질문 목록 또는 `'질문 없음'`

---

### 3단계: 실행 (Execution)

**체크리스트**:
- [ ] 표준 디렉토리 구조 생성확인 (A2 참조)
- [ ] 프로젝트별 문서 작성 (A2 참조)

---

### 4단계: 검증 (Verification)

**체크리스트**:
- [ ] 모든 폴더가 생성되었는가?
- [ ] 모든 문서가 생성되었는가?
- [ ] 네이밍 규칙이 일관성 있는가?

**출력**: `'검증 완료'`

---

### 5단계: 완료 보고 (Report)

**보고서 생성**:
- 파일명: `P0-1_completion_report.md`
- 저장 위치: `Human_ClaudeCode_Bridge/Reports/`

**보고 내용**:
- 완료된 작업 요약
- 생성된 파일/폴더 목록
- 다음 단계 안내 (P0-2)

---

## A4. 산출물

| 산출물 | 저장 위치 |
|--------|----------|
| 전체 폴더 구조 | 프로젝트 루트 |
| `Project_Directory_Structure.md` | `P0_작업_디렉토리_구조_생성/` |
| `Project_Status.md` | `P0_작업_디렉토리_구조_생성/` |
| `.claude/CLAUDE.md` | `.claude/` |
| 완료 보고서 | `Human_ClaudeCode_Bridge/Reports/` |

---

## A5. 참조 문서

| 항목 | 위치 |
|------|------|
| 규칙 파일 | `.claude/rules/` |
| 보고서 저장 | `Human_ClaudeCode_Bridge/Reports/` |
| Briefing | `Briefings_OrderSheets/Briefings/P0/P0-1_Briefing.md` |

---

# PART B: 프로젝트별 추가 내용

## B1. 특별 지시사항

> 이번 Order에만 적용되는 특별한 지시 (없으면 비워둠)

(없음)

---

## B2. 참고사항

> AI가 작업과 관련하여 알아야 할 배경 정보 등 (없으면 비워둠)

**표준 폴더 구조:**
```
[프로젝트명]/
├── api/
├── pages/
├── assets/
├── scripts/
├── index.html
├── 404.html
├── P0_작업_디렉토리_구조_생성/
├── P1_사업계획/
├── P2_프로젝트_기획/
├── P3_프로토타입_제작/
├── S0_Project-SAL-Grid_생성/
├── S1_개발_준비/
├── S2_개발-1차/
├── S3_개발-2차/
├── S4_개발-3차/
├── S5_개발_마무리/
├── Development_Process_Monitor/
├── Human_ClaudeCode_Bridge/
├── Briefings_OrderSheets/
├── .claude/
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

> 본 Order Sheet는 템플릿입니다. Project Owner가 프로젝트에 맞게 자유롭게 수정할 수 있습니다.
