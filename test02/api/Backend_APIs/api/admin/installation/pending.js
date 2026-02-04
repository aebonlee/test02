/**
 * @task S4BA2
 * @description 입금 대기 목록 조회 API (관리자용)
 * @route GET /api/admin/installation/pending
 *
 * 기능:
 * - 관리자 권한 필수 (is_admin 체크)
 * - 입금 대기 중인 빌더 계정 개설비 목록 조회
 * - 정렬: 신청일시 오름차순 (오래된 것부터)
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS 헤더 설정
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
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    const token = authHeader.split(' ')[1];

    // Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    );

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({ error: '유효하지 않은 인증 정보입니다.' });
    }

    // 관리자 권한 확인
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (userError || !userData || !userData.is_admin) {
      return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
    }

    // 입금 대기 목록 조회
    const { data: pendingPayments, error: paymentsError } = await supabase
      .from('installation_payments')
      .select(`
        id,
        project_id,
        user_id,
        amount,
        depositor_name,
        bank_name,
        deposit_date,
        requested_at,
        projects (
          id,
          project_name,
          owner_id
        ),
        users (
          id,
          email,
          display_name
        )
      `)
      .eq('status', 'pending')
      .order('requested_at', { ascending: true });

    if (paymentsError) {
      console.error('입금 대기 목록 조회 오류:', paymentsError);
      return res.status(500).json({ error: '입금 대기 목록 조회 중 오류가 발생했습니다.' });
    }

    // 응답 데이터 포맷팅
    const formattedPayments = pendingPayments.map(payment => ({
      id: payment.id,
      projectId: payment.project_id,
      projectName: payment.projects.project_name,
      userId: payment.user_id,
      userEmail: payment.users.email,
      userName: payment.users.display_name,
      amount: payment.amount,
      depositorName: payment.depositor_name,
      bankName: payment.bank_name,
      depositDate: payment.deposit_date,
      requestedAt: payment.requested_at
    }));

    return res.status(200).json({
      success: true,
      count: formattedPayments.length,
      payments: formattedPayments
    });

  } catch (error) {
    console.error('입금 대기 목록 조회 오류:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
