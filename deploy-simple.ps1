# Script PowerShell para Deploy do Projeto DHS via PGS Medicamentos

Write-Host "🚀 DEPLOY DO SISTEMA DHS VIA PGS MEDICAMENTOS" -ForegroundColor Green
Write-Host ""

Write-Host "📁 PASSO 1: Criar repositório no GitHub" -ForegroundColor Cyan
Write-Host "1. Acesse: https://github.com/new"
Write-Host "2. Repository name: dhs-pgs-medicamentos"
Write-Host "3. Description: Sistema DHS via PGS Medicamentos - Acesso a medicamentos com orientação MP/Defensoria"
Write-Host "4. Marque como Public"
Write-Host "5. NAO marque 'Add a README file'"
Write-Host "6. Clique em 'Create repository'"
Write-Host ""

$username = Read-Host "Digite seu nome de usuario do GitHub"

if ($username) {
    Write-Host ""
    Write-Host "🔗 PASSO 2: Conectando ao GitHub..." -ForegroundColor Green
    
    try {
        # Remover remote existente se houver
        git remote remove origin 2>$null
        
        # Adicionar novo remote
        git remote add origin "https://github.com/$username/dhs-pgs-medicamentos.git"
        
        # Push para GitHub
        git push -u origin main
        
        Write-Host "✅ Projeto publicado no GitHub com sucesso!" -ForegroundColor Green
        Write-Host "📁 GitHub URL: https://github.com/$username/dhs-pgs-medicamentos" -ForegroundColor Yellow
        
        Write-Host ""
        Write-Host "🌐 PASSO 3: Deploy no Vercel" -ForegroundColor Cyan
        Write-Host "1. Acesse: https://vercel.com"
        Write-Host "2. Login com sua conta do GitHub"
        Write-Host "3. Clique em 'New Project'"
        Write-Host "4. Selecione 'Import Git Repository'"
        Write-Host "5. Escolha o repositorio 'dhs-pgs-medicamentos'"
        Write-Host "6. Clique em 'Deploy'"
        Write-Host ""
        Write-Host "🎯 URL final do site: https://dhs-pgs-medicamentos.vercel.app" -ForegroundColor Yellow
        Write-Host ""
        
        # Abrir URLs no navegador
        Write-Host "🌍 Abrindo GitHub e Vercel no navegador..." -ForegroundColor Green
        Start-Process "https://github.com/$username/dhs-pgs-medicamentos"
        Start-Sleep 2
        Start-Process "https://vercel.com"
        
        Write-Host ""
        Write-Host "🎉 DEPLOY INICIADO COM SUCESSO!" -ForegroundColor Green
        Write-Host "Siga os passos no Vercel para completar o deploy." -ForegroundColor Yellow
        
    } catch {
        Write-Host "❌ Erro no Git: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Verifique se o repositorio foi criado no GitHub primeiro." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Nome de usuario nao fornecido. Execute o script novamente." -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 RESUMO DO PROJETO:" -ForegroundColor Magenta
Write-Host "- Sistema completo com 3 perfis: Cidadao, Ministerio Publico, Defensoria Publica"
Write-Host "- Cores institucionais do MP (vermelho)"
Write-Host "- Analise Juridica Especializada"
Write-Host "- Integracao com orgaos governamentais"
Write-Host "- Interface moderna e responsiva"
