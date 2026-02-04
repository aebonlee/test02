/**
 * SSAL Works - Toast Component
 * @task S5F3-공통로직
 * @version 1.0.0
 * @description 토스트 알림 컴포넌트
 *
 * 제공 함수:
 * - showToast(message, type, duration): 토스트 표시
 * - hideToast(): 토스트 숨기기
 *
 * 사용법:
 * showToast('저장되었습니다', 'success');
 * showToast('오류가 발생했습니다', 'error');
 */

// 토스트 컨테이너 ID
const TOAST_CONTAINER_ID = 'toast-container';

// 기본 설정
const TOAST_DEFAULTS = {
    duration: 3000,
    position: 'top-right'
};

// 타입별 아이콘
const TOAST_ICONS = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
};

// 타입별 색상
const TOAST_COLORS = {
    success: { bg: '#d4edda', border: '#28a745', text: '#155724' },
    error: { bg: '#f8d7da', border: '#dc3545', text: '#721c24' },
    warning: { bg: '#fff3cd', border: '#ffc107', text: '#856404' },
    info: { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460' }
};

/**
 * 토스트 컨테이너 생성 (없으면)
 */
function ensureToastContainer() {
    let container = document.getElementById(TOAST_CONTAINER_ID);

    if (!container) {
        container = document.createElement('div');
        container.id = TOAST_CONTAINER_ID;
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    return container;
}

/**
 * 토스트 메시지 표시
 * @param {string} message - 메시지
 * @param {string} type - 타입 (success, error, warning, info)
 * @param {number} duration - 표시 시간 (ms)
 */
function showToast(message, type = 'info', duration = TOAST_DEFAULTS.duration) {
    const container = ensureToastContainer();
    const colors = TOAST_COLORS[type] || TOAST_COLORS.info;
    const icon = TOAST_ICONS[type] || TOAST_ICONS.info;

    // 토스트 요소 생성
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.style.cssText = `
        background: ${colors.bg};
        border: 1px solid ${colors.border};
        border-left: 4px solid ${colors.border};
        color: ${colors.text};
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 280px;
        max-width: 400px;
        font-size: 14px;
        font-weight: 500;
        pointer-events: auto;
        animation: toastSlideIn 0.3s ease;
        cursor: pointer;
    `;

    toast.innerHTML = `
        <span style="font-size: 18px;">${icon}</span>
        <span style="flex: 1;">${escapeHtmlForToast(message)}</span>
        <button onclick="this.parentElement.remove()" style="
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            opacity: 0.7;
            color: inherit;
        ">&times;</button>
    `;

    // 클릭 시 닫기
    toast.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            toast.remove();
        }
    });

    container.appendChild(toast);

    // 자동 제거
    if (duration > 0) {
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    return toast;
}

/**
 * 모든 토스트 숨기기
 */
function hideAllToasts() {
    const container = document.getElementById(TOAST_CONTAINER_ID);
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * HTML 이스케이프 (토스트용)
 */
function escapeHtmlForToast(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 스타일 주입 (애니메이션)
 */
function injectToastStyles() {
    if (document.getElementById('toast-styles')) return;

    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes toastSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes toastSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @media (max-width: 480px) {
            #${TOAST_CONTAINER_ID} {
                left: 10px;
                right: 10px;
                top: 10px;
            }

            .toast-item {
                min-width: auto !important;
                max-width: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// 초기화
document.addEventListener('DOMContentLoaded', injectToastStyles);

// 전역 노출
window.showToast = showToast;
window.hideAllToasts = hideAllToasts;

console.log('📦 toast.js 로드 완료');
