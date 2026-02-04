# Supabase Row Level Security(RLS) 정책으로 데이터 접근 권한 관리하기

> 이 문서는 Supabase의 Row Level Security(RLS) 정책을 안전하게 관리하는 방법을 설명합니다.

---

## RLS란 무엇인가

RLS(Row Level Security)는 행 단위로 데이터 접근을 제어하는 보안 기능입니다. "이 사용자는 자신의 데이터만 볼 수 있다"와 같은 규칙을 DB 레벨에서 강제합니다.

---

## 개발 vs 프로덕션 정책

| 환경 | 파일명 | 특징 |
|------|--------|------|
| 개발 | `*_rls_dev.sql` | 테스트 편의, 모든 접근 허용 |
| 프로덕션 | `*_rls.sql` | 실제 보안 정책 적용 |

**개발 환경**에서는 anon 역할도 INSERT/UPDATE/DELETE 가능하게 설정합니다.
**프로덕션**에서는 반드시 인증된 사용자만 수정 가능하도록 변경해야 합니다.

---

## 일반적인 RLS 패턴

```sql
-- SELECT: 모든 사용자
CREATE POLICY "allow_select" ON users FOR SELECT USING (true);

-- INSERT: 인증된 사용자만
CREATE POLICY "allow_insert" ON users FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: 본인만
CREATE POLICY "allow_update" ON users FOR UPDATE
  USING (auth.uid() = id);

-- DELETE: 본인만
CREATE POLICY "allow_delete" ON users FOR DELETE
  USING (auth.uid() = id);
```

---

## Supabase 유용한 함수

| 함수 | 설명 | 사용 예시 |
|------|------|----------|
| `auth.uid()` | 현재 로그인 사용자 UUID | `USING (auth.uid() = user_id)` |
| `auth.role()` | 'anon' 또는 'authenticated' | `WITH CHECK (auth.role() = 'authenticated')` |

---

## 배포 전 필수 작업

1. 개발용 정책 삭제
```sql
DROP POLICY "dev_allow_all" ON 테이블;
```

2. 프로덕션 정책 적용
```sql
-- *_rls.sql 파일 실행
```

3. 역할별 테스트
- anon으로 접속: SELECT만 가능해야 함
- authenticated로 접속: 본인 데이터만 수정 가능해야 함

---

## Claude Code에게 요청하기

```
"users 테이블에 RLS 정책 만들어줘:
- SELECT: 누구나
- INSERT/UPDATE/DELETE: 본인만"

"현재 RLS 정책이 개발용인지 프로덕션용인지 확인해줘"
```

---

*상세 내용: `CLAUDE.md` 개발 환경 RLS 정책 경고 섹션 참조*
