/**
 * SSAL Works - Sidebar Module
 * @task S5F3
 * @version 1.0.0
 * @created 2026-01-02
 * @description 사이드바 관련 함수 모듈
 *
 * 제공 함수:
 * - toggleProcessPrep(el): 준비단계 토글
 * - toggleProcess(el): 프로세스 토글
 * - toggleKnowledge(el): 학습 콘텐츠 토글
 * - toggleKnowledgeSmall(el): 학습 콘텐츠 소분류 토글
 * - toggleProcessTiny(el): 프로세스 3단계 토글
 * - toggleLeftSidebar(): 왼쪽 사이드바 토글 (모바일)
 * - toggleRightSidebar(): 오른쪽 사이드바 토글 (모바일)
 * - closeLeftSidebar(): 왼쪽 사이드바 닫기
 * - closeRightSidebar(): 오른쪽 사이드바 닫기
 * - closeAllSidebars(): 모든 사이드바 닫기
 */

// DOM 요소 참조 (DOMContentLoaded 후 초기화)
let leftSidebar = null;
let rightSidebar = null;
let sidebarOverlay = null;

/**
 * 사이드바 DOM 요소 초기화
 */
function initSidebarElements() {
    leftSidebar = document.querySelector('.left-sidebar');
    rightSidebar = document.querySelector('.right-sidebar');
    sidebarOverlay = document.querySelector('.sidebar-overlay');
}

// ========================================
// 프로세스 토글 함수들
// ========================================

/**
 * 준비단계 토글 (○)
 */
function toggleProcessPrep(el) {
    const item = el.parentElement;
    const smallList = item.querySelector('.process-small-list');
    const arrow = el.querySelector('.process-arrow');

    if (smallList) {
        smallList.classList.toggle('expanded');
        if (arrow) {
            arrow.classList.toggle('expanded');
        }
    }
}

/**
 * 프로세스 토글
 */
function toggleProcess(el) {
    const item = el.parentElement;
    const smallList = item.querySelector('.process-small-list');
    const arrow = el.querySelector('.process-arrow');

    if (smallList) {
        smallList.classList.toggle('expanded');
        if (arrow) {
            arrow.classList.toggle('expanded');
        }
    }

    document.querySelectorAll('.process-major').forEach(major => {
        if (major !== el) major.classList.remove('active');
    });
    if (!el.classList.contains('completed')) {
        el.classList.toggle('active');
    }
}

/**
 * 학습 콘텐츠 토글 (2단계)
 */
function toggleKnowledge(el) {
    const item = el.parentElement;
    const mediumList = item.querySelector('.knowledge-medium-list');
    const arrow = el.querySelector('.knowledge-arrow');

    if (mediumList) {
        mediumList.classList.toggle('expanded');
        if (arrow) {
            arrow.classList.toggle('expanded');
        }
    }
}

/**
 * 학습 콘텐츠 소분류 토글 (3단계)
 */
function toggleKnowledgeSmall(el) {
    const nextSibling = el.nextElementSibling;
    const arrow = el.querySelector('.knowledge-medium-arrow');

    if (nextSibling && nextSibling.classList.contains('knowledge-small-list')) {
        nextSibling.classList.toggle('expanded');
        if (arrow) {
            arrow.classList.toggle('expanded');
        }
    }
}

/**
 * 프로세스 3단계 토글
 */
function toggleProcessTiny(el) {
    const nextSibling = el.nextElementSibling;
    const arrow = el.querySelector('.process-small-arrow');

    if (nextSibling && nextSibling.classList.contains('process-tiny-list')) {
        nextSibling.classList.toggle('expanded');
        if (arrow) {
            arrow.classList.toggle('expanded');
        }
    }
}

// ========================================
// 모바일 사이드바 함수들
// ========================================

/**
 * 왼쪽 사이드바 토글
 */
function toggleLeftSidebar() {
    if (!leftSidebar) initSidebarElements();
    if (leftSidebar) {
        leftSidebar.classList.toggle('open');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        if (rightSidebar) rightSidebar.classList.remove('open');
    }
}

/**
 * 오른쪽 사이드바 토글
 */
function toggleRightSidebar() {
    if (!rightSidebar) initSidebarElements();
    if (rightSidebar) {
        rightSidebar.classList.toggle('open');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        if (leftSidebar) leftSidebar.classList.remove('open');
    }
}

/**
 * 왼쪽 사이드바 닫기
 */
function closeLeftSidebar() {
    if (!leftSidebar) initSidebarElements();
    if (leftSidebar) leftSidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

/**
 * 오른쪽 사이드바 닫기
 */
function closeRightSidebar() {
    if (!rightSidebar) initSidebarElements();
    if (rightSidebar) rightSidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

/**
 * 모든 사이드바 닫기
 */
function closeAllSidebars() {
    if (!leftSidebar) initSidebarElements();
    if (leftSidebar) leftSidebar.classList.remove('open');
    if (rightSidebar) rightSidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

// ESC 키로 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllSidebars();
    }
});

// DOMContentLoaded 시 초기화
document.addEventListener('DOMContentLoaded', initSidebarElements);

// 전역 함수로 노출
window.toggleProcessPrep = toggleProcessPrep;
window.toggleProcess = toggleProcess;
window.toggleKnowledge = toggleKnowledge;
window.toggleKnowledgeSmall = toggleKnowledgeSmall;
window.toggleProcessTiny = toggleProcessTiny;
window.toggleLeftSidebar = toggleLeftSidebar;
window.toggleRightSidebar = toggleRightSidebar;
window.closeLeftSidebar = closeLeftSidebar;
window.closeRightSidebar = closeRightSidebar;
window.closeAllSidebars = closeAllSidebars;
window.initSidebarElements = initSidebarElements;

console.log('📦 sidebar.js 로드 완료');
