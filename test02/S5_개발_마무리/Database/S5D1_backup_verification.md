# S5D1: Supabase 백업 설정 검증 리포트

**검증일시:** 2025-12-23
**검증자:** database-specialist (AI Agent)
**대상:** Supabase Project (zwjmfewyshhwpgwdtrus)

---

## 1. Supabase 백업 정책

### 1.1 플랜별 백업 지원

| 플랜 | 자동 백업 | 보관 기간 | PITR | 가격 (월) |
|------|----------|----------|------|----------|
| Free | X | - | X | $0 |
| Pro | O | 7일 | O (추가 비용) | $25 |
| Team | O | 14일 | O | $599 |
| Enterprise | O | 30일+ | O | 협의 |

**PITR (Point-in-Time Recovery):**
- 특정 시점으로 데이터베이스 복원
- Pro: 추가 비용 발생 ($0.125/GB)
- Team/Enterprise: 기본 포함

### 1.2 현재 프로젝트 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| 프로젝트 ID | zwjmfewyshhwpgwdtrus | |
| 프로젝트 URL | https://zwjmfewyshhwpgwdtrus.supabase.co | |
| 플랜 | Free | 자동 백업 미지원 |
| 자동 백업 | N/A | Free 플랜 |
| PITR | N/A | Free 플랜 |
| DB 엔진 | PostgreSQL 15 | |

---

## 2. 백업 대안 전략

### 2.1 수동 백업 방법

**방법 1: pg_dump 사용 (권장)**

```bash
# 환경 변수 설정
export PGHOST=db.zwjmfewyshhwpgwdtrus.supabase.co
export PGPORT=5432
export PGDATABASE=postgres
export PGUSER=postgres
export PGPASSWORD=DkvOOSG1fm1K17Vc

# 전체 백업 (스키마 + 데이터)
pg_dump -F c -f backup_full_$(date +%Y%m%d_%H%M%S).dump

# 스키마만 백업
pg_dump --schema-only -f backup_schema_$(date +%Y%m%d).sql

# 데이터만 백업
pg_dump --data-only -F c -f backup_data_$(date +%Y%m%d).dump

# 특정 테이블만 백업
pg_dump -t users -t profiles -F c -f backup_users_$(date +%Y%m%d).dump
```

**방법 2: Supabase CLI**

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref zwjmfewyshhwpgwdtrus

# 백업 실행
supabase db dump --data-only -f backup_$(date +%Y%m%d).sql

# 스키마 백업
supabase db dump --schema-only -f schema_$(date +%Y%m%d).sql
```

**방법 3: Supabase Dashboard (Pro 플랜 이상)**

```
1. Supabase Dashboard 접속
2. Project Settings > Database
3. Backups 탭
4. "Create backup" 클릭
5. 백업 완료 후 "Download" 클릭
```

### 2.2 권장 백업 스케줄 (Free 플랜)

| 주기 | 방법 | 보관 기간 | 중요도 |
|------|------|----------|--------|
| **매주 월요일** | pg_dump (전체) | 4주치 | 필수 |
| **배포 전** | pg_dump (전체) | 영구 | 필수 |
| **스키마 변경 전** | pg_dump (스키마+데이터) | 영구 | 필수 |
| **월 1회** | pg_dump (전체) | 6개월 | 권장 |

### 2.3 자동 백업 스크립트

**Linux/Mac 자동 백업 (cron)**

```bash
# backup_supabase.sh 생성
#!/bin/bash
export PGHOST=db.zwjmfewyshhwpgwdtrus.supabase.co
export PGPORT=5432
export PGDATABASE=postgres
export PGUSER=postgres
export PGPASSWORD=DkvOOSG1fm1K17Vc

BACKUP_DIR="/backups/supabase"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${DATE}.dump"

mkdir -p $BACKUP_DIR
pg_dump -F c -f "${BACKUP_DIR}/${FILENAME}"

# 4주 이상된 백업 삭제
find $BACKUP_DIR -name "backup_*.dump" -mtime +28 -delete

echo "Backup completed: ${FILENAME}"
```

**crontab 설정 (매주 월요일 새벽 2시)**

```bash
0 2 * * 1 /path/to/backup_supabase.sh >> /var/log/supabase_backup.log 2>&1
```

**Windows 자동 백업 (Task Scheduler)**

```powershell
# backup_supabase.ps1
$env:PGHOST="db.zwjmfewyshhwpgwdtrus.supabase.co"
$env:PGPORT="5432"
$env:PGDATABASE="postgres"
$env:PGUSER="postgres"
$env:PGPASSWORD="DkvOOSG1fm1K17Vc"

$BackupDir = "C:\Backups\Supabase"
$Date = Get-Date -Format "yyyyMMdd_HHmmss"
$Filename = "backup_$Date.dump"

New-Item -ItemType Directory -Force -Path $BackupDir
pg_dump -F c -f "$BackupDir\$Filename"

# 4주 이상된 백업 삭제
Get-ChildItem $BackupDir -Filter "backup_*.dump" |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-28) } |
    Remove-Item

Write-Host "Backup completed: $Filename"
```

---

## 3. 데이터베이스 현황

### 3.1 주요 테이블 목록

| 테이블명 | 용도 | 데이터 중요도 | RLS | 비고 |
|----------|------|--------------|-----|------|
| **users** | 사용자 정보 | Critical | O | Auth 연동 |
| **profiles** | 프로필 정보 | High | O | |
| **projects** | 프로젝트 데이터 | High | O | |
| **subscriptions** | 구독 정보 | Critical | O | |
| **credits** | 크레딧 정보 | Critical | O | 금액 관련 |
| **credit_history** | 크레딧 이력 | Critical | O | 금액 관련 |
| **billing_history** | 결제 이력 | Critical | O | 금액 관련 |
| **payment_methods** | 결제 수단 | High | O | |
| **project_sal_grid** | Task 관리 | High | O | |
| **stage_verification** | Stage 검증 | Medium | O | |
| **notices** | 공지사항 | Medium | O | |
| **faqs** | FAQ | Low | O | |
| **learning_contents** | 학습 콘텐츠 | Medium | O | |
| **manuals** | 매뉴얼 | Medium | O | |
| **inquiries** | 1:1 문의 | High | O | |
| **api_usage_log** | API 사용 로그 | High | O | |
| **api_costs** | API 비용 정보 | Medium | O | |
| **ai_service_pricing** | AI 서비스 가격 | Medium | O | |

**데이터 중요도:**
- **Critical**: 손실 시 서비스 불가 (사용자, 결제, 크레딧)
- **High**: 손실 시 서비스 영향 큼 (프로젝트, 문의)
- **Medium**: 손실 시 서비스 영향 보통 (공지, 매뉴얼)
- **Low**: 손실 시 서비스 영향 적음 (FAQ)

### 3.2 RLS (Row Level Security) 정책 현황

**RLS 활성화 테이블:**

| 테이블 | RLS 활성화 | 정책 유형 | 상태 |
|--------|-----------|----------|------|
| users | ✅ | 개발용 (전체 허용) | 정상 |
| profiles | ✅ | 개발용 (전체 허용) | 정상 |
| projects | ✅ | 개발용 (전체 허용) | 정상 |
| subscriptions | ✅ | 개발용 (전체 허용) | 정상 |
| credits | ✅ | 개발용 (전체 허용) | 정상 |
| learning_contents | ✅ | 개발용 (전체 허용) | 정상 |
| faqs | ✅ | 개발용 (전체 허용) | 정상 |

**⚠️ 주의사항:**
- **현재 상태**: 개발용 RLS 정책 (전체 허용)
- **프로덕션 배포 전**: 프로덕션 RLS 정책으로 교체 필수
- **정책 파일 위치**: `S1_개발_준비/Database/*_rls_dev.sql`

**개발용 RLS 정책:**
```sql
-- 예시: users 테이블
CREATE POLICY "users_dev_select_all" ON users
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "users_dev_insert_all" ON users
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "users_dev_update_all" ON users
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
```

**프로덕션 RLS 정책 (배포 전 적용 필요):**
```sql
-- SELECT: 본인 정보만 조회 (Admin은 전체)
CREATE POLICY "users_select_own" ON users
    FOR SELECT TO authenticated
    USING (auth.uid() = id OR is_admin = true);

-- UPDATE: 본인 정보만 수정
CREATE POLICY "users_update_own" ON users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- INSERT: 회원가입 시 허용
CREATE POLICY "users_insert_signup" ON users
    FOR INSERT TO anon
    WITH CHECK (true);
```

### 3.3 데이터베이스 스키마 파일

| 파일명 | 내용 | 위치 |
|--------|------|------|
| `00_users_table.sql` | users 테이블 스키마 | S1_개발_준비/Database/ |
| `12_extend_users_table.sql` | users 확장 컬럼 | S1_개발_준비/Database/ |
| `15_create_projects.sql` | projects 테이블 | S1_개발_준비/Database/ |
| `24_create_credit_tables.sql` | credits 테이블 | S1_개발_준비/Database/ |
| `01_S4D1_payment_methods.sql` | payment_methods 테이블 | S4_개발-3차/Database/ |
| `02_S4D1_billing_history.sql` | billing_history 테이블 | S4_개발-3차/Database/ |
| `05_S4D1_ai_pricing.sql` | ai_service_pricing 테이블 | S4_개발-3차/Database/ |
| `06_S4D1_api_usage_log.sql` | api_usage_log 테이블 | S4_개발-3차/Database/ |

---

## 4. 복구 절차

### 4.1 전체 복구 (pg_restore)

```bash
# 환경 변수 설정
export PGHOST=db.zwjmfewyshhwpgwdtrus.supabase.co
export PGPORT=5432
export PGDATABASE=postgres
export PGUSER=postgres
export PGPASSWORD=DkvOOSG1fm1K17Vc

# 전체 복구 (기존 데이터 삭제 후 복구)
pg_restore -c -d postgres backup_full_20251223.dump

# 전체 복구 (기존 데이터 유지)
pg_restore -d postgres backup_full_20251223.dump

# 복구 진행상황 표시
pg_restore -v -d postgres backup_full_20251223.dump
```

### 4.2 부분 복구 (특정 테이블)

```bash
# 특정 테이블만 복구
pg_restore -d postgres -t users backup_full_20251223.dump

# 여러 테이블 복구
pg_restore -d postgres -t users -t profiles -t projects backup_full_20251223.dump

# 스키마 제외하고 데이터만 복구
pg_restore --data-only -d postgres backup_data_20251223.dump
```

### 4.3 SQL 파일 복구

```bash
# SQL 파일에서 복구
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f backup_schema_20251223.sql

# 특정 테이블만 복구 (grep 사용)
grep -A 1000 "CREATE TABLE users" backup_schema_20251223.sql | psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE
```

### 4.4 Supabase CLI 복구

```bash
# SQL 파일 복구
supabase db push --file backup_20251223.sql

# 마이그레이션 적용
supabase migration up
```

### 4.5 PITR 복구 (Pro 플랜 이상)

```
1. Supabase Dashboard 접속
2. Project Settings > Database > Backups
3. "Point-in-Time Recovery" 선택
4. 복구 시점 지정 (날짜/시간)
5. "Restore" 클릭
6. 복구 완료 확인 (5~30분 소요)
```

### 4.6 복구 후 검증

```sql
-- 테이블 수 확인
SELECT count(*) FROM information_schema.tables
WHERE table_schema = 'public';

-- 주요 테이블 데이터 확인
SELECT 'users' as table_name, count(*) as count FROM users
UNION ALL
SELECT 'projects', count(*) FROM projects
UNION ALL
SELECT 'subscriptions', count(*) FROM subscriptions
UNION ALL
SELECT 'credits', count(*) FROM credits;

-- RLS 정책 확인
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 5. 재해 복구 계획 (Disaster Recovery Plan)

### 5.1 백업 3-2-1 규칙

| 규칙 | 설명 | 적용 방법 |
|------|------|----------|
| **3 copies** | 백업 3개 보관 | 원본 + 로컬 백업 + 클라우드 백업 |
| **2 media** | 2개 매체 사용 | 로컬 디스크 + 클라우드 스토리지 |
| **1 offsite** | 1개는 외부 보관 | AWS S3 / Google Drive |

### 5.2 백업 보관 전략

**로컬 백업:**
- 위치: `/backups/supabase/` (Linux) 또는 `C:\Backups\Supabase\` (Windows)
- 주간 백업: 4주치 보관
- 월간 백업: 6개월치 보관

**클라우드 백업:**
- AWS S3 / Google Drive / OneDrive
- 월간 백업: 1년치 보관
- 중요 마일스톤: 영구 보관

### 5.3 복구 시간 목표 (RTO/RPO)

| 재해 시나리오 | RTO (복구 시간) | RPO (데이터 손실) |
|--------------|----------------|------------------|
| 테이블 실수 삭제 | 1시간 | 최대 7일 |
| 데이터 손상 | 2시간 | 최대 7일 |
| 전체 DB 손실 | 4시간 | 최대 7일 |
| Supabase 장애 | 24시간 | 최대 7일 |

**프로덕션 권장 (Pro 플랜):**
- RTO: 1시간 이내
- RPO: 1시간 이내 (PITR 사용)

---

## 6. 권장 조치사항

### 6.1 즉시 조치 (P0 - Critical)

| 항목 | 설명 | 담당 | 기한 |
|------|------|------|------|
| **RLS 정책 검토** | 프로덕션 배포 전 RLS 정책 교체 | DevOps | 배포 전 |
| **초기 백업 실행** | pg_dump로 현재 상태 백업 | PO | 즉시 |

### 6.2 단기 조치 (P1 - High)

| 항목 | 설명 | 담당 | 기한 |
|------|------|------|------|
| **백업 스크립트** | 주간 자동 백업 스크립트 작성 | DevOps | 1주 이내 |
| **클라우드 백업** | S3/Drive 자동 업로드 설정 | DevOps | 1주 이내 |
| **복구 테스트** | 백업 파일 복구 테스트 | DevOps | 2주 이내 |

### 6.3 중기 조치 (P2 - Medium)

| 항목 | 설명 | 담당 | 기한 |
|------|------|------|------|
| **Pro 플랜 업그레이드** | 자동 백업 활성화 ($25/월) | PO | 프로덕션 운영 전 |
| **PITR 활성화** | 시점 복구 기능 활성화 | PO | Pro 플랜 후 |
| **모니터링 설정** | 백업 실패 알림 설정 | DevOps | 1개월 이내 |

### 6.4 장기 조치 (P3 - Low)

| 항목 | 설명 | 담당 | 기한 |
|------|------|------|------|
| **DR 사이트 구축** | 재해 복구 환경 구축 | DevOps | 6개월 이내 |
| **복구 훈련** | 분기별 복구 훈련 | 전체 | 분기별 |

---

## 7. 프로덕션 배포 전 체크리스트

### 7.1 데이터베이스 준비

- [ ] **백업 실행**: pg_dump로 전체 백업
- [ ] **RLS 정책 교체**: 개발용 → 프로덕션용
- [ ] **인덱스 확인**: 주요 컬럼 인덱스 생성
- [ ] **데이터 검증**: 샘플 데이터 제거
- [ ] **환경 변수 확인**: .env 파일 설정

### 7.2 RLS 정책 교체 스크립트

```sql
-- =====================================================
-- 프로덕션 RLS 정책 적용
-- =====================================================

-- 1. 개발용 정책 삭제
DROP POLICY IF EXISTS "users_dev_select_all" ON users;
DROP POLICY IF EXISTS "users_dev_insert_all" ON users;
DROP POLICY IF EXISTS "users_dev_update_all" ON users;

-- 2. 프로덕션 정책 생성
CREATE POLICY "users_select_own" ON users
    FOR SELECT TO authenticated
    USING (auth.uid() = id OR is_admin = true);

CREATE POLICY "users_insert_signup" ON users
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "users_update_own" ON users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 3. 모든 테이블 반복 적용
-- (learning_contents, faqs, projects, subscriptions, credits, etc.)
```

### 7.3 백업 검증

```bash
# 백업 파일 존재 확인
ls -lh backup_full_*.dump

# 백업 파일 크기 확인 (최소 1MB 이상)
du -h backup_full_20251223.dump

# 백업 파일 내용 확인
pg_restore --list backup_full_20251223.dump | head -20
```

---

## 8. 참고 자료

### 8.1 Supabase 공식 문서

- [Supabase Backups](https://supabase.com/docs/guides/platform/backups)
- [PostgreSQL Backup Best Practices](https://www.postgresql.org/docs/current/backup.html)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)

### 8.2 관련 파일

| 파일 | 위치 | 설명 |
|------|------|------|
| `.env` | P3_프로토타입_제작/Database/ | Supabase 연결 정보 |
| RLS 정책 | S1_개발_준비/Database/*_rls_dev.sql | 개발용 RLS |
| 스키마 | S1_개발_준비/Database/*.sql | 테이블 스키마 |

---

## 9. 결론

### 9.1 전체 상태

**⚠️ 조건부 통과 (Conditionally Passed)**

| 항목 | 상태 | 비고 |
|------|------|------|
| 백업 정책 문서화 | ✅ 완료 | |
| 복구 절차 문서화 | ✅ 완료 | |
| RLS 정책 확인 | ✅ 완료 | 개발용 → 프로덕션 전환 필요 |
| 자동 백업 | ⚠️ 미지원 | Free 플랜 제약 |
| 백업 스크립트 | ⚠️ 미작성 | 작성 필요 |
| 초기 백업 실행 | ⚠️ 미실행 | PO 실행 필요 |

### 9.2 통과 조건

**다음 조건 중 하나 충족 시 통과:**

1. **즉시 통과 조건**:
   - pg_dump로 수동 백업 1회 이상 실행
   - 백업 파일 검증 완료

2. **권장 통과 조건**:
   - Pro 플랜 업그레이드
   - 자동 백업 활성화
   - PITR 활성화

### 9.3 최종 권장사항

**단기 (1주 이내):**
- ✅ 수동 백업 즉시 실행 (pg_dump)
- ✅ 백업 스크립트 작성 (주간 자동 백업)
- ✅ RLS 정책 검토 (프로덕션 배포 전)

**중기 (1개월 이내):**
- ⭐ Pro 플랜 업그레이드 ($25/월)
- ⭐ 자동 백업 활성화
- ⭐ PITR 활성화 (추가 비용)

**장기 (6개월 이내):**
- DR 사이트 구축
- 복구 훈련 실시

---

**검증 완료:** 2025-12-23
**문서 위치:** `S5_개발_마무리/Database/S5D1_backup_verification.md`
**다음 단계:** PO에게 수동 백업 실행 요청
