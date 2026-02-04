/**
 * AI 튜터 자동 테스트 및 검증 스크립트
 * 학습 콘텐츠 기반으로 답변 정확도 검증
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 테스트 케이스 정의
const TEST_CASES = [
  {
    id: 'supabase-database',
    question: 'Supabase 데이터베이스는 무엇을 기반으로 하나요?',
    correctKeywords: ['PostgreSQL'],
    incorrectKeywords: ['SSAL Works', 'SSAL 워크스', 'MySQL', 'MongoDB'],
    source: '2권_풀스택_웹사이트_개발_기초지식/30편_심화_-_Supabase.md (10번 줄)'
  },
  {
    id: 'git-install',
    question: 'Git을 다운로드하려면 어디에 접속해야 해?',
    correctKeywords: ['git-scm.com', 'https://git-scm.com'],
    incorrectKeywords: ['SSAL Works', 'SSAL 워크스'],
    source: '2권_풀스택_웹사이트_개발_기초지식/05편_Git과_GitHub.md (69번 줄)'
  },
  {
    id: 'supabase-api-key',
    question: 'Supabase API 키는 어디서 확인하나요?',
    correctKeywords: ['Project Settings', 'API'],
    incorrectKeywords: ['SSAL Works', 'SSAL 워크스'],
    source: '2권_풀스택_웹사이트_개발_기초지식/30편_심화_-_Supabase.md (54-61번 줄)'
  },
  {
    id: 'github-basic',
    question: 'GitHub는 무엇인가요?',
    correctKeywords: ['협업 플랫폼', '버전 관리', 'Git'],
    incorrectKeywords: ['SSAL Works 서비스', 'SSAL 워크스 기능'],
    source: '2권_풀스택_웹사이트_개발_기초지식/05편_Git과_GitHub.md'
  }
];

// 환경변수 로드
require('dotenv').config();
const API_URL = process.env.AI_TUTOR_API_URL || 'https://www.ssalworks.ai.kr/api/ai-tutor/test';

// 결과 저장
const results = {
  timestamp: new Date().toISOString(),
  totalTests: TEST_CASES.length,
  passed: 0,
  failed: 0,
  details: []
};

/**
 * AI 튜터에게 질문 보내기 (테스트 API - 인증 불필요)
 */
async function askAITutor(question) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL);

    const postData = JSON.stringify({
      message: question,
      history: []
    });

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    let responseText = '';

    const req = https.request(options, (res) => {
      console.log(`  응답 상태: ${res.statusCode}`);

      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        // 디버깅: 원본 chunk 출력
        if (process.env.DEBUG) {
          console.log('  [DEBUG] chunk:', chunk.substring(0, 200));
        }

        // SSE 포맷 파싱
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              resolve(responseText);
              return;
            }
            try {
              const json = JSON.parse(data);
              if (json.text) {
                responseText += json.text;
              }
            } catch (e) {
              // JSON이 아닌 경우 텍스트 그대로 추가
              if (data.trim()) {
                responseText += data;
              }
            }
          }
        }
      });

      res.on('end', () => {
        if (!responseText) {
          console.log('  ⚠️ 빈 응답');
        }
        resolve(responseText);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();

    // 타임아웃 설정 (30초)
    setTimeout(() => {
      req.destroy();
      reject(new Error('Request timeout'));
    }, 30000);
  });
}

/**
 * 답변 검증
 */
function validateAnswer(testCase, answer) {
  const lowerAnswer = answer.toLowerCase();

  const validation = {
    testId: testCase.id,
    question: testCase.question,
    answer: answer,
    passed: true,
    issues: []
  };

  // 정답 키워드 확인
  let hasCorrectKeyword = false;
  for (const keyword of testCase.correctKeywords) {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      hasCorrectKeyword = true;
      break;
    }
  }

  if (!hasCorrectKeyword) {
    validation.passed = false;
    validation.issues.push({
      type: 'MISSING_CORRECT_KEYWORD',
      message: `정답 키워드가 없습니다: ${testCase.correctKeywords.join(', ')}`,
      severity: 'HIGH'
    });
  }

  // 오답 키워드 확인
  for (const keyword of testCase.incorrectKeywords) {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      validation.passed = false;
      validation.issues.push({
        type: 'INCORRECT_KEYWORD_FOUND',
        message: `오답 키워드 발견: "${keyword}"`,
        severity: 'CRITICAL'
      });
    }
  }

  return validation;
}

/**
 * 결과 출력
 */
function printResults() {
  console.log('\n' + '='.repeat(80));
  console.log('AI 튜터 테스트 결과');
  console.log('='.repeat(80));
  console.log(`실행 시간: ${results.timestamp}`);
  console.log(`총 테스트: ${results.totalTests}`);
  console.log(`✅ 통과: ${results.passed}`);
  console.log(`❌ 실패: ${results.failed}`);
  console.log('='.repeat(80));

  results.details.forEach((detail, index) => {
    console.log(`\n[테스트 ${index + 1}/${results.totalTests}] ${detail.testId}`);
    console.log(`질문: ${detail.question}`);
    console.log(`출처: ${detail.source}`);
    console.log(`상태: ${detail.passed ? '✅ 통과' : '❌ 실패'}`);

    if (detail.issues.length > 0) {
      console.log('\n⚠️  발견된 문제:');
      detail.issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. [${issue.severity}] ${issue.message}`);
      });
    }

    console.log('\n답변:');
    console.log(detail.answer.substring(0, 500) + (detail.answer.length > 500 ? '...' : ''));
    console.log('-'.repeat(80));
  });

  // 문제 요약
  if (results.failed > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('❌ 수정이 필요한 문제');
    console.log('='.repeat(80));

    const criticalIssues = results.details
      .filter(d => !d.passed)
      .flatMap(d => d.issues.filter(i => i.severity === 'CRITICAL'));

    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL 이슈:');
      criticalIssues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue.message}`);
      });
    }

    console.log('\n💡 권장 조치:');
    console.log('  1. api/Backend_Infra/rag/prompt-builder.js의 시스템 프롬프트 수정');
    console.log('  2. 잘못된 키워드에 대한 명시적 제약 조건 추가');
    console.log('  3. 수정 후 git commit 및 push');
    console.log('  4. 이 스크립트를 다시 실행하여 검증');
  } else {
    console.log('\n✅ 모든 테스트 통과! AI 튜터가 정확하게 답변하고 있습니다.');
  }
}

/**
 * 결과를 JSON 파일로 저장
 */
function saveResults() {
  const outputPath = path.join(__dirname, 'ai-tutor-test-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n📄 상세 결과 저장: ${outputPath}`);
}

/**
 * 메인 실행
 */
async function main() {
  console.log('🤖 AI 튜터 자동 테스트 시작...\n');
  console.log(`📡 테스트 API: ${API_URL}`);
  console.log(`ℹ️  인증 우회 모드 (테스트 전용 API 사용)\n`);

  for (let i = 0; i < TEST_CASES.length; i++) {
    const testCase = TEST_CASES[i];
    console.log(`[${i + 1}/${TEST_CASES.length}] 테스트 중: ${testCase.id}`);
    console.log(`질문: ${testCase.question}`);

    try {
      // AI 튜터에게 질문 (인증 불필요)
      const answer = await askAITutor(testCase.question);

      // 답변 검증
      const validation = validateAnswer(testCase, answer);
      validation.source = testCase.source;

      // 결과 저장
      results.details.push(validation);
      if (validation.passed) {
        results.passed++;
        console.log('✅ 통과\n');
      } else {
        results.failed++;
        console.log('❌ 실패\n');
      }

      // 요청 간 딜레이 (Rate Limiting 방지)
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.log(`❌ 오류: ${error.message}\n`);
      results.failed++;
      results.details.push({
        testId: testCase.id,
        question: testCase.question,
        answer: '',
        passed: false,
        issues: [{
          type: 'REQUEST_ERROR',
          message: error.message,
          severity: 'CRITICAL'
        }],
        source: testCase.source
      });
    }
  }

  // 결과 출력 및 저장
  printResults();
  saveResults();

  // 종료 코드 (실패 시 1)
  process.exit(results.failed > 0 ? 1 : 0);
}

// 실행
main().catch(error => {
  console.error('❌ 치명적 오류:', error);
  process.exit(1);
});
