# 프론트엔드 컴포넌트 문서

**프로젝트:** SSALWorks Dashboard 프로토타입
**작성일:** 2025-12-02
**버전:** 1.0

---

## 목차

1. [개요](#개요)
2. [공지사항 컴포넌트](#공지사항-컴포넌트)
3. [학습 콘텐츠 컴포넌트](#학습-콘텐츠-컴포넌트)
4. [공통 유틸리티](#공통-유틸리티)
5. [스타일 가이드](#스타일-가이드)

---

## 개요

**파일 위치:** `C:\!SSAL_Works_Private\P3_프로토타입_제작\Frontend\Prototype\prototype_index_최종개선.html`

**기술 스택:**
- Vanilla JavaScript (ES6+)
- Supabase JavaScript Client
- DOMPurify (XSS 방지)

**주요 컴포넌트:**
1. 공지사항 표시 및 상세 팝업
2. 학습 콘텐츠 트리 구조 및 검색

---

## 공지사항 컴포넌트

### 1. Supabase 초기화

**위치:** Line ~7977

```javascript
const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

let supabaseClient;

function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase 클라이언트 초기화 완료 (Frontend)');
        loadNotices();
        loadAndRenderLearningContents();
    } else {
        console.warn('⚠️ Supabase 라이브러리가 로드되지 않았습니다.');
        setTimeout(initSupabase, 1000);
    }
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', initSupabase);
```

**동작:**
1. Supabase 라이브러리 로드 확인
2. 클라이언트 생성
3. 공지사항 및 학습 콘텐츠 자동 로드
4. 라이브러리 미로드 시 1초 후 재시도

---

### 2. loadNotices() - 공지사항 로드

**위치:** Line ~7990

```javascript
async function loadNotices() {
    console.log('📋 공지사항 로드 시작 (Frontend)');

    try {
        if (!supabaseClient) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        const { data, error } = await supabaseClient
            .from('notices')
            .select('*')
            .order('important', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;

        console.log('✅ 공지사항 로드 성공:', data.length, '개');
        renderNotices(data);

    } catch (error) {
        console.error('❌ 공지사항 로드 오류:', error);
        const noticesList = document.getElementById('noticesList');
        if (noticesList) {
            noticesList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #dc3545;">
                    공지사항을 불러오는데 실패했습니다.<br>
                    <span style="font-size: 11px;">콘솔(F12)에서 오류를 확인하세요.</span>
                </div>
            `;
        }
    }
}
```

**기능:**
- Supabase에서 공지사항 조회
- 중요 공지사항 우선, 최신순 정렬
- 최대 3개만 조회
- 에러 시 사용자 친화적 메시지 표시

---

### 3. renderNotices() - 공지사항 렌더링

**위치:** Line ~8040

```javascript
function renderNotices(notices) {
    const noticesList = document.getElementById('noticesList');

    if (!noticesList) {
        console.error('❌ noticesList 요소를 찾을 수 없습니다.');
        return;
    }

    if (!notices || notices.length === 0) {
        noticesList.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #6c757d;">
                등록된 공지사항이 없습니다.
            </div>
        `;
        return;
    }

    noticesList.innerHTML = notices.map(notice => {
        // XSS 방지: DOMPurify 사용
        const safeTitle = typeof DOMPurify !== 'undefined'
            ? DOMPurify.sanitize(notice.title, { ALLOWED_TAGS: [] })
            : notice.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        return `
            <div class="notice-item" onclick="showNoticeDetail('${notice.id}', this)">
                <span class="notice-bullet">●</span>
                <div class="notice-title">
                    ${safeTitle}
                </div>
            </div>
        `;
    }).join('');
}
```

**기능:**
- 공지사항 목록 HTML 생성
- DOMPurify로 XSS 방지
- 클릭 이벤트 연결 (`showNoticeDetail`)

**HTML 구조:**
```html
<div id="noticesList">
    <div class="notice-item" onclick="showNoticeDetail('{id}', this)">
        <span class="notice-bullet">●</span>
        <div class="notice-title">공지사항 제목</div>
    </div>
    ...
</div>
```

---

### 4. showNoticeDetail() - 공지사항 상세 팝업

**위치:** Line ~8075

```javascript
async function showNoticeDetail(noticeId, clickedElement) {
    console.log('📄 공지사항 상세 보기:', noticeId);

    try {
        if (!supabaseClient) {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        // 공지사항 데이터 조회
        const { data: notice, error } = await supabaseClient
            .from('notices')
            .select('*')
            .eq('id', noticeId)
            .single();

        if (error) throw error;

        // XSS 방지
        const safeTitle = typeof DOMPurify !== 'undefined'
            ? DOMPurify.sanitize(notice.title, { ALLOWED_TAGS: [] })
            : notice.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const safeContent = typeof DOMPurify !== 'undefined'
            ? DOMPurify.sanitize(notice.content.replace(/\n/g, '<br>'), { ALLOWED_TAGS: ['br'] })
            : notice.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

        const createdDate = new Date(notice.created_at).toLocaleDateString('ko-KR');
        const importanceBadge = notice.important
            ? '<span style="...">중요</span>'
            : '';

        // 팝업 위치 계산 (클릭한 요소 근처)
        const rect = clickedElement.getBoundingClientRect();
        const modalWidth = 600;
        const idealModalHeight = 500;
        const spaceBelow = window.innerHeight - rect.bottom - 20;
        const spaceAbove = rect.top - 20;

        let modalTop, modalMaxHeight;

        if (spaceBelow >= 300) {
            // 아래쪽에 표시
            modalTop = rect.bottom + 10;
            modalMaxHeight = Math.min(idealModalHeight, spaceBelow - 10);
        } else if (spaceAbove >= 300) {
            // 위쪽에 표시
            modalMaxHeight = Math.min(idealModalHeight, spaceAbove - 10);
            modalTop = rect.top - modalMaxHeight - 10;
        } else {
            // 공간 부족 시 큰 쪽에 표시
            if (spaceBelow >= spaceAbove) {
                modalTop = rect.bottom + 10;
                modalMaxHeight = spaceBelow - 10;
            } else {
                modalMaxHeight = spaceAbove - 10;
                modalTop = rect.top - modalMaxHeight - 10;
            }
        }

        // 모달 생성
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${modalTop}px;
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: ${modalMaxHeight}px;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        `;

        modal.innerHTML = `
            <div style="padding: 24px; border-bottom: 1px solid #dee2e6;">
                <h3 style="margin: 0; font-size: 20px;">
                    📢 ${safeTitle}${importanceBadge}
                </h3>
                <div style="margin-top: 8px; font-size: 13px; color: #6c757d;">
                    작성일: ${createdDate}
                </div>
            </div>
            <div style="padding: 24px; line-height: 1.6;">
                ${safeContent}
            </div>
            <div style="padding: 16px 24px; border-top: 1px solid #dee2e6; text-align: right;">
                <button onclick="this.closest('.notice-modal-overlay').remove()"
                        style="padding: 8px 24px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    닫기
                </button>
            </div>
        `;

        overlay.className = 'notice-modal-overlay';
        overlay.appendChild(modal);
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        document.body.appendChild(overlay);

    } catch (error) {
        console.error('❌ 공지사항 상세 조회 오류:', error);
        alert('공지사항을 불러오는데 실패했습니다.');
    }
}
```

**핵심 로직:**

1. **데이터 조회**: Supabase에서 특정 ID 공지사항 조회
2. **XSS 방지**: DOMPurify로 제목/내용 sanitize
3. **위치 계산**: 클릭한 요소 근처에 팝업 배치
   - 아래쪽 공간 충분 → 아래에 표시
   - 위쪽 공간 충분 → 위에 표시
   - 최대 높이 500px 제한
4. **모달 생성**: 동적으로 overlay + modal 생성
5. **닫기 기능**: 배경 클릭 or 닫기 버튼

---

## 학습 콘텐츠 컴포넌트

### 1. loadAndRenderLearningContents() - 학습 콘텐츠 로드

**위치:** Line ~8206

```javascript
let allLearningContents = [];

async function loadAndRenderLearningContents() {
    console.log('📚 학습 콘텐츠 로드 시작 (Frontend)');

    try {
        if (!supabaseClient) {
            console.warn('⚠️ Supabase 클라이언트가 아직 초기화되지 않았습니다. 재시도 중...');
            setTimeout(loadAndRenderLearningContents, 1000);
            return;
        }

        const { data, error } = await supabaseClient
            .from('learning_contents')
            .select('*')
            .order('depth1')
            .order('depth2')
            .order('display_order');

        if (error) throw error;

        console.log('✅ 학습 콘텐츠 로드 성공:', data.length, '개');

        allLearningContents = data;
        renderLearningContentsTree(data);

    } catch (error) {
        console.error('❌ 학습 콘텐츠 로드 오류:', error);
    }
}
```

**기능:**
- 전체 학습 콘텐츠 조회 (정렬)
- 전역 변수 `allLearningContents`에 저장 (검색용)
- 트리 구조 렌더링

---

### 2. renderLearningContentsTree() - 트리 구조 렌더링

**위치:** Line ~8283

```javascript
function renderLearningContentsTree(contents) {
    const treeContainer = document.getElementById('learningContentsTree');

    if (!treeContainer) {
        console.error('❌ learningContentsTree 요소를 찾을 수 없습니다.');
        return;
    }

    if (!contents || contents.length === 0) {
        treeContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #6c757d;">등록된 학습 콘텐츠가 없습니다.</div>';
        return;
    }

    // Depth1 그룹화
    const depth1Groups = {};
    contents.forEach(item => {
        if (item.depth1) {
            if (!depth1Groups[item.depth1]) {
                depth1Groups[item.depth1] = [];
            }
            depth1Groups[item.depth1].push(item);
        }
    });

    // HTML 생성
    let html = '';

    Object.keys(depth1Groups).sort().forEach(depth1Name => {
        const depth1Items = depth1Groups[depth1Name];

        // Depth2 그룹화
        const depth2Groups = {};
        depth1Items.forEach(item => {
            if (item.depth2) {
                if (!depth2Groups[item.depth2]) {
                    depth2Groups[item.depth2] = [];
                }
                depth2Groups[item.depth2].push(item);
            }
        });

        html += `
            <div class="knowledge-item">
                <div class="knowledge-major" onclick="toggleKnowledge(this)">
                    <span class="knowledge-name">${depth1Name}</span>
                    <span class="knowledge-arrow">▶</span>
                </div>
                <div class="knowledge-medium-list">
        `;

        Object.keys(depth2Groups).sort().forEach(depth2Name => {
            const depth3Items = depth2Groups[depth2Name].filter(item => item.depth3);

            html += `
                <div class="knowledge-medium">
                    <div class="knowledge-medium-title" onclick="toggleMedium(this)">
                        <span class="knowledge-arrow">▶</span>
                        <span>${depth2Name}</span>
                    </div>
                    <div class="knowledge-minor-list">
            `;

            depth3Items.forEach(item => {
                html += `
                    <a href="${item.url}" target="_blank" class="knowledge-minor">
                        ${item.depth3}
                    </a>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    treeContainer.innerHTML = html;
}
```

**데이터 구조 변환:**
```
배열 데이터:
[
    { depth1: '웹개발 기초', depth2: 'HTML/CSS', depth3: 'HTML 기본 구조', ... },
    { depth1: '웹개발 기초', depth2: 'HTML/CSS', depth3: 'CSS 선택자', ... },
    ...
]

↓ 그룹화

객체 구조:
{
    '웹개발 기초': {
        'HTML/CSS': [
            { depth3: 'HTML 기본 구조', ... },
            { depth3: 'CSS 선택자', ... }
        ],
        'JavaScript': [...]
    },
    '앱개발': {...}
}
```

**HTML 출력:**
```html
<div class="knowledge-item">
    <div class="knowledge-major" onclick="toggleKnowledge(this)">
        <span class="knowledge-name">웹개발 기초</span>
        <span class="knowledge-arrow">▶</span>
    </div>
    <div class="knowledge-medium-list">
        <div class="knowledge-medium">
            <div class="knowledge-medium-title" onclick="toggleMedium(this)">
                <span class="knowledge-arrow">▶</span>
                <span>HTML/CSS</span>
            </div>
            <div class="knowledge-minor-list">
                <a href="..." class="knowledge-minor">HTML 기본 구조</a>
                <a href="..." class="knowledge-minor">CSS 선택자</a>
            </div>
        </div>
    </div>
</div>
```

---

### 3. searchLearningContents() - 검색 기능

**위치:** Line ~8368

```javascript
function searchLearningContents(query) {
    const searchInput = document.getElementById('learningSearchInput');
    const searchResults = document.getElementById('learningSearchResults');
    const contentsTree = document.getElementById('learningContentsTree');

    // 검색어 없으면 원래 트리 표시
    if (!query || query.trim() === '') {
        searchResults.style.display = 'none';
        contentsTree.style.display = 'block';
        searchInput.style.borderColor = '#dee2e6';
        return;
    }

    // 검색 실행
    const searchTerm = query.toLowerCase();
    const results = allLearningContents.filter(item => {
        return (item.depth1 && item.depth1.toLowerCase().includes(searchTerm)) ||
               (item.depth2 && item.depth2.toLowerCase().includes(searchTerm)) ||
               (item.depth3 && item.depth3.toLowerCase().includes(searchTerm)) ||
               (item.description && item.description.toLowerCase().includes(searchTerm));
    });

    // 검색 결과 표시
    let html = `
        <div style="background: rgba(245, 158, 11, 0.08); padding: 12px; border-radius: 6px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: #d97706;">
                🔍 검색 결과 (${results.length}개)
            </span>
            <button onclick="clearSearch()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #6c757d;">
                ×
            </button>
        </div>
    `;

    // Depth3만 표시 (실제 콘텐츠)
    results.filter(item => item.depth3).forEach(item => {
        html += `
            <div style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                <a href="${item.url}" target="_blank" style="text-decoration: none; color: #10B981; font-weight: 500;">
                    ${item.depth3}
                </a>
                <div style="font-size: 12px; color: #6c757d; margin-top: 4px;">
                    📂 ${item.depth1} > ${item.depth2}
                </div>
            </div>
        `;
    });

    if (results.filter(item => item.depth3).length === 0) {
        html += '<div style="padding: 20px; text-align: center; color: #6c757d;">검색 결과가 없습니다.</div>';
    }

    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
    contentsTree.style.display = 'none';
    searchInput.style.borderColor = '#F59E0B';
}

function clearSearch() {
    const searchInput = document.getElementById('learningSearchInput');
    searchInput.value = '';
    searchLearningContents('');
}
```

**기능:**
1. **실시간 검색**: `oninput` 이벤트로 입력 즉시 필터링
2. **다중 필드 검색**: depth1, depth2, depth3, description 모두 검색
3. **검색 결과 별도 표시**: 트리 숨기고 검색 결과만 표시
4. **경로 표시**: 결과에 `depth1 > depth2` 경로 표시
5. **초기화**: ✕ 버튼 또는 검색어 삭제 시 원래 트리 복원

---

## 공통 유틸리티

### 1. toggleKnowledge() - 대분류 접기/펼치기

```javascript
function toggleKnowledge(element) {
    const parent = element.closest('.knowledge-item');
    const mediumList = parent.querySelector('.knowledge-medium-list');
    const arrow = element.querySelector('.knowledge-arrow');

    if (mediumList.style.display === 'none' || !mediumList.style.display) {
        mediumList.style.display = 'block';
        arrow.textContent = '▼';
    } else {
        mediumList.style.display = 'none';
        arrow.textContent = '▶';
    }
}
```

### 2. toggleMedium() - 중분류 접기/펼치기

```javascript
function toggleMedium(element) {
    const parent = element.closest('.knowledge-medium');
    const minorList = parent.querySelector('.knowledge-minor-list');
    const arrow = element.querySelector('.knowledge-arrow');

    if (minorList.style.display === 'none' || !minorList.style.display) {
        minorList.style.display = 'block';
        arrow.textContent = '▼';
    } else {
        minorList.style.display = 'none';
        arrow.textContent = '▶';
    }
}
```

---

## 스타일 가이드

### 공지사항 스타일

```css
.notice-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 6px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
}

.notice-item:hover {
    background: #f8f9fa;
}

.notice-bullet {
    margin-right: 8px;
    font-size: 8px;
}

.notice-title {
    flex: 1;
    font-size: 13px;
    color: #495057;
}
```

### 학습 콘텐츠 스타일

```css
.knowledge-item {
    margin-bottom: 8px;
}

.knowledge-major {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    cursor: pointer;
}

.knowledge-major:hover {
    background: #e9ecef;
}

.knowledge-arrow {
    margin-right: 8px;
    font-size: 10px;
}

.knowledge-medium-list {
    display: none;
    padding-left: 16px;
    margin-top: 4px;
}

.knowledge-minor {
    display: block;
    padding: 6px 12px;
    color: #10B981;
    text-decoration: none;
    font-size: 13px;
}

.knowledge-minor:hover {
    background: rgba(16, 185, 129, 0.1);
}
```

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2025-12-02 | 1.0 | 초안 작성 | Claude Code |

---

**문서 끝**
