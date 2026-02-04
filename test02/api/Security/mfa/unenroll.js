/**
 * @task S2S-2FA
 * 2FA 해제 API
 * DELETE /api/auth/mfa/unenroll
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 인증 확인
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: '인증이 필요합니다' });
        }

        const token = authHeader.replace('Bearer ', '');
        const { factor_id } = req.body || req.query;

        if (!factor_id) {
            return res.status(400).json({ error: 'factor_id가 필요합니다' });
        }

        // MFA factor 삭제
        const response = await fetch(
            `${process.env.SUPABASE_URL}/auth/v1/factors/${factor_id}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': process.env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const data = await response.json();
            return res.status(response.status).json({
                error: data.error_description || data.message || '2FA 해제 실패'
            });
        }

        return res.status(200).json({
            success: true,
            message: '2FA가 해제되었습니다'
        });

    } catch (error) {
        console.error('MFA unenroll error:', error);
        return res.status(500).json({
            error: '2FA 해제 실패',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
