# SSALWorks Vercel 종합 연동 설정 가이드

> Vercel + Supabase + Resend + Whois 도메인 통합 설정

**작성일**: 2025-12-16
**작업자**: Claude Code

### 연동 서비스
| 서비스 | 용도 |
|--------|------|
| **Vercel** | 호스팅 & Serverless Functions |
| **Supabase** | 데이터베이스 & 인증 |
| **Resend** | 이메일 발송 |
| **Whois** | 도메인 (ssalworks.ai.kr) |

**Vercel 프로젝트**: ssal-works

---

## 1. 개요

### 목표
- SSALWorks v1.0 프로젝트를 Vercel에 배포
- ssalworks.ai.kr 도메인 연결
- Serverless Functions (API) 배포

### 프로젝트 구조
```
Production/Frontend/     ← Vercel Root Directory
├── api/                 ← Serverless Functions
│   ├── auth/
│   ├── email/
│   ├── lib/
│   └── subscription/
├── assets/
├── pages/
├── index.html
└── vercel.json
```

---

## 2. Vercel 프로젝트 생성

### Step 1: Vercel 로그인
```
https://vercel.com → Log In (GitHub 계정)
```

### Step 2: 새 프로젝트 추가
```
Dashboard → Add New... → Project
→ Import Git Repository → SSALWorks 선택
```

### Step 3: 프로젝트 설정
| 항목 | 값 |
|------|-----|
| Project Name | `ssal-works` (소문자, 하이픈 가능) |
| Framework Preset | `Other` |
| Root Directory | `Production/Frontend` |
| Build Command | (비워두기) |
| Output Directory | (비워두기) |

**주의**: Project Name에 대문자, 한글, 특수문자 사용 불가

---

## 3. 폴더 구조 정리 (중요!)

### 문제 상황
- 기존 구조: `Backend_API/api/`와 `Frontend/` 분리
- Vercel 요구: `api/` 폴더가 Root Directory 안에 있어야 함

### 해결 방법
```bash
# Backend_API/api를 Frontend/api로 복사
cp -r Production/Backend_API/api Production/Frontend/

# 불필요한 폴더 삭제
rm -rf Production/Backend_API
rm -rf Production/Backend_APIs
```

### 정리 후 구조
```
Production/
├── Database/      ← DB 스키마/SQL
└── Frontend/      ← Vercel 배포용
    ├── api/       ← Serverless Functions
    ├── assets/
    ├── pages/
    ├── index.html
    └── vercel.json
```

---

## 4. vercel.json 설정

### 파일 위치
`Production/Frontend/vercel.json`

### 내용
```json
{
  "version": 2,
  "name": "ssalworks-v1",
  "buildCommand": null,
  "outputDirectory": ".",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" }
      ]
    }
  ],
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 주의사항
- 존재하지 않는 함수 패턴 제거 필요
- `api/ai/*.js`, `api/payment/*.js` 등 실제로 없는 패턴은 에러 발생

---

## 5. package.json 설정

### 파일 위치
`Production/Frontend/package.json`

### 주의사항
- `build` 스크립트에 `vercel build` 사용 금지 (순환 호출)
- 정적 사이트이므로 빌드 명령 불필요

### 올바른 설정
```json
{
  "scripts": {
    "dev": "npx serve . -l 8888",
    "test": "jest"
  }
}
```

---

## 6. 환경변수 설정

### Vercel Dashboard 위치
```
Settings → Environment Variables
```

### 필수 환경변수
| Key | Value | 설명 |
|-----|-------|------|
| `RESEND_API_KEY` | `re_xxx...` | Resend 이메일 API |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 프로젝트 URL |
| `SUPABASE_ANON_KEY` | `eyJxxx...` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJxxx...` | Supabase service role key |

### 선택 환경변수
| Key | Value | 설명 |
|-----|-------|------|
| `NEXT_PUBLIC_SITE_URL` | 배포 후 도메인 | 사이트 URL |
| `INTERNAL_API_SECRET` | 임의 문자열 | 내부 API 보안 |

---

## 7. 도메인 연결 (Whois DNS)

### 7.1 Vercel에서 도메인 추가
```
Settings → Domains → Add Domain
→ ssalworks.ai.kr 입력
```

### 7.2 소유권 확인 (TXT 레코드)
도메인이 다른 계정에 연결된 경우:
```
Vercel이 알려주는 값:
_vercel → vc-domain-verify=ssalworks.ai.kr,xxxxxxxxx
```

### 7.3 Whois DNS 설정

**경로**: Whois → 도메인 관리 → 부가서비스 → 네임서버 고급설정

#### TXT 레코드 (소유권 확인)
```
경로: SPF(TXT) 레코드 관리
호스트명: _vercel
값: vc-domain-verify=ssalworks.ai.kr,9fe000238421d24d9a02
```

#### A 레코드 (도메인 연결)
```
경로: A 레코드 관리
호스트명: (비워두기) ← @ 대신 비워둠
IP: 76.76.21.21
```

### 7.4 DNS 전파 대기
- **소요 시간**: 5분 ~ 48시간
- **확인 방법**: https://dnschecker.org/

---

## 8. 트러블슈팅

### 문제 1: Project Name 에러
```
The name contains invalid characters.
```
**해결**: 소문자, 숫자, 하이픈만 사용 (예: `ssal-works`)

### 문제 2: 함수 패턴 에러
```
Error: The pattern "api/ai/*.js" doesn't match any Serverless Functions
```
**해결**: vercel.json에서 존재하지 않는 패턴 제거

### 문제 3: Build 에러
```
sh: line 1: vercel: command not found
```
**해결**: package.json에서 `"build": "vercel build"` 제거

### 문제 4: 도메인 소유권 확인
```
This domain is linked to another Vercel account.
```
**해결**: TXT 레코드 추가 후 DNS 전파 대기

---

## 9. PoliticianFinder 프로젝트와 비교

| 항목 | PoliticianFinder | SSALWorks |
|------|------------------|-----------|
| **도메인** | politicianfinder.ai.kr | ssalworks.ai.kr |
| **Vercel 프로젝트** | politician-finder | ssal-works |
| **네임서버** | Whois 기본값 | Whois 기본값 |
| **도메인 방식** | www 서브도메인 | 루트 도메인 |
| **문제점** | Vercel DNS 권한 오류 | 동일 |
| **해결** | Whois DNS 고급설정 | 동일 |

### 공통 교훈
1. **.ai.kr 도메인은 Vercel/Cloudflare DNS 미지원**
2. **Whois DNS 고급설정 사용 필수**
3. **DNS 전파에 시간 필요 (최대 48시간)**
4. **TXT 레코드로 소유권 확인 필요**

---

## 10. 체크리스트

### 배포 전
- [ ] Production/Frontend/api 폴더 존재 확인
- [ ] vercel.json 패턴 확인 (존재하는 파일만)
- [ ] package.json build 스크립트 제거
- [ ] GitHub에 push 완료

### Vercel 설정
- [ ] 프로젝트 생성 (Root Directory: Production/Frontend)
- [ ] 환경변수 4개 설정
- [ ] 배포 성공 확인

### 도메인 연결
- [ ] TXT 레코드 추가 (_vercel)
- [ ] A 레코드 추가 (76.76.21.21)
- [ ] DNS 전파 확인
- [ ] Vercel 도메인 인증 완료
- [ ] SSL 인증서 생성 확인

---

## 11. 관련 파일

| 파일 | 용도 |
|------|------|
| `Production/Frontend/vercel.json` | Vercel 설정 |
| `Production/Frontend/package.json` | 프로젝트 설정 |
| `Production/Frontend/api/` | Serverless Functions |
| `S2_개발-1차/Backend_Infra/RESEND_SETUP.md` | Resend 설정 가이드 |

---

## 12. 참고 자료

### Vercel 공식 문서
- [Adding a Domain](https://vercel.com/docs/projects/domains/add-a-domain)
- [Serverless Functions](https://vercel.com/docs/functions)

### PoliticianFinder 설정 문서
- `0-5_Development_ProjectGrid/REPORTS/P3BA30_Whois_Vercel_Domain_Setup_Report.md`

---

**문서 버전**: 1.0
**마지막 수정**: 2025-12-16
