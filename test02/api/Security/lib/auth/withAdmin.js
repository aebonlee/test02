/**
 * @task S4S1
 * 관리자 권한 확인 미들웨어
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function withAdmin(handler) {
    return async (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization required' });
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser(token);

            if (authError || !user) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('role, is_admin')
                .eq('id', user.id)
                .single();

            if (profileError || !profile) {
                return res.status(401).json({ error: 'User profile not found' });
            }

            if (profile.role !== 'admin' && !profile.is_admin) {
                return res.status(403).json({
                    error: 'Admin access required',
                    message: '관리자 권한이 필요합니다'
                });
            }

            req.user = {
                id: user.id,
                email: user.email,
                role: profile.role,
                is_admin: profile.is_admin
            };

            return handler(req, res);
        } catch (error) {
            console.error('Admin auth error:', error);
            return res.status(500).json({ error: 'Authentication failed' });
        }
    };
}

module.exports = { withAdmin };
