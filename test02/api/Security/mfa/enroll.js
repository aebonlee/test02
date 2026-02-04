/**
 * @task S2S-2FA
 * 2FA 등록 API - TOTP QR 코드 생성
 * POST /api/auth/mfa/enroll
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 인증 확인
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: '인증이 필요합니다' });
        }

        const token = authHeader.replace('Bearer ', '');

        // Supabase Auth API로 MFA 등록 시작
        const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/factors`, {
            method: 'POST',
            headers: {
                'apikey': process.env.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                friendly_name: 'SSAL Works 2FA',
                factor_type: 'totp'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error_description || data.message || '2FA 등록 시작 실패'
            });
        }

        // QR 코드 URL과 비밀키 반환
        return res.status(200).json({
            success: true,
            factor_id: data.id,
            totp: {
                qr_code: data.totp.qr_code,
                secret: data.totp.secret,
                uri: data.totp.uri
            },
            message: 'QR 코드를 스캔하고 인증 코드를 입력하세요'
        });

    } catch (error) {
        console.error('MFA enroll error:', error);
        return res.status(500).json({
            error: '2FA 등록 실패',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
