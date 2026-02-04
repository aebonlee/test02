import re

with open('prototype_index_최종개선_백업2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Perplexity 함수 활성화
old_perplexity = '''            try {
                // TODO: 실제 API 연결 시 아래 코드 활성화
                // const response = await fetch('http://localhost:3030/perplexity/ask', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ question })
                // });
                // const result = await response.json();

                // 임시 응답 (테스트용)
                setTimeout(() => {
                    workspace.value = `📝 질문: ${question}\n\n`;
                    workspace.value += `🔮 Perplexity의 답변:\n\n`;
                    workspace.value += `[여기에 Perplexity의 실제 답변이 표시됩니다]\n\n`;
                    workspace.value += `이 기능을 사용하려면 Perplexity API를 연결하세요.\n`;
                    workspace.value += `자세한 내용은 'PERPLEXITY_API_연결_가이드.md'를 참고하세요.\n\n`;
                    workspace.value += `---\n`;
                    workspace.value += `시간: ${new Date().toLocaleString('ko-KR')}`;

                    // 질문창 초기화
                    document.getElementById('perplexityQuestion').value = '';
                }, 1000);'''

new_perplexity = '''            try {
                const response = await fetch('http://localhost:3030/perplexity/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question })
                });
                const result = await response.json();
                
                if (result.success) {
                    workspace.value = `📝 질문: ${question}\n\n`;
                    workspace.value += `🔮 Perplexity의 답변:\n\n`;
                    workspace.value += result.answer + '\n\n';
                    workspace.value += `---\n`;
                    workspace.value += `시간: ${new Date().toLocaleString('ko-KR')}`;
                    
                    document.getElementById('perplexityQuestion').value = '';
                } else {
                    workspace.value = '❌ 오류: ' + result.error;
                }'''

content = content.replace(old_perplexity, new_perplexity)

with open('prototype_index_최종개선_백업2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Perplexity API activated!")
