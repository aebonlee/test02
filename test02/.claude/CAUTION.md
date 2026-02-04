# 주의사항 (CAUTION)

프로덕션 배포 전 반드시 확인해야 할 사항들

---

## ~~개발 환경 RLS 정책~~ ✅ 완료 (2026-01-03)

**현재 상태:** ✅ 프로덕션용 RLS 적용 완료
- `learning_contents`: authenticated만 INSERT/UPDATE/DELETE 가능
- `faqs`: authenticated만 INSERT/UPDATE/DELETE 가능

**적용된 정책:**
- `learning_contents_insert_auth`, `learning_contents_update_auth`, `learning_contents_delete_auth`
- `faqs_insert_authenticated`, `faqs_update_authenticated`, `faqs_delete_authenticated`

---

## 본개발 TODO

### 토스페이먼츠
- [ ] 가맹점 등록 (심사 1-2주 소요)
- [ ] 빌링키 발급 API 연동
- [ ] 결제 웹훅 처리

### PG 이용약관
- [ ] 전자금융거래 이용약관 동의 체크박스
- [ ] 개인정보 제3자 제공 동의 체크박스

---

## Supabase 기록 - 대안 프로세스

> **MCP, curl, CLI 등 다른 방법이 모두 안 될 때** 이 방법을 사용

**JSON 파일 + Node.js 스크립트 방식:**

**1단계: JSON 파일 생성**
```
위치: S0_Project-SAL-Grid_생성/sal-grid/task-results/
파일명: {TaskID}_result.json
```

**2단계: 스크립트 실행**
```bash
cd S0_Project-SAL-Grid_생성/supabase
node sync_task_results_to_db.js
```

**스크립트 위치:** `S0_Project-SAL-Grid_생성/supabase/sync_task_results_to_db.js`

**왜 이 방법을 쓰는가:**
- curl → Windows에서 한글 인코딩 문제
- MCP → 연결 안 됨
- 직접 API 호출 → 인증 문제
- → Node.js fetch는 UTF-8 정상 처리
