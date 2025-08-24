# 🚀 Guia de Deploy

Este documento fornece instruções detalhadas para fazer deploy do **Sistema DHS via PGS Medicamentos** em diferentes plataformas.

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm 8.x ou superior
- Git configurado
- Conta na plataforma de deploy escolhida

## 🌐 Opções de Deploy

### 1. 🟢 **Netlify (Recomendado)**

#### **Deploy Automático via Git**

1. **Fork o repositório** no GitHub
2. **Conecte ao Netlify**:
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "Add new site" → "Import from Git"
   - Selecione o repositório

3. **Configurações de Build**:
   ```
   Build command: npm run build
   Publish directory: out
   Node version: 18
   ```

4. **Deploy automático** acontecerá a cada push

#### **Deploy Manual via CLI**

```bash
# Instale o Netlify CLI
npm install -g netlify-cli

# Faça login
netlify login

# Build do projeto
npm run build

# Deploy inicial
netlify deploy --dir=out

# Deploy para produção
netlify deploy --prod --dir=out
```

### 2. 🔵 **Vercel**

```bash
# Instale o Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. 🟠 **GitHub Pages**

1. **Configure o workflow** em `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

### 4. 🔴 **AWS S3 + CloudFront**

```bash
# Instale AWS CLI
aws configure

# Build
npm run build

# Sync para S3
aws s3 sync out/ s3://seu-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id SEU_DISTRIBUTION_ID --paths "/*"
```

## ⚙️ Configurações de Build

### **Environment Variables**

Crie um arquivo `.env.local` para desenvolvimento:

```env
# APIs Governamentais
NEXT_PUBLIC_ANVISA_API_URL=https://consultas.anvisa.gov.br/api
NEXT_PUBLIC_IBGE_API_URL=https://servicodados.ibge.gov.br/api
NEXT_PUBLIC_CNES_API_URL=http://cnes.datasus.gov.br/api

# Configurações do Sistema
NEXT_PUBLIC_APP_NAME="DHS via PGS Medicamentos"
NEXT_PUBLIC_APP_VERSION="2.0.0"
NEXT_PUBLIC_APP_URL="https://sistema-medicamentos-dhs.netlify.app"

# Analytics (opcional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Segurança (produção)
NEXTAUTH_SECRET="seu-secret-super-seguro"
NEXTAUTH_URL="https://seu-dominio.com"
```

### **Next.js Configuration**

Arquivo `next.config.ts` já configurado:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  distDir: 'out'
}
```

## 📊 Otimização de Performance

### **Bundle Analysis**

```bash
# Analise o bundle
npm run analyze

# Ou usando webpack-bundle-analyzer
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

### **Lighthouse CI**

Adicione ao `package.json`:

```json
{
  "scripts": {
    "lighthouse": "lhci autorun"
  }
}
```

## 🔒 Configurações de Segurança

### **Headers de Segurança**

Para Netlify, crie `public/_headers`:

```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:
```

### **Redirects**

Para Netlify, crie `public/_redirects`:

```
# SPA fallback
/*    /index.html   200

# Redirects antigos
/sistema-orientacao-medicamentosa/*  /  301
/old-path/*  /new-path/:splat  301
```

## 🌍 CDN e Cache

### **Configuração de Cache**

```javascript
// Cache strategies
const cacheConfig = {
  // Static assets
  '*.{js,css,png,jpg,gif,svg,ico,woff,woff2}': {
    'Cache-Control': 'public, max-age=31536000, immutable'
  },
  
  // HTML pages
  '*.html': {
    'Cache-Control': 'public, max-age=3600'
  },
  
  // API responses
  '/api/*': {
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  }
}
```

## 📱 Progressive Web App (PWA)

### **Manifest.json**

Crie `public/manifest.json`:

```json
{
  "name": "DHS via PGS Medicamentos",
  "short_name": "DHS Medicamentos",
  "description": "Sistema integrado para orientação de acesso a medicamentos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#dc2626",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔍 Monitoramento

### **Health Check**

Crie endpoint `/api/health`:

```typescript
export default function handler(req: any, res: any) {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    environment: process.env.NODE_ENV
  }
  
  res.status(200).json(health)
}
```

### **Error Tracking**

Integre Sentry ou similar:

```bash
npm install @sentry/nextjs
```

## 🚀 CI/CD Pipeline

### **GitHub Actions Completo**

```yaml
name: Build, Test & Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: out/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-files
          path: out/
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=out
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📋 Troubleshooting

### **Problemas Comuns**

#### **Build Falha**
```bash
# Limpe cache e reinstale
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### **Imagens Não Carregam**
Verifique `next.config.ts`:
```typescript
images: {
  unoptimized: true,
  domains: ['example.com']
}
```

#### **Rotas 404**
Para SPAs, configure redirect:
```
/*    /index.html   200
```

### **Logs e Debug**

```bash
# Build com logs detalhados
DEBUG=* npm run build

# Analyze bundle size
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

## 📞 Suporte

- 🐛 **Issues:** [GitHub Issues](https://github.com/cordeirotelecom/sistema-medicamentos/issues)
- 📧 **Email:** deploy@sistema-medicamentos.gov.br
- 📖 **Docs:** [Wiki do Projeto](https://github.com/cordeirotelecom/sistema-medicamentos/wiki)

---

<div align="center">

### 🚀 **Deploy com Confiança**

**Documentação sempre atualizada para deploys seguros**

[🏠 **README**](README.md) | [🔧 **Configuração**](https://github.com/cordeirotelecom/sistema-medicamentos/wiki/configuracao) | [🆘 **Suporte**](https://github.com/cordeirotelecom/sistema-medicamentos/issues)

</div>
