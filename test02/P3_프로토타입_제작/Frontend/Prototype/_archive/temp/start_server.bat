@echo off
echo ========================================
echo SSALWorks 로컬 웹 서버 시작
echo ========================================
echo.
echo 서버 주소: http://localhost:8000/index.html
echo.
echo 브라우저에서 위 주소로 접속하세요.
echo 서버를 종료하려면 Ctrl+C를 누르세요.
echo.
echo ========================================
python -m http.server 8000
