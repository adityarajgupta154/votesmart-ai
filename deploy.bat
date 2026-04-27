@echo off
REM ============================================================
REM  VoteSmart AI — COMPLETE FIX + DEPLOY (Run this in CMD)
REM ============================================================
echo.
echo === STEP 1: Delete dead CSS files ===
if exist "src\App.css" del "src\App.css" && echo   Deleted src\App.css
if exist "src\components\VoterStatus.css" del "src\components\VoterStatus.css" && echo   Deleted VoterStatus.css
if exist "src\components\VotingGuide.css" del "src\components\VotingGuide.css" && echo   Deleted VotingGuide.css
if exist "src\components\ChatAssistant.css" del "src\components\ChatAssistant.css" && echo   Deleted ChatAssistant.css
echo.

echo === STEP 2: Regenerate package-lock.json ===
call npm install --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
    echo [FAIL] npm install failed
    pause
    exit /b 1
)
echo [OK] Lock file regenerated
echo.

echo === STEP 3: Verify build works ===
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [FAIL] Build failed
    pause
    exit /b 1
)
echo [OK] Build successful — dist/ ready
echo.

echo === STEP 4: Run tests ===
call npm test
echo.

echo === STEP 5: Git commit ===
git add -A
git commit -m "fix: sync package-lock, clean dead CSS, fix Dockerfile for Cloud Run"
echo.

echo === STEP 6: Authenticate with Google Cloud ===
call gcloud auth login
echo.

echo === STEP 7: Set project ===
call gcloud config set project promptwars2-494605
echo.

echo === STEP 8: Enable APIs ===
call gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
echo.

echo === STEP 9: Deploy to Cloud Run ===
call gcloud run deploy votesmart-ai --source . --region asia-south1 --allow-unauthenticated --port 8080
echo.

echo ============================================================
echo  ALL DONE! Check the URL printed above.
echo ============================================================
pause
