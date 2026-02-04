// perplexity_api.js - Perplexity API 연동

const path = require('path');
const fs = require('fs');
const https = require('https');

// .env 파일에서 직접 API 키 읽기
const envPath = path.join(__dirname, '.env');
let PERPLEXITY_API_KEY = '';

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/PERPLEXITY_API_KEY=(.+)/);
    if (match) {
        PERPLEXITY_API_KEY = match[1].trim();
    }
}

const PERPLEXITY_API_URL = 'api.perplexity.ai';

// API 키 로드 확인
console.log('🔑 Perplexity API Key loaded:', PERPLEXITY_API_KEY ? `${PERPLEXITY_API_KEY.substring(0, 10)}...` : 'NOT FOUND');

/**
 * Perplexity API에 질문하기
 * @param {string} question - 사용자 질문
 * @returns {Promise<string>} - AI 응답
 */
async function askPerplexity(question) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'sonar',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant for web development and technical questions. Provide concise, accurate answers in Korean.'
                },
                {
                    role: 'user',
                    content: question
                }
            ],
            temperature: 0.2,
            max_tokens: 1024
        });

        const options = {
            hostname: PERPLEXITY_API_URL,
            port: 443,
            path: '/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(data, 'utf8')
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    // HTTP 상태 코드 확인
                    if (res.statusCode !== 200) {
                        console.error(`❌ Perplexity API HTTP ${res.statusCode}:`, responseData.substring(0, 500));
                        reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 200)}`));
                        return;
                    }

                    const response = JSON.parse(responseData);

                    if (response.choices && response.choices[0] && response.choices[0].message) {
                        resolve(response.choices[0].message.content);
                    } else if (response.error) {
                        reject(new Error(`Perplexity API Error: ${response.error.message}`));
                    } else {
                        reject(new Error('Invalid API response'));
                    }
                } catch (error) {
                    console.error('❌ Response parsing error:', responseData.substring(0, 500));
                    reject(new Error(`Failed to parse response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Network error: ${error.message}`));
        });

        req.write(data);
        req.end();
    });
}

module.exports = { askPerplexity };
