# S4BA2 - 입금 확인 API (관리자용) 명세서

## 생성된 파일 목록

### Stage 폴더
1. `C:/!SSAL_Works_Private/S4_개발-3차/Backend_APIs/api/admin/installation/pending.js`
2. `C:/!SSAL_Works_Private/S4_개발-3차/Backend_APIs/api/admin/installation/confirm.js`
3. `C:/!SSAL_Works_Private/S4_개발-3차/Backend_APIs/api/admin/installation/reject.js`
4. `C:/!SSAL_Works_Private/S4_개발-3차/Backend_APIs/api/admin/installation/history.js`

### Production 폴더
1. `C:/!SSAL_Works_Private/Production/api/Backend_APIs/api/admin/installation/pending.js`
2. `C:/!SSAL_Works_Private/Production/api/Backend_APIs/api/admin/installation/confirm.js`
3. `C:/!SSAL_Works_Private/Production/api/Backend_APIs/api/admin/installation/reject.js`
4. `C:/!SSAL_Works_Private/Production/api/Backend_APIs/api/admin/installation/history.js`

---

## API 명세

### 1. pending.js - 입금 대기 목록 조회

**엔드포인트:** `GET /api/admin/installation/pending`

**권한:** 관리자 (is_admin)

**기능:**
- 입금 대기 중인(status: 'pending') 설치비 목록 조회
- 정렬: 신청일시 오름차순 (오래된 것부터)

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "payments": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "projectName": "프로젝트명",
      "userId": "uuid",
      "userEmail": "user@example.com",
      "userName": "사용자명",
      "amount": 3000000,
      "depositorName": "홍길동",
      "bankName": "국민은행",
      "depositDate": "2025-12-20",
      "requestedAt": "2025-12-20T01:23:45Z"
    }
  ]
}
```

---

### 2. confirm.js - 입금 확인 처리

**엔드포인트:** `POST /api/admin/installation/confirm`

**권한:** 관리자 (is_admin)

**기능:**
1. 입금 상태 → 'confirmed'
2. 초기 크레딧 ₩50,000 지급
3. 구독 시작 (3개월 무료)
4. 사용자 상태 → 'active'
5. 프로젝트 installation_paid → true
6. 이메일 알림 발송

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentId": "uuid",
  "memo": "입금 확인 완료 (선택사항)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "입금이 확인되었습니다.",
  "payment": {
    "id": "uuid",
    "status": "confirmed",
    "projectId": "uuid",
    "projectName": "프로젝트명"
  },
  "benefits": {
    "initialCredit": 50000,
    "subscriptionMonths": 3,
    "subscriptionEndDate": "2025-03-20T01:23:45Z"
  }
}
```

**비즈니스 로직:**
```
설치비 입금 확인 (₩3,000,000)
    ↓
1. payments.status → 'confirmed'
2. credit_transactions 추가 (₩50,000)
3. subscriptions 생성 (3개월 무료)
4. users.subscription_status → 'active'
5. projects.installation_paid → true
6. 사용자 이메일 발송
```

---

### 3. reject.js - 입금 거부

**엔드포인트:** `POST /api/admin/installation/reject`

**권한:** 관리자 (is_admin)

**기능:**
1. 입금 상태 → 'rejected'
2. 거부 사유 기록
3. 이메일 알림 발송

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentId": "uuid",
  "reason": "입금 확인 불가 (선택사항)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "입금 신청이 반려되었습니다.",
  "payment": {
    "id": "uuid",
    "status": "rejected",
    "projectId": "uuid",
    "projectName": "프로젝트명"
  }
}
```

---

### 4. history.js - 입금 내역 조회

**엔드포인트:** `GET /api/admin/installation/history`

**권한:** 관리자 (is_admin)

**기능:**
- 전체 입금 내역 조회 (모든 상태)
- 정렬: 신청일시 내림차순 (최신 것부터)
- CSV 내보내기 지원
- 필터링 지원 (status, startDate, endDate)

**Request Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `format`: csv (CSV 내보내기)
- `status`: pending | confirmed | rejected (필터)
- `startDate`: 2025-01-01 (시작일)
- `endDate`: 2025-12-31 (종료일)

**Response (200 - JSON):**
```json
{
  "success": true,
  "count": 10,
  "payments": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "projectName": "프로젝트명",
      "userId": "uuid",
      "userEmail": "user@example.com",
      "userName": "사용자명",
      "amount": 3000000,
      "depositorName": "홍길동",
      "bankName": "국민은행",
      "depositDate": "2025-12-20",
      "status": "confirmed",
      "requestedAt": "2025-12-20T01:23:45Z",
      "confirmedAt": "2025-12-20T02:30:00Z",
      "rejectedAt": null,
      "adminMemo": "입금 확인 완료"
    }
  ],
  "summary": {
    "total": 10,
    "pending": 2,
    "confirmed": 7,
    "rejected": 1,
    "totalAmount": 21000000
  }
}
```

**Response (200 - CSV):**
```csv
ID,프로젝트명,사용자명,사용자 이메일,입금액,입금자명,은행,입금일,상태,신청일시,확인일시,반려일시,관리자 메모
uuid,"프로젝트명","홍길동",user@example.com,3000000,"홍길동","국민은행",2025-12-20,confirmed,2025-12-20T01:23:45Z,2025-12-20T02:30:00Z,,"입금 확인 완료"
```

**CSV 다운로드:**
```
GET /api/admin/installation/history?format=csv
```

파일명: `installation_payments_2025-12-20.csv`
인코딩: UTF-8 BOM (엑셀 한글 지원)

---

## 공통 에러 응답

### 401 Unauthorized
```json
{
  "error": "인증이 필요합니다."
}
```

### 403 Forbidden
```json
{
  "error": "관리자 권한이 필요합니다."
}
```

### 404 Not Found
```json
{
  "error": "입금 신청을 찾을 수 없습니다."
}
```

### 400 Bad Request
```json
{
  "error": "이미 처리된 입금 신청입니다.",
  "currentStatus": "confirmed"
}
```

### 500 Internal Server Error
```json
{
  "error": "서버 오류가 발생했습니다.",
  "details": "Error message"
}
```

---

## 데이터베이스 테이블

### installation_payments
```sql
- id: uuid (PK)
- project_id: uuid (FK → projects)
- user_id: uuid (FK → users)
- amount: numeric
- depositor_name: text
- bank_name: text
- deposit_date: date
- status: text (pending | confirmed | rejected)
- requested_at: timestamp
- confirmed_at: timestamp
- rejected_at: timestamp
- admin_memo: text
```

### credit_transactions
```sql
- id: uuid (PK)
- user_id: uuid (FK → users)
- amount: numeric
- transaction_type: text (earned)
- description: text
- balance_after: numeric
- created_at: timestamp
```

### subscriptions
```sql
- id: uuid (PK)
- user_id: uuid (FK → users)
- plan_type: text (standard)
- status: text (active)
- start_date: timestamp
- current_period_end: timestamp
- is_trial: boolean
- trial_end_date: timestamp
- created_at: timestamp
```

---

## 테스트 시나리오

### 1. 입금 대기 목록 조회
```bash
curl -X GET "http://localhost:3000/api/admin/installation/pending" \
  -H "Authorization: Bearer {admin_token}"
```

### 2. 입금 확인 처리
```bash
curl -X POST "http://localhost:3000/api/admin/installation/confirm" \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "uuid",
    "memo": "입금 확인 완료"
  }'
```

### 3. 입금 거부
```bash
curl -X POST "http://localhost:3000/api/admin/installation/reject" \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "uuid",
    "reason": "입금 확인 불가"
  }'
```

### 4. 입금 내역 조회 (JSON)
```bash
curl -X GET "http://localhost:3000/api/admin/installation/history" \
  -H "Authorization: Bearer {admin_token}"
```

### 5. 입금 내역 조회 (CSV)
```bash
curl -X GET "http://localhost:3000/api/admin/installation/history?format=csv" \
  -H "Authorization: Bearer {admin_token}" \
  -o payments.csv
```

---

## 완료 체크리스트

- [x] 4개 API 파일 생성
- [x] Stage 폴더 저장
- [x] Production 폴더 저장
- [x] 관리자 권한 검증 구현
- [x] 초기 크레딧 지급 로직
- [x] 구독 시작 로직 (3개월 무료)
- [x] CSV 내보내기 기능
- [x] 이메일 알림 발송
- [x] 에러 처리

---

## 다음 단계

1. Vercel 배포
2. 환경 변수 설정 (SUPABASE_URL, SUPABASE_ANON_KEY)
3. 관리자 페이지 UI 연동
4. 통합 테스트
