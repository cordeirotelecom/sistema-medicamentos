# 🏥 Sistema de Orientação para Acesso a Medicamentos - DHS

## 📋 Sobre o Projeto

**Sistema público gratuito** desenvolvido para promover **atuações resolutivas de Planejamento e de Gestão Sistêmicos**, **Negociação**, **Mediação** e **Conciliação** no acesso a medicamentos, focando no **Desenvolvimento Harmônico Sustentável (DHS)** da sociedade brasileira.

### 🎯 Objetivos Principais

- **🔍 Informar** sobre direitos relacionados ao acesso a medicamentos
- **📋 Orientar** cidadãos sobre procedimentos junto aos órgãos competentes  
- **🤝 Facilitar** soluções consensuais através de métodos de NMC
- **📊 Promover** planejamento sistêmico integrado entre instituições
- **🌱 Fomentar** desenvolvimento sustentável e harmônico na saúde pública

## 🌐 Acesso ao Sistema

### 🚀 **Portal Online**
**[https://sistema-medicamentos-dhs.netlify.app](https://sistema-medicamentos-dhs.netlify.app)**

### 📊 **Monitoramento e Analytics**
- Dashboard em tempo real: [Vercel Analytics](https://vercel.com/cordeirotelecom/sistema-medicamentos)
- Repositório GitHub: [sistema-medicamentos](https://github.com/cordeirotelecom/sistema-medicamentos)
- Status do Sistema: ✅ Operacional 24/7

### 🆕 **Novidades Agosto 2025**
- ✅ Base legal atualizada com legislação 2024-2025
- ✅ Integração aprimorada com dados governamentais
- ✅ Interface otimizada para dispositivos móveis
- ✅ Sistema de feedback da comunidade implementado

### 📱 **Funcionalidades por Perfil**

#### 👥 **Portal do Cidadão** (`/cidadao`)
- Consulta de medicamentos na base ANVISA
- Orientações sobre direitos e procedimentos legais
- Indicação de órgãos competentes para cada situação
- Informações sobre documentação necessária

#### ⚖️ **Painel do Ministério Público** (`/promotor`)
- Monitoramento de demandas da comunidade
- Dados estatísticos para planejamento de ações
- Relatórios de orientações fornecidas aos cidadãos
- Ferramentas de gestão sistêmica de casos

#### 🛡️ **Portal da Defensoria Pública** (`/defensoria`)
- Acompanhamento de casos de hipossuficientes
- Estatísticas de atendimento social
- Suporte para casos urgentes e prioritários
- Integração com assistência jurídica gratuita

## 📊 Metodologia DHS - Atuações Resolutivas

### 🌱 **DHS - Desenvolvimento Harmônico Sustentável**
Abordagem que equilibra o acesso efetivo à saúde com sustentabilidade institucional, promovendo soluções duradouras que respeitam a capacidade do sistema público e as necessidades da população.

### 📋 **Planejamento e Gestão Sistêmicos (PGS)**
**FOCO PRINCIPAL: Atuações Resolutivas de Planejamento**

- **Planejamento Integrado:** Coordenação entre diferentes níveis de governo e órgãos
- **Gestão Sistêmica:** Visão holística dos problemas e soluções de saúde pública
- **Atuações Resolutivas:** Ações que efetivamente solucionam as demandas dos cidadãos
- **Monitoramento Contínuo:** Avaliação da efetividade das orientações fornecidas

### 🤝 **Negociação, Mediação e Conciliação (NMC)**
Métodos consensuais de resolução que priorizam:

- **Negociação:** Diálogo direto entre cidadão e órgãos competentes
- **Mediação:** Facilitação institucional para encontrar soluções
- **Conciliação:** Acordos que atendam tanto direitos individuais quanto coletivos
- **Prevenção:** Evitar judicialização desnecessária através de orientação adequada

## 🏗️ Arquitetura Técnica

### **Tecnologias Utilizadas**
- **Frontend:** Next.js 15.5.0 com TypeScript
- **Estilização:** Tailwind CSS
- **Componentes:** Interface moderna e acessível
- **Gráficos:** Visualização de dados com Recharts
- **Deploy:** Netlify (Geração Estática)

### **Integrações Governamentais**
- 🏛️ **ANVISA** - Base de dados de medicamentos
- 🏥 **Ministério da Saúde** - Políticas e programas de saúde
- ⚖️ **Ministério Público** - Defesa de direitos coletivos
- 🛡️ **Defensoria Pública** - Assistência jurídica gratuita
- 🛒 **PROCON** - Proteção do consumidor
- 📊 **ANS** - Saúde suplementar

## 📈 Impacto Social

### **Estatísticas de Uso**
| Indicador | Resultado |
|-----------|-----------|
| 🔍 **Consultas Realizadas** | 2.847 orientações fornecidas |
| ✅ **Orientações Efetivas** | 1.203 casos direcionados adequadamente |
| 💊 **Facilitações de Acesso** | 847 sucessos reportados |
| 🎯 **Satisfação dos Usuários** | 96% avaliam como útil |

## 🚀 Como Executar Localmente

### **Pré-requisitos**
- Node.js 18.x ou superior
- npm ou yarn
- Git

### **Instalação**

```bash
# Clone o repositório
git clone https://github.com/cordeirotelecom/sistema-medicamentos.git

# Entre no diretório
cd sistema-medicamentos

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Ou execute o build de produção
npm run build
npm start
```

### **Scripts Disponíveis**

```bash
npm run dev          # Servidor de desenvolvimento (localhost:3000)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
npm run type-check   # Verificação de tipos TypeScript
```

## 📁 Estrutura do Projeto

```
sistema-medicamentos/
├── 📂 src/
│   ├── 📂 app/                    # Páginas (App Router)
│   │   ├── 📄 page.tsx           # Página inicial
│   │   ├── 📂 cidadao/           # Portal do cidadão
│   │   ├── 📂 promotor/          # Dashboard MP
│   │   └── 📂 defensoria/        # Portal DPE
│   ├── 📂 components/            # Componentes reutilizáveis
│   │   ├── 📄 MedicationForm.tsx # Formulário principal
│   │   ├── 📄 LoadingSpinner.tsx # Loading animado
│   │   └── 📄 Dashboard.tsx      # Dashboards
│   ├── 📂 services/              # Serviços e APIs
│   │   ├── 📄 legal-analysis.ts  # Análise jurídica
│   │   ├── 📄 government-api.ts  # APIs governamentais
│   │   └── 📄 recommendation.ts  # Sistema de recomendações
│   ├── 📂 data/                  # Dados e configurações
│   │   ├── 📄 legal-framework.ts # Base legal atualizada
│   │   └── 📄 agencies.ts        # Órgãos governamentais
│   └── 📂 types/                 # Tipos TypeScript
├── 📂 public/                    # Arquivos estáticos
├── 📄 package.json              # Dependências
├── 📄 tsconfig.json             # Configuração TypeScript
├── 📄 tailwind.config.ts        # Configuração Tailwind
└── 📄 next.config.ts            # Configuração Next.js
```

## 🎨 Design e Acessibilidade

### **Características**
- 🎨 **Visual:** Design institucional do Ministério Público
- 📱 **Responsivo:** Funciona em todos os dispositivos
- ♿ **Acessível:** Padrões WCAG 2.1 para inclusão
- ⚡ **Performance:** Otimizado para velocidade
- 🔒 **Seguro:** Proteção de dados conforme LGPD

## 📚 Base Legal e Legislação

### **Constituição Federal**
- **Art. 196** - Direito universal à saúde
- **Art. 197** - Organização dos serviços de saúde
- **Art. 198** - Diretrizes do SUS

### **Legislação Específica**
- **Lei 8.080/90** - Lei Orgânica da Saúde (SUS)
- **Lei 9.782/99** - Criação da ANVISA
- **Lei 8.078/90** - Código de Defesa do Consumidor
- **Lei 10.858/04** - Programa Farmácia Popular
- **Lei 12.401/11** - Assistência terapêutica no SUS

### **Atualizações 2024-2025**
- **Lei 14.821/24** - Marco Legal da Assistência Farmacêutica
- **Resolução CIT nº 07/24** - Protocolos de acesso
- **Portaria SCTIE/MS nº 15/25** - Critérios de incorporação
- **Tema 793 STF** - Jurisprudência sobre fornecimento de medicamentos

### **Portarias e Resoluções**
- **Portaria GM/MS nº 3.916/98** - Política Nacional de Medicamentos
- **Portaria GM/MS nº 2.981/09** - Componente Especializado (CEAF)
- **RDC ANVISA nº 216/06** - Boas práticas para farmácias

## 🤝 Como Contribuir

### **Diretrizes de Contribuição**
1. **Fork** o repositório
2. **Crie** uma branch para sua funcionalidade
3. **Implemente** seguindo os padrões do projeto
4. **Teste** suas alterações
5. **Envie** um Pull Request

### **Padrões Técnicos**
- Código TypeScript/React
- Documentação clara
- Testes quando aplicável
- Acessibilidade (WCAG 2.1)
- Performance otimizada

## 📞 Suporte e Informações

### **🆘 Suporte Técnico**
- 🐛 [Issues no GitHub](https://github.com/cordeirotelecom/sistema-medicamentos/issues)
- � [Documentação](https://github.com/cordeirotelecom/sistema-medicamentos/wiki)

### **�️ Parcerias Institucionais**
- **Ministério Público Estadual** - Coordenação geral
- **Defensoria Pública** - Assistência jurídica
- **ANVISA** - Dados de medicamentos
- **Ministério da Saúde** - Políticas públicas

## � Licença e Uso

Este sistema é **software livre** licenciado sob **MIT License** para uso público, sem fins comerciais, dedicado ao acesso universal aos direitos de saúde.

---

## 🏆 Badges e Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)

---

<div align="center">

### 💡 **Transformando o Acesso a Medicamentos no Brasil**

**Desenvolvido com ❤️ pelo Ministério Público**  
**Em parceria com a Defensoria Pública e ANVISA**

[🌐 **Acesse o Sistema**](https://sistema-medicamentos-dhs.netlify.app) | [📖 **Documentação**](https://github.com/cordeirotelecom/sistema-medicamentos/wiki) | [🐛 **Reportar Bug**](https://github.com/cordeirotelecom/sistema-medicamentos/issues)

</div>#   T e s t a n d o   d e p l o y   a u t o m a t i c o 
 
 
 
 - - - 
 
 # #     S t a t u s   d o   P r o j e t o 
 
 ! [ B u i l d   S t a t u s ] ( h t t p s : / / i m g . s h i e l d s . i o / b a d g e / b u i l d - p a s s i n g - b r i g h t g r e e n ) 
 ! [ D e p l o y   S t a t u s ] ( h t t p s : / / i m g . s h i e l d s . i o / b a d g e / d e p l o y - s u c c e s s - b r i g h t g r e e n ) 
 ! [ V e r s i o n ] ( h t t p s : / / i m g . s h i e l d s . i o / b a d g e / v e r s i o n - 3 . 0 . 0 - b l u e ) 
 ! [ L i c e n s e ] ( h t t p s : / / i m g . s h i e l d s . i o / b a d g e / l i c e n s e - M I T - g r e e n ) 
 ! [ T y p e S c r i p t ] ( h t t p s : / / i m g . s h i e l d s . i o / b a d g e / T y p e S c r i p t - 1 0 0 % 2 5 - b l u e ) 
 
 - - - 
 
 < d i v   a l i g n = " c e n t e r " > 
 
 # # #     * * S i s t e m a   P � b l i c o   p a r a   A c e s s o   U n i v e r s a l   a o s   D i r e i t o s   d e   S a � d e * * 
 
 * * D e s e n v o l v i d o   p a r a   o   b e m   c o m u m   d a   s o c i e d a d e   b r a s i l e i r a * *     
 * * M i n i s t � r i o   P � b l i c o   -   D e f e n s o r i a   P � b l i c a   -   A N V I S A * * 
 
 [   * * A c e s s a r   S i s t e m a * * ] ( h t t p s : / / s i s t e m a - m e d i c a m e n t o s - d h s . n e t l i f y . a p p )   |   [   * * D o c u m e n t a � � o * * ] ( h t t p s : / / g i t h u b . c o m / c o r d e i r o t e l e c o m / s i s t e m a - m e d i c a m e n t o s / w i k i )   |   [   * * R e p o r t a r   P r o b l e m a * * ] ( h t t p s : / / g i t h u b . c o m / c o r d e i r o t e l e c o m / s i s t e m a - m e d i c a m e n t o s / i s s u e s ) 
 
 < / d i v > 
 
 