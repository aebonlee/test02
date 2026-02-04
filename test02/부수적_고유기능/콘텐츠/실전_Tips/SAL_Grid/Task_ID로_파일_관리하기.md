# Task ID를 활용하여 파일을 체계적으로 관리하기

> 이 문서는 Task ID를 활용하여 프로젝트 파일을 체계적으로 관리하는 방법을 설명합니다.

---

## Task ID 구조

```
S2BA1
│ │ └─ 순서: 1번째 Task
│ └─── Area: BA (Backend APIs)
└───── Stage: S2 (개발 1차)
```

---

## Task ID 예시

| Task ID | 의미 |
|---------|------|
| S1D1 | 개발준비 - 데이터베이스 - 1번 |
| S2F1 | 개발1차 - 프론트엔드 - 1번 |
| S2BA1 | 개발1차 - 백엔드API - 1번 |
| S3E1 | 개발2차 - 외부연동 - 1번 |

---

## 파일에 Task ID 표시

파일명에는 넣지 않고, 파일 상단 주석에 표시:

```javascript
/**
 * @task S2BA1
 * @description 구독 취소 API
 */
export default async function handler(req, res) {
  // ...
}
```

---

## HTML 파일의 경우

```html
<!--
@task S2F1
@description 로그인 페이지 UI
-->
<!DOCTYPE html>
<html>
...
```

---

## Task ID로 파일 찾기

```
"S2F1 Task 관련 파일들 찾아줘"
"이 파일의 Task ID가 뭐야?"
```

---

## 폴더와 Task ID 매핑

| Task ID | 폴더 경로 |
|---------|----------|
| S1D1 | S1_개발_준비/Database/ |
| S2F1 | S2_개발-1차/Frontend/ |
| S2BA1 | S2_개발-1차/Backend_APIs/ |

---

## Task ID 활용

| 용도 | 예시 |
|------|------|
| 파일 추적 | 어떤 Task에서 생성됐는지 |
| 검색 | Task ID로 관련 파일 검색 |
| 보고서 | Task별 생성 파일 목록 |
| 커밋 메시지 | "S2F1: 로그인 UI 구현" |

---

## 커밋 메시지에 Task ID

```
"S2F1: 로그인 페이지 구현"
"S2BA1: 구독 취소 API 추가"
```

---

## Task ID 검증

```
"이 파일들이 올바른 Task ID를 가지고 있는지 확인해줘"
"Task ID가 없는 파일들 찾아줘"
```

---

*상세 내용: `Task_Plan_작성_전_User_Flow_먼저.md` 참조*
