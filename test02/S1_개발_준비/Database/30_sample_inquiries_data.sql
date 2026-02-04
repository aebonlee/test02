-- =====================================================
-- Agenda #9: 고객 문의 관리 - 샘플 데이터
-- 생성일: 2025-12-12
-- 작성자: Claude Code
-- =====================================================

-- =====================================================
-- 샘플 문의 데이터 삽입
-- =====================================================

-- 1. 일반 문의 - 대기 중
INSERT INTO inquiries (inquiry_type, name, email, phone, title, content, status, priority)
VALUES (
    'general',
    '김철수',
    'chulsoo.kim@example.com',
    '010-1234-5678',
    '서비스 이용 문의드립니다',
    '안녕하세요. SSAL Works 서비스에 관심이 있어서 문의드립니다.\n\n1. 프로젝트 진행 기간은 보통 얼마나 걸리나요?\n2. 설치비 외에 추가 비용이 있나요?\n3. 중간에 프로젝트를 취소하면 환불이 가능한가요?\n\n답변 부탁드립니다.',
    'pending',
    'normal'
);

-- 2. 기술 지원 - 긴급
INSERT INTO inquiries (inquiry_type, name, email, phone, title, content, status, priority)
VALUES (
    'technical',
    '박영희',
    'younghee.park@example.com',
    '010-2345-6789',
    '[긴급] 프로젝트 페이지 접속 오류',
    '프로젝트 대시보드에 접속하려고 하는데 계속 오류가 발생합니다.\n\n오류 메시지: "세션이 만료되었습니다. 다시 로그인해주세요."\n\n로그인을 다시 해도 같은 오류가 반복됩니다.\n빠른 조치 부탁드립니다.',
    'pending',
    'urgent'
);

-- 3. 결제 문의 - 처리 중
INSERT INTO inquiries (inquiry_type, name, email, phone, title, content, status, priority)
VALUES (
    'payment',
    '이민수',
    'minsu.lee@example.com',
    '010-3456-7890',
    '설치비 입금 확인 요청',
    '어제(12월 11일) 설치비 300만원을 입금했는데 아직 확인이 안 됐다고 나옵니다.\n\n입금자명: 이민수\n입금 계좌: 하나은행\n입금 금액: 3,000,000원\n입금 일시: 2025-12-11 14:30\n\n확인 부탁드립니다.',
    'in_progress',
    'high'
);

-- 4. 계정 문의 - 답변 완료
INSERT INTO inquiries (inquiry_type, name, email, phone, title, content, status, priority, answer, answered_at, answered_by)
VALUES (
    'account',
    '최지영',
    'jiyoung.choi@example.com',
    '010-4567-8901',
    '이메일 변경 요청',
    '회원가입 시 입력한 이메일 주소를 변경하고 싶습니다.\n\n현재 이메일: jiyoung.choi@example.com\n변경할 이메일: jy.choi@newmail.com\n\n어떻게 해야 하나요?',
    'answered',
    'normal',
    '안녕하세요, 최지영 고객님.\n\n이메일 변경 요청 감사합니다.\n이메일 변경은 보안상의 이유로 본인 확인 절차가 필요합니다.\n\n아래 절차대로 진행해주세요:\n1. My Page > 보안 설정 접속\n2. "이메일 변경" 클릭\n3. 현재 비밀번호 입력\n4. 새 이메일 주소 입력\n5. 새 이메일로 발송된 인증 메일 확인\n\n추가 문의사항이 있으시면 언제든 문의해주세요.\n감사합니다.',
    NOW() - INTERVAL '2 hours',
    'ADMIN001'
);

-- 5. 제휴 문의 - 대기 중
INSERT INTO inquiries (inquiry_type, name, email, phone, title, content, status, priority)
VALUES (
    'partnership',
    '정대표',
    'ceo@techstartup.co.kr',
    '02-1234-5678',
    '기업 제휴 문의',
    '안녕하세요. IT 스타트업 대표입니다.\n\n저희 회사에서 SSAL Works 플랫폼을 활용한 프로젝트 진행에 관심이 있습니다.\n\n1. 기업 대상 특별 요금제가 있나요?\n2. 동시에 여러 프로젝트 진행이 가능한가요?\n3. 전담 PM 배정이 가능한가요?\n\n미팅 일정 조율 가능하시면 연락 부탁드립니다.\n\n감사합니다.',
    'pending',
    'high'
);

-- 6. 기타 문의 - 종료
INSERT INTO inquiries (inquiry_type, name, email, phone, title, content, status, priority, answer, answered_at, answered_by)
VALUES (
    'other',
    '김테스트',
    'test@test.com',
    '010-0000-0000',
    '테스트 문의입니다',
    '이것은 테스트 문의입니다. 무시해주세요.',
    'closed',
    'low',
    '테스트 문의로 확인되어 종료 처리합니다.',
    NOW() - INTERVAL '1 day',
    'ADMIN001'
);

-- 7. 기술 지원 - 대기 중
INSERT INTO inquiries (inquiry_type, name, email, phone, title, content, status, priority)
VALUES (
    'technical',
    '송개발',
    'dev.song@devcompany.com',
    '010-5678-9012',
    'API 연동 관련 문의',
    'AI Q&A 기능을 사용하려고 하는데 몇 가지 궁금한 점이 있습니다.\n\n1. ChatGPT API와 Gemini API 중 어떤 것을 추천하시나요?\n2. 크레딧 사용량 제한이 있나요?\n3. API 응답 속도는 어느 정도인가요?\n\n답변 부탁드립니다.',
    'pending',
    'normal'
);

-- 8. 결제 문의 - 답변 완료
INSERT INTO inquiries (inquiry_type, name, email, phone, title, content, status, priority, answer, answered_at, answered_by)
VALUES (
    'payment',
    '박결제',
    'payment.park@example.com',
    '010-6789-0123',
    '월 이용료 결제 실패',
    '이번 달 이용료 자동결제가 실패했다는 알림을 받았습니다.\n카드 정보는 문제없는 것 같은데 왜 실패한 건가요?\n\n수동 결제는 어떻게 하나요?',
    'answered',
    'high',
    '안녕하세요, 박결제 고객님.\n\n결제 실패 문의 주셔서 감사합니다.\n\n확인 결과, 등록된 카드의 한도 초과로 결제가 실패한 것으로 확인됩니다.\n\n수동 결제 방법:\n1. My Page > 구독 정보 > 결제 내역 접속\n2. "수동 결제" 버튼 클릭\n3. 결제 수단 선택 (새 카드 등록 가능)\n4. 결제 진행\n\n또는 결제 수단을 변경하신 후 자동결제 재시도도 가능합니다.\n\n추가 문의사항이 있으시면 언제든 연락주세요.\n감사합니다.',
    NOW() - INTERVAL '5 hours',
    'ADMIN001'
);

-- =====================================================
-- 완료 메시지
-- =====================================================
-- 샘플 문의 데이터 8건 삽입 완료
-- - pending: 4건
-- - in_progress: 1건
-- - answered: 2건
-- - closed: 1건
