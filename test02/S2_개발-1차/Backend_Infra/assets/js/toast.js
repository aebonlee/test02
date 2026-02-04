// Task ID: S2BI2
// Toast Notification System
// 사용자에게 피드백을 제공하는 토스트 알림 시스템

(function() {
    'use strict';

    /**
     * 토스트 컨테이너 생성 및 초기화
     */
    function initToastContainer() {
        if (document.getElementById('toast-container')) {
            return; // 이미 존재하면 생성하지 않음
        }

        const container = document.createElement('div');
        container.id = 'toast-container';
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Notifications');
        document.body.appendChild(container);
    }

    /**
     * 토스트 알림 표시
     * @param {string} message - 표시할 메시지
     * @param {string} type - 토스트 타입 (success, error, warning, info)
     * @param {number} duration - 표시 시간 (밀리초, 기본값: 3000)
     * @param {Object} options - 추가 옵션
     * @returns {HTMLElement} - 생성된 토스트 요소
     */
    window.showToast = function(message, type = 'info', duration = 3000, options = {}) {
        // 토스트 컨테이너 확인
        initToastContainer();

        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        // 아이콘 선택
        const icon = getToastIcon(type);

        // 토스트 내용 구성
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="닫기" title="닫기">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;

        // 닫기 버튼 이벤트
        const closeButton = toast.querySelector('.toast-close');
        closeButton.addEventListener('click', () => {
            hideToast(toast);
        });

        // 토스트 추가 (애니메이션을 위해 약간의 딜레이)
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // 자동 닫기 (duration이 0이면 자동 닫기 안 함)
        if (duration > 0) {
            setTimeout(() => {
                hideToast(toast);
            }, duration);
        }

        return toast;
    };

    /**
     * 토스트 숨기기
     * @param {HTMLElement} toast - 숨길 토스트 요소
     */
    function hideToast(toast) {
        toast.classList.remove('show');
        toast.classList.add('hide');

        // 애니메이션 완료 후 DOM에서 제거
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /**
     * 타입에 따른 아이콘 반환
     * @param {string} type - 토스트 타입
     * @returns {string} - SVG 아이콘
     */
    function getToastIcon(type) {
        switch (type) {
            case 'success':
                return `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            case 'error':
                return `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `;
            case 'warning':
                return `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                        <path d="M12 10V14M12 18H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `;
            case 'info':
            default:
                return `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `;
        }
    }

    /**
     * 모든 토스트 제거
     */
    window.clearAllToasts = function() {
        const container = document.getElementById('toast-container');
        if (container) {
            const toasts = container.querySelectorAll('.toast');
            toasts.forEach(toast => hideToast(toast));
        }
    };

    /**
     * 토스트 단축 함수들
     */
    window.showSuccessToast = function(message, duration = 3000) {
        return showToast(message, 'success', duration);
    };

    window.showErrorToast = function(message, duration = 4000) {
        return showToast(message, 'error', duration);
    };

    window.showWarningToast = function(message, duration = 3500) {
        return showToast(message, 'warning', duration);
    };

    window.showInfoToast = function(message, duration = 3000) {
        return showToast(message, 'info', duration);
    };

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToastContainer);
    } else {
        initToastContainer();
    }

    console.log('Toast notification system initialized');
})();
