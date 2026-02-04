/**
 * SSAL Works - Modal Module
 * @task S5F3
 * @version 1.0.0
 * @created 2026-01-02
 * @description 모달/팝업 관련 함수 모듈
 *
 * 제공 함수:
 * - openGuideModalFromUrl(title, guideUrl, confirmMessage, hasAction): 안내문 모달 열기
 * - openGuideModalWithConfirm(title, content, confirmMessage, hasAction): 컨펌 모달 열기
 * - closeGuidePopup(): 안내문 팝업 닫기
 * - initDragPopup(): 팝업 드래그 기능 초기화
 * - showReportModal(title, htmlContent): 리포트 모달 표시
 */

// 현재 스테이지 데이터 (다른 스크립트에서 설정)
let currentStageData = null;
window.currentStageData = currentStageData;

/**
 * 팝업 드래그 기능 초기화
 */
function initDragPopup() {
    const popup = document.getElementById('guidePopup');
    const header = document.getElementById('guidePopupHeader');

    if (!popup || !header) return;

    let isDragging = false;
    let offsetX, offsetY;

    header.onmousedown = function(e) {
        isDragging = true;
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;

        document.onmousemove = function(e) {
            if (isDragging) {
                popup.style.left = (e.clientX - offsetX) + 'px';
                popup.style.top = (e.clientY - offsetY) + 'px';
                popup.style.right = 'auto';
            }
        };

        document.onmouseup = function() {
            isDragging = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

/**
 * 안내문 팝업 닫기
 */
function closeGuidePopup() {
    const popup = document.getElementById('guidePopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

/**
 * 외부 URL에서 안내문 로드하여 팝업 표시
 * @param {string} title - 팝업 제목
 * @param {string} guideUrl - 가이드 URL (guides/xxx.html 형식)
 * @param {string} confirmMessage - 확인 메시지
 * @param {boolean} hasAction - 액션 버튼 표시 여부
 */
function openGuideModalFromUrl(title, guideUrl, confirmMessage, hasAction = true) {
    // 모바일에서 좌측 사이드바 자동 닫기
    if (typeof closeLeftSidebar === 'function') {
        closeLeftSidebar();
    } else {
        const leftSidebarEl = document.querySelector('.left-sidebar');
        const sidebarOverlayEl = document.querySelector('.sidebar-overlay');
        if (leftSidebarEl) leftSidebarEl.classList.remove('open');
        if (sidebarOverlayEl) sidebarOverlayEl.classList.remove('active');
    }

    const popup = document.getElementById('guidePopup');
    const popupTitle = document.getElementById('guidePopupTitle');
    const popupContent = document.getElementById('guidePopupContent');

    if (!popup || !popupTitle || !popupContent) {
        console.error('가이드 팝업 요소를 찾을 수 없습니다.');
        return;
    }

    popupTitle.textContent = `📖 ${title} 안내`;

    // guideUrl에서 키 추출: 'guides/S1_개발_준비.html' -> 'S1_개발_준비'
    const guideKey = guideUrl.replace('guides/', '').replace('.html', '');

    // GUIDE_CONTENTS에서 HTML 콘텐츠 가져오기
    const htmlContent = (typeof GUIDE_CONTENTS !== 'undefined') ? GUIDE_CONTENTS[guideKey] : null;

    if (htmlContent) {
        // 버튼 섹션 생성
        let buttonSection = '';
        if (hasAction) {
            buttonSection = `
            <div style="margin-top: 24px; padding-top: 16px; border-top: 3px solid #1a3a5c;">
                <p style="font-weight: 600; color: #333; margin-bottom: 10px; font-size: 15px;">위의 작업을 위하여 준비된 Order Sheet 템플릿을 Control Desk에 로딩하시겠습니까?</p>
                <div style="display: flex; gap: 12px;">
                    <button onclick="executeStageAction()" style="flex: 1; padding: 10px 16px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">확인</button>
                    <button onclick="closeGuidePopup()" style="flex: 1; padding: 10px 16px; background: #6c757d; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">취소</button>
                </div>
            </div>
            `;
        } else {
            buttonSection = `
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #dee2e6;">
                <div style="display: flex; justify-content: center;">
                    <button onclick="closeGuidePopup()" style="padding: 10px 32px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">확인</button>
                </div>
            </div>
            `;
        }

        popupContent.innerHTML = htmlContent + buttonSection;
    } else {
        console.error('안내문 로드 오류: GUIDE_CONTENTS에서 찾을 수 없음 -', guideKey);
        popupContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #EF4444;">
                <p>❌ 안내문을 불러오지 못했습니다.</p>
                <p style="font-size: 11px; color: #666; margin-top: 8px;">키: ${guideKey}</p>
            </div>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #dee2e6;">
                <div style="display: flex; justify-content: center;">
                    <button onclick="closeGuidePopup()" style="padding: 10px 32px; background: #6c757d; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">닫기</button>
                </div>
            </div>
        `;
    }

    popup.style.display = 'block';
    initDragPopup();
}

/**
 * 컨펌 모달 열기
 * @param {string} title - 팝업 제목
 * @param {string} content - HTML 콘텐츠
 * @param {string} confirmMessage - 확인 메시지
 * @param {boolean} hasAction - 액션 버튼 표시 여부
 */
function openGuideModalWithConfirm(title, content, confirmMessage, hasAction = true) {
    // 모바일에서 좌측 사이드바 자동 닫기
    if (typeof closeLeftSidebar === 'function') {
        closeLeftSidebar();
    } else {
        const leftSidebarEl = document.querySelector('.left-sidebar');
        const sidebarOverlayEl = document.querySelector('.sidebar-overlay');
        if (leftSidebarEl) leftSidebarEl.classList.remove('open');
        if (sidebarOverlayEl) sidebarOverlayEl.classList.remove('active');
    }

    const popup = document.getElementById('guidePopup');
    const popupTitle = document.getElementById('guidePopupTitle');
    const popupContent = document.getElementById('guidePopupContent');

    if (!popup || !popupTitle || !popupContent) {
        console.error('가이드 팝업 요소를 찾을 수 없습니다.');
        return;
    }

    popupTitle.textContent = `📖 ${title} 안내`;

    // hasAction이 true면 [예]/[아니오] 버튼, false면 [확인] 버튼만
    let buttonSection = '';
    if (hasAction) {
        buttonSection = `
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #dee2e6;">
            <p style="font-weight: 600; color: #333; margin-bottom: 10px;">${confirmMessage}</p>
            <div style="display: flex; gap: 12px;">
                <button onclick="executeStageAction()" style="flex: 1; padding: 10px 16px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">예</button>
                <button onclick="loadOrderSheetToWorkspace()" style="flex: 1; padding: 10px 16px; background: #6c757d; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">아니오</button>
            </div>
        </div>
        `;
    } else {
        buttonSection = `
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #dee2e6;">
            <div style="display: flex; justify-content: center;">
                <button onclick="closeGuidePopup()" style="padding: 10px 32px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">확인</button>
            </div>
        </div>
        `;
    }

    popupContent.innerHTML = content + buttonSection;
    popup.style.display = 'block';
    initDragPopup();
}

/**
 * 리포트 모달 표시
 * @param {string} title - 모달 제목
 * @param {string} htmlContent - HTML 콘텐츠
 */
function showReportModal(title, htmlContent) {
    // 기존 모달 제거
    const existingModal = document.getElementById('reportModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; max-width: 800px; width: 90%; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column;">
            <div style="padding: 20px 24px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 700;">📄 ${title}</h3>
                <button onclick="this.closest('#reportModal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666; line-height: 1;">&times;</button>
            </div>
            <div class="report-content" style="padding: 24px; overflow-y: auto; flex: 1;">
                ${htmlContent}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 배경 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // ESC 키로 닫기
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// 전역 함수로 노출
window.initDragPopup = initDragPopup;
window.closeGuidePopup = closeGuidePopup;
window.openGuideModalFromUrl = openGuideModalFromUrl;
window.openGuideModalWithConfirm = openGuideModalWithConfirm;
window.showReportModal = showReportModal;

console.log('📦 modal.js 로드 완료');
