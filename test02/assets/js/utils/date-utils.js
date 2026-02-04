/**
 * SSAL Works - Date Utilities
 * @task S5F3-공통로직
 * @version 1.0.0
 * @description 날짜 포맷팅 유틸리티
 *
 * 제공 함수:
 * - formatDate(date, format): 날짜 포맷팅
 * - formatDateTime(date): 날짜+시간 포맷팅
 * - formatTimeAgo(date): 상대 시간 (몇 분 전)
 * - formatDateKorean(date): 한국어 날짜 (YYYY년 MM월 DD일)
 * - parseDate(str): 문자열 → Date 변환
 */

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 * @param {Date|string} date - 날짜
 * @param {string} format - 포맷 (기본: YYYY-MM-DD)
 * @returns {string} 포맷된 날짜
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) {
        return '-';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 날짜+시간 포맷팅 (YYYY-MM-DD HH:mm)
 * @param {Date|string} date - 날짜
 * @returns {string} 포맷된 날짜시간
 */
function formatDateTime(date) {
    return formatDate(date, 'YYYY-MM-DD HH:mm');
}

/**
 * 상대 시간 표시 (몇 분 전, 몇 시간 전)
 * @param {Date|string} date - 날짜
 * @returns {string} 상대 시간 문자열
 */
function formatTimeAgo(date) {
    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) {
        return '-';
    }

    const now = new Date();
    const diffMs = now - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffSec < 60) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;
    if (diffDay < 365) return `${Math.floor(diffDay / 30)}개월 전`;

    return `${Math.floor(diffDay / 365)}년 전`;
}

/**
 * 한국어 날짜 포맷 (YYYY년 MM월 DD일)
 * @param {Date|string} date - 날짜
 * @param {boolean} includeTime - 시간 포함 여부
 * @returns {string} 한국어 날짜
 */
function formatDateKorean(date, includeTime = false) {
    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) {
        return '-';
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return d.toLocaleDateString('ko-KR', options);
}

/**
 * 짧은 한국어 날짜 (MM/DD)
 * @param {Date|string} date - 날짜
 * @returns {string} 짧은 날짜
 */
function formatDateShort(date) {
    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) {
        return '-';
    }

    return d.toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * ISO 날짜 문자열로 변환
 * @param {Date|string} date - 날짜
 * @returns {string} ISO 문자열
 */
function toISOString(date) {
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString();
}

/**
 * 날짜 문자열 파싱
 * @param {string} str - 날짜 문자열
 * @returns {Date|null} Date 객체
 */
function parseDate(str) {
    if (!str) return null;

    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * 오늘 날짜인지 확인
 * @param {Date|string} date - 날짜
 * @returns {boolean}
 */
function isToday(date) {
    const d = date instanceof Date ? date : new Date(date);
    const today = new Date();

    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
}

/**
 * 날짜 범위 포맷 (시작 ~ 종료)
 * @param {Date|string} start - 시작일
 * @param {Date|string} end - 종료일
 * @returns {string} 날짜 범위
 */
function formatDateRange(start, end) {
    return `${formatDate(start)} ~ ${formatDate(end)}`;
}

// 전역 노출
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.formatTimeAgo = formatTimeAgo;
window.formatDateKorean = formatDateKorean;
window.formatDateShort = formatDateShort;
window.toISOString = toISOString;
window.parseDate = parseDate;
window.isToday = isToday;
window.formatDateRange = formatDateRange;

console.log('📦 date-utils.js 로드 완료');
