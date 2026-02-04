/**
 * @task S3F1
 * AI Q&A 인터페이스 로직
 */

// 상태 관리
let selectedAI = 'gemini';
let userCredit = 0;
let pricing = {};
const chatHistory = [];

// DOM 요소
const elements = {
    chatArea: null,
    questionInput: null,
    sendButton: null,
    userCreditEl: null,
    charCurrent: null,
    creditModal: null
};

// 초기화
document.addEventListener('DOMContentLoaded', async () => {
    initElements();
    await Promise.all([
        loadUserCredit(),
        loadAIPricing()
    ]);
    setupEventListeners();
    checkAuth();
});

function initElements() {
    elements.chatArea = document.getElementById('chat-area');
    elements.questionInput = document.getElementById('question-input');
    elements.sendButton = document.getElementById('send-button');
    elements.userCreditEl = document.getElementById('user-credit');
    elements.charCurrent = document.getElementById('char-current');
    elements.creditModal = document.getElementById('credit-modal');
}

/**
 * 인증 확인 및 빌더 계정 체크
 */
async function checkAuth() {
    const token = getAccessToken();
    if (!token) {
        window.location.href = '/pages/auth/login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return;
    }

    // 사용자 정보 표시
    const userName = localStorage.getItem('userName') || '사용자';
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
        userNameEl.textContent = userName;
    }

    // 빌더 계정 체크 - 일반 회원은 Sunny에게 묻기 사용 불가
    await checkBuilderAccess();
}

/**
 * 빌더 계정 접근 권한 체크
 * 일반 회원(무료)은 AI Q&A(Sunny에게 묻기) 기능 사용 불가
 */
async function checkBuilderAccess() {
    try {
        // Supabase 세션 확인
        const SUPABASE_URL = 'https://zwjmfewyshhwpgwdtrus.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3am1mZXd5c2hod3Bnd2R0cnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE1NTEsImV4cCI6MjA3OTE0NzU1MX0.AJy34h5VR8QS6WFEcUcBeJJu8I3bBQ6UCk1I84Wb7y4';

        // 현재 세션의 사용자 정보 가져오기
        const sessionResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${getAccessToken()}`
            }
        });

        if (!sessionResponse.ok) {
            console.log('세션 확인 실패 - 로그인 페이지로 이동');
            window.location.href = '/pages/auth/login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        const sessionUser = await sessionResponse.json();

        // users 테이블에서 installation_fee_paid 확인
        const userResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/users?id=eq.${sessionUser.id}&select=installation_fee_paid,user_id`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            }
        );

        if (!userResponse.ok) {
            throw new Error('사용자 정보 조회 실패');
        }

        const users = await userResponse.json();
        const userData = users[0];

        if (!userData || !userData.installation_fee_paid) {
            // 일반 회원 - 기능 차단
            showBuilderOnlyMessage();
            return;
        }

        // 빌더 계정 - 정상 진행
        console.log('✅ 빌더 계정 확인됨 - AI Q&A 기능 활성화');

    } catch (error) {
        console.error('빌더 계정 확인 실패:', error);
        // 오류 시 기능 차단 (안전하게)
        showBuilderOnlyMessage();
    }
}

/**
 * 빌더 전용 기능 안내 메시지 표시
 */
function showBuilderOnlyMessage() {
    const container = document.querySelector('.qa-container') || document.body;

    container.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            text-align: center;
            padding: 40px;
        ">
            <div style="font-size: 64px; margin-bottom: 24px;">🔒</div>
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #1F3563;">
                빌더 계정 전용 기능입니다
            </h2>
            <p style="font-size: 16px; color: #6B7280; margin-bottom: 32px; max-width: 400px; line-height: 1.6;">
                "Sunny에게 묻기" 기능은 빌더 계정 개설자만 이용할 수 있습니다.<br>
                빌더 계정을 개설하시면 3개월간 1:1 맞춤형 코칭을 받으실 수 있습니다.
            </p>
            <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
                <a href="/index.html" style="
                    padding: 14px 28px;
                    background: #E5E7EB;
                    color: #374151;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                ">홈으로 돌아가기</a>
                <a href="/pages/subscription/builder.html" style="
                    padding: 14px 28px;
                    background: #2C4A8A;
                    color: white;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                ">빌더 계정 개설하기</a>
            </div>
        </div>
    `;
}

/**
 * 사용자 크레딧 로드
 */
async function loadUserCredit() {
    try {
        const response = await fetch('/api/user/credit', {
            headers: { 'Authorization': `Bearer ${getAccessToken()}` }
        });

        if (!response.ok) {
            throw new Error('크레딧 조회 실패');
        }

        const data = await response.json();
        userCredit = data.credit || data.credit_balance || 0;
        updateCreditDisplay();
    } catch (error) {
        console.error('크레딧 로드 실패:', error);
        userCredit = 0;
        updateCreditDisplay();
    }
}

/**
 * AI 가격 정보 로드
 */
async function loadAIPricing() {
    try {
        const response = await fetch('/api/ai/pricing');
        const data = await response.json();

        if (data.success && data.pricing) {
            pricing = data.pricing;

            // 가격 표시 업데이트
            for (const [model, info] of Object.entries(pricing)) {
                const priceEl = document.getElementById(`${model}-price`);
                if (priceEl) {
                    if (info.is_free || info.price === 0) {
                        priceEl.textContent = '무료';
                        priceEl.classList.add('ai-price-free');
                    } else {
                        priceEl.textContent = `${info.price.toLocaleString()}원/질문`;
                    }
                }
            }
        }
    } catch (error) {
        console.error('가격 정보 로드 실패:', error);
        // 기본값 사용
        document.getElementById('gemini-price').textContent = '100원/질문';
        document.getElementById('chatgpt-price').textContent = '150원/질문';
        document.getElementById('perplexity-price').textContent = '120원/질문';
    }
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // AI 선택 버튼
    document.querySelectorAll('.ai-option').forEach(btn => {
        btn.addEventListener('click', () => selectAI(btn));
    });

    // 전송 버튼
    elements.sendButton.addEventListener('click', sendQuestion);

    // 텍스트 입력
    elements.questionInput.addEventListener('input', onInputChange);
    elements.questionInput.addEventListener('keydown', onInputKeydown);

    // 로그아웃
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

    // 모달 닫기
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

    // 충전 버튼
    document.querySelectorAll('.btn-charge').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.amount;
            window.location.href = `/pages/subscription/credit-purchase.html?amount=${amount}`;
        });
    });
}

/**
 * AI 모델 선택
 */
function selectAI(btn) {
    document.querySelector('.ai-option.selected')?.classList.remove('selected');
    btn.classList.add('selected');
    selectedAI = btn.dataset.ai;

    // 크레딧 부족 경고
    const modelPrice = getModelPrice(selectedAI);
    if (modelPrice > userCredit && modelPrice > 0) {
        showCreditWarning();
    }
}

function selectAIByName(aiName) {
    const btn = document.querySelector(`.ai-option[data-ai="${aiName}"]`);
    if (btn) {
        selectAI(btn);
    }
}

/**
 * 입력 변경 처리
 */
function onInputChange() {
    const text = elements.questionInput.value;
    elements.charCurrent.textContent = text.length;

    // 전송 버튼 활성화
    elements.sendButton.disabled = text.trim().length === 0;
}

/**
 * 키보드 입력 처리
 */
function onInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!elements.sendButton.disabled) {
            sendQuestion();
        }
    }
}

/**
 * 질문 전송
 */
async function sendQuestion() {
    const question = elements.questionInput.value.trim();
    if (!question) return;

    // 크레딧 확인
    const modelPrice = getModelPrice(selectedAI);
    if (modelPrice > userCredit && modelPrice > 0) {
        showCreditModal();
        return;
    }

    // 웰컴 메시지 제거
    const welcome = elements.chatArea.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    // 사용자 메시지 표시
    addMessage('user', question);
    elements.questionInput.value = '';
    elements.sendButton.disabled = true;
    onInputChange();

    // 로딩 표시
    const loadingId = addMessage('ai', '답변을 생성하고 있습니다...', true);

    try {
        const response = await fetch('/api/ai/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: JSON.stringify({
                question,
                aiModel: selectedAI,
                context: getRecentContext()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'AI 응답 실패');
        }

        // 로딩 메시지 제거 후 실제 답변 표시
        removeMessage(loadingId);
        addMessage('ai', data.answer, false, selectedAI);

        // 크레딧 업데이트
        if (data.remainingCredit !== undefined) {
            userCredit = data.remainingCredit;
            updateCreditDisplay();
        }

        // 대화 기록 저장
        chatHistory.push({ role: 'user', content: question });
        chatHistory.push({ role: 'assistant', content: data.answer, model: selectedAI });

    } catch (error) {
        removeMessage(loadingId);
        addMessage('error', error.message || '오류가 발생했습니다. 다시 시도해주세요.');
    }
}

/**
 * 메시지 추가
 */
function addMessage(type, content, isLoading = false, aiModel = null) {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `message ${type}`;

    if (isLoading) {
        messageDiv.classList.add('loading');
    }

    if (aiModel) {
        messageDiv.dataset.ai = aiModel;
    }

    const aiInfo = aiModel ? getAIInfo(aiModel) : null;

    messageDiv.innerHTML = `
        <div class="message-content">
            ${type === 'ai' && aiInfo ? `
                <div class="ai-badge" style="background-color: ${aiInfo.color}20; color: ${aiInfo.color}">
                    ${aiInfo.icon} ${aiInfo.name}
                </div>
            ` : ''}
            <div class="message-text">${formatMessage(content)}</div>
            ${!isLoading && type === 'ai' ? `
                <div class="message-actions">
                    <button class="action-copy" title="복사">📋</button>
                </div>
            ` : ''}
        </div>
    `;

    // 복사 버튼 이벤트
    const copyBtn = messageDiv.querySelector('.action-copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => copyToClipboard(content));
    }

    elements.chatArea.appendChild(messageDiv);
    elements.chatArea.scrollTop = elements.chatArea.scrollHeight;

    return messageId;
}

/**
 * 메시지 제거
 */
function removeMessage(messageId) {
    document.getElementById(messageId)?.remove();
}

/**
 * 메시지 포맷팅 (마크다운 간단 변환)
 */
function formatMessage(content) {
    if (!content) return '';

    return content
        // 코드 블록
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
        // 인라인 코드
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // 굵은 글씨
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // 기울임
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // 줄바꿈
        .replace(/\n/g, '<br>');
}

/**
 * AI 정보 조회
 */
function getAIInfo(model) {
    const info = {
        gemini: { name: 'Gemini', icon: '🌟', color: '#4285F4' },
        chatgpt: { name: 'ChatGPT', icon: '🤖', color: '#10A37F' },
        perplexity: { name: 'Perplexity', icon: '🔍', color: '#1FB8CD' }
    };
    return info[model] || { name: model, icon: '🤖', color: '#718096' };
}

/**
 * 모델 가격 조회
 */
function getModelPrice(model) {
    if (pricing[model]) {
        return pricing[model].price || 0;
    }
    const defaultPrices = { gemini: 100, chatgpt: 150, perplexity: 120 };
    return defaultPrices[model] || 100;
}

/**
 * 크레딧 표시 업데이트
 */
function updateCreditDisplay() {
    if (elements.userCreditEl) {
        elements.userCreditEl.textContent = userCredit.toLocaleString();
    }
}

/**
 * 크레딧 부족 경고 표시
 */
function showCreditWarning() {
    const modelPrice = getModelPrice(selectedAI);
    console.warn(`크레딧 부족: 보유 ${userCredit}원, 필요 ${modelPrice}원`);
}

/**
 * 크레딧 부족 모달 표시
 */
function showCreditModal() {
    const modal = elements.creditModal;
    if (!modal) return;

    document.getElementById('modal-credit').textContent = userCredit.toLocaleString();
    document.getElementById('modal-needed').textContent = getModelPrice(selectedAI).toLocaleString();

    modal.hidden = false;
    modal.classList.add('show');
}

/**
 * 모달 닫기
 */
function closeModal() {
    const modal = elements.creditModal;
    if (modal) {
        modal.hidden = true;
        modal.classList.remove('show');
    }
}

/**
 * 최근 대화 컨텍스트 가져오기 (최대 5개)
 */
function getRecentContext() {
    return chatHistory.slice(-10);
}

/**
 * 클립보드 복사
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('복사되었습니다');
    } catch (error) {
        console.error('복사 실패:', error);
    }
}

/**
 * 토스트 메시지 표시
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

/**
 * 로그아웃 처리
 */
function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    window.location.href = '/pages/auth/login.html';
}

/**
 * 액세스 토큰 가져오기
 */
function getAccessToken() {
    return localStorage.getItem('accessToken') || '';
}
