# 12편 | Orders/Reports JSON 시스템

---

10편에서 Order Sheet 제도를 살펴봤다. 대화 대신 구조화된 문서로 작업을 요청한다는 개념이었다. 이번 편에서는 그 문서의 실제 형태를 살펴본다.

Order Sheet와 Report는 모두 JSON 형식이다. JSON은 컴퓨터가 읽기 쉬운 형식이면서 사람이 읽기도 어렵지 않다. 중괄호 안에 키와 값이 쌍으로 들어간다.

왜 JSON인가? 첫째, 구조가 명확하다. 어떤 필드에 어떤 값이 있는지 한눈에 보인다. 둘째, 검색이 쉽다. task_id로 필터링하거나 status가 completed인 것만 찾을 수 있다. 셋째, 자동화가 가능하다. 프로그램으로 파싱해서 대시보드에 표시하거나 통계를 낼 수 있다.

## 1. Order JSON의 구조

Order JSON에는 몇 가지 핵심 필드가 있다.

order_id는 이 Order의 고유 식별자다. ORDER-S2F1-251218처럼 어떤 Task를 언제 요청했는지 알 수 있는 형식으로 만든다.

task_id는 SAL Grid의 Task ID다. S2F1, S3BA2 같은 형식. 이 Order가 어떤 Grid Task에 관한 것인지 연결한다.

instructions는 작업 지시사항이다. 무엇을 어떻게 만들어야 하는지 자연어로 설명한다.

expected_output은 예상 결과물 목록이다. 어떤 파일이 어느 경로에 생성되어야 하는지 명시한다. Production/Frontend/pages/auth/google-login.html처럼 구체적인 경로까지 적는다.

dependencies는 선행 Task 목록이다. 이 작업을 하려면 먼저 완료되어 있어야 하는 Task들이다.

rules_reference는 참조해야 할 규칙 파일 목록이다. AI가 이 규칙들을 읽고 따르도록 지시한다.

## 2. Stage 단위 Order

개별 Task가 아니라 Stage 전체를 요청할 수도 있다. S3 Stage 전체를 작업해달라는 Order다.

Stage Order는 개별 Task의 상세 지시를 포함하지 않는다. 대신 실행 단계만 명시한다. Grid를 확인하고, 실행 순서를 결정하고, Task를 수행하고, 검증하고, Stage Gate를 통과시켜라.

왜 이렇게 할까? Grid가 진실의 원천이기 때문이다. 구체적인 Task 정보는 이미 SAL Grid에 들어가 있다. Order Sheet가 그 정보를 중복해서 담을 필요가 없다. Order Sheet는 "Grid 보고 해라"라고만 지시하면 된다.

이렇게 하면 정보가 한 곳에만 있다. Task 정보를 수정해야 할 때 Grid만 수정하면 된다. Order Sheet까지 수정할 필요가 없다.

## 3. Report JSON의 종류

Report에는 세 가지 종류가 있다.

첫 번째는 Task 완료 보고서다. 하나의 Task가 완료되면 작성한다. 어떤 파일을 생성했는지, 시작과 종료 시간이 언제인지, 다음 단계가 무엇인지 기록한다.

두 번째는 검증 보고서다. Task를 검증한 결과를 기록한다. 테스트 결과, 빌드 결과, 통합 검증 결과, Blocker 여부, 최종 판정이 들어간다.

세 번째는 Stage Gate 보고서다. Stage 전체의 검증 결과를 기록한다. 몇 개의 Task가 있고 몇 개가 완료됐는지, 모든 검증이 통과했는지, PO가 테스트할 때 필요한 가이드가 무엇인지.

## 4. Task 완료 보고서

Task가 끝나면 완료 보고서를 만든다.

order_id에는 원본 Order의 ID가 들어간다. 어떤 요청에 대한 결과인지 연결한다.

execution 필드에는 실행 정보가 들어간다. 시작 시간, 종료 시간, 소요 시간, 어떤 Agent가 작업했는지.

files_created에는 생성된 파일 목록이 들어간다. Stage 폴더 경로와 Production 폴더 경로를 구분해서 기록한다. 이중 저장을 했다면 두 경로가 모두 적힌다.

summary에는 작업 요약이 들어간다. 무엇을 만들었고 어떻게 동작하는지 간단히 설명한다.

next_steps에는 다음 작업이 들어간다. 이 Task가 끝났으니 다음으로 할 수 있는 Task가 무엇인지 제안한다.

## 5. 검증 보고서

Task 검증이 끝나면 검증 보고서를 만든다.

test_result에는 테스트 결과가 들어간다. 단위 테스트, 통합 테스트, 엣지 케이스, 수동 테스트 각각의 결과를 기록한다.

build_verification에는 빌드 결과가 들어간다. 컴파일 성공 여부, 린트 에러 개수, 배포 성공 여부, 런타임 에러 여부를 기록한다.

integration_verification에는 통합 검증 결과가 들어간다. 선행 Task 연동 확인, 다른 Task와 충돌 없음, 데이터 흐름 정상을 기록한다.

blockers에는 막히는 문제가 있는지 기록한다. 없으면 "No Blockers"라고 적는다.

comprehensive_verification에는 모든 것을 종합한 최종 판정이 들어간다. Passed면 통과, Failed면 수정이 필요하다.

## 6. Stage Gate 보고서

Stage의 모든 Task가 완료되면 Stage Gate 보고서를 만든다.

task_summary에는 전체 현황이 들어간다. Task가 총 몇 개인지, 몇 개가 완료됐는지, 몇 개가 검증을 통과했는지, 완료율이 몇 퍼센트인지.

tasks에는 각 Task의 상태가 목록으로 들어간다. Task ID, 이름, 완료 상태, 검증 결과를 한눈에 볼 수 있다.

overall_verification에는 전체 검증 결과가 들어간다. 모든 Task가 완료됐는지, 모든 테스트가 통과했는지, Blocker가 없는지, 빌드가 성공했는지.

po_test_guide에는 PO가 직접 테스트할 때 필요한 정보가 들어간다. 사전 조건이 무엇인지, 어떤 기능을 어떻게 테스트하면 되는지, 예상 결과가 무엇인지.

stage_gate_status에는 현재 상태가 들어간다. AI 검증이 끝났고 PO 승인을 기다리는 중이라면 "AI Verified - PO 승인 대기"라고 적는다.

## 7. 파일 명명과 저장 위치

Report 파일 이름도 규칙이 있다.

Task 완료 보고서는 S2F1_completed.json처럼 Task ID에 _completed를 붙인다. 검증 보고서는 S2F1_verification.json처럼 _verification을 붙인다. Stage Gate 보고서는 S2_stage_gate_report.json처럼 Stage에 _stage_gate_report를 붙인다.

모든 Report 파일은 Human_ClaudeCode_Bridge/Reports/ 폴더에 저장한다. 폴더를 열면 어떤 작업이 완료됐는지 한눈에 볼 수 있다.

## 8. 세션 간 연속성

이 시스템의 진짜 힘은 세션이 끊어져도 작업이 이어진다는 것이다.

세션 1에서 S2F1을 완료했다. S2F1_completed.json 파일이 생성됐다. 그리고 세션이 끊어졌다.

세션 2가 시작됐다. AI는 Reports 폴더를 확인한다. S2F1_completed.json을 읽는다. "S2F1이 완료됐고, 다음은 S2BA1이군." 바로 이어서 작업할 수 있다.

대화만으로는 이게 안 된다. 대화 내용은 세션이 끊어지면 사라진다. 하지만 파일은 남아 있다. 파일을 읽으면 이전 작업 상태를 100% 복원할 수 있다.

## 9. 3권을 마무리하며

12편에 걸쳐 SAL Grid의 프로젝트 관리 방법을 살펴봤다.

3차원 좌표계와 22개 속성으로 Task를 정의했다. 5×11 Matrix로 프로젝트 전체를 조망했다. Task를 나누고 의존성을 관리했다. Instruction을 명확하게 작성했다. 3단계 검증 시스템과 Stage Gate로 품질을 보장했다. Supabase와 HTML Viewer로 데이터를 영속화하고 시각화했다. 매뉴얼을 효율적으로 활용하는 방법을 배웠다. Order Sheet로 작업을 요청하고, 6대 규칙으로 일관성을 확보하고, JSON 시스템으로 세션 간 연속성을 보장했다.

이 모든 것이 하나의 목표를 향한다. AI와 함께 프로젝트를 체계적으로 관리하는 것. 혼란 없이, 빠뜨림 없이, 일관되게.

---

*3권: 프로젝트 관리 방법 - 완료*

---

**작성일: 2025-12-20 / 수정일: 2025-12-20 / 글자수: 약 3,400자 / 작성자: Claude / 프롬프터: 써니**
