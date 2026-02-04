// Task ID: S2BI2
// Global Error Handler
// 전역 에러를 포착하고 토스트 알림을 통해 사용자에게 피드백 제공

(function() {
    'use strict';

    /**
     * 전역 에러 핸들러 초기화
     */
    function initGlobalErrorHandler() {
        // window.onerror: JavaScript 런타임 에러 처리
        window.onerror = function(message, source, lineno, colno, error) {
            console.error('Global Error:', {
                message,
                source,
                lineno,
                colno,
                error
            });

            // 개발 환경에서만 상세 에러 표시
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                showToast(
                    `에러 발생: ${message} (${source}:${lineno}:${colno})`,
                    'error',
                    5000
                );
            } else {
                // 프로덕션 환경에서는 일반 메시지
                showToast(
                    '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                    'error',
                    4000
                );
            }

            // true를 반환하면 브라우저의 기본 에러 처리를 막음
            return true;
        };

        // unhandledrejection: Promise rejection 처리
        window.addEventListener('unhandledrejection', function(event) {
            console.error('Unhandled Promise Rejection:', event.reason);

            let errorMessage = '요청 처리 중 오류가 발생했습니다.';

            // API 에러인 경우
            if (event.reason && event.reason.message) {
                errorMessage = event.reason.message;
            }

            showToast(errorMessage, 'error', 4000);

            // 기본 동작 방지 (콘솔 경고 제거)
            event.preventDefault();
        });

        console.log('Global error handler initialized');
    }

    /**
     * 에러 로그를 서버로 전송 (선택적)
     * @param {Object} errorData - 에러 데이터
     */
    function logErrorToServer(errorData) {
        // 향후 Sentry나 커스텀 로깅 서버로 전송
        // 현재는 콘솔 로그만 출력
        console.log('Error logged:', errorData);

        // 예시: 서버로 전송
        // fetch('/api/log-error', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(errorData)
        // }).catch(err => console.error('Failed to log error:', err));
    }

    /**
     * 커스텀 에러 처리 함수
     * @param {Error} error - 에러 객체
     * @param {string} context - 에러 발생 컨텍스트
     */
    window.handleError = function(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);

        const errorData = {
            message: error.message || 'Unknown error',
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // 서버로 에러 로그 전송
        logErrorToServer(errorData);

        // 사용자에게 피드백
        showToast(
            error.message || '오류가 발생했습니다.',
            'error',
            4000
        );
    };

    /**
     * API 에러 처리 헬퍼
     * @param {Response} response - Fetch API Response 객체
     * @param {string} context - 에러 발생 컨텍스트
     */
    window.handleApiError = function(response, context = 'API Request') {
        let errorMessage = '서버 요청 중 오류가 발생했습니다.';

        switch (response.status) {
            case 400:
                errorMessage = '잘못된 요청입니다.';
                break;
            case 401:
                errorMessage = '로그인이 필요합니다.';
                break;
            case 403:
                errorMessage = '접근 권한이 없습니다.';
                break;
            case 404:
                errorMessage = '요청한 리소스를 찾을 수 없습니다.';
                break;
            case 500:
                errorMessage = '서버 오류가 발생했습니다.';
                break;
            case 503:
                errorMessage = '서비스를 일시적으로 사용할 수 없습니다.';
                break;
        }

        console.error(`API Error (${response.status}) in ${context}`);
        showToast(errorMessage, 'error', 4000);

        return errorMessage;
    };

    /**
     * 네트워크 에러 처리
     * @param {Error} error - 네트워크 에러
     */
    window.handleNetworkError = function(error) {
        console.error('Network Error:', error);

        showToast(
            '네트워크 연결을 확인해주세요.',
            'error',
            4000
        );
    };

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalErrorHandler);
    } else {
        initGlobalErrorHandler();
    }
})();
