# ⚡ Guia Rápido - 5 Minutos para Deploy

## ✅ Status Atual

- [x] Git inicializado
- [x] Primeiro commit feito
- [x] Branch `main` criada
- [ ] Repositório no GitHub criado
- [ ] Código enviado para GitHub
- [ ] Deploy na Vercel configurado

---

## 📍 VOCÊ ESTÁ AQUI → Próximo Passo

### 1️⃣ Criar Repositório no GitHub (2 minutos)

**Opção A - Via Web (Mais Fácil):**

1. Abra no navegador: https://github.com/new
2. Preencha:
   - **Repository name:** `maria90anos`
   - **Description:** Site comemorativo dos 90 anos de Maria Costa
   - **Visibility:** Público ✅ (recomendado para Vercel grátis)
3. **NÃO marque** nenhuma opção adicional
4. Clique em **"Create repository"**

**Opção B - Via GitHub CLI:**
```powershell
gh repo create maria90anos --public --description "Site comemorativo dos 90 anos de Maria Costa"
```

---

### 2️⃣ Conectar e Enviar Código (1 minuto)

Execute o script automático:

```powershell
.\conectar-github.ps1
```

Ou manualmente:

```powershell
# Substitua SEU-USUARIO pelo seu nome de usuário do GitHub
git remote add origin https://github.com/SEU-USUARIO/maria90anos.git
git push -u origin main
```

**Exemplo:**
```powershell
git remote add origin https://github.com/Marcos202/maria90anos.git
git push -u origin main
```

---

### 3️⃣ Deploy na Vercel (2 minutos)

1. **Acesse:** https://vercel.com/new

2. **Login:** Clique em "Continue with GitHub"

3. **Importar:**
   - Você verá seus repositórios
   - Clique em **"Import"** ao lado de `maria90anos`

4. **Configurar:**
   - **Framework:** Vite (detectado automaticamente) ✅
   - **Root Directory:** ./ (padrão) ✅
   - **Build Command:** `npm run build` ✅
   - **Output Directory:** `dist` ✅

5. **Variáveis de Ambiente:**
   - Clique em "Environment Variables"
   - Adicione:
     ```
     VITE_SUPABASE_URL = (cole seu valor do arquivo .env)
     VITE_SUPABASE_ANON_KEY = (cole seu valor do arquivo .env)
     ```
   - Marque: Production, Preview, Development

6. **Deploy:**
   - Clique em **"Deploy"**
   - Aguarde 2-3 minutos ⏱️
   - ✅ Pronto! Seu site está no ar!

---

## 🎯 Após Deploy

Você receberá uma URL tipo:
```
https://maria90anos.vercel.app
```

### Configurar Domínio Personalizado (Opcional)

1. No dashboard da Vercel
2. Vá em **Settings** → **Domains**
3. Adicione seu domínio
4. Siga as instruções de DNS

---

## 🔄 Workflow Diário

Sempre que fizer alterações:

```powershell
# Opção 1: Script automático (recomendado)
.\commit-rapido.ps1

# Opção 2: Manual
git add .
git commit -m "descrição das alterações"
git push
```

**A Vercel faz deploy automático a cada push!** 🚀

---

## 🆘 Problemas Comuns

### "git add ." não funciona
```powershell
# Verifique se está no diretório correto
cd "c:\Users\marco\OneDrive\Documentos\MARIA COSTA"
git status
```

### Erro ao fazer push
```powershell
# Verifique se o remote está configurado
git remote -v

# Se não aparecer nada, adicione:
git remote add origin https://github.com/SEU-USUARIO/maria90anos.git
```

### Build falha na Vercel
1. Verifique os logs na Vercel
2. Teste localmente:
   ```powershell
   npm run build
   ```
3. Verifique se as variáveis de ambiente estão configuradas

---

## 📞 Links Úteis

- **Seu GitHub:** https://github.com/Marcos202
- **Criar Repo:** https://github.com/new
- **Vercel Deploy:** https://vercel.com/new
- **Dashboard Vercel:** https://vercel.com/dashboard

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `GUIA-VERCEL-COMPLETO.md` - Guia detalhado
- `LEIA-ME.md` - README do projeto

---

**⏱️ Tempo estimado total: 5 minutos**

**🎉 Boa sorte com o deploy!**
