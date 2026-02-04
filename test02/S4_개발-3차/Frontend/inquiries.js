/**
 * @task S4F6
 * @description My Page 문의 관리 - JavaScript
 */

// Supabase 설정
const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2OTI3MTEsImV4cCI6MjA0ODI2ODcxMX0.bMRNdLzuPWqEATXhM78K-mk7G_8xnKPLhR8tOxP1wKE';

let supabase = null;
let currentUser = null;

// 페이지 초기화
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Supabase 클라이언트 초기화
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // 사용자 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            alert('로그인이 필요합니다.');
            window.location.href = '/Frontend/Pages/auth/signup.html';
            return;
        }

        currentUser = session.user;

        // 문의 목록 로드
        await loadInquiries();

    } catch (error) {
        console.error('초기화 오류:', error);
        showError('페이지를 불러오는 중 오류가 발생했습니다.');
    }
});

// 문의 목록 로드
async function loadInquiries() {
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const inquiriesList = document.getElementById('inquiriesList');

    try {
        loadingState.style.display = 'flex';
        emptyState.style.display = 'none';
        inquiriesList.style.display = 'none';

        const { data: inquiries, error } = await supabase
            .from('inquiries')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

        loadingState.style.display = 'none';

        if (error) throw error;

        if (!inquiries || inquiries.length === 0) {
            emptyState.style.display = 'flex';
            return;
        }

        inquiriesList.style.display = 'flex';
        renderInquiries(inquiries);

    } catch (error) {
        loadingState.style.display = 'none';
        console.error('문의 목록 로드 오류:', error);
        showError('문의 목록을 불러오는 중 오류가 발생했습니다.');
    }
}

// 문의 목록 렌더링
function renderInquiries(inquiries) {
    const inquiriesList = document.getElementById('inquiriesList');

    const statusLabels = {
        'pending': '대기',
        'in_progress': '처리중',
        'answered': '완료'
    };

    const statusClasses = {
        'pending': 'pending',
        'in_progress': 'in-progress',
        'answered': 'answered'
    };

    const categoryLabels = {
        'general': '일반 문의',
        'technical': '기술 지원',
        'billing': '결제/환불',
        'subscription': '구독 관련',
        'other': '기타'
    };

    inquiriesList.innerHTML = inquiries.map(inquiry => `
        <div class="inquiry-card" onclick="openInquiryDetail('${inquiry.id}')">
            <div class="inquiry-card-header">
                <div class="inquiry-title">${escapeHtml(inquiry.title)}</div>
                <span class="status-badge ${statusClasses[inquiry.status] || 'pending'}">
                    ${statusLabels[inquiry.status] || '대기'}
                </span>
            </div>
            <div class="inquiry-card-body">
                <div class="inquiry-preview">${escapeHtml(inquiry.content)}</div>
            </div>
            <div class="inquiry-card-footer">
                <span class="inquiry-category">${categoryLabels[inquiry.category] || inquiry.category || '일반 문의'}</span>
                <span class="inquiry-date">${formatDate(inquiry.created_at)}</span>
            </div>
        </div>
    `).join('');
}

// 문의 상세 보기
async function openInquiryDetail(inquiryId) {
    const modal = document.getElementById('inquiryDetailModal');
    const content = document.getElementById('inquiryDetailContent');

    try {
        showLoading();

        const { data: inquiry, error } = await supabase
            .from('inquiries')
            .select('*')
            .eq('id', inquiryId)
            .eq('user_id', currentUser.id)
            .single();

        hideLoading();

        if (error) throw error;

        const statusLabels = {
            'pending': '대기',
            'in_progress': '처리중',
            'answered': '완료'
        };

        const statusClasses = {
            'pending': 'pending',
            'in_progress': 'in-progress',
            'answered': 'answered'
        };

        const categoryLabels = {
            'general': '일반 문의',
            'technical': '기술 지원',
            'billing': '결제/환불',
            'subscription': '구독 관련',
            'other': '기타'
        };

        content.innerHTML = `
            <div class="inquiry-detail-header">
                <div class="inquiry-detail-title">${escapeHtml(inquiry.title)}</div>
                <div class="inquiry-detail-meta">
                    <span class="inquiry-category">${categoryLabels[inquiry.category] || inquiry.category || '일반 문의'}</span>
                    <span class="status-badge ${statusClasses[inquiry.status] || 'pending'}">
                        ${statusLabels[inquiry.status] || '대기'}
                    </span>
                    <span class="inquiry-date">${formatDate(inquiry.created_at)}</span>
                </div>
            </div>

            <div class="inquiry-detail-content">${escapeHtml(inquiry.content)}</div>

            <div class="inquiry-answer-section">
                <h4>📬 답변</h4>
                ${inquiry.answer ? `
                    <div class="inquiry-answer-content">${escapeHtml(inquiry.answer)}</div>
                    <div class="inquiry-answer-meta">
                        ${inquiry.answered_at ? formatDate(inquiry.answered_at) : ''}
                    </div>
                ` : `
                    <div class="no-answer">
                        아직 답변이 등록되지 않았습니다.<br>
                        빠른 시일 내에 답변 드리겠습니다.
                    </div>
                `}
            </div>
        `;

        modal.style.display = 'flex';

    } catch (error) {
        hideLoading();
        console.error('문의 상세 로드 오류:', error);
        showError('문의 내용을 불러오는 중 오류가 발생했습니다.');
    }
}

// 문의 상세 모달 닫기
function closeInquiryDetailModal() {
    document.getElementById('inquiryDetailModal').style.display = 'none';
}

// 새 문의 모달 열기
function openNewInquiryModal() {
    document.getElementById('newInquiryModal').style.display = 'flex';
    document.getElementById('newInquiryForm').reset();
}

// 새 문의 모달 닫기
function closeNewInquiryModal() {
    document.getElementById('newInquiryModal').style.display = 'none';
}

// 문의 등록
async function submitInquiry() {
    const category = document.getElementById('inquiryCategory').value;
    const title = document.getElementById('inquiryTitle').value.trim();
    const content = document.getElementById('inquiryContent').value.trim();

    if (!category) {
        alert('문의 유형을 선택해주세요.');
        return;
    }

    if (!title) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (!content) {
        alert('내용을 입력해주세요.');
        return;
    }

    try {
        showLoading();

        const { error } = await supabase
            .from('inquiries')
            .insert({
                user_id: currentUser.id,
                user_email: currentUser.email,
                category: category,
                title: title,
                content: content,
                status: 'pending'
            });

        hideLoading();

        if (error) throw error;

        // 관리자에게 이메일 알림 (설정에서 켜져있을 경우)
        try {
            await fetch('https://www.ssalworks.ai.kr/api/Backend_APIs/admin-notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'inquiry',
                    data: {
                        email: currentUser.email,
                        category: category,
                        title: title,
                        content: content
                    }
                })
            });
        } catch (notifyErr) {
            console.log('관리자 알림 발송 실패:', notifyErr.message);
        }

        closeNewInquiryModal();
        alert('문의가 등록되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
        await loadInquiries();

    } catch (error) {
        hideLoading();
        console.error('문의 등록 오류:', error);
        alert('문의 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
}

// 유틸리티 함수들
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showError(message) {
    const loadingState = document.getElementById('loadingState');
    loadingState.innerHTML = `
        <div class="empty-icon">⚠️</div>
        <h3>오류 발생</h3>
        <p>${message}</p>
    `;
    loadingState.style.display = 'flex';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 전역 함수로 노출
window.openInquiryDetail = openInquiryDetail;
window.closeInquiryDetailModal = closeInquiryDetailModal;
window.openNewInquiryModal = openNewInquiryModal;
window.closeNewInquiryModal = closeNewInquiryModal;
window.submitInquiry = submitInquiry;
