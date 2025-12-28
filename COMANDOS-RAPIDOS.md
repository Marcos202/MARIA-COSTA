# ⚡ Comandos Rápidos - Deploy Vercel

## 🚀 Deploy Completo (Passo a Passo)

### 1. Inicializar Git
```bash
git init
git add .
git commit -m "feat: preparar projeto para deploy na Vercel"
```

### 2. Criar Repositório no GitHub
- Acesse: https://github.com/new
- Crie o repositório (sem README, .gitignore ou license)

### 3. Conectar e Push
```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### 4. Deploy na Vercel

#### Opção A: Dashboard
1. https://vercel.com
2. "Add New..." → "Project"
3. Importe seu repositório
4. Configure variáveis de ambiente
5. Deploy!

#### Opção B: CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🔧 Comandos Úteis

### Testar Build Local
```bash
npm run build
npm run preview
```

### Limpar e Rebuild
```bash
rm -rf dist node_modules
npm install
npm run build
```

### Ver Status do Git
```bash
git status
git log --oneline -5
```

### Atualizar Deploy
```bash
git add .
git commit -m "update: descrição da mudança"
git push
# Vercel fará deploy automaticamente
```

---

## 🔐 Variáveis de Ambiente

### No arquivo .env (local)
```env
VITE_SUPABASE_URL=https://bxjjcfzfxzshzquuglmi.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### Na Vercel (produção)
```
Settings → Environment Variables → Add
```

---

## 🆘 Troubleshooting Rápido

### Build falha
```bash
npm run build
# Veja os erros e corrija
```

### Variáveis de ambiente não funcionam
- Certifique-se que começam com `VITE_`
- Adicione na Vercel Dashboard
- Faça novo deploy

### Rotas 404
- `vercel.json` já está configurado
- Verifique se foi commitado

---

## 📱 Testar em Produção

Após deploy, teste:
- [ ] Página inicial carrega
- [ ] Navegação funciona
- [ ] RSVP funciona
- [ ] Imagens carregam
- [ ] Mobile responsivo

---

**Comandos prontos para copiar e colar! ⚡**
