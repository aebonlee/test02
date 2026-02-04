/**
 * @task S4BA5
 * @description 입금 신청 목록 조회 API (관리자용)
 * GET /api/admin/installation-list
 *
 * 기능:
 * - 관리자 권한 필수
 * - status, page, limit 쿼리 파라미터
 * - users, projects 조인
 * - 페이지네이션 지원
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

    // 쿼리 파라미터 파싱
    const { status = 'all', page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: '유효하지 않은 페이지 번호입니다.' });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: '유효하지 않은 limit 값입니다. (1-100)' });
    }

    const validStatuses = ['pending', 'confirmed', 'rejected', 'all'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: '유효하지 않은 status입니다.',
        validStatuses
      });
    }

    // 쿼리 빌더 생성
    let query = supabase
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
        confirmed_at,
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
      `, { count: 'exact' });

    // status 필터링
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // 정렬 (최신순)
    query = query.order('requested_at', { ascending: false });

    // 페이지네이션
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    query = query.range(from, to);

    // 쿼리 실행
    const { data: payments, error: queryError, count } = await query;

    if (queryError) {
      console.error('목록 조회 오류:', queryError);
      return res.status(500).json({ error: '목록 조회 중 오류가 발생했습니다.' });
    }

    // 응답 데이터 가공
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      projectId: payment.project_id,
      projectName: payment.projects?.project_name || '알 수 없음',
      userId: payment.user_id,
      userEmail: payment.users?.email || '알 수 없음',
      userName: payment.users?.display_name || '알 수 없음',
      amount: payment.amount,
      depositorName: payment.depositor_name,
      bankName: payment.bank_name,
      status: payment.status,
      requestedAt: payment.requested_at,
      confirmedAt: payment.confirmed_at,
      adminMemo: payment.admin_memo
    }));

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil((count || 0) / limitNum);

    return res.status(200).json({
      success: true,
      data: formattedPayments,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: count || 0,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      filter: {
        status
      }
    });

  } catch (error) {
    console.error('입금 신청 목록 조회 오류:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
