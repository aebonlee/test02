// S3BI1: AI API 클라이언트 통합 - 에러 정의

class AIError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.details = details;
  }
}

class RateLimitError extends AIError {
  constructor(remaining, resetAt) {
    super('Daily AI usage limit reached', 'RATE_LIMIT_EXCEEDED', {
      remaining,
      resetAt
    });
    this.name = 'RateLimitError';
  }
}

class SubscriptionRequiredError extends AIError {
  constructor(requiredTier) {
    super(`AI features require ${requiredTier} subscription`, 'SUBSCRIPTION_REQUIRED', {
      requiredTier
    });
    this.name = 'SubscriptionRequiredError';
  }
}

class APIKeyError extends AIError {
  constructor() {
    super('AI service is not configured', 'API_KEY_MISSING');
    this.name = 'APIKeyError';
  }
}

module.exports = {
  AIError,
  RateLimitError,
  SubscriptionRequiredError,
  APIKeyError
};
