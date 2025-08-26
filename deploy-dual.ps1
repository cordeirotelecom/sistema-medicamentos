# Deploy Automático - Vercel + Netlify
# Script PowerShell para deploy simultâneo

Write-Host "🚀 INICIANDO DEPLOY AUTOMÁTICO..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Build do projeto
Write-Host "📦 Fazendo build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no build!" -ForegroundColor Red
    exit 1
}

# Deploy no Vercel
Write-Host "🔄 Deploy no Vercel..." -ForegroundColor Yellow
vercel --prod --yes

# Deploy no Netlify
Write-Host "🔄 Deploy no Netlify..." -ForegroundColor Yellow
netlify deploy --prod --dir=out

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "🎉 DEPLOY CONCLUÍDO!" -ForegroundColor Green
Write-Host "📱 Vercel: https://app-medicamentos-k6bnpx80l-vagners-projects-c497aa13.vercel.app" -ForegroundColor Blue
Write-Host "🌐 Netlify: https://sistema-medicamentos-dhs.netlify.app" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Cyan
