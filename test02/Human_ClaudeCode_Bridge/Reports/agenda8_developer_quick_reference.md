# My Page 통합 - 개발자 빠른 참조 가이드

**Agenda #8**: My Page Integration - Sample Data Testing
**작성일**: 2025-12-12

---

## 🚀 빠른 시작

### Supabase 접속 정보
```javascript
const SUPABASE_URL = "https://zwjmfewyshhwpgwdtrus.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE1NTEsImV4cCI6MjA3OTE0NzU1MX0.AJy34h5VR8QS6WFEcUcBeJJu8I3bBQ6UCk1I84Wb7y4"
```

### 테스트 사용자 계정
```javascript
// 관리자 계정
ADMIN001 - admin@ssalworks.com - 크레딧: 109,260원

// 일반 사용자 (활성)
TEST0001 - test001@example.com - 크레딧: 64,540원
TEST0002 - test002@example.com - 크레딧: 34,750원
A1B2C3D4 - user1@example.com - 크레딧: 14,620원
SUN12345 - sunny@example.com - 크레딧: 34,590원
MOON6789 - moonlight@example.com - 크레딧: 19,670원
```

---

## 📊 테이블별 데이터 조회

### 1. 사용자 프로필 (users)
```javascript
// Supabase 클라이언트
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('user_id', 'TEST0001')
  .single()

// 응답 예시
{
  "user_id": "TEST0001",
  "email": "test001@example.com",
  "name": "테스트사용자1",
  "nickname": "테스트1",
  "real_name": "김테스트",
  "subscription_status": "active",
  "credit_balance": 64540,
  "role": "user"
}
```

### 2. 결제 수단 (payment_methods)
```javascript
// 사용자의 결제 수단 목록
const { data, error } = await supabase
  .from('payment_methods')
  .select('*')
  .eq('user_id', 'TEST0001')
  .order('is_default', { ascending: false })

// 응답 예시 (2건)
[
  {
    "payment_type": "card",
    "card_last4": "1234",
    "card_company": "신한카드",
    "is_default": true,
    "toss_billing_key": "test_billing_key_001"
  },
  {
    "payment_type": "bank",
    "bank_name": "하나은행",
    "account_last4": "5678",
    "is_default": false
  }
]
```

### 3. 결제 내역 (billing_history)
```javascript
// 최근 결제 내역 (페이지네이션)
const { data, error } = await supabase
  .from('billing_history')
  .select('*')
  .eq('user_id', 'TEST0001')
  .order('billing_date', { ascending: false })
  .range(0, 9) // 10개씩

// 응답 예시
[
  {
    "billing_type": "platform_fee",
    "amount": 50000,
    "status": "paid",
    "billing_date": "2025-11-11",
    "payment_method": "신한카드 ****-1234",
    "receipt_url": "https://receipt.example.com/sample003"
  }
]

// 상태별 필터링
.eq('status', 'paid')
.eq('billing_type', 'platform_fee')
```

### 4. 프로젝트 목록 (projects)
```javascript
// 사용자의 프로젝트
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', 'ADMIN001')
  .order('updated_at', { ascending: false })

// 응답 예시
[
  {
    "project_id": "ADMIN001-P001",
    "project_name": "SSAL Works 관리 대시보드",
    "status": "in_progress",
    "progress": 75,
    "current_stage": 4,
    "total_stages": 5
  }
]

// 상태별 필터링
.eq('status', 'in_progress')
.eq('status', 'completed')
```

### 5. 크레딧 거래 내역 (credit_transactions)
```javascript
// 크레딧 거래 내역
const { data, error } = await supabase
  .from('credit_transactions')
  .select('*')
  .eq('user_id', 'TEST0001')
  .order('created_at', { ascending: false })
  .range(0, 9)

// 응답 예시
[
  {
    "type": "charge",
    "amount": 50000,
    "balance_after": 50000,
    "description": "첫 충전 - 카드 결제",
    "related_service": null,
    "created_at": "2025-11-11"
  },
  {
    "type": "spend",
    "amount": -100,
    "balance_after": 49900,
    "description": "ChatGPT 사용",
    "related_service": "ChatGPT",
    "created_at": "2025-11-16"
  }
]

// 타입별 필터링
.eq('type', 'charge')   // 충전
.eq('type', 'spend')    // 사용
.eq('type', 'bonus')    // 보너스
.eq('type', 'refund')   // 환불
```

### 6. AI 사용 로그 (ai_usage_log)
```javascript
// AI 서비스 사용 내역
const { data, error } = await supabase
  .from('ai_usage_log')
  .select('*')
  .eq('user_id', 'TEST0001')
  .order('created_at', { ascending: false })
  .range(0, 9)

// 응답 예시
[
  {
    "service_name": "ChatGPT",
    "prompt": "React 컴포넌트 작성 방법 알려줘",
    "response": "React 컴포넌트는...",
    "tokens_used": 500,
    "cost": 100,
    "response_time_ms": 2500,
    "created_at": "2025-11-16"
  }
]

// 서비스별 필터링
.eq('service_name', 'ChatGPT')
.eq('service_name', 'Gemini')
.eq('service_name', 'Perplexity')
```

### 7. AI 서비스 가격 (ai_service_pricing)
```javascript
// AI 서비스 가격 정보
const { data, error } = await supabase
  .from('ai_service_pricing')
  .select('*')
  .eq('is_active', true)

// 응답 예시
[
  {
    "service_name": "ChatGPT",
    "price_per_use": 100,
    "api_cost": 80,
    "margin_percent": 25,
    "description": "GPT-4 기반 - 코드 작성, 기술 문서"
  },
  {
    "service_name": "Gemini",
    "price_per_use": 80,
    "api_cost": 65,
    "margin_percent": 23
  },
  {
    "service_name": "Perplexity",
    "price_per_use": 50,
    "api_cost": 40,
    "margin_percent": 25
  }
]
```

---

## 📈 통계 쿼리 예시

### 총 지출 금액 (최근 30일)
```javascript
const { data, error } = await supabase
  .from('billing_history')
  .select('amount')
  .eq('user_id', 'TEST0001')
  .eq('status', 'paid')
  .gte('billing_date', new Date(Date.now() - 30*24*60*60*1000).toISOString())

// 합계 계산
const total = data.reduce((sum, item) => sum + item.amount, 0)
```

### AI 서비스별 사용 횟수
```javascript
const { data, error } = await supabase
  .from('ai_usage_log')
  .select('service_name')
  .eq('user_id', 'TEST0001')

// 그룹화
const counts = data.reduce((acc, item) => {
  acc[item.service_name] = (acc[item.service_name] || 0) + 1
  return acc
}, {})

// 결과: { ChatGPT: 2, Gemini: 2, Perplexity: 2 }
```

### 크레딧 잔액 변화 (최근 10건)
```javascript
const { data, error } = await supabase
  .from('credit_transactions')
  .select('balance_after, created_at')
  .eq('user_id', 'TEST0001')
  .order('created_at', { ascending: false })
  .limit(10)

// 차트 데이터로 변환
const chartData = data.map(item => ({
  date: item.created_at,
  balance: item.balance_after
}))
```

### 프로젝트 진행률 평균
```javascript
const { data, error } = await supabase
  .from('projects')
  .select('progress')
  .eq('user_id', 'ADMIN001')
  .eq('status', 'in_progress')

const avgProgress = data.reduce((sum, item) => sum + item.progress, 0) / data.length
```

---

## 🎨 UI 컴포넌트 예시

### 크레딧 잔액 표시
```typescript
interface CreditBalance {
  current: number
  lastUpdated: string
}

// Component
<div className="credit-balance">
  <h3>크레딧 잔액</h3>
  <p className="amount">{user.credit_balance.toLocaleString()}원</p>
  <button>충전하기</button>
</div>
```

### 결제 수단 카드
```typescript
interface PaymentMethod {
  payment_type: 'card' | 'bank'
  card_last4?: string
  card_company?: string
  account_last4?: string
  bank_name?: string
  is_default: boolean
}

// Component
<div className={`payment-card ${method.is_default ? 'default' : ''}`}>
  {method.payment_type === 'card' ? (
    <>
      <span>{method.card_company}</span>
      <span>****-{method.card_last4}</span>
    </>
  ) : (
    <>
      <span>{method.bank_name}</span>
      <span>****-{method.account_last4}</span>
    </>
  )}
  {method.is_default && <badge>기본</badge>}
</div>
```

### 프로젝트 진행률 바
```typescript
interface Project {
  project_name: string
  progress: number
  status: string
  current_stage: number
  total_stages: number
}

// Component
<div className="project-card">
  <h4>{project.project_name}</h4>
  <div className="progress-bar">
    <div style={{ width: `${project.progress}%` }} />
  </div>
  <p>{project.current_stage} / {project.total_stages} 단계</p>
  <span className={`status-${project.status}`}>{project.status}</span>
</div>
```

---

## 🔍 디버깅 팁

### curl로 API 테스트
```bash
# 사용자 정보
curl "https://zwjmfewyshhwpgwdtrus.supabase.co/rest/v1/users?user_id=eq.TEST0001&select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# 결제 내역
curl "https://zwjmfewyshhwpgwdtrus.supabase.co/rest/v1/billing_history?user_id=eq.TEST0001&select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 브라우저 Console에서 테스트
```javascript
// Supabase 클라이언트 초기화
const { createClient } = supabase
const supabaseClient = createClient(
  'https://zwjmfewyshhwpgwdtrus.supabase.co',
  'YOUR_ANON_KEY'
)

// 데이터 조회
const test = async () => {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('user_id', 'TEST0001')
  console.log(data, error)
}
test()
```

---

## ⚠️ 주의사항

### RLS (Row Level Security) 정책
- 현재 개발 환경용 RLS 정책 적용 중
- `anon` 역할도 INSERT/UPDATE/DELETE 가능 (개발용)
- **프로덕션 배포 전 반드시 원래 RLS 정책으로 변경 필요!**

### 프로덕션 배포 전 체크리스트
- [ ] RLS 정책 원래대로 변경
- [ ] authenticated 사용자만 수정 가능하도록
- [ ] API 키 환경 변수 설정
- [ ] 민감 정보 마스킹 확인

---

## 📚 추가 리소스

### 관련 파일
- SQL 스크립트: `P3_프로토타입_제작/Database/27_mypage_integration_sample_data.sql`
- 테스트 보고서: `Web_ClaudeCode_Bridge/outbox/agenda8_mypage_sample_data_test_report.json`
- 상세 문서: `Web_ClaudeCode_Bridge/outbox/agenda8_mypage_sample_data_visual_summary.md`

### Supabase 문서
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

---

**마지막 업데이트**: 2025-12-12
**작성자**: Claude Code
**버전**: 1.0
