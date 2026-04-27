@echo off
echo ============================================
echo  VoteSmart AI - Setup ^& Test Runner
echo ============================================
echo.

echo [1/4] Installing test dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Deleting dead CSS files...
if exist "src\App.css" del "src\App.css"
if exist "src\components\VoterStatus.css" del "src\components\VoterStatus.css"
if exist "src\components\VotingGuide.css" del "src\components\VotingGuide.css"
if exist "src\components\ChatAssistant.css" del "src\components\ChatAssistant.css"
echo Dead CSS cleaned.

echo.
echo [3/4] Running tests...
call npm test
echo.

echo [4/4] Building for production...
call npm run build
echo.

echo ============================================
echo  DONE! All steps completed.
echo ============================================
pause
