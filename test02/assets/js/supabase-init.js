/**
 * SSAL Works - Supabase Initialization
 * @task S5F3
 * @version 1.0.0
 * @created 2026-01-02
 * @description Supabase 클라이언트 초기화 모듈
 *
 * 의존성:
 * - https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 (CDN에서 로드)
 *
 * 사용법:
 * 1. Supabase CDN 먼저 로드
 * 2. 이 스크립트 로드
 * 3. window.supabaseClient 사용
 */

// Supabase 설정
const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE1NTEsImV4cCI6MjA3OTE0NzU1MX0.AJy34h5VR8QS6WFEcUcBeJJu8I3bBQ6UCk1I84Wb7y4';

// window 객체에 명시적으로 선언 (크로스 스크립트 블록 접근 보장)
window.supabaseClient = null;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

/**
 * Supabase 클라이언트 초기화
 * 이 함수는 DOMContentLoaded 후 또는 수동으로 호출
 */
function initSupabaseClient() {
    if (typeof supabase === 'undefined') {
        console.warn('⚠️ Supabase 라이브러리가 로드되지 않았습니다.');
        return false;
    }

    if (window.supabaseClient) {
        console.log('ℹ️ Supabase 클라이언트가 이미 초기화되어 있습니다.');
        return true;
    }

    try {
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase 클라이언트 초기화 완료');
        return true;
    } catch (error) {
        console.error('❌ Supabase 클라이언트 초기화 실패:', error);
        return false;
    }
}

// 전역 함수로 노출
window.initSupabaseClient = initSupabaseClient;

console.log('📦 supabase-init.js 로드 완료');
