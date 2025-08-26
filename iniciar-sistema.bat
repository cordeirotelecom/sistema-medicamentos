@echo off
title Sistema de Medicamentos - DHS via PGS
echo.
echo ===============================================
echo   Sistema de Orientacao Medicamentosa
echo   DHS via PGS Medicamentos
echo ===============================================
echo.
echo Iniciando servidor...
echo O site estara disponivel em: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

cd /d "C:\Users\corde\OneDrive\Desktop\ProjetoSaude\app-medicamentos"

if not exist "package.json" (
    echo ERRO: package.json nao encontrado!
    echo Verifique se voce esta na pasta correta.
    pause
    exit /b 1
)

npm run dev
pause
