// gemini_api.js - Google Gemini API ��

const path = require('path');
const fs = require('fs');
const https = require('https');

// .env |� � API � }0
const envPath = path.join(__dirname, '.env');
let GEMINI_API_KEY = '';

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (match) {
        GEMINI_API_KEY = match[1].trim();
    }
}

// API � \� Ux
console.log('= Gemini API Key loaded:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT FOUND');

/**
 * Gemini API� �8X0
 * @param {string} question - ��� �8
 * @returns {Promise<string>} - AI Q�
 */
async function askGemini(question) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            contents: [{
                role: "user",
                parts: [{
                    text: question
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192
            }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            port: 443,
            path: '/v1beta/models/gemini-2.5-pro:generateContent?key=' + GEMINI_API_KEY,
            method: 'POST',
            headers: {
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
                        console.error('L Gemini API HTTP ' + res.statusCode + ':', responseData.substring(0, 500));
                        reject(new Error('HTTP ' + res.statusCode + ': ' + responseData.substring(0, 200)));
                        return;
                    }

                    const response = JSON.parse(responseData);

                    if (response.candidates && response.candidates[0] &&
                        response.candidates[0].content && response.candidates[0].content.parts &&
                        response.candidates[0].content.parts[0] &&
                        response.candidates[0].content.parts[0].text) {
                        resolve(response.candidates[0].content.parts[0].text);
                    } else if (response.error) {
                        reject(new Error('Gemini API Error: ' + response.error.message));
                    } else {
                        console.error('=== Invalid Response Structure ===');
                        console.error('Full response:', JSON.stringify(response, null, 2));
                        reject(new Error('Invalid API response structure'));
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

module.exports = { askGemini };
