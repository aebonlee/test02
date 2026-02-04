/**
 * @task S4F3
 * @description 크레딧 충전 UI - 패키지 선택 및 결제 처리 로직
 */

import { createClient } from './supabase-client.js';

// 패키지 정보
const PACKAGES = {
    basic: {
        name: '베이직',
        credits: 1000,
        price: 10000,
        bonus: 0
    },
    standard: {
        name: '스탠다드',
        credits: 5000,
        price: 45000,
        bonus: 500
    },
    premium: {
        name: '프리미엄',
        credits: 10000,
        price: 80000,
        bonus: 2000
    }
};

// 전역 변수
let supabase;
let paymentWidget;
let selectedPackage = null;
let currentUser = null;

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

        // 현재 크레딧 잔액 로드
        await loadCurrentCredits();

        // 패키지 선택 이벤트 리스너
        setupPackageSelection();

        // 취소 버튼
        document.getElementById('cancelButton').addEventListener('click', resetSelection);

        // 결제 버튼
        document.getElementById('payButton').addEventListener('click', handlePayment);

    } catch (error) {
        console.error('초기화 오류:', error);
        alert('페이지 로드 중 오류가 발생했습니다.');
    }
});

// 현재 크레딧 잔액 로드
async function loadCurrentCredits() {
    try {
        const { data, error } = await supabase
            .from('user_credits')
            .select('balance')
            .eq('user_id', currentUser.id)
            .single();

        if (error) throw error;

        const balance = data?.balance || 0;
        document.getElementById('currentCredits').textContent = balance.toLocaleString();
    } catch (error) {
        console.error('크레딧 잔액 로드 오류:', error);
        document.getElementById('currentCredits').textContent = '0';
    }
}

// 패키지 선택 이벤트 설정
function setupPackageSelection() {
    const selectButtons = document.querySelectorAll('.select-button');
    selectButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const packageType = e.target.dataset.package;
            await selectPackage(packageType);
        });
    });
}

// 패키지 선택 처리
async function selectPackage(packageType) {
    try {
        selectedPackage = packageType;
        const pkg = PACKAGES[packageType];

        // 모든 카드에서 selected 클래스 제거
        document.querySelectorAll('.package-card').forEach(card => {
            card.classList.remove('selected');
        });

        // 선택한 카드에 selected 클래스 추가
        document.querySelector(`[data-package="${packageType}"]`).classList.add('selected');

        // 결제 요약 업데이트
        updatePaymentSummary(pkg);

        // 토스페이먼츠 위젯 초기화
        await initializePaymentWidget(pkg);

        // UI 표시
        document.getElementById('paymentSummary').style.display = 'block';
        document.getElementById('paymentWidgetSection').style.display = 'block';
        document.getElementById('paymentActions').style.display = 'flex';

        // 스크롤 이동
        document.getElementById('paymentSummary').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('패키지 선택 오류:', error);
        alert('패키지 선택 중 오류가 발생했습니다.');
    }
}

// 결제 요약 업데이트
function updatePaymentSummary(pkg) {
    document.getElementById('selectedPackageName').textContent = pkg.name;
    document.getElementById('selectedCredits').textContent = `${pkg.credits.toLocaleString()} 크레딧`;
    document.getElementById('selectedBonus').textContent = `+${pkg.bonus.toLocaleString()} 크레딧`;
    document.getElementById('totalCredits').textContent = `${(pkg.credits + pkg.bonus).toLocaleString()} 크레딧`;
    document.getElementById('totalPrice').textContent = `${pkg.price.toLocaleString()}원`;
}

// 토스페이먼츠 위젯 초기화
async function initializePaymentWidget(pkg) {
    try {
        // 환경 변수에서 클라이언트 키 가져오기
        const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || process.env.TOSS_CLIENT_KEY;

        if (!clientKey) {
            throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.');
        }

        // 기존 위젯이 있으면 제거
        const widgetContainer = document.getElementById('payment-widget');
        widgetContainer.innerHTML = '';

        // 위젯 초기화
        paymentWidget = TossPayments(clientKey);

        // 결제 위젯 렌더링
        await paymentWidget.renderPaymentMethods(
            '#payment-widget',
            { value: pkg.price },
            { variantKey: 'DEFAULT' }
        );

        // 이용약관 렌더링
        await paymentWidget.renderAgreement('#agreement');

        // 결제 버튼 활성화
        document.getElementById('payButton').disabled = false;

    } catch (error) {
        console.error('토스페이먼츠 위젯 초기화 오류:', error);
        alert('결제 위젯 초기화에 실패했습니다. 페이지를 새로고침 해주세요.');
        document.getElementById('payButton').disabled = true;
    }
}

// 결제 처리
async function handlePayment() {
    try {
        if (!selectedPackage || !paymentWidget) {
            alert('패키지를 먼저 선택해주세요.');
            return;
        }

        const pkg = PACKAGES[selectedPackage];

        // 로딩 표시
        showLoading(true);

        // 주문 ID 생성 (고유한 값)
        const orderId = `credit_${currentUser.id}_${Date.now()}`;

        // 결제 요청
        await paymentWidget.requestPayment({
            orderId: orderId,
            orderName: `SSAL 크레딧 충전 - ${pkg.name}`,
            customerName: currentUser.user_metadata?.full_name || currentUser.email,
            customerEmail: currentUser.email,
            successUrl: `${window.location.origin}/pages/subscription/credit-success.html`,
            failUrl: `${window.location.origin}/pages/subscription/credit-purchase.html?error=payment_failed`
        });

    } catch (error) {
        console.error('결제 요청 오류:', error);
        showLoading(false);

        if (error.code === 'USER_CANCEL') {
            alert('결제가 취소되었습니다.');
        } else {
            alert('결제 요청 중 오류가 발생했습니다.');
        }
    }
}

// 선택 초기화
function resetSelection() {
    selectedPackage = null;
    paymentWidget = null;

    // UI 초기화
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
    });

    document.getElementById('paymentSummary').style.display = 'none';
    document.getElementById('paymentWidgetSection').style.display = 'none';
    document.getElementById('paymentActions').style.display = 'none';
    document.getElementById('payButton').disabled = true;

    // 위젯 컨테이너 초기화
    document.getElementById('payment-widget').innerHTML = '';
    document.getElementById('agreement').innerHTML = '';

    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 로딩 표시
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// URL 파라미터에서 에러 확인
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error === 'payment_failed') {
        alert('결제에 실패했습니다. 다시 시도해주세요.');
        // URL에서 에러 파라미터 제거
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
