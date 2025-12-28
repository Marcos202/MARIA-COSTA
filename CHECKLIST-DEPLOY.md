# ✅ Checklist de Deploy - Vercel

## 📦 Arquivos Criados/Atualizados

- ✅ `vercel.json` - Configuração da Vercel
- ✅ `.env.example` - Template de variáveis de ambiente
- ✅ `.gitignore` - Atualizado para incluir `.env`
- ✅ `DEPLOY.md` - Guia completo de deploy
- ✅ Build testado e funcionando

## 🚀 Próximos Passos

### 1️⃣ Inicializar Git (se ainda não foi feito)

```bash
git init
git add .
git commit -m "feat: preparar projeto para deploy na Vercel"
```

### 2️⃣ Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Crie um novo repositório (pode ser privado ou público)
3. **NÃO** inicialize com README, .gitignore ou license

### 3️⃣ Conectar e Push

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### 4️⃣ Deploy na Vercel

#### Opção A: Via Dashboard (Recomendado)

1. Acesse https://vercel.com
2. Clique em **"Add New..."** → **"Project"**
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: `https://bxjjcfzfxzshzquuglmi.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: (copie do arquivo `.env`)
5. Clique em **"Deploy"**

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🔐 Variáveis de Ambiente

**IMPORTANTE:** Adicione estas variáveis na Vercel:

| Variável | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://bxjjcfzfxzshzquuglmi.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | (do arquivo `.env`) |

## 🧪 Testar Antes do Deploy

```bash
# Build local
npm run build

# Preview do build
npm run preview
```

## 📝 Após o Deploy

- [ ] Testar todas as funcionalidades no ambiente de produção
- [ ] Verificar se o RSVP está funcionando
- [ ] Testar em dispositivos móveis
- [ ] Configurar domínio personalizado (opcional)

## 🆘 Problemas Comuns

### Build falha na Vercel
- Verifique se as variáveis de ambiente foram adicionadas
- Confirme que o build local funciona: `npm run build`

### Página em branco após deploy
- Verifique o console do navegador
- Confirme que as variáveis de ambiente estão corretas

### Rotas não funcionam (404)
- O `vercel.json` já está configurado corretamente
- Faça um novo deploy se necessário

---

**Projeto 100% pronto para deploy! 🎉**
