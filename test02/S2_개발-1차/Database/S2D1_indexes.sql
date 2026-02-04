-- ================================================================
-- S2D1: 데이터베이스 인덱스 최적화
-- ================================================================
-- Task ID: S2D1
-- 작성일: 2025-12-14
-- 목적: 자주 사용하는 쿼리에 대한 데이터베이스 인덱스 최적화
-- 의존성: S1D1 (DB 스키마 확정) 완료
-- ================================================================

-- ================================================================
-- 1. 현재 인덱스 현황 조회 (실행 전 확인용)
-- ================================================================
-- SELECT tablename, indexname, indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;

-- ================================================================
-- 2. users 테이블 인덱스
-- ================================================================
-- 기존 인덱스:
--   ✅ idx_users_email (email) - 로그인 검색
--   ✅ idx_users_subscription_status (subscription_status) - 구독 상태별 조회
--   ✅ idx_users_user_id (user_id) - 사용자 ID 검색
--   ✅ idx_users_nickname (nickname) - 닉네임 검색
--   ✅ idx_users_installation_fee_paid (installation_fee_paid) - 설치비 납부 필터
--   ✅ idx_users_created_at (created_at) - 가입일 정렬

-- 추가 인덱스 (필요시)
-- 역할별 조회 (Admin 대시보드용)
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 최근 로그인 정렬
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at DESC NULLS LAST);

-- 복합 인덱스: 구독상태 + 생성일 (구독자 목록 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_users_subscription_created
    ON users(subscription_status, created_at DESC);

-- ================================================================
-- 3. notices 테이블 인덱스
-- ================================================================
-- 기존 인덱스:
--   ✅ idx_notices_important (important) - 중요 공지 필터
--   ✅ idx_notices_created (created_at DESC) - 최신순 정렬

-- 추가 불필요 (기존 인덱스 충분)

-- ================================================================
-- 4. notice_reads 테이블 인덱스
-- ================================================================
-- 기존 인덱스:
--   ✅ idx_notice_reads_user (user_id) - 사용자별 읽음 조회
--   ✅ idx_notice_reads_notice (notice_id) - 공지별 읽음 조회
--   ✅ idx_notice_reads_user_notice (user_id, notice_id) - 복합 인덱스

-- 추가 불필요 (기존 인덱스 충분)

-- ================================================================
-- 5. learning_contents 테이블 인덱스
-- ================================================================
-- 기존 인덱스:
--   ✅ idx_learning_depth (depth1, depth2, depth3) - 3단계 분류 조회
--   ✅ idx_learning_order (order_num) - 정렬 순서
--   ✅ idx_learning_status (status) - 게시 상태 필터

-- 추가 인덱스
-- 대분류별 조회 최적화 (단일 컬럼 인덱스)
CREATE INDEX IF NOT EXISTS idx_learning_depth1 ON learning_contents(depth1);

-- 대분류 + 상태 복합 인덱스 (게시된 콘텐츠만 조회)
CREATE INDEX IF NOT EXISTS idx_learning_depth1_status
    ON learning_contents(depth1, status)
    WHERE status = 'published';

-- ================================================================
-- 6. faqs 테이블 인덱스
-- ================================================================
-- 기존 인덱스:
--   ✅ idx_faqs_category (category) - 카테고리별 조회
--   ✅ idx_faqs_order (order_num) - 정렬 순서
--   ✅ idx_faqs_status (status) - 게시 상태 필터

-- 추가 인덱스
-- 카테고리 + 상태 복합 인덱스 (게시된 FAQ만 조회)
CREATE INDEX IF NOT EXISTS idx_faqs_category_status
    ON faqs(category, status)
    WHERE status = 'published';

-- ================================================================
-- 7. ai_service_pricing 테이블 인덱스
-- ================================================================
-- 기존 인덱스:
--   ✅ idx_ai_pricing_active (is_active) - 활성 서비스 필터

-- 추가 불필요 (테이블 크기 작음)

-- ================================================================
-- 8. credit_transactions 테이블 인덱스
-- ================================================================
-- 기존 인덱스:
--   ✅ idx_credit_trans_user (user_id) - 사용자별 거래 조회
--   ✅ idx_credit_trans_type (type) - 거래 유형별 조회
--   ✅ idx_credit_trans_created (created_at DESC) - 최신순 정렬
--   ✅ idx_credit_trans_service (related_service) - 서비스별 조회

-- 추가 인덱스
-- 사용자 + 날짜 복합 인덱스 (월별 거래 내역 조회)
CREATE INDEX IF NOT EXISTS idx_credit_trans_user_created
    ON credit_transactions(user_id, created_at DESC);

-- 사용자 + 유형 복합 인덱스 (충전/사용 내역 필터)
CREATE INDEX IF NOT EXISTS idx_credit_trans_user_type
    ON credit_transactions(user_id, type);

-- ================================================================
-- 9. ai_usage_log 테이블 인덱스
-- ================================================================
-- 기존 인덱스:
--   ✅ idx_ai_usage_user (user_id) - 사용자별 사용량 조회
--   ✅ idx_ai_usage_service (service_name) - 서비스별 조회
--   ✅ idx_ai_usage_created (created_at DESC) - 최신순 정렬

-- 추가 인덱스
-- 사용자 + 날짜 복합 인덱스 (일별/월별 사용량 집계)
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_created
    ON ai_usage_log(user_id, created_at DESC);

-- 서비스 + 날짜 복합 인덱스 (서비스별 일간 통계)
CREATE INDEX IF NOT EXISTS idx_ai_usage_service_created
    ON ai_usage_log(service_name, created_at DESC);

-- ================================================================
-- 10. ssalworks_tasks 테이블 인덱스 (Project Grid)
-- ================================================================
-- 기존 인덱스:
--   ✅ idx_ssalworks_task_id (task_id) - Task ID 검색
--   ✅ idx_ssalworks_stage (stage) - Stage별 조회
--   ✅ idx_ssalworks_area (area) - Area별 조회
--   ✅ idx_ssalworks_task_status (task_status) - 작업 상태별 조회
--   ✅ idx_ssalworks_verification_status (verification_status) - 검증 상태별 조회

-- 추가 인덱스
-- Stage + Status 복합 인덱스 (Stage별 진행 현황)
CREATE INDEX IF NOT EXISTS idx_ssalworks_stage_status
    ON ssalworks_tasks(stage, task_status);

-- Stage + Area 복합 인덱스 (Stage별 Area 현황)
CREATE INDEX IF NOT EXISTS idx_ssalworks_stage_area
    ON ssalworks_tasks(stage, area);

-- ================================================================
-- 11. 인덱스 생성 확인
-- ================================================================
SELECT 'S2D1 인덱스 최적화 완료!' as status;

-- 생성된 인덱스 수 확인
SELECT
    schemaname,
    COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY schemaname;

-- 테이블별 인덱스 현황
SELECT
    tablename,
    COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY index_count DESC;

-- ================================================================
-- 완료!
-- ================================================================
--
-- 추가된 인덱스 (11개):
--   1. idx_users_role
--   2. idx_users_last_login
--   3. idx_users_subscription_created
--   4. idx_learning_depth1
--   5. idx_learning_depth1_status (Partial)
--   6. idx_faqs_category_status (Partial)
--   7. idx_credit_trans_user_created
--   8. idx_credit_trans_user_type
--   9. idx_ai_usage_user_created
--  10. idx_ai_usage_service_created
--  11. idx_ssalworks_stage_status
--  12. idx_ssalworks_stage_area
--
-- 권장사항:
--   - 정기적인 VACUUM ANALYZE 실행 (주 1회)
--   - 미사용 인덱스 모니터링 (pg_stat_user_indexes 활용)
--   - 대용량 테이블 파티셔닝 검토 (ai_usage_log, credit_transactions)
--
-- ================================================================
