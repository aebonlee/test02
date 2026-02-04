# Perplexity AI 연동 가이드

## 설정 방법

### 1. API 키 발급
1. https://www.perplexity.ai 접속
2. 로그인 후 Settings → API 메뉴로 이동
3. "Generate New API Key" 클릭
4. API 키 복사

### 2. .env 파일 설정
```bash
cd External_Services/Perplexity
# .env 파일을 열어서 API 키 입력
PERPLEXITY_API_KEY=실제_발급받은_API_키
```

### 3. 서버 재시작
```bash
cd Web_ClaudeCode_Bridge
# 기존 서버 종료 (Ctrl+C)
node inbox_server.js
```

## 사용 방법

1. 대시보드 우측 사이드바의 "🔍 Perplexity에게 묻기" 섹션으로 이동
2. 질문 입력창에 질문 작성
3. "전송" 버튼 클릭
4. Workspace에 질문과 답변이 자동으로 표시됨

## API 크레딧

- Perplexity API는 유료 서비스입니다
- 크레딧 사용량은 우측 사이드바에 표시됩니다
- 크레딧이 부족하면 https://www.perplexity.ai/settings/api 에서 충전

## 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- API 키는 비밀번호처럼 안전하게 보관하세요
- 무분별한 질문은 크레딧을 빠르게 소진시킬 수 있습니다

## 문제 해결

### "Perplexity 서버에 연결할 수 없습니다" 오류
1. `.env` 파일에 API 키가 올바르게 입력되었는지 확인
2. inbox_server.js가 실행 중인지 확인
3. API 키가 유효한지 확인 (Perplexity 웹사이트에서 확인)

### "API Error" 메시지
1. 크레딧이 남아있는지 확인
2. API 키가 만료되지 않았는지 확인
3. 질문이 너무 길지 않은지 확인 (최대 1024 토큰)
