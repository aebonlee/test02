// Task ID: S2BA1
// Google OAuth 콜백 엔드포인트
// Google 인증 후 콜백을 처리하고 세션을 설정

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
    // URL에서 코드와 에러 파라미터 추출
    const { code, error: authError, error_description } = req.query;

    // OAuth 인증 실패 확인
    if (authError) {
      console.error('Google OAuth 에러:', authError, error_description);

      // 프론트엔드로 에러와 함께 리다이렉트
      const errorRedirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/login?error=${encodeURIComponent(authError)}&error_description=${encodeURIComponent(error_description || 'Unknown error')}`;
      return res.redirect(302, errorRedirectUrl);
    }

    // 코드가 없는 경우
    if (!code) {
      const errorRedirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/login?error=missing_code`;
      return res.redirect(302, errorRedirectUrl);
    }

    // Supabase 클라이언트 초기화
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // OAuth 코드를 세션으로 교환
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('코드 교환 오류:', exchangeError);

      const errorRedirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/login?error=exchange_failed&error_description=${encodeURIComponent(exchangeError.message)}`;
      return res.redirect(302, errorRedirectUrl);
    }

    // 세션 확인
    if (!data?.session) {
      const errorRedirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/login?error=no_session`;
      return res.redirect(302, errorRedirectUrl);
    }

    const { session, user } = data;

    // 세션을 쿠키에 저장 (HttpOnly, Secure)
    const maxAge = 60 * 60 * 24 * 7; // 7일
    res.setHeader('Set-Cookie', [
      `sb-access-token=${session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`,
      `sb-refresh-token=${session.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`,
    ]);

    // users 테이블에 사용자 정보 업데이트/삽입
    try {
      // 기존 사용자 확인 (auth id로 조회)
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, user_id')
        .eq('id', user.id)
        .single();

      if (existingUser) {
        // 기존 사용자 - 프로필 정보만 업데이트
        const { error: updateError } = await supabase
          .from('users')
          .update({
            name: user.user_metadata?.full_name || user.user_metadata?.name || existingUser.name,
            nickname: user.user_metadata?.nickname || user.user_metadata?.full_name || user.user_metadata?.name || existingUser.nickname,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('사용자 정보 업데이트 실패:', updateError);
        }
      } else {
        // 신규 사용자 - user_id 생성 후 삽입
        // 8자리 랜덤 영숫자 (예: A3B5C7D9)
        const generateUserId = () => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let result = '';
          for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return result;
        };

        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            user_id: generateUserId(),
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            nickname: user.user_metadata?.nickname || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            real_name: user.user_metadata?.real_name || user.user_metadata?.full_name || user.user_metadata?.name || null,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
            subscription_status: 'free',
            installation_fee_paid: false,
            credit_balance: 0,
            role: 'user'
          });

        if (insertError) {
          console.error('신규 사용자 생성 실패:', insertError);
        } else {
          // 신규 가입 알림 (비동기, 실패해도 무시)
          fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/Backend_APIs/admin-notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'signup',
              data: {
                email: user.email,
                nickname: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
                provider: 'Google'
              }
            })
          }).catch(err => console.log('Admin notify skipped:', err));
        }
      }
    } catch (dbError) {
      console.error('DB 처리 중 예외 발생:', dbError);
      // 로그만 남기고 계속 진행
    }

    // 로그인 성공 - 메인 페이지로 리다이렉트
    const successRedirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/`;
    return res.redirect(302, successRedirectUrl);

  } catch (err) {
    console.error('콜백 처리 중 서버 오류:', err);

    const errorRedirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/login?error=server_error&error_description=${encodeURIComponent(err.message)}`;
    return res.redirect(302, errorRedirectUrl);
  }
}
