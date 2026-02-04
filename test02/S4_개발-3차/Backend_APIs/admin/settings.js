/**
 * @task S4BA
 * @description 관리자 설정 저장/조회 API
 * @route GET/POST /api/Backend_APIs/admin/settings
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // GET: 설정 조회
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('admin_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) throw error;

            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error('Settings fetch error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // POST: 설정 저장
    if (req.method === 'POST') {
        try {
            const settings = req.body;

            // 필수 필드 검증
            if (!settings || typeof settings !== 'object') {
                return res.status(400).json({ error: 'Invalid settings data' });
            }

            // DB에 존재하는 컬럼만 허용
            const allowedFields = [
                'platform_name', 'admin_email', 'timezone',
                'notify_inquiry', 'notify_payment', 'notify_signup',
                'notify_installation_request',
                'install_fee', 'monthly_fee', 'credit_price', 'last_backup'
            ];

            const filteredSettings = {};
            for (const key of allowedFields) {
                if (settings[key] !== undefined) {
                    filteredSettings[key] = settings[key];
                }
            }

            // updated_at 자동 설정
            filteredSettings.updated_at = new Date().toISOString();

            const { data, error } = await supabase
                .from('admin_settings')
                .update(filteredSettings)
                .eq('id', 1)
                .select();

            if (error) throw error;

            return res.status(200).json({
                success: true,
                message: '설정이 저장되었습니다.',
                data: data[0]
            });
        } catch (error) {
            console.error('Settings save error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
