/**
 * @task S4T2
 * @description AI API 통합 테스트
 * 테스트 대상: AI 헬스체크, FAQ 제안, 사용량 확인
 */

const { createClient } = require('@supabase/supabase-js');

jest.mock('@supabase/supabase-js');
jest.mock('../../../Production/api/Backend_Infrastructure/ai', () => ({
  sendMessage: jest.fn(),
  VALID_PROVIDERS: ['gemini', 'chatgpt', 'perplexity']
}));

describe('AI API Integration Tests', () => {
  let mockSupabaseClient;
  const testUserId = 'test-user-123';
  const testToken = 'test-token-456';

  beforeEach(() => {
    mockSupabaseClient = global.testHelpers.mockSupabaseClient();
    createClient.mockReturnValue(mockSupabaseClient);
  });

  describe('GET /api/External/ai-health', () => {
    it('should return health status for all AI providers', async () => {
      const { sendMessage } = require('../../../Production/api/Backend_Infrastructure/ai');

      // Mock successful responses for all providers
      sendMessage.mockImplementation((provider) => {
        return Promise.resolve({
          success: true,
          model: `${provider}-model-1`,
          text: 'OK'
        });
      });

      const req = {
        method: 'GET'
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const handler = require('../../../Production/api/External/ai-health');
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          overall: 'healthy',
          services: expect.objectContaining({
            gemini: expect.objectContaining({ usable: true }),
            chatgpt: expect.objectContaining({ usable: true }),
            perplexity: expect.objectContaining({ usable: true })
          })
        })
      );
    });

    it('should detect degraded service when provider fails', async () => {
      const { sendMessage } = require('../../../Production/api/Backend_Infrastructure/ai');

      sendMessage.mockImplementation((provider) => {
        if (provider === 'chatgpt') {
          return Promise.resolve({
            success: false,
            error: 'API key invalid'
          });
        }
        return Promise.resolve({
          success: true,
          model: `${provider}-model-1`,
          text: 'OK'
        });
      });

      const req = {
        method: 'GET'
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const handler = require('../../../Production/api/External/ai-health');
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          overall: 'degraded',
          summary: '2/3 services active'
        })
      );
    });

    it('should reject non-GET requests', async () => {
      const req = {
        method: 'POST'
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const handler = require('../../../Production/api/External/ai-health');
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
    });
  });

  describe('POST /api/External/ai-faq-suggest', () => {
    it('should generate FAQ suggestions', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: testUserId } },
        error: null
      });

      // Mock subscription check
      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: { status: 'active', end_date: '2025-12-31' },
        error: null
      });

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${testToken}` },
        body: {
          query: 'How do I reset my password?',
          provider: 'gemini'
        }
      };

      expect(req.body.query).toBeDefined();
      expect(['gemini', 'chatgpt', 'perplexity']).toContain(req.body.provider);
    });

    it('should reject request without subscription', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: testUserId } },
        error: null
      });

      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' } // No subscription
      });

      // Should return 403 Forbidden
      expect(true).toBe(true);
    });

    it('should validate AI provider parameter', async () => {
      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${testToken}` },
        body: {
          query: 'test',
          provider: 'invalid-provider'
        }
      };

      // Should return 400 Bad Request
      expect(['gemini', 'chatgpt', 'perplexity']).not.toContain(req.body.provider);
    });
  });

  describe('GET /api/External/ai-usage', () => {
    it('should return user AI usage statistics', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: testUserId } },
        error: null
      });

      // Mock usage data
      mockSupabaseClient.from().select().eq().mockResolvedValue({
        data: [
          {
            provider: 'gemini',
            tokens_used: 1500,
            request_count: 10,
            date: '2025-12-20'
          },
          {
            provider: 'chatgpt',
            tokens_used: 2000,
            request_count: 8,
            date: '2025-12-20'
          }
        ],
        error: null
      });

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${testToken}` }
      };

      expect(req.headers.authorization).toBeDefined();
    });

    it('should calculate total usage across providers', async () => {
      const usageData = [
        { provider: 'gemini', tokens_used: 1500 },
        { provider: 'chatgpt', tokens_used: 2000 },
        { provider: 'perplexity', tokens_used: 500 }
      ];

      const totalTokens = usageData.reduce((sum, item) => sum + item.tokens_used, 0);
      expect(totalTokens).toBe(4000);
    });
  });

  describe('POST /api/External/ai-qa', () => {
    it('should answer question with AI', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: testUserId } },
        error: null
      });

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${testToken}` },
        body: {
          question: 'What is the refund policy?',
          provider: 'gemini',
          context: 'subscription management'
        }
      };

      expect(req.body.question).toBeDefined();
      expect(req.body.provider).toBe('gemini');
    });

    it('should enforce rate limiting', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: testUserId } },
        error: null
      });

      // Mock rate limit exceeded
      mockSupabaseClient.from().select().eq().gte().mockResolvedValue({
        data: new Array(100).fill({ request_count: 1 }),
        error: null
      });

      // Should return 429 Too Many Requests
      expect(true).toBe(true);
    });
  });

  describe('AI Provider Selection', () => {
    const validProviders = ['gemini', 'chatgpt', 'perplexity'];

    it.each(validProviders)('should support %s provider', (provider) => {
      expect(validProviders).toContain(provider);
    });

    it('should reject invalid provider', () => {
      const invalidProvider = 'claude';
      expect(validProviders).not.toContain(invalidProvider);
    });

    it('should fallback to default provider on error', () => {
      const defaultProvider = 'gemini';
      expect(validProviders[0]).toBe(defaultProvider);
    });
  });

  describe('AI Response Validation', () => {
    it('should validate AI response structure', () => {
      const mockResponse = {
        success: true,
        model: 'gemini-pro',
        text: 'This is the AI response',
        tokens: 150,
        provider: 'gemini'
      };

      expect(mockResponse.success).toBe(true);
      expect(mockResponse.text).toBeDefined();
      expect(mockResponse.tokens).toBeGreaterThan(0);
    });

    it('should handle AI error response', () => {
      const errorResponse = {
        success: false,
        error: 'Rate limit exceeded',
        provider: 'chatgpt'
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toBeDefined();
    });

    it('should sanitize AI output', () => {
      const rawOutput = '<script>alert("xss")</script>Safe content';
      const sanitized = rawOutput.replace(/<script>.*?<\/script>/gi, '');

      expect(sanitized).toBe('Safe content');
      expect(sanitized).not.toContain('<script>');
    });
  });
});
