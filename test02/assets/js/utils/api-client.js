/**
 * SSAL Works - API Client
 * @task S5F3-공통로직
 * @version 1.0.0
 * @description 공통 API 호출 래퍼
 *
 * 의존성:
 * - supabase-init.js (window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
 *
 * 제공 함수:
 * - apiGet(endpoint, options): GET 요청
 * - apiPost(endpoint, data, options): POST 요청
 * - apiPatch(endpoint, data, options): PATCH 요청
 * - apiDelete(endpoint, options): DELETE 요청
 * - supabaseRest(table, params): Supabase REST API 호출
 */

/**
 * API 에러 클래스
 */
class ApiError extends Error {
    constructor(status, message, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * 기본 fetch 래퍼
 * @param {string} url - 요청 URL
 * @param {object} options - fetch 옵션
 * @returns {Promise<any>} 응답 데이터
 */
async function apiFetch(url, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        // 204 No Content
        if (response.status === 204) {
            return null;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new ApiError(
                response.status,
                data?.message || data?.error || `HTTP ${response.status}`,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(0, error.message || 'Network Error');
    }
}

/**
 * GET 요청
 */
async function apiGet(url, options = {}) {
    return apiFetch(url, { ...options, method: 'GET' });
}

/**
 * POST 요청
 */
async function apiPost(url, data, options = {}) {
    return apiFetch(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * PATCH 요청
 */
async function apiPatch(url, data, options = {}) {
    return apiFetch(url, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}

/**
 * DELETE 요청
 */
async function apiDelete(url, options = {}) {
    return apiFetch(url, { ...options, method: 'DELETE' });
}

/**
 * Supabase REST API 호출
 * @param {string} table - 테이블명
 * @param {object} params - 쿼리 파라미터
 * @param {object} options - 추가 옵션 (method, body 등)
 * @returns {Promise<any>} 응답 데이터
 */
async function supabaseRest(table, params = {}, options = {}) {
    const baseUrl = window.SUPABASE_URL;
    const apiKey = window.SUPABASE_ANON_KEY;

    if (!baseUrl || !apiKey) {
        throw new ApiError(0, 'Supabase 설정이 없습니다. supabase-init.js를 먼저 로드하세요.');
    }

    // 쿼리 파라미터 빌드
    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

    const url = `${baseUrl}/rest/v1/${table}${queryString ? '?' + queryString : ''}`;

    const headers = {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': options.prefer || 'return=representation'
    };

    return apiFetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
    });
}

/**
 * Supabase REST - SELECT
 */
async function supabaseSelect(table, params = {}) {
    return supabaseRest(table, { select: '*', ...params });
}

/**
 * Supabase REST - INSERT
 */
async function supabaseInsert(table, data) {
    return supabaseRest(table, {}, { method: 'POST', body: data });
}

/**
 * Supabase REST - UPDATE
 */
async function supabaseUpdate(table, data, filter) {
    return supabaseRest(table, filter, { method: 'PATCH', body: data });
}

/**
 * Supabase REST - DELETE
 */
async function supabaseDeleteRow(table, filter) {
    return supabaseRest(table, filter, { method: 'DELETE' });
}

// 전역 노출
window.ApiError = ApiError;
window.apiGet = apiGet;
window.apiPost = apiPost;
window.apiPatch = apiPatch;
window.apiDelete = apiDelete;
window.supabaseRest = supabaseRest;
window.supabaseSelect = supabaseSelect;
window.supabaseInsert = supabaseInsert;
window.supabaseUpdate = supabaseUpdate;
window.supabaseDeleteRow = supabaseDeleteRow;

console.log('📦 api-client.js 로드 완료');
