# Supabase 인덱스, select 최소화 등으로 쿼리 속도 최적화하기

> 이 문서는 Supabase 데이터베이스 쿼리를 최적화하는 방법을 설명합니다.

---

## 기본 원칙

```sql
-- 모든 컬럼 조회 (비효율적)
SELECT * FROM products;

-- 필요한 컬럼만 (효율적)
SELECT id, name, price FROM products;
```

필요한 컬럼만 조회하면 네트워크 전송량이 줄고 성능이 향상됩니다.

---

## 인덱스 추가

자주 필터링하거나 정렬하는 컬럼에는 인덱스를 추가합니다.

```sql
-- 단일 컬럼 인덱스
CREATE INDEX idx_products_category ON products (category_id);

-- 복합 인덱스 (자주 함께 사용되는 컬럼)
CREATE INDEX idx_orders_user_date ON orders (user_id, created_at);
```

---

## N+1 문제 해결

```javascript
// N+1 문제 (주문 100개 = 101번 쿼리)
const orders = await supabase.from('orders').select('*');
for (const order of orders.data) {
  await supabase.from('users').select('*').eq('id', order.user_id);
}

// JOIN으로 한 번에 (1번 쿼리)
const { data } = await supabase
  .from('orders')
  .select('id, total_amount, users (id, email, name)');
```

---

## 페이지네이션

```javascript
// 전체 조회 (느림)
const { data } = await supabase.from('products').select('*');

// 페이지네이션 (빠름)
const { data } = await supabase
  .from('products')
  .select('*')
  .range(0, 19);  // 첫 20개만
```

---

## View 활용

복잡한 쿼리를 View로 만들어 재사용합니다.

```sql
CREATE VIEW user_order_summary AS
SELECT u.id, u.email, COUNT(o.id) AS order_count
FROM users u LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.email;
```

---

## 성능 분석

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 'uuid';
```

| 결과 | 의미 |
|------|------|
| Seq Scan | 전체 테이블 스캔 (느림) |
| Index Scan | 인덱스 사용 (빠름) |

---

## Claude Code에게 요청하기

```
"orders 테이블 쿼리가 느려, 최적화해줘"
"users와 orders JOIN 쿼리 작성해줘"
"자주 사용하는 컬럼에 인덱스 추가해줘"
```

---

*상세 내용: Supabase Dashboard > Database > Query Performance 참조*
