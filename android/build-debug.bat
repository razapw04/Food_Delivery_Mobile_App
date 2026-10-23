@echo off
REM Avoid Windows 260-char path limit by using a short Gradle home.
REM Cursor/sandbox often uses a very long cache path under Temp\cursor-sandbox-cache.
set "GRADLE_USER_HOME=C:\g"
if not exist "C:\g" mkdir "C:\g"

cd /d "%~dp0"
call gradlew.bat clean
call gradlew.bat assembleDebug -PreactNativeArchitectures=arm64-v8a
exit /b %ERRORLEVEL%
