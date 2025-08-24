# 🚀 Script PowerShell para Publicar no GitHub e Vercel

Write-Host "📁 Instruções para GitHub:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://github.com/new"
Write-Host "2. Repository name: dhs-pgs-medicamentos"
Write-Host "3. Description: Sistema DHS via PGS Medicamentos"
Write-Host "4. Marque como Public ✅"
Write-Host "5. NÃO marque 'Add a README file'"
Write-Host "6. Clique em 'Create repository'"
Write-Host ""

$username = Read-Host "Digite seu nome de usuário do GitHub"

if ($username) {
    Write-Host "🔗 Executando comandos Git..." -ForegroundColor Green
    
    # Adicionar remote
    git remote add origin "https://github.com/$username/dhs-pgs-medicamentos.git"
    
    # Push para GitHub
    git push -u origin main
    
    Write-Host "✅ Projeto publicado no GitHub!" -ForegroundColor Green
    Write-Host "📁 GitHub: https://github.com/$username/dhs-pgs-medicamentos" -ForegroundColor Yellow
    
    Write-Host ""
    Write-Host "🌐 Próximo passo - Deploy no Vercel:" -ForegroundColor Cyan
    Write-Host "1. Acesse: https://vercel.com"
    Write-Host "2. Login com sua conta do GitHub"
    Write-Host "3. Clique em 'New Project'"
    Write-Host "4. Selecione 'Import Git Repository'"
    Write-Host "5. Escolha o repositório 'dhs-pgs-medicamentos'"
    Write-Host "6. Clique em 'Deploy'"
    Write-Host ""
    Write-Host "🎯 URL final do site: https://dhs-pgs-medicamentos.vercel.app" -ForegroundColor Yellow
    
    # Abrir GitHub no navegador
    Start-Process "https://github.com/$username/dhs-pgs-medicamentos"
    Start-Process "https://vercel.com"
} else {
    Write-Host "❌ Nome de usuário não fornecido. Execute o script novamente." -ForegroundColor Red
}
