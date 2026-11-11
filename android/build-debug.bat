@echo off
REM Force a short Gradle home to avoid Windows 260-char path limits (ninja/CMake).
set "GRADLE_USER_HOME=C:\g"
if not exist "C:\g" mkdir "C:\g"
cd /d "%~dp0"
call gradlew.bat --stop
call gradlew.bat clean assembleDebug -Dgradle.user.home=C:\g %*
