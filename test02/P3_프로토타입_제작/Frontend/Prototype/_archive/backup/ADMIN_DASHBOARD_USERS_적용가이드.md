# Admin Dashboard 회원 관리 패치 적용 가이드

## 개요

이 가이드는 `admin_dashboard_users_patch.js` 파일의 회원 관리 기능을 `admin-dashboard_prototype.html`에 적용하는 방법을 설명합니다.

**작성일**: 2025-12-10
**대상 파일**: `admin-dashboard_prototype.html`
**패치 파일**: `admin_dashboard_users_patch.js`

---

## 1단계: 패치 파일 내용 복사

`admin_dashboard_users_patch.js` 파일의 **전체 내용**을 복사합니다.

```
파일 위치: P3_프로토타입_제작/Frontend/Prototype/admin_dashboard_users_patch.js
```

---

## 2단계: HTML 파일에 삽입

`admin-dashboard_prototype.html` 파일을 열고, 마지막 `</script>` 태그 바로 앞에 복사한 내용을 붙여넣습니다.

### 삽입 위치 찾기

파일 맨 아래에서 다음과 같은 부분을 찾습니다:

```html
        // ... 기존 코드 ...

        console.log('✅ Admin Dashboard 초기화 완료');
    </script>   <-- 이 태그 바로 위에 삽입
</body>
</html>
```

### 삽입 후 모습

```html
        // ... 기존 코드 ...

        console.log('✅ Admin Dashboard 초기화 완료');

        // ========== 회원 관리 패치 (Agenda #4) ==========
        // (admin_dashboard_users_patch.js 내용 전체)

    </script>
</body>
</html>
```

---

## 3단계: showSection 함수 수정

기존 `showSection` 함수를 찾아서 회원 관리 섹션 로딩 코드를 추가합니다.

### 기존 코드 찾기

```javascript
function showSection(section) {
    // ... 기존 코드 ...
}
```

### 추가할 코드

`showSection` 함수 내부에 다음 코드를 추가합니다:

```javascript
// 회원 관리 섹션일 경우 데이터 로드
if (section === 'users') {
    loadUsers();
}
```

### 수정 후 예시

```javascript
function showSection(section) {
    // 모든 섹션 숨기기
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });

    // 선택된 섹션 표시
    document.getElementById(`${section}-section`).classList.add('active');

    // 메뉴 활성화 상태 업데이트
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });

    // 회원 관리 섹션일 경우 데이터 로드 (추가)
    if (section === 'users') {
        loadUsers();
    }

    currentSection = section;
}
```

---

## 4단계: 회원 상세 모달 HTML 추가 (선택사항)

더 나은 사용자 경험을 위해 회원 상세 모달을 추가할 수 있습니다.

`</body>` 태그 바로 앞에 다음 HTML을 추가합니다:

```html
<!-- 회원 상세 모달 -->
<div id="userDetailModal" class="modal" style="display: none;">
    <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
            <h3>회원 상세 정보</h3>
            <button class="modal-close" onclick="closeUserDetailModal()">&times;</button>
        </div>
        <div class="modal-body" id="userDetailContent">
            <!-- 동적으로 채워짐 -->
        </div>
    </div>
</div>
```

---

## 5단계: 검증

### 5.1 브라우저에서 확인

1. `admin-dashboard_prototype.html` 파일을 브라우저에서 엽니다
2. 개발자 도구 콘솔(F12)을 엽니다
3. "회원 관리" 메뉴를 클릭합니다
4. 콘솔에 다음 메시지가 출력되는지 확인합니다:
   - `✅ 회원 관리 패치 로드 완료`
   - `📥 회원 목록 로드 중...`
   - `✅ 회원 목록 로드 성공: XX명`

### 5.2 기능 테스트

- [ ] 회원 목록이 테이블에 표시되는지 확인
- [ ] 검색 기능이 작동하는지 확인
- [ ] 통계 카드(총 회원 수, 무료 회원, 활성 회원, 오늘 가입)가 업데이트되는지 확인
- [ ] "상세" 링크 클릭 시 모달/알림이 표시되는지 확인

---

## 주의사항

### Database 먼저 적용

이 패치가 제대로 작동하려면 Supabase에 다음 SQL 파일들이 먼저 적용되어 있어야 합니다:

1. `12_extend_users_table.sql` - users 테이블 컬럼 확장
2. `13_users_rls_dev.sql` - 개발용 RLS 정책
3. `14_users_sample_data.sql` - 샘플 데이터

### RLS 정책 경고

⚠️ **프로덕션 배포 전 필수**: `13_users_rls_dev.sql`은 개발용 정책입니다.
프로덕션 배포 시에는 반드시 원래 RLS 정책으로 교체해야 합니다.

---

## 파일 목록

| 파일명 | 설명 | 위치 |
|--------|------|------|
| `admin_dashboard_users_patch.js` | 회원 관리 JavaScript 함수 | Frontend/Prototype/ |
| `admin-dashboard_prototype.html` | 적용 대상 HTML | Frontend/Prototype/ |
| `12_extend_users_table.sql` | DB 컬럼 확장 | Database/ |
| `13_users_rls_dev.sql` | 개발용 RLS | Database/ |
| `14_users_sample_data.sql` | 샘플 데이터 | Database/ |

---

## 문제 해결

### "supabaseClient is not defined" 오류

Admin Dashboard HTML에 Supabase 클라이언트가 이미 설정되어 있는지 확인합니다.
없다면 `<head>` 태그에 다음을 추가합니다:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 회원 목록이 로드되지 않음

1. 개발자 도구 콘솔에서 오류 메시지 확인
2. Supabase Dashboard에서 users 테이블 존재 여부 확인
3. RLS 정책이 적용되어 있는지 확인
4. 네트워크 탭에서 API 호출 상태 확인

### 검색이 작동하지 않음

검색 입력 필드의 ID가 `userSearchInput`인지 확인합니다.
다른 ID를 사용하는 경우 `searchUsers()` 함수 내의 ID를 수정합니다.

---

## 완료

이 가이드를 따라 적용하면 Admin Dashboard에서 회원 관리 기능을 사용할 수 있습니다.
