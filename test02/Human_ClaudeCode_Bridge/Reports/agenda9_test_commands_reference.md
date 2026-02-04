# Agenda #9: 고객 문의 관리 시스템 - API 테스트 명령어 참조

**작성일:** 2025-12-12
**작성자:** Claude Code

이 문서는 Agenda #9 고객 문의 관리 시스템 테스트에 사용된 모든 curl 명령어를 정리한 참조 문서입니다.

---

## 📌 환경 설정

### Supabase 정보
```bash
SUPABASE_URL="https://zwjmfewyshhwpgwdtrus.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE1NTEsImV4cCI6MjA3OTE0NzU1MX0.AJy34h5VR8QS6WFEcUcBeJJu8I3bBQ6UCk1I84Wb7y4"
```

---

## 1️⃣ SELECT 테스트 (조회)

### 1-1. 전체 문의 목록 조회
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**결과:** 8건의 샘플 데이터 조회 성공

---

### 1-2. 총 문의 건수 조회
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=count" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Prefer: count=exact"
```

**결과:** `[{"count":8}]`

---

### 1-3. 상태별 조회 - Pending (대기 중)
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=id,status&status=eq.pending" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**결과:** 4건

---

### 1-4. 상태별 조회 - In Progress (처리 중)
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=id,status&status=eq.in_progress" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**결과:** 1건

---

### 1-5. 상태별 조회 - Answered (답변 완료)
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=id,status&status=eq.answered" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**결과:** 2건

---

### 1-6. 상태별 조회 - Closed (종료)
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=id,status&status=eq.closed" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**결과:** 1건

---

### 1-7. 특정 문의 조회 (ID로 검색)
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=*&id=eq.eb9869c7-5eb0-4031-ba22-6544c97c004c" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 1-8. 문의 유형 및 우선순위 분포 조회
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=inquiry_type,priority&limit=20" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

## 2️⃣ INSERT 테스트 (새 문의 접수)

### 2-1. JSON 파일 생성
```bash
cat > /tmp/test_inquiry.json << 'EOF'
{
  "inquiry_type": "general",
  "name": "테스트사용자",
  "email": "test@example.com",
  "phone": "010-0000-0000",
  "title": "API 테스트 문의",
  "content": "이것은 API 테스트를 위한 문의입니다.",
  "status": "pending",
  "priority": "normal"
}
EOF
```

### 2-2. POST 요청 실행
```bash
curl -X POST "${SUPABASE_URL}/rest/v1/inquiries" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d @/tmp/test_inquiry.json
```

**결과:**
```json
{
  "id": "eb9869c7-5eb0-4031-ba22-6544c97c004c",
  "inquiry_type": "general",
  "name": "테스트사용자",
  "email": "test@example.com",
  "phone": "010-0000-0000",
  "title": "API 테스트 문의",
  "content": "이것은 API 테스트를 위한 문의입니다.",
  "status": "pending",
  "answer": null,
  "answered_at": null,
  "answered_by": null,
  "priority": "normal",
  "created_at": "2025-12-11T18:45:06.531127+00:00",
  "updated_at": "2025-12-11T18:45:06.531127+00:00"
}
```

**확인 사항:**
- ✅ UUID 자동 생성
- ✅ created_at 자동 설정
- ✅ updated_at 자동 설정

---

## 3️⃣ UPDATE 테스트 (답변 추가)

### 3-1. JSON 파일 생성
```bash
cat > /tmp/update_inquiry.json << 'EOF'
{
  "status": "answered",
  "answer": "안녕하세요, 테스트사용자님. API 테스트 문의 주셔서 감사합니다. 이것은 테스트 답변입니다. 모든 기능이 정상적으로 작동하고 있습니다.",
  "answered_at": "2025-12-12T10:00:00+09:00",
  "answered_by": "ADMIN_TEST"
}
EOF
```

### 3-2. PATCH 요청 실행
```bash
curl -X PATCH "${SUPABASE_URL}/rest/v1/inquiries?id=eq.eb9869c7-5eb0-4031-ba22-6544c97c004c" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d @/tmp/update_inquiry.json
```

**결과:**
```json
{
  "id": "eb9869c7-5eb0-4031-ba22-6544c97c004c",
  "inquiry_type": "general",
  "name": "테스트사용자",
  "email": "test@example.com",
  "phone": "010-0000-0000",
  "title": "API 테스트 문의",
  "content": "이것은 API 테스트를 위한 문의입니다.",
  "status": "answered",
  "answer": "안녕하세요, 테스트사용자님. API 테스트 문의 주셔서 감사합니다. 이것은 테스트 답변입니다. 모든 기능이 정상적으로 작동하고 있습니다.",
  "answered_at": "2025-12-12T01:00:00+00:00",
  "answered_by": "ADMIN_TEST",
  "priority": "normal",
  "created_at": "2025-12-11T18:45:06.531127+00:00",
  "updated_at": "2025-12-11T18:46:21.543526+00:00"
}
```

**확인 사항:**
- ✅ 답변 내용 추가 성공
- ✅ 상태 변경 성공 (pending → answered)
- ✅ 답변 시각 및 관리자 ID 기록
- ✅ **updated_at 자동 업데이트** (트리거 작동 확인)

---

## 4️⃣ 통합 검증 명령어

### 4-1. 상태별 카운트 확인 (한 번에)
```bash
echo "=== Status Count Summary ===" && \
echo "Total:" && \
curl -s -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=count" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Prefer: count=exact" && \
echo "" && \
echo "Pending:" && \
curl -s -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=id&status=eq.pending" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | grep -o "id" | wc -l && \
echo "In Progress:" && \
curl -s -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=id&status=eq.in_progress" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | grep -o "id" | wc -l && \
echo "Answered:" && \
curl -s -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=id&status=eq.answered" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | grep -o "id" | wc -l && \
echo "Closed:" && \
curl -s -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=id&status=eq.closed" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | grep -o "id" | wc -l
```

**결과:**
```
=== Status Count Summary ===
Total:
[{"count":9}]

Pending:
4
In Progress:
1
Answered:
3
Closed:
1
```

---

## 5️⃣ 고급 쿼리 예제

### 5-1. 우선순위별 정렬 조회
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=*&order=priority.desc,created_at.desc" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 5-2. 특정 기간 내 문의 조회
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=*&created_at=gte.2025-12-11T00:00:00Z&created_at=lt.2025-12-13T00:00:00Z" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 5-3. 특정 유형 및 상태 조회 (AND 조건)
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=*&inquiry_type=eq.technical&status=eq.pending" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 5-4. 이메일로 사용자 문의 내역 조회
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=*&email=eq.test@example.com" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 5-5. 제목 검색 (LIKE)
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=*&title=ilike.*테스트*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

### 5-6. 답변 대기 중인 긴급 문의 조회
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/inquiries?select=*&status=eq.pending&priority=eq.urgent" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

---

## 6️⃣ 데이터 정리 (선택 사항)

### 6-1. 테스트 데이터 삭제 (필요 시)
```bash
curl -X DELETE "${SUPABASE_URL}/rest/v1/inquiries?id=eq.eb9869c7-5eb0-4031-ba22-6544c97c004c" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

> ⚠️ **주의:** 현재 RLS 정책에서 DELETE 권한이 허용되는지 확인 필요

---

## 📊 Supabase REST API 참고 자료

### 쿼리 파라미터

| 파라미터 | 설명 | 예시 |
|----------|------|------|
| `select` | 조회할 컬럼 선택 | `select=id,name,email` |
| `order` | 정렬 | `order=created_at.desc` |
| `limit` | 결과 수 제한 | `limit=10` |
| `offset` | 결과 건너뛰기 | `offset=20` |

### 필터 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `eq` | 같음 | `status=eq.pending` |
| `neq` | 같지 않음 | `status=neq.closed` |
| `gt` | 크다 | `priority=gt.normal` |
| `gte` | 크거나 같다 | `created_at=gte.2025-01-01` |
| `lt` | 작다 | `created_at=lt.2025-12-31` |
| `lte` | 작거나 같다 | `created_at=lte.2025-12-31` |
| `like` | LIKE (대소문자 구분) | `title=like.*테스트*` |
| `ilike` | LIKE (대소문자 무시) | `title=ilike.*test*` |
| `is` | NULL 체크 | `answer=is.null` |
| `in` | IN 절 | `status=in.(pending,in_progress)` |

### HTTP 헤더

| 헤더 | 필수 여부 | 설명 |
|------|-----------|------|
| `apikey` | 필수 | Supabase ANON 또는 Service Role Key |
| `Authorization` | 필수 | Bearer Token (apikey와 동일) |
| `Content-Type` | POST/PATCH | `application/json` |
| `Prefer` | 선택 | `return=representation` (INSERT/UPDATE 결과 반환) |
| `Prefer` | 선택 | `count=exact` (COUNT 쿼리) |

---

## 🎯 테스트 결과 요약

| 테스트 항목 | 명령어 수 | 성공 | 실패 |
|-------------|-----------|------|------|
| SELECT | 8 | 8 | 0 |
| INSERT | 1 | 1 | 0 |
| UPDATE | 1 | 1 | 0 |
| **Total** | **10** | **10** | **0** |

**성공률:** 100% ✅

---

## 📌 참고 사항

1. **환경 변수 사용 권장**
   ```bash
   export SUPABASE_URL="https://zwjmfewyshhwpgwdtrus.supabase.co"
   export ANON_KEY="your_anon_key_here"
   ```

2. **jq를 사용한 JSON 포맷팅** (설치 필요)
   ```bash
   curl ... | jq '.'
   ```

3. **응답 저장**
   ```bash
   curl ... > response.json
   ```

4. **Verbose 모드**
   ```bash
   curl -v ...
   ```

5. **타임아웃 설정**
   ```bash
   curl --max-time 30 ...
   ```

---

**작성일:** 2025-12-12
**작성자:** Claude Code
**버전:** 1.0
