// P3 하위 항목 STAGE_DATA 확장
// 이 파일은 index.html 로드 후 STAGE_DATA에 P3 항목을 추가합니다

document.addEventListener('DOMContentLoaded', function() {
    // STAGE_DATA가 존재하는지 확인하고 P3 항목 추가
    if (typeof STAGE_DATA !== 'undefined') {
        Object.assign(STAGE_DATA, {
            'p3_doc': {
                stageId: 'p3_doc',
                stageName: 'Documentation',
                templateKey: 'P3_Documentation',
                hasAction: true,
                confirmMessage: 'Documentation 작업을 진행하시겠습니까?',
                orderSheetAfterExecute: '',
                orderSheet: '',
                guideContent: `
<h2 style="color: var(--primary-dark); border-bottom: 2px solid var(--primary); padding-bottom: 8px;">📄 Documentation 안내</h2>
<h3 style="margin-top: 24px; color: #333;">작업 항목</h3>
<ul style="padding-left: 20px;">
<li style="margin-bottom: 8px;">프로젝트 문서화</li>
<li style="margin-bottom: 8px;">API 문서 작성</li>
<li style="margin-bottom: 8px;">사용자 가이드 작성</li>
</ul>
`
            },
            'p3_frontend': {
                stageId: 'p3_frontend',
                stageName: 'Frontend',
                templateKey: 'P3_Frontend',
                hasAction: true,
                confirmMessage: 'Frontend 작업을 진행하시겠습니까?',
                orderSheetAfterExecute: '',
                orderSheet: '',
                guideContent: `
<h2 style="color: var(--primary-dark); border-bottom: 2px solid var(--primary); padding-bottom: 8px;">💻 Frontend 안내</h2>
<h3 style="margin-top: 24px; color: #333;">작업 항목</h3>
<ul style="padding-left: 20px;">
<li style="margin-bottom: 8px;">HTML/CSS 개발</li>
<li style="margin-bottom: 8px;">JavaScript 기능 구현</li>
<li style="margin-bottom: 8px;">반응형 디자인</li>
</ul>
`
            },
            'p3_database': {
                stageId: 'p3_database',
                stageName: 'Database',
                templateKey: 'P3_Database',
                hasAction: true,
                confirmMessage: 'Database 작업을 진행하시겠습니까?',
                orderSheetAfterExecute: '',
                orderSheet: '',
                guideContent: `
<h2 style="color: var(--primary-dark); border-bottom: 2px solid var(--primary); padding-bottom: 8px;">🗄️ Database 안내</h2>
<h3 style="margin-top: 24px; color: #333;">작업 항목</h3>
<ul style="padding-left: 20px;">
<li style="margin-bottom: 8px;">데이터베이스 스키마 설계</li>
<li style="margin-bottom: 8px;">테이블 생성 및 관계 설정</li>
<li style="margin-bottom: 8px;">RLS 정책 구현</li>
</ul>
`
            }
        });
        console.log('✅ P3 STAGE_DATA 확장 완료');
    }
});
