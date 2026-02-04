// Task ID: S2F2
// ================================================================
// S2F2: 비밀번호 재설정 UI JavaScript
// ================================================================
// 작성일: 2025-12-14
// 목적: forgot-password.html 및 reset-password.html 기능 구현
// ================================================================

// ========== 유틸리티 함수 ==========

/**
 * 로딩 표시
 */
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    const submitBtn = document.getElementById('submitBtn');
    if (overlay) overlay.style.display = 'flex';
    if (submitBtn) submitBtn.disabled = true;
}

/**
 * 로딩 숨김
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    const submitBtn = document.getElementById('submitBtn');
    if (overlay) overlay.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
}

/**
 * 이메일 유효성 검사
 * @param {string} email - 검증할 이메일
 * @returns {boolean} 유효 여부
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== forgot-password.html: 비밀번호 재설정 요청 ==========

/**
 * 비밀번호 재설정 요청 처리
 * - Supabase Auth의 resetPasswordForEmail 사용
 * - Supabase가 직접 이메일 발송 및 토큰 관리
 *
 * @param {Event} event - 폼 제출 이벤트
 */
async function handleForgotPassword(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();

    // 이메일 유효성 검사
    if (!email) {
        showToast('이메일을 입력해주세요.', 'warning');
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showToast('올바른 이메일 형식이 아닙니다.', 'warning');
        emailInput.focus();
        return;
    }

    try {
        showLoading();

        // Supabase 클라이언트 초기화 (forgot-password.html에서 전역으로 제공)
        if (typeof supabaseClient === 'undefined') {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
        }

        // Supabase 내장 비밀번호 재설정 기능 사용
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/pages/auth/reset-password.html'
        });

        hideLoading();

        if (error) {
            throw error;
        }

        // 성공 화면 표시
        document.getElementById('requestForm').style.display = 'none';
        document.getElementById('successContainer').style.display = 'block';
        document.getElementById('successEmail').textContent = `${email}로 재설정 링크를 보냈습니다.`;

        showToast('비밀번호 재설정 이메일이 전송되었습니다.', 'success', 5000);

    } catch (error) {
        hideLoading();
        console.error('비밀번호 재설정 요청 실패:', error);

        let errorMessage = '비밀번호 재설정 요청에 실패했습니다.';
        if (error.message) {
            if (error.message.includes('rate limit')) {
                errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
            } else {
                errorMessage = error.message;
            }
        }
        showToast(errorMessage, 'error', 5000);
    }
}

// ========== reset-password.html: 비밀번호 재설정 ==========

/**
 * 비밀번호 강도 검사 (실시간)
 * - reset-password.html에서 사용
 */
function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;

    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqNumber = document.getElementById('req-number');

    // 길이 체크 (최소 8자)
    if (password.length >= 8) {
        reqLength.classList.add('valid');
        reqLength.classList.remove('invalid');
    } else {
        reqLength.classList.add('invalid');
        reqLength.classList.remove('valid');
    }

    // 대문자 체크
    if (/[A-Z]/.test(password)) {
        reqUppercase.classList.add('valid');
        reqUppercase.classList.remove('invalid');
    } else {
        reqUppercase.classList.add('invalid');
        reqUppercase.classList.remove('valid');
    }

    // 소문자 체크
    if (/[a-z]/.test(password)) {
        reqLowercase.classList.add('valid');
        reqLowercase.classList.remove('invalid');
    } else {
        reqLowercase.classList.add('invalid');
        reqLowercase.classList.remove('valid');
    }

    // 숫자 체크
    if (/[0-9]/.test(password)) {
        reqNumber.classList.add('valid');
        reqNumber.classList.remove('invalid');
    } else {
        reqNumber.classList.add('invalid');
        reqNumber.classList.remove('valid');
    }

    checkPasswordMatch();
}

/**
 * 비밀번호 일치 확인 (실시간)
 * - reset-password.html에서 사용
 */
function checkPasswordMatch() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchMessage = document.getElementById('matchMessage');

    if (!confirmPassword) {
        matchMessage.textContent = '';
        return;
    }

    if (password === confirmPassword) {
        matchMessage.textContent = '✓ 비밀번호가 일치합니다';
        matchMessage.style.color = 'var(--success)';
    } else {
        matchMessage.textContent = '✗ 비밀번호가 일치하지 않습니다';
        matchMessage.style.color = 'var(--danger)';
    }
}

/**
 * 비밀번호 유효성 종합 검사
 * @returns {boolean} 유효 여부
 */
function isPasswordValid() {
    const password = document.getElementById('newPassword').value;
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
}

/**
 * 비밀번호 재설정 처리
 * - reset-password.html에서 사용
 * - Supabase Auth의 updateUser 사용
 *
 * @param {Event} event - 폼 제출 이벤트
 */
async function handleResetPassword(event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 유효성 검사
    if (!isPasswordValid()) {
        showToast('비밀번호 요구사항을 모두 충족해야 합니다.', 'warning');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('비밀번호가 일치하지 않습니다.', 'warning');
        return;
    }

    try {
        showLoading();

        // Supabase에서 비밀번호 업데이트
        // (reset-password.html에서 Supabase Client가 이미 초기화되어 있음)
        const { data, error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        hideLoading();

        // 성공 화면 표시
        document.getElementById('resetForm').style.display = 'none';
        document.getElementById('successContainer').style.display = 'block';

        showToast('비밀번호가 성공적으로 변경되었습니다.', 'success', 5000);

    } catch (error) {
        hideLoading();
        console.error('비밀번호 재설정 실패:', error);

        let errorMessage = '비밀번호 재설정에 실패했습니다.';

        if (error.message.includes('Auth session missing')) {
            errorMessage = '세션이 만료되었습니다. 비밀번호 재설정 링크를 다시 요청해주세요.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        showToast(errorMessage, 'error', 5000);
    }
}

// ========== 전역 함수 export ==========
window.handleForgotPassword = handleForgotPassword;
window.handleResetPassword = handleResetPassword;
window.checkPasswordStrength = checkPasswordStrength;
window.checkPasswordMatch = checkPasswordMatch;
