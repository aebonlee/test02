# 상세평가보고서 가격 수정 및 Gemini 추가 작업 보고서

**작업일시:** 2025-12-31
**커밋:** `0cfa120` (가격 수정), `3aa3c69` (Gemini 추가)
**브랜치:** main

---

## 1. 작업 개요

정치인 상세평가보고서 가격을 AI당 30만원으로 통일 수정

### 변경 전 가격
| 페이지 | 가격 | 비고 |
|--------|------|------|
| report-purchase | ₩330,000/AI | 부가세 포함 표시 |
| payment | ₩500,000 | 고정 가격 |
| politicians/[id] | ₩500,000/AI | 고정 가격 |

### 변경 후 가격
| 페이지 | 가격 | 비고 |
|--------|------|------|
| report-purchase | ₩300,000/AI | 부가세 표시 제거 |
| payment | ₩300,000 | 통일 |
| politicians/[id] | ₩300,000/AI | 통일 |

---

## 2. 수정된 파일

### 2.1 report-purchase/page.tsx
**경로:** `src/app/report-purchase/page.tsx`

**변경 내용:**
1. `PRICE_PER_AI` 상수: 330,000 → 300,000
2. 부가세 계산 변수 제거 (`baseAmount`, `taxAmount`)
3. AI 선택 카드 가격 표시: ₩330,000 → ₩300,000
4. "부가세 포함" 텍스트 제거
5. 금액 요약 섹션 간소화 (부가세 분리 표시 → 총액만 표시)
6. 주문 내역 가격: ₩330,000 → ₩300,000

### 2.2 payment/page.tsx
**경로:** `src/app/payment/page.tsx`

**변경 내용:**
1. 상품 금액: 500,000원 → 300,000원
2. 할인 행 제거
3. 최종 결제 금액: 500,000원 → 300,000원
4. "부가세 포함" 텍스트 제거
5. 결제 버튼: "500,000원 결제하기" → "300,000원 결제하기"

### 2.3 politicians/[id]/page.tsx
**경로:** `src/app/politicians/[id]/page.tsx`

**변경 내용:**
1. `totalPrice` 계산: `selectedReports.length * 500000` → `selectedReports.length * 300000`
2. 주석 업데이트: "Claude 1개만 지원" → "AI당 30만원"
3. 보고서 제목: "Claude AI 상세평가보고서 (₩500,000)" → "(₩300,000)"

---

## 3. 새 가격 구조

| AI 개수 | 총 금액 |
|---------|---------|
| 1개 | ₩300,000 |
| 2개 | ₩600,000 |
| 3개 | ₩900,000 |
| 4개 (전체) | ₩1,200,000 |

---

## 4. 배포 정보

- **Git Push:** main 브랜치에 푸시 완료
- **Vercel:** 자동 배포 트리거됨
- **빌드 결과:** 성공 (API 동적 라우트 경고는 정상)

---

## 5. 확인 방법

1. `/report-purchase?politician_id=1` 접속
   - AI 선택 카드에서 ₩300,000 확인
   - 복수 선택 시 총액 계산 확인 (2개 = ₩600,000)

2. `/politicians/1` 접속
   - 상세평가보고서 섹션에서 "₩300,000" 확인

3. `/payment` 접속
   - 최종 결제 금액 ₩300,000 확인

---

## 6. 관련 커밋

```
commit 0cfa120
Date: 2025-12-31

fix: 상세평가보고서 가격 300,000원/AI로 수정

- report-purchase: 330,000원 → 300,000원 (부가세 계산 제거)
- payment: 500,000원 → 300,000원
- politicians/[id]: 500,000원 → 300,000원
```

---

## 7. Gemini AI 추가 (2차 작업)

**커밋:** `3aa3c69`

### 변경 내용

AI 옵션을 3개에서 4개로 확장

**변경 전 (3개):**
| # | AI | 설명 |
|---|-----|------|
| 1 | Claude | Anthropic의 Claude AI 평가 |
| 2 | ChatGPT | OpenAI의 ChatGPT 평가 |
| 3 | Grok | xAI의 Grok 평가 |

**변경 후 (4개):**
| # | AI | 설명 | 가격 |
|---|-----|------|------|
| 1 | Claude | Anthropic의 Claude AI 평가 | ₩300,000 |
| 2 | ChatGPT | OpenAI의 ChatGPT 평가 | ₩300,000 |
| 3 | Gemini | Google의 Gemini AI 평가 | ₩300,000 |
| 4 | Grok | xAI의 Grok 평가 | ₩300,000 |

### 수정 파일

**파일:** `src/app/report-purchase/page.tsx`

```typescript
// 변경 전
const AI_OPTIONS = [
  { id: 'claude', name: 'Claude', description: 'Anthropic의 Claude AI 평가' },
  { id: 'chatgpt', name: 'ChatGPT', description: 'OpenAI의 ChatGPT 평가' },
  { id: 'grok', name: 'Grok', description: 'xAI의 Grok 평가' },
];

// 변경 후
const AI_OPTIONS = [
  { id: 'claude', name: 'Claude', description: 'Anthropic의 Claude AI 평가' },
  { id: 'chatgpt', name: 'ChatGPT', description: 'OpenAI의 ChatGPT 평가' },
  { id: 'gemini', name: 'Gemini', description: 'Google의 Gemini AI 평가' },
  { id: 'grok', name: 'Grok', description: 'xAI의 Grok 평가' },
];
```

### 최종 가격 구조

| AI 개수 | 총 금액 |
|---------|---------|
| 1개 | ₩300,000 |
| 2개 | ₩600,000 |
| 3개 | ₩900,000 |
| **4개 (전체)** | **₩1,200,000** |

### 테스트 결과

- Claude: ✅ 표시됨
- ChatGPT: ✅ 표시됨
- Gemini: ✅ 표시됨
- Grok: ✅ 표시됨
- 4개 선택 시 ₩1,200,000: ✅ 정상 계산

### 관련 커밋

```
commit 3aa3c69
Date: 2025-12-31

feat: Gemini AI 옵션 추가 (4개 AI 지원)

- Claude, ChatGPT, Gemini, Grok 4개 AI 선택 가능
- 4개 전체 선택 시 ₩1,200,000
```
