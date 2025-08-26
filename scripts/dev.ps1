# Script PowerShell para desenvolvimento
# Uso: .\scripts\dev.ps1

param(
    [switch]$Build,
    [switch]$Clean,
    [switch]$Deploy,
    [switch]$Test
)

# Cores para output
function Write-Success { param($Message) Write-Host $Message -ForegroundColor Green }
function Write-Info { param($Message) Write-Host $Message -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host $Message -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host $Message -ForegroundColor Red }

# Verificar se estamos na pasta correta
$currentPath = Get-Location
$expectedPath = "app-medicamentos"

if (-not $currentPath.Path.EndsWith($expectedPath)) {
    Write-Warning "Navegando para a pasta do projeto..."
    if (Test-Path "app-medicamentos") {
        Set-Location "app-medicamentos"
        Write-Success "✓ Pasta alterada para: $(Get-Location)"
    } else {
        Write-Error "❌ Pasta 'app-medicamentos' não encontrada!"
        exit 1
    }
}

# Função para limpar cache
function Clear-Cache {
    Write-Info "🧹 Limpando cache do projeto..."
    
    if (Test-Path ".next") {
        Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
        Write-Success "✓ Cache .next removido"
    }
    
    if (Test-Path "node_modules\.cache") {
        Remove-Item -Recurse -Force "node_modules\.cache" -ErrorAction SilentlyContinue
        Write-Success "✓ Cache node_modules removido"
    }
    
    Write-Success "✓ Limpeza concluída!"
}

# Função para build
function Start-Build {
    Write-Info "🏗️ Iniciando build do projeto..."
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Build concluído com sucesso!"
    } else {
        Write-Error "❌ Erro no build!"
        exit 1
    }
}

# Função para testes
function Start-Tests {
    Write-Info "🧪 Executando testes..."
    npm run test
}

# Função para deploy
function Start-Deploy {
    Write-Info "🚀 Iniciando deploy..."
    
    # Verificar se há mudanças não commitadas
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Warning "⚠️ Há mudanças não commitadas. Commitando automaticamente..."
        git add .
        $commitMessage = "AUTO-DEPLOY: $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
        git commit -m $commitMessage
        Write-Success "✓ Mudanças commitadas: $commitMessage"
    }
    
    # Push para o repositório
    Write-Info "📤 Enviando para repositório..."
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Deploy concluído com sucesso!"
        Write-Info "🌐 Aplicação disponível em: http://localhost:3005"
    } else {
        Write-Error "❌ Erro no deploy!"
        exit 1
    }
}

# Função principal para desenvolvimento
function Start-Development {
    Write-Info "🚀 Iniciando servidor de desenvolvimento..."
    Write-Info "📱 Aplicação será aberta em: http://localhost:3005"
    Write-Info "🔄 Use Ctrl+C para parar o servidor"
    Write-Info "─────────────────────────────────────────"
    
    npm run dev
}

# Executar baseado nos parâmetros
if ($Clean) {
    Clear-Cache
    return
}

if ($Build) {
    Clear-Cache
    Start-Build
    return
}

if ($Test) {
    Start-Tests
    return
}

if ($Deploy) {
    Clear-Cache
    Start-Build
    Start-Deploy
    return
}

# Padrão: iniciar desenvolvimento
Start-Development
