# 외부 연동 설정 Guide 작성 및 배포 프로세스

> **Claude Code 필독**: 외부 연동 설정 Guide 작성 요청을 받으면 이 문서를 따라 MD 파일 작성부터 Production 반영까지 완료하세요.

---

## 1. 전체 프로세스 요약 (자동화)

```
[1단계] 새 가이드 번호 확인
    ↓
[2단계] MD 파일 작성
    ↓
[3단계] guides-list.json에 항목 추가
    ↓
[4단계] node sync-guides.js 실행 → 2개 파일 자동 업데이트
    ↓
[5단계] 완료 보고
```

**핵심**: `guides-list.json` 하나만 수정하면 스크립트가 2개 파일 자동 동기화!

---

## 2. 1단계: 새 가이드 번호 확인

### 2.1 현재 가이드 목록

| 번호 | ID | 서비스 | 파일명 |
|------|-----|--------|--------|
| 01 | database | 데이터베이스 (Supabase) | `01_데이터베이스_설정.md` |
| 02 | auth | 회원인증 (Google OAuth) | `02_회원인증_설정.md` |
| 03 | email | 이메일 (Resend) | `03_이메일_시스템_설정.md` |
| 04 | deploy | 배포/도메인 (Vercel) | `04_배포_도메인_설정.md` |
| 05 | payment | 결제 (토스페이먼츠) | `05_결제_시스템_설정.md` |

### 2.2 새 가이드 번호

- 다음 번호는 `06`
- 파일명 형식: `{번호}_{서비스명}_설정.md`
- 예: `06_SMS_시스템_설정.md`

---

## 3. 2단계: MD 파일 작성

### 3.1 저장 위치

```
부수적_고유기능/콘텐츠/외부_연동_설정_Guide/{번호}_{서비스명}_설정.md
```

### 3.2 파일명 규칙

- `{번호}_{서비스명}_설정.md` 형식
- 번호는 2자리 (01, 02, 06...)
- 언더스코어(_)로 단어 구분
- 예: `06_SMS_시스템_설정.md`

### 3.3 내용 구성 (필수 섹션)

```markdown
# {서비스명} 설정 가이드

## 1. 개요
- 해당 서비스가 무엇인지
- 왜 필요한지

## 2. 사전 준비
- 필요한 계정
- 필요한 도구

## 3. 설정 단계
### 3.1 첫 번째 단계
(스크린샷 포함 권장)

### 3.2 두 번째 단계
...

## 4. 환경 변수 설정
| 변수명 | 설명 | 예시 |
|--------|------|------|
| SERVICE_API_KEY | API 키 | sk_xxx... |

## 5. 테스트 방법
- 설정 완료 후 확인 방법

## 6. 트러블슈팅
| 문제 | 원인 | 해결 |
|------|------|------|
| ... | ... | ... |
```

### 3.4 작성 시 주의사항

- **민감 정보 금지**: 실제 API 키, 비밀번호 포함 금지
- **플레이스홀더 사용**: `YOUR_API_KEY`, `your-password` 등
- **실전 경험 기반**: 직접 설정하면서 겪은 문제 포함
- **복사-붙여넣기 가능**: Claude Code가 바로 사용할 수 있도록 작성

---

## 4. 3단계: guides-list.json에 항목 추가

### 4.1 파일 위치

```
부수적_고유기능/콘텐츠/외부_연동_설정_Guide/guides-list.json
```

### 4.2 새 가이드 추가

`guides` 배열에 새 객체 추가:

```json
{
  "id": "sms",
  "file": "06_SMS_시스템_설정.md",
  "title": "SMS 시스템 설정 (Twilio)",
  "icon": "📱",
  "order": 6
}
```

**필드 설명:**
- `id`: 고유 식별자 (영문 소문자)
- `file`: 파일명
- `title`: 표시될 제목 (아이콘 제외)
- `icon`: 이모지 아이콘
- `order`: 표시 순서

### 4.3 전체 구조 예시

```json
{
  "basePath": "부수적_고유기능/콘텐츠/외부_연동_설정_Guide",
  "githubRawBase": "https://raw.githubusercontent.com/SUNWOONGKYU/SSALWorks/master",
  "guides": [
    { "id": "database", "file": "01_데이터베이스_설정.md", "title": "...", "icon": "🗄️", "order": 1 },
    { "id": "auth", "file": "02_회원인증_설정.md", "title": "...", "icon": "🔐", "order": 2 },
    ...
    { "id": "sms", "file": "06_SMS_시스템_설정.md", "title": "SMS 시스템 설정 (Twilio)", "icon": "📱", "order": 6 }
  ]
}
```

---

## 5. 4단계: 동기화 스크립트 실행

### 5.1 스크립트 실행

```bash
cd 부수적_고유기능/콘텐츠/외부_연동_설정_Guide
node sync-guides.js
```

### 5.2 실행 결과

```
🔄 외부 연동 설정 Guide 동기화 시작...

📄 guides-list.json 로드...
   가이드: 6개

📝 index.html 업데이트...
  ✅ 업데이트: index.html (SERVICE_GUIDE_PATHS, SERVICE_GUIDE_TITLES)

📦 service-guides.js 번들링...
    ✅ 01_데이터베이스_설정.md → database
    ✅ 02_회원인증_설정.md → auth
    ...
    ✅ 06_SMS_시스템_설정.md → sms
  ✅ 생성: service-guides.js (6개 가이드 번들)

✅ 동기화 완료!
```

### 5.3 자동 업데이트되는 파일

| # | 파일 | 업데이트 내용 |
|---|------|--------------|
| 1 | `Production/index.html` | SERVICE_GUIDE_PATHS, SERVICE_GUIDE_TITLES |
| 2 | `Production/Frontend/service-guides.js` | MD 콘텐츠 번들 (로컬/오프라인 지원) |

---

## 6. 5단계: 완료 보고

작업 완료 후 사용자에게 보고:

```
외부 연동 설정 Guide 작성 완료:

1. MD 파일 생성: 외부_연동_설정_Guide/{파일명}.md
2. guides-list.json 업데이트 완료
3. sync-guides.js 실행 → 2개 파일 자동 동기화 ✅

대시보드 사이드바 "서비스 연동 설정"에서 "{가이드 제목}"으로 접근 가능합니다.
```

---

## 7. 시스템 구조

```
GitHub 저장소
    ↓ (push)
jsdelivr CDN (자동 반영) + GitHub Raw
    ↓ (fetch)
index.html (Marked.js로 렌더링)
    ↓
사용자 화면 (모달)
```

### 파일 관계

```
외부_연동_설정_Guide/
├── guides-list.json                     ← 단일 소스 (이것만 수정!)
├── sync-guides.js                       ← 동기화 스크립트
├── 외부_연동_설정_Guide_제공_프로세스.md ← 이 문서
│
├── 01_데이터베이스_설정.md              ← 가이드 1
├── 02_회원인증_설정.md                  ← 가이드 2
├── 03_이메일_시스템_설정.md             ← 가이드 3
├── 04_배포_도메인_설정.md               ← 가이드 4
└── 05_결제_시스템_설정.md               ← 가이드 5
```

### 렌더링 방식

1. **온라인**: GitHub Raw URL에서 fetch → Marked.js 렌더링
2. **오프라인/로컬**: service-guides.js 번들 사용

---

## 8. 체크리스트

외부 연동 설정 Guide 작성 완료 전 확인:

**MD 파일:**
- [ ] 올바른 폴더에 저장했는가?
- [ ] 파일명이 `{번호}_{서비스명}_설정.md` 형식인가?
- [ ] 필수 섹션(개요, 설정 단계, 환경 변수, 테스트)을 포함했는가?
- [ ] 민감 정보(실제 API 키 등)가 없는가?

**JSON 업데이트:**
- [ ] `guides-list.json`에 항목 추가했는가?
- [ ] `id`가 고유한가?
- [ ] `file`이 실제 파일명과 일치하는가?
- [ ] `order`가 올바른가?

**동기화:**
- [ ] `node sync-guides.js` 실행했는가?
- [ ] 2개 파일 모두 업데이트 확인했는가?

---

## 9. Production 배포 확인

동기화 후 다음 파일들이 자동 업데이트됩니다:

1. **Production/index.html** - 대시보드 (가이드 목록, fetch URL)
2. **Production/Frontend/service-guides.js** - MD 콘텐츠 번들

git push하면 Vercel이 자동 배포하여 메인 화면에 즉시 반영됩니다.
