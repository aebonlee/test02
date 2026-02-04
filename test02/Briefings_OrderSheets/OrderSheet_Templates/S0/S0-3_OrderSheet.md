# Order Sheet - Method

> **버전**: 5.4
> **단계**: S0-3 (Method)
> **목적**: SAL Grid 데이터 저장 방식 (JSON Method 기본, Database Method 선택) 설정

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

1. JSON Method 설정 (기본)
   - index.json + grid_records/*.json 구조 확인
   - JSON 파일 구조 검증
   - 데이터 입력 방법 안내

2. Database Method 설정 (선택)
   - Supabase DB 연결 설정 (필요 시)
   - project_sal_grid 테이블 구조 확인

3. Task 데이터 초기화
   - S0-2에서 생성한 Task 목록을 JSON/DB에 반영
   - 22개 속성 확인
   - 초기 상태값 설정 (Pending, Not Verified)

---

## A3. AI 작업 순서 (5단계)

### 1단계: Order Sheet 완전 이해

**체크리스트**:
- [ ] A2 작업 내용 확인
- [ ] A4 산출물 확인
- [ ] PART_B 특별 지시사항/참고사항 확인

**출력**: `'Order Sheet 확인 완료. 단계: S0-3'`

---

### 2단계: 문의사항 질문

**질문 형식**:
```
[S0-3] 질문: {내용}
옵션 A: {옵션1}
옵션 B: {옵션2}
```

**출력**: 질문 목록 또는 `'질문 없음'`

---

### 3단계: 실행 (Execution)

**체크리스트:**
- [ ] JSON Method: index.json + grid_records/*.json 구조 확인
- [ ] (선택) Database Method: Supabase 연결 설정
- [ ] S0-2에서 생성한 Task 목록을 JSON/DB에 반영
- [ ] 22개 속성 구조 검증
- [ ] 초기 상태값 설정 (task_status: Pending, verification_status: Not Verified)
- [ ] 사용 방법 안내

---

### 4단계: 검증 (Verification)

**체크리스트:**
- [ ] JSON Method: index.json과 grid_records/*.json 구조가 올바른가?
- [ ] (선택) Database Method: Supabase 연결 테스트 성공했는가?
- [ ] 모든 Task가 JSON/DB에 포함되었는가?
- [ ] 22개 속성이 모두 정의되었는가?
- [ ] 초기 상태값이 올바른가?

**출력**: `'검증 완료'`

---

### 5단계: 완료 보고 (Report)

**보고서 생성**:
- 파일명: `S0-3_completion_report.md`
- 저장 위치: `Human_ClaudeCode_Bridge/Reports/`

**보고 내용**:
- JSON Method 설정 완료
- (선택) Database Method 설정 완료
- Task 데이터 초기화 완료
- 다음 단계 안내 (S0-4 Viewer)

---

## A4. 산출물

| 산출물 | 저장 위치 |
|--------|----------|
| index.json | `S0_Project-SAL-Grid_생성/method/json/data/` |
| grid_records/*.json | `S0_Project-SAL-Grid_생성/method/json/data/grid_records/` |
| 완료 보고서 | `Human_ClaudeCode_Bridge/Reports/` |

---

## A5. 참조 문서

| 항목 | 위치 |
|------|------|
| 규칙 파일 | `.claude/rules/` |
| S0-2 결과물 | `S0_Project-SAL-Grid_생성/sal-grid/` |
| Briefing | `Briefings_OrderSheets/Briefings/S0/S0-3_Briefing.md` |

---

# PART B: 프로젝트별 추가 내용

## B1. 특별 지시사항

**JSON Method가 기본, Database Method는 선택입니다.**

- **JSON Method**: 외부 서비스 없이 로컬 JSON 파일로 Task 관리
- **Database Method**: Supabase DB 연동 시 사용 (SSAL Works 플랫폼 연동용)

**JSON 파일 구조 (개별 파일 방식):**
```
S0_Project-SAL-Grid_생성/
└── method/
    └── json/
        └── data/
            ├── index.json           ← 프로젝트 정보 + task_ids 배열
            └── grid_records/        ← 개별 Task JSON 파일
                ├── S1BI1.json
                ├── S1BI2.json
                └── ...
```

**병행 사용 시 (SSAL Works 내부):**
- JSON과 DB 모두 업데이트
- Viewer는 JSON (사용자용) / DB (예시용) 분리

---

## B2. 참고사항

**22개 속성 초기값:**
- task_status: `Pending`
- verification_status: `Not Verified`
- task_progress: `0`

**S0-3 완료 후:**
- S0-4 (Viewer) 진행

---

> 본 Order Sheet는 템플릿입니다. Project Owner가 프로젝트에 맞게 자유롭게 수정할 수 있습니다.
