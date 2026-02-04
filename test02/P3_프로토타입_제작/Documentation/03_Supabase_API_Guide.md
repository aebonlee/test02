# Supabase API 사용 가이드

**프로젝트:** SSALWorks Dashboard 프로토타입
**작성일:** 2025-12-02
**버전:** 1.0

---

## 목차

1. [개요](#개요)
2. [인증 설정](#인증-설정)
3. [공지사항 API](#공지사항-api)
4. [학습 콘텐츠 API](#학습-콘텐츠-api)
5. [에러 처리](#에러-처리)
6. [코드 예시](#코드-예시)

---

## 개요

Supabase는 PostgreSQL 기반의 Backend-as-a-Service입니다. REST API와 JavaScript 클라이언트를 통해 데이터베이스에 접근할 수 있습니다.

**프로젝트 정보:**
- **Supabase URL**: `https://zwjmfewyshhwpgwdtrus.supabase.co`
- **API Version**: v1
- **Base URL**: `https://zwjmfewyshhwpgwdtrus.supabase.co/rest/v1`

---

## 인증 설정

### JavaScript 클라이언트 초기화

```javascript
const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### HTTP 헤더 (REST API 직접 호출 시)

```http
GET /rest/v1/notices HTTP/1.1
Host: zwjmfewyshhwpgwdtrus.supabase.co
apikey: your-anon-key-here
Authorization: Bearer your-anon-key-here
Content-Type: application/json
```

**필수 헤더:**
- `apikey`: Supabase Anonymous Key
- `Authorization: Bearer {ANON_KEY}`: 인증 토큰

---

## 공지사항 API

### 1. 공지사항 조회 (SELECT)

#### 전체 조회

```javascript
const { data, error } = await supabaseClient
    .from('notices')
    .select('*');
```

**REST API:**
```http
GET /rest/v1/notices?select=*
```

#### 최신 3개 조회 (중요 공지사항 우선)

```javascript
const { data, error } = await supabaseClient
    .from('notices')
    .select('*')
    .order('important', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(3);
```

**REST API:**
```http
GET /rest/v1/notices?select=*&order=important.desc,created_at.desc&limit=3
```

#### 특정 ID 조회

```javascript
const { data: notice, error } = await supabaseClient
    .from('notices')
    .select('*')
    .eq('id', noticeId)
    .single();
```

**REST API:**
```http
GET /rest/v1/notices?id=eq.{notice_id}&select=*
```

### 2. 공지사항 생성 (INSERT)

**⚠️ 인증 필요** (관리자만)

```javascript
const { data, error } = await supabaseClient
    .from('notices')
    .insert([{
        title: '공지사항 제목',
        content: '공지사항 내용',
        important: true
    }])
    .select();
```

**REST API:**
```http
POST /rest/v1/notices
Content-Type: application/json

{
    "title": "공지사항 제목",
    "content": "공지사항 내용",
    "important": true
}
```

### 3. 공지사항 수정 (UPDATE)

**⚠️ 인증 필요** (관리자만)

```javascript
const { data, error } = await supabaseClient
    .from('notices')
    .update({
        title: '수정된 제목',
        content: '수정된 내용',
        important: false
    })
    .eq('id', noticeId)
    .select();
```

**REST API:**
```http
PATCH /rest/v1/notices?id=eq.{notice_id}
Content-Type: application/json

{
    "title": "수정된 제목",
    "content": "수정된 내용",
    "important": false
}
```

### 4. 공지사항 삭제 (DELETE)

**⚠️ 인증 필요** (관리자만)

```javascript
const { error } = await supabaseClient
    .from('notices')
    .delete()
    .eq('id', noticeId);
```

**REST API:**
```http
DELETE /rest/v1/notices?id=eq.{notice_id}
```

---

## 학습 콘텐츠 API

### 1. 학습 콘텐츠 조회 (SELECT)

#### 전체 조회 (정렬)

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .select('*')
    .order('depth1')
    .order('depth2')
    .order('display_order');
```

**REST API:**
```http
GET /rest/v1/learning_contents?select=*&order=depth1,depth2,display_order
```

#### 대분류별 조회

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .select('*')
    .eq('depth1', '웹개발 기초');
```

**REST API:**
```http
GET /rest/v1/learning_contents?depth1=eq.웹개발 기초&select=*
```

#### 중분류별 조회

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .select('*')
    .eq('depth1', '웹개발 기초')
    .eq('depth2', 'HTML/CSS');
```

**REST API:**
```http
GET /rest/v1/learning_contents?depth1=eq.웹개발 기초&depth2=eq.HTML/CSS&select=*
```

#### 소분류만 조회 (실제 콘텐츠)

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .select('*')
    .not('depth3', 'is', null);
```

**REST API:**
```http
GET /rest/v1/learning_contents?depth3=not.is.null&select=*
```

#### 검색 (Full-text search)

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .select('*')
    .textSearch('depth1, depth2, depth3', '검색어');
```

**JavaScript에서 클라이언트 사이드 필터링:**
```javascript
const results = allData.filter(item => {
    const searchTerm = query.toLowerCase();
    return (item.depth1 && item.depth1.toLowerCase().includes(searchTerm)) ||
           (item.depth2 && item.depth2.toLowerCase().includes(searchTerm)) ||
           (item.depth3 && item.depth3.toLowerCase().includes(searchTerm)) ||
           (item.description && item.description.toLowerCase().includes(searchTerm));
});
```

### 2. 학습 콘텐츠 생성 (INSERT)

**⚠️ 인증 필요** (관리자만)

#### Depth1 (대분류) 추가

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .insert([{
        depth1: '새 대분류',
        depth2: null,
        depth3: null
    }])
    .select();
```

#### Depth2 (중분류) 추가

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .insert([{
        depth1: '웹개발 기초',
        depth2: '새 중분류',
        depth3: null
    }])
    .select();
```

#### Depth3 (소분류) 추가

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .insert([{
        depth1: '웹개발 기초',
        depth2: 'HTML/CSS',
        depth3: '새 소분류',
        url: 'https://example.com',
        description: '설명',
        display_order: 1
    }])
    .select();
```

### 3. 학습 콘텐츠 수정 (UPDATE)

**⚠️ 인증 필요** (관리자만)

#### Depth1 수정 (Cascade)

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .update({ depth1: '새 이름' })
    .eq('depth1', '기존 이름')
    .select();
```

#### Depth2 수정 (Cascade)

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .update({ depth2: '새 이름' })
    .eq('depth1', '대분류')
    .eq('depth2', '기존 이름')
    .select();
```

#### Depth3 (개별 항목) 수정

```javascript
const { data, error } = await supabaseClient
    .from('learning_contents')
    .update({
        depth3: '새 이름',
        url: 'https://new-url.com',
        description: '새 설명'
    })
    .eq('id', itemId)
    .select();
```

### 4. 학습 콘텐츠 삭제 (DELETE)

**⚠️ 인증 필요** (관리자만)

#### Depth1 삭제 (모든 하위 항목 삭제)

```javascript
const { error } = await supabaseClient
    .from('learning_contents')
    .delete()
    .eq('depth1', '대분류명');
```

#### Depth2 삭제 (해당 중분류의 모든 하위 항목 삭제)

```javascript
const { error } = await supabaseClient
    .from('learning_contents')
    .delete()
    .eq('depth1', '대분류명')
    .eq('depth2', '중분류명');
```

#### Depth3 삭제 (개별 항목만 삭제)

```javascript
const { error } = await supabaseClient
    .from('learning_contents')
    .delete()
    .eq('id', itemId);
```

---

## 에러 처리

### 에러 구조

```javascript
{
    data: null,
    error: {
        message: "에러 메시지",
        details: "상세 정보",
        hint: "해결 방법 힌트",
        code: "에러 코드"
    }
}
```

### 일반적인 에러 처리 패턴

```javascript
async function fetchData() {
    try {
        const { data, error } = await supabaseClient
            .from('notices')
            .select('*');

        if (error) {
            console.error('Supabase 오류:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        // 사용자에게 오류 메시지 표시
        alert('데이터를 불러오는데 실패했습니다.');
        return [];
    }
}
```

### 주요 에러 코드

| 코드 | 의미 | 해결 방법 |
|------|------|-----------|
| `PGRST301` | Row not found | `.single()` 사용 시 데이터가 없음 |
| `23505` | Unique constraint violation | 중복 데이터 |
| `42501` | Insufficient privilege | RLS 정책 위반 (권한 없음) |
| `23503` | Foreign key violation | 참조 무결성 위반 |

---

## 코드 예시

### Frontend: 공지사항 로드 및 표시

```javascript
// Supabase 클라이언트 초기화
const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
let supabaseClient;

function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase 초기화 완료');
        loadNotices();
    } else {
        console.warn('⚠️ Supabase 라이브러리 로드 대기 중...');
        setTimeout(initSupabase, 1000);
    }
}

// 공지사항 로드
async function loadNotices() {
    try {
        const { data, error } = await supabaseClient
            .from('notices')
            .select('*')
            .order('important', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;

        renderNotices(data);
    } catch (error) {
        console.error('공지사항 로드 오류:', error);
    }
}

// 공지사항 렌더링
function renderNotices(notices) {
    const container = document.getElementById('noticesList');

    if (!notices || notices.length === 0) {
        container.innerHTML = '<div>등록된 공지사항이 없습니다.</div>';
        return;
    }

    container.innerHTML = notices.map(notice => `
        <div class="notice-item" onclick="showNoticeDetail('${notice.id}')">
            <span class="notice-bullet">${notice.important ? '🔴' : '●'}</span>
            <div class="notice-title">${notice.title}</div>
        </div>
    `).join('');
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', initSupabase);
```

### Frontend: 학습 콘텐츠 로드 및 검색

```javascript
let allLearningContents = [];

// 학습 콘텐츠 로드
async function loadAndRenderLearningContents() {
    try {
        const { data, error } = await supabaseClient
            .from('learning_contents')
            .select('*')
            .order('depth1')
            .order('depth2')
            .order('display_order');

        if (error) throw error;

        allLearningContents = data;
        renderLearningContentsTree(data);
    } catch (error) {
        console.error('학습 콘텐츠 로드 오류:', error);
    }
}

// 검색 기능
function searchLearningContents(query) {
    if (!query || query.trim() === '') {
        renderLearningContentsTree(allLearningContents);
        return;
    }

    const searchTerm = query.toLowerCase();
    const results = allLearningContents.filter(item => {
        return (item.depth1 && item.depth1.toLowerCase().includes(searchTerm)) ||
               (item.depth2 && item.depth2.toLowerCase().includes(searchTerm)) ||
               (item.depth3 && item.depth3.toLowerCase().includes(searchTerm)) ||
               (item.description && item.description.toLowerCase().includes(searchTerm));
    });

    renderSearchResults(results);
}
```

### Admin Dashboard: CRUD 예시

```javascript
// 공지사항 추가
async function createNotice(title, content, important) {
    try {
        const { data, error } = await supabaseClient
            .from('notices')
            .insert([{ title, content, important }])
            .select();

        if (error) throw error;

        console.log('✅ 공지사항 추가 완료:', data);
        loadNotices(); // 목록 새로고침
    } catch (error) {
        console.error('❌ 공지사항 추가 실패:', error);
        alert('공지사항 추가에 실패했습니다.');
    }
}

// 학습 콘텐츠 추가 (Depth3)
async function createLearningContent(depth1, depth2, depth3, url, description) {
    try {
        const { data, error } = await supabaseClient
            .from('learning_contents')
            .insert([{
                depth1,
                depth2,
                depth3,
                url,
                description,
                display_order: 0
            }])
            .select();

        if (error) throw error;

        console.log('✅ 학습 콘텐츠 추가 완료:', data);
        loadLearningContents(); // 목록 새로고침
    } catch (error) {
        console.error('❌ 학습 콘텐츠 추가 실패:', error);
        alert('학습 콘텐츠 추가에 실패했습니다.');
    }
}

// 삭제 (Cascade)
async function deleteLearningItem(depth1, depth2, depth3, itemId) {
    // 확인 메시지
    const confirmMessage = depth2 && depth3
        ? `"${depth3}"을(를) 삭제하시겠습니까?`
        : depth2
        ? `"${depth2}"와 모든 하위 항목을 삭제하시겠습니까?`
        : `"${depth1}"와 모든 하위 항목을 삭제하시겠습니까?`;

    if (!confirm(confirmMessage)) return;

    try {
        let query = supabaseClient.from('learning_contents').delete();

        if (itemId) {
            query = query.eq('id', itemId);
        } else if (depth2) {
            query = query.eq('depth1', depth1).eq('depth2', depth2);
        } else {
            query = query.eq('depth1', depth1);
        }

        const { error } = await query;

        if (error) throw error;

        console.log('✅ 삭제 완료');
        loadLearningContents(); // 목록 새로고침
    } catch (error) {
        console.error('❌ 삭제 실패:', error);
        alert('삭제에 실패했습니다.');
    }
}
```

---

## 성능 최적화 팁

### 1. 필요한 컬럼만 조회

```javascript
// ❌ 비효율적
const { data } = await supabaseClient
    .from('learning_contents')
    .select('*');

// ✅ 효율적
const { data } = await supabaseClient
    .from('learning_contents')
    .select('id, depth1, depth2, depth3, url');
```

### 2. 클라이언트 사이드 캐싱

```javascript
let cachedLearningContents = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

async function loadLearningContents() {
    const now = Date.now();

    // 캐시가 유효하면 재사용
    if (cachedLearningContents && cacheTime && (now - cacheTime < CACHE_DURATION)) {
        console.log('📦 캐시된 데이터 사용');
        return cachedLearningContents;
    }

    // 새로 로드
    const { data, error } = await supabaseClient
        .from('learning_contents')
        .select('*');

    if (!error) {
        cachedLearningContents = data;
        cacheTime = now;
    }

    return data;
}
```

### 3. Batch 작업

```javascript
// ❌ 여러 번 호출
for (const item of items) {
    await supabaseClient.from('notices').insert([item]);
}

// ✅ 한 번에 처리
await supabaseClient.from('notices').insert(items);
```

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2025-12-02 | 1.0 | 초안 작성 | Claude Code |

---

**문서 끝**
