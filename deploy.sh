#!/bin/bash

# 🚀 Script para Publicar no GitHub e Vercel
# Execute estes comandos um por vez no terminal

echo "📁 Criando repositório no GitHub..."
echo "1. Acesse: https://github.com/new"
echo "2. Nome: dhs-pgs-medicamentos"
echo "3. Descrição: Sistema DHS via PGS Medicamentos"
echo "4. Público ✅"
echo "5. Clique em 'Create repository'"
echo ""

echo "⏳ Aguardando criação do repositório..."
read -p "Pressione ENTER após criar o repositório no GitHub..."

echo "🔗 Adicionando remote do GitHub..."
echo "SUBSTITUA 'SEU_USUARIO' pelo seu nome de usuário do GitHub:"
echo "git remote add origin https://github.com/SEU_USUARIO/dhs-pgs-medicamentos.git"
echo ""

echo "📤 Para fazer o push, execute:"
echo "git push -u origin main"
echo ""

echo "🌐 Deploy no Vercel:"
echo "1. Acesse: https://vercel.com"
echo "2. Login com GitHub"
echo "3. New Project"
echo "4. Import Git Repository"
echo "5. Selecione dhs-pgs-medicamentos"
echo "6. Deploy"
echo ""

echo "✅ URLs finais:"
echo "GitHub: https://github.com/SEU_USUARIO/dhs-pgs-medicamentos"
echo "Site: https://dhs-pgs-medicamentos.vercel.app"
