# S4 Stage 실행 계획서

> **작성일**: 2025-12-19
> **상태**: 연구 완료, 실행 대기
> **목적**: S4 Stage 작업 구상 및 실행 전략 수립

---

## 1. S4 Stage 개요

| 항목 | 내용 |
|------|------|
| **Stage** | S4 (개발 3차) |
| **명칭** | Payment & Admin |
| **핵심 목표** | 결제 시스템 구현 및 품질 보증 |
| **총 Task** | 10개 |
| **Human-AI Task** | 2개 (S4M1, S4O1) |
| **AI-Only Task** | 8개 |

---

## 2. Task 목록 및 분류

### 2.1 Human-Assisted Tasks (PO 협력 필요)

| Task ID | Task Name | 핵심 내용 | PO 역할 |
|---------|-----------|----------|---------|
| **S4M1** | MVP 최종 검토 | 결제 연동 전 시스템 검토 | 기능 테스트, 승인 |
| **S4O1** | PG사 설정 | 토스페이먼츠 가맹점 등록 | 계정 생성, 서류 제출, 환경변수 설정 |

### 2.2 AI-Only Tasks

| Task ID | Task Name | Area | 복잡도 |
|---------|-----------|------|--------|
| S4BI1 | 결제 클라이언트 SDK | BI | 중 |
| S4F1 | 결제 UI | F | 하 |
| S4F2 | 결제 완료 페이지 | F | 하 |
| S4BA1 | 결제 API | BA | **높음** |
| S4BA2 | 웹훅 핸들러 | BA | 중 |
| S4S1 | 결제 보안 | S | 중 |
| S4T1 | 결제 테스트 | T | 중 |
| S4T2 | E2E 결제 테스트 | T | 중 |

---

## 3. 의존성 체인 분석

### 3.1 의존성 다이어그램

```
[S3 Stage 완료]
       ↓
   ┌───────┐
   │ S4M1  │ ← MVP 최종 검토 (Human-AI)
   └───┬───┘
       ↓
   ┌───────┐
   │ S4O1  │ ← PG사 설정 (Human-AI) ⚠️ 3-5일 소요
   └───┬───┘
       ↓
   ┌───────────────────────────────┐
   │  병렬 진행 가능               │
   │  ┌──────┐     ┌──────┐       │
   │  │S4BI1 │     │ S4F1 │       │
   │  └──┬───┘     └──┬───┘       │
   │     │            │           │
   │     └────┬───────┘           │
   │          ↓                   │
   │      ┌──────┐                │
   │      │ S4F2 │                │
   │      └──────┘                │
   └───────────────────────────────┘
       ↓
   ┌───────┐
   │S4BA1  │ ← 결제 API (핵심)
   └───┬───┘
       ↓
   ┌───────┐
   │S4BA2  │ ← 웹훅 핸들러
   └───┬───┘
       ↓
   ┌───────┐
   │ S4S1  │ ← 결제 보안
   └───┬───┘
       ↓
   ┌───────┐
   │ S4T1  │ ← 단위/통합 테스트
   └───┬───┘
       ↓
   ┌───────┐
   │ S4T2  │ ← E2E 테스트
   └───────┘
       ↓
[S4 Stage Gate]
```

### 3.2 Critical Path (가장 긴 경로)

```
S4M1 → S4O1 → S4BI1 → S4BA1 → S4BA2 → S4S1 → S4T1 → S4T2
```

**병목 지점**: S4O1 (PG사 설정) - 가맹점 심사 3-5 영업일 소요

---

## 4. 실행 전략

### 4.1 Phase 1: 준비 단계 (S4M1 + S4O1 시작)

**목표**: 결제 연동 전 시스템 검토 및 PG 설정 시작

**실행 순서**:
1. **S4M1** (MVP 최종 검토) - Human-AI
   - AI: 검토 체크리스트 작성, 자동 테스트 실행
   - PO: 수동 기능 테스트, 승인

2. **S4O1** (PG사 설정) - Human-AI
   - AI: 설정 가이드 문서 생성
   - PO: 토스페이먼츠 계정 생성, 테스트 API 키 발급
   - **가맹점 심사 시작** (3-5일 소요)

**병렬 진행**:
- S4O1의 테스트 환경 설정 완료 후 → Phase 2 시작 가능
- 가맹점 심사는 백그라운드로 진행

### 4.2 Phase 2: SDK 및 UI 개발 (병렬)

**선행 조건**: S4O1 테스트 API 키 발급 완료

**병렬 진행**:
| 순서 | Task | 담당 Agent | 예상 산출물 |
|------|------|-----------|------------|
| 2-1 | S4BI1 | devops-troubleshooter | 토스 SDK 클래스, 빌링 페이지 |
| 2-2 | S4F1 | frontend-developer | 결제 UI 페이지 |
| 2-3 | S4F2 | frontend-developer | 성공/실패 페이지 |

**병렬 가능 이유**: S4BI1, S4F1, S4F2는 서로 독립적

### 4.3 Phase 3: API 개발 (순차)

**선행 조건**: Phase 2 완료 (특히 S4BI1)

**순차 진행**:
| 순서 | Task | 담당 Agent | 핵심 구현 |
|------|------|-----------|----------|
| 3-1 | S4BA1 | backend-developer | 결제 승인, 빌링키, 자동결제, 취소 API |
| 3-2 | S4BA2 | backend-developer | 웹훅 핸들러, 이벤트 처리 |

**순차 이유**: S4BA2는 S4BA1의 결제 API에 의존

### 4.4 Phase 4: 보안 및 테스트 (순차)

**선행 조건**: Phase 3 완료

**순차 진행**:
| 순서 | Task | 담당 Agent | 핵심 구현 |
|------|------|-----------|----------|
| 4-1 | S4S1 | security-specialist | 금액 검증, Rate Limiting, 보안 래퍼 |
| 4-2 | S4T1 | test-engineer | 단위 테스트, 통합 테스트 |
| 4-3 | S4T2 | test-engineer | E2E 테스트 (Playwright) |

---

## 5. 파일 저장 계획

### 5.1 Stage 폴더 (S4_개발-3차/)

| Area | 폴더 | 저장할 파일 |
|------|------|------------|
| M | Documentation/ | MVP_REVIEW_REPORT.md, PG_SETUP_CHECKLIST.md |
| O | DevOps/ | vercel.json (결제 라우트), cron 설정 |
| BI | Backend_Infra/ | toss-payments.js, payment-utils.js, payment-config.js |
| F | Frontend/ | payment.html, payment-success.html, payment-fail.html |
| BA | Backend_API/ | confirm.js, billing-key.js, auto-charge.js, cancel.js, toss-payments-webhook.js |
| S | Security/ | validator.js, rate-limiter.js, secure-payment.js, env-check.js |
| T | Testing/ | 테스트 파일들 (unit/, integration/, e2e/) |

### 5.2 Production 폴더 (이중 저장)

| Area | Stage 폴더 | Production 폴더 |
|------|------------|-----------------|
| F | S4_개발-3차/Frontend/ | Production/Frontend/ |
| BA | S4_개발-3차/Backend_API/ | Production/api/Backend_APIs/ |
| BI | S4_개발-3차/Backend_Infra/ | Production/api/Backend_Infrastructure/ |

### 5.3 신규 필요 폴더

```
Production/api/Backend_APIs/payment/    ← 결제 API
Production/api/webhook/                  ← 웹훅 핸들러
Production/api/lib/payment/              ← 결제 보안 유틸
```

> ⚠️ **새 폴더 생성 전 PO 승인 필요!**

---

## 6. 데이터베이스 변경 사항

### 6.1 필요한 테이블

| 테이블 | 용도 | 생성 시점 |
|--------|------|----------|
| payments | 결제 내역 저장 | S4BA1 |
| user_billing | 빌링키 저장 | S4BA1 |
| webhook_logs | 웹훅 로그 | S4BA2 |
| security_logs | 보안 이벤트 로그 | S4S1 |

### 6.2 기존 테이블 변경

| 테이블 | 변경 내용 | Task |
|--------|----------|------|
| subscriptions | payment_key, last_payment_at 컬럼 추가 | S4BA1 |

---

## 7. 환경 변수 목록

### 7.1 테스트 환경

```bash
TOSS_CLIENT_KEY=test_ck_xxxxxxxxx
TOSS_SECRET_KEY=test_sk_xxxxxxxxx
TOSS_WEBHOOK_SECRET=webhook_secret_xxx
CRON_SECRET=cron_secret_xxx
```

### 7.2 프로덕션 환경 (가맹점 승인 후)

```bash
TOSS_CLIENT_KEY=live_ck_xxxxxxxxx
TOSS_SECRET_KEY=live_sk_xxxxxxxxx
TOSS_WEBHOOK_SECRET=webhook_secret_xxx
```

---

## 8. Human-AI 협력 포인트

### 8.1 S4M1 (MVP 최종 검토)

| 단계 | 수행자 | 내용 |
|------|--------|------|
| 1 | AI | 검토 체크리스트 생성 |
| 2 | AI | 자동화 가능한 테스트 실행 |
| 3 | **PO** | 수동 기능 테스트 (로그인, 구독, AI Q&A) |
| 4 | **PO** | 검토 결과 승인 |

### 8.2 S4O1 (PG사 설정)

| 단계 | 수행자 | 내용 |
|------|--------|------|
| 1 | AI | 설정 가이드 문서 생성 |
| 2 | **PO** | 토스페이먼츠 계정 생성 |
| 3 | **PO** | 테스트 API 키 확인 |
| 4 | **PO** | Vercel 환경 변수 등록 |
| 5 | **PO** | 웹훅 URL 등록 |
| 6 | **PO** | 가맹점 신청 (서류 제출) |
| 7 | 대기 | 가맹점 심사 (3-5일) |
| 8 | AI | 테스트 결제 검증 |

---

## 9. 리스크 및 대응 방안

### 9.1 가맹점 심사 지연

| 리스크 | 영향 | 대응 방안 |
|--------|------|----------|
| 심사 3-5일 이상 | 전체 일정 지연 | 테스트 환경에서 최대한 개발 완료, 프로덕션 키만 교체 |

### 9.2 결제 API 연동 실패

| 리스크 | 영향 | 대응 방안 |
|--------|------|----------|
| API 연동 오류 | 결제 불가 | 토스 개발자 지원 문의, 테스트 카드로 충분한 테스트 |

### 9.3 보안 취약점

| 리스크 | 영향 | 대응 방안 |
|--------|------|----------|
| 결제 보안 취약점 | 금융 사고 | S4S1 보안 검증 철저, Rate Limiting 필수 |

---

## 10. Stage Gate 검증 기준

### 10.1 필수 완료 항목

- [ ] 10개 Task 모두 Completed
- [ ] 결제 승인 API 동작 확인
- [ ] 빌링키 발급 동작 확인
- [ ] 자동결제 Cron 동작 확인
- [ ] 웹훅 수신 확인
- [ ] 보안 체크리스트 완료
- [ ] 테스트 커버리지 80% 이상
- [ ] E2E 테스트 모두 통과

### 10.2 PO 테스트 가이드 (Stage Gate 시)

```
[테스트 1: 결제 플로우]
1. https://ssalworks.ai.kr/subscription/payment.html 접속
2. 테스트 카드로 결제 진행
3. 성공 페이지 확인
4. Supabase에서 결제 내역 확인

[테스트 2: 구독 활성화]
1. 결제 후 대시보드 접속
2. 구독 상태 'active' 확인
3. AI 기능 사용 가능 확인

[테스트 3: 웹훅 동작]
1. 토스 개발자센터 > 웹훅 테스트
2. 웹훅 수신 로그 확인
```

---

## 11. 실행 순서 요약 (Order Sheet 작성 가이드)

### Phase 1 Order
```json
{
  "phase": 1,
  "tasks": ["S4M1", "S4O1"],
  "type": "Human-AI",
  "note": "S4O1 테스트 환경 완료 후 Phase 2 시작 가능"
}
```

### Phase 2 Order
```json
{
  "phase": 2,
  "tasks": ["S4BI1", "S4F1", "S4F2"],
  "type": "AI-Only (병렬)",
  "prerequisite": "S4O1 테스트 API 키 발급"
}
```

### Phase 3 Order
```json
{
  "phase": 3,
  "tasks": ["S4BA1", "S4BA2"],
  "type": "AI-Only (순차)",
  "prerequisite": "S4BI1 완료"
}
```

### Phase 4 Order
```json
{
  "phase": 4,
  "tasks": ["S4S1", "S4T1", "S4T2"],
  "type": "AI-Only (순차)",
  "prerequisite": "S4BA2 완료"
}
```

---

## 12. 결론

### S4 Stage 핵심 포인트

1. **병목**: S4O1 가맹점 심사 (3-5일)
2. **핵심 Task**: S4BA1 결제 API (가장 복잡)
3. **병렬 가능**: S4BI1, S4F1, S4F2
4. **PO 협력**: S4M1, S4O1 (초반 집중)

### 권장 실행 전략

```
Day 1: S4M1 (MVP 검토) + S4O1 시작 (테스트 환경)
Day 2-3: S4BI1, S4F1, S4F2 (병렬)
Day 4-5: S4BA1, S4BA2 (순차)
Day 6: S4S1, S4T1, S4T2
Day 7: Stage Gate 검증
```

> ⏳ **S4O1 가맹점 심사 완료까지**: 테스트 환경에서 개발 완료
> ✅ **가맹점 승인 후**: 프로덕션 키 교체만 하면 즉시 운영 가능

---

**작성**: Main Agent (Claude Code)
**상태**: 연구 완료, Order Sheet 대기
