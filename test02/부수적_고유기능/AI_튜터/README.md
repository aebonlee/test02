# AI 튜터 시스템

SSAL Works 학습 플랫폼의 AI 튜터 시스템 문서 및 소스코드 저장소

## 📁 폴더 구조

```
AI_튜터/
├── README.md (본 파일)
├── 작업_기록/ - 시간순 작업 기록
├── 테스트/ - 자동 테스트 스크립트 및 결과
├── 소스코드/ - AI 튜터 관련 소스코드 백업
│   ├── API/ - API 엔드포인트
│   └── RAG/ - RAG 파이프라인
├── 참고_자료/ - 시스템 프롬프트, RAG 설정 가이드
└── API_문서/ - API 사용법 문서
```

## 🎯 AI 튜터 시스템 개요

### 목적
- 웹 개발 및 프로젝트 관리 학습 콘텐츠 기반 Q&A
- RAG (Retrieval-Augmented Generation) 기반 정확한 답변
- 외부 서비스(Supabase, GitHub 등)와 SSAL Works 플랫폼을 명확히 구분

### 기술 스택
- **AI 모델**: Google Gemini 2.0 Flash Exp
- **임베딩**: Gemini embedding-001 (768차원)
- **데이터베이스**: Supabase (PostgreSQL + pgvector)
- **스트리밍**: SSE (Server-Sent Events)

### 주요 기능
1. **학습 콘텐츠 기반 답변**
   - RAG 파이프라인으로 관련 문서 검색
   - 임베딩 유사도 기반 컨텍스트 제공

2. **할루시네이션 방지**
   - 시스템 프롬프트에 명확한 지시사항
   - 외부 서비스와 SSAL Works 구분
   - Fallback 메시지 최적화

3. **자동 테스트 시스템**
   - 학습 콘텐츠 기반 테스트 케이스
   - 정답/오답 키워드 자동 검증
   - 할루시네이션 탐지

## 🔧 주요 컴포넌트

### 1. API 엔드포인트

**프로덕션 API**: `/api/ai-tutor/chat`
- 사용자 인증 필요 (JWT)
- 크레딧 차감 (1 크레딧/질문)
- Rate Limiting: 30 req/min

**테스트 API**: `/api/ai-tutor/test`
- 인증 우회 (테스트 전용)
- IP 기반 Rate Limiting: 5 req/min
- 프로덕션과 동일한 RAG + Gemini 로직

### 2. RAG 파이프라인

**워크플로우**:
```
사용자 질문
    ↓
임베딩 생성 (Gemini embedding-001)
    ↓
벡터 검색 (Supabase pgvector)
    ↓
유사 문서 5개 검색 (threshold: 0.3)
    ↓
프롬프트 구성 (시스템 프롬프트 + 컨텍스트 + 질문)
    ↓
Gemini 2.0 Flash 스트리밍 응답
```

**주요 설정**:
- `matchThreshold`: 0.3 (검색 감도)
- `matchCount`: 5 (검색 문서 수)
- `temperature`: 0.7 (생성 온도)

### 3. 시스템 프롬프트

**핵심 원칙**:
- ✅ SSAL Works = 학습 플랫폼
- ✅ Supabase, GitHub 등 = 외부 서비스 (절대 혼동 금지)
- ✅ 참조 문서의 URL/서비스명을 정확히 그대로 사용
- ❌ "SSAL Works에 로그인" 같은 표현 금지

**Fallback 메시지**:
> "해당 내용은 현재 제공된 학습 자료에서 찾을 수 없습니다. 질문을 다르게 표현하거나 더 구체적으로 해주세요."

## 🧪 테스트 시스템

### 자동 테스트 실행
```bash
cd C:\!SSAL_Works_Private
node 부수적_고유기능/AI_튜터/테스트/test-ai-tutor.js
```

### 테스트 케이스
1. Git 다운로드 (git-scm.com 확인)
2. Supabase API 키 위치
3. GitHub 개념
4. Supabase 데이터베이스 기반

### 검증 항목
- ✅ 정답 키워드 포함 여부
- ❌ 오답 키워드 포함 여부 (SSAL Works 혼동)
- 📊 결과 JSON 자동 생성

## 📚 참고 문서

- **작업 기록**: `작업_기록/` - 시간순 개선 작업 기록
- **참고 자료**: `참고_자료/` - 시스템 프롬프트, RAG 설정 가이드
- **API 문서**: `API_문서/` - 엔드포인트 사용법

## 🔗 관련 파일 위치

### 실제 운영 중인 파일 (수정 시 주의!)
```
api/External/ai-tutor-chat.js       # 프로덕션 API
api/External/ai-tutor-test.js       # 테스트 API
api/Backend_Infra/rag/prompt-builder.js   # 시스템 프롬프트
api/Backend_Infra/rag/index.js      # RAG 메인 로직
api/Backend_Infra/rag/embeddings.js # 임베딩 생성
```

### 백업 소스코드 (참조용)
```
소스코드/API/    # API 파일 백업
소스코드/RAG/    # RAG 파일 백업
```

## ⚙️ 주요 설정값

| 항목 | 값 | 설명 |
|------|-----|------|
| 모델 | gemini-2.0-flash-exp | 답변 생성 |
| 임베딩 모델 | embedding-001 | 768차원 |
| matchThreshold | 0.3 | 검색 감도 |
| matchCount | 5 | 검색 문서 수 |
| temperature | 0.7 | 생성 온도 |
| maxOutputTokens | 2048 | 최대 토큰 |

## 📊 성능 지표

### 현재 테스트 통과율: 75% (3/4)
- ✅ Git 다운로드: 100%
- ✅ Supabase API 키: 100%
- ✅ GitHub 개념: 100%
- ⚠️ Supabase 데이터베이스: RAG 임베딩 이슈

### 할루시네이션 방지: 100%
- ✅ "SSAL Works" 혼동 완전 제거
- ✅ 외부 서비스 정확한 구분

## 🚀 향후 개선 계획

1. **RAG 임베딩 재생성** (우선순위: 중)
   - Supabase 관련 콘텐츠 임베딩 개선
   - 테스트 통과율 100% 목표

2. **테스트 케이스 확장** (우선순위: 낮)
   - Next.js, Vercel 배포 관련 추가
   - 더 많은 외부 서비스 체크

3. **자동화된 순환 테스트** (우선순위: 낮)
   - GitHub Actions 통합
   - 프롬프트 수정 → 테스트 → 검증 자동화

## 📞 문의

AI 튜터 시스템 관련 문의는 프로젝트 관리자에게 연락하세요.

---

**최종 업데이트**: 2026-01-19
**작성자**: Claude Sonnet 4.5
**버전**: 1.0
