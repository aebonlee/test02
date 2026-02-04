# .claude/work_logs/current.md로 작업 내역 기록하고 세션 간 연속성 유지하기

> 이 문서는 `.claude/work_logs/` 폴더를 활용하여 AI와의 작업 내역을 체계적으로 기록하고 세션 간 연속성을 유지하는 방법을 설명합니다.

---

## 왜 work_logs가 필요한가

Claude Code는 세션이 끊어지면 이전 대화 내용을 기억하지 못합니다. work_logs에 작업 내역을 기록해두면 새 세션에서도 이전 작업을 파악하고 이어서 진행할 수 있습니다.

---

## 폴더 구조

```
.claude/work_logs/
├── current.md        # 현재 활성 로그 (최우선 확인)
├── 2025-01-15.md     # 날짜별 아카이브
├── 2025-01-14.md
└── archive/          # 30일 이상 된 로그
```

---

## current.md 구조

```markdown
# Work Log - Current
> 최종 업데이트: 2025-01-15 14:30

## 현재 상태
- 진행 중: S2F1 (로그인 UI)
- 다음 예정: S2BA1 (로그인 API)
- 블로커: 없음

## 오늘 완료한 작업
- [x] 로그인 페이지 UI 구현
- [x] Google 로그인 버튼 추가

## 생성/수정된 파일
- `Production/Frontend/pages/auth/login.html` (신규)
- `Production/Frontend/assets/css/auth.css` (수정)

## 다음에 할 작업
- [ ] 로그인 API 연동
- [ ] 에러 핸들링 추가

## 참고사항
- Google OAuth 설정은 PO가 완료함
- Supabase URL: env 변수로 관리
```

---

## 기록 시점

| 기록 O | 기록 X |
|--------|--------|
| Task 완료 시 | 단순 오타 수정 |
| 파일 생성/수정 시 | 임시 테스트 파일 |
| 세션 종료 전 | 바로 되돌릴 변경 |
| 중요한 의사결정 시 | 사소한 스타일 변경 |

---

## 자동 순환 규칙

| 조건 | 동작 |
|------|------|
| current.md > 50KB | `YYYY-MM-DD.md`로 이름 변경, 새 current.md 생성 |
| 30일 이상 된 로그 | `archive/` 폴더로 이동 |

---

## Claude Code에게 요청하기

```
"오늘 작업 내용을 work_logs에 기록해줘"
"이전 작업 기록 확인해줘"
"current.md 업데이트해줘"
"어제 뭐 했는지 확인해줘"
```

---

## 새 세션 시작할 때

```
1. Claude Code 실행
2. AI가 자동으로 current.md 확인
3. 이전 작업 상태 파악
4. 이어서 작업 진행
```

---

*상세 내용: `.claude/work_logs/current.md` 참조*
