# Deploy Sistema DHS - Medicamentos
Write-Host "Deploy Sistema DHS - Medicamentos" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Adicionar arquivos
Write-Host "Adicionando arquivos..." -ForegroundColor Cyan
git add .

# Commit
Write-Host "Fazendo commit..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
git commit -m "Deploy automatico $timestamp - Melhorias sistema DHS"

# Push
Write-Host "Enviando para GitHub..." -ForegroundColor Cyan
git push origin main

# Build
Write-Host "Gerando build..." -ForegroundColor Cyan
npm run build

Write-Host "Deploy concluido!" -ForegroundColor Green
Write-Host "GitHub: https://github.com/cordeirotelecom/sistema-medicamentos" -ForegroundColor Yellow
Write-Host "Site: https://sistema-medicamentos-dhs.netlify.app" -ForegroundColor Yellow

# Abrir links
Start-Process "https://github.com/cordeirotelecom/sistema-medicamentos"
Start-Process "https://sistema-medicamentos-dhs.netlify.app"
