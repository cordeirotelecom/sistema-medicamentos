# Script para criar repositório GitHub automaticamente

$repoName = "sistema-medicamentos"
$description = "Sistema DHS via PGS Medicamentos - Acesso a medicamentos com orientacao MP/Defensoria"

Write-Host "🚀 Criando repositório GitHub automaticamente..." -ForegroundColor Green

# Usando GitHub CLI (gh) para criar repositório
try {
    # Verificar se gh está instalado
    $ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
    
    if ($ghInstalled) {
        Write-Host "✅ GitHub CLI encontrado!" -ForegroundColor Green
        
        # Criar repositório
        gh repo create $repoName --public --description $description --source=. --remote=origin --push
        
        Write-Host "✅ Repositório criado e código enviado!" -ForegroundColor Green
        Write-Host "📁 GitHub: https://github.com/cordeirotelecom/$repoName" -ForegroundColor Yellow
        
    } else {
        Write-Host "❌ GitHub CLI não encontrado. Instalando..." -ForegroundColor Red
        
        # Instalar GitHub CLI via winget
        winget install --id GitHub.cli
        
        Write-Host "✅ GitHub CLI instalado! Execute o script novamente." -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Alternativa: Acesse https://github.com/new manualmente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 PRÓXIMO PASSO - VERCEL DEPLOY:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://vercel.com"
Write-Host "2. Login com GitHub"
Write-Host "3. Import projeto: $repoName"
Write-Host "4. Deploy automático!"
