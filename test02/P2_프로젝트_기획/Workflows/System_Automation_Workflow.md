# System Automation Workflow

**문서 버전:** 1.0
**작성일:** 2025-12-02
**작성 근거:** 실제 구현 계획 및 User Flow 문서 기반
**대상:** 자동화된 시스템 프로세스

---

## 📋 목차

1. [개요](#개요)
2. [일일 자동화 (Daily Automation)](#일일-자동화-daily-automation)
3. [월간 자동화 (Monthly Automation)](#월간-자동화-monthly-automation)
4. [이벤트 기반 자동화 (Event-driven Automation)](#이벤트-기반-자동화-event-driven-automation)
5. [알림 시스템 (Notification System)](#알림-시스템-notification-system)
6. [모니터링 및 로깅 (Monitoring & Logging)](#모니터링-및-로깅-monitoring--logging)

---

## 개요

### 목적
관리자의 수동 작업을 최소화하고, 시스템이 자동으로 반복 작업을 처리하도록 구성

### 기술 스택
- **Cron Jobs:** Supabase Edge Functions (Deno)
- **Webhooks:** Supabase Database Webhooks
- **알림:** SendGrid (Email), Socket.io (Real-time)
- **모니터링:** Sentry, Supabase Logs

### 자동화 철학
> **"관리자는 판단만 하고, 실행은 시스템이"**

- ✅ 반복적인 작업은 100% 자동화
- ✅ 예외 상황만 관리자에게 알림
- ✅ 모든 자동화 작업 로그 기록

---

## 일일 자동화 (Daily Automation)

### 1. AI 가격 자동 업데이트 (매일 00:00)

#### 1-1. 개요
- **실행 시간:** 매일 00:00 (KST)
- **목적:** API 원가 + 30% 마진 자동 계산하여 사용자 가격 업데이트
- **참조:** User Flow #4 - Real-time Credit & Pricing

#### 1-2. 자동화 흐름

```
00:00 Cron Job 실행
    ↓
전일(00:00 ~ 23:59) API 사용 로그 집계
    ↓
API별 평균 원가 계산
    ↓
마진 30% 적용 + 10원 단위 절상
    ↓
ai_pricing 테이블 업데이트
    ↓
가격 변동 ±10% 초과 시 관리자 알림
    ↓
완료 로그 기록
```

#### 1-3. 코드 예시 (Supabase Edge Function)

```javascript
// /functions/update-ai-pricing/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    console.log('[00:00] AI 가격 업데이트 시작')

    const aiServices = ['chatgpt', 'gemini', 'perplexity']

    for (const service of aiServices) {
      // Step 1: 전일 사용 로그에서 평균 원가 계산
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: usageLogs, error: usageError } = await supabase
        .from('api_usage_log')
        .select('cost_krw, tokens_used')
        .eq('ai_service', service)
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString())

      if (usageError) throw usageError

      if (!usageLogs || usageLogs.length === 0) {
        console.log(`${service}: 전일 사용 내역 없음, 가격 유지`)
        continue
      }

      // 평균 원가 계산
      const totalCost = usageLogs.reduce((sum, log) => sum + log.cost_krw, 0)
      const avgCost = totalCost / usageLogs.length

      console.log(`${service} 평균 원가: ₩${avgCost.toFixed(2)}`)

      // Step 2: 최근 7일 평균 (안정성)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: weekLogs } = await supabase
        .from('api_cost_daily')
        .select('avg_cost_per_query')
        .eq('ai_service', service)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false })
        .limit(7)

      let finalApiCost = avgCost

      if (weekLogs && weekLogs.length > 0) {
        const weekAvg = weekLogs.reduce((sum, log) =>
          sum + parseFloat(log.avg_cost_per_query), 0) / weekLogs.length

        // 7일 평균과 전일 평균의 가중 평균 (7:3)
        finalApiCost = (weekAvg * 0.7 + avgCost * 0.3)
      }

      console.log(`${service} 최종 원가: ₩${finalApiCost.toFixed(2)}`)

      // Step 3: 마진 30% 적용
      const costWithMargin = finalApiCost * 1.30

      // Step 4: 10원 단위 절상
      const finalPrice = Math.ceil(costWithMargin / 10) * 10

      console.log(`${service} 최종 가격: ₩${finalPrice}`)

      // Step 5: 기존 가격 조회
      const { data: currentPricing } = await supabase
        .from('ai_pricing')
        .select('price_per_query, id')
        .eq('ai_service', service)
        .single()

      const oldPrice = currentPricing?.price_per_query || 0
      const priceChange = ((finalPrice - oldPrice) / oldPrice) * 100

      // Step 6: ai_pricing 테이블 업데이트
      const { error: updateError } = await supabase
        .from('ai_pricing')
        .upsert({
          ai_service: service,
          price_per_query: finalPrice,
          api_cost: finalApiCost,
          margin_rate: 0.30,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'ai_service'
        })

      if (updateError) throw updateError

      // Step 7: ai_pricing_history 기록
      await supabase
        .from('ai_pricing_history')
        .insert({
          ai_service: service,
          price_per_query: finalPrice,
          api_cost: finalApiCost,
          is_latest: true
        })

      // 이전 히스토리는 is_latest = false
      await supabase
        .from('ai_pricing_history')
        .update({ is_latest: false })
        .eq('ai_service', service)
        .neq('price_per_query', finalPrice)

      // Step 8: api_cost_daily 집계 기록
      await supabase
        .from('api_cost_daily')
        .insert({
          ai_service: service,
          date: yesterday.toISOString().split('T')[0],
          total_queries: usageLogs.length,
          avg_cost_per_query: finalApiCost
        })

      // Step 9: 가격 변동 ±10% 초과 시 관리자 알림
      if (Math.abs(priceChange) > 10) {
        console.log(`⚠️ ${service} 가격 변동: ${priceChange.toFixed(1)}%`)

        // SendGrid로 관리자 이메일 발송
        await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: 'admin@ssalworks.com' }]
            }],
            from: { email: 'noreply@ssalworks.com' },
            subject: `[알림] ${service} 가격 ${priceChange > 0 ? '인상' : '인하'} ${Math.abs(priceChange).toFixed(1)}%`,
            content: [{
              type: 'text/plain',
              value: `
${service} AI 가격이 크게 변동되었습니다.

[변경 내역]
- 이전 가격: ₩${oldPrice}
- 새 가격: ₩${finalPrice}
- 변동률: ${priceChange.toFixed(1)}%

[원인]
- API 원가: ₩${finalApiCost.toFixed(2)}
- 마진 30% 적용: ₩${costWithMargin.toFixed(2)}
- 10원 단위 절상: ₩${finalPrice}

Admin Dashboard에서 확인하세요.
              `
            }]
          })
        })
      }

      console.log(`✅ ${service} 가격 업데이트 완료: ₩${oldPrice} → ₩${finalPrice}`)
    }

    console.log('[완료] AI 가격 업데이트 성공')

    return new Response(
      JSON.stringify({ success: true, message: 'AI 가격 업데이트 완료' }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('[오류] AI 가격 업데이트 실패:', error)

    // Sentry 오류 리포트
    // (Sentry SDK 연동 코드)

    // 관리자 긴급 알림
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'admin@ssalworks.com' }]
        }],
        from: { email: 'noreply@ssalworks.com' },
        subject: '[긴급] AI 가격 자동 업데이트 실패',
        content: [{
          type: 'text/plain',
          value: `
AI 가격 자동 업데이트 중 오류가 발생했습니다.

[오류 메시지]
${error.message}

[오류 시간]
${new Date().toISOString()}

수동으로 가격을 확인해주세요.
          `
        }]
      })
    })

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

#### 1-4. Cron 설정

**Supabase Edge Functions Cron:**
```sql
-- Supabase Dashboard → Database → Cron Jobs
SELECT cron.schedule(
  'update-ai-pricing-daily',
  '0 0 * * *', -- 매일 00:00 (UTC 기준이므로 KST 고려)
  $$
  SELECT net.http_post(
    url := 'https://[project-id].supabase.co/functions/v1/update-ai-pricing',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer [anon-key]"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

---

### 2. 이탈 위험 사용자 알림 (매일 09:00)

#### 2-1. 개요
- **실행 시간:** 매일 09:00 (KST)
- **목적:** 7일 이상 미로그인 구독 사용자에게 재참여 이메일 발송

#### 2-2. 자동화 흐름

```
09:00 Cron Job 실행
    ↓
users 테이블에서 조회:
  - subscription_status = 'active'
  - last_login < 7일 전
  - onboarding_completed = true
    ↓
각 사용자별 크레딧 잔액 확인
    ↓
잔액 상태에 따라 맞춤 이메일 발송:
  - 잔액 충분 (10,000 C 이상): 기능 소개 이메일
  - 잔액 부족 (10,000 C 미만): 충전 유도 이메일
    ↓
발송 기록 저장 (중복 방지)
    ↓
완료 로그 기록
```

#### 2-3. 코드 예시

```javascript
// /functions/send-churn-risk-emails/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    console.log('[09:00] 이탈 위험 사용자 알림 시작')

    // Step 1: 7일 이상 미로그인 구독 사용자 조회
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: churnRiskUsers, error } = await supabase
      .from('users')
      .select('user_id, email, name, credit_balance, last_login')
      .eq('subscription_status', 'active')
      .eq('onboarding_completed', true)
      .lt('last_login', sevenDaysAgo.toISOString())

    if (error) throw error

    if (!churnRiskUsers || churnRiskUsers.length === 0) {
      console.log('이탈 위험 사용자 없음')
      return new Response(
        JSON.stringify({ success: true, message: '이탈 위험 사용자 없음' }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    console.log(`이탈 위험 사용자 ${churnRiskUsers.length}명 발견`)

    // Step 2: 각 사용자별 이메일 발송
    for (const user of churnRiskUsers) {
      // 중복 발송 방지: 최근 7일 내 발송 이력 확인
      const { data: recentEmail } = await supabase
        .from('email_logs')
        .select('id')
        .eq('user_id', user.user_id)
        .eq('email_type', 'churn_prevention')
        .gte('sent_at', sevenDaysAgo.toISOString())
        .single()

      if (recentEmail) {
        console.log(`${user.email}: 최근 7일 내 발송 이력 있음, 스킵`)
        continue
      }

      // 크레딧 잔액에 따라 이메일 템플릿 선택
      const hasEnoughCredit = user.credit_balance >= 10000
      const emailTemplate = hasEnoughCredit
        ? getFeatureIntroEmailTemplate(user)
        : getRechargeEmailTemplate(user)

      // SendGrid 이메일 발송
      const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: user.email, name: user.name }]
          }],
          from: {
            email: 'sunny@ssalworks.com',
            name: '써니'
          },
          subject: emailTemplate.subject,
          content: [{
            type: 'text/html',
            value: emailTemplate.html
          }]
        })
      })

      if (!sendGridResponse.ok) {
        console.error(`${user.email}: 이메일 발송 실패`)
        continue
      }

      // 발송 기록 저장
      await supabase
        .from('email_logs')
        .insert({
          user_id: user.user_id,
          email_type: 'churn_prevention',
          email_template: hasEnoughCredit ? 'feature_intro' : 'recharge',
          sent_at: new Date().toISOString()
        })

      console.log(`✅ ${user.email}: 이메일 발송 완료`)
    }

    console.log('[완료] 이탈 위험 사용자 알림 완료')

    return new Response(
      JSON.stringify({
        success: true,
        message: `${churnRiskUsers.length}명에게 이메일 발송 완료`
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('[오류] 이탈 위험 사용자 알림 실패:', error)

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// 이메일 템플릿 함수
function getFeatureIntroEmailTemplate(user) {
  return {
    subject: `[SSAL Works] ${user.name}님, 그동안 안녕하셨나요? 😊`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Noto Sans KR', sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6B5CCC 0%, #5847B3 100%);
              color: white; padding: 30px; text-align: center; }
    .content { background: white; padding: 30px; }
    .cta-button { background: #CC785C; color: white; padding: 15px 30px;
                  text-decoration: none; border-radius: 8px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>안녕하세요, ${user.name}님! 👋</h1>
    </div>
    <div class="content">
      <p>최근 7일간 로그인 기록이 없어 안부 인사드립니다.</p>

      <p><strong>${user.name}님의 계정에는 아직 ${user.credit_balance.toLocaleString()} C가 남아있어요.</strong></p>
      <p>AI 써니가 기다리고 있답니다! 🤖</p>

      <h3>새로운 기능 소식 ✨</h3>
      <ul>
        <li><strong>Gemini 1.5 Pro 추가:</strong> 더 긴 컨텍스트로 복잡한 질문도 OK</li>
        <li><strong>이미지 분석:</strong> 이미지를 업로드하고 분석 요청</li>
        <li><strong>향상된 응답 속도:</strong> 평균 2초 이내 응답</li>
      </ul>

      <p style="text-align: center; margin: 30px 0;">
        <a href="https://ssalworks.com/dashboard" class="cta-button">
          대시보드 바로가기 →
        </a>
      </p>

      <p>도움이 필요하시면 언제든 "써니에게 묻기"를 이용해주세요!</p>

      <p>감사합니다.<br>써니 드림</p>
    </div>
  </div>
</body>
</html>
    `
  }
}

function getRechargeEmailTemplate(user) {
  return {
    subject: `[SSAL Works] ${user.name}님, 크레딧 충전하고 다시 시작해보세요! 🎁`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Noto Sans KR', sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6B5CCC 0%, #5847B3 100%);
              color: white; padding: 30px; text-align: center; }
    .content { background: white; padding: 30px; }
    .highlight-box { background: #FFF3E0; border-left: 4px solid #CC785C;
                     padding: 15px; margin: 20px 0; }
    .cta-button { background: #CC785C; color: white; padding: 15px 30px;
                  text-decoration: none; border-radius: 8px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>안녕하세요, ${user.name}님! 👋</h1>
    </div>
    <div class="content">
      <p>최근 7일간 로그인 기록이 없어 안부 인사드립니다.</p>

      <p>현재 잔액이 <strong>${user.credit_balance.toLocaleString()} C</strong>로 부족할 수 있어요.</p>

      <div class="highlight-box">
        <h3 style="margin-top: 0;">💡 AI 크레딧 충전</h3>
        <p><strong>토스페이먼츠로 간편하게 충전하세요!</strong></p>
        <ul>
          <li>충전 금액: ₩10,000 / ₩30,000 / ₩50,000 / ₩100,000</li>
          <li>결제 방식: 토스페이먼츠</li>
          <li>충전 즉시 사용 가능</li>
        </ul>
      </div>

      <p style="text-align: center; margin: 30px 0;">
        <a href="https://ssalworks.com/credit/recharge" class="cta-button">
          지금 바로 충전하기 →
        </a>
      </p>

      <p>감사합니다.<br>써니 드림</p>
    </div>
  </div>
</body>
</html>
    `
  }
}
```

---

## 월간 자동화 (Monthly Automation)

### 1. 구독료 자동 청구 (매월 1일 00:00)

#### 1-1. 개요
- **실행 시간:** 매월 1일 00:00 (KST)
- **목적:** 4개월차 이상 구독 회원에게 월 사용료 ₩50,000 자동 청구
- **참고:** 1~3개월차는 무료 이용 기간 (개설비 납부 혜택)

#### 1-2. 자동화 흐름

```
매월 1일 00:00 Cron Job 실행
    ↓
monthly_subscriptions 조회:
  - status = 'active'
  - next_payment_date = 오늘
  - subscription_month >= 4 (1~3개월차 제외)
    ↓
각 회원별 결제 수단 확인
    ↓
PG사 API 호출하여 자동 결제 시도
    ↓
성공 / 실패 분기:

  [성공]
  - payment_transactions 기록
  - next_payment_date += 1개월
  - 영수증 이메일 발송

  [실패]
  - 실패 사유 기록
  - 사용자에게 실패 알림 이메일
  - 재시도 스케줄 등록 (1일 후, 3일 후, 7일 후)
    ↓
관리자에게 결과 리포트 이메일 발송
    ↓
완료 로그 기록
```

#### 1-3. 코드 예시 (핵심 부분)

```javascript
// /functions/charge-monthly-subscriptions/index.ts

serve(async (req) => {
  const supabase = createClient(/*...*/)

  try {
    console.log('[매월 1일 00:00] 구독료 자동 청구 시작')

    const today = new Date().toISOString().split('T')[0]

    // Step 1: 오늘 청구 대상 조회
    const { data: subscriptions, error } = await supabase
      .from('monthly_subscriptions')
      .select(`
        id,
        user_id,
        users (email, name),
        payment_method,
        payment_method_id,
        next_payment_date
      `)
      .eq('status', 'active')
      .eq('next_payment_date', today)

    if (error) throw error

    console.log(`청구 대상: ${subscriptions.length}명`)

    let successCount = 0
    let failCount = 0
    const failedUsers = []

    // Step 2: 각 회원별 청구 시도
    for (const sub of subscriptions) {
      try {
        // PG사 API 호출 (예: KG이니시스)
        const paymentResult = await chargeCreditCard({
          userId: sub.user_id,
          paymentMethodId: sub.payment_method_id,
          amount: 50000,
          description: `SSAL Works 월 사용료 (${today})`
        })

        if (paymentResult.success) {
          // 성공: payment_transactions 기록
          await supabase
            .from('payment_transactions')
            .insert({
              user_id: sub.user_id,
              amount: 50000,
              payment_method: sub.payment_method,
              transaction_type: 'subscription',
              status: 'completed',
              pg_transaction_id: paymentResult.transactionId
            })

          // next_payment_date 업데이트 (+1개월)
          const nextMonth = new Date(sub.next_payment_date)
          nextMonth.setMonth(nextMonth.getMonth() + 1)

          await supabase
            .from('monthly_subscriptions')
            .update({
              next_payment_date: nextMonth.toISOString().split('T')[0],
              last_payment_date: today
            })
            .eq('id', sub.id)

          // 영수증 이메일 발송
          await sendReceiptEmail(sub.users.email, {
            amount: 50000,
            transactionId: paymentResult.transactionId,
            date: today
          })

          successCount++
          console.log(`✅ ${sub.users.email}: 청구 성공`)

        } else {
          throw new Error(paymentResult.errorMessage)
        }

      } catch (error) {
        // 실패 처리
        await supabase
          .from('payment_transactions')
          .insert({
            user_id: sub.user_id,
            amount: 50000,
            payment_method: sub.payment_method,
            transaction_type: 'subscription',
            status: 'failed',
            error_message: error.message
          })

        // 재시도 스케줄 등록 (1일 후)
        await supabase
          .from('payment_retry_queue')
          .insert({
            user_id: sub.user_id,
            subscription_id: sub.id,
            retry_date: new Date(Date.now() + 24*60*60*1000).toISOString(),
            retry_count: 1
          })

        // 실패 알림 이메일
        await sendPaymentFailureEmail(sub.users.email, {
          reason: error.message,
          retryDate: '내일'
        })

        failCount++
        failedUsers.push({
          email: sub.users.email,
          reason: error.message
        })
        console.log(`❌ ${sub.users.email}: 청구 실패 - ${error.message}`)
      }
    }

    // Step 3: 관리자 리포트 이메일
    await sendAdminReport({
      total: subscriptions.length,
      success: successCount,
      fail: failCount,
      failedUsers: failedUsers
    })

    console.log(`[완료] 성공: ${successCount}, 실패: ${failCount}`)

    return new Response(
      JSON.stringify({
        success: true,
        total: subscriptions.length,
        success: successCount,
        fail: failCount
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('[오류] 구독료 자동 청구 실패:', error)
    // 관리자 긴급 알림
    return new Response(/*...*/)
  }
})
```

---

### 2. 챌린지 만료 알림 (매월 1일 09:00)

#### 2-1. 개요
- **실행 시간:** 매월 1일 09:00 (KST)
- **목적:** 챌린지 종료일 도래 회원에게 환불 신청 안내

#### 2-2. 자동화 흐름

```
매월 1일 09:00 Cron Job 실행
    ↓
payment_transactions 조회:
  - transaction_type = 'installation'
  - created_at = 3개월 전 (±3일)
  - refund_status = NULL or 'pending'
    ↓
각 회원별로:
  - 환불 신청 여부 확인
  - 미신청자에게 환불 신청 안내 이메일
    ↓
완료 로그 기록
```

---

## 이벤트 기반 자동화 (Event-driven Automation)

### 1. 신규 가입 환영 이메일

#### 1-1. 트리거
- **이벤트:** `users` 테이블 INSERT
- **조건:** `email_verified = true`

#### 1-2. Supabase Database Webhook 설정

```sql
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Supabase Edge Function 호출
  PERFORM net.http_post(
    url := 'https://[project-id].supabase.co/functions/v1/send-welcome-email',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'user_id', NEW.user_id,
      'email', NEW.email,
      'name', NEW.name
    )::text::jsonb
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created
AFTER INSERT ON users
FOR EACH ROW
WHEN (NEW.email_verified = true)
EXECUTE FUNCTION send_welcome_email();
```

#### 1-3. Edge Function 코드

```javascript
// /functions/send-welcome-email/index.ts

serve(async (req) => {
  const { user_id, email, name } = await req.json()

  // SendGrid 환영 이메일 발송
  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: email, name: name }]
      }],
      from: {
        email: 'sunny@ssalworks.com',
        name: '써니'
      },
      subject: '🎉 SSAL Works에 오신 것을 환영합니다!',
      content: [{
        type: 'text/html',
        value: `
<!DOCTYPE html>
<html>
<body>
  <h1>안녕하세요, ${name}님! 👋</h1>
  <p>SSAL Works 가입을 진심으로 환영합니다!</p>

  <h2>시작하기</h2>
  <ol>
    <li>프로젝트 등록하기</li>
    <li>AI 써니에게 첫 질문하기</li>
    <li>학습 콘텐츠 둘러보기</li>
  </ol>

  <a href="https://ssalworks.com/onboarding" style="background: #CC785C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
    온보딩 시작하기 →
  </a>

  <p>도움이 필요하시면 "써니에게 묻기"를 이용해주세요!</p>
  <p>감사합니다.<br>써니 드림</p>
</body>
</html>
        `
      }]
    })
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
```

---

### 2. 크레딧 부족 알림

#### 2-1. 트리거
- **이벤트:** `users.credit_balance` 업데이트
- **조건:** `credit_balance < 1000`

#### 2-2. Database Trigger

```sql
CREATE OR REPLACE FUNCTION check_low_credit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.credit_balance < 1000 AND OLD.credit_balance >= 1000 THEN
    -- Edge Function 호출
    PERFORM net.http_post(
      url := 'https://[project-id].supabase.co/functions/v1/send-low-credit-alert',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'user_id', NEW.user_id,
        'email', NEW.email,
        'credit_balance', NEW.credit_balance
      )::text::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_credit_low
AFTER UPDATE OF credit_balance ON users
FOR EACH ROW
EXECUTE FUNCTION check_low_credit();
```

---

### 3. 결제 완료 처리

#### 3-1. 트리거
- **이벤트:** `payment_transactions.status` 업데이트
- **조건:** `status = 'completed'`

#### 3-2. 자동 처리 내용

**설치비 결제 완료 시:**
```javascript
if (transaction_type === 'installation') {
  // 1. users 테이블 업데이트
  await supabase
    .from('users')
    .update({
      installation_paid: true,
      subscription_start_date: new Date().toISOString()
    })
    .eq('user_id', user_id)

  // 2. monthly_subscriptions 생성 (1~3개월 무료, 4개월차부터 결제)
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  await supabase
    .from('monthly_subscriptions')
    .insert({
      user_id: user_id,
      status: 'active',
      next_payment_date: nextMonth.toISOString().split('T')[0]
    })

  // 3. 영수증 이메일 발송
  await sendReceiptEmail(user_email, { /*...*/ })
}
```

**크레딧 충전 완료 시:**
```javascript
if (transaction_type === 'credit_recharge') {
  // 1. users.credit_balance 증가
  await supabase
    .from('users')
    .update({
      credit_balance: credit_balance + amount
    })
    .eq('user_id', user_id)

  // 2. credit_transactions 기록
  await supabase
    .from('credit_transactions')
    .insert({
      user_id: user_id,
      amount: amount,
      transaction_type: 'recharge',
      balance_after: credit_balance + amount
    })

  // 3. 충전 완료 이메일 발송
  await sendRechargeConfirmEmail(user_email, { /*...*/ })
}
```

---

## 알림 시스템 (Notification System)

### 1. 이메일 알림 (SendGrid)

#### 1-1. 알림 유형

| 유형 | 트리거 | 수신자 | 템플릿 |
|------|--------|--------|--------|
| 환영 이메일 | 신규 가입 | 사용자 | welcome |
| 결제 완료 | 결제 성공 | 사용자 | payment_success |
| 결제 실패 | 결제 실패 | 사용자 | payment_failure |
| 크레딧 부족 | 잔액 < 1,000 C | 사용자 | low_credit |
| 이탈 방지 | 7일 미로그인 | 사용자 | churn_prevention |
| 문의 답변 | 답변 완료 | 사용자 | inquiry_answered |
| 구독 정지 | 7일 미납 | 사용자 | subscription_suspended |
| 가격 변동 | ±10% 초과 | 관리자 | price_change_alert |
| 시스템 장애 | 장애 발생 | 관리자 | system_failure |

---

### 2. 플랫폼 내 알림 (In-app Notifications)

#### 2-1. 알림 저장

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(8) REFERENCES users(user_id),
  notification_type VARCHAR(50),
  title VARCHAR(200),
  message TEXT,
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2-2. 실시간 알림 (Supabase Realtime)

**프론트엔드 구독:**
```javascript
// frontend: dashboard.js

const supabase = createClient(/*...*/)

// 알림 실시간 구독
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${currentUserId}`
  }, (payload) => {
    // 새 알림 도착
    showToast({
      type: 'info',
      message: payload.new.title,
      action: payload.new.link
    })

    // 알림 뱃지 업데이트
    updateNotificationBadge()
  })
  .subscribe()
```

---

### 3. 관리자 알림 (Admin Alerts)

#### 3-1. 긴급 알림 (Slack + Email)

**Slack Webhook 연동:**
```javascript
async function sendAdminSlackAlert(message) {
  await fetch(Deno.env.get('SLACK_WEBHOOK_URL'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚨 [SSAL Works 알림]\n${message}`,
      channel: '#admin-alerts'
    })
  })
}

// 사용 예시
await sendAdminSlackAlert('AI 가격 업데이트 실패! 수동 확인 필요')
```

---

## 모니터링 및 로깅 (Monitoring & Logging)

### 1. Health Check (매 5분)

#### 1-1. 모니터링 항목

```javascript
// /functions/health-check/index.ts

serve(async (req) => {
  const checks = {
    database: false,
    authentication: false,
    ai_apis: {
      chatgpt: false,
      gemini: false,
      perplexity: false
    },
    email: false
  }

  try {
    // 1. Database 연결 확인
    const { error: dbError } = await supabase
      .from('users')
      .select('user_id')
      .limit(1)

    checks.database = !dbError

    // 2. Authentication 확인
    const { error: authError } = await supabase.auth.getSession()
    checks.authentication = !authError

    // 3. AI API 상태 확인
    checks.ai_apis.chatgpt = await checkOpenAIStatus()
    checks.ai_apis.gemini = await checkGeminiStatus()
    checks.ai_apis.perplexity = await checkPerplexityStatus()

    // 4. Email 서비스 확인
    checks.email = await checkSendGridStatus()

    // 모든 체크 통과 여부
    const allHealthy = checks.database &&
                       checks.authentication &&
                       checks.ai_apis.chatgpt &&
                       checks.ai_apis.gemini &&
                       checks.ai_apis.perplexity &&
                       checks.email

    if (!allHealthy) {
      // 관리자 알림
      await sendAdminSlackAlert(`Health Check 실패:\n${JSON.stringify(checks, null, 2)}`)
    }

    return new Response(
      JSON.stringify({
        status: allHealthy ? 'healthy' : 'unhealthy',
        checks: checks,
        timestamp: new Date().toISOString()
      }),
      {
        status: allHealthy ? 200 : 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ status: 'error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

---

### 2. 자동화 로그 기록

#### 2-1. 로그 테이블

```sql
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_type VARCHAR(100), -- 'ai_pricing', 'subscription_charge' 등
  status VARCHAR(20), -- 'success', 'failure', 'partial'
  details JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2-2. 로그 기록 예시

```javascript
// 자동화 시작 시
const startTime = Date.now()

try {
  // 자동화 로직 수행
  // ...

  // 성공 로그
  await supabase
    .from('automation_logs')
    .insert({
      automation_type: 'ai_pricing_update',
      status: 'success',
      details: {
        updated_services: ['chatgpt', 'gemini', 'perplexity'],
        price_changes: { /*...*/ }
      },
      execution_time_ms: Date.now() - startTime
    })

} catch (error) {
  // 실패 로그
  await supabase
    .from('automation_logs')
    .insert({
      automation_type: 'ai_pricing_update',
      status: 'failure',
      error_message: error.message,
      execution_time_ms: Date.now() - startTime
    })
}
```

---

### 3. Sentry 오류 추적

#### 3-1. Sentry 연동

```javascript
import * as Sentry from 'https://deno.land/x/sentry/index.ts'

Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN'),
  environment: 'production',
  tracesSampleRate: 1.0
})

// 사용 예시
try {
  // 자동화 로직
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      automation_type: 'ai_pricing_update'
    },
    extra: {
      timestamp: new Date().toISOString()
    }
  })

  throw error
}
```

---

## 부록: 자동화 스케줄 요약

| 자동화 작업 | 실행 시간 | 빈도 | 예상 소요 시간 |
|------------|----------|------|---------------|
| AI 가격 업데이트 | 매일 00:00 | Daily | 2-3분 |
| 이탈 위험 사용자 알림 | 매일 09:00 | Daily | 5-10분 |
| 구독료 자동 청구 | 매월 1일 00:00 | Monthly | 10-20분 |
| 챌린지 만료 알림 | 매월 1일 09:00 | Monthly | 2-3분 |
| Health Check | 매 5분 | Continuous | 10초 |
| 신규 가입 환영 이메일 | 이벤트 기반 | On-demand | 즉시 |
| 크레딧 부족 알림 | 이벤트 기반 | On-demand | 즉시 |
| 결제 완료 처리 | 이벤트 기반 | On-demand | 즉시 |

---

**문서 끝**
