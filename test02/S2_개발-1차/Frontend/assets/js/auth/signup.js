/**
 * @task S2F3
 */
// ================================================================
// S2F3: 회원가입 폼 처리 로직
// ================================================================
// 작성일: 2025-12-20
// 목적: 이메일/비밀번호 회원가입 폼 처리 및 검증
// ================================================================

// ================================================================
// 1. 비밀번호 표시/숨기기 토글
// ================================================================
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

// ================================================================
// 2. 비밀번호 강도 체크 (실시간)
// ================================================================
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('strengthText');
    const strengthBar = document.getElementById('strengthBar');

    if (password.length === 0) {
        strengthContainer.style.display = 'none';
        return;
    }

    strengthContainer.style.display = 'block';

    // 비밀번호 강도 계산
    const strength = calculatePasswordStrength(password);

    // 강도 텍스트 및 색상 설정
    if (strength.score === 0) {
        strengthText.textContent = '매우 약함';
        strengthText.style.color = '#EF4444';
        strengthBar.style.width = '25%';
        strengthBar.style.background = '#EF4444';
    } else if (strength.score === 1) {
        strengthText.textContent = '약함';
        strengthText.style.color = '#F59E0B';
        strengthBar.style.width = '50%';
        strengthBar.style.background = '#F59E0B';
    } else if (strength.score === 2) {
        strengthText.textContent = '보통';
        strengthText.style.color = '#3B82F6';
        strengthBar.style.width = '75%';
        strengthBar.style.background = '#3B82F6';
    } else {
        strengthText.textContent = '강함';
        strengthText.style.color = '#10B981';
        strengthBar.style.width = '100%';
        strengthBar.style.background = '#10B981';
    }

    // 요구사항 체크리스트 업데이트
    updatePasswordChecklist(password);
});

// ================================================================
// 3. 비밀번호 강도 계산 함수
// ================================================================
function calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        hasLetter: /[a-zA-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[^a-zA-Z0-9]/.test(password),
        isLong: password.length >= 12,
        hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password)
    };

    // 점수 계산
    if (checks.length) score++;
    if (checks.hasLetter && checks.hasNumber && checks.hasSpecial) score++;
    if (checks.isLong) score++;
    if (checks.hasUpperLower) score++;

    return { score, checks };
}

// ================================================================
// 4. 비밀번호 요구사항 체크리스트 업데이트
// ================================================================
function updatePasswordChecklist(password) {
    const checks = {
        length: password.length >= 8,
        letter: /[a-zA-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^a-zA-Z0-9]/.test(password)
    };

    // 체크리스트 UI 업데이트
    updateCheckItem('check-length', checks.length);
    updateCheckItem('check-letter', checks.letter);
    updateCheckItem('check-number', checks.number);
    updateCheckItem('check-special', checks.special);
}

function updateCheckItem(id, isValid) {
    const element = document.getElementById(id);
    if (isValid) {
        element.className = 'valid';
        element.textContent = element.textContent.replace('✗', '✓');
    } else {
        element.className = 'invalid';
        element.textContent = element.textContent.replace('✓', '✗');
    }
}

// ================================================================
// 5. 비밀번호 일치 확인 (실시간)
// ================================================================
const passwordConfirmInput = document.getElementById('passwordConfirm');
const passwordMatchMessage = document.getElementById('passwordMatchMessage');

passwordConfirmInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const confirm = passwordConfirmInput.value;

    if (confirm.length === 0) {
        passwordMatchMessage.style.display = 'none';
        return;
    }

    passwordMatchMessage.style.display = 'block';

    if (password === confirm) {
        passwordMatchMessage.textContent = '✓ 비밀번호가 일치합니다';
        passwordMatchMessage.style.color = '#10B981';
    } else {
        passwordMatchMessage.textContent = '✗ 비밀번호가 일치하지 않습니다';
        passwordMatchMessage.style.color = '#EF4444';
    }
});

// ================================================================
// 6. 폼 제출 처리
// ================================================================
async function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const termsAgree = document.getElementById('termsAgree').checked;
    const marketingAgree = document.getElementById('marketingAgree').checked;

    // ================================================================
    // 6-1. 클라이언트 측 검증
    // ================================================================

    // 이름 검증
    if (name.length < 2) {
        showToast('error', '이름은 최소 2자 이상이어야 합니다.');
        return;
    }

    if (name.length > 50) {
        showToast('error', '이름은 최대 50자까지 입력 가능합니다.');
        return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('error', '올바른 이메일 형식을 입력해주세요.');
        return;
    }

    // 비밀번호 검증
    const strength = calculatePasswordStrength(password);
    if (!strength.checks.length || !strength.checks.hasLetter || !strength.checks.hasNumber || !strength.checks.hasSpecial) {
        showToast('error', '비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.');
        return;
    }

    // 비밀번호 일치 확인
    if (password !== passwordConfirm) {
        showToast('error', '비밀번호가 일치하지 않습니다.');
        return;
    }

    // 이용약관 동의 확인
    if (!termsAgree) {
        showToast('error', '이용약관 및 개인정보 처리방침에 동의해주세요.');
        return;
    }

    // ================================================================
    // 6-2. API 호출
    // ================================================================
    const loadingOverlay = document.getElementById('loadingOverlay');
    const signupBtn = document.getElementById('signupBtn');

    try {
        loadingOverlay.style.display = 'flex';
        signupBtn.disabled = true;

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                marketing_consent: marketingAgree
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // 에러 처리
            const errorMessage = data.error?.message || '회원가입에 실패했습니다.';

            if (data.error?.code === 'EMAIL_EXISTS') {
                showToast('error', '이미 등록된 이메일입니다. 로그인하시거나 다른 이메일을 사용해주세요.');
            } else if (data.error?.code === 'WEAK_PASSWORD') {
                showToast('error', '비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요.');
            } else {
                showToast('error', errorMessage);
            }
            return;
        }

        // ================================================================
        // 6-3. 성공 시 이메일 확인 페이지로 리다이렉트
        // ================================================================
        showToast('success', '회원가입이 완료되었습니다! 이메일을 확인해주세요.');

        // 1초 후 리다이렉트
        setTimeout(() => {
            window.location.href = `verify-email.html?email=${encodeURIComponent(email)}`;
        }, 1000);

    } catch (error) {
        console.error('Signup error:', error);
        showToast('error', '서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
        loadingOverlay.style.display = 'none';
        signupBtn.disabled = false;
    }
}

// ================================================================
// 7. Toast 알림 함수
// ================================================================
function showToast(type, message) {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '✓' :
                 type === 'error' ? '✗' :
                 type === 'warning' ? '⚠' : 'ℹ';

    toast.innerHTML = `
        <div class="toast-icon" style="font-size: 20px;">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // 애니메이션
    setTimeout(() => toast.classList.add('show'), 10);

    // 5초 후 자동 제거
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}
