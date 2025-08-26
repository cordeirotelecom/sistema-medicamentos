# 🚀 Scripts PowerShell Otimizados

Este projeto agora possui scripts PowerShell otimizados para melhor experiência de desenvolvimento no Windows.

## 📋 Scripts Disponíveis

### Script Rápido (Recomendado)
```powershell
# Usar o script rápido para comandos básicos
.\quick.ps1 dev      # Iniciar desenvolvimento
.\quick.ps1 build    # Build da aplicação
.\quick.ps1 clean    # Limpar cache
.\quick.ps1 deploy   # Deploy completo
.\quick.ps1 status   # Status do projeto
.\quick.ps1 help     # Ajuda
```

### Scripts NPM Melhorados
```powershell
# Desenvolvimento
npm run dev               # Servidor desenvolvimento
npm run dev:clean         # Desenvolvimento com cache limpo

# Build
npm run build             # Build normal
npm run build:clean       # Build com cache limpo
npm run deploy:build      # Build para deploy
npm run deploy:full       # Deploy completo automatizado

# Limpeza
npm run clean             # Limpar cache básico
npm run clean:all         # Limpeza completa + reinstalar dependências

# Scripts rápidos via NPM
npm run quick:dev         # = .\quick.ps1 dev
npm run quick:build       # = .\quick.ps1 build
npm run quick:deploy      # = .\quick.ps1 deploy
```

### Script Avançado
```powershell
# Usar o script avançado para funcionalidades completas
.\scripts\dev.ps1          # Desenvolvimento padrão
.\scripts\dev.ps1 -Build   # Build
.\scripts\dev.ps1 -Clean   # Limpeza
.\scripts\dev.ps1 -Deploy  # Deploy
.\scripts\dev.ps1 -Test    # Testes
```

## 🔧 Solucionando Problemas Comuns

### Erro de Execução PowerShell
Se houver erro de política de execução:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Pasta Incorreta
Os scripts verificam automaticamente e navegam para a pasta correta.

### Cache/Build Issues
```powershell
.\quick.ps1 clean    # Limpa cache
npm run clean:all    # Limpeza completa
```

## 🎯 Comandos Mais Usados

### Desenvolvimento Diário
```powershell
# Iniciar trabalho
.\quick.ps1 dev

# Limpar e rebuildar
.\quick.ps1 clean
.\quick.ps1 build

# Deploy completo
.\quick.ps1 deploy
```

### Solução de Problemas
```powershell
# Status completo
.\quick.ps1 status

# Limpeza profunda
npm run clean:all

# Reinstalar tudo
npm run clean:all
```

## 📱 URLs do Projeto

- **Desenvolvimento**: http://localhost:3005
- **Rede Local**: http://192.168.0.14:3005
- **Repositório**: https://github.com/cordeirotelecom/sistema-medicamentos

## ⚠️ Notas Importantes

1. **PowerShell vs CMD**: Use `;` em vez de `&&` no PowerShell
2. **Caminhos**: Use aspas duplas para caminhos com espaços
3. **Cache**: Em caso de problemas, sempre limpe o cache primeiro
4. **Portas**: Se porta 3000 estiver ocupada, usa automaticamente 3005

## 🆘 Comandos de Emergência

```powershell
# Se tudo der errado
npm run clean:all
npm install
.\quick.ps1 dev

# Resetar repositório
git reset --hard HEAD
npm run clean:all
npm install
```
