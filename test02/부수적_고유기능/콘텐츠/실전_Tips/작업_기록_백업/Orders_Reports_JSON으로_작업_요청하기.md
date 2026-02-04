# Orders 폴더에 JSON 형식으로 작업 요청서 저장하기

> 이 문서는 작업 요청을 JSON 형식으로 저장하여 체계적으로 관리하는 방법을 설명합니다.

---

## 왜 JSON으로 저장하는가

| 이점 | 설명 |
|------|------|
| 구조화된 요청 | 빠뜨리는 항목 없음 |
| 재사용 가능 | 비슷한 요청 시 복사해서 수정 |
| 이력 관리 | 어떤 요청을 했는지 기록 |
| AI가 이해하기 쉬움 | 명확한 구조 |

---

## 폴더 구조

```
Human_ClaudeCode_Bridge/
├── Orders/           ← 작업 요청서 저장
│   ├── order_2025-01-15_login.json
│   └── order_2025-01-16_payment.json
└── Reports/          ← 작업 결과 저장
    ├── task_S2F1_completed.json
    └── task_S2F1_verification.json
```

---

## 요청서 형식

```json
{
  "order_id": "order_2025-01-15_login",
  "created_at": "2025-01-15T09:00:00Z",
  "title": "로그인 기능 구현",
  "description": "이메일/비밀번호 로그인 + Google 소셜 로그인",
  "requirements": [
    "이메일 형식 검증",
    "비밀번호 8자 이상",
    "Google OAuth 연동",
    "로그인 후 대시보드로 이동"
  ],
  "priority": "high",
  "related_tasks": ["S2F1", "S2S1"]
}
```

---

## 요청서 작성 방법

```
"다음 요청서를 Orders 폴더에 JSON으로 저장해줘:
- 제목: 결제 기능 구현
- 설명: Toss Payments 연동
- 요구사항: 카드 결제, 결제 내역 저장
- 우선순위: 높음"
```

---

## 요청서 활용

```
"Orders/order_2025-01-15_login.json 읽고 작업 시작해줘"
```

---

## 요청서 vs 직접 지시

| 상황 | 방법 |
|------|------|
| 복잡한 요구사항 | JSON 요청서 |
| 간단한 수정 | 직접 지시 |
| 반복되는 패턴 | JSON 템플릿 활용 |
| 긴급한 작업 | 직접 지시 |

---

## 파일명 규칙

```
order_[날짜]_[키워드].json

예시:
order_2025-01-15_login.json
order_2025-01-16_payment.json
order_2025-01-17_dashboard.json
```

---

## 요청서 템플릿

```json
{
  "order_id": "",
  "created_at": "",
  "title": "",
  "description": "",
  "requirements": [],
  "constraints": [],
  "priority": "medium",
  "deadline": null,
  "related_tasks": []
}
```

---

*상세 내용: `outbox에_작업_결과_저장하기.md` 참조*
