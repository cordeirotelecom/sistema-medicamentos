# Deploy Automático para Netlify
# Sistema Medicamentos DHS

Write-Host "🚀 INICIANDO DEPLOY AUTOMÁTICO NETLIFY..." -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan

# 1. Build do projeto
Write-Host "📦 Fazendo build do projeto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build! Abortando deploy." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green

# 2. Deploy para Netlify
Write-Host "🌐 Fazendo deploy para Netlify..." -ForegroundColor Yellow
netlify deploy --prod --dir=out --message="Deploy automatico via PowerShell - $(Get-Date)"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deploy realizado com sucesso!" -ForegroundColor Green
    Write-Host "🌍 Site disponível em: https://sistema-medicamentos-dhs.netlify.app" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erro no deploy!" -ForegroundColor Red
    Write-Host "ℹ️  Tentando deploy manual..." -ForegroundColor Yellow
    netlify deploy --dir=out
}

Write-Host "🎉 PROCESSO CONCLUÍDO!" -ForegroundColor Green
