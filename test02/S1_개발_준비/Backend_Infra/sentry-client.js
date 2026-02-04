/**
 * @task S1BI2
 *
 * Sentry Client-Side Error Tracking
 * 클라이언트 사이드 에러 모니터링
 */

class SentryClient {
  constructor() {
    this.sentryLoaded = false;
    this.sentryInstance = null;
    this.dsn = null;
    this.environment = this.detectEnvironment();
  }

  /**
   * 환경 자동 감지
   * @returns {string} 'development' | 'production'
   */
  detectEnvironment() {
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }

    return 'production';
  }

  /**
   * Sentry SDK 동적 로드 및 초기화
   * @param {string} dsn - Sentry DSN (환경변수에서 가져옴)
   * @returns {Promise<void>}
   */
  async init(dsn) {
    if (this.sentryLoaded) {
      console.warn('[Sentry] Already initialized');
      return;
    }

    if (!dsn) {
      console.warn('[Sentry] DSN not provided, Sentry will not be initialized');
      return;
    }

    this.dsn = dsn;

    try {
      // Sentry SDK 동적 로드
      await this.loadSentrySDK();

      // Sentry 초기화
      if (window.Sentry) {
        window.Sentry.init({
          dsn: this.dsn,
          environment: this.environment,

          // 릴리즈 버전 (선택적)
          // release: 'ssalworks@1.0.0',

          // 트래이싱 샘플레이트 (성능 모니터링)
          tracesSampleRate: this.environment === 'production' ? 0.1 : 1.0,

          // 에러 필터링
          beforeSend(event, hint) {
            // 개발 환경에서는 콘솔에도 출력
            if (this.environment === 'development') {
              console.error('[Sentry Event]', event, hint);
            }

            // 특정 에러 무시 (예: 브라우저 확장 프로그램 에러)
            const error = hint.originalException;
            if (error && error.message && error.message.includes('chrome-extension://')) {
              return null;
            }

            return event;
          },

          // Breadcrumbs 설정 (사용자 행동 추적)
          integrations: [
            new window.Sentry.BrowserTracing(),
          ],
        });

        this.sentryInstance = window.Sentry;
        this.sentryLoaded = true;

        console.log(`[Sentry] Initialized successfully (${this.environment})`);
      } else {
        throw new Error('Sentry SDK failed to load');
      }
    } catch (error) {
      console.error('[Sentry] Initialization failed:', error);
    }
  }

  /**
   * Sentry SDK 스크립트 동적 로드
   * @returns {Promise<void>}
   */
  loadSentrySDK() {
    return new Promise((resolve, reject) => {
      // 이미 로드된 경우
      if (window.Sentry) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://browser.sentry-cdn.com/7.80.0/bundle.min.js';
      script.integrity = 'sha384-yfZA8nGfZ6XmJhC/xN8VE+YMWnvMwAjUxzL4YQ4y5fqVIZ9MWVxJpJxQYv5xL0mW';
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Sentry SDK'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * 예외 캡처
   * @param {Error} error - 캡처할 에러
   * @param {Object} context - 추가 컨텍스트 정보
   */
  captureException(error, context = {}) {
    if (!this.sentryLoaded || !this.sentryInstance) {
      console.error('[Sentry] Not initialized. Error:', error);
      return;
    }

    try {
      this.sentryInstance.captureException(error, {
        extra: context,
      });
    } catch (e) {
      console.error('[Sentry] Failed to capture exception:', e);
    }
  }

  /**
   * 메시지 캡처 (에러가 아닌 정보성 메시지)
   * @param {string} message - 캡처할 메시지
   * @param {string} level - 'fatal' | 'error' | 'warning' | 'info' | 'debug'
   * @param {Object} context - 추가 컨텍스트 정보
   */
  captureMessage(message, level = 'info', context = {}) {
    if (!this.sentryLoaded || !this.sentryInstance) {
      console.warn('[Sentry] Not initialized. Message:', message);
      return;
    }

    try {
      this.sentryInstance.captureMessage(message, {
        level,
        extra: context,
      });
    } catch (e) {
      console.error('[Sentry] Failed to capture message:', e);
    }
  }

  /**
   * 사용자 정보 설정 (로그인 사용자 식별)
   * @param {Object} user - 사용자 정보
   * @param {string} user.id - 사용자 ID
   * @param {string} user.email - 사용자 이메일 (선택적)
   * @param {string} user.username - 사용자 이름 (선택적)
   */
  setUser(user) {
    if (!this.sentryLoaded || !this.sentryInstance) {
      console.warn('[Sentry] Not initialized. Cannot set user.');
      return;
    }

    try {
      this.sentryInstance.setUser(user ? {
        id: user.id,
        email: user.email,
        username: user.username,
      } : null);

      console.log('[Sentry] User set:', user ? user.id : 'null');
    } catch (e) {
      console.error('[Sentry] Failed to set user:', e);
    }
  }

  /**
   * 사용자 정보 초기화 (로그아웃 시)
   */
  clearUser() {
    this.setUser(null);
  }

  /**
   * Breadcrumb 추가 (사용자 행동 추적)
   * @param {Object} breadcrumb
   * @param {string} breadcrumb.message - 메시지
   * @param {string} breadcrumb.category - 카테고리
   * @param {string} breadcrumb.level - 레벨
   * @param {Object} breadcrumb.data - 추가 데이터
   */
  addBreadcrumb(breadcrumb) {
    if (!this.sentryLoaded || !this.sentryInstance) {
      return;
    }

    try {
      this.sentryInstance.addBreadcrumb(breadcrumb);
    } catch (e) {
      console.error('[Sentry] Failed to add breadcrumb:', e);
    }
  }

  /**
   * 컨텍스트 정보 설정
   * @param {string} name - 컨텍스트 이름
   * @param {Object} context - 컨텍스트 데이터
   */
  setContext(name, context) {
    if (!this.sentryLoaded || !this.sentryInstance) {
      return;
    }

    try {
      this.sentryInstance.setContext(name, context);
    } catch (e) {
      console.error('[Sentry] Failed to set context:', e);
    }
  }

  /**
   * 태그 설정
   * @param {Object} tags - 태그 객체
   */
  setTags(tags) {
    if (!this.sentryLoaded || !this.sentryInstance) {
      return;
    }

    try {
      this.sentryInstance.setTags(tags);
    } catch (e) {
      console.error('[Sentry] Failed to set tags:', e);
    }
  }
}

// 싱글톤 인스턴스 생성
const sentryClient = new SentryClient();

// 전역 객체에 노출
window.SentryClient = sentryClient;

// ES6 모듈 export (빌드 시스템에서 사용)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sentryClient;
}
