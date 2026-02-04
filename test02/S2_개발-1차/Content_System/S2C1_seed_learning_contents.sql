-- Task ID: S2C1
-- Learning Contents Seed Data
-- Created: 2025-12-14

DELETE FROM learning_contents WHERE depth1 IN ('Claude & Claude Code', 'Web Dev', 'AI Tools');

INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('Claude & Claude Code', 'Basics', '1 - What is Claude', 'contents/1.md', 'Claude introduction', 10),
('Claude & Claude Code', 'Basics', '2 - Prompt Basics', 'contents/2.md', 'Basic prompting', 20),
('Claude & Claude Code', 'Basics', '3 - Advanced Prompts', 'contents/3.md', 'Advanced techniques', 30),
('Claude & Claude Code', 'Code Basics', '4 - First Steps', 'contents/4.md', 'Getting started', 40),
('Claude & Claude Code', 'Code Basics', '5 - Direct Execution', 'contents/5.md', 'Code execution', 50),
('Claude & Claude Code', 'Code Basics', '6 - Automation', 'contents/6.md', 'Automated workflows', 60),
('Claude & Claude Code', 'Advanced', '7 - Subagents Intro', 'contents/7.md', 'Understanding subagents', 70),
('Claude & Claude Code', 'Advanced', '8 - Creating Subagents', 'contents/8.md', 'Subagent creation', 80),
('Claude & Claude Code', 'Advanced', '9 - Subagent Patterns', 'contents/9.md', 'Usage patterns', 90),
('Claude & Claude Code', 'Advanced', '10 - Dev Subagents', 'contents/10.md', 'Development use', 100),
('Claude & Claude Code', 'Advanced', '11 - Non-Dev Subagents', 'contents/11.md', 'Non-dev use', 110),
('Claude & Claude Code', 'MCP', '12 - MCP Basics', 'contents/12.md', 'MCP fundamentals', 120),
('Claude & Claude Code', 'MCP', '13 - MCP Advanced', 'contents/13.md', 'Advanced MCP', 130),
('Claude & Claude Code', 'Integration', '14 - API Integration', 'contents/14.md', 'AI API integration', 140),
('Claude & Claude Code', 'VS Code', '15 - VS Code Mastery', 'contents/15.md', 'VS Code guide', 150),
('Claude & Claude Code', 'VS Code', '16 - Integration Basics', 'contents/16.md', 'Basic integration', 160),
('Claude & Claude Code', 'VS Code', '17 - Integration Advanced', 'contents/17.md', 'Advanced integration', 170),
('Claude & Claude Code', 'Optimization', '18 - Token Costs', 'contents/18.md', 'Cost optimization', 180),
('Claude & Claude Code', 'Optimization', '19 - Environment', 'contents/19.md', 'Env optimization', 190),
('Claude & Claude Code', 'Optimization', '20 - Session Management', 'contents/20.md', 'Session management', 200),
('Claude & Claude Code', 'Setup', 'Installation Guide', 'contents/install.md', 'Installation steps', 210),
('Claude & Claude Code', 'Features', 'File Creation', 'contents/files.md', 'File creation features', 220),
('Claude & Claude Code', 'Reference', 'Guide', 'contents/guide.md', 'General guide', 230);

INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('Web Dev', 'Intro', '1 - Core Concepts', 'web/1.md', 'Web fundamentals', 1010),
('Web Dev', 'Intro', '2 - How Websites Work', 'web/2.md', 'Website mechanics', 1020),
('Web Dev', 'Setup', '3 - CLI and Setup', 'web/3.md', 'CLI and environment', 1030),
('Web Dev', 'Setup', '4 - Code Editors', 'web/4.md', 'Editors and IDEs', 1040),
('Web Dev', 'HTML/CSS', '5 - HTML Basics', 'web/5.md', 'HTML fundamentals', 1050),
('Web Dev', 'HTML/CSS', '6 - CSS Styling', 'web/6.md', 'CSS principles', 1060),
('Web Dev', 'JavaScript', '7 - JS Basics', 'web/7.md', 'JavaScript basics', 1070),
('Web Dev', 'Version Control', '8 - Git and GitHub', 'web/8.md', 'Git basics', 1080),
('Web Dev', 'Frameworks', '9 - Libraries', 'web/9.md', 'Frameworks overview', 1090),
('Web Dev', 'Frameworks', '10 - Package Management', 'web/10.md', 'npm and tools', 1100),
('Web Dev', 'Backend', '11 - Backend Basics', 'web/11.md', 'Backend and Node', 1110),
('Web Dev', 'Database', '12 - DB Basics', 'web/12.md', 'Database basics', 1120),
('Web Dev', 'Database', '13 - DB Practice', 'web/13.md', 'Practical databases', 1130),
('Web Dev', 'API', '14 - API Communication', 'web/14.md', 'REST API basics', 1140),
('Web Dev', 'Deploy', '15 - Domain and Hosting', 'web/15.md', 'Domains and hosting', 1150),
('Web Dev', 'Deploy', '16 - DevOps Basics', 'web/16.md', 'DevOps fundamentals', 1160),
('Web Dev', 'Security', '17 - Security', 'web/17.md', 'Web security', 1170),
('Web Dev', 'Security', '18 - SEO', 'web/18.md', 'SEO and accessibility', 1180),
('Web Dev', 'Project', '19 - Process', 'web/19.md', 'Development workflow', 1190),
('Web Dev', 'Practice', '20 - Project Part 1', 'web/20.md', 'Project part 1', 1200),
('Web Dev', 'Practice', '21 - Project Part 2', 'web/21.md', 'Project part 2', 1210),
('Web Dev', 'Reference', 'Glossary', 'web/glossary.md', 'Web glossary', 1220),
('Web Dev', 'Reference', 'Domain Setup', 'web/domain.md', 'Domain setup guide', 1230),
('Web Dev', 'Reference', 'Email Auth', 'web/email.md', 'Email verification', 1240);

INSERT INTO learning_contents (depth1, depth2, depth3, url, description, display_order) VALUES
('AI Tools', 'Advanced', 'Inbox/Outbox System', 'ai/inbox-outbox.md', 'Task handoff system', 2010);

SELECT 'S2C1 Complete: 48 items inserted' as status;
