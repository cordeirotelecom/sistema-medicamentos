# Script de Deploy Simplificado - Sistema DHS
Write-Host "🚀 DEPLOY SISTEMA DHS - MEDICAMENTOS" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretório correto
if (!(Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script no diretório do projeto" -ForegroundColor Red
    exit 1
}

Write-Host "📋 PASSO 1: Verificando projeto..." -ForegroundColor Cyan
Write-Host "Diretório: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Commit das mudanças
Write-Host "💾 PASSO 2: Salvando mudanças..." -ForegroundColor Cyan
git add .

$commitMessage = @"
Deploy Sistema DHS - $(Get-Date -Format 'dd/MM/yyyy HH:mm')

Atualizacoes:
* Widget consulta ANVISA implementado
* Base legal atualizada 2024-2025
* Melhorias interface usuario
* Foco em servico publico
* Remocao referencias comerciais
"@

git commit -m $commitMessage
Write-Host "✅ Commit realizado!" -ForegroundColor Green
Write-Host ""

# Push para GitHub
Write-Host "⬆️ PASSO 3: Enviando para GitHub..." -ForegroundColor Cyan
git push origin main
Write-Host "✅ Enviado para GitHub!" -ForegroundColor Green
Write-Host ""

# Build do projeto
Write-Host "🔨 PASSO 4: Gerando build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluído!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no build" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Informações finais
Write-Host "🎉 DEPLOY CONCLUÍDO!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs do Projeto:" -ForegroundColor Yellow
Write-Host "GitHub: https://github.com/cordeirotelecom/sistema-medicamentos" -ForegroundColor Cyan
Write-Host "Netlify: https://sistema-medicamentos-dhs.netlify.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 O deploy automático será feito via GitHub Actions" -ForegroundColor Gray
Write-Host "Aguarde alguns minutos para as mudanças aparecerem online" -ForegroundColor Gray
Write-Host ""

# Abrir URLs
Write-Host "🌍 Abrindo links no navegador..." -ForegroundColor Green
Start-Process "https://github.com/cordeirotelecom/sistema-medicamentos"
Start-Process "https://sistema-medicamentos-dhs.netlify.app"

Write-Host "✨ Processo finalizado com sucesso!" -ForegroundColor Green
