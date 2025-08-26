#!/usr/bin/env powershell
# Script para fazer commit e push das mudanças
Write-Host "=== INICIANDO COMMIT E PUSH ==="
Set-Location "C:\Users\corde\OneDrive\Desktop\ProjetoSaude\app-medicamentos"
Write-Host "Diretório atual: $(Get-Location)"

Write-Host "Verificando status do git..."
git status

Write-Host "Adicionando todos os arquivos..."
git add -A

Write-Host "Verificando arquivos adicionados..."
git status

Write-Host "Fazendo commit..."
git commit -m "SISTEMA COMPLETO: Interface limpa, botão corrigido, vercel.json adicionado"

Write-Host "Fazendo push..."
git push origin main

Write-Host "=== CONCLUÍDO ==="
