# 8편 | Supabase + HTML Viewer

---

AI와 대화하다 보면 불편한 진실을 마주하게 된다. 세션이 끊어지면 이전 대화 내용을 기억하지 못한다는 것이다.

오늘 다섯 개의 Task를 완료했다. 로그인 API, 회원가입 UI, 이메일 인증, 비밀번호 재설정, 세션 관리. 열심히 작업했고, 모든 것이 잘 동작한다. 그런데 내일 새로운 세션을 시작하면? AI는 "어디까지 했더라?"부터 다시 시작해야 한다.

이것은 AI의 잘못이 아니다. AI 세션은 원래 그렇게 설계되어 있다. 대화가 끝나면 컨텍스트가 사라진다. 마치 매일 아침 기억이 리셋되는 것과 같다.

SAL Grid에서는 이 문제를 데이터베이스로 해결한다. Grid 데이터를 Supabase에 저장해두면 세션이 끊어져도 데이터는 그대로 남아 있다. 새 세션이 시작되면 데이터베이스에서 읽어오면 된다. "어디까지 했더라?"가 아니라 "S2BA1이 완료됐고 S2BA2가 진행 중이군"으로 바로 시작할 수 있다.

## 1. 왜 Supabase인가

데이터베이스는 여러 가지가 있다. MySQL, PostgreSQL, MongoDB 등. 그런데 왜 Supabase를 선택했을까?

첫째, 설정이 쉽다. 웹사이트에서 몇 번 클릭하면 데이터베이스가 만들어진다. 서버를 직접 설치하거나 관리할 필요가 없다.

둘째, 무료로 시작할 수 있다. 작은 프로젝트라면 무료 플랜으로 충분하다. 나중에 프로젝트가 커지면 유료 플랜으로 업그레이드하면 된다.

셋째, PostgreSQL 기반이다. PostgreSQL은 검증된 관계형 데이터베이스다. 복잡한 쿼리도 가능하고, 데이터 무결성도 보장된다.

넷째, API가 자동으로 생성된다. 테이블을 만들면 REST API가 자동으로 만들어진다. 별도로 API 서버를 구축할 필요가 없다.

## 2. 세 개의 테이블

SAL Grid는 세 개의 테이블을 사용한다.

첫 번째는 project_sal_grid 테이블이다. 프로젝트의 모든 Task를 저장하는 핵심 테이블이다. 22개 속성이 컬럼으로 들어가 있다. Task ID, Task 이름, Stage, Area, 진행률, 상태, 검증 결과 등 모든 정보가 여기에 저장된다.

두 번째는 stage_verification 테이블이다. Stage Gate 검증 상태를 저장한다. 각 Stage가 AI 검증을 통과했는지, PO 승인을 받았는지, 최종 상태가 무엇인지 기록한다.

세 번째는 project_ssal_grid_tasks_template 테이블이다. 범용 템플릿 Task를 저장한다. 새 프로젝트를 시작할 때 이 템플릿을 복사해서 사용할 수 있다.

## 3. Task 테이블의 구조

project_sal_grid 테이블은 22개 속성을 담는다. 2편에서 배운 22개 속성이 그대로 데이터베이스 컬럼이 된다.

기본 정보 섹션에는 stage, area, task_id, task_name이 들어간다. Stage는 숫자로 저장되고(1~5), Area는 문자열로 저장된다(M, F, BA 등).

Task 정의 섹션에는 task_instruction, task_agent, tools, execution_type, dependencies가 들어간다. 이 Task를 누가 어떻게 수행해야 하는지 정의하는 정보들이다.

Task 실행 섹션에는 task_progress, task_status, generated_files, modification_history가 들어간다. 진행률은 0에서 100 사이의 숫자고, 상태는 Pending, In Progress, Completed 중 하나다.

검증 섹션에는 verification_instruction, verification_agent, test, build, integration_verification, blockers, comprehensive_verification, verification_status, remarks가 들어간다. 테스트, 빌드, 통합 결과는 JSONB 타입으로 저장되어 복잡한 구조도 담을 수 있다.

## 4. Stage Gate 테이블

stage_verification 테이블은 Stage 단위의 검증 상태를 추적한다.

stage_name에는 S1, S2 같은 Stage 이름이 들어간다. project_id에는 프로젝트 식별자가 들어간다. 여러 프로젝트를 관리할 때 구분하기 위해서다.

AI 자동 검증 섹션에는 auto_verification_status, auto_verification_result, auto_verification_date가 있다. AI가 검증을 완료했는지, 결과가 무엇인지, 언제 검증했는지 기록한다.

PO 수동 검증 섹션에는 manual_verification_status, manual_verification_comment, manual_verification_date가 있다. PO가 승인했는지 거부했는지, 어떤 코멘트를 남겼는지, 언제 확인했는지 기록한다.

최종 상태는 stage_gate_status에 저장된다. Not Started는 아직 검증이 시작되지 않은 상태, AI Verified는 AI 검증은 통과했지만 PO 승인 대기 중인 상태, Approved는 PO 승인까지 완료된 상태, Rejected는 거부된 상태다.

## 5. HTML Viewer로 한눈에 보기

데이터베이스에 저장된 데이터는 SQL로 조회할 수 있다. 하지만 매번 SQL을 작성하는 것은 번거롭다. 그래서 HTML Viewer를 만들었다.

HTML Viewer는 브라우저에서 열 수 있는 웹 페이지다. Supabase에 연결해서 Grid 데이터를 가져오고, 보기 좋게 표시해준다.

Task 목록을 Stage별로 필터링할 수 있다. S1만 보거나 S2만 보거나. Area별로도 필터링된다. Frontend 작업만 보거나 Backend 작업만 보거나. 상태별로도 필터링된다. 완료된 것만 보거나 진행 중인 것만 보거나.

각 Task를 클릭하면 상세 정보가 나온다. 22개 속성 전체를 확인할 수 있다. 검증 결과가 어떤지, 어떤 파일이 생성됐는지, 블로커가 있는지.

대시보드에서는 전체 진행 상황을 볼 수 있다. Stage별 완료율이 막대 그래프로 표시되고, 전체 진행률이 퍼센트로 나온다. 어디서 병목이 생기고 있는지 한눈에 파악된다.

## 6. 새 세션의 시작

Viewer가 있으면 새 세션을 시작할 때 훨씬 수월하다.

이전에는 "지난번에 뭘 했더라?"하고 대화 내용을 뒤지거나, work_log를 읽어야 했다. 하지만 이제는 Viewer를 열면 된다. 현재 진행 중인 Task가 뭔지, 다음에 해야 할 Task가 뭔지, 막혀 있는 것이 있는지 바로 보인다.

AI도 마찬가지다. 새 세션이 시작되면 데이터베이스에서 현재 상태를 읽어온다. 대화 맥락이 없어도 프로젝트 상태는 완벽하게 파악할 수 있다.

## 7. 보안 주의사항

개발 환경에서는 편의상 모든 접근을 허용해둔다. 누구나 읽고 쓸 수 있게. 하지만 프로덕션 환경에서는 이렇게 하면 안 된다.

Row Level Security(RLS, 행 단위 보안 정책)를 설정해서 인증된 사용자만 데이터를 수정할 수 있게 해야 한다. RLS는 "이 데이터는 누가 읽을 수 있고 누가 쓸 수 있는지"를 테이블의 각 행마다 제어하는 기능이다. 예를 들어 모든 사용자에게 읽기는 허용하되, 수정과 삭제는 인증된 관리자에게만 허용할 수 있다.

이 설정은 나중에 서비스를 배포할 때 반드시 변경해야 한다. 개발 환경 설정 그대로 배포하면 아무나 데이터를 수정할 수 있게 되어버린다.

## 8. 다음 단계

8편에서는 Supabase 데이터베이스와 HTML Viewer를 살펴봤다. AI의 기억력 한계를 데이터베이스로 극복하고, Viewer로 프로젝트 상태를 한눈에 파악할 수 있다.

다음 편에서는 SAL Grid 매뉴얼을 효과적으로 활용하는 방법을 살펴본다. 170KB 분량의 매뉴얼에서 필요한 정보를 빠르게 찾는 방법이다.

---

*다음 편: 9편 | SAL Grid 매뉴얼 활용법*

---

**작성일: 2025-12-20 / 수정일: 2025-12-20 / 글자수: 약 3,300자 / 작성자: Claude / 프롬프터: 써니**
