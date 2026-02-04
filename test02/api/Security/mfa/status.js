/**
 * @task S2S-2FA
 * 2FA 상태 조회 API
 * GET /api/auth/mfa/status
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 인증 확인
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: '인증이 필요합니다' });
        }

        const token = authHeader.replace('Bearer ', '');

        // MFA factors 조회
        const response = await fetch(
            `${process.env.SUPABASE_URL}/auth/v1/factors`,
            {
                method: 'GET',
                headers: {
                    'apikey': process.env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error_description || data.message || '2FA 상태 조회 실패'
            });
        }

        // 활성화된 TOTP factor 찾기
        const totpFactors = (data || []).filter(f => f.factor_type === 'totp');
        const verifiedFactor = totpFactors.find(f => f.status === 'verified');
        const pendingFactor = totpFactors.find(f => f.status === 'unverified');

        return res.status(200).json({
            success: true,
            enabled: !!verifiedFactor,
            factor_id: verifiedFactor?.id || pendingFactor?.id || null,
            status: verifiedFactor ? 'verified' : (pendingFactor ? 'pending' : 'not_enrolled'),
            friendly_name: verifiedFactor?.friendly_name || pendingFactor?.friendly_name || null,
            created_at: verifiedFactor?.created_at || pendingFactor?.created_at || null
        });

    } catch (error) {
        console.error('MFA status error:', error);
        return res.status(500).json({
            error: '2FA 상태 조회 실패',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
