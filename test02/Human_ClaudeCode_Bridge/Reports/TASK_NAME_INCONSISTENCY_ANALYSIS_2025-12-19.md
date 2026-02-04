# Task Name 불일치 분석 리포트

> **작성일**: 2025-12-19
> **작성자**: Claude Code (Main Agent)
> **분석 대상**: Task Plan vs Grid vs Task Instruction 파일

---

## 1. 불일치 현황 (20개)

| Stage | Task ID | Task Plan / Grid | Task Instruction |
|-------|---------|------------------|------------------|
| **S2** | S2C1 | Books 콘텐츠 업로드 | 학습용 콘텐츠 시스템 정비 |
| **S3** | S3S1 | AI 서비스 구독 상태 확인 (Health Check) | AI 서비스 구독 상태 확인 (PO's AI Service Subscription Health Check) |
| **S4** | S4M1 | 관리자 가이드 | MVP 최종 검토 |
| **S4** | S4F1 | 관리자 대시보드 강화 | 결제 UI |
| **S4** | S4F2 | AI Q&A 인터페이스 | 결제 완료 페이지 |
| **S4** | S4BI1 | Sentry 에러 트래킹 설정 | 결제 클라이언트 SDK |
| **S4** | S4BA1 | 결제 API (토스 페이먼트) | 결제 API |
| **S4** | S4BA2 | 결제 웹훅 API | 웹훅 핸들러 |
| **S4** | S4S1 | 관리자 권한 체크 | 결제 보안 |
| **S4** | S4T1 | E2E 테스트 | 결제 테스트 |
| **S4** | S4T2 | API 통합 테스트 | E2E 결제 테스트 |
| **S4** | S4O1 | Cron Jobs 설정 | PG사 설정 |
| **S5** | S5M1 | 운영 매뉴얼 | 출시 체크리스트 |
| **S5** | S5F1 | 버그 수정 (프론트엔드) | 랜딩페이지 최적화 |
| **S5** | S5BA1 | API 버그 수정 및 최적화 | 모니터링 API |
| **S5** | S5D1 | 데이터 백업 설정 | 백업 설정 |
| **S5** | S5S1 | 보안 점검 및 패치 | SSL/보안 설정 |
| **S5** | S5O1 | 프로덕션 배포 | 도메인 연결 |
| **S5** | S5O3 | SSL 인증서 확인 | 모니터링 설정 |

---

## 2. 근본 원인 분석

### 2.1 핵심 원인: 다중 진실 원천 (Multiple Sources of Truth)

프로젝트에 **4개의 독립적인 데이터 소스**가 존재하며, 이들이 동기화되지 않음:

```
┌─────────────────────────────────────────────────────────────┐
│                    4개의 진실 원천                           │
├─────────────────────────────────────────────────────────────┤
│  1. Task Plan (MD)     → SSALWORKS_TASK_PLAN.md            │
│  2. Seed SQL           → seed_project_sal_grid.sql          │
│  3. Task Instructions  → task-instructions/*.md            │
│  4. Supabase DB        → project_sal_grid 테이블            │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 불일치 발생 패턴

#### **Pattern A: 의도적 구체화 (S4/S5 대부분)**

```
[Task Plan] "관리자 가이드" (범용적/추상적)
     ↓
[Task Instruction] "MVP 최종 검토" (구체적/실행 가능)
```

**원인**: Task Instruction 작성 시 더 명확하고 실행 가능한 이름으로 구체화함
- 추상적 Task명 → 실제 구현 내용 반영한 이름으로 변경
- 변경 후 Task Plan 역업데이트 누락

**영향받는 Tasks**: S4M1, S4F1, S4F2, S4BI1, S4BA1, S4BA2, S4S1, S4T1, S4T2, S4O1, S5M1, S5F1, S5BA1, S5D1, S5S1, S5O1, S5O3

#### **Pattern B: 역방향 업데이트 누락 (S2C1)**

```
[v3.2] Task Plan 업데이트: "학습용 콘텐츠 시스템 정비"
[v3.4] Task Plan 롤백: "Books 콘텐츠 업로드" (Grid 기준으로 복귀)
     ↓
[Task Instruction] 여전히 "학습용 콘텐츠 시스템 정비" (업데이트 안됨)
```

**원인**: Task Plan 변경 시 Task Instruction 파일 동기화 누락

#### **Pattern C: 사소한 표기 차이 (S3S1)**

```
[Task Plan] "AI 서비스 구독 상태 확인 (Health Check)"
[Instruction] "AI 서비스 구독 상태 확인 (PO's AI Service Subscription Health Check)"
```

**원인**: 부가 설명 추가/변경 시 일관성 부재

### 2.3 구조적 문제

```
┌────────────────────────────────────────────────────────────────┐
│                      현재 워크플로우                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   Task Plan 수정  ──X──> Task Instruction 수정                 │
│        │                       │                               │
│        │                       │                               │
│        ▼                       ▼                               │
│   Seed SQL 수정  ──X──>   DB 업데이트                          │
│                                                                │
│   ※ 각 단계에서 다른 단계로의 전파가 수동/누락                  │
└────────────────────────────────────────────────────────────────┘
```

**문제점**:
1. 자동 검증 메커니즘 부재
2. 단일 진실 원천(Single Source of Truth) 미지정
3. 변경 전파 프로세스 미정립

---

## 3. Stage별 불일치 분석

### 3.1 Stage 4 (10개 불일치) - 가장 심각

| Task ID | Plan/Grid | Instruction | 불일치 유형 |
|---------|-----------|-------------|-------------|
| S4M1 | 관리자 가이드 | MVP 최종 검토 | 완전 다른 작업 |
| S4F1 | 관리자 대시보드 강화 | 결제 UI | 완전 다른 작업 |
| S4F2 | AI Q&A 인터페이스 | 결제 완료 페이지 | 완전 다른 작업 |
| S4BI1 | Sentry 에러 트래킹 | 결제 클라이언트 SDK | 완전 다른 작업 |
| S4BA1 | 결제 API (토스) | 결제 API | 약간 다름 |
| S4BA2 | 결제 웹훅 API | 웹훅 핸들러 | 약간 다름 |
| S4S1 | 관리자 권한 체크 | 결제 보안 | 완전 다른 작업 |
| S4T1 | E2E 테스트 | 결제 테스트 | 범위 다름 |
| S4T2 | API 통합 테스트 | E2E 결제 테스트 | 범위 다름 |
| S4O1 | Cron Jobs 설정 | PG사 설정 | 완전 다른 작업 |

**분석**:
- Plan/Grid는 "관리자 기능 + 일반 테스트 + Sentry"를 포함
- Instruction은 "결제 중심"으로 작성됨
- **결론**: 두 버전의 Stage 4 계획이 공존하는 상태

### 3.2 Stage 5 (7개 불일치)

| Task ID | Plan/Grid | Instruction | 불일치 유형 |
|---------|-----------|-------------|-------------|
| S5M1 | 운영 매뉴얼 | 출시 체크리스트 | 범위 다름 |
| S5F1 | 버그 수정 | 랜딩페이지 최적화 | 완전 다른 작업 |
| S5BA1 | API 버그 수정 | 모니터링 API | 완전 다른 작업 |
| S5D1 | 데이터 백업 설정 | 백업 설정 | 약간 다름 |
| S5S1 | 보안 점검 및 패치 | SSL/보안 설정 | 범위 다름 |
| S5O1 | 프로덕션 배포 | 도메인 연결 | 완전 다른 작업 |
| S5O3 | SSL 인증서 확인 | 모니터링 설정 | 완전 다른 작업 |

**분석**:
- Plan/Grid는 "운영/유지보수" 관점
- Instruction은 "출시 준비" 관점
- **결론**: 운영 단계 정의가 두 버전으로 분리

### 3.3 Stage 2/3 (3개 불일치) - 경미

| Task ID | Plan/Grid | Instruction | 불일치 유형 |
|---------|-----------|-------------|-------------|
| S2C1 | Books 콘텐츠 업로드 | 학습용 콘텐츠 시스템 정비 | 이름만 다름 (같은 작업) |
| S3S1 | Health Check | PO's Health Check | 표기 차이 |

---

## 4. 권장 해결 방안

### 4.1 즉시 조치 (단기)

**Option A: Task Plan 기준으로 통일**
```bash
# Task Instruction 파일들의 Task Name을 Task Plan 기준으로 수정
# 장점: Task Plan이 최신 버전이고 전체 그림을 반영
# 단점: Instruction 내용이 다를 수 있음 (검토 필요)
```

**Option B: Task Instruction 기준으로 통일**
```bash
# Task Plan과 Grid(DB)를 Instruction 기준으로 수정
# 장점: Instruction이 실제 구현 내용 반영
# 단점: Stage 4/5 전체 계획 검토 필요
```

**Option C: 내용 검토 후 개별 결정** (권장)
```bash
# 각 불일치 Task에 대해:
# 1. Plan/Grid 내용 vs Instruction 내용 비교
# 2. 실제 구현이 필요한 내용 기준으로 결정
# 3. 모든 소스 동기화
```

### 4.2 구조적 개선 (중장기)

**1. 단일 진실 원천 지정**
```
[Single Source of Truth]
     │
     ├── Task Plan (SSALWORKS_TASK_PLAN.md) ← 마스터 데이터
     │
     └──> 자동 생성/동기화:
          ├── Task Instruction 파일
          ├── Seed SQL
          └── Supabase DB
```

**2. 자동 검증 스크립트 추가**
```javascript
// validate_task_names.js
// Task Plan, Instruction, Grid의 Task Name 일치 여부 검증
// CI/CD에서 자동 실행
```

**3. 변경 프로세스 정립**
```
[Task 변경 시 필수 절차]
1. Task Plan 수정
2. Task Instruction 파일 수정 (또는 자동 생성)
3. Seed SQL 업데이트 (또는 자동 생성)
4. DB 동기화 실행
5. 검증 스크립트 실행
```

---

## 5. 결론

### 5.1 근본 원인 요약

| 원인 | 설명 | 심각도 |
|------|------|--------|
| 다중 진실 원천 | 4개의 독립적 데이터 소스 존재 | 높음 |
| 동기화 메커니즘 부재 | 변경 시 다른 소스 업데이트 누락 | 높음 |
| 버전 관리 문제 | Stage 4/5 두 버전 계획 혼재 | 중간 |
| 자동 검증 부재 | 불일치 조기 발견 불가 | 중간 |

### 5.2 즉시 필요한 결정

**Project Owner 결정 필요**:

1. **Stage 4 방향**:
   - A) 관리자 기능 + Sentry + 일반 테스트 (Task Plan)
   - B) 결제 중심 (Task Instruction)

2. **Stage 5 방향**:
   - A) 운영/유지보수 (Task Plan)
   - B) 출시 준비 (Task Instruction)

3. **단일 진실 원천**:
   - A) Task Plan을 마스터로 지정
   - B) Task Instruction을 마스터로 지정

---

## 6. 첨부: 소스 파일 위치

| 소스 | 파일 경로 |
|------|----------|
| Task Plan | `S0_Project-SSAL-Grid_생성/ssal-grid/SSALWORKS_TASK_PLAN.md` |
| Seed SQL | `S0_Project-SSAL-Grid_생성/supabase/seed_project_sal_grid.sql` |
| Task Instructions | `S0_Project-SSAL-Grid_생성/ssal-grid/task-instructions/*.md` |
| Supabase DB | `project_sal_grid` 테이블 |

---

**리포트 작성 완료**: 2025-12-19
**작성자**: Claude Code (Main Agent)
