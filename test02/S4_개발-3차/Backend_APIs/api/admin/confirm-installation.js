/**
 * @task S4BA5
 * @description 입금 확인 API (관리자용)
 * POST /api/admin/confirm-installation
 *
 * 기능:
 * - 관리자 권한 필수 (isAdmin 체크)
 * - 입금 상태 업데이트 (confirm/reject)
 * - 프로젝트 installation_paid 플래그 업데이트
 * - 사용자 이메일 알림
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
    const { paymentId, action, memo } = req.body;

    if (!paymentId || !action) {
      return res.status(400).json({
        error: '필수 정보가 누락되었습니다.',
        required: ['paymentId', 'action']
      });
    }

    if (!['confirm', 'reject'].includes(action)) {
      return res.status(400).json({
        error: '유효하지 않은 action입니다.',
        validActions: ['confirm', 'reject']
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
    const newStatus = action === 'confirm' ? 'confirmed' : 'rejected';
    const { error: updateError } = await supabase
      .from('installation_payments')
      .update({
        status: newStatus,
        confirmed_at: action === 'confirm' ? new Date().toISOString() : null,
        admin_memo: memo || null
      })
      .eq('id', paymentId);

    if (updateError) {
      console.error('상태 업데이트 오류:', updateError);
      return res.status(500).json({ error: '상태 업데이트 중 오류가 발생했습니다.' });
    }

    // confirm인 경우 프로젝트 installation_paid 플래그 업데이트
    if (action === 'confirm') {
      const { error: projectUpdateError } = await supabase
        .from('projects')
        .update({
          installation_paid: true,
          installation_paid_at: new Date().toISOString()
        })
        .eq('id', payment.project_id);

      if (projectUpdateError) {
        console.error('프로젝트 업데이트 오류:', projectUpdateError);
        // 롤백 처리
        await supabase
          .from('installation_payments')
          .update({ status: 'pending', confirmed_at: null })
          .eq('id', paymentId);

        return res.status(500).json({ error: '프로젝트 업데이트 중 오류가 발생했습니다.' });
      }
    }

    // 사용자 이메일 알림
    try {
      const userEmail = payment.users.email;
      const projectName = payment.projects.project_name;

      let emailSubject, emailHtml;

      if (action === 'confirm') {
        emailSubject = `[SSAL Grid] 설치비 입금이 확인되었습니다 - ${projectName}`;
        emailHtml = `
          <h2>설치비 입금이 확인되었습니다</h2>
          <p>안녕하세요, ${payment.users.display_name || '고객'}님</p>
          <p><strong>프로젝트:</strong> ${projectName}</p>
          <p><strong>입금액:</strong> ${payment.amount.toLocaleString()}원</p>
          <p><strong>입금자명:</strong> ${payment.depositor_name}</p>
          <p><strong>확인일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
          ${memo ? `<p><strong>관리자 메모:</strong> ${memo}</p>` : ''}
          <br>
          <p>이제 프로젝트를 정상적으로 사용하실 수 있습니다.</p>
          <p>감사합니다.</p>
        `;
      } else {
        emailSubject = `[SSAL Grid] 설치비 입금 신청이 반려되었습니다 - ${projectName}`;
        emailHtml = `
          <h2>설치비 입금 신청이 반려되었습니다</h2>
          <p>안녕하세요, ${payment.users.display_name || '고객'}님</p>
          <p><strong>프로젝트:</strong> ${projectName}</p>
          <p><strong>입금자명:</strong> ${payment.depositor_name}</p>
          <p><strong>반려일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
          ${memo ? `<p><strong>반려 사유:</strong> ${memo}</p>` : ''}
          <br>
          <p>자세한 사항은 고객센터로 문의해주세요.</p>
        `;
      }

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
      message: action === 'confirm'
        ? '입금이 확인되었습니다.'
        : '입금 신청이 반려되었습니다.',
      payment: {
        id: payment.id,
        status: newStatus,
        projectId: payment.project_id,
        projectName: payment.projects.project_name
      }
    });

  } catch (error) {
    console.error('입금 확인 오류:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
