# Order Sheet - Manual

> **버전**: 5.4
> **단계**: S0-1 (Manual)
> **목적**: 기존 PROJECT SAL GRID 매뉴얼 검토 및 필요시 업데이트

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

1. 매뉴얼 읽기 및 이해
   - `PROJECT_SAL_GRID_MANUAL.md` 전체 읽기
   - SAL Grid 개념 이해 (Stage-Area-Level)
   - 22개 속성, 검증 프로세스, Stage Gate 이해

2. 업데이트 필요 여부 확인
   - 현재 프로젝트에 맞지 않는 내용이 있는지 확인
   - 추가해야 할 내용이 있는지 확인
   - PO에게 수정 필요 여부 질문

3. (필요시) 매뉴얼 업데이트
   - `manual_template.md` 수정
   - 빌드 스크립트 실행
   - 결과물 확인

---

## A3. AI 작업 순서 (5단계)

### 1단계: Order Sheet 완전 이해

**체크리스트**:
- [ ] A2 작업 내용 확인
- [ ] A4 산출물 확인
- [ ] PART_B 특별 지시사항/참고사항 확인

**출력**: `'Order Sheet 확인 완료. 단계: S0-1'`

---

### 2단계: 문의사항 질문

**질문 형식**:
```
[S0-1] 질문: {내용}
옵션 A: {옵션1}
옵션 B: {옵션2}
```

**출력**: 질문 목록 또는 `'질문 없음'`

---

### 3단계: 실행 (Execution)

**체크리스트**:
- [ ] PROJECT_SAL_GRID_MANUAL.md 전체 읽기
- [ ] SAL Grid 개념 이해 확인
- [ ] 업데이트 필요 여부 PO에게 확인
- [ ] (필요시) manual_template.md 수정
- [ ] (필요시) 빌드 스크립트 실행

---

### 4단계: 검증 (Verification)

**체크리스트**:
- [ ] 매뉴얼 내용을 충분히 이해했는가?
- [ ] SAL Grid 개념 (Stage, Area, Level)을 설명할 수 있는가?
- [ ] (수정한 경우) 빌드가 정상적으로 완료되었는가?

**출력**: `'검증 완료'`

---

### 5단계: 완료 보고 (Report)

**보고서 생성**:
- 파일명: `S0-1_completion_report.md`
- 저장 위치: `Human_ClaudeCode_Bridge/Reports/`

**보고 내용**:
- 매뉴얼 검토 완료
- 수정 사항 (있는 경우)
- 다음 단계 안내 (S0-2 SAL-Grid)

---

## A4. 산출물

| 산출물 | 저장 위치 |
|--------|----------|
| 매뉴얼 검토 완료 | (수정 없으면 산출물 없음) |
| (수정시) PROJECT_SAL_GRID_MANUAL.md | `S0_Project-SAL-Grid_생성/manual/` |
| 완료 보고서 | `Human_ClaudeCode_Bridge/Reports/` |

---

## A5. 참조 문서

| 항목 | 위치 |
|------|------|
| 매뉴얼 | `S0_Project-SAL-Grid_생성/manual/PROJECT_SAL_GRID_MANUAL.md` |
| 매뉴얼 템플릿 | `S0_Project-SAL-Grid_생성/manual/manual_template.md` |
| 빌드 스크립트 | `S0_Project-SAL-Grid_생성/manual/build-manual.js` |
| 규칙 파일 | `.claude/rules/` |
| Briefing | `Briefings_OrderSheets/Briefings/S0/S0-1_Briefing.md` |

---

# PART B: 프로젝트별 추가 내용

## B1. 특별 지시사항

**매뉴얼은 이미 완성되어 있습니다.**

Development Package에 포함된 매뉴얼을 읽고 이해하는 것이 주 목적입니다. 수정이 필요한 경우에만 업데이트합니다.

**매뉴얼 구조 (27개 섹션):**
- PART 1: 개요 및 프레임워크 (1-4)
- PART 2: Grid 생성 (5-8)
- PART 3: 검증 및 추적 (9-12)
- PART 4: Method 설정 (13-17) - JSON Method (기본), Database Method (선택)
- PART 5: Viewer 및 자동화 (18-21)
- PART 6: 문제 해결 (22-24)
- PART 7: 정리 및 부록 (25-27)

---

## B2. 참고사항

**수정이 필요한 경우:**
1. `manual_template.md` 파일을 수정
2. 빌드 스크립트 실행:
   ```bash
   node S0_Project-SAL-Grid_생성/manual/build-manual.js
   ```
3. `PROJECT_SAL_GRID_MANUAL.md`가 자동 갱신됨

**규칙 파일 연동:**
매뉴얼 템플릿은 `.claude/rules/` 폴더의 규칙 파일을 자동으로 포함합니다.

**S0-1 완료 후:**
- S0-2 (SAL-Grid 생성) 진행

---

> 본 Order Sheet는 템플릿입니다. Project Owner가 프로젝트에 맞게 자유롭게 수정할 수 있습니다.
