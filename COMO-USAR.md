# INSTRUÇÕES PARA EXECUTAR O SISTEMA

## ✅ Status: FUNCIONANDO
- Servidor rodando na porta 3000 
- Todas as páginas carregando corretamente
- Links funcionais

## 🚀 Como iniciar o sistema:

### Opção 1 - Duplo clique (Mais Fácil):
1. Vá para a pasta: `C:\Users\corde\OneDrive\Desktop\ProjetoSaude\app-medicamentos`
2. Duplo clique no arquivo: `iniciar-sistema.bat`
3. O navegador abrirá automaticamente em http://localhost:3000

### Opção 2 - PowerShell:
1. Abra o PowerShell
2. Execute: `.\start-server.ps1` 
3. O navegador abrirá automaticamente em http://localhost:3000

### Opção 3 - Manual:
1. Abra o PowerShell ou Terminal
2. Execute os comandos:
   ```
   cd "C:\Users\corde\OneDrive\Desktop\ProjetoSaude\app-medicamentos"
   npm run dev
   ```
3. Abra o navegador em: http://localhost:3000

## 🌐 Links do Sistema:

- **Página Principal**: http://localhost:3000
- **Portal do Cidadão**: http://localhost:3000/cidadao
- **Ministério Público**: http://localhost:3000/promotor
- **Defensoria Pública**: http://localhost:3000/defensoria

## 📱 Contatos de Emergência (já incluídos no site):
- **SAMU**: 192
- **Farmácia Popular**: 136
- **PROCON**: 151
- **Defensoria**: 129

## ⚠️ Resolução de Problemas:

Se a página não carregar:
1. Certifique-se de que está na pasta correta do projeto
2. Limpe o cache: `Remove-Item -Recurse -Force .next`
3. Reinicie o servidor: `npm run dev`
4. Tente um novo navegador ou aba anônima
5. Verifique se não há outro processo usando a porta 3000

## 🔧 Últimas Correções Aplicadas:
✅ Removidas referências a IA e análise jurídica
✅ Adicionados contatos úteis no header
✅ Removido widget ANVISA
✅ Sistema funcionando na porta 3000
✅ Todas as páginas carregando com status 200

## Para parar o servidor:
Pressione **Ctrl+C** no terminal onde o servidor está rodando.
