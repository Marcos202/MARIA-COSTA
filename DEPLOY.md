# 🚀 Deploy na Vercel - Maria Costa

Este guia contém as instruções para fazer deploy deste projeto na Vercel.

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Variáveis de ambiente do Supabase

## 🔧 Configuração

### 1. Preparar o Repositório

Certifique-se de que o código está em um repositório Git:

```bash
git init
git add .
git commit -m "Preparar projeto para deploy"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

### 2. Importar Projeto na Vercel

#### Opção A: Via Dashboard da Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New..."** → **"Project"**
3. Selecione seu repositório Git
4. A Vercel detectará automaticamente que é um projeto Vite
5. Configure as variáveis de ambiente (veja abaixo)
6. Clique em **"Deploy"**

#### Opção B: Via CLI da Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

### 3. Configurar Variáveis de Ambiente

Na dashboard da Vercel, vá em **Settings** → **Environment Variables** e adicione:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://bxjjcfzfxzshzquuglmi.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anon do Supabase |

> ⚠️ **Importante**: Nunca commite o arquivo `.env` no Git! Use `.env.example` como template.

### 4. Configurações Automáticas

O arquivo `vercel.json` já está configurado com:

- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Rewrites para SPA (React Router)
- ✅ Cache otimizado para assets
- ✅ Framework: Vite

## 🔄 Deploy Contínuo

Após o primeiro deploy, a Vercel automaticamente:

- 🚀 Faz deploy de cada push na branch `main` (produção)
- 🔍 Cria preview deployments para cada Pull Request
- 📊 Monitora performance e analytics

## 🌐 Domínio Personalizado

Para adicionar um domínio personalizado:

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruções da Vercel

## 📱 Testar Localmente

Antes de fazer deploy, teste o build de produção:

```bash
# Instalar dependências
npm install

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 🐛 Troubleshooting

### Build falha

- Verifique se todas as dependências estão no `package.json`
- Certifique-se de que não há erros de TypeScript
- Execute `npm run build` localmente para identificar problemas

### Variáveis de ambiente não funcionam

- Confirme que as variáveis começam com `VITE_`
- Verifique se foram adicionadas na dashboard da Vercel
- Faça um novo deploy após adicionar variáveis

### Rotas 404

- O `vercel.json` já está configurado com rewrites
- Se ainda houver problemas, verifique o `react-router-dom`

## 📚 Recursos

- [Documentação Vercel](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Docs](https://supabase.com/docs)

---

**Projeto pronto para deploy! 🎉**
