/**
 * @task S4S1
 * 관리자 액션 감사 로그
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function logAdminAction(adminId, action, targetId, details) {
    try {
        await supabase.from('admin_audit_logs').insert({
            admin_id: adminId,
            action,
            target_id: targetId,
            details,
            created_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('Audit log error:', error);
    }
}

module.exports = { logAdminAction };
