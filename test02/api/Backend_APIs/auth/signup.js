/**
 * @task S2BA4
 */
// ================================================================
// S2BA4: 회원가입 API
// ================================================================
// 작성일: 2025-12-20
// 목적: 이메일/비밀번호 기반 회원가입 처리
// ================================================================

const { createClient } = require('@supabase/supabase-js');
const { checkPasswordComplexity } = require('../lib/password-utils');

// Supabase 클라이언트 (Service Role Key 사용)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * 회원가입 API
 * @method POST
 * @auth None (Public)
 * @body {string} email - 이메일 주소
 * @body {string} password - 비밀번호
 * @body {string} name - 사용자 이름
 * @returns {Object} { success, user, message }
 */
module.exports = async (req, res) => {
  // ================================================================
  // 1. HTTP 메서드 검증
  // ================================================================
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed'
      }
    });
  }

  // ================================================================
  // 2. 요청 데이터 검증
  // ================================================================
  const { email, password, name, nickname, real_name } = req.body;

  // 필수 필드 검증
  if (!email || !password || !name) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields: email, password, name'
      }
    });
  }

  // ================================================================
  // 3. 이메일 형식 검증
  // ================================================================
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_EMAIL',
        message: 'Invalid email format'
      }
    });
  }

  // 이메일 소문자 변환 (일관성 유지)
  const normalizedEmail = email.toLowerCase().trim();

  // ================================================================
  // 4. 비밀번호 강도 검증
  // ================================================================
  const passwordCheck = checkPasswordComplexity(password);
  if (!passwordCheck.isValid) {
    return res.status(400).json({
      error: {
        code: 'WEAK_PASSWORD',
        message: passwordCheck.message,
        strength: passwordCheck.strength
      }
    });
  }

  // ================================================================
  // 5. 사용자 이름 검증
  // ================================================================
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return res.status(400).json({
      error: {
        code: 'INVALID_NAME',
        message: 'Name must be at least 2 characters'
      }
    });
  }

  if (trimmedName.length > 50) {
    return res.status(400).json({
      error: {
        code: 'INVALID_NAME',
        message: 'Name must be less than 50 characters'
      }
    });
  }

  // ================================================================
  // 6. 중복 이메일 체크
  // ================================================================
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', normalizedEmail)
      .single();

    if (existingUser && !checkError) {
      return res.status(409).json({
        error: {
          code: 'EMAIL_EXISTS',
          message: 'This email is already registered'
        }
      });
    }

    // ================================================================
    // 7. Supabase Auth로 사용자 생성
    // ================================================================
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: password,
      options: {
        data: {
          name: trimmedName
        },
        emailRedirectTo: `${process.env.SITE_URL || 'https://ssalworks.com'}/auth/verify-email`
      }
    });

    if (authError) {
      console.error('Supabase Auth signup error:', authError);

      // 구체적인 에러 처리
      if (authError.message.includes('already registered')) {
        return res.status(409).json({
          error: {
            code: 'EMAIL_EXISTS',
            message: 'This email is already registered'
          }
        });
      }

      return res.status(500).json({
        error: {
          code: 'AUTH_ERROR',
          message: 'Failed to create user account',
          details: authError.message
        }
      });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return res.status(500).json({
        error: {
          code: 'AUTH_ERROR',
          message: 'User creation failed - no user ID returned'
        }
      });
    }

    // ================================================================
    // 8. users 테이블에 프로필 저장
    // ================================================================
    const now = new Date().toISOString();
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: normalizedEmail,
        name: trimmedName,
        nickname: nickname ? nickname.trim() : null,
        real_name: real_name ? real_name.trim() : null,
        subscription_status: 'inactive',
        role: 'user',
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (profileError) {
      console.error('User profile creation error:', profileError);

      // Auth 계정은 생성되었으나 프로필 생성 실패
      // 향후 백그라운드 작업으로 재시도 가능
      return res.status(500).json({
        error: {
          code: 'PROFILE_ERROR',
          message: 'Account created but profile setup failed. Please contact support.',
          details: profileError.message
        }
      });
    }

    // ================================================================
    // 9. 환영 알림 생성 (비동기 - 실패해도 회원가입은 성공)
    // ================================================================
    try {
      await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          notification_type: 'welcome',
          title: 'SSAL Works에 오신 것을 환영합니다!',
          message: 'SSAL Works에 오신 것을 환영합니다!',
          is_read: false,
          created_at: now
        });
      console.log(`Welcome notification created for: ${normalizedEmail}`);
    } catch (notificationError) {
      // 알림 생성 실패는 로그만 남기고 회원가입은 성공 처리
      console.error('Welcome notification creation failed:', notificationError);
    }

    // ================================================================
    // 10. 성공 응답
    // ================================================================
    return res.status(201).json({
      success: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        email_verified: false,
        created_at: userProfile.created_at
      },
      message: 'Account created successfully. Please check your email to verify your account.'
    });

  } catch (error) {
    console.error('Unexpected signup error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred during signup'
      }
    });
  }
};
