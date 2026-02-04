# 01. File Naming Rules

> Applies to: 5 Areas saved to Production (F, BA, S, BI, E)

---

## 1. Basic Format

**Use kebab-case (lowercase + hyphens)**

```
Correct formats:
- google-login.js
- subscription-cancel.js
- forgot-password.html
- ai-health.js

Incorrect formats:
- googleLogin.js        (camelCase not allowed)
- google_login.js       (snake_case not allowed)
- GoogleLogin.js        (PascalCase not allowed)
- GOOGLE-LOGIN.js       (uppercase not allowed)
```

---

## 2. Filename Structure

**[feature]-[action].extension**

| Component | Description | Example |
|-----------|-------------|---------|
| feature | What it's about | google, email, subscription |
| action | What it does | login, send, cancel |
| extension | File type | .js, .html, .css |

```
Examples:
- google-login.js       -> feature: google, action: login
- email-send.js         -> feature: email, action: send
- subscription-cancel.js -> feature: subscription, action: cancel
- password-reset.html   -> feature: password, action: reset
```

---

## 3. Extensions by Area

| Area | File Type | Extension | Example |
|------|-----------|-----------|---------|
| F (Frontend) | Page | `.html` | `google-login.html` |
| F (Frontend) | Script | `.js` | `sidebar.js` |
| F (Frontend) | Style | `.css` | `dashboard.css` |
| BA (Backend APIs) | API | `.js` | `subscription-cancel.js` |
| S (Security) | Auth API | `.js` | `google-callback.js` |
| BI (Backend Infra) | Library | `.js` | `db-client.js` |
| E (External) | Integration | `.js` | `ai-health.js` |

---

## 4. Task ID Placement

**Don't put Task ID in filename -> Put it in file header comment**

```
Don't include Task ID in filename:
- S2BA1_subscription-cancel.js  (X)

Filename is feature only, Task ID in comment:
- subscription-cancel.js        (O)
```

**JavaScript files:**
```javascript
/**
 * @task S2BA1
 * @description Subscription cancel API
 */
export default async function handler(req, res) {
  // ...
}
```

**HTML files:**
```html
<!--
@task S2F1
@description Google login page
-->
<!DOCTYPE html>
<html>
...
```

---

## 5. Exception: Non-Production Files

**Areas not going to Production use their own rules**

| Area | Naming Rule | Example |
|------|-------------|---------|
| D (Database) | `[TaskID]_[description].sql` | `S1D1_users_table.sql` |
| T (Testing) | `[target].test.js` | `auth.test.js` |
| M (Documentation) | Free format | `api-specification.md` |
| U (Design) | Free format | `wireframe-v1.fig` |
| O (DevOps) | Free format | `deploy-script.sh` |
| C (Content) | Free format | `faq-data.json` |

---

## Checklist

- [ ] Using kebab-case?
- [ ] [feature]-[action] format?
- [ ] Can you understand the function from the filename alone?
- [ ] Task ID in file header comment?
