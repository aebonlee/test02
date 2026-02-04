# API Reference - S2 Stage

**Version:** 1.0.0
**Last Updated:** 2025-12-14
**Stage:** S2 개발-1차

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
   - [Google OAuth Start](#1-google-oauth-start)
   - [Google OAuth Callback](#2-google-oauth-callback)
   - [Logout](#3-logout)
2. [Email APIs](#email-apis)
   - [Send Email](#1-send-email)
   - [Send Welcome Email](#2-send-welcome-email)
   - [Send Password Reset Email](#3-send-password-reset-email)
3. [Subscription APIs](#subscription-apis)
   - [Get Subscription Status](#1-get-subscription-status)
   - [Create Subscription](#2-create-subscription)
   - [Cancel Subscription](#3-cancel-subscription)
4. [Error Codes Reference](#error-codes-reference)
5. [Common Response Format](#common-response-format)

---

## Authentication APIs

### 1. Google OAuth Start

Initiates Google OAuth authentication flow using Supabase Auth.

#### Endpoint
```
GET /api/auth/google
```

#### Authentication
- None required (public endpoint)

#### Request
No request body required. This endpoint redirects to Google OAuth consent screen.

#### Response
**Success (302 Redirect)**
- Redirects to Google OAuth consent page
- After user consent, Google redirects to callback URL

**Error (400)**
```json
{
  "error": "Google OAuth 시작 실패",
  "details": "error message"
}
```

**Error (500)**
```json
{
  "error": "OAuth URL 생성 실패"
}
```

#### Headers
- `Access-Control-Allow-Origin`: `*`
- `Access-Control-Allow-Methods`: `GET,OPTIONS`
- `Access-Control-Allow-Credentials`: `true`

#### Flow
1. Client calls `/api/auth/google`
2. Supabase generates OAuth URL
3. User is redirected to Google consent screen
4. After consent, Google redirects to `/api/auth/google/callback`

---

### 2. Google OAuth Callback

Handles Google OAuth callback and creates user session.

#### Endpoint
```
GET /api/auth/google/callback
```

#### Authentication
- None required (public endpoint)
- Google provides authorization code in query params

#### Request
Query parameters provided by Google OAuth:
- `code` (string, required): Authorization code from Google
- `error` (string, optional): Error code if authentication failed
- `error_description` (string, optional): Error description

#### Response
**Success (302 Redirect)**
- Sets HttpOnly cookies: `sb-access-token`, `sb-refresh-token`
- Updates/creates user record in `users` table
- Redirects to: `{NEXT_PUBLIC_SITE_URL}/`

**Error (302 Redirect)**
Redirects to login page with error parameters:
```
/auth/login?error={error_code}&error_description={description}
```

Error codes:
- `missing_code`: No authorization code provided
- `exchange_failed`: Failed to exchange code for session
- `no_session`: Session not created
- `server_error`: Unexpected server error

#### Cookies Set
```
sb-access-token: {token}
  - Path: /
  - HttpOnly: true
  - Secure: true
  - SameSite: Lax
  - Max-Age: 604800 (7 days)

sb-refresh-token: {token}
  - Path: /
  - HttpOnly: true
  - Secure: true
  - SameSite: Lax
  - Max-Age: 604800 (7 days)
```

#### User Data Upsert
Updates/creates record in `users` table:
```javascript
{
  user_id: "uuid",
  email: "user@example.com",
  name: "User Name",
  profile_image: "https://...",
  updated_at: "2025-12-14T00:00:00.000Z"
}
```

---

### 3. Logout

Terminates user session and clears authentication cookies.

#### Endpoint
```
POST /api/auth/logout
```

#### Authentication
- Optional: Reads `sb-access-token` from cookies
- Works even without valid token (clears cookies regardless)

#### Request
No request body required.

#### Response
**Success (200)**
```json
{
  "success": true,
  "message": "로그아웃 성공"
}
```

**Error (500)**
```json
{
  "error": "Internal server error",
  "details": "error message"
}
```

Note: Even on error, cookies are cleared.

#### Cookies Cleared
```
sb-access-token: deleted (Max-Age=0)
sb-refresh-token: deleted (Max-Age=0)
```

#### Side Effects
- Supabase session terminated (if valid token exists)
- Authentication cookies cleared
- User logged out on server side

---

## Email APIs

### 1. Send Email

Sends a custom email using Resend API.

#### Endpoint
```
POST /api/email/send
```

#### Authentication
**Required**: Bearer Token

```
Authorization: Bearer {access_token}
```

#### Request Headers
| Name | Type | Required | Description |
|------|------|----------|-------------|
| Authorization | string | Yes | Bearer token from authentication |
| Content-Type | string | Yes | application/json |

#### Request Body
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| to | string | Yes | Recipient email address |
| subject | string | Yes | Email subject line |
| html | string | Yes | Email HTML content |

**Example:**
```json
{
  "to": "user@example.com",
  "subject": "Welcome to Our Service",
  "html": "<h1>Welcome!</h1><p>Thank you for joining us.</p>"
}
```

#### Response
**Success (200)**
```json
{
  "success": true,
  "data": {
    "id": "email_id_from_resend",
    "to": "user@example.com",
    "subject": "Welcome to Our Service"
  },
  "message": "Email sent successfully"
}
```

**Error (400) - Validation Error**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required fields: to, subject, html"
  }
}
```

**Error (400) - Invalid Email**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format"
  }
}
```

**Error (401) - Unauthorized**
```json
{
  "error": {
    "code": "AUTH_001",
    "message": "No token provided"
  }
}
```

**Error (500) - Send Failed**
```json
{
  "error": {
    "code": "EMAIL_SEND_ERROR",
    "message": "Failed to send email"
  }
}
```

---

### 2. Send Welcome Email

Sends a pre-designed welcome email to new users.

#### Endpoint
```
POST /api/email/welcome
```

#### Authentication
**Required**: Bearer Token

```
Authorization: Bearer {access_token}
```

#### Request Headers
| Name | Type | Required | Description |
|------|------|----------|-------------|
| Authorization | string | Yes | Bearer token from authentication |
| Content-Type | string | Yes | application/json |

#### Request Body
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| to | string | Yes | Recipient email address |
| name | string | Yes | User's name for personalization |
| dashboardUrl | string | No | Custom dashboard URL (defaults to /dashboard) |

**Example:**
```json
{
  "to": "newuser@example.com",
  "name": "John Doe",
  "dashboardUrl": "https://example.com/my-dashboard"
}
```

#### Response
**Success (200)**
```json
{
  "success": true,
  "data": {
    "id": "email_id_from_resend",
    "to": "newuser@example.com",
    "name": "John Doe"
  },
  "message": "Welcome email sent successfully"
}
```

**Error (400) - Validation Error**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required fields: to, name"
  }
}
```

**Error (401) - Unauthorized**
```json
{
  "error": {
    "code": "AUTH_001",
    "message": "No token provided"
  }
}
```

**Error (500) - Send Failed**
```json
{
  "error": {
    "code": "EMAIL_SEND_ERROR",
    "message": "Failed to send welcome email"
  }
}
```

#### Email Content
The welcome email includes:
- Personalized greeting with user's name
- Link to dashboard (customizable via `dashboardUrl`)
- Service introduction
- Getting started guide

---

### 3. Send Password Reset Email

Sends a password reset email with a secure reset token.

#### Endpoint
```
POST /api/email/password-reset
```

#### Authentication
**Required**: Bearer Token OR Internal API Secret

```
Authorization: Bearer {access_token}
```

OR

```
X-Internal-Call: {INTERNAL_API_SECRET}
```

#### Request Headers
| Name | Type | Required | Description |
|------|------|----------|-------------|
| Authorization | string | Conditional | Bearer token (required if not internal call) |
| X-Internal-Call | string | Conditional | Internal API secret (for internal calls) |
| Content-Type | string | Yes | application/json |

#### Request Body
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| to | string | Yes | Recipient email address |
| name | string | Yes | User's name for personalization |
| resetToken | string | Yes | Password reset token (min 20 characters) |
| expiryMinutes | number | No | Token expiry time in minutes (default: 30) |

**Example:**
```json
{
  "to": "user@example.com",
  "name": "John Doe",
  "resetToken": "abc123def456ghi789jkl012mno345pqr678",
  "expiryMinutes": 30
}
```

#### Response
**Success (200)**
```json
{
  "success": true,
  "data": {
    "id": "email_id_from_resend",
    "to": "user@example.com",
    "name": "John Doe",
    "expiresIn": "30 minutes"
  },
  "message": "Password reset email sent successfully"
}
```

**Error (400) - Validation Error**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required fields: to, name, resetToken"
  }
}
```

**Error (400) - Invalid Token**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid reset token format"
  }
}
```

**Error (401) - Unauthorized**
```json
{
  "error": {
    "code": "AUTH_001",
    "message": "No token provided"
  }
}
```

**Error (500) - Send Failed**
```json
{
  "error": {
    "code": "EMAIL_SEND_ERROR",
    "message": "Failed to send password reset email"
  }
}
```

#### Security Notes
- Reset token must be at least 20 characters
- Reset URL format: `{NEXT_PUBLIC_SITE_URL}/reset-password?token={resetToken}`
- Token expiry is customizable (default: 30 minutes)
- Supports both authenticated users and internal API calls

---

## Subscription APIs

### 1. Get Subscription Status

Retrieves the current user's subscription information.

#### Endpoint
```
GET /api/subscription/status
```

#### Authentication
**Required**: Bearer Token

```
Authorization: Bearer {access_token}
```

#### Request Headers
| Name | Type | Required | Description |
|------|------|----------|-------------|
| Authorization | string | Yes | Bearer token from authentication |

#### Response
**Success (200) - Active Subscription**
```json
{
  "subscription": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "auth_user_id",
    "plan_id": "plan_monthly_9900",
    "status": "active",
    "start_date": "2025-01-01T00:00:00.000Z",
    "end_date": null,
    "cancelled_at": null,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z",
    "plan": {
      "id": "plan_monthly_9900",
      "name": "Monthly Plan",
      "price": 9900,
      "billing_cycle": "monthly",
      "features": ["feature1", "feature2"]
    }
  }
}
```

**Success (200) - No Subscription**
```json
{
  "subscription": null,
  "status": "none",
  "message": "No active subscription found"
}
```

**Error (401) - Unauthorized**
```json
{
  "error": {
    "code": "AUTH_001",
    "message": "No token provided"
  }
}
```

**Error (401) - Invalid Token**
```json
{
  "error": {
    "code": "AUTH_002",
    "message": "Invalid or expired token"
  }
}
```

**Error (500) - Database Error**
```json
{
  "error": {
    "code": "DB_ERROR",
    "message": "Failed to fetch subscription data"
  }
}
```

#### Subscription Status Values
- `pending`: Subscription created but payment not completed
- `active`: Subscription is active and paid
- `cancelled`: User cancelled subscription
- `expired`: Subscription expired

---

### 2. Create Subscription

Creates a new subscription for the authenticated user.

#### Endpoint
```
POST /api/subscription/create
```

#### Authentication
**Required**: Bearer Token

```
Authorization: Bearer {access_token}
```

#### Request Headers
| Name | Type | Required | Description |
|------|------|----------|-------------|
| Authorization | string | Yes | Bearer token from authentication |
| Content-Type | string | Yes | application/json |

#### Request Body
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| plan_id | string | Yes | Subscription plan ID |

**Example:**
```json
{
  "plan_id": "plan_monthly_9900"
}
```

#### Response
**Success (201) - Subscription Created**
```json
{
  "subscription": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "auth_user_id",
    "plan_id": "plan_monthly_9900",
    "status": "pending",
    "start_date": "2025-12-14T00:00:00.000Z",
    "end_date": null,
    "created_at": "2025-12-14T00:00:00.000Z",
    "plan": {
      "id": "plan_monthly_9900",
      "name": "Monthly Plan",
      "price": 9900,
      "billing_cycle": "monthly"
    }
  },
  "message": "Subscription created successfully"
}
```

**Error (400) - Missing plan_id**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "plan_id is required"
  }
}
```

**Error (401) - Unauthorized**
```json
{
  "error": {
    "code": "AUTH_001",
    "message": "No token provided"
  }
}
```

**Error (404) - Plan Not Found**
```json
{
  "error": {
    "code": "PLAN_NOT_FOUND",
    "message": "Subscription plan not found"
  }
}
```

**Error (409) - Already Subscribed**
```json
{
  "error": {
    "code": "SUBSCRIPTION_EXISTS",
    "message": "User already has an active or pending subscription"
  }
}
```

**Error (500) - Database Error**
```json
{
  "error": {
    "code": "DB_ERROR",
    "message": "Failed to create subscription"
  }
}
```

#### Side Effects
1. Creates new record in `subscriptions` table with status `pending`
2. Updates `users.subscription_status` to `pending`
3. Status changes to `active` after payment confirmation (handled separately)

#### Notes
- Users can only have one active or pending subscription at a time
- Initial status is `pending` until payment is completed
- For monthly subscriptions, `end_date` is `null` (recurring)

---

### 3. Cancel Subscription

Cancels the user's active subscription.

#### Endpoint
```
POST /api/subscription/cancel
```

#### Authentication
**Required**: Bearer Token

```
Authorization: Bearer {access_token}
```

#### Request Headers
| Name | Type | Required | Description |
|------|------|----------|-------------|
| Authorization | string | Yes | Bearer token from authentication |

#### Request Body
No request body required.

#### Response
**Success (200) - Subscription Cancelled**
```json
{
  "subscription": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "auth_user_id",
    "plan_id": "plan_monthly_9900",
    "status": "cancelled",
    "start_date": "2025-01-01T00:00:00.000Z",
    "end_date": null,
    "cancelled_at": "2025-12-14T00:00:00.000Z",
    "updated_at": "2025-12-14T00:00:00.000Z",
    "plan": {
      "id": "plan_monthly_9900",
      "name": "Monthly Plan",
      "price": 9900,
      "billing_cycle": "monthly"
    }
  },
  "message": "Subscription cancelled successfully"
}
```

**Error (401) - Unauthorized**
```json
{
  "error": {
    "code": "AUTH_001",
    "message": "No token provided"
  }
}
```

**Error (404) - No Active Subscription**
```json
{
  "error": {
    "code": "NO_ACTIVE_SUBSCRIPTION",
    "message": "No active subscription found to cancel"
  }
}
```

**Error (500) - Database Error**
```json
{
  "error": {
    "code": "DB_ERROR",
    "message": "Failed to cancel subscription"
  }
}
```

#### Side Effects
1. Updates `subscriptions.status` to `cancelled`
2. Sets `subscriptions.cancelled_at` to current timestamp
3. Updates `users.subscription_status` to `cancelled`

#### Notes
- Only `active` subscriptions can be cancelled
- Cancellation is immediate
- User may still have access until end of billing period (implementation dependent)

---

## Error Codes Reference

### Authentication Errors (AUTH_xxx)

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| AUTH_001 | 401 | No token provided | Authorization header missing or invalid |
| AUTH_002 | 401 | Invalid or expired token | Token is invalid or has expired |
| AUTH_003 | 401 | Token expired | Token has expired (specific expiry error) |
| AUTH_004 | 403 | Access forbidden | User doesn't have permission |
| AUTH_005 | 403 | Admin access required | Admin role required |
| AUTH_006 | 404 | User not found | User account doesn't exist |
| AUTH_007 | 403 | User account suspended | Account has been suspended |
| AUTH_500 | 500 | Authentication service error | Internal auth service error |

### API Errors (API_xxx)

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| API_400 | 400 | Bad request | Malformed request |
| API_401 | 400 | Validation error | Request validation failed |
| API_404 | 404 | Resource not found | Requested resource doesn't exist |
| API_405 | 405 | Method not allowed | HTTP method not supported |
| API_500 | 500 | Internal server error | Unexpected server error |
| API_501 | 500 | Database error | Database operation failed |
| API_502 | 502 | External service error | External service unavailable |

### Email Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| EMAIL_SEND_ERROR | 500 | Failed to send email | Email delivery failed |
| VALIDATION_ERROR | 400 | Invalid email format | Email address format invalid |

### Subscription Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| PLAN_NOT_FOUND | 404 | Subscription plan not found | Plan ID doesn't exist |
| SUBSCRIPTION_EXISTS | 409 | User already has an active or pending subscription | Duplicate subscription |
| NO_ACTIVE_SUBSCRIPTION | 404 | No active subscription found to cancel | No subscription to cancel |
| DB_ERROR | 500 | Failed to create/cancel subscription | Database operation failed |

---

## Common Response Format

### Success Response Structure

```json
{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  },
  "message": "Operation successful description"
}
```

### Error Response Structure

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

### Standard HTTP Methods

| Method | Usage |
|--------|-------|
| GET | Retrieve data (no request body) |
| POST | Create data or perform actions |
| PUT | Update entire resource |
| PATCH | Partially update resource |
| DELETE | Remove resource |

### Standard Headers

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
```

**Response Headers:**
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
```

### Pagination (When Implemented)

For endpoints that return lists:

**Request Query Parameters:**
```
?page=1&limit=20&sort=created_at&order=desc
```

**Response Format:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Authentication Flow

### Complete OAuth Flow

```
1. User clicks "Login with Google"
   ↓
2. Frontend → GET /api/auth/google
   ↓
3. Redirect to Google OAuth consent screen
   ↓
4. User approves
   ↓
5. Google → GET /api/auth/google/callback?code=xxx
   ↓
6. Exchange code for session
   ↓
7. Set HttpOnly cookies (sb-access-token, sb-refresh-token)
   ↓
8. Upsert user data to database
   ↓
9. Redirect to main page (/)
   ↓
10. User is authenticated (cookies sent with requests)
```

### Using Access Token

**Option 1: Cookie-based (Automatic)**
- Cookies are sent automatically with requests
- No need to manually include Authorization header
- Used by browser-based applications

**Option 2: Bearer Token (Manual)**
- Extract token from cookie
- Include in Authorization header
- Used by API clients and mobile apps

```javascript
// Get token from cookie
const token = getCookie('sb-access-token');

// Use in request
fetch('/api/subscription/status', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Token Refresh

Tokens expire after 7 days. To refresh:

1. Use `sb-refresh-token` to get new access token
2. Supabase handles this automatically with SDK
3. Manual refresh: Call Supabase Auth refresh endpoint

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding in production:

- 100 requests per minute per IP
- 1000 requests per hour per user
- Special limits for email endpoints (to prevent spam)

---

## Environment Variables Required

```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Deployment
VERCEL_URL=xxx.vercel.app (auto-set by Vercel)

# Email (Resend)
RESEND_API_KEY=re_xxx...

# Internal API Security
INTERNAL_API_SECRET=your-secret-key
```

---

## Testing the APIs

### Using cURL

**1. Start OAuth Flow:**
```bash
curl -X GET https://yourdomain.com/api/auth/google
```

**2. Logout:**
```bash
curl -X POST https://yourdomain.com/api/auth/logout \
  -H "Cookie: sb-access-token=xxx"
```

**3. Get Subscription Status:**
```bash
curl -X GET https://yourdomain.com/api/subscription/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. Send Email:**
```bash
curl -X POST https://yourdomain.com/api/email/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1>"
  }'
```

### Using JavaScript/Fetch

```javascript
// Login (redirects to Google)
window.location.href = '/api/auth/google';

// Get subscription status
const response = await fetch('/api/subscription/status', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const data = await response.json();

// Create subscription
const response = await fetch('/api/subscription/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    plan_id: 'plan_monthly_9900'
  })
});
```

---

## Security Considerations

1. **Always use HTTPS in production**
2. **Tokens are stored in HttpOnly cookies** - JavaScript cannot access them
3. **CORS is configured** - Adjust `Access-Control-Allow-Origin` in production
4. **Validate all inputs** - Email formats, token lengths, required fields
5. **Use Service Role Key carefully** - Only use server-side, never expose to client
6. **Rate limit email endpoints** - Prevent spam and abuse
7. **Sanitize user inputs** - Especially for email HTML content
8. **Monitor failed login attempts** - Detect brute force attacks

---

## Changelog

### Version 1.0.0 (2025-12-14)
- Initial API documentation
- S2BA1: Authentication APIs (Google OAuth, Logout)
- S2BA2: Email APIs (Send, Welcome, Password Reset)
- S2BA3: Subscription APIs (Status, Create, Cancel)
- Error codes standardization
- Security and authentication middleware

---

## Support

For API issues or questions:
- Check error codes in [Error Codes Reference](#error-codes-reference)
- Review authentication flow in [Authentication Flow](#authentication-flow)
- Verify environment variables are set correctly
- Check Supabase logs for database errors
- Check Resend dashboard for email delivery issues

---

**Document End**
