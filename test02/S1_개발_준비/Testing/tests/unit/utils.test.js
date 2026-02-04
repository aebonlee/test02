/**
 * SSALWorks v1.0 - Unit Tests: Utility Functions
 * 작성일: 2025-12-13
 */

describe('유틸리티 함수 테스트', () => {
    describe('formatCurrency', () => {
        // 통화 포맷팅 함수 (구현 예정)
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW'
            }).format(amount);
        };

        test('양수 금액을 올바르게 포맷팅해야 함', () => {
            expect(formatCurrency(10000)).toBe('₩10,000');
        });

        test('0원을 올바르게 포맷팅해야 함', () => {
            expect(formatCurrency(0)).toBe('₩0');
        });

        test('큰 금액을 올바르게 포맷팅해야 함', () => {
            expect(formatCurrency(1000000)).toBe('₩1,000,000');
        });
    });

    describe('formatDate', () => {
        // 날짜 포맷팅 함수 (구현 예정)
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        };

        test('날짜를 한국 형식으로 포맷팅해야 함', () => {
            const result = formatDate('2025-12-13');
            expect(result).toMatch(/2025/);
            expect(result).toMatch(/12/);
            expect(result).toMatch(/13/);
        });
    });

    describe('validateEmail', () => {
        // 이메일 검증 함수 (구현 예정)
        const validateEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };

        test('유효한 이메일을 통과시켜야 함', () => {
            expect(validateEmail('user@example.com')).toBe(true);
            expect(validateEmail('test.user@domain.co.kr')).toBe(true);
        });

        test('유효하지 않은 이메일을 거부해야 함', () => {
            expect(validateEmail('')).toBe(false);
            expect(validateEmail('invalid')).toBe(false);
            expect(validateEmail('no@domain')).toBe(false);
            expect(validateEmail('@nodomain.com')).toBe(false);
        });
    });

    describe('truncateText', () => {
        // 텍스트 자르기 함수 (구현 예정)
        const truncateText = (text, maxLength) => {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        };

        test('짧은 텍스트는 그대로 반환해야 함', () => {
            expect(truncateText('짧은 텍스트', 20)).toBe('짧은 텍스트');
        });

        test('긴 텍스트는 잘라서 말줄임표를 추가해야 함', () => {
            const longText = '이것은 매우 긴 텍스트입니다';
            expect(truncateText(longText, 10)).toBe('이것은 매우 긴 텍...');
        });
    });
});

describe('Mock Supabase 테스트', () => {
    let mockSupabase;

    beforeEach(() => {
        mockSupabase = global.testUtils.createMockSupabase();
    });

    test('Supabase 클라이언트가 올바르게 Mock되어야 함', () => {
        expect(mockSupabase.from).toBeDefined();
        expect(mockSupabase.auth).toBeDefined();
    });

    test('from 메서드 체이닝이 동작해야 함', () => {
        const query = mockSupabase.from('users').select('*').eq('id', '1');
        expect(query).toBeDefined();
    });
});

describe('Mock 사용자 데이터 테스트', () => {
    test('기본 Mock 사용자 데이터가 생성되어야 함', () => {
        const user = global.testUtils.createMockUser();

        expect(user.id).toBeDefined();
        expect(user.email).toBe('test@example.com');
        expect(user.role).toBe('user');
    });

    test('커스텀 속성으로 오버라이드할 수 있어야 함', () => {
        const adminUser = global.testUtils.createMockUser({
            role: 'admin',
            email: 'admin@ssalworks.com'
        });

        expect(adminUser.role).toBe('admin');
        expect(adminUser.email).toBe('admin@ssalworks.com');
    });
});
