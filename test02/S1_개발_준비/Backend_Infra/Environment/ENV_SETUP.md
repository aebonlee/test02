# SSALWorks v1.0 Environment Variables Setup Guide

## Overview

SSALWorks v1.0 환경변수 설정 가이드입니다.

---

## 1. 환경변수 파일 구조

### 1.1 파일 위치

```
P3_프로토타입_제작/Frontend/Prototype/
├── .env.example      # 템플릿 (Git에 포함)
├── .env.local        # 로컬 개발용 (Git 제외)
└── .env.production   # 프로덕션용 (Git 제외)
```

### 1.2 .gitignore 설정

```
# 환경변수 파일
.env
.env.local
.env.production
.env*.local
```

---

## 2. 필수 환경변수

### 2.1 Supabase

```env
# Supabase 연결
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

**값 확인 방법:**
1. Supabase Dashboard → Project Settings → API
2. URL, anon key, service_role key 복사

### 2.2 Google OAuth

```env
# Google OAuth
GOOGLE_CLIENT_ID=[client-id].apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[client-secret]
```

**값 확인 방법:**
1. Google Cloud Console → APIs & Services → Credentials
2. OAuth 2.0 Client ID 생성 또는 확인
3. Authorized redirect URIs 설정 필요

### 2.3 결제 (토스페이먼츠)

```env
# TossPayments
TOSS_CLIENT_KEY=test_ck_[key]
TOSS_SECRET_KEY=test_sk_[key]
```

**값 확인 방법:**
1. 토스페이먼츠 개발자센터 → 내 개발 정보
2. 테스트 키 또는 라이브 키 복사

### 2.4 이메일 (Resend)

```env
# Resend Email
RESEND_API_KEY=re_[key]
```

**값 확인 방법:**
1. Resend Dashboard → API Keys
2. API Key 생성 및 복사

### 2.5 AI APIs

```env
# AI APIs (선택적 - 사용하는 서비스만)
OPENAI_API_KEY=sk-[key]
GOOGLE_AI_API_KEY=[key]
PERPLEXITY_API_KEY=pplx-[key]
```

### 2.6 앱 설정

```env
# App Configuration
APP_URL=http://localhost:3000
NODE_ENV=development
CRON_SECRET=[random-secret]
```

---

## 3. Vercel 환경변수 설정

### 3.1 설정 방법

```
Vercel Dashboard → Project → Settings → Environment Variables
```

### 3.2 환경별 구분

| 환경 | 용도 | 설정 위치 |
|------|------|----------|
| Development | 로컬 개발 | `.env.local` 파일 |
| Preview | PR/브랜치 미리보기 | Vercel Dashboard |
| Production | 프로덕션 배포 | Vercel Dashboard |

### 3.3 Vercel에서 환경별 다른 값 설정

```
Variable Name: SUPABASE_URL
├── Production: https://prod-project.supabase.co
├── Preview: https://staging-project.supabase.co
└── Development: (로컬 .env.local 사용)
```

---

## 4. 환경변수 체크리스트

### 4.1 필수 항목

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `TOSS_CLIENT_KEY`
- [ ] `TOSS_SECRET_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `APP_URL`
- [ ] `CRON_SECRET`

### 4.2 선택 항목 (AI 기능 사용 시)

- [ ] `OPENAI_API_KEY`
- [ ] `GOOGLE_AI_API_KEY`
- [ ] `PERPLEXITY_API_KEY`

---

## 5. 보안 주의사항

### 5.1 절대 하지 말 것

- ❌ 환경변수 파일을 Git에 커밋
- ❌ API 키를 코드에 하드코딩
- ❌ 클라이언트 사이드에서 SERVICE_ROLE_KEY 사용
- ❌ 환경변수 값을 공개 저장소에 노출

### 5.2 권장 사항

- ✅ `.env.example`만 Git에 포함 (값 없이 키 이름만)
- ✅ Vercel Dashboard에서 프로덕션 키 관리
- ✅ 정기적으로 API 키 로테이션
- ✅ 환경별로 다른 키 사용 (개발/스테이징/프로덕션)

---

## 6. 클라이언트 vs 서버 환경변수

### 6.1 클라이언트 사이드 (브라우저에서 접근 가능)

Vercel에서 클라이언트 사이드 변수는 `NEXT_PUBLIC_` 접두사 필요.
하지만 SSALWorks는 Vanilla JS이므로 다른 방식 사용:

```javascript
// 클라이언트에서 안전하게 사용 가능
const SUPABASE_URL = 'https://[project].supabase.co';
const SUPABASE_ANON_KEY = '[anon-key]';
```

### 6.2 서버 사이드 (Serverless Functions에서만)

```javascript
// Serverless Function에서만 사용
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
```

---

## 7. 관련 Task

| Task ID | 설명 | 의존성 |
|---------|------|--------|
| S1BI1 | 환경변수 설정 | S1F1 |
| S1F1 | Vercel 프로젝트 설정 | - |

---

## 8. 참고 문서

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs#environment-variables)
- [TossPayments API Keys](https://docs.tosspayments.com/guides/get-started)

---

**Last Updated**: 2025-12-13
**Version**: 1.0
