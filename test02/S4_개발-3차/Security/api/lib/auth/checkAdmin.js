/**
 * @task S4S1
 * 관리자 상태 확인 헬퍼
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function isAdmin(userId) {
    const { data, error } = await supabase
        .from('users')
        .select('role, is_admin')
        .eq('id', userId)
        .single();

    if (error || !data) return false;
    return data.role === 'admin' || data.is_admin === true;
}

module.exports = { isAdmin };
