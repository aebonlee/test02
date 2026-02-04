# 특정 브라우저에서만 레이아웃이 깨질 때 - CSP 문제 해결

> 크롬에서는 정상인데 Edge나 다른 브라우저에서 웹사이트가 완전히 망가져 보인다면, CSP(Content Security Policy)를 의심해야 합니다.

---

## 이런 증상이 나타납니다

웹사이트를 배포한 뒤 크롬에서는 멀쩡하게 보이는데, Edge나 Safari 같은 다른 브라우저에서 열면 CSS가 전혀 적용되지 않은 것처럼 보이는 경우가 있습니다. 사이드바가 세로로 쭉 나열되고, 모바일 전용 요소가 데스크톱에서 나타나고, 버튼 스타일이 모두 사라져 있습니다. 겉보기에는 CSS 파일이 깨졌거나 없어진 것 같지만, 실제로는 브라우저가 CSS 파일 자체를 불러오는 것을 거부한 것입니다.

이 현상의 원인은 대부분 CSP라는 보안 정책에 있습니다.

---

## CSP란 무엇인가

CSP는 Content Security Policy의 약자로, 웹사이트가 어디에서 리소스를 불러올 수 있는지를 브라우저에게 알려주는 보안 규칙입니다. 쉽게 말해, 웹사이트에 출입 허가 명단을 걸어두는 것과 같습니다.

예를 들어 "CSS는 우리 사이트와 jsdelivr에서만 불러와라"라고 정해놓으면, 그 외의 출처에서 오는 CSS는 브라우저가 거부합니다. 이것은 악성 코드가 외부에서 주입되는 것을 막기 위한 보안 장치입니다.

문제는 이 규칙을 너무 엄격하게 설정하면, 정작 우리 사이트의 정상적인 파일까지 차단해버린다는 점입니다.

---

## 원인 1: www와 non-www 도메인 불일치

CSP에서 `'self'`라는 키워드는 "현재 페이지와 같은 출처"를 의미합니다. 여기서 함정이 있습니다. `ssalworks.ai.kr`과 `www.ssalworks.ai.kr`은 사람 눈에는 같은 사이트이지만, 브라우저 보안 규칙에서는 완전히 다른 출처로 취급합니다.

크롬에서 `ssalworks.ai.kr`로 접속하면 `'self'`가 `ssalworks.ai.kr`이 되고, 같은 출처의 CSS 파일이니 정상 로드됩니다. 그런데 Edge에서 `www.ssalworks.ai.kr`로 접속하면 `'self'`는 `www.ssalworks.ai.kr`인데, 리다이렉트 과정에서 출처가 꼬이면 CSS 파일이 다른 출처로 인식되어 차단됩니다.

이것이 "크롬에서는 되고 Edge에서는 안 되는" 현상의 정체입니다. 브라우저가 다른 주소로 접속하면서 CSP의 출처 판단이 달라지는 것입니다.

---

## 원인 2: 인라인 스크립트 차단 (unsafe-inline 누락)

CSP 문제는 도메인 불일치만이 아닙니다. `'unsafe-inline'`이 빠져 있으면 사이트 전체가 먹통이 되는 더 심각한 상황이 발생합니다.

```
# 이 설정이 사이트를 먹통으로 만듭니다
script-src 'self' https://www.googletagmanager.com;
style-src 'self' https://fonts.googleapis.com;
```

`'self'`만 있으면 외부 .js 파일은 허용되지만, HTML 안에 `<script>...</script>`로 직접 넣은 인라인 코드는 전부 차단됩니다.

### 왜 인라인 스크립트가 필요한가?

Next.js, React 같은 프레임워크는 페이지 로딩 시 인라인 스크립트를 필수적으로 삽입합니다:

- `__NEXT_DATA__` (페이지 데이터 전달)
- Hydration 스크립트 (서버 렌더링 → 클라이언트 전환)
- 테마 초기화 스크립트 (다크모드 깜빡임 방지)

이것들이 차단되면 프레임워크 자체가 동작하지 않아, CSS 적용·데이터 로딩·라우팅 등 사이트 전체가 마비됩니다. Vanilla HTML/JS로 만든 사이트도 `<script>` 태그를 HTML에 직접 넣었다면 같은 문제가 발생합니다.

### 해결: unsafe-inline 추가

```
# 수정된 설정
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
```

### CSP 설정 위치 (프레임워크별)

| 프레임워크 | CSP 설정 파일 |
|-----------|--------------|
| Next.js | `middleware.ts` 또는 `next.config.js` |
| Vercel (Vanilla) | `vercel.json`의 headers 섹션 |
| Nginx | `nginx.conf`의 add_header |

**주의:** `'unsafe-inline'`은 보안 수준을 낮추는 설정입니다. 보안이 중요한 사이트라면 nonce 기반 CSP가 더 안전합니다. 하지만 대부분의 일반 웹사이트에서는 `'unsafe-inline'`으로 충분합니다.

---

## 확인하는 방법

문제가 의심될 때는 해당 브라우저에서 F12를 눌러 개발자 도구를 열고 Console 탭을 확인합니다. CSP가 원인이라면 아래와 같은 에러 메시지가 빨간색으로 나타납니다.

도메인 불일치인 경우:
```
Loading the stylesheet violates the following Content Security Policy
directive: style-src 'self'...
```

인라인 스크립트 차단인 경우:
```
Refused to execute inline script because it violates the following
Content Security Policy directive: "script-src 'self' ..."
```

이 메시지가 보이면 파일 자체에는 문제가 없고, 보안 정책이 로딩을 막고 있다는 뜻입니다.

---

## 해결 방법

### 도메인 불일치 해결

CSP 설정에 www와 non-www 도메인을 모두 명시합니다. Vercel로 배포하는 경우 `vercel.json` 파일의 Content-Security-Policy 헤더에서 `'self'`만 적어둔 부분에 `https://www.내도메인.com`과 `https://내도메인.com`을 둘 다 추가합니다.

style-src, script-src, connect-src 등 리소스를 불러오는 모든 지시어에 두 도메인을 넣어야 합니다. 하나라도 빠지면 해당 종류의 리소스가 차단됩니다.

### 인라인 스크립트 차단 해결

`script-src`와 `style-src`에 `'unsafe-inline'`을 추가합니다. 특히 Next.js, React 등 프레임워크를 사용하는 경우 `'unsafe-inline'` 없이는 사이트가 작동하지 않습니다.

수정 후 배포하고, 브라우저에서 Ctrl + Shift + R로 강력 새로고침하면 정상적으로 표시됩니다.

---

## 예방하는 방법

이 문제를 미리 방지하려면 아래 체크리스트를 확인합니다.

- [ ] `script-src`에 `'unsafe-inline'` 포함되어 있는가?
- [ ] `style-src`에 `'unsafe-inline'` 포함되어 있는가?
- [ ] www와 non-www 도메인이 모두 등록되어 있는가?
- [ ] 사용 중인 외부 서비스 도메인이 모두 등록되어 있는가? (Google Analytics, 폰트 CDN 등)
- [ ] 외부 CDN의 source map URL도 connect-src에 포함되어 있는가?
- [ ] 배포 후 크롬뿐 아니라 Edge, Safari 등 다른 브라우저에서도 확인했는가?
- [ ] 배포 후 브라우저 콘솔에서 CSP 에러가 없는가?

---

## SSALWorks 방법론에서의 접근

SSALWorks 방법론에서는 개발 마무리 단계(S5)에서 보안 헤더 설정과 크로스 브라우저 테스트를 별도 Task로 관리합니다. CSP 같은 보안 정책은 한 번 설정하고 끝나는 것이 아니라, 새로운 외부 라이브러리를 추가하거나 도메인 설정을 변경할 때마다 업데이트해야 합니다.

Claude Code만 사용하면 "코드는 맞는데 왜 안 되지?"라는 상황에서 해매기 쉽습니다. SSALWorks의 검증 프로세스는 코드뿐 아니라 배포 환경 설정까지 체계적으로 점검하므로, 이런 배포 후 문제를 사전에 방지할 수 있습니다.

---

## 결론

CSP 문제는 크게 두 가지입니다:

1. **도메인 불일치** — www와 non-www가 다른 출처로 인식되어 특정 브라우저에서만 깨짐
2. **인라인 스크립트 차단** — `'unsafe-inline'` 누락으로 사이트 전체가 먹통

어느 경우든 F12 콘솔에서 CSP 에러를 확인하는 것이 첫 번째 단계입니다. 에러 메시지가 원인을 정확히 알려주므로, 해당 지시어에 필요한 도메인이나 `'unsafe-inline'`을 추가하면 해결됩니다.

---

*관련 내용: `보안 > API 키 보안 관리`, `개발 마무리 점검 > 프로덕션 배포 전 체크리스트` 참조*
