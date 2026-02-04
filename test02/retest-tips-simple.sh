#!/bin/bash

API_URL="https://www.ssalworks.ai.kr/api/ai-tutor/test"

echo "═══════════════════════════════════════════════════════"
echo "  실전 Tips 재테스트 (간단한 질문)"
echo "═══════════════════════════════════════════════════════"
echo ""

# 간단한 키워드 중심 질문
questions=(
    "디버깅 방법"
    "Git 브랜치 사용법"
    "Vercel 사용법"
    "Task ID 관리"
    "Vanilla JavaScript"
    "다국어 웹사이트"
    "반응형 디자인"
    "배포 체크리스트"
    "RLS 정책"
    "Phase Gate"
)

for i in "${!questions[@]}"; do
    question="${questions[$i]}"
    num=$((i+1))
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "[$num/10] 질문: \"$question\""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"message\":\"$question\"}" \
        --no-buffer 2>&1 | grep '"text":' | head -3)
    
    if echo "$response" | grep -q "학습 자료에서 찾을 수 없습니다"; then
        echo "❌ 답변 없음"
    else
        echo "✅ 답변 있음"
        echo "$response" | sed 's/data: {"text":"//g' | sed 's/"}//g' | head -1
    fi
    
    echo ""
    sleep 2
done

echo "═══════════════════════════════════════════════════════"
echo "  테스트 완료!"
echo "═══════════════════════════════════════════════════════"
