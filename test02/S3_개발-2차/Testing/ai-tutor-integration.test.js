/**
 * @task S3T1
 * @description AI 튜터 통합 테스트
 *
 * 이 테스트는 실제 API 호출을 포함하므로 테스트 환경에서 실행해야 합니다.
 * 환경변수: TEST_USER_TOKEN, SUPABASE_URL, GEMINI_API_KEY
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('AI Tutor Integration Tests', () => {
    const testToken = process.env.TEST_USER_TOKEN;

    // Skip tests if no test token
    const testOrSkip = testToken ? test : test.skip;

    describe('Chat API', () => {
        testOrSkip('should reject request without authorization', async () => {
            const response = await fetch(`${API_BASE_URL}/api/ai-tutor/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Test question' })
            });

            expect(response.status).toBe(401);
        });

        testOrSkip('should reject empty message', async () => {
            const response = await fetch(`${API_BASE_URL}/api/ai-tutor/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${testToken}`
                },
                body: JSON.stringify({ message: '' })
            });

            expect(response.status).toBe(400);
        });

        testOrSkip('should return streaming response for valid request', async () => {
            const response = await fetch(`${API_BASE_URL}/api/ai-tutor/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${testToken}`
                },
                body: JSON.stringify({ message: 'SSAL Works란 무엇인가요?' })
            });

            expect(response.status).toBe(200);
            expect(response.headers.get('content-type')).toContain('text/event-stream');

            // Read first few chunks
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let receivedData = false;

            for (let i = 0; i < 5; i++) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                if (chunk.includes('data:')) {
                    receivedData = true;
                    break;
                }
            }

            reader.cancel();
            expect(receivedData).toBe(true);
        }, 30000); // 30 second timeout
    });

    describe('Conversations API', () => {
        testOrSkip('should list conversations', async () => {
            const response = await fetch(`${API_BASE_URL}/api/ai-tutor/conversations`, {
                headers: { 'Authorization': `Bearer ${testToken}` }
            });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(Array.isArray(data)).toBe(true);
        });

        testOrSkip('should create new conversation', async () => {
            const response = await fetch(`${API_BASE_URL}/api/ai-tutor/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${testToken}`
                },
                body: JSON.stringify({ title: '테스트 대화' })
            });

            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data.title).toBe('테스트 대화');
            expect(data.id).toBeDefined();
        });

        testOrSkip('should get conversation by id', async () => {
            // First create a conversation
            const createResponse = await fetch(`${API_BASE_URL}/api/ai-tutor/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${testToken}`
                },
                body: JSON.stringify({ title: '조회 테스트' })
            });

            const created = await createResponse.json();

            // Then get it
            const getResponse = await fetch(`${API_BASE_URL}/api/ai-tutor/conversations?id=${created.id}`, {
                headers: { 'Authorization': `Bearer ${testToken}` }
            });

            expect(getResponse.status).toBe(200);
            const data = await getResponse.json();
            expect(data.id).toBe(created.id);
        });

        testOrSkip('should delete conversation', async () => {
            // First create a conversation
            const createResponse = await fetch(`${API_BASE_URL}/api/ai-tutor/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${testToken}`
                },
                body: JSON.stringify({ title: '삭제 테스트' })
            });

            const created = await createResponse.json();

            // Delete it
            const deleteResponse = await fetch(`${API_BASE_URL}/api/ai-tutor/conversations?id=${created.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${testToken}` }
            });

            expect(deleteResponse.status).toBe(204);

            // Verify deletion
            const getResponse = await fetch(`${API_BASE_URL}/api/ai-tutor/conversations?id=${created.id}`, {
                headers: { 'Authorization': `Bearer ${testToken}` }
            });

            expect(getResponse.status).toBe(404);
        });
    });
});
