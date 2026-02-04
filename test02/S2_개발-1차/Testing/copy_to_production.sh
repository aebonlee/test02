#!/bin/bash
# ================================================================
# S2T1: Production 디렉토리 복사 스크립트
# ================================================================
# Task ID: S2T1
# 작성일: 2025-12-14
# 목적: 테스트 파일을 Production 디렉토리로 복사
# ================================================================

echo "📦 Copying test files to Production..."

# Source and destination directories
SRC="C:\!SSAL_Works_Private\S2_개발-1차\Testing"
DEST="C:\!SSAL_Works_Private\Production\Testing"

# Copy mock files
echo "Copying __mocks__..."
cp "$SRC/__mocks__/supabase.js" "$DEST/__mocks__/"
cp "$SRC/__mocks__/resend.js" "$DEST/__mocks__/"

# Copy test files
echo "Copying __tests__..."
cp "$SRC/__tests__/auth-middleware.test.js" "$DEST/__tests__/"
cp "$SRC/__tests__/google-auth.test.js" "$DEST/__tests__/"
cp "$SRC/__tests__/subscription.test.js" "$DEST/__tests__/"
cp "$SRC/__tests__/email.test.js" "$DEST/__tests__/"

# Copy README
echo "Copying README..."
cp "$SRC/README.md" "$DEST/"

echo "✅ Copy completed!"
echo ""
echo "Verify with:"
echo "  find '$DEST' -type f | wc -l"
