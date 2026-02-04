-- =====================================================
-- Users 테이블 구독 관리 컬럼 추가
-- =====================================================
-- 작성일: 2025-12-11
-- Agenda: #6 플랫폼 이용료 & 결제 관리
-- 목적: 구독 일시정지/해지 관리를 위한 컬럼 추가
-- =====================================================

-- 일시정지 관련 컬럼
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS subscription_paused_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS subscription_pause_end_date TIMESTAMPTZ DEFAULT NULL;

-- 해지 관련 컬럼
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS subscription_cancelled_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS data_deletion_scheduled_at TIMESTAMPTZ DEFAULT NULL;

-- 컬럼 설명 추가
COMMENT ON COLUMN public.users.subscription_paused_at IS '구독 일시정지 시작일';
COMMENT ON COLUMN public.users.subscription_pause_end_date IS '구독 일시정지 만료일 (최대 3개월)';
COMMENT ON COLUMN public.users.subscription_cancelled_at IS '구독 해지일';
COMMENT ON COLUMN public.users.data_deletion_scheduled_at IS '데이터 삭제 예정일 (해지 후 90일)';

-- 완료 확인
SELECT '구독 관리 컬럼 추가 완료' as status;

-- 추가된 컬럼 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('subscription_paused_at', 'subscription_pause_end_date', 'subscription_cancelled_at', 'data_deletion_scheduled_at')
ORDER BY column_name;
