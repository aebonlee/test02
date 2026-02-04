# API 키를 프론트엔드에 노출하지 않고 서버 사이드에서 안전하게 관리하기

> 이 문서는 API 키를 안전하게 관리하고 프론트엔드 노출을 방지하는 방법을 설명합니다.

---

## 핵심 원칙

1. **민감한 키는 서버에만**: OpenAI, 결제 API 등은 프론트엔드에서 직접 호출 금지
2. **Edge Function 활용**: 서버 없이도 API 키를 안전하게 사용
3. **노출 시 즉시 대응**: 키가 노출되면 즉시 폐기하고 재발급

---

## Edge Function이란?

서버 없이도 서버 역할을 하는 코드입니다. Supabase/Vercel에서 제공하며, API 키를 안전하게 보관하고 외부 API를 호출할 수 있습니다.

```
[브라우저] → [Edge Function] → [외부 API (OpenAI 등)]
                   ↑
            API 키는 여기에만 저장
            (브라우저 개발자 도구에서 볼 수 없음)
```

---

## 키 종류별 관리

| 키 종류 | 프론트 노출 | 저장 위치 | 이유 |
|---------|:----------:|----------|------|
| Supabase anon key | O | 프론트엔드 | RLS가 보호 |
| Supabase service_role | X | 서버/Edge | RLS 우회 가능 |
| OpenAI API key | X | 서버/Edge | 과금 발생 |
| 결제 API key | X | 서버/Edge | 금융 정보 접근 |
| 소셜 로그인 secret | X | 서버/Edge | 인증 우회 가능 |

---

## Edge Function 환경변수 설정

```bash
# Supabase Edge Function에 비밀 키 설정
supabase secrets set OPENAI_API_KEY=sk-xxx

# 설정된 비밀 키 목록 확인
supabase secrets list

# 비밀 키 삭제
supabase secrets unset OPENAI_API_KEY
```

---

## Edge Function 코드 예시

```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // 서버에서만 접근 가능한 환경변수
  const apiKey = Deno.env.get('OPENAI_API_KEY');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ... })
  });

  return new Response(await response.text());
});
```

---

## 키 노출 시 대응

| 단계 | 행동 |
|:----:|------|
| 1 | 즉시 해당 키 비활성화 (서비스 대시보드에서) |
| 2 | 새 키 발급 |
| 3 | 환경변수 업데이트 |
| 4 | 배포 재실행 |
| 5 | 로그 확인하여 악용 여부 점검 |

---

## Claude Code에게 요청하기

```
"이 API 호출을 Edge Function으로 옮겨줘"
"환경변수 설정 명령어 알려줘"
"프론트엔드에 노출된 API 키 찾아줘"
"Supabase secrets 설정해줘"
```

---

*상세 내용: `환경변수_관리_베스트_프랙티스.md` 참조*
