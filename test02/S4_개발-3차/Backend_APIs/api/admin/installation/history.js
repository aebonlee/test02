/**
 * @task S4BA2
 * @description 입금 내역 조회 API (관리자용)
 * @route GET /api/admin/installation/history
 *
 * 기능:
 * - 관리자 권한 필수 (is_admin 체크)
 * - 전체 입금 내역 조회 (모든 상태: pending, confirmed, rejected)
 * - 정렬: 신청일시 내림차순 (최신 것부터)
 * - CSV 내보내기 지원 (쿼리 파라미터 ?format=csv)
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

    // 쿼리 파라미터 추출
    const { format, status, startDate, endDate } = req.query;

    // 쿼리 빌더 시작
    let query = supabase
      .from('installation_payments')
      .select(`
        id,
        project_id,
        user_id,
        amount,
        depositor_name,
        bank_name,
        deposit_date,
        status,
        requested_at,
        confirmed_at,
        rejected_at,
        admin_memo,
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
      `);

    // 필터 적용
    if (status) {
      query = query.eq('status', status);
    }

    if (startDate) {
      query = query.gte('requested_at', startDate);
    }

    if (endDate) {
      query = query.lte('requested_at', endDate);
    }

    // 정렬: 최신 것부터
    query = query.order('requested_at', { ascending: false });

    const { data: payments, error: paymentsError } = await query;

    if (paymentsError) {
      console.error('입금 내역 조회 오류:', paymentsError);
      return res.status(500).json({ error: '입금 내역 조회 중 오류가 발생했습니다.' });
    }

    // 응답 데이터 포맷팅
    const formattedPayments = payments.map(payment => ({
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
      status: payment.status,
      requestedAt: payment.requested_at,
      confirmedAt: payment.confirmed_at,
      rejectedAt: payment.rejected_at,
      adminMemo: payment.admin_memo
    }));

    // CSV 내보내기
    if (format === 'csv') {
      const csvHeader = [
        'ID',
        '프로젝트명',
        '사용자명',
        '사용자 이메일',
        '입금액',
        '입금자명',
        '은행',
        '입금일',
        '상태',
        '신청일시',
        '확인일시',
        '반려일시',
        '관리자 메모'
      ].join(',');

      const csvRows = formattedPayments.map(payment => [
        payment.id,
        `"${payment.projectName}"`,
        `"${payment.userName || ''}"`,
        payment.userEmail,
        payment.amount,
        `"${payment.depositorName}"`,
        `"${payment.bankName}"`,
        payment.depositDate,
        payment.status,
        payment.requestedAt,
        payment.confirmedAt || '',
        payment.rejectedAt || '',
        `"${payment.adminMemo || ''}"`
      ].join(','));

      const csvContent = [csvHeader, ...csvRows].join('\n');

      // CSV 파일 다운로드 응답
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="installation_payments_${new Date().toISOString().slice(0, 10)}.csv"`);
      res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));

      // UTF-8 BOM 추가 (엑셀에서 한글 깨짐 방지)
      return res.status(200).send('\uFEFF' + csvContent);
    }

    // JSON 응답
    return res.status(200).json({
      success: true,
      count: formattedPayments.length,
      payments: formattedPayments,
      summary: {
        total: formattedPayments.length,
        pending: formattedPayments.filter(p => p.status === 'pending').length,
        confirmed: formattedPayments.filter(p => p.status === 'confirmed').length,
        rejected: formattedPayments.filter(p => p.status === 'rejected').length,
        totalAmount: formattedPayments
          .filter(p => p.status === 'confirmed')
          .reduce((sum, p) => sum + p.amount, 0)
      }
    });

  } catch (error) {
    console.error('입금 내역 조회 오류:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
