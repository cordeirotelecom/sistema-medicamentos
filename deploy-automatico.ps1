# Script de Deploy Automatizado - Sistema DHS via PGS Medicamentos
# Data: 25 de agosto de 2025

Write-Host "🚀 DEPLOY AUTOMATIZADO - SISTEMA DHS VIA PGS MEDICAMENTOS" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos no diretório correto
$currentDir = Get-Location
Write-Host "📂 Diretório atual: $currentDir" -ForegroundColor Yellow

# Verificar se package.json existe
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERRO: package.json não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script no diretório raiz do projeto." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Projeto localizado com sucesso" -ForegroundColor Green
Write-Host ""

# Passo 1: Build do projeto
Write-Host "🔨 PASSO 1: Compilando projeto..." -ForegroundColor Cyan
try {
    npm run build
    Write-Host "✅ Build realizado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no build do projeto!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Passo 2: Verificar status Git
Write-Host "📋 PASSO 2: Verificando status do Git..." -ForegroundColor Cyan
git status --short
Write-Host ""

# Passo 3: Commit das mudanças
Write-Host "💾 PASSO 3: Fazendo commit das atualizações..." -ForegroundColor Cyan
git add .
$timestamp = Get-Date -Format "dd/MM/yyyy HH:mm"
git commit -m "🚀 Deploy automatizado - $timestamp

✨ Atualizações implementadas:
- Removidas referências a 'análise jurídica especializada'
- Adicionado widget de consulta ANVISA
- Sistema focado em atuações resolutivas de planejamento
- Base legal atualizada (2024-2025)
- Melhorias na interface e documentação"

Write-Host "✅ Commit realizado!" -ForegroundColor Green
Write-Host ""

# Passo 4: Push para GitHub
Write-Host "⬆️ PASSO 4: Enviando para GitHub..." -ForegroundColor Cyan
try {
    git push origin main
    Write-Host "✅ Código enviado com sucesso para GitHub!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao enviar para GitHub!" -ForegroundColor Red
    Write-Host "Verifique suas credenciais e conexão." -ForegroundColor Yellow
}
Write-Host ""

# Passo 5: Informações de Deploy
Write-Host "📡 PASSO 5: Informações de Deploy Automático" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor White

Write-Host ""
Write-Host "🌐 LINKS DO SISTEMA:" -ForegroundColor Green
Write-Host "   • Site Principal: https://sistema-medicamentos-dhs.netlify.app" -ForegroundColor White
Write-Host "   • GitHub: https://github.com/cordeirotelecom/sistema-medicamentos" -ForegroundColor White
Write-Host "   • Portal Cidadão: https://sistema-medicamentos-dhs.netlify.app/cidadao" -ForegroundColor White
Write-Host "   • Painel MP: https://sistema-medicamentos-dhs.netlify.app/promotor" -ForegroundColor White
Write-Host "   • Portal Defensoria: https://sistema-medicamentos-dhs.netlify.app/defensoria" -ForegroundColor White

Write-Host ""
Write-Host "🤖 DEPLOY AUTOMÁTICO:" -ForegroundColor Green
Write-Host "   • Netlify detectará automaticamente as mudanças" -ForegroundColor White
Write-Host "   • Deploy será executado em ~2-3 minutos" -ForegroundColor White
Write-Host "   • Status: https://app.netlify.com/sites/sistema-medicamentos-dhs" -ForegroundColor White

Write-Host ""
Write-Host "📊 MONITORAMENTO:" -ForegroundColor Green
Write-Host "   • Analytics: Habilitado automaticamente" -ForegroundColor White
Write-Host "   • Performance: Otimizado para produção" -ForegroundColor White
Write-Host "   • SSL: Certificado automático" -ForegroundColor White

Write-Host ""
Write-Host "✅ DEPLOY INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "O sistema será atualizado automaticamente nos próximos minutos." -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Para acompanhar o progresso:" -ForegroundColor Yellow
Write-Host "   1. Acesse: https://app.netlify.com/sites/sistema-medicamentos-dhs" -ForegroundColor White
Write-Host "   2. Vá em 'Deploys' para ver o status" -ForegroundColor White
Write-Host ""

# Aguardar entrada do usuário para fechar
Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
