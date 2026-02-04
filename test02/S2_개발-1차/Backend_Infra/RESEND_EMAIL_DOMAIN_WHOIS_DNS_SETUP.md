# S2BI3: Resend 이메일 도메인 Whois DNS 설정 가이드

> **Task ID**: S2BI3
> **도메인**: ssalworks.ai.kr
> **이메일 서비스**: Resend
> **DNS 관리**: Whois
> **참고**: PoliticianFinder P3BA30_Whois_Vercel_Domain_Setup_Report.md

---

## 1. 사전 준비 사항

### 완료 확인
- [x] S2BI1: Resend 계정 생성 완료
- [x] S2BI1: Resend API Key 발급 완료
- [x] S2BI1: 테스트 이메일 발송 성공 (wksun999@hanmail.net)
- [x] 도메인: ssalworks.ai.kr 소유 (Whois 등록 완료)

### 현재 제한 사항
- 도메인 인증 전: `onboarding@resend.dev`로만 발송 가능
- 수신자 제한: Resend 계정 등록 이메일(wksun999@hanmail.net)로만 발송 가능
- 도메인 인증 후: `noreply@ssalworks.ai.kr`로 모든 수신자에게 발송 가능

---

## 2. Resend 도메인 추가

### Step 1: Resend Dashboard 접속
1. https://resend.com/domains 접속
2. 로그인

### Step 2: 도메인 추가
1. **Add Domain** 클릭
2. 도메인 입력: `ssalworks.ai.kr`
3. **Add** 클릭

### Step 3: DNS 레코드 확인
Resend가 요구하는 DNS 레코드를 확인합니다:

**실제 DNS 레코드 (ssalworks.ai.kr용):**

| Type | Name | Value | Priority |
|------|------|-------|----------|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9XMaPLYTanTJ4NXQ9axLHl1MO8no1AIHFe4IfHTHDD8NMWI2VIYFTOMIu+KuxERhT2yEMmrttlBikn50m97ZfPgoUsJ/8n5r/cNztkVeeC17J9BPKLUB8SMw82Wh8bziHtglxDMgitIwFRh/OD49PU56uXqexcXoC37882zG2DQIDAQAB` | - |
| MX | `send` | `feedback-smtp.ap-northeast-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | - |

**⚠️ 참고**:
- Resend는 Amazon SES를 사용하므로 SPF에 `amazonses.com`이 포함됨
- SPF와 MX는 `send` 서브도메인에 설정 (루트 도메인 아님!)

---

## 3. Whois DNS 설정

### ⚠️ 중요: 네임서버 고급설정 사용

**일반 DNS 관리 화면에서는 TXT/CNAME 레코드 설정이 제한됩니다!**
**반드시 "네임서버 고급설정"을 사용해야 합니다!**

### Step 1: Whois 로그인 및 고급설정 접근

```
Whois 로그인 (https://whois.co.kr)
  ↓
My Page → 도메인 관리
  ↓
ssalworks.ai.kr 선택
  ↓
부가서비스 → 네임서버 변경/부가서비스
  ↓
네임서버 고급설정
```

### Step 2: 네임서버 확인

**네임서버는 Whois 기본값을 유지합니다:**
```
ns1.whoisdomain.kr
ns2.whoisdomain.kr
ns3.whoisdomain.kr
ns4.whoisdomain.kr
```

**⚠️ Vercel DNS나 Cloudflare로 변경하지 마세요!**
- .ai.kr 도메인은 Cloudflare에서 지원 안 됨
- Vercel DNS는 권한 오류 발생 가능

---

## 4. DNS 레코드 추가 (Whois 고급설정)

### 4.1 DKIM 레코드 (TXT) 추가

**경로**: 네임서버 고급설정 → **SPF(TXT) 레코드 관리** → 관리페이지 열기

```
호스트명: resend._domainkey
TXT 값: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9XMaPLYTanTJ4NXQ9axLHl1MO8no1AIHFe4IfHTHDD8NMWI2VIYFTOMIu+KuxERhT2yEMmrttlBikn50m97ZfPgoUsJ/8n5r/cNztkVeeC17J9BPKLUB8SMw82Wh8bziHtglxDMgitIwFRh/OD49PU56uXqexcXoC37882zG2DQIDAQAB
```

**[등록] 버튼 클릭**

### 4.2 MX 레코드 추가

**경로**: 네임서버 고급설정 → **MX 레코드 관리** → 관리페이지 열기

```
호스트명: send
값: feedback-smtp.ap-northeast-1.amazonses.com
우선순위: 10
```

**[등록] 버튼 클릭**

### 4.3 SPF 레코드 (TXT) 추가

**경로**: 네임서버 고급설정 → **SPF(TXT) 레코드 관리** → 관리페이지 열기

```
호스트명: send
TXT 값: v=spf1 include:amazonses.com ~all
```

**⚠️ 주의**: 호스트명이 `send`입니다! (루트 @ 아님)

**[등록] 버튼 클릭**

---

## 5. 트러블슈팅 (Whois 제한사항)

### 문제 1: "특수문자를 입력할 수 없습니다"

**증상:**
- 호스트명에 `_` 입력 불가 (예: `resend._domainkey`)
- 일반 DNS 관리 화면에서 발생

**해결:**
- **네임서버 고급설정** 사용
- 고급설정에서는 특수문자 입력 가능

### 문제 2: TXT 레코드 입력란이 없음

**증상:**
- 일반 DNS 관리에서 A 레코드만 보임

**해결:**
- **네임서버 고급설정 → SPF(TXT) 레코드 관리** 사용

### 문제 3: 호스트명에 @ 입력 불가

**증상:**
- 루트 도메인(@) 설정 시 오류

**해결:**
- 호스트명을 비워두거나
- `ssalworks.ai.kr` 전체 입력 시도

---

## 6. DNS 전파 확인

### 전파 대기 시간
- **최소**: 6시간
- **최대**: 48시간

### 확인 방법

**Windows:**
```cmd
nslookup -type=TXT ssalworks.ai.kr
nslookup -type=TXT resend._domainkey.ssalworks.ai.kr
```

**Mac/Linux:**
```bash
dig TXT ssalworks.ai.kr
dig TXT resend._domainkey.ssalworks.ai.kr
```

**온라인 도구:**
- https://mxtoolbox.com/TXTLookup.aspx
- https://dnschecker.org/

### 예상 결과

**SPF 레코드:**
```
ssalworks.ai.kr    TXT    "v=spf1 include:_spf.resend.com ~all"
```

**DKIM 레코드:**
```
resend._domainkey.ssalworks.ai.kr    TXT    "p=MIGfMA0GCS..."
```

---

## 7. Resend 도메인 인증 완료 확인

### Step 1: Resend Dashboard 접속
1. https://resend.com/domains 접속
2. ssalworks.ai.kr 도메인 클릭

### Step 2: Verify 버튼 클릭 (중요!)
1. DNS 레코드 설정 후 **"Verify DNS Records"** 또는 **"Verify"** 버튼 클릭
2. Resend가 DNS 레코드를 조회하여 확인
3. 모든 레코드가 확인되면 **"Verified"** 상태로 변경됨

**⚠️ DNS 전파 후에도 Verify 버튼을 클릭해야 인증이 완료됩니다!**

### Step 3: 상태 확인

### 상태별 의미

| 상태 | 의미 | 조치 |
|------|------|------|
| **Pending** | DNS 레코드 미확인 | DNS 전파 대기 또는 레코드 확인 |
| **Verified** ✅ | 인증 완료 | 이메일 발송 가능! |
| **Failed** | 인증 실패 | DNS 레코드 재확인 |

---

## 8. 테스트 이메일 발송

### Step 1: 테스트 스크립트 실행

**테스트 파일**: `S2_개발-1차/Testing/test-resend.js`

```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@ssalworks.ai.kr',  // 커스텀 도메인!
  to: 'recipient@example.com',       // 테스트 수신자
  subject: 'SSALWorks 도메인 인증 테스트',
  html: '<p>도메인 인증 성공!</p>'
});
```

**실행 명령:**
```bash
cd S2_개발-1차/Testing
RESEND_API_KEY=re_xxx node test-resend.js
```

### Step 2: 이메일 상태 확인

**Resend API로 상태 조회:**
```javascript
const email = await resend.emails.get('이메일-ID');
console.log('Status:', email.data.last_event);
// 가능한 상태: sent, delivered, bounced, complained
```

### Step 3: 수신 확인

- 수신자 메일함에서 이메일 도착 확인
- 스팸함도 확인
- `last_event: "delivered"` 확인

### ⚠️ 알려진 이슈: 일부 메일 서버 차단

**새 도메인은 일부 메일 서버에서 차단될 수 있습니다:**

| 메일 서비스 | 상태 | 비고 |
|-------------|------|------|
| **Hanmail** | ❌ bounced | 새 도메인 차단 (도메인 평판 없음) |
| **Naver** | ✅ delivered | 정상 수신 |
| **Gmail** | ✅ (예상) | 대부분 정상 작동 |

**해결 방법:**
- 시간이 지나면 도메인 평판이 쌓여 개선됨
- DMARC 레코드 추가로 신뢰도 향상 가능
- Hanmail 사용자에게는 다른 이메일 사용 권장

---

## 9. 완료 체크리스트

### DNS 설정 (Whois 고급설정)
- [x] DKIM 레코드 추가 (resend._domainkey)
- [x] MX 레코드 추가 (send → feedback-smtp...)
- [x] SPF 레코드 추가 (send → v=spf1...)

### DNS 전파
- [x] DKIM 레코드 조회 성공
- [x] MX 레코드 조회 성공
- [x] SPF 레코드 조회 성공

### Resend 인증
- [x] Resend Dashboard에서 "Verified" 상태 확인

### 테스트
- [x] noreply@ssalworks.ai.kr로 이메일 발송 성공
- [x] 외부 수신자(Naver)에게 이메일 도착 확인
- [x] 이메일 상태 "delivered" 확인

---

## 10. 코드 업데이트 (인증 완료 후)

### resend.js 수정

**파일**: `S2_개발-1차/Backend_Infra/api/lib/email/resend.js`

```javascript
// 변경 전
async function sendEmail({ to, subject, html, from = 'onboarding@resend.dev' })

// 변경 후
async function sendEmail({ to, subject, html, from = 'noreply@ssalworks.ai.kr' })
```

또는 환경변수로 관리:

```javascript
const DEFAULT_FROM = process.env.EMAIL_FROM || 'noreply@ssalworks.ai.kr';

async function sendEmail({ to, subject, html, from = DEFAULT_FROM })
```

---

## 11. 참고 자료

### PoliticianFinder 도메인 설정 보고서
- 경로: `C:\Development_PoliticianFinder_com\Developement_Real_PoliticianFinder\0-5_Development_ProjectGrid\REPORTS\P3BA30_Whois_Vercel_Domain_Setup_Report.md`

### Resend 공식 문서
- 도메인 인증: https://resend.com/docs/dashboard/domains/introduction
- SPF/DKIM 설정: https://resend.com/docs/dashboard/domains/spf-dkim

### Whois DNS 설정
- 네임서버 고급설정 경로: 도메인 관리 → 부가서비스 → 네임서버 고급설정

---

**작성일**: 2025-12-15
**관련 Task**: S2BI3
