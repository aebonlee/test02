# S3E1: AI API 키 설정 가이드

## Task 정보
- **Task ID**: S3E1
- **Area**: External (외부 연동)
- **Execution Type**: Human-Assisted
- **Status**: Completed

## 설정된 API 키

| Provider | 환경변수명 | 설정 위치 |
|----------|-----------|----------|
| Gemini | `GEMINI_API_KEY` | Vercel 환경변수 |
| ChatGPT | `OPENAI_API_KEY` | Vercel 환경변수 |
| Perplexity | `PERPLEXITY_API_KEY` | Vercel 환경변수 |

## 설정 방법

1. **Vercel Dashboard 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Environment Variables**
   - 각 API 키를 환경변수로 추가
   - Production, Preview, Development 모두 적용

3. **API 키 발급 위치**
   - Gemini: https://makersuite.google.com/app/apikey
   - ChatGPT: https://platform.openai.com/api-keys
   - Perplexity: https://www.perplexity.ai/settings/api

## 보안 주의사항

- API 키는 절대 Git에 커밋하지 않음
- .env 파일은 .gitignore에 포함
- Vercel 환경변수로만 관리

## 검증 완료

- [x] Gemini API 테스트 성공
- [x] ChatGPT API 테스트 성공
- [x] Perplexity API 테스트 성공
- [x] /api/ai/health 헬스체크 정상

---
**Completed**: 2025-12-19
