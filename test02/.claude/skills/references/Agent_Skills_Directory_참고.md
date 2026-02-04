# Agent Skills Directory (skills.sh) 참고자료

> **출처**: https://skills.sh/
> **조사일**: 2026-02-01
> **용도**: Claude Code 스킬 제작 시 참고할 외부 스킬 패턴 모음

---

## 개요

skills.sh는 AI 에이전트(Claude Code, Cursor, Copilot 등)용 재사용 스킬을 공유하는 오픈 디렉토리.
설치: `npx skills add <owner/repo>`

---

## 추천 스킬 분류 (SSAL Works 관점에서 유용한 것)

### A. 스킬 제작 방법론 (필수 참고)

| 스킬 | 출처 | 설치수 | 핵심 |
|------|------|--------|------|
| **skill-creator** | anthropics/skills | 14.6K | 스킬 제작 공식 가이드 |

**핵심 요약 (skill-creator)**:
- 스킬 = SKILL.md (필수) + scripts/ + references/ + assets/ (선택)
- YAML frontmatter: `name`과 `description`만 포함 (description이 트리거 역할)
- Progressive Disclosure: 메타데이터(항상) → SKILL.md(트리거 시) → 번들 리소스(필요 시)
- SKILL.md는 500줄 이하 유지, 상세 내용은 references/ 파일로 분리
- 제작 프로세스: 구체적 예시 수집 → 재사용 자원 계획 → 초기화 → 편집 → 패키징 → 반복

---

### B. 개발 방법론 스킬 (obra/superpowers)

| 스킬 | 설치수 | 핵심 |
|------|--------|------|
| **systematic-debugging** | 3.5K | 4단계 체계적 디버깅 프로세스 |
| **test-driven-development** | 3.2K | TDD Red-Green-Refactor 철칙 |
| **writing-plans** | 3.0K | 구현 계획 작성법 (bite-sized tasks) |
| **verification-before-completion** | 2.9K | 완료 주장 전 검증 필수 |
| **brainstorming** | 5.8K | 아이디어 → 설계 협업 대화법 |

#### systematic-debugging 핵심:
```
Phase 1: 근본 원인 조사 (에러 읽기, 재현, 변경 확인, 증거 수집)
Phase 2: 패턴 분석 (작동 예시와 비교)
Phase 3: 가설과 테스트 (최소 변경으로 검증)
Phase 4: 구현 (실패 테스트 작성 → 단일 수정 → 검증)
```
- 3번 이상 수정 실패 시: 아키텍처 자체를 재검토
- "빠른 수정" "일단 시도" "간단한 문제" = 모두 위험 신호

#### test-driven-development 핵심:
```
RED:   실패하는 테스트 작성
GREEN: 테스트 통과하는 최소 코드 작성
REFACTOR: 정리 (테스트는 계속 통과)
```
- 테스트 없이 프로덕션 코드 작성 금지
- 구현 코드를 먼저 작성했으면 삭제하고 TDD로 재시작
- "나중에 테스트 추가" = 즉시 통과하므로 아무것도 증명 못함

#### writing-plans 핵심:
- 각 단계는 2-5분 분량의 단일 행동
- 정확한 파일 경로, 완전한 코드, 실행 명령어 포함
- TDD 기반: 실패 테스트 작성 → 실패 확인 → 구현 → 통과 확인 → 커밋
- 저장: `docs/plans/YYYY-MM-DD-<feature-name>.md`

#### verification-before-completion 핵심:
```
1. IDENTIFY: 무엇이 이 주장을 증명하는가?
2. RUN: 검증 명령어 실행
3. READ: 출력 전체 확인
4. VERIFY: 출력이 주장을 확인하는가?
5. THEN: 주장
```
- "아마 될 것", "확신한다" = 증거가 아님
- "should", "probably" 사용 = 즉시 중단 신호

---

### C. 프론트엔드/디자인

| 스킬 | 출처 | 설치수 | 핵심 |
|------|------|--------|------|
| **frontend-design** | anthropics/skills | 29.4K | 프로덕션급 UI 디자인 가이드 |
| **web-design-guidelines** | vercel-labs/agent-skills | 58.2K | 웹 디자인 가이드라인 |
| **vercel-react-best-practices** | vercel-labs/agent-skills | 76.7K | React 베스트 프랙티스 |

#### frontend-design 핵심:
- 코딩 전 디자인 씽킹: 목적, 톤, 제약, 차별점 결정
- 타이포그래피: Arial, Inter 같은 범용 폰트 금지 → 개성 있는 폰트 선택
- 컬러: CSS 변수로 일관성, 강한 주색 + 날카로운 악센트
- 모션: CSS-only 우선, 스크롤 트리거, hover 서프라이즈
- "AI 생성 느낌" 금지: 보라색 그라데이션, 뻔한 레이아웃 회피

---

### D. 인프라/백엔드

| 스킬 | 출처 | 설치수 | 핵심 |
|------|------|--------|------|
| **supabase-postgres-best-practices** | supabase/agent-skills | 8.2K | Postgres 성능 최적화 |
| **mcp-builder** | anthropics/skills | 3.9K | MCP 서버 구축 가이드 |
| **webapp-testing** | anthropics/skills | 4.1K | Playwright 기반 웹앱 테스트 |

#### supabase-postgres-best-practices 핵심:
- 8개 카테고리 우선순위별 규칙:
  1. 쿼리 성능 (CRITICAL)
  2. 연결 관리 (CRITICAL)
  3. 보안 & RLS (CRITICAL)
  4. 스키마 설계 (HIGH)
  5. 동시성 & 잠금 (MEDIUM-HIGH)
  6. 데이터 접근 패턴 (MEDIUM)
  7. 모니터링 & 진단 (LOW-MEDIUM)
  8. 고급 기능 (LOW)

#### mcp-builder 핵심:
- 4단계: 리서치/계획 → 구현 → 리뷰/테스트 → 평가
- TypeScript 권장 (SDK 지원, 호환성)
- Transport: 원격=Streamable HTTP, 로컬=stdio
- 도구 네이밍: 일관된 접두어 (github_create_issue 등)
- Actionable 에러 메시지 필수

#### webapp-testing 핵심:
- Playwright + Python 기반
- 정적 HTML: 직접 읽어서 셀렉터 파악
- 동적 앱: `networkidle` 대기 후 DOM 검사
- `scripts/with_server.py`로 서버 라이프사이클 관리

---

### E. 마케팅/콘텐츠 (참고용)

| 스킬 | 출처 | 설치수 | 핵심 |
|------|------|--------|------|
| seo-audit | coreyhaines31/marketingskills | 9.2K | SEO 감사 |
| copywriting | coreyhaines31/marketingskills | 6.5K | 카피라이팅 |
| marketing-psychology | coreyhaines31/marketingskills | 5.0K | 마케팅 심리학 |
| programmatic-seo | coreyhaines31/marketingskills | 4.2K | 프로그래매틱 SEO |
| pricing-strategy | coreyhaines31/marketingskills | 3.6K | 가격 전략 |

---

### F. 문서/오피스

| 스킬 | 출처 | 설치수 | 핵심 |
|------|------|--------|------|
| pdf | anthropics/skills | 5.8K | PDF 처리 |
| pptx | anthropics/skills | 4.8K | PowerPoint 생성 |
| xlsx | anthropics/skills | 4.5K | Excel 처리 |
| docx | anthropics/skills | 4.4K | Word 문서 처리 |

---

## 스킬 설치 방법

```bash
# 특정 스킬 설치 (프로젝트 .claude/skills/에 추가됨)
npx skills add anthropics/skills/skill-creator
npx skills add obra/superpowers/systematic-debugging
npx skills add supabase/agent-skills/supabase-postgres-best-practices

# 전체 스킬팩 설치
npx skills add obra/superpowers
npx skills add anthropics/skills
```

---

## SSAL Works Custom Skills 제작 시 참고 사항

### skill-creator에서 배울 점:
1. **description이 트리거**: 본문이 아닌 frontmatter description이 스킬 활성화 결정
2. **Progressive Disclosure**: SKILL.md는 간결하게, 상세 내용은 references/로 분리
3. **재사용 자원 분류**: scripts(실행), references(참조), assets(출력물)
4. **SKILL.md 500줄 이하**: 컨텍스트 윈도우는 공유 자원

### obra/superpowers에서 배울 점:
1. **프로세스 명문화**: 각 단계를 명확히 정의하고 건너뛰기 금지
2. **합리화 방지 테이블**: "이번만" "간단하니까" 등 변명 목록화
3. **빨간 깃발 패턴**: 위반 징후 구체적 나열 → 즉시 중단 신호
4. **관련 스킬 참조**: `superpowers:test-driven-development` 형태로 연결

### 우리 Custom Skills와의 차이:
| 항목 | skills.sh | SSAL Works Custom Skills |
|------|-----------|--------------------------|
| 대상 | Claude Code 직접 사용 | 이용자가 다운로드 → 자기 프로젝트에 배치 |
| 설치 | npx skills add | 수동 다운로드 → .claude/skills/ |
| 번들 리소스 | scripts/, references/, assets/ | SKILL.md 단일 파일 |
| 성격 | 즉시 사용 가능 | 구축 가이드 템플릿 |

---

## GitHub 추가 수집 스킬 (2026-02-01)

### G. 서브에이전트/병렬 작업 (obra/superpowers - 고급)

| 스킬 | 핵심 |
|------|------|
| **dispatching-parallel-agents** | 독립적 문제를 병렬 에이전트로 분배 |
| **subagent-driven-development** | 계획 → 서브에이전트 배치 → 2단계 리뷰 |

#### dispatching-parallel-agents 핵심:
- 2개 이상의 독립적 문제가 있을 때 에이전트 1개씩 할당
- 패턴: 독립 도메인 식별 → 에이전트 태스크 생성 → 병렬 배치 → 결과 통합
- 에이전트 프롬프트: 범위 한정 + 맥락 제공 + 제약 명시 + 출력 형식 지정
- 사용 금지: 실패들이 관련되어 있거나, 공유 상태가 있거나, 탐색 단계일 때

#### subagent-driven-development 핵심:
- 태스크당 새 서브에이전트 배치 (컨텍스트 오염 방지)
- 2단계 리뷰: 스펙 준수 검토 → 코드 품질 검토
- 프로세스: 구현 → 셀프 리뷰 → 스펙 리뷰 → 품질 리뷰 → 완료
- 리뷰 이슈 있으면 수정 후 재리뷰 (건너뛰기 금지)

---

### H. Awesome Claude Skills 큐레이션 목록

> **출처**: github.com/ComposioHQ/awesome-claude-skills (28.6K stars)
> **출처**: github.com/travisvn/awesome-claude-skills (6.3K stars)

카테고리별 주요 스킬 요약:

| 카테고리 | 주요 스킬 | 출처 |
|----------|----------|------|
| 문서 처리 | docx, pdf, pptx, xlsx | anthropics/skills |
| 생성 미술 | algorithmic-art (p5.js), canvas-design | anthropics/skills |
| 개발 도구 | frontend-design, mcp-builder, webapp-testing | anthropics/skills |
| 브랜드/커뮤니케이션 | brand-guidelines, internal-comms | anthropics/skills |
| 웹앱 빌더 | artifacts-builder (React+Tailwind+shadcn) | anthropics/skills |
| 브라우저 자동화 | dev-browser (3.4K stars) | SawyerHood |
| React Native | building-native-ui, expo 시리즈 | expo/skills |
| 인증 | better-auth-best-practices | better-auth/skills |
| Vue.js | vue-best-practices | hyf0/vue-skills |
| 마케팅 전체 | SEO, 카피라이팅, 가격전략 등 12개 | coreyhaines31/marketingskills |

---

### I. 기타 주목할 리포지토리

| 리포 | Stars | 설명 |
|------|-------|------|
| **ComposioHQ/awesome-claude-skills** | 28.6K | 최대 큐레이션 목록 |
| **travisvn/awesome-claude-skills** | 6.3K | Claude Code 특화 큐레이션 |
| **davepoon/buildwithclaude** | 2.3K | Skills + Agents + Commands 통합 허브 |
| **alirezarezvani/claude-skills** | 1.5K | 실사용 스킬 모음 |
| **alirezarezvani/claude-code-skill-factory** | 443 | 스킬 제작 자동화 툴킷 |

---

## 빠른 설치 명령어 모음

```bash
# === Anthropic 공식 ===
npx skills add anthropics/skills                    # 전체 (16개)
npx skills add anthropics/skills/skill-creator      # 스킬 제작 가이드
npx skills add anthropics/skills/mcp-builder        # MCP 서버 구축
npx skills add anthropics/skills/webapp-testing      # Playwright 테스트
npx skills add anthropics/skills/frontend-design     # 프론트엔드 디자인

# === 개발 방법론 (obra/superpowers) ===
npx skills add obra/superpowers                     # 전체 (14개)
npx skills add obra/superpowers/systematic-debugging
npx skills add obra/superpowers/test-driven-development
npx skills add obra/superpowers/verification-before-completion
npx skills add obra/superpowers/dispatching-parallel-agents
npx skills add obra/superpowers/subagent-driven-development

# === 인프라 ===
npx skills add supabase/agent-skills                # Supabase Postgres
npx skills add vercel-labs/agent-skills             # React + 웹 디자인

# === 마케팅 ===
npx skills add coreyhaines31/marketingskills        # 전체 (12개)
```
