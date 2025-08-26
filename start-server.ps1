# Script para iniciar o Sistema de Medicamentos
# Uso: .\start-server.ps1

Write-Host "=== Sistema de Orientação Medicamentosa ===" -ForegroundColor Green
Write-Host "Iniciando servidor..." -ForegroundColor Yellow

# Navegar para a pasta do projeto
$projectPath = "C:\Users\corde\OneDrive\Desktop\ProjetoSaude\app-medicamentos"
Set-Location $projectPath

# Verificar se estamos na pasta correta
if (Test-Path "package.json") {
    Write-Host "✓ Pasta do projeto encontrada" -ForegroundColor Green
    
    # Limpar cache se existir
    if (Test-Path ".next") {
        Write-Host "Limpando cache..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    }
    
    # Verificar se a porta 3005 está livre
    $port = 3005
    Write-Host "Verificando porta $port..." -ForegroundColor Yellow
    
    # Iniciar o servidor
    Write-Host "Iniciando servidor Next.js..." -ForegroundColor Yellow
    Write-Host "O site estará disponível em: http://localhost:$port" -ForegroundColor Cyan
    Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
    Write-Host "Aguarde alguns segundos para o site carregar..." -ForegroundColor Yellow
    Write-Host "" 
    
    # Abrir automaticamente no navegador após 5 segundos
    Start-Job -ScriptBlock {
        Start-Sleep 5
        Start-Process "http://localhost:3005"
    } | Out-Null
    
    npm run dev
} else {
    Write-Host "✗ Erro: package.json não encontrado!" -ForegroundColor Red
    Write-Host "Pasta atual: $(Get-Location)" -ForegroundColor Red
    Write-Host "Verifique se você está na pasta correta do projeto." -ForegroundColor Red
    pause
}
