# 프로젝트 그리드 운영 가이드

> **출처**: PoliticianFinder 실전 프로젝트
> **검증**: 44개 Task 완료 (Phase 1-6)
> **배포**: Vercel 프로덕션 배포 완료

---

## 📋 프로젝트 그리드란?

**프로젝트 그리드**는 프로젝트의 모든 작업을 Phase 단위로 관리하는 **작업 추적 시스템**입니다.

### 핵심 특징

1. **Supabase 기반 관리**
   - 모든 작업 정보가 Supabase `project_grid_tasks_revised` 테이블에 저장
   - 실시간 조회 및 업데이트 가능
   - 웹 기반 뷰어 제공

2. **Phase 기반 개발**
   - Phase 1~6으로 구분된 작업 관리
   - 각 Phase 완료 후 Gate Approval 진행
   - Phase별 검증 리포트 자동 생성

3. **이중 검증 시스템 (Dual Execution)**
   - **1차 실행**: Claude Code Sub-agents가 작업 수행
   - **2차 실행 & 검증**: Claude Code (다른 세션)가 코드 검토 및 수정
   - 품질 보장을 위한 2단계 검증 프로세스

4. **작업 추적 필드**
   ```sql
   - task_id: 작업 ID (예: P1BA1, P3BA4)
   - task_name: 작업명
   - phase: Phase 번호 (1~6)
   - status: 상태 (완료/진행중/대기)
   - progress: 진행률 (0~100%)
   - assigned_agent: 담당 에이전트
   - generated_files: 생성된 파일 목록
   - build_result: 빌드 결과
   - test_history: 테스트 이력
   - duration: 소요 시간
   - validation_result: 검증 결과
   - blocker: 차단 요인
   ```

5. **Phase Gate Approval**
   - 각 Phase 완료 후 승인 프로세스
   - 검증 항목: 빌드, 테스트, TypeScript, 코드 품질
   - 승인 후 다음 Phase 진행

---

## 🗄️ Supabase 데이터베이스 접근

### 연결 정보

```
Supabase URL: [프로젝트 URL]
테이블명: project_grid_tasks_revised
```

**접근 키 위치**: `.env.local` 파일

### 방법 1: 환경 변수 파일 사용 (권장)

```python
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv('.env.local')
url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

# 전체 작업 조회
result = supabase.table('project_grid_tasks_revised').select('task_id, task_name, status, progress').order('task_id').execute()

for task in result.data:
    print(f"{task['task_id']}: {task['task_name']} - {task['status']} ({task['progress']}%)")
```

### 방법 2: 직접 연결

```python
from supabase import create_client

SUPABASE_URL = "your-project-url"
SERVICE_ROLE_KEY = "your-service-role-key"
TABLE_NAME = "project_grid_tasks_revised"

supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

# 전체 작업 조회
result = supabase.table(TABLE_NAME).select('task_id, task_name, status, progress').order('task_id').execute()

for task in result.data:
    print(f"{task['task_id']}: {task['task_name']} - {task['status']} ({task['progress']}%)")
```

### Phase별 작업 조회

```python
# 특정 Phase 작업만 조회
result = supabase.table('project_grid_tasks_revised').select('*').eq('phase', 1).order('task_id').execute()

for task in result.data:
    print(f"Task ID: {task['task_id']}")
    print(f"Task Name: {task['task_name']}")
    print(f"Status: {task['status']}")
    print(f"Progress: {task['progress']}%")
    print(f"Build Result: {task.get('build_result', 'N/A')}")
    print('-' * 60)
```

---

## 🌐 웹 뷰어 사용

### 로컬 실행

```bash
cd project-grid
python -m http.server 8080
```

**접속 URL**: http://localhost:8080/index.html

### 뷰어 기능

- **3D 시각화**: Phase/Area별 작업 블록 표시
- **실시간 업데이트**: Supabase에서 최신 데이터 가져오기
- **필터링**: Phase, Area, Status별 필터
- **상세 정보**: Task 클릭 시 상세 팝업
- **통계**: 진행률, 완료율 대시보드

---

## 📊 Phase별 운영 가이드

### PoliticianFinder 실전 사례

| Phase | 작업 수 | 완료 | 승인 |
|-------|---------|------|------|
| Phase 1 | 8 | 8 | ✅ |
| Phase 2 | 1 | 1 | ✅ |
| Phase 3 | 6 | 6 | ✅ |
| Phase 4 | 22 | 22 | ✅ |
| Phase 5 | 3 | 3 | ✅ |
| Phase 6 | 4 | 4 | ✅ |
| **총계** | **44** | **44** | **✅ 100%** |

### Phase 1: Frontend Prototypes
- **작업**: 8개
- **결과물**: 35개 React 페이지, 46개 Mock API
- **빌드**: Next.js 빌드 성공
- **TypeScript**: 0 errors

### Phase 2: Database Setup
- **작업**: 1개
- **결과물**: Supabase 스키마, 7개 Migration 파일
- **테이블**: 10개 테이블 생성 완료

### Phase 3: API Integration
- **작업**: 6개
- **결과물**: 59개 Real API Routes
- **변환**: Mock API → Real API 100%

### Phase 4: Advanced Features
- **작업**: 22개
- **결과물**: 200+ 파일 생성
- **기능**: AI 평가, PDF 생성, 결제, 관리자 시스템

### Phase 5: Testing & QA
- **작업**: 3개
- **결과물**: 308+ 테스트
- **통과율**: 253/253 (100%)

### Phase 6: Operations
- **작업**: 4개
- **결과물**: CI/CD, 배포, 모니터링, 보안
- **배포**: Vercel 프로덕션 완료

---

## 🔄 작업 업데이트 방법

### Python 스크립트 사용

```python
# update_project_grid.py 사용
python update_project_grid.py --task-id P1F1 --status completed --progress 100
```

### 직접 업데이트

```python
from supabase import create_client

supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

# Task 상태 업데이트
supabase.table('project_grid_tasks_revised').update({
    'status': '완료',
    'progress': 100,
    'build_result': '✅ 성공',
    'test_history': 'Test(10/10) + Build ✅',
    'updated_at': 'now()'
}).eq('task_id', 'P1F1').execute()
```

---

## 📁 주요 파일 위치

### 환경 설정
- Supabase 연결 정보: `.env.local`
- 환경 변수 예시: `.env.example`

### Phase 승인 문서
- Phase 승인서: `validation/results/PHASE*_GATE_APPROVAL.md`
- 검증 리포트: `validation/results/PHASE*_VERIFICATION_REPORT.md`
- 승인 현황 JSON: `phase_gate_approvals.json`

### 매뉴얼
- 프로젝트 그리드 매뉴얼: `PROJECT_GRID_매뉴얼_V4.0.md`
- 이중 검증 가이드: `PHASE_BASED_DUAL_VERIFICATION.md`

---

## ✅ 체크리스트

### Task 시작 전
- [ ] Task ID 확인
- [ ] 의존성 작업 완료 확인
- [ ] 지시서 파일 읽기
- [ ] 프로젝트 그리드에 상태 업데이트 (`진행중`)

### Task 완료 후
- [ ] 빌드 성공 확인
- [ ] 테스트 통과 확인
- [ ] 파일 목록 기록
- [ ] 프로젝트 그리드 업데이트 (`완료`, 100%)
- [ ] 소요 시간 기록

### Phase 완료 후
- [ ] 모든 Task 완료 확인
- [ ] 빌드 성공 확인
- [ ] 모든 테스트 통과 확인
- [ ] Phase Gate Approval 문서 작성
- [ ] 승인 받기

---

## 🎯 성공 요인

**PoliticianFinder에서 검증된 성공 요인:**

1. **명확한 Task 정의**
   - Task ID로 모든 작업 추적
   - 파일명에 Task ID 포함
   - Git 커밋에 Task ID 포함

2. **이중 검증**
   - 1차: Sub-agent 작업
   - 2차: Claude Code 검토 및 수정
   - 품질 보장

3. **Phase Gate**
   - Phase별 승인 프로세스
   - 검증 리포트 작성
   - 다음 Phase 진행 전 확인

4. **Supabase 기반 관리**
   - 실시간 조회
   - 웹 뷰어로 시각화
   - 자동화 스크립트

---

**이 가이드는 PoliticianFinder 프로젝트에서 실제로 사용하여 검증된 방법입니다.**

**SSALWorks 프로젝트에도 동일하게 적용 가능합니다!**
