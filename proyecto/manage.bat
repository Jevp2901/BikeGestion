@echo off
REM Launcher para Django del proyecto bike-gestion.
REM Fuerza el uso del Python del venv sin spawn subprocesos.

set VENV_DIR=%~dp0venv
set PYTHONHOME=%VENV_DIR%
set PYTHONPATH=%~dp0
set PATH=%VENV_DIR%\Scripts;%PATH%

"%VENV_DIR%\Scripts\python.exe" "%~dp0manage.py" %*