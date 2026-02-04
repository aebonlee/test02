# -*- coding: utf-8 -*-
import chardet

# Read the corrupted file
with open(r"c:\!SSAL_Works_Private\1_기획\1-3_UI_UX_Design\Prototype\index.html", 'rb') as f:
    raw_data = f.read()

# Detect encoding
detected = chardet.detect(raw_data)
print(f"Detected encoding: {detected}")

# Try multiple encodings
encodings_to_try = ['utf-8', 'euc-kr', 'cp949', 'iso-8859-1', 'windows-1252']

for encoding in encodings_to_try:
    try:
        content = raw_data.decode(encoding)
        # Check if Korean characters are present
        if '프로젝트' in content or '관리' in content or '저장' in content:
            print(f"✓ Success with {encoding}")
            # Save the fixed file
            with open(r"c:\!SSAL_Works_Private\1_기획\1-3_UI_UX_Design\Prototype\index_fixed.html", 'w', encoding='utf-8') as f:
                f.write(content)
            print("File saved as index_fixed.html")
            break
        else:
            print(f"✗ {encoding} - No Korean characters found")
    except Exception as e:
        print(f"✗ {encoding} - Error: {str(e)[:50]}")
