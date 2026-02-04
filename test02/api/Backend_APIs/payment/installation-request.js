/**
 * @task S4BA5
 * @description 빌더 계정 개설비 입금 신청 API
 * POST /api/payment/installation-request
 *
 * 기능:
 * - 사용자 인증 필수
 * - 프로젝트 소유권 확인
 * - 중복 신청 방지
 * - installation_payments 테이블에 저장
 * - 관리자 이메일 알림
 */

import { createClient } from '@supabase/supabase-js';

const INSTALLATION_FEE = 990000; // 99만원

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

    // 요청 데이터 검증
    const { projectId, depositorName, bankName } = req.body;

    if (!projectId || !depositorName || !bankName) {
      return res.status(400).json({
        error: '필수 정보가 누락되었습니다.',
        required: ['projectId', 'depositorName', 'bankName']
      });
    }

    // 프로젝트 소유권 확인
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, owner_id, project_name, installation_paid')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }

    if (project.owner_id !== user.id) {
      return res.status(403).json({ error: '프로젝트 소유자만 신청할 수 있습니다.' });
    }

    // 이미 빌더 계정 개설비가 확인된 프로젝트인지 확인
    if (project.installation_paid) {
      return res.status(400).json({ error: '이미 빌더 계정 개설비가 확인된 프로젝트입니다.' });
    }

    // 중복 신청 방지 - pending 상태의 신청이 있는지 확인
    const { data: existingRequest, error: checkError } = await supabase
      .from('installation_payments')
      .select('id, status')
      .eq('project_id', projectId)
      .eq('status', 'pending')
      .maybeSingle();

    if (checkError) {
      console.error('중복 확인 오류:', checkError);
      return res.status(500).json({ error: '중복 확인 중 오류가 발생했습니다.' });
    }

    if (existingRequest) {
      return res.status(400).json({
        error: '이미 대기 중인 입금 신청이 있습니다.',
        paymentId: existingRequest.id
      });
    }

    // installation_payments 테이블에 저장
    const { data: payment, error: insertError } = await supabase
      .from('installation_payments')
      .insert({
        project_id: projectId,
        user_id: user.id,
        amount: INSTALLATION_FEE,
        depositor_name: depositorName,
        bank_name: bankName,
        status: 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('저장 오류:', insertError);
      return res.status(500).json({ error: '입금 신청 저장 중 오류가 발생했습니다.' });
    }

    // 관리자 이메일 알림 발송
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@ssal-grid.com';
      const emailResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: adminEmail,
          subject: `[SSAL Grid] 새로운 빌더 계정 개설비 입금 신청 - ${project.project_name}`,
          html: `
            <h2>새로운 빌더 계정 개설비 입금 신청이 접수되었습니다</h2>
            <p><strong>프로젝트:</strong> ${project.project_name}</p>
            <p><strong>입금자명:</strong> ${depositorName}</p>
            <p><strong>은행:</strong> ${bankName}</p>
            <p><strong>금액:</strong> ${INSTALLATION_FEE.toLocaleString()}원</p>
            <p><strong>신청일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
            <br>
            <p>관리자 페이지에서 입금을 확인해주세요.</p>
          `
        })
      });

      if (!emailResponse.ok) {
        console.error('관리자 이메일 발송 실패:', await emailResponse.text());
      }
    } catch (emailError) {
      console.error('이메일 발송 오류:', emailError);
      // 이메일 발송 실패는 치명적이지 않으므로 계속 진행
    }

    return res.status(200).json({
      success: true,
      message: '빌더 계정 개설비 입금 신청이 완료되었습니다.',
      payment: {
        id: payment.id,
        amount: payment.amount,
        depositorName: payment.depositor_name,
        bankName: payment.bank_name,
        status: payment.status,
        requestedAt: payment.requested_at
      }
    });

  } catch (error) {
    console.error('빌더 계정 개설비 입금 신청 오류:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
