/**
 * SSAL Works Development Package Generator
 *
 * ⚠️ 상태: 초안 (DRAFT)
 * ⚠️ 주의: 이 스크립트는 아직 사용할 수 없습니다!
 *
 * 사용 전 필요한 작업:
 * 1. SSALWorks 전용 파일 정리 (일반화 작업)
 * 2. CLAUDE.md 일반화
 * 3. Order Sheet 템플릿 일반화
 * 4. Briefing 일반화
 * 5. SAL Grid Viewer 일반화
 * 6. Supabase Key 하드코딩 제거
 *
 * 용도: 배포용 개발 패키지 ZIP 파일 생성
 * 버전: 0.1 (초안)
 *
 * 사용법 (파일 정리 완료 후):
 *   node 05_패키지_생성_스크립트.js
 *   node 05_패키지_생성_스크립트.js --output ./dist
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================
// 설정
// ============================================

const CONFIG = {
  // 패키지 이름
  packageName: 'SSAL_Works_Dev_Package',

  // 출력 디렉토리 (기본값)
  outputDir: './dist',

  // 패키지에 포함할 폴더들 (표준 구조 - 폴더는 유지!)
  includeFolders: [
    // 배포 구조 (루트 폴더)
    'api',
    'pages',
    'assets',
    'scripts',

    // 표준 작업 디렉토리
    'P0_작업_디렉토리_구조_생성',
    // 'P1_사업계획',           // 제외: 빌더에게 제공할 내용 없음
    'P2_프로젝트_기획',
    'P3_프로토타입_제작',
    'S0_Project-SAL-Grid_생성',
    'S1_개발_준비',
    'S2_개발-1차',
    'S3_개발-2차',
    'S4_개발-3차',
    'S5_개발_마무리',

    // 개발 도구
    'Development_Process_Monitor',
    'Human_ClaudeCode_Bridge',

    // Order Sheet 템플릿 (안내문 제외)
    'Briefings_OrderSheets',

    // AI 설정 (선택)
    '.claude',
  ],

  // 패키지에 포함할 루트 파일들
  // ⚠️ 주의: 빌더가 직접 생성해야 할 파일은 포함하지 않음
  // - index.html, 404.html → 빌더가 개발하면서 생성
  // - package.json → npm init으로 생성
  // - vercel.json → vercel init 또는 Vercel 배포 시 생성
  // - .gitignore → Claude Code에게 요청 또는 직접 생성
  includeFiles: [
    // '.gitignore',    // 제외: Claude Code에게 요청
    // 'package.json',  // 제외: npm init으로 생성
    // 'vercel.json',   // 제외: vercel init으로 생성
    // 'index.html',    // 제외: 빌더가 개발
    // '404.html',      // 제외: 빌더가 개발
    // 'README.md',     // 패키지 전용 README 생성됨
  ],

  // 제외할 패턴들 (includes 매칭 사용)
  excludePatterns: [
    // ============================================
    // 1. 시스템/환경 파일
    // ============================================
    'node_modules',
    '/.env',
    '.DS_Store',
    'Thumbs.db',
    '/.git',
    '*.log',
    '*.bak',
    'package-lock.json',
    'settings.local.json',

    // ============================================
    // 2. 불필요한 폴더
    // ============================================
    '_archive',
    '/backup/',
    '/screenshots/',
    '/screenshots-mobile/',
    '/부수적_고유기능/',

    // ============================================
    // 3. SSALWorks 전용 폴더 (경로에 포함)
    // ============================================
    'Service_Introduction/',
    'Facebook_Posts/',
    '/Patent/',

    // ============================================
    // 4. SSALWorks 전용 파일 (파일명에 포함)
    // ============================================
    '/SSAL_Works_',
    '/SSALWORKS_',
    '/ssal_works_',
    '/facebook_post_',

    // ============================================
    // 5. Sample 데이터 SQL
    // ============================================
    '_sample_data.sql',
    'sample_test_users.sql',
    'sample_billing.sql',
    'sample_credit_data.sql',
    'sample_inquiries_data.sql',
    'mypage_integration_sample_data.sql',
    'insert_billing_sample.js',
    'temp_fix.sql',

    // ============================================
    // 6. 문서/이미지 파일
    // ============================================
    '*.docx',
    '*.pptx',
    '*.xlsx',
    '*.jpg',                  // 모든 jpg 이미지
    '*.png',                  // 모든 png 이미지
    '*.gif',                  // 모든 gif 이미지
    'ssal_works_5_areas.html',

    // ============================================
    // 7. 안내문/작업 결과물
    // ============================================
    'Briefings_OrderSheets/Briefings',
    '/task-results/',
    '/Reports/',
    '/Orders/',
    '/work_logs/',

    // ============================================
    // 8. S0 폴더 - SSALWorks 전용 데이터 제외 (템플릿만 유지)
    // ============================================
    // Task Instructions - TEMPLATE만 유지, 나머지 S*_ 파일 제외
    '/task-instructions/S1',
    '/task-instructions/S2',
    '/task-instructions/S3',
    '/task-instructions/S4',
    '/task-instructions/S5',

    // Verification Instructions - 전체 폴더 제외 (TEMPLATE 없음)
    '/verification-instructions/',

    // Stage Gate Reports - TEMPLATE만 유지, 나머지 제외
    '/stage-gates/S1',
    '/stage-gates/S2',
    '/stage-gates/S3',
    '/stage-gates/S4',
    '/stage-gates/S5',

    // sal_grid.csv - SSALWorks 데이터 제외 (빈 템플릿으로 대체)
    '/data/sal_grid.csv',
  ],

  // 빈 폴더로 생성 (폴더만 만들고 파일 복사 안 함)
  // 매칭: 소스 경로가 패턴으로 끝나는지 확인
  emptyFolderPatterns: [
    // ============================================
    // 1. 배포 폴더 (빌더가 자신의 코드로 채울 폴더)
    // ============================================
    '/api',         // 백엔드 API - 빈 폴더
    '/pages',       // 프론트엔드 페이지 - 빈 폴더
    '/assets',      // 정적 자원 - 빈 폴더
    // scripts는 제외 - 자동화 도구 유지

    // ============================================
    // 2. 작업 디렉토리 (빌더가 작업하며 채울 폴더)
    // ============================================
    // P1 제외됨 (includeFolders에서 주석 처리)
    '/P2_프로젝트_기획',
    '/P3_프로토타입_제작',
    '/S1_개발_준비',
    '/S2_개발-1차',
    '/S3_개발-2차',
    '/S4_개발-3차',
    '/S5_개발_마무리',

    // ============================================
    // 3. 하위 폴더 중 빈 폴더로 유지할 것
    // ============================================
    'Human_ClaudeCode_Bridge/Orders',
    'Human_ClaudeCode_Bridge/Reports',
    'S0_Project-SAL-Grid_생성/sal-grid/task-results',
    '.claude/work_logs',
  ],
};

// ============================================
// 유틸리티 함수
// ============================================

function log(message, type = 'info') {
  const prefix = {
    info: '[INFO]',
    success: '[OK]',
    warning: '[WARN]',
    error: '[ERROR]',
  };
  console.log(`${prefix[type] || '[INFO]'} ${message}`);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`);
  }
}

function shouldExclude(filePath, excludePatterns) {
  const normalizedPath = filePath.replace(/\\/g, '/');

  for (const pattern of excludePatterns) {
    // 단순 문자열 매칭
    if (normalizedPath.includes(pattern.replace('**/', '').replace('/*', ''))) {
      return true;
    }

    // 와일드카드 패턴
    if (pattern.startsWith('*.')) {
      const ext = pattern.slice(1);
      if (normalizedPath.endsWith(ext)) {
        return true;
      }
    }
  }

  return false;
}

function shouldEmptyFolder(folderPath, emptyFolderPatterns) {
  const normalizedPath = folderPath.replace(/\\/g, '/');

  for (const pattern of emptyFolderPatterns) {
    if (normalizedPath.endsWith(pattern) || normalizedPath.includes(pattern + '/')) {
      return true;
    }
  }

  return false;
}

function copyRecursive(src, dest, excludePatterns, emptyFolderPatterns) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    ensureDir(dest);

    // 빈 폴더로 유지해야 하는 경우 (파일 복사 안 함)
    if (shouldEmptyFolder(src, emptyFolderPatterns)) {
      log(`Created empty folder: ${dest}`);
      return;
    }

    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);

      if (!shouldExclude(srcPath, excludePatterns)) {
        copyRecursive(srcPath, destPath, excludePatterns, emptyFolderPatterns);
      }
    }
  } else {
    // 파일 복사
    if (!shouldExclude(src, excludePatterns)) {
      fs.copyFileSync(src, dest);
    }
  }
}

// ============================================
// 메인 함수
// ============================================

function generatePackage() {
  const startTime = Date.now();

  log('========================================');
  log('SSAL Works Development Package Generator');
  log('========================================');

  // 명령행 인자 처리
  const args = process.argv.slice(2);
  let outputDir = CONFIG.outputDir;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) {
      outputDir = args[i + 1];
    }
  }

  const sourceDir = path.resolve(__dirname, '..');
  const packageDir = path.join(outputDir, CONFIG.packageName);
  const zipPath = path.join(outputDir, `${CONFIG.packageName}.zip`);

  log(`Source: ${sourceDir}`);
  log(`Output: ${packageDir}`);

  // 1. 출력 디렉토리 정리
  log('');
  log('Step 1: Cleaning output directory...');

  if (fs.existsSync(packageDir)) {
    fs.rmSync(packageDir, { recursive: true, force: true });
    log(`Removed existing: ${packageDir}`);
  }

  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
    log(`Removed existing: ${zipPath}`);
  }

  ensureDir(outputDir);
  ensureDir(packageDir);

  // 2. 폴더 복사
  log('');
  log('Step 2: Copying folders...');

  for (const folder of CONFIG.includeFolders) {
    const srcPath = path.join(sourceDir, folder);
    const destPath = path.join(packageDir, folder);

    if (fs.existsSync(srcPath)) {
      copyRecursive(srcPath, destPath, CONFIG.excludePatterns, CONFIG.emptyFolderPatterns);
      log(`Copied: ${folder}`, 'success');
    } else {
      log(`Folder not found: ${folder}`, 'warning');
    }
  }

  // 3. 루트 파일 복사
  log('');
  log('Step 3: Copying root files...');

  for (const file of CONFIG.includeFiles) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(packageDir, file);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      log(`Copied: ${file}`, 'success');
    } else {
      log(`File not found: ${file}`, 'warning');
    }
  }

  // 4. 템플릿 파일 생성 (S0 폴더용)
  log('');
  log('Step 4: Generating template files for S0...');

  generateS0Templates(packageDir);

  // 5. 패키지 전용 README 생성
  log('');
  log('Step 5: Generating package README...');

  const readmeContent = generatePackageReadme();
  fs.writeFileSync(path.join(packageDir, 'README.md'), readmeContent);
  log('Generated: README.md', 'success');

  // 6. ZIP 파일 생성
  log('');
  log('Step 6: Creating ZIP archive...');

  try {
    // Windows에서는 PowerShell의 Compress-Archive 사용
    if (process.platform === 'win32') {
      execSync(
        `powershell Compress-Archive -Path "${packageDir}\\*" -DestinationPath "${zipPath}" -Force`,
        { stdio: 'inherit' }
      );
    } else {
      // Unix 계열에서는 zip 명령어 사용
      execSync(`cd "${outputDir}" && zip -r "${CONFIG.packageName}.zip" "${CONFIG.packageName}"`, {
        stdio: 'inherit',
      });
    }
    log(`Created: ${zipPath}`, 'success');
  } catch (error) {
    log(`Failed to create ZIP: ${error.message}`, 'error');
    log('Package folder is ready, but ZIP creation failed.', 'warning');
  }

  // 완료 보고
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  log('');
  log('========================================');
  log('Package Generation Complete!', 'success');
  log('========================================');
  log(`Time: ${elapsed}s`);
  log(`Package folder: ${packageDir}`);
  log(`ZIP file: ${zipPath}`);
  log('');

  // 패키지 내용 요약
  log('Package Contents:');
  CONFIG.includeFolders.forEach(f => log(`  - ${f}`));
  CONFIG.includeFiles.forEach(f => log(`  - ${f}`));
}

function generateS0Templates(packageDir) {
  const s0Base = path.join(packageDir, 'S0_Project-SAL-Grid_생성');

  // 1. sal_grid.csv 템플릿 생성 (헤더만)
  const dataDir = path.join(s0Base, 'data');
  ensureDir(dataDir);

  const csvHeader = 'task_id,task_name,stage,area,task_status,task_progress,verification_status,dependencies,generated_files,remarks';
  const csvTemplate = `${csvHeader}
# 위 헤더를 기준으로 Task 데이터를 추가하세요
# 예시: S1F1,로그인 페이지 구현,1,F,Pending,0,Not Verified,-,-,첫 번째 Task
`;
  fs.writeFileSync(path.join(dataDir, 'sal_grid.csv'), csvTemplate);
  log('Generated: S0_Project-SAL-Grid_생성/data/sal_grid.csv (template)', 'success');

  // 2. verification-instructions 폴더 및 템플릿 생성
  const verificationDir = path.join(s0Base, 'sal-grid', 'verification-instructions');
  ensureDir(verificationDir);

  const verificationTemplate = `# Task Verification Instruction - TEMPLATE

---

## 📌 사용 방법

이 파일을 복사하여 \`{TaskID}_verification.md\` 형식으로 저장하세요.
예: \`S1F1_verification.md\`

---

## Task ID
{TaskID}

## Task Name
{Task Name}

## Verification Agent
\`code-reviewer\` / \`qa-specialist\` / \`security-auditor\`

## 검증 항목

### 1. 코드 검증
- [ ] 파일명 규칙 준수 (kebab-case)
- [ ] 코드 문법 오류 없음
- [ ] 주석 및 문서화 적절함

### 2. 기능 테스트
- [ ] 기본 기능 정상 작동
- [ ] 예외 처리 정상
- [ ] UI/UX 확인 (해당 시)

### 3. 통합 검증
- [ ] 다른 Task와 충돌 없음
- [ ] 의존성 정상 작동

## 통과 기준

모든 체크리스트 항목이 완료되어야 함

---

## 필수 참조 규칙

| 규칙 파일 | 내용 | 참조 시점 |
|----------|------|----------|
| \`.claude/rules/06_verification.md\` | 검증 기준 | 핵심 참조 |
`;
  fs.writeFileSync(path.join(verificationDir, 'TEMPLATE_verification.md'), verificationTemplate);
  log('Generated: S0_Project-SAL-Grid_생성/sal-grid/verification-instructions/TEMPLATE_verification.md', 'success');

  // 3. task-instructions 폴더 확인 (TEMPLATE 있어야 함)
  const taskInstructionsDir = path.join(s0Base, 'sal-grid', 'task-instructions');
  ensureDir(taskInstructionsDir);

  // 4. stage-gates 폴더 확인 (TEMPLATE 있어야 함)
  const stageGatesDir = path.join(s0Base, 'sal-grid', 'stage-gates');
  ensureDir(stageGatesDir);
}

function generatePackageReadme() {
  return `# SSAL Works Development Package

이 패키지는 **SAL Grid 방법론**을 사용한 웹 개발 프로젝트를 위한 표준 디렉토리 구조와 AI 개발 도구를 포함합니다.

## 패키지 설치 방법

1. **압축 해제**: 원하는 위치에 이 폴더를 압축 해제하세요.
2. **폴더 이름 변경**: 프로젝트에 맞게 폴더 이름을 변경하세요.
3. **개발 도구 설치**: 아래 "필수 도구 설치" 섹션을 참고하세요.

## 필수 도구 설치

이 패키지만으로는 개발이 불가능합니다. **다음 도구를 별도로 설치**해야 합니다:

| 도구 | 용도 | 설치 방법 |
|------|------|----------|
| **Git** | 버전 관리 | https://git-scm.com |
| **Node.js** | JavaScript 런타임 | https://nodejs.org |
| **npm** | 패키지 매니저 | Node.js에 포함 |
| **Claude Code** | AI 개발 어시스턴트 | \`npm install -g @anthropic-ai/claude-code\` |

### 프로젝트 초기화

패키지 폴더에서 터미널을 열고:

\`\`\`bash
# 1. Git 저장소 초기화
git init

# 2. npm 프로젝트 초기화
npm init -y

# 3. Claude Code 실행
claude
\`\`\`

Claude Code에게 다음과 같이 요청하세요:

\`\`\`
"프로젝트 개발 환경 설정해 줘"
\`\`\`

## 패키지 구조

\`\`\`
${CONFIG.packageName}/
├── api/                           # 백엔드 API (빈 폴더 - 개발하면서 채움)
├── pages/                         # 프론트엔드 페이지 (빈 폴더 - 개발하면서 채움)
├── assets/                        # 정적 자원 (빈 폴더 - 개발하면서 채움)
├── scripts/                       # 자동화 도구
│   ├── sync-to-root.js            # Stage -> Root 자동 복사
│   ├── setup-hooks.js             # Pre-commit Hook 설치
│   └── build-web-assets.js        # 통합 빌드
├── P0_작업_디렉토리_구조_생성/    # 프로젝트 설정
├── P2_프로젝트_기획/              # 프로젝트 기획 (빈 폴더)
├── P3_프로토타입_제작/            # 프로토타입 (빈 폴더)
├── S0_Project-SAL-Grid_생성/      # SAL Grid 템플릿
│   ├── sal-grid/task-instructions/TEMPLATE_instruction.md
│   ├── sal-grid/verification-instructions/TEMPLATE_verification.md
│   └── sal-grid/stage-gates/TEMPLATE_stage_gate_report.md
├── S1_개발_준비/ ~ S5_개발_마무리/ # 개발 단계별 폴더 (빈 폴더)
├── Development_Process_Monitor/   # 진행 상황 시각화
├── Human_ClaudeCode_Bridge/       # 작업 지시/결과 교환
├── Briefings_OrderSheets/         # Order Sheet 템플릿
├── .claude/                       # AI 설정 (rules, methods, commands)
└── README.md
\`\`\`

## 프로젝트 초기화 시 생성할 파일

다음 파일들은 패키지에 포함되지 않습니다. **프로젝트 시작 시 직접 생성**해야 합니다:

| 파일 | 생성 시점 | 생성 방법 |
|------|----------|----------|
| \`package.json\` | 프로젝트 시작 | \`npm init -y\` |
| \`.gitignore\` | 프로젝트 시작 | Claude Code에게 요청 |
| \`index.html\` | 개발 시작 | 직접 작성 또는 Claude Code |
| \`vercel.json\` | 배포 설정 | \`vercel init\` 또는 직접 작성 |
| \`.env\` | 외부 서비스 연동 | 직접 작성 |

## Pre-commit Hook 설치

Git 저장소 초기화 후 최초 1회 실행:

\`\`\`bash
node scripts/setup-hooks.js
\`\`\`

이후 git commit 시 자동으로 Stage → Root 동기화가 실행됩니다.

## 다음 단계

1. **SAL Grid 매뉴얼 읽기**: \`S0_Project-SAL-Grid_생성/manual/PROJECT_SAL_GRID_MANUAL.md\`
2. **Order Sheet 템플릿 확인**: \`Briefings_OrderSheets/OrderSheet_Templates/\`
3. **Claude Code에게 작업 지시**: Order Sheet 작성 후 Claude Code 실행

## 도움말

- **SAL Grid 매뉴얼**: 전체 방법론 설명
- **SSAL Works 웹사이트**: 추가 학습 자료 및 FAQ

---

**프로젝트 성공을 응원합니다!**

Generated by SSAL Works Package Generator
`;
}

// 실행
generatePackage();
