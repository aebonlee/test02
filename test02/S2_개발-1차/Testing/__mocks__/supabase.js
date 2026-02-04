// ================================================================
// S2T1: Supabase Mock
// ================================================================
// Task ID: S2T1
// 작성일: 2025-12-14
// 목적: Supabase 클라이언트 모킹
// ================================================================

// Mock 사용자 데이터
const mockUser = {
  id: 'test-user-id-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2025-12-14T00:00:00Z'
};

// Mock Query Builder
class MockQueryBuilder {
  constructor() {
    this.queryData = {
      table: null,
      filters: {},
      selectFields: '*'
    };
  }

  select(fields = '*') {
    this.queryData.selectFields = fields;
    return this;
  }

  insert(data) {
    this.queryData.insertData = data;
    return this;
  }

  update(data) {
    this.queryData.updateData = data;
    return this;
  }

  delete() {
    this.queryData.deleteFlag = true;
    return this;
  }

  eq(column, value) {
    this.queryData.filters[column] = value;
    return this;
  }

  in(column, values) {
    this.queryData.filters[`${column}_in`] = values;
    return this;
  }

  single() {
    this.queryData.single = true;
    return this;
  }

  async then(resolve) {
    // Mock 응답 생성
    const mockResponse = this._generateMockResponse();
    return resolve(mockResponse);
  }

  _generateMockResponse() {
    // 기본 성공 응답
    return {
      data: null,
      error: null
    };
  }
}

// Mock Supabase Client
const mockSupabase = {
  auth: {
    getUser: jest.fn(async (token) => {
      if (!token) {
        return {
          data: { user: null },
          error: { message: 'No token provided' }
        };
      }
      if (token === 'invalid-token') {
        return {
          data: { user: null },
          error: { message: 'Invalid token' }
        };
      }
      if (token === 'expired-token') {
        return {
          data: { user: null },
          error: { message: 'Token expired' }
        };
      }
      if (token === 'valid-token') {
        return {
          data: { user: mockUser },
          error: null
        };
      }
      return {
        data: { user: null },
        error: { message: 'Unknown error' }
      };
    }),

    signOut: jest.fn(async () => {
      return { error: null };
    }),

    signInWithOAuth: jest.fn(async ({ provider, options }) => {
      if (provider === 'google') {
        return {
          data: {
            url: 'https://accounts.google.com/o/oauth2/v2/auth?...'
          },
          error: null
        };
      }
      return {
        data: null,
        error: { message: 'Invalid provider' }
      };
    })
  },

  from: jest.fn((table) => {
    const queryBuilder = new MockQueryBuilder();
    queryBuilder.queryData.table = table;
    return queryBuilder;
  })
};

// createClient 함수 모킹
const createClient = jest.fn(() => mockSupabase);

module.exports = {
  createClient,
  mockSupabase,
  mockUser
};
