/**
 * @task S4BA2
 * @description 입금 거부 API (관리자용)
 * @route POST /api/admin/installation/reject
 *
 * 기능:
 * - 관리자 권한 필수 (is_admin 체크)
 * - 입금 신청 거부 처리
 * - 사용자에게 거부 사유 이메일 발송
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS 헤더 설정
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

    // 요청 데이터 검증
    const { paymentId, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        error: '필수 정보가 누락되었습니다.',
        required: ['paymentId']
      });
    }

    // 입금 신청 정보 조회
    const { data: payment, error: paymentError } = await supabase
      .from('installation_payments')
      .select(`
        id,
        project_id,
        user_id,
        amount,
        depositor_name,
        bank_name,
        status,
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
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return res.status(404).json({ error: '입금 신청을 찾을 수 없습니다.' });
    }

    // 이미 처리된 신청인지 확인
    if (payment.status !== 'pending') {
      return res.status(400).json({
        error: '이미 처리된 입금 신청입니다.',
        currentStatus: payment.status
      });
    }

    // 상태 업데이트
    const { error: updateError } = await supabase
      .from('installation_payments')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        admin_memo: reason || null
      })
      .eq('id', paymentId);

    if (updateError) {
      console.error('상태 업데이트 오류:', updateError);
      return res.status(500).json({ error: '상태 업데이트 중 오류가 발생했습니다.' });
    }

    // 사용자 이메일 알림
    try {
      const userEmail = payment.users.email;
      const projectName = payment.projects.project_name;

      const emailSubject = `[SSAL Grid] 설치비 입금 신청이 반려되었습니다 - ${projectName}`;
      const emailHtml = `
        <h2>설치비 입금 신청이 반려되었습니다</h2>
        <p>안녕하세요, ${payment.users.display_name || '고객'}님</p>
        <br>
        <p><strong>프로젝트:</strong> ${projectName}</p>
        <p><strong>입금자명:</strong> ${payment.depositor_name}</p>
        <p><strong>신청 금액:</strong> ₩${payment.amount.toLocaleString()}</p>
        <p><strong>반려일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
        ${reason ? `<p><strong>반려 사유:</strong> ${reason}</p>` : ''}
        <br>
        <p>자세한 사항은 고객센터로 문의해주세요.</p>
        <p><strong>고객센터:</strong> support@ssalgrid.com</p>
      `;

      const emailResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmail,
          subject: emailSubject,
          html: emailHtml
        })
      });

      if (!emailResponse.ok) {
        console.error('사용자 이메일 발송 실패:', await emailResponse.text());
      }
    } catch (emailError) {
      console.error('이메일 발송 오류:', emailError);
      // 이메일 발송 실패는 치명적이지 않으므로 계속 진행
    }

    return res.status(200).json({
      success: true,
      message: '입금 신청이 반려되었습니다.',
      payment: {
        id: payment.id,
        status: 'rejected',
        projectId: payment.project_id,
        projectName: payment.projects.project_name
      }
    });

  } catch (error) {
    console.error('입금 거부 처리 오류:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
