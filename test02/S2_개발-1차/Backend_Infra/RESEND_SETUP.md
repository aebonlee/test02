# SSALWorks v1.0 Resend Email Service Setup Guide

> **Task ID**: S2BI1
> **Task Type**: Human-AI Task
> **Last Updated**: 2025-12-15

---

## 1. Resend Account Setup (PO Required)

### Step 1: Sign Up
1. Go to [https://resend.com](https://resend.com)
2. Click "Sign up"
3. Register with Google or email

### Step 2: Get API Key
1. Log in to Resend Dashboard
2. Navigate to **API Keys** in the left sidebar
3. Click **Create API Key**
4. Name: `ssalworks-production` (or `ssalworks-dev` for development)
5. Permission: **Full access** (required for sending emails)
6. Copy the API key immediately (shown only once!)

**API Key Format**:
```
re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 2. Environment Variable Setup (PO Required)

### Option A: Local Development (.env.local)

Create or update `.env.local` file:

```bash
# Resend API Key (from Step 2)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Option B: Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (ssalworks)
3. Navigate to **Settings** > **Environment Variables**
4. Add:
   - Name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Environment: Production, Preview, Development

---

## 3. Domain Setup (Optional - Later Stage)

### For Custom Domain Email (noreply@ssalworks.com)

1. In Resend Dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter: `ssalworks.com`
4. Add DNS records (provided by Resend):

**Required DNS Records**:
| Type | Name | Value |
|------|------|-------|
| TXT | @ | `v=spf1 include:spf.resend.com ~all` |
| CNAME | resend._domainkey | Provided by Resend |

5. Click **Verify** and wait for DNS propagation (up to 24 hours)

**For Development**: Use `onboarding@resend.dev` as sender (no domain setup needed)

---

## 4. Testing Email Send (Verification Step)

### Quick Test Script

Create a test file `test-resend.js`:

```javascript
// test-resend.js
require('dotenv').config({ path: '.env.local' });
const { sendEmail } = require('./S2_개발-1차/Backend_Infra/api/lib/email/resend.js');

async function testEmail() {
  console.log('Testing Resend email...');
  console.log('API Key:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');

  const result = await sendEmail({
    to: 'YOUR_EMAIL@gmail.com', // Replace with your email
    subject: 'SSALWorks Test Email',
    html: `
      <h1>Test Email from SSALWorks</h1>
      <p>This is a test email from SSALWorks v1.0</p>
      <p>Sent at: ${new Date().toISOString()}</p>
    `,
  });

  console.log('Result:', result);
}

testEmail();
```

**Run**:
```bash
npm install resend dotenv
node test-resend.js
```

### Expected Results

**Success**:
```json
{
  "success": true,
  "data": {
    "id": "email_id_here"
  }
}
```

**Failure (API Key not set)**:
```json
{
  "success": false,
  "error": "RESEND_API_KEY is not set in environment variables"
}
```

---

## 5. Implementation Files

### Resend Client
- Path: `S2_개발-1차/Backend_Infra/api/lib/email/resend.js`
- Production: `Production/Backend_APIs/lib/email/resend.js`

### Email Templates
- Welcome: `S2_개발-1차/Backend_Infra/api/lib/email/templates/welcome.js`
- Password Reset: `S2_개발-1차/Backend_Infra/api/lib/email/templates/password-reset.js`

---

## 6. Usage Examples

### Send Welcome Email
```javascript
const { sendTemplateEmail } = require('./api/lib/email/resend');
const { welcomeTemplate } = require('./api/lib/email/templates/welcome');

await sendTemplateEmail({
  to: 'newuser@example.com',
  subject: 'Welcome to SSALWorks!',
  template: welcomeTemplate,
  data: { userName: 'John' },
});
```

### Send Password Reset Email
```javascript
const { sendTemplateEmail } = require('./api/lib/email/resend');
const { passwordResetTemplate } = require('./api/lib/email/templates/password-reset');

await sendTemplateEmail({
  to: 'user@example.com',
  subject: 'Password Reset Request',
  template: passwordResetTemplate,
  data: { resetLink: 'https://ssalworks.com/reset?token=abc123' },
});
```

---

## 7. Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| Emails per month | 3,000 |
| Domains | 1 |
| API Rate Limit | 10/second |

---

## 8. Troubleshooting

### Error: "RESEND_API_KEY is not set"
- Check `.env.local` file exists
- Check API key is correctly copied (no spaces)
- Restart development server after adding env variable

### Error: "Domain not verified"
- Use `onboarding@resend.dev` for testing
- Check DNS records in Resend Dashboard
- Wait for DNS propagation (up to 24 hours)

### Error: "Invalid API Key"
- Create a new API key in Resend Dashboard
- Ensure you're using the correct key for the environment

---

## 9. Completion Checklist

- [ ] Resend account created
- [ ] API Key obtained
- [ ] `RESEND_API_KEY` environment variable set
- [ ] Test email sent successfully
- [ ] Email received in inbox

**This task is NOT complete until a test email is successfully received!**

---

## 10. Related Tasks

- **S2BA2**: Email API Endpoints (uses this setup)
- **S2F2**: Password Reset UI (triggers password reset email)
