# SSALWorks v1.0 DNS Setup Guide

## Overview

SSALWorks v1.0 프로덕션 배포를 위한 DNS 설정 가이드입니다.

---

## 1. 도메인 정보

- **도메인**: ssalworks.com (P2 단계에서 구매 완료)
- **등록기관**: 확인 필요
- **DNS 제공자**: Vercel DNS (권장) 또는 기존 DNS 제공자

---

## 2. Vercel 연결 설정

### 2.1 커스텀 도메인 추가

```
Vercel Dashboard → Project → Settings → Domains
→ Add Domain: ssalworks.com
→ Add Domain: www.ssalworks.com
```

### 2.2 필요한 DNS 레코드

**Option A: Vercel DNS 사용 (권장)**

Vercel에 네임서버를 위임하면 자동으로 설정됩니다.

```
네임서버 변경:
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B: 기존 DNS 제공자 사용**

```
# A 레코드 (루트 도메인)
Type: A
Host: @
Value: 76.76.21.21

# CNAME 레코드 (www 서브도메인)
Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

---

## 3. SSL/TLS 인증서

### 3.1 자동 발급

Vercel은 Let's Encrypt를 통해 SSL 인증서를 **자동으로 발급**합니다.

- 도메인 연결 후 몇 분 내에 HTTPS 활성화
- 자동 갱신 (수동 관리 불필요)

### 3.2 확인 방법

```
Vercel Dashboard → Project → Settings → Domains
→ 각 도메인 옆에 ✓ 표시 확인
→ "Valid Configuration" 메시지 확인
```

---

## 4. 서브도메인 설정

### 4.1 Production

| 도메인 | 용도 | 설정 |
|--------|------|------|
| ssalworks.com | 메인 프로덕션 | A Record → 76.76.21.21 |
| www.ssalworks.com | www 리다이렉트 | CNAME → cname.vercel-dns.com |

### 4.2 Preview (선택사항)

| 도메인 | 용도 | 설정 |
|--------|------|------|
| staging.ssalworks.com | 스테이징 환경 | CNAME → cname.vercel-dns.com |
| dev.ssalworks.com | 개발 환경 | CNAME → cname.vercel-dns.com |

---

## 5. 이메일 DNS 설정 (Resend)

### 5.1 SPF 레코드

```
Type: TXT
Host: @
Value: v=spf1 include:amazonses.com ~all
```

### 5.2 DKIM 레코드

Resend Dashboard에서 제공하는 DKIM 키를 추가합니다.

```
Type: CNAME
Host: [resend-provided-selector]._domainkey
Value: [resend-provided-value]
```

### 5.3 DMARC 레코드 (권장)

```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@ssalworks.com
```

---

## 6. 확인 체크리스트

### 6.1 DNS 전파 확인

```bash
# A 레코드 확인
nslookup ssalworks.com

# CNAME 확인
nslookup www.ssalworks.com

# 또는 온라인 도구 사용
# https://www.whatsmydns.net/
```

### 6.2 SSL 확인

```bash
# HTTPS 연결 확인
curl -I https://ssalworks.com

# 인증서 정보 확인
openssl s_client -connect ssalworks.com:443 -servername ssalworks.com
```

---

## 7. 문제 해결

### 7.1 "Invalid Configuration" 오류

**원인**: DNS 레코드가 아직 전파되지 않음

**해결**:
1. DNS 전파는 최대 48시간 소요 가능 (보통 5-30분)
2. Vercel Dashboard에서 "Refresh" 클릭
3. DNS 레코드 값이 정확한지 재확인

### 7.2 SSL 인증서 발급 실패

**원인**: DNS 레코드 미설정 또는 CAA 레코드 문제

**해결**:
1. CAA 레코드가 Let's Encrypt를 차단하지 않는지 확인
2. 없으면 추가: `0 issue "letsencrypt.org"`

### 7.3 www 리다이렉트 안됨

**해결**: Vercel Dashboard에서 리다이렉트 설정

```
Settings → Domains → www.ssalworks.com
→ "Redirect to ssalworks.com" 선택
```

---

## 8. 관련 Task

| Task ID | 설명 | 의존성 |
|---------|------|--------|
| S1O1 | DNS 레코드 설정, Vercel 연결 준비 | - |
| S5O2 | 도메인 연결 완료 | S5O1, S1O1 |
| S5O3 | SSL 인증서 확인 | S5O2 |

---

**Last Updated**: 2025-12-13
**Version**: 1.0
