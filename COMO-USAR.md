# INSTRUÇÕES PARA EXECUTAR O SISTEMA

## Como iniciar o sistema:

### Opção 1 - Script PowerShell (Recomendado):
1. Abra o PowerShell
2. Execute: `.\start-server.ps1` 
3. O navegador abrirá automaticamente em http://localhost:3005

### Opção 2 - Manual:
1. Abra o PowerShell ou Terminal
2. Execute os comandos:
   ```
   cd "C:\Users\corde\OneDrive\Desktop\ProjetoSaude\app-medicamentos"
   npm run dev
   ```
3. Abra o navegador em: http://localhost:3005

## Links do Sistema:

- **Página Principal**: http://localhost:3005
- **Portal do Cidadão**: http://localhost:3005/cidadao
- **Ministério Público**: http://localhost:3005/promotor
- **Defensoria Pública**: http://localhost:3005/defensoria

## Problema de Acesso:

Se a página não carregar:
1. Certifique-se de que está na pasta correta do projeto
2. Limpe o cache: `Remove-Item -Recurse -Force .next`
3. Reinicie o servidor: `npm run dev`
4. Tente um novo navegador ou aba anônima

## Status Atual:
✅ Sistema funcionando
✅ Todas as páginas carregando
✅ Links corretos configurados
✅ Script de inicialização criado

## Para parar o servidor:
Pressione **Ctrl+C** no terminal onde o servidor está rodando.
