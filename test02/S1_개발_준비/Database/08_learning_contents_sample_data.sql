-- ================================================
-- 학습용 콘텐츠 샘플 데이터
-- ================================================
-- 작성일: 2025-12-02
-- 목적: 테스트 및 개발용 샘플 데이터 (5×5 구조)
-- 대분류 3개 × 중분류 5개 × 소분류 5개 = 75개
-- ================================================

-- 기존 데이터 삭제 (테스트용)
TRUNCATE TABLE learning_contents CASCADE;

-- ================================================
-- 대분류 1: 웹개발 기초
-- ================================================

-- depth1: 웹개발 기초 > depth2: HTML/CSS
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('웹개발 기초', 'HTML/CSS', 'HTML 기본 구조', 'https://www.youtube.com/watch?v=example1', 'HTML 문서의 기본 구조', 1),
('웹개발 기초', 'HTML/CSS', 'CSS 선택자', 'https://www.youtube.com/watch?v=example2', 'CSS 선택자 종류', 2),
('웹개발 기초', 'HTML/CSS', 'Flexbox 레이아웃', 'https://www.youtube.com/watch?v=example3', 'Flexbox 활용', 3),
('웹개발 기초', 'HTML/CSS', 'Grid 레이아웃', 'https://www.youtube.com/watch?v=example4', 'CSS Grid', 4),
('웹개발 기초', 'HTML/CSS', '애니메이션', 'https://www.youtube.com/watch?v=example5', 'CSS 애니메이션', 5);

-- depth1: 웹개발 기초 > depth2: JavaScript
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('웹개발 기초', 'JavaScript', 'JavaScript 기초', 'https://www.youtube.com/watch?v=example6', '변수, 함수, 조건문', 1),
('웹개발 기초', 'JavaScript', 'DOM 조작', 'https://www.youtube.com/watch?v=example7', 'HTML 요소 조작', 2),
('웹개발 기초', 'JavaScript', '이벤트 처리', 'https://www.youtube.com/watch?v=example8', '이벤트 핸들링', 3),
('웹개발 기초', 'JavaScript', 'fetch API', 'https://www.youtube.com/watch?v=example9', '비동기 통신', 4),
('웹개발 기초', 'JavaScript', 'ES6+ 문법', 'https://www.youtube.com/watch?v=example10', '최신 문법', 5);

-- depth1: 웹개발 기초 > depth2: React
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('웹개발 기초', 'React', 'React 소개', 'https://www.youtube.com/watch?v=example11', 'React 기본', 1),
('웹개발 기초', 'React', 'JSX 문법', 'https://www.youtube.com/watch?v=example12', 'JSX 작성', 2),
('웹개발 기초', 'React', 'useState Hook', 'https://www.youtube.com/watch?v=example13', '상태 관리', 3),
('웹개발 기초', 'React', 'useEffect Hook', 'https://www.youtube.com/watch?v=example14', '사이드 이펙트', 4),
('웹개발 기초', 'React', 'Context API', 'https://www.youtube.com/watch?v=example15', '전역 상태', 5);

-- depth1: 웹개발 기초 > depth2: Vue.js
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('웹개발 기초', 'Vue.js', 'Vue 소개', 'https://www.youtube.com/watch?v=example16', 'Vue 기본', 1),
('웹개발 기초', 'Vue.js', 'Vue 템플릿', 'https://www.youtube.com/watch?v=example17', '템플릿 문법', 2),
('웹개발 기초', 'Vue.js', 'Vue 컴포넌트', 'https://www.youtube.com/watch?v=example18', '컴포넌트 작성', 3),
('웹개발 기초', 'Vue.js', 'Vuex', 'https://www.youtube.com/watch?v=example19', '상태 관리', 4),
('웹개발 기초', 'Vue.js', 'Vue Router', 'https://www.youtube.com/watch?v=example20', '라우팅', 5);

-- depth1: 웹개발 기초 > depth2: TypeScript
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('웹개발 기초', 'TypeScript', 'TypeScript 소개', 'https://www.youtube.com/watch?v=example21', 'TS 기본', 1),
('웹개발 기초', 'TypeScript', '타입 시스템', 'https://www.youtube.com/watch?v=example22', '타입 정의', 2),
('웹개발 기초', 'TypeScript', '인터페이스', 'https://www.youtube.com/watch?v=example23', 'Interface', 3),
('웹개발 기초', 'TypeScript', '제네릭', 'https://www.youtube.com/watch?v=example24', 'Generic', 4),
('웹개발 기초', 'TypeScript', 'Utility Types', 'https://www.youtube.com/watch?v=example25', '유틸리티 타입', 5);

-- ================================================
-- 대분류 2: 앱개발
-- ================================================

-- depth1: 앱개발 > depth2: React Native
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('앱개발', 'React Native', '시작하기', 'https://www.youtube.com/watch?v=example26', '환경 설정', 1),
('앱개발', 'React Native', '기본 컴포넌트', 'https://www.youtube.com/watch?v=example27', 'View, Text', 2),
('앱개발', 'React Native', 'StyleSheet', 'https://www.youtube.com/watch?v=example28', '스타일링', 3),
('앱개발', 'React Native', '네비게이션', 'https://www.youtube.com/watch?v=example29', '화면 전환', 4),
('앱개발', 'React Native', '상태 관리', 'https://www.youtube.com/watch?v=example30', 'Redux', 5);

-- depth1: 앱개발 > depth2: Flutter
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('앱개발', 'Flutter', 'Flutter 소개', 'https://www.youtube.com/watch?v=example31', 'Flutter 기본', 1),
('앱개발', 'Flutter', 'Widget 기초', 'https://www.youtube.com/watch?v=example32', 'Stateless/Stateful', 2),
('앱개발', 'Flutter', 'Layout', 'https://www.youtube.com/watch?v=example33', 'Row, Column', 3),
('앱개발', 'Flutter', 'State 관리', 'https://www.youtube.com/watch?v=example34', 'Provider', 4),
('앱개발', 'Flutter', '라우팅', 'https://www.youtube.com/watch?v=example35', 'Navigator', 5);

-- depth1: 앱개발 > depth2: Swift
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('앱개발', 'Swift', 'Swift 기초', 'https://www.youtube.com/watch?v=example36', 'Swift 문법', 1),
('앱개발', 'Swift', 'UIKit', 'https://www.youtube.com/watch?v=example37', 'UI 구성', 2),
('앱개발', 'Swift', 'SwiftUI', 'https://www.youtube.com/watch?v=example38', '선언형 UI', 3),
('앱개발', 'Swift', 'Combine', 'https://www.youtube.com/watch?v=example39', '반응형 프로그래밍', 4),
('앱개발', 'Swift', 'Core Data', 'https://www.youtube.com/watch?v=example40', '데이터 저장', 5);

-- depth1: 앱개발 > depth2: Kotlin
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('앱개발', 'Kotlin', 'Kotlin 기초', 'https://www.youtube.com/watch?v=example41', 'Kotlin 문법', 1),
('앱개발', 'Kotlin', 'Android Studio', 'https://www.youtube.com/watch?v=example42', '개발 환경', 2),
('앱개발', 'Kotlin', 'Activity', 'https://www.youtube.com/watch?v=example43', '화면 구성', 3),
('앱개발', 'Kotlin', 'Jetpack Compose', 'https://www.youtube.com/watch?v=example44', '선언형 UI', 4),
('앱개발', 'Kotlin', 'Room DB', 'https://www.youtube.com/watch?v=example45', '데이터베이스', 5);

-- depth1: 앱개발 > depth2: 앱 배포
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('앱개발', '앱 배포', 'App Store 등록', 'https://www.youtube.com/watch?v=example46', 'iOS 배포', 1),
('앱개발', '앱 배포', 'Google Play 등록', 'https://www.youtube.com/watch?v=example47', 'Android 배포', 2),
('앱개발', '앱 배포', '앱 심사 준비', 'https://www.youtube.com/watch?v=example48', '심사 통과', 3),
('앱개발', '앱 배포', '버전 관리', 'https://www.youtube.com/watch?v=example49', '업데이트 배포', 4),
('앱개발', '앱 배포', '앱 분석', 'https://www.youtube.com/watch?v=example50', 'Analytics', 5);

-- ================================================
-- 대분류 3: 데이터베이스
-- ================================================

-- depth1: 데이터베이스 > depth2: SQL
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('데이터베이스', 'SQL', 'SELECT 문', 'https://www.youtube.com/watch?v=example51', '데이터 조회', 1),
('데이터베이스', 'SQL', 'INSERT/UPDATE/DELETE', 'https://www.youtube.com/watch?v=example52', '데이터 조작', 2),
('데이터베이스', 'SQL', 'JOIN', 'https://www.youtube.com/watch?v=example53', '테이블 결합', 3),
('데이터베이스', 'SQL', '인덱스', 'https://www.youtube.com/watch?v=example54', '성능 최적화', 4),
('데이터베이스', 'SQL', '트랜잭션', 'https://www.youtube.com/watch?v=example55', 'ACID', 5);

-- depth1: 데이터베이스 > depth2: Supabase
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('데이터베이스', 'Supabase', 'Supabase 소개', 'https://www.youtube.com/watch?v=example56', 'Supabase란?', 1),
('데이터베이스', 'Supabase', '프로젝트 생성', 'https://www.youtube.com/watch?v=example57', '셋업', 2),
('데이터베이스', 'Supabase', 'JavaScript 클라이언트', 'https://www.youtube.com/watch?v=example58', 'JS 연동', 3),
('데이터베이스', 'Supabase', 'RLS 정책', 'https://www.youtube.com/watch?v=example59', '보안', 4),
('데이터베이스', 'Supabase', 'Storage', 'https://www.youtube.com/watch?v=example60', '파일 저장', 5);

-- depth1: 데이터베이스 > depth2: MongoDB
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('데이터베이스', 'MongoDB', 'MongoDB 소개', 'https://www.youtube.com/watch?v=example61', 'NoSQL 기본', 1),
('데이터베이스', 'MongoDB', 'Document 구조', 'https://www.youtube.com/watch?v=example62', 'BSON', 2),
('데이터베이스', 'MongoDB', 'CRUD 작업', 'https://www.youtube.com/watch?v=example63', '데이터 조작', 3),
('데이터베이스', 'MongoDB', 'Aggregation', 'https://www.youtube.com/watch?v=example64', '집계 쿼리', 4),
('데이터베이스', 'MongoDB', '인덱싱', 'https://www.youtube.com/watch?v=example65', '성능', 5);

-- depth1: 데이터베이스 > depth2: Firebase
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('데이터베이스', 'Firebase', 'Firebase 소개', 'https://www.youtube.com/watch?v=example66', 'Firebase 기본', 1),
('데이터베이스', 'Firebase', 'Firestore', 'https://www.youtube.com/watch?v=example67', 'NoSQL DB', 2),
('데이터베이스', 'Firebase', 'Authentication', 'https://www.youtube.com/watch?v=example68', '인증', 3),
('데이터베이스', 'Firebase', 'Storage', 'https://www.youtube.com/watch?v=example69', '파일 저장', 4),
('데이터베이스', 'Firebase', 'Hosting', 'https://www.youtube.com/watch?v=example70', '배포', 5);

-- depth1: 데이터베이스 > depth2: Redis
INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('데이터베이스', 'Redis', 'Redis 소개', 'https://www.youtube.com/watch?v=example71', '인메모리 DB', 1),
('데이터베이스', 'Redis', 'String 타입', 'https://www.youtube.com/watch?v=example72', '기본 타입', 2),
('데이터베이스', 'Redis', 'Hash/List/Set', 'https://www.youtube.com/watch?v=example73', '자료구조', 3),
('데이터베이스', 'Redis', '캐싱 전략', 'https://www.youtube.com/watch?v=example74', '성능 최적화', 4),
('데이터베이스', 'Redis', 'Pub/Sub', 'https://www.youtube.com/watch?v=example75', '메시징', 5);

-- ================================================
-- 완료!
-- ================================================
-- 총 75개 샘플 데이터 입력 완료
-- 대분류 3개 × 중분류 5개 × 소분류 5개 = 75개
-- ================================================
