/**
 * SSAL Works - Loading Component
 * @task S5F3-공통로직
 * @version 1.0.0
 * @description 로딩 스피너 컴포넌트
 *
 * 제공 함수:
 * - showLoading(message): 로딩 표시
 * - hideLoading(): 로딩 숨기기
 * - withLoading(fn): 함수 실행 중 로딩 표시
 */

// 로딩 오버레이 ID
const LOADING_OVERLAY_ID = 'loading-overlay';

// 로딩 카운터 (중첩 호출 처리)
let loadingCount = 0;

/**
 * 로딩 오버레이 생성 (없으면)
 */
function ensureLoadingOverlay() {
    let overlay = document.getElementById(LOADING_OVERLAY_ID);

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = LOADING_OVERLAY_ID;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(2px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 99998;
            flex-direction: column;
            gap: 16px;
        `;

        overlay.innerHTML = `
            <div class="loading-spinner" style="
                width: 48px;
                height: 48px;
                border: 4px solid #e5e7eb;
                border-top-color: #0ea5a0;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            "></div>
            <div class="loading-message" style="
                font-size: 14px;
                color: #374151;
                font-weight: 500;
            ">로딩 중...</div>
        `;

        document.body.appendChild(overlay);

        // 스피너 애니메이션 스타일
        injectLoadingStyles();
    }

    return overlay;
}

/**
 * 로딩 스타일 주입
 */
function injectLoadingStyles() {
    if (document.getElementById('loading-styles')) return;

    const style = document.createElement('style');
    style.id = 'loading-styles';
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        #${LOADING_OVERLAY_ID}.fade-in {
            animation: fadeIn 0.2s ease;
        }

        #${LOADING_OVERLAY_ID}.fade-out {
            animation: fadeOut 0.2s ease forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * 로딩 표시
 * @param {string} message - 로딩 메시지 (선택)
 */
function showLoading(message = '로딩 중...') {
    loadingCount++;

    const overlay = ensureLoadingOverlay();
    const messageEl = overlay.querySelector('.loading-message');

    if (messageEl) {
        messageEl.textContent = message;
    }

    overlay.classList.remove('fade-out');
    overlay.classList.add('fade-in');
    overlay.style.display = 'flex';
}

/**
 * 로딩 숨기기
 */
function hideLoading() {
    loadingCount = Math.max(0, loadingCount - 1);

    if (loadingCount > 0) return; // 아직 로딩 중인 작업이 있음

    const overlay = document.getElementById(LOADING_OVERLAY_ID);
    if (overlay) {
        overlay.classList.remove('fade-in');
        overlay.classList.add('fade-out');
        setTimeout(() => {
            if (loadingCount === 0) {
                overlay.style.display = 'none';
            }
        }, 200);
    }
}

/**
 * 강제 로딩 숨기기 (모든 로딩 상태 초기화)
 */
function forceHideLoading() {
    loadingCount = 0;
    hideLoading();
}

/**
 * 함수 실행 중 로딩 표시
 * @param {Function} fn - 실행할 함수 (async 가능)
 * @param {string} message - 로딩 메시지
 * @returns {Promise<any>} 함수 결과
 */
async function withLoading(fn, message = '처리 중...') {
    showLoading(message);
    try {
        return await fn();
    } finally {
        hideLoading();
    }
}

/**
 * 인라인 로딩 스피너 생성
 * @param {string} size - 크기 (small, medium, large)
 * @returns {HTMLElement} 스피너 요소
 */
function createSpinner(size = 'medium') {
    const sizes = {
        small: { width: 16, border: 2 },
        medium: { width: 24, border: 3 },
        large: { width: 40, border: 4 }
    };

    const { width, border } = sizes[size] || sizes.medium;

    const spinner = document.createElement('span');
    spinner.className = 'inline-spinner';
    spinner.style.cssText = `
        display: inline-block;
        width: ${width}px;
        height: ${width}px;
        border: ${border}px solid #e5e7eb;
        border-top-color: #0ea5a0;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        vertical-align: middle;
    `;

    return spinner;
}

// 전역 노출
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.forceHideLoading = forceHideLoading;
window.withLoading = withLoading;
window.createSpinner = createSpinner;

console.log('📦 loading.js 로드 완료');
