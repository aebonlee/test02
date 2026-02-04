# OWASP Top 10 웹 보안 취약점 가이드

> OWASP(Open Web Application Security Project)에서 발표하는 가장 위험한 웹 보안 취약점 10가지입니다.
> 웹 애플리케이션 개발 시 반드시 점검해야 할 항목들입니다.

---

## OWASP Top 10 (2021 버전) 요약

| # | 취약점 | 한글명 | 위험도 |
|---|--------|--------|:------:|
| A01 | Broken Access Control | 접근 제어 실패 | 심각 |
| A02 | Cryptographic Failures | 암호화 실패 | 심각 |
| A03 | Injection | 인젝션 공격 | 심각 |
| A04 | Insecure Design | 불안전한 설계 | 높음 |
| A05 | Security Misconfiguration | 보안 설정 오류 | 높음 |
| A06 | Vulnerable Components | 취약한 컴포넌트 | 높음 |
| A07 | Auth Failures | 인증 실패 | 심각 |
| A08 | Data Integrity Failures | 데이터 무결성 실패 | 중간 |
| A09 | Security Logging Failures | 보안 로깅 실패 | 중간 |
| A10 | SSRF | 서버 측 요청 위조 | 높음 |

---

## A01: Broken Access Control (접근 제어 실패)

### 무엇인가?

권한 없는 사용자가 다른 사용자의 데이터에 접근하거나 관리자 기능을 사용할 수 있는 취약점

### 실제 공격 예시

```
공격자가 자신의 role을 'user' → 'admin'으로 변경
공격자가 다른 사용자의 credit_balance를 조회/수정
URL 파라미터 변경으로 다른 사용자 데이터 접근 (?user_id=123)
```

### Supabase에서의 대응

```sql
-- 좋은 예: 본인 데이터만 접근 + 민감 필드 보호
CREATE POLICY "users_update_own_safe" ON users
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM users WHERE id = auth.uid())
    AND credit_balance = (SELECT credit_balance FROM users WHERE id = auth.uid())
);
```

### 체크리스트

- [ ] 모든 테이블에 RLS 정책 적용
- [ ] 민감 필드(role, 잔액 등) 사용자 수정 차단
- [ ] URL/API 파라미터로 권한 우회 불가능한지 확인

---

## A02: Cryptographic Failures (암호화 실패)

### 무엇인가?

민감한 데이터가 암호화 없이 저장/전송되거나, 약한 암호화가 사용되는 취약점

### 위험한 코드 예시

```javascript
// 나쁜 예: 비밀번호 평문 저장
await db.insert({ password: userInput });

// 좋은 예: 해시 저장
const hashedPassword = await bcrypt.hash(userInput, 12);
await db.insert({ password: hashedPassword });
```

### Supabase 사용 시 주의점

- `ANON_KEY`는 클라이언트에 노출됨 (정상) → RLS로 보호
- `SERVICE_ROLE_KEY`는 절대 클라이언트에 노출 금지

### 체크리스트

- [ ] HTTPS 사용 (Vercel 기본 제공)
- [ ] 비밀번호는 bcrypt 등으로 해시
- [ ] SERVICE_ROLE_KEY 서버 측에서만 사용
- [ ] 민감 데이터 암호화 저장

---

## A03: Injection (인젝션 공격)

### 무엇인가?

악성 코드/쿼리가 애플리케이션에 주입되어 실행되는 취약점 (SQL Injection, XSS 등)

### SQL Injection 예시

```javascript
// 나쁜 예: 문자열 결합
const query = `SELECT * FROM users WHERE email = '${userInput}'`;

// 좋은 예: Supabase 쿼리 빌더 사용 (자동 파라미터화)
const { data } = await supabase.from('users').select('*').eq('email', userInput);
```

### XSS 예시

```javascript
// 나쁜 예: 사용자 입력 직접 삽입
element.innerHTML = userInput;

// 좋은 예: DOMPurify로 살균
element.innerHTML = DOMPurify.sanitize(userInput);
```

### 체크리스트

- [ ] Supabase 쿼리 빌더 사용 (직접 SQL 작성 금지)
- [ ] innerHTML 사용 시 DOMPurify 적용
- [ ] 사용자 입력을 명령어로 실행하지 않음

---

## A04: Insecure Design (불안전한 설계)

### 무엇인가?

설계 단계부터 보안을 고려하지 않아 발생하는 취약점

### 주요 대응 항목

| 기능 | 보안 설계 |
|------|----------|
| API 호출 | Rate Limiting 적용 |
| 비밀번호 | 복잡도 요구사항 설정 |
| 크레딧/결제 | 잔액 확인 후 처리 |
| 회원가입 | 이메일 인증 필수 |

### Rate Limiting 예시

```javascript
// 용도별 차등 제한
const limits = {
    aiQA: { windowMs: 60000, max: 30 },     // AI Q&A: 분당 30회
    auth: { windowMs: 60000, max: 10 },      // 인증: 분당 10회
    login: { windowMs: 60000, max: 5 }       // 로그인: 분당 5회
};
```

### 체크리스트

- [ ] Rate Limiting 구현
- [ ] 비밀번호 복잡도 검증
- [ ] 금융 로직에 이중 검증 적용

---

## A05: Security Misconfiguration (보안 설정 오류)

### 무엇인가?

보안 설정이 잘못되어 발생하는 취약점 (기본값 사용, 불필요한 기능 활성화 등)

### 흔한 실수들

```javascript
// 나쁜 예: 모든 도메인 CORS 허용
res.setHeader('Access-Control-Allow-Origin', '*');

// 좋은 예: 특정 도메인만 허용
const allowedOrigins = ['https://ssalworks.com', 'https://ssalworks.ai.kr'];
res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : '');
```

```javascript
// 나쁜 예: 프로덕션에서 에러 상세 노출
res.json({ error: error.message, stack: error.stack });

// 좋은 예: 환경별 분기
res.json({
    error: '서버 오류가 발생했습니다',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
});
```

### 체크리스트

- [ ] 개발용 설정이 프로덕션에 적용되지 않음
- [ ] CORS 도메인 제한
- [ ] 에러 메시지에 민감 정보 미포함
- [ ] 불필요한 console.log 제거

---

## A06: Vulnerable Components (취약한 컴포넌트)

### 무엇인가?

알려진 취약점이 있는 라이브러리/프레임워크를 사용하는 경우

### 점검 방법

```bash
# npm 패키지 취약점 점검
npm audit

# 자동 수정
npm audit fix

# 강제 수정 (주의: 호환성 문제 가능)
npm audit fix --force
```

### 취약점 발견 시 대응

1. `npm audit` 실행하여 취약점 확인
2. `npm audit fix`로 자동 수정 시도
3. 메이저 버전 업데이트가 필요하면 테스트 후 적용

### 체크리스트

- [ ] 정기적 npm audit 실행 (월 1회 권장)
- [ ] Dependabot/Renovate 자동화 설정
- [ ] 사용하지 않는 패키지 제거

---

## A07: Authentication Failures (인증 실패)

### 무엇인가?

인증 메커니즘이 약하거나 우회 가능한 취약점

### 강력한 인증 구현

| 기능 | 권장 사항 |
|------|----------|
| 비밀번호 | 8자 이상, 영문+숫자+특수문자 |
| 세션 | JWT + 만료 시간 설정 |
| MFA | TOTP 2단계 인증 지원 |
| OAuth | 신뢰할 수 있는 Provider 사용 |

### Supabase Auth 활용

```javascript
// 토큰 검증
const { data: { user }, error } = await supabase.auth.getUser(token);

if (error) {
    if (error.message.includes('expired')) {
        return { error: 'TOKEN_EXPIRED' };
    }
    return { error: 'INVALID_TOKEN' };
}
```

### 체크리스트

- [ ] 강력한 비밀번호 정책 적용
- [ ] JWT 토큰 만료 시간 설정
- [ ] MFA 옵션 제공
- [ ] 로그인 실패 횟수 제한

---

## A08: Data Integrity Failures (데이터 무결성 실패)

### 무엇인가?

데이터의 무결성을 검증하지 않아 조작된 데이터가 처리되는 취약점

### 웹훅 서명 검증 예시

```javascript
// Toss Payments 웹훅 서명 검증
function verifyWebhookSignature(body, signature) {
    const hash = crypto
        .createHmac('sha256', process.env.TOSS_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('base64');
    return hash === signature;
}

// 사용
if (!verifyWebhookSignature(req.body, req.headers['x-toss-signature'])) {
    return res.status(401).json({ error: 'Invalid signature' });
}
```

### 체크리스트

- [ ] 외부 웹훅 서명 검증
- [ ] Cron 작업 Secret 헤더 검증
- [ ] eval(), Function() 사용 금지

---

## A09: Security Logging Failures (보안 로깅 실패)

### 무엇인가?

보안 이벤트가 기록되지 않아 공격 탐지가 어려운 취약점

### 로깅해야 할 이벤트

| 이벤트 | 기록 항목 |
|--------|----------|
| 로그인 실패 | IP, 이메일, 시간, 실패 사유 |
| 권한 변경 | 대상 사용자, 변경 내용, 변경자 |
| 결제 | 금액, 사용자, 트랜잭션 ID |
| Rate Limit 초과 | IP, 엔드포인트, 시간 |

### 감사 로그 예시

```javascript
async function logSecurityEvent(event, details) {
    await supabase.from('security_logs').insert({
        event_type: event,
        user_id: details.userId,
        ip_address: details.ip,
        details: JSON.stringify(details),
        created_at: new Date().toISOString()
    });
}

// 사용
await logSecurityEvent('LOGIN_FAILED', {
    userId: null,
    email: attemptedEmail,
    ip: req.ip,
    reason: 'Invalid password'
});
```

### 체크리스트

- [ ] 인증 실패 로그 기록
- [ ] 관리자 작업 감사 로그
- [ ] 결제/크레딧 변경 로그
- [ ] 비정상 패턴 알림 설정

---

## A10: SSRF (Server-Side Request Forgery)

### 무엇인가?

서버가 공격자가 지정한 URL로 요청을 보내도록 조작하는 취약점

### 위험한 코드 예시

```javascript
// 나쁜 예: 사용자 입력 URL로 직접 요청
const response = await fetch(userInputUrl);

// 좋은 예: 허용된 URL만 사용
const allowedUrls = {
    'perplexity': 'https://api.perplexity.ai/chat/completions',
    'toss': 'https://api.tosspayments.com/v1/payments'
};
const url = allowedUrls[userInput];
if (!url) throw new Error('Invalid API');
const response = await fetch(url);
```

### 체크리스트

- [ ] 외부 API URL 하드코딩
- [ ] 사용자 입력으로 URL 구성 금지
- [ ] 내부 네트워크 주소 차단

---

## 정기 점검 가이드

### 월간 점검

```bash
# 1. 패키지 취약점 점검
npm audit

# 2. 의존성 업데이트 확인
npm outdated
```

### 분기별 점검

- 전체 OWASP Top 10 재점검
- RLS 정책 검토
- 보안 로그 분석
- 접근 권한 검토

### 점검 결과 보고서 위치

```
Human_ClaudeCode_Bridge/Reports/owasp_top10_audit_{날짜}.json
```

---

## 관련 문서

- `Human_ClaudeCode_Bridge/Reports/owasp_top10_audit_2026-01-18.json` - 최신 점검 결과
- `부수적_고유기능/콘텐츠/실전_Tips/보안/프로덕션_RLS_정책_보안_체크리스트.md` - RLS 보안 가이드
- `Human_ClaudeCode_Bridge/Reports/security_incident_2026-01-18.json` - 보안 사고 리포트
