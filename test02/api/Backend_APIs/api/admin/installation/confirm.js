/**
 * @task S4BA2
 * @description 입금 확인 처리 API (관리자용)
 * @route POST /api/admin/installation/confirm
 *
 * 기능:
 * - 관리자 권한 필수 (is_admin 체크)
 * - 입금 확인 처리
 * - 초기 크레딧 ₩50,000 지급
 * - 구독 시작 (3개월 무료)
 * - 사용자 상태 활성화
 * - 이메일 알림 발송
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
    const { paymentId, memo } = req.body;

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

    // 트랜잭션 시작: 1. 입금 상태 업데이트
    const { error: updateError } = await supabase
      .from('installation_payments')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        admin_memo: memo || null
      })
      .eq('id', paymentId);

    if (updateError) {
      console.error('입금 상태 업데이트 오류:', updateError);
      return res.status(500).json({ error: '입금 상태 업데이트 중 오류가 발생했습니다.' });
    }

    // 2. 초기 크레딧 ₩50,000 지급
    const { error: creditError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: payment.user_id,
        amount: 50000,
        transaction_type: 'earned',
        description: '빌더 계정 개설비 입금 확인 - 초기 크레딧 지급',
        balance_after: 50000,
        created_at: new Date().toISOString()
      });

    if (creditError) {
      console.error('초기 크레딧 지급 오류:', creditError);
      // 롤백 처리
      await supabase
        .from('installation_payments')
        .update({ status: 'pending', confirmed_at: null })
        .eq('id', paymentId);

      return res.status(500).json({ error: '초기 크레딧 지급 중 오류가 발생했습니다.' });
    }

    // 3. 구독 시작 (3개월 무료)
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 3);

    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: payment.user_id,
        plan_type: 'standard',
        status: 'active',
        start_date: subscriptionStartDate.toISOString(),
        current_period_end: subscriptionEndDate.toISOString(),
        is_trial: true,
        trial_end_date: subscriptionEndDate.toISOString(),
        created_at: new Date().toISOString()
      });

    if (subscriptionError) {
      console.error('구독 시작 오류:', subscriptionError);
      // 롤백 처리
      await supabase.from('installation_payments').update({ status: 'pending', confirmed_at: null }).eq('id', paymentId);
      await supabase.from('credit_transactions').delete().eq('user_id', payment.user_id).eq('amount', 50000);

      return res.status(500).json({ error: '구독 시작 중 오류가 발생했습니다.' });
    }

    // 4. 사용자 상태 활성화
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.user_id);

    if (userUpdateError) {
      console.error('사용자 상태 업데이트 오류:', userUpdateError);
      // 치명적이지 않으므로 계속 진행
    }

    // 5. 프로젝트 installation_paid 플래그 업데이트
    const { error: projectUpdateError } = await supabase
      .from('projects')
      .update({
        installation_paid: true,
        installation_paid_at: new Date().toISOString()
      })
      .eq('id', payment.project_id);

    if (projectUpdateError) {
      console.error('프로젝트 업데이트 오류:', projectUpdateError);
      // 치명적이지 않으므로 계속 진행
    }

    // 6. 사용자 이메일 알림
    try {
      const userEmail = payment.users.email;
      const projectName = payment.projects.project_name;

      const emailSubject = `[SSAL Grid] 빌더 계정 개설비 입금이 확인되었습니다 - ${projectName}`;
      const emailHtml = `
        <h2>빌더 계정 개설비 입금이 확인되었습니다</h2>
        <p>안녕하세요, ${payment.users.display_name || '고객'}님</p>
        <br>
        <p><strong>프로젝트:</strong> ${projectName}</p>
        <p><strong>입금액:</strong> ₩${payment.amount.toLocaleString()}</p>
        <p><strong>입금자명:</strong> ${payment.depositor_name}</p>
        <p><strong>확인일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
        ${memo ? `<p><strong>관리자 메모:</strong> ${memo}</p>` : ''}
        <br>
        <h3>혜택 안내</h3>
        <ul>
          <li>초기 크레딧: <strong>₩50,000</strong> 지급 완료</li>
          <li>구독 기간: <strong>3개월 무료</strong> (${subscriptionEndDate.toLocaleDateString('ko-KR')}까지)</li>
          <li>서비스 상태: <strong>활성화</strong> 완료</li>
        </ul>
        <br>
        <p>이제 프로젝트를 정상적으로 사용하실 수 있습니다.</p>
        <p>감사합니다.</p>
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
      message: '입금이 확인되었습니다.',
      payment: {
        id: payment.id,
        status: 'confirmed',
        projectId: payment.project_id,
        projectName: payment.projects.project_name
      },
      benefits: {
        initialCredit: 50000,
        subscriptionMonths: 3,
        subscriptionEndDate: subscriptionEndDate.toISOString()
      }
    });

  } catch (error) {
    console.error('입금 확인 처리 오류:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
