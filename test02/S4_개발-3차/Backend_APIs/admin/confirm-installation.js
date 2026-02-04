/**
 * @task S4BA5
 * @description 입금 확인 API (관리자용)
 * POST /api/admin/confirm-installation
 *
 * 기능:
 * - 관리자 권한 필수 (isAdmin 체크)
 * - deposit_notifications 테이블에서 install_fee 타입 조회
 * - 입금 상태 업데이트 (confirm → confirmed / reject → rejected)
 * - 빌더 ID 생성 및 사용자 정보 업데이트
 * - 웰컴 크레딧 ₩50,000 지급
 * - 사용자 알림 (notifications 테이블)
 */

import { createClient } from '@supabase/supabase-js';

// 빌더 ID 일련번호 저장 (메모리 - 실제로는 DB 사용 권장)
const builderIdCounters = {};

// JS에서 빌더 ID 생성 (DB 함수 사용 불가시 폴백)
function generateBuilderIdJS(amount) {
  const now = new Date();
  const yearMonth = now.toISOString().slice(2, 4) + String(now.getMonth() + 1).padStart(2, '0');

  // 월별 카운터
  if (!builderIdCounters[yearMonth]) {
    builderIdCounters[yearMonth] = 0;
  }
  builderIdCounters[yearMonth]++;
  const seq = String(builderIdCounters[yearMonth]).padStart(6, '0');

  // 금액 코드
  const amountCodes = {
    3000000: 'TH',
    4000000: 'FO',
    5000000: 'FI',
    6000000: 'SI',
    7000000: 'SE',
    8000000: 'EI',
    9000000: 'NI'
  };
  const amountCode = amountCodes[amount] || 'XX';

  return yearMonth + seq + amountCode;
}

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
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData || !adminData.is_admin) {
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

    // 입금 신청 정보 조회 (deposit_notifications 테이블)
    const { data: payment, error: paymentError } = await supabase
      .from('deposit_notifications')
      .select('*')
      .eq('id', paymentId)
      .eq('deposit_type', 'install_fee')
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

    // user_id로 사용자 정보 조회
    const { data: userData, error: userFetchError } = await supabase
      .from('users')
      .select('id, email, name, nickname, real_name')
      .eq('user_id', payment.user_id)
      .single();

    if (userFetchError || !userData) {
      console.error('사용자 조회 오류:', userFetchError);
    }

    // payment 객체에 사용자 정보 병합
    payment.users = userData || { email: null, name: null };
    payment.userUUID = userData?.id;

    // 상태 업데이트
    const newStatus = action === 'confirm' ? 'confirmed' : 'rejected';
    const { error: updateError } = await supabase
      .from('deposit_notifications')
      .update({
        status: newStatus,
        confirmed_at: action === 'confirm' ? new Date().toISOString() : null,
        confirmed_by: user.id,
        admin_note: memo || null
      })
      .eq('id', paymentId);

    if (updateError) {
      console.error('상태 업데이트 오류:', updateError);
      return res.status(500).json({ error: '상태 업데이트 중 오류가 발생했습니다.' });
    }

    // confirm인 경우 추가 처리
    let generatedBuilderId = null;
    if (action === 'confirm') {
      // 사용자 UUID 확인
      if (!payment.userUUID) {
        console.error('사용자 UUID를 찾을 수 없습니다.');
        return res.status(500).json({ error: '사용자 정보를 찾을 수 없습니다.' });
      }

      // 2. 빌더 ID 생성 (YYMMNNNNNNXX 형식)
      try {
        const { data: builderIdResult, error: builderIdError } = await supabase
          .rpc('generate_builder_id', { amount: payment.amount });

        if (builderIdError) {
          console.error('빌더 ID 생성 오류:', builderIdError);
          // DB 함수가 없으면 JS에서 직접 생성
          generatedBuilderId = generateBuilderIdJS(payment.amount);
        } else {
          generatedBuilderId = builderIdResult;
        }
      } catch (err) {
        console.error('빌더 ID 생성 예외:', err);
        generatedBuilderId = generateBuilderIdJS(payment.amount);
      }

      // 3. 사용자 정보 업데이트 (빌더 ID + 설치비 납부 상태 + 웰컴 크레딧)
      const welcomeCredits = 50000; // ₩50,000 웰컴 크레딧

      // 먼저 현재 크레딧 잔액 조회
      const { data: currentUser } = await supabase
        .from('users')
        .select('credit_balance')
        .eq('id', payment.userUUID)
        .single();

      const newBalance = (currentUser?.credit_balance || 0) + welcomeCredits;

      // 사용자 정보 업데이트
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          builder_id: generatedBuilderId,
          installation_fee_paid: true,
          installation_date: new Date().toISOString(),
          credit_balance: newBalance,
          subscription_status: 'active'
        })
        .eq('id', payment.userUUID);

      if (userUpdateError) {
        console.error('사용자 업데이트 오류:', userUpdateError);
      }

      // 4. 크레딧 거래 내역 기록
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: payment.userUUID,
          amount: welcomeCredits,
          type: 'bonus',
          description: '빌더 계정 개설 웰컴 크레딧',
          balance_after: newBalance,
          created_at: new Date().toISOString()
        });
    }

    // 사용자 알림 (user_notifications 테이블에 저장)
    try {
      const notificationMessage = action === 'confirm'
        ? `빌더 계정이 개설되었습니다. (빌더 ID: ${generatedBuilderId}, 웰컴 크레딧 ₩50,000 지급)`
        : `빌더 계정 개설비 입금 신청이 반려되었습니다.${memo ? ` 사유: ${memo}` : ''}`;

      await supabase
        .from('user_notifications')
        .insert({
          user_id: payment.userUUID,
          notification_type: 'system',
          title: action === 'confirm' ? '🎉 빌더 계정 개설 완료' : '❌ 입금 신청 반려',
          message: notificationMessage,
          is_read: false,
          metadata: action === 'confirm'
            ? { builder_id: generatedBuilderId, welcome_credit: 50000 }
            : { reject_reason: memo || null }
        });
    } catch (notifyError) {
      console.error('알림 저장 오류:', notifyError);
      // 알림 저장 실패는 치명적이지 않으므로 계속 진행
    }

    return res.status(200).json({
      success: true,
      message: action === 'confirm'
        ? '빌더 계정이 개설되었습니다.'
        : '입금 신청이 반려되었습니다.',
      payment: {
        id: payment.id,
        status: newStatus,
        userId: payment.user_id,
        depositorName: payment.depositor_name,
        amount: payment.amount
      },
      ...(action === 'confirm' && {
        builder: {
          builderId: generatedBuilderId,
          welcomeCredits: 50000,
          subscriptionStatus: 'active'
        }
      })
    });

  } catch (error) {
    console.error('입금 확인 오류:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
