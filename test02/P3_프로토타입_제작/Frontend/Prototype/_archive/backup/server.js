const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3030;

// Outbox 디렉토리 경로
const OUTBOX_DIR = path.join(__dirname, '../../Web_ClaudeCode_Bridge/outbox');

// 캐시 완전 비활성화
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

app.use(express.static(__dirname));

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'prototype_index_최종개선.html'));
});

// Outbox 파일 목록 조회
app.get('/outbox/files', (req, res) => {
    try {
        if (!fs.existsSync(OUTBOX_DIR)) {
            return res.json({ success: true, count: 0, files: [] });
        }

        const files = fs.readdirSync(OUTBOX_DIR)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(OUTBOX_DIR, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            })
            .sort((a, b) => b.modified - a.modified);

        res.json({
            success: true,
            count: files.length,
            files
        });

    } catch (error) {
        console.error('❌ Outbox 파일 목록 조회 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Outbox 파일 읽기
app.get('/outbox/read/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(OUTBOX_DIR, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);

        res.json({
            success: true,
            filename,
            data
        });

    } catch (error) {
        console.error('❌ Outbox 파일 읽기 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Order Sheet 템플릿 제공
app.get('/ordersheet-templates', (req, res) => {
    const templates = {
        '0-1_Vision_Mission': {
            name: 'Vision Mission',
            template: `# Order Sheet: Vision & Mission

## 프로젝트 비전
[프로젝트가 지향하는 궁극적인 목표를 작성하세요]

## 미션
[비전을 달성하기 위한 구체적인 미션을 작성하세요]

## 핵심 가치
- [가치 1]
- [가치 2]
- [가치 3]`
        },
        '0-2_Market_Analysis': {
            name: 'Market Analysis',
            template: `# Order Sheet: 시장 분석

## 타겟 시장
[대상 시장을 정의하세요]

## 경쟁사 분석
[주요 경쟁사를 분석하세요]

## 시장 기회
[발견한 시장 기회를 작성하세요]`
        },
        '0-3_Business_Model': {
            name: 'Business Model',
            template: `# Order Sheet: 비즈니스 모델

## 수익 모델
[수익 창출 방법을 작성하세요]

## 고객 세그먼트
[타겟 고객을 정의하세요]

## 가치 제안
[고객에게 제공하는 가치를 작성하세요]`
        },
        '1-1_Directory_Structure': {
            name: 'Directory Structure',
            template: `# Order Sheet: 디렉토리 구조 설계

## 프로젝트 구조
[프로젝트의 폴더 구조를 작성하세요]

## 주요 디렉토리
[각 디렉토리의 역할을 설명하세요]`
        },
        '1-2_Project_Plan_requirements': {
            name: 'Requirements',
            template: `# Order Sheet: 요구사항 정의

## 기능 요구사항
[필요한 기능을 나열하세요]

## 비기능 요구사항
[성능, 보안 등의 요구사항을 작성하세요]`
        },
        '1-4_Database_Design': {
            name: 'Database Design',
            template: `# Order Sheet: 데이터베이스 설계

## 테이블 설계
[필요한 테이블을 정의하세요]

## 관계 설계
[테이블 간 관계를 작성하세요]`
        },
        '2-1_Tech_Stack': {
            name: 'Tech Stack',
            template: `# Order Sheet: 기술 스택 선정

## Frontend
[사용할 Frontend 기술을 나열하세요]

## Backend
[사용할 Backend 기술을 나열하세요]

## Database
[사용할 Database를 선택하세요]`
        },
        '2-2_Architecture': {
            name: 'Architecture',
            template: `# Order Sheet: 아키텍처 설계

## 시스템 구조
[전체 시스템 구조를 설명하세요]

## 컴포넌트 설계
[주요 컴포넌트를 정의하세요]`
        }
    };

    res.json({ success: true, templates });
});

app.listen(PORT, () => {
    console.log(`Dashboard server running at http://localhost:${PORT}/dashboard`);
    console.log('Cache disabled - all requests will serve fresh content');
    console.log('Outbox endpoints enabled');
});
