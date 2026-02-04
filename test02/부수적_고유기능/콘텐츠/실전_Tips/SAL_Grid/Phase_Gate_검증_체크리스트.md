# Stage Gate 검증 시 AI 검증 → PO 테스트 → 최종 승인 체크리스트

> 이 문서는 Stage Gate(Phase Gate) 검증의 전체 프로세스와 체크리스트를 설명합니다.

---

## Phase Gate란

Phase Gate는 각 Stage가 끝날 때 다음 단계로 진행하기 전에 반드시 거쳐야 하는 품질 관문입니다. SAL Grid에서는 5개의 Stage(S1~S5)마다 Gate 검증을 수행합니다.

---

## 통과 조건 5가지

1. **모든 Task 완료**: Stage 내 모든 Task가 `Completed` + `Verified` 상태
2. **테스트 통과**: 단위 테스트, 통합 테스트 등 모든 테스트 통과
3. **코드 리뷰 완료**: Verification Agent가 모든 코드 검토 승인
4. **문서화 완료**: 작업 결과 보고서, 검증 리포트 등 문서 작성
5. **PO 승인**: AI 검증 후 PO가 직접 테스트하고 최종 승인

---

## 검증 프로세스

```
[1단계] Main Agent: Stage 내 모든 Task 상태 확인
    ↓
[2단계] Main Agent: AI Stage Gate 검증 수행
    ↓
[3단계] 검증 리포트 작성 (stage-gates/S{N}GATE_verification_report.md)
    ↓
[4단계] PO 테스트 가이드 제공
    ↓
[5단계] PO 직접 테스트
    ↓
[6단계] PO 승인 → stage_gate_status: Approved
```

---

## 상태 전이 규칙

| task_status | 설명 |
|-------------|------|
| Pending | 작업 시작 전 |
| In Progress | 작업 진행 중 |
| Executed | 파일 생성 완료 |
| Completed | 검증 통과 후 완료 |

**핵심 규칙**: `task_status: Completed`로 변경하려면 `verification_status: Verified` 필수

---

## 검증 리포트 형식

```markdown
# S{N} Stage Gate Verification Report

## Task 완료 현황
| Task ID | Status | Verification |
|---------|--------|--------------|
| S2F1 | 완료 | Passed |

## 빌드/테스트 결과
- 전체 빌드: 성공
- 테스트: 24/24 통과

## PO 테스트 가이드
[테스트 방법 안내]
```

---

## 주의사항

**AI 검증만으로 Gate 통과 선언 금지**: 반드시 PO가 직접 테스트하고 승인해야 합니다.

**하나라도 미충족이면 불통과**: 10개 Task 중 9개 완료, 1개 미완료면 Gate 통과 불가.

---

*상세 내용: `.claude/rules/06_verification.md` 참조*
