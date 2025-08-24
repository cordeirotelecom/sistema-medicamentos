# 🤝 Guia de Contribuição

Obrigado por seu interesse em contribuir com o **Sistema DHS via PGS Medicamentos**! Este guia ajudará você a contribuir de forma efetiva.

## 📋 Código de Conduta

Este projeto segue princípios de:
- 🤝 **Respeito mútuo** entre contribuidores
- 🏛️ **Transparência** nos processos
- ⚖️ **Ética** no desenvolvimento
- 🌱 **Sustentabilidade** das soluções

## 🚀 Como Contribuir

### 1. **Reportar Bugs**
- Use o template de issue para bugs
- Inclua passos para reproduzir
- Adicione screenshots quando relevante
- Especifique versões e ambiente

### 2. **Sugerir Funcionalidades**
- Descreva o problema que resolve
- Explique a solução proposta
- Considere alternativas
- Inclua mockups se possível

### 3. **Contribuir com Código**

#### 🔧 **Setup do Ambiente**
```bash
# Fork e clone o repositório
git clone https://github.com/SEU_USUARIO/sistema-medicamentos.git
cd sistema-medicamentos

# Instale dependências
npm install

# Configure pre-commit hooks
npm run prepare

# Execute testes
npm test
```

#### 📝 **Padrões de Código**
- **TypeScript** obrigatório
- **ESLint** para linting
- **Prettier** para formatação
- **Convenções** Next.js App Router

#### 🎨 **Padrões de Design**
- Tema **Ministério Público** (vermelho institucional)
- **Responsividade** mobile-first
- **Acessibilidade** WCAG 2.1
- **Performance** otimizada

### 4. **Workflow de Desenvolvimento**

#### 📂 **Branch Strategy**
```bash
# Para novas funcionalidades
git checkout -b feature/descricao-funcionalidade

# Para correções
git checkout -b fix/descricao-bug

# Para documentação
git checkout -b docs/descricao-melhoria
```

#### 💬 **Padrão de Commits**
```bash
# Funcionalidades
git commit -m "feat: adiciona consulta de medicamentos via API ANVISA"

# Correções
git commit -m "fix: corrige validação de CPF no formulário"

# Documentação
git commit -m "docs: atualiza README com novas instruções"

# Estilo
git commit -m "style: ajusta cores do tema MP"

# Refactor
git commit -m "refactor: melhora performance do dashboard"
```

## 🔍 **Tipos de Contribuição**

### 🏛️ **Integração Governamental**
- APIs de órgãos públicos
- Bases de dados oficiais
- Legislação atualizada
- Procedimentos legais

### 🤖 **Inteligência Artificial**
- Análise jurídica automática
- Recomendações personalizadas
- Processamento de linguagem natural
- Machine learning para predições

### 📊 **Dashboard e Relatórios**
- Visualizações de dados
- Métricas em tempo real
- Gráficos interativos
- Exportação de relatórios

### 📱 **UX/UI**
- Design responsivo
- Acessibilidade
- Animações e micro-interações
- Usabilidade

## ✅ **Checklist de Pull Request**

### 📋 **Antes de Submeter**
- [ ] Código segue padrões do projeto
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Changelog atualizado
- [ ] Screenshots para mudanças visuais
- [ ] Performance não degradada

### 🔍 **Template de PR**
```markdown
## 📝 Descrição
Breve descrição das mudanças

## 🎯 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## 🧪 Testes
Descreva os testes realizados

## 📷 Screenshots
Se aplicável, adicione screenshots

## ✅ Checklist
- [ ] Código testado
- [ ] Documentação atualizada
- [ ] Changelog atualizado
```

## 🏗️ **Arquitetura do Projeto**

### 📁 **Estrutura de Pastas**
```
src/
├── app/           # Páginas (App Router)
├── components/    # Componentes React
├── services/      # Lógica de negócio
├── data/          # Dados estáticos
├── types/         # Tipos TypeScript
└── utils/         # Utilitários
```

### 🔧 **Tecnologias Principais**
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos
- **Lucide** - Ícones

## 📚 **Recursos Úteis**

### 🏛️ **APIs Governamentais**
- [ANVISA API](https://consultas.anvisa.gov.br)
- [IBGE API](https://servicodados.ibge.gov.br)
- [CNES API](http://cnes.datasus.gov.br)

### ⚖️ **Base Legal**
- [Constituição Federal](http://www.planalto.gov.br/ccivil_03/constituicao/)
- [Lei 9.782/99 (ANVISA)](http://www.planalto.gov.br/ccivil_03/leis/l9782.htm)
- [Lei 8.080/90 (SUS)](http://www.planalto.gov.br/ccivil_03/leis/l8080.htm)

### 📖 **Documentação Técnica**
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🆘 **Suporte**

### 💬 **Canais de Comunicação**
- **GitHub Issues** - Bugs e funcionalidades
- **Discussions** - Perguntas e ideias
- **Email** - contato@sistema-medicamentos.gov.br

### 📋 **FAQ**
**Q: Como configurar o ambiente de desenvolvimento?**
A: Siga as instruções no README.md

**Q: Posso contribuir sem conhecimento técnico?**
A: Sim! Documentação, testes e feedback são valiosos

**Q: Como reportar problemas de segurança?**
A: Envie email para security@sistema-medicamentos.gov.br

## 🎉 **Reconhecimento**

Todos os contribuidores são reconhecidos no projeto:
- **Commit credits** no histórico
- **Contributors list** no README
- **Special thanks** em releases importantes

---

## 🏆 **Níveis de Contribuição**

### 🥉 **Contribuidor Bronze**
- 1-5 commits aceitos
- Issues reportados
- Documentação melhorada

### 🥈 **Contribuidor Prata**
- 6-15 commits aceitos
- Funcionalidades implementadas
- Code reviews realizados

### 🥇 **Contribuidor Ouro**
- 16+ commits aceitos
- Mantém qualidade do projeto
- Mentora novos contribuidores

---

<div align="center">

### 💡 **Juntos por um Brasil com Acesso Universal a Medicamentos**

**Obrigado por contribuir com o futuro da saúde pública brasileira!**

[🏠 **Voltar ao README**](../README.md) | [🐛 **Reportar Issue**](https://github.com/cordeirotelecom/sistema-medicamentos/issues) | [💬 **Discussões**](https://github.com/cordeirotelecom/sistema-medicamentos/discussions)

</div>
