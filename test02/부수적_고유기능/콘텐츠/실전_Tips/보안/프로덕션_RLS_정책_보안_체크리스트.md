# 프로덕션 RLS 정책 보안 체크리스트

> 개발용 정책이 프로덕션에 배포되면 심각한 보안 침해가 발생할 수 있습니다.
> 이 체크리스트를 통해 RLS 정책 배포 전 보안을 점검하세요.

---

## 실제 사례: 권한 상승 공격

### 무슨 일이 있었나?

공격자가 임시 이메일로 계정을 만든 후, 개발용 RLS 정책의 취약점을 이용해:
- `role`을 'admin'으로 변경
- `credit_balance`를 999981로 변경
- `builder_id`를 무단 부여

**원인**: 개발용 정책 `users_dev_update_all`이 프로덕션에 적용되어 있었음

```sql
-- 위험한 개발용 정책 (절대 프로덕션에 사용 금지!)
CREATE POLICY "users_dev_update_all" ON users
FOR UPDATE USING (true) WITH CHECK (true);
```

---

## 배포 전 필수 체크리스트

### 1. 개발용 정책 제거 확인

```sql
-- 현재 적용된 RLS 정책 확인
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';
```

**확인 사항:**
- [ ] `_dev_` 가 포함된 정책명이 없는가?
- [ ] `USING (true)` 또는 `WITH CHECK (true)`가 단독으로 사용된 정책이 없는가?
- [ ] 모든 UPDATE/INSERT 정책에 적절한 조건이 있는가?

### 2. 민감 필드 보호 확인

**반드시 보호해야 할 필드들:**

| 테이블 | 민감 필드 | 보호 이유 |
|--------|----------|----------|
| users | `role` | 권한 상승 방지 |
| users | `credit_balance` | 금전적 피해 방지 |
| users | `builder_id` | 신원 도용 방지 |
| users | `installation_fee_paid` | 결제 우회 방지 |
| users | `status` | 계정 상태 조작 방지 |

**안전한 정책 예시:**

```sql
-- 민감 필드 보호 정책
CREATE POLICY "users_self_update_safe" ON users
FOR UPDATE USING (
    auth.uid() = id
)
WITH CHECK (
    auth.uid() = id
    -- 민감 필드는 변경 불가
    AND role = (SELECT role FROM users WHERE id = auth.uid())
    AND credit_balance = (SELECT credit_balance FROM users WHERE id = auth.uid())
    AND builder_id = (SELECT builder_id FROM users WHERE id = auth.uid())
    AND installation_fee_paid = (SELECT installation_fee_paid FROM users WHERE id = auth.uid())
);
```

### 3. 감사 로그 테이블 확인

민감 데이터 변경 시 기록이 남는지 확인:

- [ ] 권한 변경 로그가 기록되는가?
- [ ] 크레딧 변경 로그가 기록되는가?
- [ ] 로그 테이블은 사용자가 수정할 수 없는가?

---

## RLS 정책 설계 원칙

### 원칙 1: 최소 권한

```
사용자는 자신의 데이터만 접근할 수 있어야 합니다.
```

```sql
-- 좋은 예: 본인 데이터만 조회
CREATE POLICY "users_select_own" ON users
FOR SELECT USING (auth.uid() = id);

-- 나쁜 예: 모든 데이터 조회 가능
CREATE POLICY "users_select_all" ON users
FOR SELECT USING (true);
```

### 원칙 2: 민감 필드 불변성

```
권한, 잔액 등 민감 필드는 사용자가 직접 변경할 수 없어야 합니다.
```

민감 필드 변경은 반드시:
- 서버 측 API를 통해서만
- SECURITY DEFINER 함수를 통해서만
- Admin 권한으로만

### 원칙 3: 감사 추적

```
금융/권한 관련 테이블의 기록은 수정/삭제할 수 없어야 합니다.
```

```sql
-- 거래 기록은 INSERT만 허용
CREATE POLICY "credit_transactions_insert_only" ON credit_transactions
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- UPDATE, DELETE 정책은 생성하지 않음 = 수정/삭제 불가
```

---

## 개발 vs 프로덕션 환경 분리

### 환경별 정책 명명 규칙

| 환경 | 정책명 패턴 | 예시 |
|------|------------|------|
| 개발 | `{table}_dev_{action}` | `users_dev_update_all` |
| 프로덕션 | `{table}_{action}_{scope}` | `users_update_self_safe` |

### 배포 자동화 스크립트

```bash
# 프로덕션 배포 전 개발용 정책 자동 검출
psql -c "SELECT policyname FROM pg_policies WHERE policyname LIKE '%_dev_%';"

# 결과가 있으면 배포 중단
if [ $? -eq 0 ]; then
    echo "ERROR: 개발용 정책이 발견되었습니다. 배포를 중단합니다."
    exit 1
fi
```

---

## 비정상 활동 탐지

### 모니터링 쿼리

```sql
-- 최근 권한 변경 탐지 (감사 테이블이 있는 경우)
SELECT * FROM audit_log
WHERE table_name = 'users'
AND changed_field IN ('role', 'credit_balance')
AND changed_at > NOW() - INTERVAL '24 hours';

-- 비정상 크레딧 잔액 탐지
SELECT email, credit_balance, updated_at
FROM users
WHERE credit_balance > 100000
ORDER BY updated_at DESC;
```

### 알림 설정 (권장)

- 권한이 admin으로 변경될 때 알림
- 크레딧이 특정 금액 이상 증가할 때 알림
- 새 builder_id가 부여될 때 알림

---

## 요약: 핵심 수칙

1. **개발용 정책은 프로덕션에 절대 배포하지 마세요**
2. **민감 필드는 항상 별도로 보호하세요**
3. **`USING (true)` 단독 사용은 피하세요**
4. **금융/권한 테이블은 INSERT만 허용하세요**
5. **정기적으로 RLS 정책을 감사하세요**

---

## 관련 문서

- `S1_개발_준비/Database/30_users_rls_secure.sql` - users 테이블 보안 정책
- `S1_개발_준비/Database/31_all_tables_rls_secure.sql` - 전체 테이블 보안 정책
- `Human_ClaudeCode_Bridge/Reports/security_incident_2026-01-18.json` - 보안 사고 상세 리포트
