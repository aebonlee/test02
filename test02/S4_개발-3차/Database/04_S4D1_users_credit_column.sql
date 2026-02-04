-- @task S4D1
-- S4D1: users 테이블에 크레딧 관련 컬럼 추가

ALTER TABLE users ADD COLUMN IF NOT EXISTS credit_balance INTEGER DEFAULT 0;

-- 크레딧 차감 함수
CREATE OR REPLACE FUNCTION deduct_credit(
    p_user_id UUID,
    p_amount INTEGER,
    p_ai_model VARCHAR(50)
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- 현재 잔액 조회 (FOR UPDATE로 락)
    SELECT credit_balance INTO v_current_balance
    FROM users
    WHERE id = p_user_id
    FOR UPDATE;

    IF v_current_balance IS NULL THEN
        RETURN QUERY SELECT false, 0, '사용자를 찾을 수 없습니다'::TEXT;
        RETURN;
    END IF;

    IF v_current_balance < p_amount THEN
        RETURN QUERY SELECT false, v_current_balance, '크레딧이 부족합니다'::TEXT;
        RETURN;
    END IF;

    v_new_balance := v_current_balance - p_amount;

    -- 잔액 업데이트
    UPDATE users SET credit_balance = v_new_balance WHERE id = p_user_id;

    -- 이력 기록
    INSERT INTO credit_history (user_id, type, amount, balance_after, ai_model)
    VALUES (p_user_id, 'usage', -p_amount, v_new_balance, p_ai_model);

    RETURN QUERY SELECT true, v_new_balance, NULL::TEXT;
END;
$$;
