// Task ID: S2BI2
// API Utility Functions
// API 호출을 위한 래퍼 함수 및 에러 핸들링 유틸리티

(function() {
    'use strict';

    /**
     * API 호출 래퍼 함수 (Fetch API 기반)
     * @param {string} url - API 엔드포인트 URL
     * @param {Object} options - Fetch API 옵션
     * @param {Object} config - 추가 설정
     * @returns {Promise<any>} - API 응답 데이터
     */
    window.apiCall = async function(url, options = {}, config = {}) {
        const {
            showLoading = false,
            showSuccessToast = false,
            successMessage = '요청이 완료되었습니다.',
            showErrorToast = true,
            timeout = 30000, // 30초 기본 타임아웃
            retries = 0,
            retryDelay = 1000
        } = config;

        // 로딩 표시 (선택적)
        if (showLoading && typeof window.showLoading === 'function') {
            window.showLoading();
        }

        try {
            // 타임아웃 처리
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const fetchOptions = {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };

            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);

            // 로딩 종료
            if (showLoading && typeof window.hideLoading === 'function') {
                window.hideLoading();
            }

            // HTTP 에러 체크
            if (!response.ok) {
                // 재시도 로직
                if (retries > 0 && shouldRetry(response.status)) {
                    console.log(`Retrying... (${retries} attempts left)`);
                    await delay(retryDelay);
                    return apiCall(url, options, {
                        ...config,
                        retries: retries - 1,
                        retryDelay: retryDelay * 2 // Exponential backoff
                    });
                }

                throw await handleHttpError(response);
            }

            // 응답 파싱
            const data = await parseResponse(response);

            // 성공 토스트 표시 (선택적)
            if (showSuccessToast) {
                window.showSuccessToast(successMessage);
            }

            return data;

        } catch (error) {
            // 로딩 종료
            if (showLoading && typeof window.hideLoading === 'function') {
                window.hideLoading();
            }

            // 에러 처리
            if (error.name === 'AbortError') {
                const timeoutError = new Error('요청 시간이 초과되었습니다.');
                if (showErrorToast) {
                    window.showErrorToast(timeoutError.message);
                }
                throw timeoutError;
            }

            if (showErrorToast) {
                window.showErrorToast(error.message || '요청 처리 중 오류가 발생했습니다.');
            }

            throw error;
        }
    };

    /**
     * HTTP 에러 처리
     * @param {Response} response - Fetch API Response 객체
     * @returns {Promise<Error>} - 에러 객체
     */
    async function handleHttpError(response) {
        let errorMessage = '서버 요청 중 오류가 발생했습니다.';
        let errorDetails = null;

        try {
            errorDetails = await response.json();
            errorMessage = errorDetails.message || errorDetails.error || errorMessage;
        } catch {
            // JSON 파싱 실패 시 기본 메시지 사용
        }

        // HTTP 상태 코드별 메시지
        switch (response.status) {
            case 400:
                errorMessage = errorDetails?.message || '잘못된 요청입니다.';
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
            case 409:
                errorMessage = errorDetails?.message || '충돌이 발생했습니다.';
                break;
            case 422:
                errorMessage = errorDetails?.message || '유효하지 않은 데이터입니다.';
                break;
            case 429:
                errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
                break;
            case 500:
                errorMessage = '서버 오류가 발생했습니다.';
                break;
            case 502:
                errorMessage = '게이트웨이 오류가 발생했습니다.';
                break;
            case 503:
                errorMessage = '서비스를 일시적으로 사용할 수 없습니다.';
                break;
            case 504:
                errorMessage = '게이트웨이 시간 초과입니다.';
                break;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.details = errorDetails;
        return error;
    }

    /**
     * 응답 파싱
     * @param {Response} response - Fetch API Response 객체
     * @returns {Promise<any>} - 파싱된 데이터
     */
    async function parseResponse(response) {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        if (contentType && contentType.includes('text/')) {
            return await response.text();
        }

        return await response.blob();
    }

    /**
     * 재시도 가능한 상태 코드 확인
     * @param {number} status - HTTP 상태 코드
     * @returns {boolean} - 재시도 가능 여부
     */
    function shouldRetry(status) {
        return status >= 500 || status === 429;
    }

    /**
     * 딜레이 함수
     * @param {number} ms - 밀리초
     * @returns {Promise<void>}
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * GET 요청 단축 함수
     */
    window.apiGet = function(url, config = {}) {
        return apiCall(url, { method: 'GET' }, config);
    };

    /**
     * POST 요청 단축 함수
     */
    window.apiPost = function(url, data = {}, config = {}) {
        return apiCall(url, {
            method: 'POST',
            body: JSON.stringify(data)
        }, config);
    };

    /**
     * PUT 요청 단축 함수
     */
    window.apiPut = function(url, data = {}, config = {}) {
        return apiCall(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        }, config);
    };

    /**
     * PATCH 요청 단축 함수
     */
    window.apiPatch = function(url, data = {}, config = {}) {
        return apiCall(url, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }, config);
    };

    /**
     * DELETE 요청 단축 함수
     */
    window.apiDelete = function(url, config = {}) {
        return apiCall(url, { method: 'DELETE' }, config);
    };

    console.log('API utilities initialized');
})();
