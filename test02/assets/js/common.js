/**
 * SSAL Works - Common Utilities
 * @task S5F3
 * @version 1.0.0
 * @created 2026-01-02
 * @description 공통 유틸리티 함수 모듈
 *
 * 제공 함수:
 * - showStatus(message, type, duration): 토스트 메시지 표시
 * - formatTimeAgo(dateStr): 상대 시간 표시 (몇 분 전, 몇 시간 전)
 * - customConfirm(message, title): 커스텀 확인 다이얼로그
 */

// 환경 감지 - 배포 환경에서는 localhost 서버 기능 비활성화
// (inline script에서 먼저 선언될 수 있으므로 조건부 설정)
if (typeof window.IS_PRODUCTION === 'undefined') {
    window.IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
}

/**
 * 상태 메시지 표시 (토스트)
 * @param {string} message - 표시할 메시지
 * @param {string} type - 메시지 유형 (info, success, error, warning)
 * @param {number} duration - 표시 시간 (ms)
 */
function showStatus(message, type = 'info', duration = 3000) {
    const status = document.getElementById('serverStatus');
    if (!status) {
        console.warn('serverStatus 요소가 없습니다.');
        return;
    }

    status.textContent = message;
    status.className = 'server-status show ' + type;

    setTimeout(() => {
        status.className = 'server-status';
    }, duration);
}

/**
 * 상대 시간 표시 (몇 분 전, 몇 시간 전)
 * @param {string} dateStr - ISO 날짜 문자열
 * @returns {string} 상대 시간 문자열
 */
function formatTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;

    return date.toLocaleDateString('ko-KR');
}

/**
 * 커스텀 확인 다이얼로그
 * @param {string} message - 확인 메시지
 * @param {string} title - 다이얼로그 제목
 * @returns {Promise<boolean>} 확인: true, 취소: false
 */
function customConfirm(message, title = '확인') {
    return new Promise((resolve) => {
        const dialog = document.getElementById('customConfirmDialog');
        if (!dialog) {
            // fallback to native confirm
            resolve(confirm(message));
            return;
        }

        const titleEl = document.getElementById('confirmDialogTitle');
        const messageEl = document.getElementById('confirmDialogMessage');
        const confirmBtn = document.getElementById('confirmDialogConfirm');
        const cancelBtn = document.getElementById('confirmDialogCancel');

        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        dialog.style.display = 'flex';

        const handleConfirm = () => {
            dialog.style.display = 'none';
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            dialog.style.display = 'none';
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            if (confirmBtn) confirmBtn.removeEventListener('click', handleConfirm);
            if (cancelBtn) cancelBtn.removeEventListener('click', handleCancel);
        };

        if (confirmBtn) confirmBtn.addEventListener('click', handleConfirm);
        if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);
    });
}

/**
 * HTML 이스케이프 처리
 * @param {string} text - 원본 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 숫자 포맷팅 (천 단위 콤마)
 * @param {number} num - 숫자
 * @returns {string} 포맷팅된 문자열
 */
function formatNumber(num) {
    return num.toLocaleString('ko-KR');
}

/**
 * 에러 메시지 정제 (PostgREST/Supabase 에러 숨김)
 * DB 구조 노출 방지를 위해 사용자에게는 일반 메시지만 표시
 * @param {Error|object} error - 에러 객체
 * @param {string} fallbackMessage - 기본 표시 메시지
 * @returns {string} 정제된 에러 메시지
 */
function sanitizeErrorMessage(error, fallbackMessage = '처리 중 오류가 발생했습니다.') {
    // 콘솔에는 전체 에러 기록 (디버깅용)
    console.error('[Error Detail]', error);

    // PostgREST 에러 코드 패턴 (DB 구조 노출 위험)
    const postgrestCodes = ['PGRST', '42', '23', '22', '28', '08', 'P0'];

    if (error && error.code) {
        // PostgreSQL/PostgREST 에러 코드가 있으면 일반 메시지 반환
        const isPostgrestError = postgrestCodes.some(prefix =>
            error.code.toString().startsWith(prefix)
        );
        if (isPostgrestError) {
            return fallbackMessage;
        }
    }

    // 에러 메시지에 민감한 정보가 포함되어 있는지 확인
    const sensitivePatterns = [
        /column.*does not exist/i,
        /relation.*does not exist/i,
        /table.*does not exist/i,
        /permission denied/i,
        /violates.*constraint/i,
        /duplicate key/i,
        /foreign key/i,
        /syntax error/i,
        /chr\(\d+\)/i,  // chr() 함수 패턴
        /\bpublic\./i,  // 스키마 이름
        /\brls\b/i      // RLS 관련
    ];

    const errorMessage = error?.message || error?.toString() || '';
    const hasSensitiveInfo = sensitivePatterns.some(pattern =>
        pattern.test(errorMessage)
    );

    if (hasSensitiveInfo) {
        return fallbackMessage;
    }

    // 민감 정보 없으면 원본 메시지 반환 (간결하게)
    return errorMessage || fallbackMessage;
}

// 전역 함수로 노출
window.showStatus = showStatus;
window.formatTimeAgo = formatTimeAgo;
window.customConfirm = customConfirm;
window.escapeHtml = escapeHtml;
window.formatNumber = formatNumber;
window.sanitizeErrorMessage = sanitizeErrorMessage;

console.log('📦 common.js 로드 완료');
