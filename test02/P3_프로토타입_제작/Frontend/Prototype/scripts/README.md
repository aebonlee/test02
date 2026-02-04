# SSAL Works 콘텐츠 자동화 스크립트

이 폴더에는 학습 콘텐츠 및 매뉴얼을 자동으로 처리하는 스크립트가 포함되어 있습니다.

## 스크립트 목록

| 스크립트 | 용도 |
|---------|------|
| `sync-learning-contents.js` | 학습콘텐츠 MD→HTML 변환 및 DB 동기화 |
| `sync-manuals.js` | 매뉴얼 MD→HTML 변환 및 DB 동기화 (예정) |

## 사전 요구사항

### Node.js
- Node.js 18.x 이상 필요
- `node --version`으로 확인

### 환경 변수
프로젝트 루트에 `.env` 파일을 생성하고 다음 값을 설정:

```env
# Supabase 설정
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJxxx...

# GitHub Pages 설정
GITHUB_PAGES_BASE_URL=https://your-username.github.io/your-repo
```

## 학습콘텐츠 동기화

### 기본 사용법

```bash
# 프로젝트 루트에서 실행
cd C:\!SSAL_Works_Private

# 전체 동기화 (학습용_Books/ 폴더 전체)
node P3_프로토타입_제작/Scripts/sync-learning-contents.js
```

### 옵션

| 옵션 | 설명 |
|------|------|
| `--dry-run` | 실제 저장 없이 변경 사항만 확인 |
| `--force` | 모든 파일 강제 재처리 (해시 변경 무시) |
| `--path="경로"` | 특정 폴더만 처리 |
| `--help` | 도움말 표시 |

### 예시

```bash
# 변경 사항 미리 확인 (실제 저장 X)
node P3_프로토타입_제작/Scripts/sync-learning-contents.js --dry-run

# 특정 폴더만 처리
node P3_프로토타입_제작/Scripts/sync-learning-contents.js --path="1_웹개발_기초"

# 모든 파일 강제 재처리
node P3_프로토타입_제작/Scripts/sync-learning-contents.js --force
```

## MD 파일 작성 규칙

### Frontmatter 필수 항목

모든 MD 파일은 다음 YAML Frontmatter를 포함해야 합니다:

```yaml
---
depth1: "대분류명"
depth2: "중분류명"
depth3: "소분류명"
title: "콘텐츠 제목"
description: "콘텐츠 설명"
display_order: 1
---

# 본문 시작

콘텐츠 내용...
```

### 필드 설명

| 필드 | 필수 | 설명 |
|------|------|------|
| `depth1` | O | 대분류 (예: "웹개발 기초") |
| `depth2` | O | 중분류 (예: "HTML/CSS") |
| `depth3` | X | 소분류 (없으면 생략 가능) |
| `title` | O | 콘텐츠 제목 |
| `description` | O | 콘텐츠 설명 (목록에 표시) |
| `display_order` | X | 정렬 순서 (기본값: 0) |

### 파일 구조 예시

```
학습용_Books/
├── 1_웹개발_기초/
│   ├── HTML_CSS/
│   │   ├── 01_HTML_기본구조.md
│   │   └── 02_폼_요소.md
│   └── JavaScript/
│       └── 01_변수와_타입.md
└── 2_Supabase/
    └── 시작하기/
        └── 01_프로젝트_생성.md
```

## 처리 과정

1. **MD 파일 스캔**: `학습용_Books/` 폴더에서 모든 `.md` 파일 찾기
2. **Frontmatter 파싱**: YAML 헤더에서 메타데이터 추출
3. **변경 감지**: 파일 해시 비교 (변경된 파일만 처리)
4. **MD→HTML 변환**: Markdown을 HTML로 변환, 템플릿 적용
5. **HTML 저장**: `Frontend/Prototype/pages/learning/contents/`에 저장
6. **DB 동기화**: Supabase `learning_contents` 테이블에 INSERT/UPDATE

## 템플릿

`templates/` 폴더에 HTML 템플릿이 있습니다:

| 파일 | 용도 |
|------|------|
| `learning-content.html` | 학습콘텐츠용 템플릿 |
| `manual.html` | 매뉴얼용 템플릿 |

### 템플릿 변수

| 변수 | 설명 |
|------|------|
| `{{TITLE}}` | 콘텐츠 제목 |
| `{{DESCRIPTION}}` | 콘텐츠 설명 |
| `{{DEPTH1}}` | 대분류 |
| `{{DEPTH2}}` | 중분류 |
| `{{DEPTH3_BREADCRUMB}}` | 소분류 (있으면 표시) |
| `{{CONTENT}}` | 변환된 HTML 본문 |
| `{{UPDATE_DATE}}` | 업데이트 날짜 |

## 출력 예시

```
============================================================
[학습콘텐츠 동기화 시작]
============================================================
스캔 대상: C:\!SSAL_Works_Private\학습용_Books
------------------------------------------------------------
발견된 MD 파일: 15개

[1/15] 1_웹개발_기초/HTML_CSS/01_HTML_기본구조.md
  - depth1: 웹개발 기초
  - depth2: HTML/CSS
  - depth3: (없음)
  - title: HTML 기본 구조 이해하기
  ✅ HTML 변환 완료
  ✅ DB 등록 완료 (INSERT)

[2/15] 1_웹개발_기초/HTML_CSS/02_폼_요소.md
  - depth1: 웹개발 기초
  - depth2: HTML/CSS
  - depth3: 폼
  - title: HTML 폼 태그 완벽 가이드
  ✓ 변경 없음 (해시 동일)

...

============================================================
[동기화 완료]
============================================================
  - 처리된 파일: 15개
  - 신규 등록: 10개
  - 업데이트: 3개
  - 변경 없음: 2개
  - 건너뜀: 0개
  - 실패: 0개
```

## 문제 해결

### "Supabase 설정이 없어 DB 조회를 건너뜁니다"
→ `.env` 파일에 `SUPABASE_URL`과 `SUPABASE_ANON_KEY` 설정 필요

### "필수 필드(depth1, title)가 없습니다"
→ MD 파일 Frontmatter에 `depth1`, `title` 필드 추가 필요

### "디렉토리가 존재하지 않음"
→ `학습용_Books/` 폴더 경로 확인

## 관련 문서

- [학습콘텐츠 제공 시스템](../../P2_프로젝트_기획/1-8_Content_System/학습콘텐츠_제공_시스템.md)
- [매뉴얼 제공 시스템](../../P2_프로젝트_기획/1-8_Content_System/매뉴얼_제공_시스템.md)
