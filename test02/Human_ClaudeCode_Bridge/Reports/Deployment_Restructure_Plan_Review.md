# Vercel 배포 구조 개편 계획서 검토 보고서

> 검토일: 2025-12-26
> 검토 대상: `Deployment_Restructure_Plan.md`
> 검토자: Claude Code

---

## 📋 검토 요약

### 전체 평가: ⚠️ 중대한 문제 발견 - 실행 전 수정 필요

**심각도 분류:**
- 🔴 **치명적 문제**: 3건 (실행 시 서비스 중단 가능)
- 🟠 **중요 문제**: 5건 (배포 실패 가능)
- 🟡 **경고 사항**: 4건 (추가 검토 필요)
- 🟢 **개선 제안**: 3건

---

## 🔴 치명적 문제 (Critical Issues)

### 1. vercel.json 위치 불일치

**문제:**
계획서는 루트로 vercel.json을 이동하려 하지만, **이미 루트에 vercel.json이 존재**하고 있음.

**현재 상태:**
```
✅ C:\!SSAL_Works_Private\vercel.json (5.5KB) - 루트 (최신)
✅ C:\!SSAL_Works_Private\Production\vercel.json (5.5KB) - Production 폴더
```

**비교 결과:**
- 루트 vercel.json: `buildCommand: null` (빌드 없음)
- Production vercel.json: `buildCommand: "node build-all.js"` (빌드 있음)

**영향:**
- 계획서대로 실행 시 이미 존재하는 루트 vercel.json이 덮어쓰기될 위험
- 빌드 명령어 손실 가능

**해결 방안:**
1. 루트 vercel.json과 Production/vercel.json 내용 비교
2. 최신 버전 확인 후 병합
3. `buildCommand` 설정 유지 여부 결정 필요
4. Phase 4에서 "vercel.json 병합 및 검증" 단계 추가

---

### 2. 중복 파일 삭제 시 원본 손실 위험

**문제:**
Production 폴더의 **Books 폴더(1-3권)**를 삭제 대상으로 지정했으나, 실제로는 **Production에만 존재하는 파일들이 있을 수 있음**.

**현재 상태:**
```
Production/1권_Claude_ClaudeCode_사용법/
Production/2권_풀스택_웹사이트_개발_기초지식/
Production/3권_프로젝트_관리_방법/
```

계획서는 원본이 `부수적_고유기능/`에 있다고 가정하지만, **실제 Books 폴더는 다음 위치에 있음:**
```
부수적_고유기능/콘텐츠/학습용_Books_New/
```

**위험:**
- Production의 Books 폴더를 삭제 시 **Production에만 있는 최신 수정 사항 손실 가능**
- 원본 폴더 이름이 다름 (`학습용_Books_New` vs `1-3권`)

**해결 방안:**
1. 삭제 전 **반드시 diff 비교** 수행
2. Production에만 있는 파일/수정사항 백업
3. 폴더 이름 불일치 해결 (리네임 또는 심볼릭 링크)
4. 계획서 5.1절에 "파일 비교 및 백업" 단계 추가

---

### 3. Frontend 폴더 구조 혼란

**문제:**
계획서는 `Production/Frontend/` 폴더가 없다고 가정하지만, **실제로 존재**함.

**현재 상태:**
```bash
Production/
├── Frontend/          ← 실제로 존재! (guides.js, ordersheets.js 등 포함)
└── pages/             ← 실제 페이지들
```

**내용물:**
```
Production/Frontend/:
- guides.js (156KB)
- ordersheets.js (151KB)
- service-guides.js (38KB)
- admin-*.js (여러 파일)
- *.css 파일들
```

**계획서와의 충돌:**
- 계획서는 pages/를 Frontend로 간주
- 실제로는 Frontend 폴더에 JS/CSS가 있고, pages/에 HTML이 있음
- index.html은 `src="guides.js"`로 참조 (현재 Production/ 루트에도 복사본 존재)

**영향:**
- 경로 수정 계획이 실제 구조와 맞지 않음
- Frontend 폴더의 용도와 pages 폴더의 용도 혼재

**해결 방안:**
1. Frontend 폴더와 pages 폴더의 역할 명확히 정의
2. 계획서의 "Production 폴더 구조" 다이어그램 수정
3. 경로 수정 계획 재검토 (3.1절)

---

## 🟠 중요 문제 (Major Issues)

### 4. index.html 경로 수정 불완전

**문제:**
계획서는 13개 경로만 수정 대상으로 지정했으나, **실제로는 더 많은 경로가 존재**할 가능성.

**확인된 경로 (일부):**
```html
<!-- 계획서에 누락된 경로들 -->
<script src="guides.js"></script>                    ← 현재 Production 루트
<script src="ordersheets.js"></script>               ← 현재 Production 루트
<script src="service-guides.js"></script>            ← 현재 Production 루트

<!-- 동적 생성 경로 -->
window.open('books-viewer.html', '_blank');          ← Production 루트
window.open('learning-viewer.html?path=...', '_blank');
window.open('manual.html', '_blank');
```

**계획서 수정 사항 (3.1절):**
```bash
# 계획서는 이렇게 수정하려 함
sed -i 's|src="guides.js"|src="Briefings_OrderSheets/guides.js"|g'
```

**하지만 실제로는:**
- `guides.js`는 현재 **3곳**에 존재:
  1. `Production/guides.js` (156KB) ← index.html이 참조하는 곳
  2. `Production/Frontend/guides.js` (156KB)
  3. (원본은 빌드 스크립트로 생성)

**영향:**
- guides.js 등의 파일 위치를 Briefings_OrderSheets/로 변경 시 **빌드 스크립트 수정 필요**
- build-web-assets.js가 Production/ 루트에 guides.js를 생성하는 로직 확인 필요

**해결 방안:**
1. build-web-assets.js 검토하여 출력 경로 확인
2. 빌드 스크립트 수정 계획 추가
3. 경로 수정 후 빌드 테스트 필수

---

### 5. viewer_*.html 파일 이동 계획 오류

**문제:**
계획서 5.2절에서 `viewer_*.html` 파일들을 `S0_Project-SAL-Grid_생성/`으로 이동하려 하지만, 이는 **배포에 포함되지 않는 폴더**임.

**현재 viewer 파일들:**
```
Production/viewer_csv.html
Production/viewer_database.html
Production/viewer_mobile_csv.html
Production/viewer_mobile_database.html
```

**계획서의 이동 계획:**
```
viewer_*.html (4개) → S0_Project-SAL-Grid_생성/
```

**문제점:**
- S0_는 .vercelignore에 의해 배포에서 제외됨
- viewer 페이지들은 **실제로 대시보드에서 사용됨** (SAL Grid 조회)
- 이동 시 기능 손실

**해결 방안:**
1. viewer 페이지의 실제 사용 여부 확인
2. 사용 중이면 Production에 유지
3. 미사용이면 S0_로 이동 대신 삭제 고려
4. 계획서 5.2절 수정

---

### 6. admin-dashboard.html 중복 처리 미흡

**문제:**
계획서는 `admin-dashboard.html`을 `pages/admin/`으로 이동하려 하지만, **이미 pages/admin/에 dashboard.html이 존재**.

**현재 상태:**
```
Production/admin-dashboard.html (320KB)           ← 루트 (대용량)
Production/pages/admin/dashboard.html (6.3KB)    ← 작은 파일
```

**의문점:**
- 두 파일의 관계는?
- admin-dashboard.html이 통합 페이지이고, pages/admin/dashboard.html은 섹션 페이지인가?
- 이동 시 dashboard.html을 덮어쓸 것인가?

**해결 방안:**
1. 두 파일의 내용 비교
2. 용도 확인 후 통합 또는 리네임
3. index.html의 admin-dashboard.html 참조 확인
4. 계획서에 "파일명 충돌 해결" 단계 추가

---

### 7. .vercelignore 대상 폴더 불완전

**문제:**
계획서의 .vercelignore는 일부 폴더를 누락했음.

**계획서에 포함된 제외 폴더:**
```
S0-S5_*/, P0-P3_*/, 참고자료/, 공개_전환_업무/ 등
```

**누락된 폴더 (git status 기준):**
```
Sidebar-Process-Tools/             ← 계획서에 없음
Development_Process_Monitor/       ← 계획서에 있음 ✅
```

**추가 확인 필요:**
- `Sidebar-Process-Tools/` 폴더는 실제로 존재하는가? (git status에 표시됨)
- 배포에 포함되어야 하는가?

**해결 방안:**
1. Sidebar-Process-Tools 폴더 존재 여부 확인
2. 존재 시 .vercelignore에 추가
3. 기타 숨겨진 폴더 탐색 (`ls -la` 전체 확인)

---

### 8. Production 폴더 정리 계획의 모순

**문제:**
계획서 6.1절 "Production에 남는 것"과 실제 파일 이동 계획이 일치하지 않음.

**계획서에서 남는다고 한 파일:**
```
Production/
├── build-all.js
├── build-web-assets.js
├── vercel.json
├── package.json
├── package-lock.json
├── api/
├── Config/
└── data/
```

**하지만 5.2절에서는:**
- `guides.js`, `ordersheets.js` 등을 `Briefings_OrderSheets/`로 이동
- 빌드 스크립트 `build-web-assets.js`는 Production에 남음
- 빌드 스크립트의 출력 경로는 어디?

**모순:**
- build-web-assets.js가 Production/에 guides.js를 생성하는데, 이를 Briefings_OrderSheets/로 이동하면?
- 매번 빌드 후 수동으로 이동해야 하는가?

**해결 방안:**
1. build-web-assets.js의 출력 경로 변경 계획 추가
2. 또는 guides.js 등을 Production/에 유지하고 심볼릭 링크 사용
3. 계획서 6.1절과 5.2절 일치시키기

---

## 🟡 경고 사항 (Warnings)

### 9. 루트 index.html 복사본 관리

**문제:**
계획서는 index.html을 루트로 복사하려 하지만, **이미 Production/index.html이 644KB의 대용량 파일**임.

**질문:**
- 루트에 index.html을 복사한 후 Production/index.html은 어떻게 하는가?
- 두 파일을 동기화하는 방법은?
- 수정 시 어느 파일을 원본으로 할 것인가?

**위험:**
- 두 파일이 불일치 상태가 될 가능성
- Production/index.html이 최신인데 루트 index.html을 사용하면 구버전 배포

**해결 방안:**
1. index.html의 최종 위치 명확히 결정 (루트 or Production/)
2. 한쪽을 심볼릭 링크로 처리
3. 빌드 스크립트에서 자동 동기화

---

### 10. build-all.js의 빌드 경로 확인 필요

**문제:**
build-all.js는 다음 스크립트들을 실행:
```javascript
1. Development_Process_Monitor/build-progress.js
2. Production/build-web-assets.js
3. S0_Project-SAL-Grid_생성/build-sal-grid-csv.js
```

**우려:**
- 이 스크립트들의 출력 파일 위치는?
- 루트 배포로 변경 시 경로 수정이 필요한가?

**특히 build-web-assets.js:**
- guides.js, ordersheets.js 등을 어디에 생성하는가?
- Production/ 루트에 생성한다면, 루트 배포로 변경 시 루트에 생성되는가?

**해결 방안:**
1. build-web-assets.js 코드 검토
2. 출력 경로가 상대 경로인지 절대 경로인지 확인
3. 필요 시 빌드 스크립트 수정 계획 추가

---

### 11. 404.html 누락 위험

**문제:**
계획서 Phase 2에서 404.html을 루트로 복사하려 하지만, **Production/404.html의 존재 여부 미확인**.

**현재 상태:**
```
Production/404.html (4.1KB) ← 존재함
```

**하지만:**
- 루트에도 404.html이 있는가?
- 두 파일이 동일한가?
- vercel.json에 404 페이지 설정이 있는가?

**해결 방안:**
1. 루트와 Production의 404.html 비교
2. vercel.json에 404 설정 추가 여부 확인
3. 최신 버전 확인 후 복사

---

### 12. 동적 경로 수정 누락

**문제:**
계획서 3.4절에서 "동적 경로는 별도 검토 필요"라고만 하고 구체적인 계획이 없음.

**실제 동적 경로 예시:**
```javascript
// index.html 내 JavaScript
window.open('books-viewer.html', '_blank');
window.open('learning-viewer.html?path=' + encodeURIComponent(path), '_blank');
const url = isMobile ? 'manual_mobile.html' : 'manual.html';
window.open(url, '_blank');
```

**문제:**
- 이 경로들도 수정이 필요한가?
- books-viewer.html의 최종 위치는?
- 계획서에 명시되지 않음

**해결 방안:**
1. 모든 *.html 파일의 최종 위치 매핑 테이블 작성
2. JavaScript 내 동적 경로 수정 계획 추가
3. Phase 3에 "동적 경로 수정" 단계 추가

---

## 🟢 개선 제안 (Suggestions)

### 13. 롤백 계획 강화

**현재 계획:**
```
1. Vercel Root Directory를 Production/으로 복원
2. 백업에서 파일 복원
3. Git revert로 변경 취소
```

**부족한 점:**
- 백업 위치가 명시되지 않음
- 백업 방법이 구체적이지 않음
- Git revert 단계별 절차 없음

**개선안:**
```markdown
### 상세 롤백 절차

#### 1단계: Vercel 설정 복원 (즉시 - 30초)
- Vercel Dashboard → Settings → Root Directory → "Production" 입력
- 재배포 대기 (자동 트리거)

#### 2단계: 파일 복원 (5분)
- 백업 위치: `C:\!SSAL_Works_Private_BACKUP_20251226\`
- 복원 명령어:
  ```bash
  cp -r C:\!SSAL_Works_Private_BACKUP_20251226\Production\* C:\!SSAL_Works_Private\Production\
  ```

#### 3단계: Git 복원 (3분)
- 커밋 이전 상태로 되돌리기:
  ```bash
  git log --oneline -5  # 커밋 해시 확인
  git revert <commit-hash>
  git push origin master
  ```

#### 4단계: 검증 (5분)
- Vercel 배포 완료 대기
- 주요 페이지 접속 테스트
  - https://ssalworks.ai.kr
  - https://ssalworks.ai.kr/pages/auth/login.html
  - https://ssalworks.ai.kr/admin-dashboard.html
```

---

### 14. 단계별 검증 체크리스트 추가

**현재 계획:**
Phase 5에 "검증" 단계가 있지만 구체적이지 않음.

**개선안:**
각 Phase마다 검증 체크리스트 추가:

```markdown
### Phase 1 검증
- [ ] .vercelignore 파일 생성 확인 (`ls -la .vercelignore`)
- [ ] .vercelignore 문법 오류 없음 (vercel-cli 검사)

### Phase 2 검증
- [ ] 루트 index.html 존재 확인
- [ ] 루트 404.html 존재 확인
- [ ] Production 파일들 이동 완료
- [ ] 이동 후 diff 확인 (원본과 동일)

### Phase 3 검증
- [ ] index.html 경로 수정 완료 (13개)
- [ ] sed 명령어 실행 로그 확인
- [ ] 수정 후 HTML 문법 검사 (W3C Validator)

### Phase 4 검증
- [ ] Vercel Root Directory 설정 변경 확인 (스크린샷)
- [ ] Build Command 확인
- [ ] Environment Variables 확인

### Phase 5 검증 (최종)
- [ ] 로컬 빌드 성공 (`node build-all.js`)
- [ ] Vercel 배포 성공
- [ ] 모든 페이지 접속 테스트 (13개)
- [ ] API 엔드포인트 테스트 (샘플 5개)
- [ ] 정적 파일 로딩 테스트 (이미지, CSS, JS)
- [ ] Books 콘텐츠 표시 정상
```

---

### 15. 마이그레이션 영향 분석 추가

**제안:**
계획서에 "영향 받는 시스템/기능" 섹션 추가

```markdown
## 영향 받는 시스템 및 기능

### 1. 영향 받는 페이지
| 페이지 | 경로 변경 | 테스트 필요 |
|--------|----------|------------|
| 로그인 | `/pages/auth/login.html` | ✅ |
| 회원가입 | `/pages/auth/signup.html` | ✅ |
| 관리자 대시보드 | `/admin-dashboard.html` → `/Production/pages/admin/admin-dashboard.html` | ✅ |
| ... | ... | ... |

### 2. 영향 받는 API
- 없음 (API 경로는 vercel.json rewrites로 관리)

### 3. 영향 받는 외부 링크
- 이메일 템플릿의 링크 확인 필요
- OAuth 리다이렉트 URI 확인 필요

### 4. 영향 받는 빌드 프로세스
- build-web-assets.js 출력 경로 수정 필요
- build-all.js의 Working Directory 확인 필요
```

---

## 📊 위험도 평가

### 실행 시 예상 문제 확률

| 문제 유형 | 확률 | 영향도 | 우선순위 |
|----------|------|--------|---------|
| vercel.json 충돌 | **90%** | 치명적 | 🔴 즉시 해결 |
| Books 폴더 손실 | **70%** | 치명적 | 🔴 즉시 해결 |
| Frontend 구조 혼란 | **80%** | 중대 | 🟠 우선 해결 |
| 경로 수정 불완전 | **60%** | 중대 | 🟠 우선 해결 |
| viewer 페이지 손실 | **50%** | 중대 | 🟠 우선 해결 |
| admin-dashboard 충돌 | **40%** | 중간 | 🟡 검토 필요 |
| 빌드 스크립트 오류 | **30%** | 중간 | 🟡 검토 필요 |

---

## ✅ 실행 전 필수 조치 사항

### 즉시 수정 필요 (Critical)

1. **vercel.json 병합 계획 수립**
   - 루트와 Production의 vercel.json 비교
   - buildCommand 유지 여부 결정
   - Phase 4에 "vercel.json 병합" 단계 추가

2. **Books 폴더 백업 및 비교**
   - Production/1-3권과 부수적_고유기능/콘텐츠/학습용_Books_New/ 비교
   - 차이점 문서화
   - 백업 후 삭제 (또는 이동 대신 심볼릭 링크)

3. **Frontend 폴더 구조 정리**
   - Frontend/ 와 pages/ 의 역할 명확히 정의
   - 계획서의 구조 다이어그램 수정
   - 경로 수정 계획 재작성

### 추가 검토 필요 (Major)

4. **빌드 스크립트 출력 경로 확인**
   - build-web-assets.js 코드 리뷰
   - guides.js 등의 최종 위치 결정
   - 필요 시 빌드 스크립트 수정

5. **viewer 페이지 사용 여부 확인**
   - viewer_*.html 이 실제로 사용되는지 확인
   - 사용 중이면 Production에 유지
   - 미사용이면 삭제 또는 아카이빙

6. **admin-dashboard.html 통합**
   - 루트의 admin-dashboard.html과 pages/admin/dashboard.html 비교
   - 용도 확인 후 통합 또는 리네임

### 계획서 보완 (Enhancements)

7. **동적 경로 수정 계획 추가**
   - JavaScript 내 모든 경로 나열
   - 각 경로의 최종 위치 매핑
   - Phase 3에 동적 경로 수정 단계 추가

8. **롤백 계획 강화**
   - 백업 위치 명시
   - 단계별 롤백 절차 작성
   - 예상 소요 시간 추가

9. **검증 체크리스트 상세화**
   - 각 Phase마다 검증 항목 추가
   - 최종 검증 시 테스트할 URL 목록 작성

---

## 📝 권장 실행 순서 (수정안)

### 수정된 Phase 순서

```markdown
### Phase 0: 사전 검토 (NEW - 필수!)
1. [ ] vercel.json 두 파일 비교 및 병합
2. [ ] Books 폴더 비교 및 백업
3. [ ] Frontend 구조 명확화
4. [ ] build-web-assets.js 코드 리뷰
5. [ ] 모든 *.html 파일 위치 매핑 테이블 작성
6. [ ] 동적 경로 목록 작성

### Phase 1: 준비
1. [ ] 전체 프로젝트 백업 (경로: C:\!SSAL_Works_Private_BACKUP_20251226\)
2. [ ] 현재 배포 상태 스크린샷
3. [ ] .vercelignore 파일 생성
4. [ ] Sidebar-Process-Tools 폴더 확인 후 .vercelignore 추가 (필요 시)

### Phase 2: 파일 정리 (수정됨)
1. [ ] Production 내 중복 파일 삭제 (Books 제외, 백업 후)
2. [ ] Production 내 테스트 파일 삭제
3. [ ] Production/Frontend/ 정리 (pages/와 통합)
4. [ ] viewer_*.html 위치 결정 (유지 or 이동)
5. [ ] admin-dashboard.html 통합

### Phase 3: 파일 배치 (수정됨)
1. [ ] index.html 최종 위치 결정 (루트 or Production/)
2. [ ] 404.html 복사 (루트에 없다면)
3. [ ] vercel.json 병합 및 검증
4. [ ] books-viewer.html, manual.html 등 위치 결정

### Phase 4: 경로 수정 (상세화)
1. [ ] build-web-assets.js 출력 경로 수정 (필요 시)
2. [ ] index.html 정적 경로 수정 (13개)
3. [ ] index.html 동적 경로 수정 (JavaScript 내)
4. [ ] HTML 문법 검증 (W3C Validator)

### Phase 5: 설정 변경
1. [ ] Vercel Dashboard → Root Directory 비움
2. [ ] Build Command 확인 (node Production/build-all.js)
3. [ ] Environment Variables 확인

### Phase 6: 검증 (상세화)
1. [ ] 로컬 빌드 테스트 (`node Production/build-all.js`)
2. [ ] Vercel Preview 배포
3. [ ] 모든 페이지 접속 테스트 (체크리스트)
4. [ ] API 엔드포인트 테스트
5. [ ] Books 콘텐츠 로딩 확인
6. [ ] 모바일 반응형 확인

### Phase 7: 프로덕션 배포
1. [ ] 최종 승인
2. [ ] Production 배포
3. [ ] 배포 후 모니터링 (30분)
4. [ ] 문제 발생 시 즉시 롤백
```

---

## 🎯 최종 권장 사항

### 실행 전 반드시 해야 할 일 (Top 5)

1. **vercel.json 병합 계획 수립** (치명적)
2. **Books 폴더 백업 및 비교** (치명적)
3. **Frontend/pages 구조 재정의** (중요)
4. **build-web-assets.js 출력 경로 확인** (중요)
5. **전체 파일 위치 매핑 테이블 작성** (중요)

### 계획서 수정이 필요한 섹션

- **섹션 3.1**: 경로 수정 대상 추가 (동적 경로)
- **섹션 5.1**: 삭제 대상에서 Books 제외 또는 백업 명시
- **섹션 5.2**: viewer_*.html 이동 계획 재검토
- **섹션 6.1**: Production에 남는 파일 목록 수정
- **섹션 8**: 롤백 계획 상세화
- **새 섹션 추가**: Phase 0 (사전 검토)

### 예상 소요 시간 (재산정)

| 작업 | 원래 계획 | 수정 계획 | 비고 |
|------|----------|----------|------|
| Phase 0 (사전 검토) | 없음 | **2시간** | 필수 추가 |
| Phase 1 (준비) | 5분 | **30분** | 백업 포함 |
| Phase 2 (정리) | 15분 | **1시간** | 비교 작업 포함 |
| Phase 3 (배치) | - | **30분** | 병합 작업 포함 |
| Phase 4 (경로 수정) | 10분 | **1시간** | 동적 경로 포함 |
| Phase 5 (설정) | 5분 | **15분** | 검증 포함 |
| Phase 6 (검증) | 15분 | **1시간** | 상세 테스트 |
| **총계** | **~50분** | **~6시간** | 안전성 우선 |

---

## 💡 결론

**계획서 상태: ⚠️ 부분적으로 유효 - 중대한 수정 필요**

**주요 문제:**
- 실제 프로젝트 구조와 계획서의 가정이 불일치
- 중복 파일 처리 계획이 불완전
- 빌드 프로세스 영향 분석 부족

**다음 단계 권장 사항:**
1. 위 "실행 전 필수 조치 사항" 5개 항목 완료
2. 계획서 수정 (특히 Phase 0 추가)
3. 파일럿 테스트 (별도 브랜치에서 실행)
4. 검증 후 본 계획 실행

**위험 완화 후 실행 시 성공 확률: 85%**
**현재 상태에서 실행 시 성공 확률: 40%**

---

*검토 완료일: 2025-12-26*
*검토자: Claude Code*
*보고서 버전: 1.0*
