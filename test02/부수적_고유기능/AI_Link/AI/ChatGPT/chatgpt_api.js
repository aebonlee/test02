// chatgpt_api.js - ChatGPT (OpenAI) API ��

const path = require('path');
const fs = require('fs');
const https = require('https');

// .env |� � API � }0
const envPath = path.join(__dirname, '.env');
let OPENAI_API_KEY = '';

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/OPENAI_API_KEY=(.+)/);
    if (match) {
        OPENAI_API_KEY = match[1].trim();
    }
}

const OPENAI_API_URL = 'api.openai.com';

// API � \� Ux
console.log('= OpenAI API Key loaded:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + '...' : 'NOT FOUND');

/**
 * ChatGPT API� �8X0
 * @param {string} question - ��� �8
 * @returns {Promise<string>} - AI Q�
 */
async function askChatGPT(question) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'gpt-5',
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
            max_completion_tokens: 1024
        });

        const options = {
            hostname: OPENAI_API_URL,
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + OPENAI_API_KEY,
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
                    // HTTP �� T� Ux
                    if (res.statusCode !== 200) {
                        console.error('L OpenAI API HTTP ' + res.statusCode + ':', responseData.substring(0, 500));
                        reject(new Error('HTTP ' + res.statusCode + ': ' + responseData.substring(0, 200)));
                        return;
                    }

                    const response = JSON.parse(responseData);

                    if (response.choices && response.choices[0] && response.choices[0].message) {
                        resolve(response.choices[0].message.content);
                    } else if (response.error) {
                        reject(new Error('OpenAI API Error: ' + response.error.message));
                    } else {
                        reject(new Error('Invalid API response'));
                    }
                } catch (error) {
                    console.error('L Response parsing error:', responseData.substring(0, 500));
                    reject(new Error('Failed to parse response: ' + error.message));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error('Network error: ' + error.message));
        });

        req.write(data);
        req.end();
    });
}

module.exports = { askChatGPT };
