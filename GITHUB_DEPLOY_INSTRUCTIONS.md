# 🚀 Instruções para Publicar no GitHub

## 📋 **Passos para Criar o Repositório**

### 1. **Acesse o GitHub**
- Vá para: https://github.com/new
- **Repository name**: `dhs-pgs-medicamentos`
- **Description**: `Sistema DHS via PGS Medicamentos - Guia de Acesso a Medicamentos através do Desenvolvimento Harmônico Sustentável`
- ✅ **Public** (para que o site funcione no Vercel gratuitamente)
- ❌ **NÃO** marque "Add a README file" (já temos um)
- Clique em **"Create repository"**

### 2. **Comandos para Executar no Terminal**

```bash
# Adicionar o remote do GitHub (substitua SEU_USUARIO pelo seu nome de usuário)
git remote add origin https://github.com/SEU_USUARIO/dhs-pgs-medicamentos.git

# Fazer o push inicial
git push -u origin main
```

### 3. **Verificar se Funcionou**
- Acesse: `https://github.com/SEU_USUARIO/dhs-pgs-medicamentos`
- Você deve ver todos os arquivos do projeto

## 🌐 **Deploy no Vercel (Hospedar o Site)**

### 1. **Acesse o Vercel**
- Vá para: https://vercel.com
- Faça login com sua conta do GitHub

### 2. **Importar Projeto**
- Clique em **"New Project"**
- Selecione **"Import Git Repository"**
- Escolha o repositório `dhs-pgs-medicamentos`

### 3. **Configurar Deploy**
- **Project Name**: `dhs-pgs-medicamentos`
- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `./` (deixe como está)
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)
- Clique em **"Deploy"**

### 4. **Aguardar Deploy**
- O Vercel vai construir e publicar seu site
- Em ~2-3 minutos você terá uma URL como:
  `https://dhs-pgs-medicamentos.vercel.app`

## ✅ **Resultado Final**

Após completar esses passos, você terá:

1. **📁 Repositório GitHub**: Código fonte versionado e público
2. **🌐 Site Online**: Sistema funcionando na internet
3. **🔄 Deploy Automático**: Qualquer push para `main` atualiza o site automaticamente

## 🎯 **URLs Finais**

- **GitHub**: `https://github.com/SEU_USUARIO/dhs-pgs-medicamentos`
- **Site**: `https://dhs-pgs-medicamentos.vercel.app`

---

**💡 Dica**: O Vercel também te dará URLs customizadas para cada branch/PR, facilitando testes!
