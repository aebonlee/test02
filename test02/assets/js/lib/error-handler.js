/**
 * @task S1BI2
 *
 * Global Error Handler
 * 전역 에러 핸들러 (클라이언트 사이드)
 */

/**
 * 전역 에러 핸들러 초기화
 * @param {Object} sentryClient - SentryClient 인스턴스
 */
function initGlobalErrorHandler(sentryClient) {
  if (!sentryClient) {
    console.warn('[Error Handler] SentryClient not provided');
    return;
  }

  // 동기 에러 핸들러 (window.onerror)
  window.addEventListener('error', (event) => {
    handleError(event.error || event.message, event, sentryClient);
  });

  // 비동기 에러 핸들러 (unhandledrejection)
  window.addEventListener('unhandledrejection', (event) => {
    handleUnhandledRejection(event, sentryClient);
  });

  console.log('[Error Handler] Global error handlers initialized');
}

/**
 * 동기 에러 처리
 * @param {Error|string} error - 에러 객체 또는 메시지
 * @param {Event} event - 에러 이벤트
 * @param {Object} sentryClient - SentryClient 인스턴스
 */
function handleError(error, event, sentryClient) {
  // 에러 정보 수집
  const errorInfo = {
    message: error?.message || error,
    stack: error?.stack,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // 콘솔에 출력 (개발 환경)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.error('[Global Error Handler]', errorInfo);
  }

  // Sentry에 전송
  try {
    sentryClient.captureException(error instanceof Error ? error : new Error(error), {
      errorInfo,
    });
  } catch (e) {
    console.error('[Error Handler] Failed to capture error:', e);
  }

  // 기본 에러 동작 방지 (선택적)
  // event.preventDefault();
}

/**
 * 비동기 에러 처리 (Promise rejection)
 * @param {PromiseRejectionEvent} event - Promise rejection 이벤트
 * @param {Object} sentryClient - SentryClient 인스턴스
 */
function handleUnhandledRejection(event, sentryClient) {
  const reason = event.reason;

  // 에러 정보 수집
  const errorInfo = {
    type: 'unhandledrejection',
    reason: reason?.message || reason,
    stack: reason?.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // 콘솔에 출력 (개발 환경)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.error('[Unhandled Rejection]', errorInfo);
  }

  // Sentry에 전송
  try {
    sentryClient.captureException(
      reason instanceof Error ? reason : new Error(`Unhandled Promise Rejection: ${reason}`),
      {
        errorInfo,
      }
    );
  } catch (e) {
    console.error('[Error Handler] Failed to capture unhandled rejection:', e);
  }

  // 기본 동작 방지 (선택적)
  // event.preventDefault();
}

/**
 * 네트워크 에러 핸들러
 * @param {Response} response - Fetch API 응답
 * @param {string} url - 요청 URL
 * @param {Object} sentryClient - SentryClient 인스턴스
 */
async function handleNetworkError(response, url, sentryClient) {
  if (!response.ok) {
    const errorInfo = {
      type: 'network_error',
      status: response.status,
      statusText: response.statusText,
      url,
      timestamp: new Date().toISOString(),
    };

    // 응답 본문 읽기 (가능한 경우)
    try {
      const body = await response.clone().text();
      errorInfo.responseBody = body.substring(0, 500); // 처음 500자만
    } catch (e) {
      // 본문을 읽을 수 없는 경우 무시
    }

    // Sentry에 전송
    sentryClient.captureMessage(
      `Network Error: ${response.status} ${response.statusText} - ${url}`,
      'error',
      errorInfo
    );
  }
}

/**
 * 사용자 정의 에러 리포팅 함수
 * @param {Error|string} error - 에러 객체 또는 메시지
 * @param {Object} context - 추가 컨텍스트
 * @param {Object} sentryClient - SentryClient 인스턴스
 */
function reportError(error, context = {}, sentryClient = window.SentryClient) {
  if (!sentryClient) {
    console.error('[Report Error] SentryClient not available:', error);
    return;
  }

  const errorObj = error instanceof Error ? error : new Error(error);

  sentryClient.captureException(errorObj, {
    ...context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
}

/**
 * 사용자 정의 메시지 리포팅 함수
 * @param {string} message - 메시지
 * @param {string} level - 'fatal' | 'error' | 'warning' | 'info' | 'debug'
 * @param {Object} context - 추가 컨텍스트
 * @param {Object} sentryClient - SentryClient 인스턴스
 */
function reportMessage(message, level = 'info', context = {}, sentryClient = window.SentryClient) {
  if (!sentryClient) {
    console.warn('[Report Message] SentryClient not available:', message);
    return;
  }

  sentryClient.captureMessage(message, level, {
    ...context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
}

/**
 * API 호출 에러 핸들러 (fetch wrapper)
 * @param {Function} fetchFn - fetch 함수
 * @param {Object} sentryClient - SentryClient 인스턴스
 * @returns {Function} 래핑된 fetch 함수
 */
function wrapFetch(fetchFn = window.fetch, sentryClient = window.SentryClient) {
  return async function wrappedFetch(url, options = {}) {
    const startTime = Date.now();

    try {
      const response = await fetchFn(url, options);

      // 네트워크 에러 처리
      if (!response.ok && sentryClient) {
        await handleNetworkError(response, url, sentryClient);
      }

      // Breadcrumb 추가 (성공한 요청도 추적)
      if (sentryClient) {
        sentryClient.addBreadcrumb({
          type: 'http',
          category: 'fetch',
          data: {
            url,
            method: options.method || 'GET',
            status_code: response.status,
            duration: Date.now() - startTime,
          },
          level: response.ok ? 'info' : 'error',
        });
      }

      return response;
    } catch (error) {
      // 네트워크 연결 실패 등
      if (sentryClient) {
        sentryClient.captureException(error, {
          type: 'fetch_error',
          url,
          method: options.method || 'GET',
          duration: Date.now() - startTime,
        });
      }

      throw error;
    }
  };
}

// 전역 fetch 래핑 (선택적)
function enableFetchTracking(sentryClient = window.SentryClient) {
  if (!window.fetch) {
    console.warn('[Error Handler] fetch API not available');
    return;
  }

  const originalFetch = window.fetch;
  window.fetch = wrapFetch(originalFetch, sentryClient);

  console.log('[Error Handler] Fetch tracking enabled');
}

// 전역 객체에 노출
window.ErrorHandler = {
  initGlobalErrorHandler,
  reportError,
  reportMessage,
  handleNetworkError,
  wrapFetch,
  enableFetchTracking,
};

// ES6 모듈 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initGlobalErrorHandler,
    reportError,
    reportMessage,
    handleNetworkError,
    wrapFetch,
    enableFetchTracking,
  };
}
