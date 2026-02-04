/**
 * @task S4F4
 * @description 결제 수단 등록 UI - 빌링키 발급 및 관리 로직
 */

import { createClient } from './supabase-client.js';

// 전역 변수
let supabase;
let paymentWidget;
let currentUser = null;
let paymentMethods = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Supabase 클라이언트 초기화
        supabase = createClient();

        // 사용자 인증 확인
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            alert('로그인이 필요합니다.');
            window.location.href = '../auth/google-login.html';
            return;
        }
        currentUser = user;

        // 결제 수단 목록 로드
        await loadPaymentMethods();

        // 이벤트 리스너 설정
        setupEventListeners();

    } catch (error) {
        console.error('초기화 오류:', error);
        alert('페이지 로드 중 오류가 발생했습니다.');
    }
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 새 결제 수단 등록 버튼
    document.getElementById('addPaymentButton').addEventListener('click', openModal);

    // 모달 닫기
    document.getElementById('modalCloseButton').addEventListener('click', closeModal);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') closeModal();
    });

    // 등록 버튼
    document.getElementById('registerButton').addEventListener('click', handleRegister);
}

// 결제 수단 목록 로드
async function loadPaymentMethods() {
    try {
        showLoading(true);

        const { data, error } = await supabase
            .from('user_payment_methods')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        paymentMethods = data || [];
        renderPaymentMethods();

    } catch (error) {
        console.error('결제 수단 로드 오류:', error);
        showError('결제 수단을 불러오는데 실패했습니다.');
    } finally {
        showLoading(false);
    }
}

// 결제 수단 렌더링
function renderPaymentMethods() {
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const grid = document.getElementById('paymentMethodsGrid');

    loadingState.style.display = 'none';

    if (paymentMethods.length === 0) {
        emptyState.style.display = 'flex';
        grid.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    grid.style.display = 'grid';
    grid.innerHTML = '';

    paymentMethods.forEach(method => {
        const card = createPaymentMethodCard(method);
        grid.appendChild(card);
    });
}

// 결제 수단 카드 생성
function createPaymentMethodCard(method) {
    const card = document.createElement('div');
    card.className = 'payment-method-card';
    if (method.is_default) {
        card.classList.add('default');
    }

    const cardBrand = getCardBrandIcon(method.card_brand || method.method_type);
    const maskedNumber = method.card_last4 ? `•••• ${method.card_last4}` : '••••';
    const expiryDisplay = method.card_expiry ? `${method.card_expiry}` : '';

    card.innerHTML = `
        ${method.is_default ? '<div class="default-badge">기본 결제 수단</div>' : ''}
        <div class="card-header">
            <div class="card-brand">${cardBrand}</div>
            <button class="delete-button" data-id="${method.id}" title="삭제">
                <span>&times;</span>
            </button>
        </div>
        <div class="card-body">
            <div class="card-number">${maskedNumber}</div>
            ${expiryDisplay ? `<div class="card-expiry">유효기간: ${expiryDisplay}</div>` : ''}
            <div class="card-type">${getMethodTypeLabel(method.method_type)}</div>
        </div>
        <div class="card-footer">
            ${!method.is_default ? `
                <button class="set-default-button" data-id="${method.id}">
                    기본 결제 수단으로 설정
                </button>
            ` : ''}
        </div>
    `;

    // 삭제 버튼 이벤트
    const deleteBtn = card.querySelector('.delete-button');
    deleteBtn.addEventListener('click', () => handleDelete(method.id, method.is_default));

    // 기본 설정 버튼 이벤트
    const setDefaultBtn = card.querySelector('.set-default-button');
    if (setDefaultBtn) {
        setDefaultBtn.addEventListener('click', () => handleSetDefault(method.id));
    }

    return card;
}

// 카드 브랜드 아이콘
function getCardBrandIcon(brand) {
    const icons = {
        'VISA': '💳 Visa',
        'MASTER': '💳 Mastercard',
        'AMEX': '💳 American Express',
        'JCB': '💳 JCB',
        'CARD': '💳 카드',
        'BANK': '🏦 계좌'
    };
    return icons[brand?.toUpperCase()] || '💳 카드';
}

// 결제 수단 타입 레이블
function getMethodTypeLabel(type) {
    const labels = {
        'CARD': '신용/체크카드',
        'BANK': '계좌이체',
        'BILLING': '자동결제'
    };
    return labels[type?.toUpperCase()] || '결제 수단';
}

// 모달 열기
async function openModal() {
    try {
        const modal = document.getElementById('modalOverlay');
        modal.style.display = 'flex';

        // 토스 빌링 위젯 초기화
        await initializeBillingWidget();

    } catch (error) {
        console.error('모달 열기 오류:', error);
        alert('결제 수단 등록 화면을 여는데 실패했습니다.');
        closeModal();
    }
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.style.display = 'none';

    // 위젯 초기화
    document.getElementById('payment-widget').innerHTML = '';
    document.getElementById('agreement').innerHTML = '';
    document.getElementById('registerButton').disabled = true;
    paymentWidget = null;
}

// 토스 빌링 위젯 초기화
async function initializeBillingWidget() {
    try {
        // 환경 변수에서 클라이언트 키 가져오기
        const clientKey = import.meta.env?.VITE_TOSS_CLIENT_KEY ||
                         process.env?.TOSS_CLIENT_KEY ||
                         'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'; // 테스트 키

        // 위젯 초기화
        paymentWidget = TossPayments(clientKey);

        // 빌링 위젯 렌더링 (variantKey: 'BILLING')
        await paymentWidget.renderPaymentMethods(
            '#payment-widget',
            { value: 0 }, // 빌링키 발급 시 금액은 0
            { variantKey: 'BILLING' }
        );

        // 이용약관 렌더링
        await paymentWidget.renderAgreement('#agreement');

        // 등록 버튼 활성화
        document.getElementById('registerButton').disabled = false;

    } catch (error) {
        console.error('토스 빌링 위젯 초기화 오류:', error);
        alert('결제 위젯 초기화에 실패했습니다.');
        document.getElementById('registerButton').disabled = true;
    }
}

// 결제 수단 등록 처리
async function handleRegister() {
    try {
        if (!paymentWidget) {
            alert('결제 위젯이 초기화되지 않았습니다.');
            return;
        }

        showLoadingOverlay(true);

        // 고유 customerKey 생성 (사용자 ID 기반)
        const customerKey = `customer_${currentUser.id}`;

        // 빌링키 발급 요청
        const billingResult = await paymentWidget.requestBillingAuth({
            customerKey: customerKey,
            customerName: currentUser.user_metadata?.full_name || currentUser.email,
            customerEmail: currentUser.email,
            successUrl: `${window.location.origin}/pages/mypage/payment-methods.html?success=true`,
            failUrl: `${window.location.origin}/pages/mypage/payment-methods.html?error=billing_failed`
        });

        // 성공 시 여기서는 실행되지 않고 successUrl로 리다이렉트됩니다

    } catch (error) {
        console.error('빌링키 발급 오류:', error);
        showLoadingOverlay(false);

        if (error.code === 'USER_CANCEL') {
            alert('결제 수단 등록이 취소되었습니다.');
        } else {
            alert('결제 수단 등록 중 오류가 발생했습니다.');
        }
    }
}

// 기본 결제 수단 설정
async function handleSetDefault(methodId) {
    try {
        if (!confirm('이 결제 수단을 기본 결제 수단으로 설정하시겠습니까?')) {
            return;
        }

        showLoadingOverlay(true);

        // 모든 결제 수단의 is_default를 false로 설정
        await supabase
            .from('user_payment_methods')
            .update({ is_default: false })
            .eq('user_id', currentUser.id);

        // 선택한 결제 수단을 기본으로 설정
        const { error } = await supabase
            .from('user_payment_methods')
            .update({ is_default: true })
            .eq('id', methodId);

        if (error) throw error;

        alert('기본 결제 수단이 설정되었습니다.');
        await loadPaymentMethods();

    } catch (error) {
        console.error('기본 결제 수단 설정 오류:', error);
        alert('기본 결제 수단 설정에 실패했습니다.');
    } finally {
        showLoadingOverlay(false);
    }
}

// 결제 수단 삭제
async function handleDelete(methodId, isDefault) {
    try {
        if (isDefault) {
            alert('기본 결제 수단은 삭제할 수 없습니다. 다른 결제 수단을 기본으로 설정한 후 삭제해주세요.');
            return;
        }

        if (!confirm('이 결제 수단을 삭제하시겠습니까?')) {
            return;
        }

        showLoadingOverlay(true);

        const { error } = await supabase
            .from('user_payment_methods')
            .delete()
            .eq('id', methodId);

        if (error) throw error;

        alert('결제 수단이 삭제되었습니다.');
        await loadPaymentMethods();

    } catch (error) {
        console.error('결제 수단 삭제 오류:', error);
        alert('결제 수단 삭제에 실패했습니다.');
    } finally {
        showLoadingOverlay(false);
    }
}

// 로딩 상태 표시
function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    if (show) {
        loadingState.style.display = 'flex';
    } else {
        loadingState.style.display = 'none';
    }
}

// 로딩 오버레이 표시
function showLoadingOverlay(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// 에러 표시
function showError(message) {
    alert(message);
}

// URL 파라미터 처리 (빌링키 발급 성공/실패 콜백)
window.addEventListener('load', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const authKey = urlParams.get('authKey');
    const customerKey = urlParams.get('customerKey');

    if (success === 'true' && authKey) {
        // 빌링키 발급 성공 - 서버에 저장 필요
        try {
            showLoadingOverlay(true);

            // TODO: 백엔드 API를 통해 빌링키를 실제 발급받고 저장
            // 현재는 authKey를 임시로 저장
            const { error: saveError } = await supabase
                .from('user_payment_methods')
                .insert({
                    user_id: currentUser.id,
                    billing_key: authKey,
                    customer_key: customerKey,
                    method_type: 'BILLING',
                    is_default: paymentMethods.length === 0 // 첫 결제 수단이면 기본으로 설정
                });

            if (saveError) throw saveError;

            alert('결제 수단이 등록되었습니다.');

            // URL 파라미터 제거하고 페이지 새로고침
            window.history.replaceState({}, document.title, window.location.pathname);
            await loadPaymentMethods();

        } catch (err) {
            console.error('빌링키 저장 오류:', err);
            alert('결제 수단 저장에 실패했습니다.');
        } finally {
            showLoadingOverlay(false);
        }
    } else if (error === 'billing_failed') {
        alert('결제 수단 등록에 실패했습니다. 다시 시도해주세요.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
