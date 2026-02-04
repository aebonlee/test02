// Task ID: S2BA1
// Google OAuth 시작 엔드포인트
// Supabase Auth를 사용한 Google OAuth 로그인 시작

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 메서드만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    // Supabase 클라이언트 초기화
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // 리다이렉트 URL 설정 (환경에 따라 다름)
    const redirectTo = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/auth/google/callback`
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/google/callback`;

    // Supabase Auth를 통한 Google OAuth 시작
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google OAuth 시작 오류:', error);
      return res.status(400).json({
        error: 'Google OAuth 시작 실패',
        details: error.message,
      });
    }

    // Google OAuth URL로 리다이렉트
    if (data?.url) {
      return res.redirect(302, data.url);
    }

    // URL이 없는 경우
    return res.status(500).json({
      error: 'OAuth URL 생성 실패',
    });
  } catch (err) {
    console.error('서버 오류:', err);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
}
