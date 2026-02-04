# SSALWorks v1.0 Database Schema

## Overview

SSALWorks v1.0의 데이터베이스 스키마 문서입니다. Supabase (PostgreSQL)를 사용합니다.

---

## 테이블 목록

| 테이블명 | 설명 | 관련 아젠다 |
|----------|------|------------|
| `users` | 사용자 정보 | #4 회원가입 |
| `notices` | 공지사항 | #1 공지사항 |
| `notice_reads` | 공지사항 읽음 기록 | #1 공지사항 |
| `learning_contents` | 학습용 콘텐츠 | #2 학습용 콘텐츠 |
| `faqs` | 자주 묻는 질문 | #3 FAQ |
| `projects` | 사용자 프로젝트 | #5 My Page |
| `manuals` | 플랫폼 매뉴얼 | #8 매뉴얼 |
| `payment_methods` | 결제 수단 | #6 결제 관리 |
| `billing_history` | 결제 내역 | #6 결제 관리 |
| `ai_service_pricing` | AI 서비스 가격 | #7 AI 크레딧 |
| `credit_transactions` | 크레딧 거래 내역 | #7 AI 크레딧 |
| `ai_usage_log` | AI 사용 로그 | #7 AI 크레딧 |
| `inquiries` | 고객 문의 | #9 고객 문의 |

---

## 1. users (사용자)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | Supabase Auth ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| `name` | VARCHAR(100) | NOT NULL | 이름 |
| `avatar_url` | TEXT | | 프로필 이미지 URL |
| `user_id` | VARCHAR(8) | UNIQUE | 표시용 ID (8자리 영숫자) |
| `nickname` | VARCHAR(20) | UNIQUE | 닉네임 |
| `real_name` | VARCHAR(50) | | 실명 (입금자명 확인용) |
| `phone` | VARCHAR(20) | | 연락처 |
| `role` | VARCHAR(20) | DEFAULT 'user' | 권한 (admin/user) |
| `subscription_status` | VARCHAR(20) | DEFAULT 'free' | 구독 상태 |
| `onboarding_start_date` | DATE | | 온보딩 시작일 |
| `onboarding_end_date` | DATE | | 온보딩 종료일 |
| `is_onboarding_completed` | BOOLEAN | DEFAULT false | 온보딩 완료 여부 |
| `installation_fee_paid` | BOOLEAN | DEFAULT false | 설치비 결제 여부 |
| `installation_date` | TIMESTAMPTZ | | 설치일 |
| `platform_fee_start_date` | TIMESTAMPTZ | | 플랫폼 이용료 시작일 |
| `credit_balance` | INTEGER | DEFAULT 0 | 크레딧 잔액 |
| `marketing_agreed` | BOOLEAN | DEFAULT false | 마케팅 동의 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정일 |
| `last_login_at` | TIMESTAMPTZ | | 마지막 로그인 |

### 구독 상태 값

| 값 | 설명 |
|----|------|
| `free` | 무료/미결제 |
| `active` | 활성 구독 |
| `paused` | 일시정지 |
| `suspended` | 정지 |
| `cancelled` | 해지 |

### 인덱스

- `idx_users_email` (email)
- `idx_users_user_id` (user_id)
- `idx_users_nickname` (nickname)
- `idx_users_subscription_status` (subscription_status)
- `idx_users_installation_fee_paid` (installation_fee_paid)
- `idx_users_created_at` (created_at)

---

## 2. notices (공지사항)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `title` | TEXT | NOT NULL | 제목 |
| `content` | TEXT | NOT NULL | 내용 |
| `important` | BOOLEAN | DEFAULT false | 중요 공지 여부 |
| `created_by` | UUID | FK → users(id) | 작성자 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정일 |

### 인덱스

- `idx_notices_important` (important)
- `idx_notices_created` (created_at DESC)

---

## 3. notice_reads (공지사항 읽음 기록)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users(id), NOT NULL | 사용자 |
| `notice_id` | UUID | FK → notices(id), NOT NULL | 공지사항 |
| `read_at` | TIMESTAMPTZ | DEFAULT NOW() | 읽은 시간 |

### 제약조건

- `unique_user_notice` UNIQUE(user_id, notice_id)

---

## 4. learning_contents (학습용 콘텐츠)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `depth1` | VARCHAR(100) | NOT NULL | 대분류 |
| `depth2` | VARCHAR(100) | | 중분류 |
| `depth3` | VARCHAR(100) | | 소분류 |
| `url` | VARCHAR(500) | | 학습 자료 링크 |
| `description` | TEXT | | 설명 |
| `display_order` | INT | DEFAULT 0 | 표시 순서 |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 생성일 |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | 수정일 |

### 인덱스

- `idx_learning_contents_depth1` (depth1)
- `idx_learning_contents_depth2` (depth1, depth2)
- `idx_learning_contents_depth3` (depth1, depth2, depth3)
- `idx_learning_contents_display_order` (display_order)
- `idx_learning_contents_search` GIN (전체 텍스트 검색)

---

## 5. faqs (자주 묻는 질문)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `depth1` | TEXT | NOT NULL | 대분류 (질문 카테고리) |
| `depth2` | TEXT | NOT NULL | 중분류 |
| `depth3` | TEXT | NOT NULL | 소분류 (실제 질문) |
| `answer` | TEXT | NOT NULL | 답변 (HTML 가능) |
| `description` | TEXT | | 추가 설명 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정일 |

### 인덱스

- `idx_faqs_depth1` (depth1)
- `idx_faqs_depth1_depth2` (depth1, depth2)
- `idx_faqs_search` GIN (전체 텍스트 검색)
- `idx_faqs_created_at` (created_at DESC)

---

## 6. projects (사용자 프로젝트)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `user_id` | VARCHAR(8) | NOT NULL | 사용자 ID |
| `project_id` | VARCHAR(20) | UNIQUE, NOT NULL | 프로젝트 ID (A3B5C7D9-P001 형식) |
| `project_name` | VARCHAR(100) | NOT NULL | 프로젝트명 |
| `description` | TEXT | | 설명 |
| `status` | VARCHAR(20) | DEFAULT 'in_progress' | 상태 |
| `progress` | INTEGER | DEFAULT 0 | 진행률 (0-100) |
| `current_stage` | INTEGER | DEFAULT 0 | 현재 단계 (0-5) |
| `total_stages` | INTEGER | DEFAULT 5 | 전체 단계 수 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정일 |
| `completed_at` | TIMESTAMPTZ | | 완료일 |

### 프로젝트 상태 값

| 값 | 설명 |
|----|------|
| `in_progress` | 진행 중 |
| `completed` | 완료 |
| `archived` | 보관됨 |

### 제약조건

- `idx_one_in_progress_per_user` - 사용자당 진행 중 프로젝트 1개만 허용

---

## 7. manuals (플랫폼 매뉴얼)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `category` | VARCHAR(100) | NOT NULL | 대분류 |
| `subcategory` | VARCHAR(100) | | 소분류 |
| `title` | VARCHAR(255) | NOT NULL | 제목 |
| `description` | TEXT | | 설명 |
| `url` | VARCHAR(500) | NOT NULL | GitHub Pages URL |
| `display_order` | INT | DEFAULT 0 | 표시 순서 |
| `is_active` | BOOLEAN | DEFAULT true | 활성화 여부 |
| `source_path` | VARCHAR(500) | | MD 파일 경로 |
| `content_hash` | VARCHAR(64) | | 파일 해시 (변경 감지) |
| `keywords` | TEXT[] | | 검색 키워드 배열 |
| `version` | VARCHAR(20) | | 매뉴얼 버전 |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 생성일 |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | 수정일 |

---

## 8. payment_methods (결제 수단)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `user_id` | VARCHAR(8) | FK → users(user_id), NOT NULL | 사용자 |
| `payment_type` | VARCHAR(10) | CHECK IN ('card', 'bank'), NOT NULL | 결제 수단 유형 |
| `card_last4` | VARCHAR(4) | | 카드번호 뒤 4자리 |
| `card_company` | VARCHAR(50) | | 카드사명 |
| `bank_name` | VARCHAR(50) | | 은행명 |
| `account_last4` | VARCHAR(4) | | 계좌번호 뒤 4자리 |
| `is_default` | BOOLEAN | DEFAULT true | 기본 결제 수단 |
| `toss_billing_key` | TEXT | | 토스 빌링키 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정일 |

---

## 9. billing_history (결제 내역)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `user_id` | VARCHAR(8) | FK → users(user_id), NOT NULL | 사용자 |
| `billing_type` | VARCHAR(20) | CHECK IN (...), NOT NULL | 결제 유형 |
| `amount` | INTEGER | CHECK > 0, NOT NULL | 금액 (원) |
| `status` | VARCHAR(20) | CHECK IN (...), NOT NULL | 결제 상태 |
| `billing_date` | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | 결제일 |
| `payment_method` | VARCHAR(100) | | 결제 수단 표시명 |
| `payment_method_id` | UUID | FK → payment_methods(id) | 결제 수단 ID |
| `receipt_url` | TEXT | | 영수증 URL |
| `failure_reason` | TEXT | | 실패 사유 |
| `retry_count` | INTEGER | DEFAULT 0 | 재시도 횟수 |
| `refund_amount` | INTEGER | | 환불 금액 |
| `refund_date` | TIMESTAMPTZ | | 환불일 |
| `refund_reason` | TEXT | | 환불 사유 |
| `toss_payment_key` | TEXT | | 토스 결제 키 |
| `notes` | TEXT | | 메모 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |

### 결제 유형 값

| 값 | 설명 |
|----|------|
| `platform_fee` | 월 플랫폼 이용료 |
| `credit_purchase` | 크레딧 충전 |
| `installation_fee` | 설치비 |

### 결제 상태 값

| 값 | 설명 |
|----|------|
| `paid` | 결제 완료 |
| `failed` | 결제 실패 |
| `refunded` | 환불 완료 |
| `pending` | 대기 중 |

---

## 10. ai_service_pricing (AI 서비스 가격)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `service_name` | VARCHAR(20) | PK, CHECK IN (...) | 서비스명 |
| `price_per_use` | INTEGER | CHECK > 0, NOT NULL | 사용자 가격 (원) |
| `api_cost` | INTEGER | CHECK > 0 | API 원가 (원) |
| `margin_percent` | INTEGER | DEFAULT 20, CHECK 0-100 | 마진율 (%) |
| `description` | TEXT | | 설명 |
| `is_active` | BOOLEAN | DEFAULT true | 활성화 여부 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정일 |
| `updated_by` | VARCHAR(8) | | 수정자 |

### 서비스명 값

| 값 | 설명 | 기본 가격 |
|----|------|----------|
| `ChatGPT` | GPT-4 기반 | ₩100/회 |
| `Gemini` | Gemini 2.5 Pro | ₩80/회 |
| `Perplexity` | 실시간 검색 | ₩50/회 |

---

## 11. credit_transactions (크레딧 거래 내역)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `user_id` | VARCHAR(8) | FK → users(user_id), NOT NULL | 사용자 |
| `type` | VARCHAR(10) | CHECK IN (...), NOT NULL | 거래 유형 |
| `amount` | INTEGER | NOT NULL | 금액 (+: 충전, -: 사용) |
| `balance_after` | INTEGER | CHECK >= 0, NOT NULL | 거래 후 잔액 |
| `description` | TEXT | | 설명 |
| `related_service` | VARCHAR(20) | CHECK IN (...) | 관련 AI 서비스 |
| `payment_id` | UUID | | 관련 결제 ID |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |

### 거래 유형 값

| 값 | 설명 |
|----|------|
| `charge` | 충전 |
| `spend` | 사용 |
| `refund` | 환불 |
| `bonus` | 보너스 지급 |
| `expire` | 만료 |

---

## 12. ai_usage_log (AI 사용 로그)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `user_id` | VARCHAR(8) | FK → users(user_id), NOT NULL | 사용자 |
| `service_name` | VARCHAR(20) | CHECK IN (...), NOT NULL | AI 서비스명 |
| `prompt` | TEXT | NOT NULL | 사용자 질문 |
| `response` | TEXT | | AI 응답 |
| `tokens_used` | INTEGER | | 토큰 사용량 |
| `cost` | INTEGER | CHECK > 0, NOT NULL | 비용 (크레딧) |
| `response_time_ms` | INTEGER | | 응답 시간 (ms) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |

---

## 13. inquiries (고객 문의)

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PK | |
| `inquiry_type` | TEXT | CHECK IN (...), NOT NULL | 문의 유형 |
| `name` | TEXT | NOT NULL | 문의자명 |
| `email` | TEXT | NOT NULL | 이메일 |
| `phone` | TEXT | | 연락처 |
| `title` | TEXT | NOT NULL | 제목 |
| `content` | TEXT | NOT NULL | 내용 |
| `status` | TEXT | DEFAULT 'pending', CHECK IN (...) | 상태 |
| `answer` | TEXT | | 답변 |
| `answered_at` | TIMESTAMPTZ | | 답변 시간 |
| `answered_by` | TEXT | | 답변자 ID |
| `priority` | TEXT | DEFAULT 'normal', CHECK IN (...) | 우선순위 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성일 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정일 |

### 문의 유형 값

| 값 | 설명 |
|----|------|
| `general` | 일반 문의 |
| `technical` | 기술 지원 |
| `payment` | 결제/환불 |
| `account` | 계정 |
| `partnership` | 제휴 |
| `other` | 기타 |

### 상태 값

| 값 | 설명 |
|----|------|
| `pending` | 대기 |
| `in_progress` | 처리 중 |
| `answered` | 답변 완료 |
| `closed` | 종료 |

### 우선순위 값

| 값 | 설명 |
|----|------|
| `low` | 낮음 |
| `normal` | 보통 |
| `high` | 높음 |
| `urgent` | 긴급 |

---

## ER 다이어그램 (관계)

```
users (1) ─────< (N) notices          (created_by)
users (1) ─────< (N) notice_reads     (user_id)
users (1) ─────< (N) projects         (user_id)
users (1) ─────< (N) payment_methods  (user_id)
users (1) ─────< (N) billing_history  (user_id)
users (1) ─────< (N) credit_transactions (user_id)
users (1) ─────< (N) ai_usage_log     (user_id)

payment_methods (1) ─────< (N) billing_history (payment_method_id)

notices (1) ─────< (N) notice_reads   (notice_id)
```

---

## SQL 파일 실행 순서

```
00_users_table.sql
01_notices_tables.sql
06_create_learning_contents.sql
07_learning_contents_rls.sql
09_create_faqs.sql
10_faqs_rls.sql
12_extend_users_table.sql
15_create_projects.sql
18_create_manuals.sql
19-1_create_payment_methods.sql
20_create_billing_history.sql
24_create_credit_tables.sql
28_create_inquiries_table.sql
```

---

## RLS 정책 요약

| 테이블 | 정책 |
|--------|------|
| `users` | 자신만 조회/수정, Admin 전체 조회 |
| `notices` | 전체 조회, Admin만 CUD |
| `notice_reads` | 자신의 기록만 조회/생성 |
| `learning_contents` | 전체 조회, Admin만 CUD |
| `faqs` | 전체 조회, Admin만 CUD |
| `projects` | 자신의 프로젝트만 CRUD |
| `manuals` | 전체 조회, Admin만 CUD |
| `payment_methods` | 자신만 CRUD |
| `billing_history` | 자신만 조회 |
| `credit_transactions` | 자신만 조회 |
| `ai_usage_log` | 자신만 조회 |
| `inquiries` | 생성 전체, 조회/수정 자신 또는 Admin |

---

**Last Updated**: 2025-12-13
**Version**: 1.0
