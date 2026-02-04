-- =====================================================
-- FAQ 샘플 데이터 입력 (3단계 계층 구조)
-- =====================================================
-- 작성일: 2025-12-02
-- 목적: FAQ 테스트 및 데모용 샘플 데이터
-- 아젠다: #3 FAQ 시스템
-- 구조: 3개 대분류 × 5개 중분류 × 5개 소분류 = 75개

-- 기존 샘플 데이터 삭제 (재실행 시)
DELETE FROM faqs;

-- =====================================================
-- 대분류 1: 로그인/회원가입
-- =====================================================

-- 중분류 1-1: 계정 관리
INSERT INTO faqs (depth1, depth2, depth3, answer, description) VALUES
('로그인/회원가입', '계정 관리', '비밀번호 재설정',
'<p><strong>비밀번호 재설정 방법:</strong></p>
<ol>
<li>로그인 페이지에서 "비밀번호 찾기" 클릭</li>
<li>가입한 이메일 주소 입력</li>
<li>이메일로 받은 인증 링크 클릭</li>
<li>새 비밀번호 입력 및 확인</li>
</ol>
<p>💡 이메일이 오지 않으면 스팸함을 확인해주세요.</p>',
'비밀번호를 잊어버렸을 때 재설정하는 방법'),

('로그인/회원가입', '계정 관리', '이메일 인증 오류',
'<p>이메일 인증 오류 해결 방법:</p>
<ul>
<li><strong>인증 메일이 오지 않는 경우:</strong> 스팸함 확인 또는 "재전송" 버튼 클릭</li>
<li><strong>링크가 만료된 경우:</strong> 다시 "이메일 인증 재전송" 요청</li>
<li><strong>잘못된 이메일:</strong> 고객센터로 문의하여 이메일 변경</li>
</ul>',
'이메일 인증이 안 될 때 해결 방법'),

('로그인/회원가입', '계정 관리', '계정 삭제 방법',
'<p><strong>계정 삭제 절차:</strong></p>
<ol>
<li>로그인 → My Page</li>
<li>설정 → "계정 관리"</li>
<li>하단의 "계정 삭제" 버튼</li>
<li>비밀번호 입력하여 확인</li>
</ol>
<p>⚠️ <strong>주의:</strong> 삭제된 계정과 모든 데이터는 복구할 수 없습니다.</p>',
'계정을 완전히 삭제하는 방법'),

('로그인/회원가입', '계정 관리', '프로필 수정',
'<p>프로필 정보 수정:</p>
<ul>
<li>My Page → "프로필 수정"</li>
<li>닉네임, 프로필 사진, 자기소개 변경 가능</li>
<li>"저장" 버튼으로 변경사항 적용</li>
</ul>
<p>💡 닉네임은 14일에 1회만 변경 가능합니다.</p>',
'닉네임, 프로필 사진 등 변경'),

('로그인/회원가입', '계정 관리', '이메일 변경',
'<p>이메일 주소 변경 방법:</p>
<ol>
<li>My Page → 설정</li>
<li>"이메일 변경" 선택</li>
<li>새 이메일 입력 및 인증</li>
<li>기존 비밀번호 입력하여 확인</li>
</ol>
<p>⚠️ 변경 시 기존 이메일로 알림이 발송됩니다.</p>',
'이메일 주소를 변경하는 방법');

-- 중분류 1-2: 회원가입
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('로그인/회원가입', '회원가입', '이메일 가입',
'<p><strong>이메일로 회원가입:</strong></p>
<ol>
<li>메인 페이지 "회원가입" 클릭</li>
<li>이메일, 비밀번호, 닉네임 입력</li>
<li>이용약관 동의</li>
<li>"가입하기" 버튼 클릭</li>
<li>이메일 인증 완료</li>
</ol>'),

('로그인/회원가입', '회원가입', '소셜 로그인',
'<p>지원하는 소셜 로그인:</p>
<ul>
<li>Google 계정</li>
<li>GitHub 계정</li>
<li>Kakao 계정</li>
</ul>
<p>"소셜 로그인" 버튼 클릭 후 계정 선택하면 즉시 가입됩니다.</p>'),

('로그인/회원가입', '회원가입', '본인인증 방법',
'<p>본인인증은 다음 방법으로 가능합니다:</p>
<ul>
<li><strong>휴대폰 인증:</strong> SMS 인증번호 입력</li>
<li><strong>이메일 인증:</strong> 이메일 링크 클릭</li>
<li><strong>신분증 인증:</strong> 고객센터 문의 (기업 회원만)</li>
</ul>'),

('로그인/회원가입', '회원가입', '가입 오류',
'<p>회원가입 중 오류 발생 시:</p>
<ul>
<li>"이미 사용 중인 이메일" → 다른 이메일 사용 또는 비밀번호 찾기</li>
<li>"닉네임 중복" → 다른 닉네임 입력</li>
<li>"네트워크 오류" → 잠시 후 다시 시도</li>
</ul>'),

('로그인/회원가입', '회원가입', '미성년자 가입',
'<p>만 14세 이상부터 가입 가능합니다.</p>
<p>만 14세 미만은 법정대리인 동의가 필요합니다:</p>
<ol>
<li>회원가입 시 "법정대리인 동의" 선택</li>
<li>법정대리인 정보 입력</li>
<li>법정대리인 휴대폰으로 인증</li>
</ol>');

-- 중분류 1-3: 로그인 문제
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('로그인/회원가입', '로그인 문제', '로그인 실패',
'<p>로그인이 안 되는 경우:</p>
<ul>
<li>비밀번호 오류: "비밀번호 찾기"로 재설정</li>
<li>계정 정지: 이메일로 안내 확인</li>
<li>쿠키 차단: 브라우저 쿠키 허용</li>
</ul>'),

('로그인/회원가입', '로그인 문제', '자동 로그아웃',
'<p>자동으로 로그아웃되는 경우:</p>
<ul>
<li>보안을 위해 30일 후 자동 로그아웃됩니다</li>
<li>"로그인 상태 유지" 체크 시 연장 가능</li>
<li>다른 기기에서 로그인 시 기존 세션 종료</li>
</ul>'),

('로그인/회원가입', '로그인 문제', '다중 기기 로그인',
'<p>최대 3개 기기에서 동시 로그인 가능합니다.</p>
<p>My Page → 보안 → "활성 세션"에서 다른 기기 로그아웃 가능</p>'),

('로그인/회원가입', '로그인 문제', '보안 알림',
'<p>다음 경우 보안 알림이 발송됩니다:</p>
<ul>
<li>새로운 기기에서 로그인</li>
<li>비밀번호 변경</li>
<li>의심스러운 접속 시도</li>
</ul>'),

('로그인/회원가입', '로그인 문제', '2단계 인증',
'<p><strong>2단계 인증 설정:</strong></p>
<ol>
<li>My Page → 보안</li>
<li>"2단계 인증 활성화"</li>
<li>인증 앱(Google Authenticator) 등록</li>
<li>로그인 시 인증코드 추가 입력</li>
</ol>
<p>💡 보안이 크게 강화됩니다!</p>');

-- 중분류 1-4: 보안 설정
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('로그인/회원가입', '보안 설정', '비밀번호 강도',
'<p><strong>안전한 비밀번호 조건:</strong></p>
<ul>
<li>최소 8자 이상</li>
<li>영문 대소문자, 숫자, 특수문자 조합</li>
<li>생일, 전화번호 등 추측 가능한 정보 사용 금지</li>
</ul>'),

('로그인/회원가입', '보안 설정', '비밀번호 변경 주기',
'<p>보안을 위해 3개월마다 비밀번호 변경을 권장합니다.</p>
<p>변경 시기가 되면 로그인 시 알림이 표시됩니다.</p>'),

('로그인/회원가입', '보안 설정', '로그인 기록',
'<p>My Page → 보안 → "로그인 기록"에서 확인 가능:</p>
<ul>
<li>로그인 일시</li>
<li>접속 기기</li>
<li>IP 주소</li>
</ul>'),

('로그인/회원가입', '보안 설정', '계정 보호',
'<p>계정 보호 설정:</p>
<ul>
<li>2단계 인증 활성화</li>
<li>정기적인 비밀번호 변경</li>
<li>의심스러운 활동 모니터링</li>
<li>로그인 알림 활성화</li>
</ul>'),

('로그인/회원가입', '보안 설정', '의심스러운 활동',
'<p>의심스러운 활동 발견 시:</p>
<ol>
<li>즉시 비밀번호 변경</li>
<li>모든 기기에서 로그아웃</li>
<li>고객센터에 신고</li>
<li>2단계 인증 활성화</li>
</ol>');

-- 중분류 1-5: 계정 복구
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('로그인/회원가입', '계정 복구', '계정 잠김',
'<p>계정이 잠긴 경우:</p>
<ul>
<li><strong>원인:</strong> 5회 이상 로그인 실패</li>
<li><strong>해제:</strong> 30분 후 자동 해제 또는 이메일 인증으로 즉시 해제</li>
</ul>'),

('로그인/회원가입', '계정 복구', '정지된 계정',
'<p>계정 정지 사유:</p>
<ul>
<li>이용약관 위반</li>
<li>스팸 또는 어뷰징</li>
<li>신고 누적</li>
</ul>
<p>이메일로 정지 사유 안내 → 이의 제기 가능</p>'),

('로그인/회원가입', '계정 복구', '삭제된 계정 복구',
'<p>삭제된 계정은 <strong>30일 이내</strong> 복구 가능합니다.</p>
<p>고객센터로 복구 요청 시 본인 확인 후 복구됩니다.</p>'),

('로그인/회원가입', '계정 복구', '해킹 신고',
'<p><strong>계정이 해킹당한 것 같다면:</strong></p>
<ol>
<li>즉시 고객센터에 신고</li>
<li>비밀번호 긴급 변경</li>
<li>결제 내역 확인</li>
<li>카드사에 알림</li>
</ol>'),

('로그인/회원가입', '계정 복구', '이메일 접근 불가',
'<p>가입 이메일에 접근할 수 없는 경우:</p>
<ol>
<li>고객센터 문의</li>
<li>본인 확인 (신분증, 휴대폰 인증)</li>
<li>새 이메일로 변경</li>
</ol>');

-- =====================================================
-- 대분류 2: Order 작성
-- =====================================================

-- 중분류 2-1: 작성 가이드
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('Order 작성', '작성 가이드', 'Order 작성 기본',
'<p><strong>Order 작성 순서:</strong></p>
<ol>
<li>Order 유형 선택 (개발, 디자인, 분석 등)</li>
<li>요구사항 상세 입력</li>
<li>참고 파일 첨부 (선택)</li>
<li>기한 설정</li>
<li>"전송" 버튼 클릭</li>
</ol>'),

('Order 작성', '작성 가이드', '효과적인 Order 작성',
'<p><strong>좋은 Order 작성 팁:</strong></p>
<ul>
<li>구체적인 요구사항 명시</li>
<li>예시나 참고 자료 첨부</li>
<li>우선순위 표시</li>
<li>명확한 완료 조건 제시</li>
</ul>'),

('Order 작성', '작성 가이드', 'Order 템플릿 사용',
'<p>자주 사용하는 Order는 템플릿으로 저장 가능:</p>
<ol>
<li>Order 작성 후 "템플릿으로 저장"</li>
<li>다음부터 "템플릿 불러오기"로 빠르게 작성</li>
</ol>'),

('Order 작성', '작성 가이드', 'Order 우선순위',
'<p>Order 우선순위 설정:</p>
<ul>
<li><strong>긴급:</strong> 24시간 이내 처리</li>
<li><strong>높음:</strong> 3일 이내 처리</li>
<li><strong>보통:</strong> 1주일 이내 처리</li>
<li><strong>낮음:</strong> 2주 이내 처리</li>
</ul>'),

('Order 작성', '작성 가이드', '첨부 파일 형식',
'<p>첨부 가능한 파일:</p>
<ul>
<li>이미지: JPG, PNG, GIF (최대 10MB)</li>
<li>문서: PDF, DOCX, XLSX (최대 20MB)</li>
<li>압축: ZIP (최대 50MB)</li>
</ul>');

-- 중분류 2-2: Order 수정
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('Order 작성', 'Order 수정', '전송 전 수정',
'<p>전송 전에는 자유롭게 수정 가능:</p>
<ul>
<li>Order 목록에서 "수정" 클릭</li>
<li>내용 변경 후 다시 저장</li>
</ul>'),

('Order 작성', 'Order 수정', '전송 후 수정',
'<p>전송된 Order 수정:</p>
<ul>
<li><strong>진행 전:</strong> 수정 가능</li>
<li><strong>진행 중:</strong> 담당자와 협의 필요</li>
<li><strong>완료 후:</strong> 수정 불가</li>
</ul>'),

('Order 작성', 'Order 수정', '요구사항 추가',
'<p>추가 요구사항 전달:</p>
<ol>
<li>Order 상세 페이지 열기</li>
<li>"댓글" 또는 "메모" 추가</li>
<li>담당자에게 알림 발송</li>
</ol>'),

('Order 작성', 'Order 수정', '버전 관리',
'<p>Order 수정 내역은 모두 저장됩니다:</p>
<ul>
<li>"버전 기록" 탭에서 확인</li>
<li>이전 버전으로 복구 가능</li>
</ul>'),

('Order 작성', 'Order 수정', '취소 및 재작성',
'<p>잘못 작성한 Order:</p>
<ul>
<li>진행 전: "삭제" 가능</li>
<li>진행 중: "취소 요청" 후 재작성</li>
</ul>');

-- 중분류 2-3: Order 전송
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('Order 작성', 'Order 전송', '전송 방법',
'<p>Order 전송 절차:</p>
<ol>
<li>작성 완료 후 "전송" 버튼</li>
<li>담당자 자동 배정</li>
<li>이메일 알림 발송</li>
<li>진행 상황 모니터링</li>
</ol>'),

('Order 작성', 'Order 전송', '전송 확인',
'<p>전송 완료 확인:</p>
<ul>
<li>화면에 "전송 완료" 메시지</li>
<li>이메일 알림 수신</li>
<li>Order 목록에서 상태 확인</li>
</ul>'),

('Order 작성', 'Order 전송', '전송 취소',
'<p><strong>전송 취소 가능 시점:</strong></p>
<ul>
<li>전송 후 10분 이내</li>
<li>담당자 확인 전</li>
</ul>
<p>이후는 담당자와 협의 필요</p>'),

('Order 작성', 'Order 전송', '전송 오류',
'<p>전송 오류 발생 시:</p>
<ul>
<li>네트워크 연결 확인</li>
<li>첨부 파일 크기 확인</li>
<li>브라우저 캐시 삭제 후 재시도</li>
</ul>'),

('Order 작성', 'Order 전송', '재전송',
'<p>전송 실패한 Order:</p>
<ul>
<li>"임시 저장함"에 자동 보관</li>
<li>내용 확인 후 재전송 가능</li>
</ul>');

-- 중분류 2-4: Order 히스토리
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('Order 작성', 'Order 히스토리', '히스토리 확인',
'<p>Order 히스토리 보는 법:</p>
<ol>
<li>My Page → "Order 히스토리"</li>
<li>날짜, 상태별 필터링 가능</li>
<li>Order 클릭 → 상세 내역 확인</li>
</ol>'),

('Order 작성', 'Order 히스토리', '진행 상태',
'<p>Order 진행 상태:</p>
<ul>
<li><strong>접수:</strong> 전송 완료, 대기 중</li>
<li><strong>진행:</strong> 작업 시작</li>
<li><strong>검토:</strong> 완료 후 확인 중</li>
<li><strong>완료:</strong> 작업 완료</li>
</ul>'),

('Order 작성', 'Order 히스토리', '완료된 Order',
'<p>완료된 Order 관리:</p>
<ul>
<li>결과물 다운로드</li>
<li>피드백 작성</li>
<li>재요청 가능</li>
</ul>'),

('Order 작성', 'Order 히스토리', '삭제된 Order',
'<p>삭제된 Order는 <strong>휴지통</strong>에 30일간 보관됩니다.</p>
<p>휴지통 → "복구" 버튼으로 복구 가능</p>'),

('Order 작성', 'Order 히스토리', '통계 확인',
'<p>Order 통계:</p>
<ul>
<li>월별 Order 수</li>
<li>카테고리별 분포</li>
<li>평균 처리 시간</li>
<li>만족도 평가</li>
</ul>');

-- 중분류 2-5: 템플릿 관리
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('Order 작성', '템플릿 관리', '기본 템플릿',
'<p>제공되는 기본 템플릿:</p>
<ul>
<li>웹 개발 Order</li>
<li>디자인 Order</li>
<li>데이터 분석 Order</li>
<li>문서 작성 Order</li>
</ul>'),

('Order 작성', '템플릿 관리', '커스텀 템플릿',
'<p><strong>나만의 템플릿 만들기:</strong></p>
<ol>
<li>Order 작성</li>
<li>"템플릿으로 저장" 클릭</li>
<li>템플릿 이름 입력</li>
<li>다음부터 "내 템플릿"에서 불러오기</li>
</ol>'),

('Order 작성', '템플릿 관리', '템플릿 저장',
'<p>템플릿에 저장되는 항목:</p>
<ul>
<li>Order 유형</li>
<li>기본 내용</li>
<li>자주 사용하는 문구</li>
<li>체크리스트</li>
</ul>
<p>⚠️ 개인 정보는 저장되지 않습니다.</p>'),

('Order 작성', '템플릿 관리', '템플릿 공유',
'<p>팀원과 템플릿 공유:</p>
<ol>
<li>템플릿 → "공유" 버튼</li>
<li>팀 선택</li>
<li>권한 설정 (보기/수정)</li>
</ol>'),

('Order 작성', '템플릿 관리', '템플릿 삭제',
'<p>더 이상 사용하지 않는 템플릿:</p>
<ul>
<li>템플릿 목록 → "삭제"</li>
<li>삭제 확인 후 영구 삭제</li>
</ul>');

-- =====================================================
-- 대분류 3: AI 기능
-- =====================================================

-- 중분류 3-1: AI 사용법
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('AI 기능', 'AI 사용법', 'AI 선택',
'<p>사용 가능한 AI:</p>
<ul>
<li><strong>Claude:</strong> 코드, 문서 작성</li>
<li><strong>ChatGPT:</strong> 대화, 아이디어</li>
<li><strong>Gemini:</strong> 검색, 요약</li>
<li><strong>Perplexity:</strong> 리서치, 사실 확인</li>
</ul>
<p>용도에 맞는 AI를 선택하세요!</p>'),

('AI 기능', 'AI 사용법', '질문하기',
'<p><strong>AI에게 효과적으로 질문하는 법:</strong></p>
<ul>
<li>구체적으로 질문</li>
<li>맥락 제공</li>
<li>원하는 형식 명시</li>
<li>예시 제시</li>
</ul>'),

('AI 기능', 'AI 사용법', 'AI 응답 평가',
'<p>AI 응답에 평가를 남겨주세요:</p>
<ul>
<li>👍 도움이 됨</li>
<li>👎 도움이 안 됨</li>
</ul>
<p>피드백을 통해 AI가 개선됩니다!</p>'),

('AI 기능', 'AI 사용법', '대화 저장',
'<p>AI와의 대화 내역:</p>
<ul>
<li>자동으로 저장됨</li>
<li>"AI 히스토리"에서 확인</li>
<li>중요한 대화는 북마크 가능</li>
</ul>'),

('AI 기능', 'AI 사용법', '파일 업로드',
'<p>AI에게 파일 업로드:</p>
<ul>
<li>이미지 분석</li>
<li>문서 요약</li>
<li>코드 리뷰</li>
</ul>
<p>최대 10MB까지 가능</p>');

-- 중분류 3-2: AI 모델별 특징
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('AI 기능', 'AI 모델별 특징', 'Claude 특징',
'<p><strong>Claude (Anthropic):</strong></p>
<ul>
<li>긴 문서 처리 탁월</li>
<li>코드 작성 및 분석</li>
<li>논리적인 사고</li>
<li>안전하고 정확한 답변</li>
</ul>'),

('AI 기능', 'AI 모델별 특징', 'ChatGPT 특징',
'<p><strong>ChatGPT (OpenAI):</strong></p>
<ul>
<li>자연스러운 대화</li>
<li>창의적인 아이디어</li>
<li>다양한 언어 지원</li>
<li>빠른 응답 속도</li>
</ul>'),

('AI 기능', 'AI 모델별 특징', 'Gemini 특징',
'<p><strong>Gemini (Google):</strong></p>
<ul>
<li>최신 정보 검색</li>
<li>YouTube 영상 분석</li>
<li>Google 서비스 연동</li>
<li>다국어 번역</li>
</ul>'),

('AI 기능', 'AI 모델별 특징', 'Perplexity 특징',
'<p><strong>Perplexity:</strong></p>
<ul>
<li>실시간 웹 검색</li>
<li>출처 명시</li>
<li>사실 확인 및 검증</li>
<li>학술 자료 참고</li>
</ul>'),

('AI 기능', 'AI 모델별 특징', 'AI 비교',
'<p>AI 모델 선택 가이드:</p>
<ul>
<li><strong>코드 작성:</strong> Claude</li>
<li><strong>창의적 작업:</strong> ChatGPT</li>
<li><strong>검색 및 리서치:</strong> Perplexity</li>
<li><strong>Google 연동:</strong> Gemini</li>
</ul>');

-- 중분류 3-3: AI 크레딧
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('AI 기능', 'AI 크레딧', '크레딧 충전',
'<p><strong>크레딧 충전 방법:</strong></p>
<ol>
<li>우측 사이드바 "충전하기" 버튼</li>
<li>금액 선택 (₩5,000 ~ ₩100,000)</li>
<li>결제 수단 선택</li>
<li>결제 완료 → 즉시 충전</li>
</ol>'),

('AI 기능', 'AI 크레딧', '크레딧 사용량',
'<p>AI별 크레딧 사용량:</p>
<ul>
<li><strong>Claude:</strong> 질문당 약 ₩100</li>
<li><strong>ChatGPT:</strong> 질문당 약 ₩50</li>
<li><strong>Gemini:</strong> 질문당 약 ₩30</li>
<li><strong>Perplexity:</strong> 질문당 약 ₩80</li>
</ul>
<p>💡 복잡한 질문일수록 크레딧 소모 증가</p>'),

('AI 기능', 'AI 크레딧', '크레딧 잔액',
'<p>크레딧 잔액 확인:</p>
<ul>
<li>우측 사이드바에 항상 표시</li>
<li>My Page → "크레딧 내역"</li>
<li>부족 시 자동 알림</li>
</ul>'),

('AI 기능', 'AI 크레딧', '환불 정책',
'<p>크레딧 환불:</p>
<ul>
<li>충전 후 7일 이내</li>
<li>사용하지 않은 금액만</li>
<li>결제 수단으로 환불</li>
</ul>
<p>고객센터로 환불 요청</p>'),

('AI 기능', 'AI 크레딧', '크레딧 선물',
'<p>크레딧 선물하기:</p>
<ol>
<li>크레딧 충전 페이지</li>
<li>"선물하기" 선택</li>
<li>받는 사람 이메일 입력</li>
<li>결제 완료 → 상대방에게 발송</li>
</ol>');

-- 중분류 3-4: AI 제한사항
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('AI 기능', 'AI 제한사항', '일일 사용 제한',
'<p>무료 플랜 제한:</p>
<ul>
<li>하루 10회 질문</li>
<li>파일 업로드 불가</li>
<li>기본 모델만 사용</li>
</ul>
<p>💡 유료 플랜 가입 시 무제한</p>'),

('AI 기능', 'AI 제한사항', '금지된 질문',
'<p>AI에게 할 수 없는 질문:</p>
<ul>
<li>불법적인 내용</li>
<li>개인정보 요구</li>
<li>유해한 콘텐츠</li>
<li>저작권 침해</li>
</ul>'),

('AI 기능', 'AI 제한사항', '응답 시간',
'<p>AI 응답 시간:</p>
<ul>
<li>일반 질문: 5-10초</li>
<li>복잡한 질문: 20-30초</li>
<li>파일 분석: 30-60초</li>
</ul>
<p>피크 시간대에는 더 소요될 수 있습니다.</p>'),

('AI 기능', 'AI 제한사항', '정확도 한계',
'<p>⚠️ AI 답변의 한계:</p>
<ul>
<li>항상 정확하지 않을 수 있음</li>
<li>최신 정보는 제한적</li>
<li>전문가 자문 대체 불가</li>
<li>중요한 결정은 검증 필요</li>
</ul>'),

('AI 기능', 'AI 제한사항', '개인정보 보호',
'<p>AI 사용 시 개인정보 보호:</p>
<ul>
<li>주민번호, 계좌번호 등 입력 금지</li>
<li>대화 내용은 암호화 저장</li>
<li>30일 후 자동 삭제 (설정 가능)</li>
</ul>');

-- 중분류 3-5: AI 고급 기능
INSERT INTO faqs (depth1, depth2, depth3, answer) VALUES
('AI 기능', 'AI 고급 기능', '프롬프트 템플릿',
'<p>효과적인 프롬프트 템플릿:</p>
<ul>
<li>"[역할]로서 [작업]을 해줘"</li>
<li>"[주제]에 대해 [형식]으로 설명해줘"</li>
<li>"[입력]을 [출력] 형태로 변환해줘"</li>
</ul>'),

('AI 기능', 'AI 고급 기능', '컨텍스트 유지',
'<p>이전 대화 내용 기억:</p>
<ul>
<li>같은 세션 내에서 연속 대화</li>
<li>"위에서 말한..."으로 참조 가능</li>
<li>새 세션 시작 시 초기화</li>
</ul>'),

('AI 기능', 'AI 고급 기능', '멀티턴 대화',
'<p>AI와 여러 번 대화하며 다듬기:</p>
<ol>
<li>초안 요청</li>
<li>피드백 제공</li>
<li>수정 요청</li>
<li>최종 버전 완성</li>
</ol>'),

('AI 기능', 'AI 고급 기능', 'AI 플러그인',
'<p>AI 확장 기능 (프리미엄):</p>
<ul>
<li>웹 검색 연동</li>
<li>이미지 생성</li>
<li>코드 실행</li>
<li>데이터 분석</li>
</ul>'),

('AI 기능', 'AI 고급 기능', 'API 연동',
'<p>개발자용 API:</p>
<ul>
<li>자체 서비스에 AI 통합</li>
<li>API 키 발급</li>
<li>사용량 기반 과금</li>
</ul>
<p>개발자 문서 참고</p>');

-- =====================================================
-- 데이터 입력 완료 확인
-- =====================================================

-- 대분류별 개수 확인
SELECT
    depth1,
    COUNT(*) as total_count,
    COUNT(DISTINCT depth2) as depth2_count
FROM faqs
GROUP BY depth1
ORDER BY depth1;

-- 전체 개수 확인
SELECT
    COUNT(*) as total_faqs,
    COUNT(DISTINCT depth1) as total_depth1,
    COUNT(DISTINCT depth1 || '|' || depth2) as total_depth2
FROM faqs;
