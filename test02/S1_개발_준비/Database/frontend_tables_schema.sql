-- ================================================
-- Frontend 사용자 페이지용 테이블 추가
-- ================================================
-- 작성일: 2025-12-01
-- 목적: Admin Dashboard에서 관리한 콘텐츠를 Frontend에 표시
-- ================================================

-- ================================================
-- 1. notices (공지사항)
-- ================================================
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 공지사항 내용
    title TEXT NOT NULL,
    content TEXT NOT NULL,

    -- 중요도
    important BOOLEAN DEFAULT false,  -- true면 상단 고정 + 🔴 표시

    -- 작성자 (관리자)
    created_by UUID REFERENCES users(id),

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_notices_important ON notices(important);
CREATE INDEX idx_notices_created ON notices(created_at DESC);

-- RLS 정책
-- 모든 사용자가 공지사항 조회 가능
CREATE POLICY "Anyone can view notices" ON notices
    FOR SELECT USING (true);

-- Admin만 CUD(생성/수정/삭제) 가능
CREATE POLICY "Only admin can manage notices" ON notices
    FOR INSERT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Only admin can update notices" ON notices
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Only admin can delete notices" ON notices
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Mock 데이터 삽입
INSERT INTO notices (title, content, important, created_at) VALUES
('시스템 점검 안내',
 '2025년 12월 1일 오전 2시~4시 시스템 점검이 진행됩니다. 서비스 이용에 참고 부탁드립니다.',
 true,
 NOW() - INTERVAL '2 days'),

('11월 업데이트 소식',
 '새로운 기능이 추가되었습니다:
- AI 모델 선택 기능 추가
- 크레딧 충전 UI 개선
- 학습용 콘텐츠 섹션 추가

앞으로도 더 나은 서비스로 찾아뵙겠습니다!',
 false,
 NOW() - INTERVAL '5 days'),

('크레딧 정책 변경 안내',
 '크레딧 정책이 다음과 같이 변경됩니다:

1. 기본 제공 크레딧: ₩10,000 → ₩15,000
2. 최소 충전 금액: ₩5,000 → ₩3,000
3. 유효 기간: 무제한

감사합니다.',
 false,
 NOW() - INTERVAL '10 days');


-- ================================================
-- 1-1. notice_reads (공지사항 읽음 기록)
-- ================================================
CREATE TABLE notice_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    notice_id UUID REFERENCES notices(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMPTZ DEFAULT NOW(),

    -- 한 사용자가 같은 공지를 중복으로 기록 못하게
    UNIQUE(user_id, notice_id)
);

-- 인덱스
CREATE INDEX idx_notice_reads_user ON notice_reads(user_id);
CREATE INDEX idx_notice_reads_notice ON notice_reads(notice_id);
CREATE INDEX idx_notice_reads_user_notice ON notice_reads(user_id, notice_id);

-- RLS 정책
-- 사용자는 자신의 읽음 기록만 조회 가능
CREATE POLICY "Users can view own read records" ON notice_reads
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 읽음 기록만 생성 가능
CREATE POLICY "Users can create own read records" ON notice_reads
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ================================================
-- 2. learning_contents (학습용 콘텐츠)
-- ================================================
CREATE TABLE learning_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 3단계 트리 구조
    depth1 TEXT NOT NULL,  -- 대분류 (예: "웹개발 기초")
    depth2 TEXT NOT NULL,  -- 중분류 (예: "HTML/CSS")
    depth3 TEXT NOT NULL,  -- 소분류 (예: "HTML 기본 문법")

    -- 콘텐츠 타입
    content_type TEXT DEFAULT 'text',  -- 'text', 'google_drive', 'url', 'video'

    -- 콘텐츠 URL (Google Drive 링크, 외부 링크 등)
    content_url TEXT,

    -- 콘텐츠 본문 (간단한 설명)
    description TEXT,

    -- 정렬 순서
    order_num INTEGER DEFAULT 0,

    -- 게시 상태
    status TEXT DEFAULT 'published',  -- 'published', 'draft', 'archived'

    -- 작성자 (관리자)
    created_by UUID REFERENCES users(id),

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_learning_depth ON learning_contents(depth1, depth2, depth3);
CREATE INDEX idx_learning_order ON learning_contents(order_num);
CREATE INDEX idx_learning_status ON learning_contents(status);

-- RLS 정책
-- 모든 사용자가 게시된 콘텐츠 조회 가능
CREATE POLICY "Anyone can view published learning contents" ON learning_contents
    FOR SELECT USING (status = 'published');

-- Admin만 CRUD 가능
CREATE POLICY "Only admin can manage learning contents" ON learning_contents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Mock 데이터 삽입
INSERT INTO learning_contents (depth1, depth2, depth3, content_type, content_url, description, order_num, status) VALUES
-- 웹개발 기초 > HTML/CSS
('웹개발 기초', 'HTML/CSS', 'HTML 기본 문법', 'google_drive', 'https://drive.google.com/file/d/sample1', 'HTML의 기본 태그와 구조를 배웁니다.', 1, 'published'),
('웹개발 기초', 'HTML/CSS', 'CSS 레이아웃', 'google_drive', 'https://drive.google.com/file/d/sample2', 'Flexbox와 Grid를 활용한 레이아웃 디자인', 2, 'published'),
('웹개발 기초', 'HTML/CSS', 'CSS 애니메이션', 'google_drive', 'https://drive.google.com/file/d/sample3', 'Transition과 Animation을 활용한 움직임', 3, 'published'),

-- 웹개발 기초 > JavaScript
('웹개발 기초', 'JavaScript', '변수와 데이터 타입', 'google_drive', 'https://drive.google.com/file/d/sample4', 'JavaScript의 기본 문법과 변수 선언', 4, 'published'),
('웹개발 기초', 'JavaScript', '함수와 객체', 'google_drive', 'https://drive.google.com/file/d/sample5', '함수 선언과 객체 활용법', 5, 'published'),
('웹개발 기초', 'JavaScript', 'DOM 조작', 'google_drive', 'https://drive.google.com/file/d/sample6', '웹페이지 요소를 JavaScript로 제어하기', 6, 'published'),

-- AI 활용법 > ChatGPT
('AI 활용법', 'ChatGPT', '프롬프트 작성법', 'google_drive', 'https://drive.google.com/file/d/sample7', '효과적인 AI 질문 작성 방법', 7, 'published'),
('AI 활용법', 'ChatGPT', '코드 생성 활용', 'google_drive', 'https://drive.google.com/file/d/sample8', 'ChatGPT로 코드 작성하기', 8, 'published'),

-- AI 활용법 > Claude
('AI 활용법', 'Claude', 'Claude 활용 기초', 'google_drive', 'https://drive.google.com/file/d/sample9', 'Claude의 강점과 활용 사례', 9, 'published'),

-- 프로젝트 관리 > 기획
('프로젝트 관리', '기획', '사업계획서 작성법', 'google_drive', 'https://drive.google.com/file/d/sample10', '성공적인 사업계획서 작성 가이드', 10, 'published'),
('프로젝트 관리', '기획', 'UI/UX 디자인 원칙', 'google_drive', 'https://drive.google.com/file/d/sample11', '사용자 중심의 디자인 방법론', 11, 'published');


-- ================================================
-- 3. faqs (자주 묻는 질문)
-- ================================================
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 카테고리
    category TEXT NOT NULL,  -- 'payment', 'usage', 'general', 'technical'

    -- FAQ 내용
    question TEXT NOT NULL,
    answer TEXT NOT NULL,

    -- 정렬 순서
    order_num INTEGER DEFAULT 0,

    -- 게시 상태
    status TEXT DEFAULT 'published',  -- 'published', 'draft', 'archived'

    -- 조회수 (선택)
    view_count INTEGER DEFAULT 0,

    -- 작성자 (관리자)
    created_by UUID REFERENCES users(id),

    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_order ON faqs(order_num);
CREATE INDEX idx_faqs_status ON faqs(status);

-- RLS 정책
-- 모든 사용자가 게시된 FAQ 조회 가능
CREATE POLICY "Anyone can view published faqs" ON faqs
    FOR SELECT USING (status = 'published');

-- Admin만 CRUD 가능
CREATE POLICY "Only admin can manage faqs" ON faqs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Mock 데이터 삽입
INSERT INTO faqs (category, question, answer, order_num, status) VALUES
-- 결제/구독 카테고리
('payment', '크레딧은 어떻게 충전하나요?',
 'Perplexity 섹션에서 "크레딧 충전" 버튼을 클릭하시면 충전 페이지로 이동합니다. 최소 충전 금액은 ₩3,000이며, 결제는 계좌이체 또는 카드 결제가 가능합니다.',
 1, 'published'),

('payment', '구독은 어떻게 신청하나요?',
 '상단 메뉴의 "구독하기" 버튼을 클릭하고 원하는 플랜을 선택하세요. 결제가 완료되면 즉시 구독이 활성화됩니다.',
 2, 'published'),

('payment', '환불 정책은 어떻게 되나요?',
 '온보딩 기간(3개월) 내에 다음 조건을 모두 달성하시면 50% 환불이 가능합니다:
1. 웹사이트 완성
2. 서비스 런칭
3. 10명 이상 고객으로부터 수입 발생

자세한 사항은 "써니에게 문의"를 이용해주세요.',
 3, 'published'),

-- 사용법 카테고리
('usage', 'Order Sheet는 어떻게 작성하나요?',
 'Order Sheet 템플릿을 선택하고 빈칸을 채우시면 됩니다. 작성된 Order는 자동으로 Claude Code에 전달되어 작업이 시작됩니다.',
 4, 'published'),

('usage', 'AI 써니에게 어떻게 문의하나요?',
 '화면 하단의 "써니에게 문의" 버튼을 클릭하고 질문을 입력하세요. 파일 첨부도 가능하며, 관리자가 확인 후 답변을 드립니다.',
 5, 'published'),

('usage', '학습용 콘텐츠는 어디서 볼 수 있나요?',
 '좌측 사이드바의 "📚 학습용 콘텐츠" 섹션을 클릭하시면 다양한 학습 자료를 확인하실 수 있습니다. 대분류 > 중분류 > 소분류 순으로 구성되어 있습니다.',
 6, 'published'),

-- 일반 카테고리
('general', 'SSALWorks는 어떤 서비스인가요?',
 'SSALWorks는 AI를 활용한 프로젝트 관리 플랫폼입니다. ChatGPT, Claude, Gemini, Perplexity 등 다양한 AI를 하나의 플랫폼에서 사용할 수 있으며, 크레딧 기반 과금 시스템을 제공합니다.',
 7, 'published'),

('general', '어떤 AI 모델을 사용할 수 있나요?',
 '현재 다음 AI 모델을 지원합니다:
- ChatGPT (GPT-4, GPT-3.5)
- Claude (Claude 3 Sonnet)
- Gemini (Gemini Pro)
- Perplexity

각 모델의 특징과 비용은 크레딧 섹션에서 확인하실 수 있습니다.',
 8, 'published'),

-- 기술 카테고리
('technical', '브라우저 호환성은 어떻게 되나요?',
 'Chrome, Edge, Safari, Firefox 최신 버전에서 정상 작동합니다. 최적의 경험을 위해 Chrome 브라우저를 권장합니다.',
 9, 'published'),

('technical', '데이터는 어떻게 저장되나요?',
 '사용자 데이터는 Supabase에 안전하게 저장됩니다. 프로젝트 파일은 로컬 파일 시스템에 저장되며, 민감한 정보는 암호화되어 관리됩니다.',
 10, 'published');


-- ================================================
-- 완료!
-- ================================================
-- 다음 단계:
-- 1. 이 파일 검토 및 수정
-- 2. Supabase 프로젝트에서 SQL 실행
-- 3. RLS 활성화 확인
-- 4. Frontend에서 Supabase 연결
-- 5. Admin Dashboard에서 CRUD 기능 구현
-- ================================================
