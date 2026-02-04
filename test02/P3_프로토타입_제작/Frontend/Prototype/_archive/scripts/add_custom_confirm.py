import re

with open('prototype_index_최종개선.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add custom confirm dialog before </body>
custom_dialog = '''
    <!-- Custom Confirm Dialog -->
    <div id="customConfirmDialog" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999; align-items: center; justify-content: center;">
        <div style="background: white; border-radius: 12px; padding: 32px; max-width: 400px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);">
            <h3 id="confirmDialogTitle" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #212529;">확인</h3>
            <p id="confirmDialogMessage" style="margin: 0 0 24px 0; font-size: 14px; color: #495057; line-height: 1.6;"></p>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button id="confirmDialogCancel" 
                    style="padding: 12px 24px; background: #6c757d; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; color: white; transition: background 0.2s;"
                    onmouseover="this.style.background='#5a6268'" 
                    onmouseout="this.style.background='#6c757d'">취소</button>
                <button id="confirmDialogConfirm" 
                    style="padding: 12px 24px; background: #2C4A8A; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; color: white; transition: background 0.2s;"
                    onmouseover="this.style.background='#1F3563'" 
                    onmouseout="this.style.background='#2C4A8A'">확인</button>
            </div>
        </div>
    </div>

    <script>
        // Custom confirm dialog function
        function customConfirm(message, title = '확인') {
            return new Promise((resolve) => {
                const dialog = document.getElementById('customConfirmDialog');
                const titleEl = document.getElementById('confirmDialogTitle');
                const messageEl = document.getElementById('confirmDialogMessage');
                const confirmBtn = document.getElementById('confirmDialogConfirm');
                const cancelBtn = document.getElementById('confirmDialogCancel');

                titleEl.textContent = title;
                messageEl.textContent = message;
                dialog.style.display = 'flex';

                const handleConfirm = () => {
                    dialog.style.display = 'none';
                    cleanup();
                    resolve(true);
                };

                const handleCancel = () => {
                    dialog.style.display = 'none';
                    cleanup();
                    resolve(false);
                };

                const cleanup = () => {
                    confirmBtn.removeEventListener('click', handleConfirm);
                    cancelBtn.removeEventListener('click', handleCancel);
                };

                confirmBtn.addEventListener('click', handleConfirm);
                cancelBtn.addEventListener('click', handleCancel);
            });
        }
    </script>

</body>'''

content = re.sub(r'</body>', custom_dialog, content)

# Replace confirm() with customConfirm() and make loadTemplate async
content = re.sub(
    r"if \(editor\.value\.trim\(\) && !confirm\('현재 작성 중인 내용을 지우고 해당 항목에 대한 템플릿으로 바꾸시겠습니까\?'\)\) \{",
    "if (editor.value.trim() && !(await customConfirm('현재 작성 중인 내용을 지우고 해당 항목에 대한 템플릿으로 바꾸시겠습니까?'))) {",
    content
)

content = re.sub(
    r'function loadTemplate\(categoryKey\) \{',
    'async function loadTemplate(categoryKey) {',
    content
)

with open('prototype_index_최종개선.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Custom confirm dialog added with Navy button (#2C4A8A)")
