# 🚀 Guia Completo: Deploy Profissional na Vercel

## 📋 Pré-requisitos

- ✅ Node.js instalado
- ✅ Conta no GitHub (https://github.com)
- ✅ Conta na Vercel (https://vercel.com)
- ✅ Git instalado no Windows

---

## 🔧 Passo 1: Configurar Git Localmente

### 1.1 Configurar identidade Git (apenas primeira vez)
```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

### 1.2 Inicializar repositório Git
```powershell
git init
```

### 1.3 Adicionar todos os arquivos
```powershell
git add .
```

### 1.4 Fazer o primeiro commit
```powershell
git commit -m "Initial commit: Maria Costa 90 Anos"
```

---

## 📦 Passo 2: Criar Repositório no GitHub

### Opção A: Via Interface Web (Recomendado)
1. Acesse: https://github.com/new
2. Nome do repositório: `maria90anos`
3. Descrição: "Site comemorativo dos 90 anos de Maria Costa"
4. Visibilidade: **Público** ou **Privado** (sua escolha)
5. **NÃO** marque "Add README" ou ".gitignore" (já temos)
6. Clique em **"Create repository"**

### Opção B: Via GitHub CLI (se instalado)
```powershell
gh repo create maria90anos --public --source=. --remote=origin --push
```

---

## 🔗 Passo 3: Conectar com GitHub

Após criar o repositório no GitHub, você verá comandos. Use estes:

```powershell
# Adicionar o repositório remoto
git remote add origin https://github.com/SEU-USUARIO/maria90anos.git

# Renomear branch para main (padrão moderno)
git branch -M main

# Enviar código para GitHub
git push -u origin main
```

**⚠️ Importante:** Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub!

---

## 🌐 Passo 4: Deploy na Vercel

### Método 1: Via Interface Web (Mais Fácil) ⭐

1. **Acesse:** https://vercel.com/new
2. **Login:** Use sua conta GitHub
3. **Importar Repositório:**
   - Clique em "Import Git Repository"
   - Selecione `maria90anos`
   - Clique em "Import"

4. **Configurar Projeto:**
   - **Framework Preset:** Vite (detectado automaticamente)
   - **Root Directory:** `./` (deixe padrão)
   - **Build Command:** `npm run build` (já configurado)
   - **Output Directory:** `dist` (já configurado)
   - **Install Command:** `npm install` (já configurado)

5. **Variáveis de Ambiente:**
   - Clique em "Environment Variables"
   - Adicione suas variáveis do arquivo `.env`:
     ```
     VITE_SUPABASE_URL = seu_valor_aqui
     VITE_SUPABASE_ANON_KEY = seu_valor_aqui
     ```

6. **Deploy:**
   - Clique em "Deploy"
   - Aguarde 2-3 minutos
   - ✅ Seu site estará no ar!

### Método 2: Via Vercel CLI

```powershell
# Instalar Vercel CLI globalmente
npm install -g vercel

# Login na Vercel
vercel login

# Deploy (primeira vez)
vercel

# Deploy em produção
vercel --prod
```

---

## 🔄 Workflow de Desenvolvimento

### Fazer alterações e atualizar:

```powershell
# 1. Fazer alterações no código
# 2. Adicionar arquivos modificados
git add .

# 3. Fazer commit com mensagem descritiva
git commit -m "feat: adicionar nova funcionalidade"

# 4. Enviar para GitHub
git push

# 5. Vercel faz deploy automático! 🎉
```

### Tipos de commits profissionais:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `style:` - Mudanças visuais/CSS
- `refactor:` - Refatoração de código
- `docs:` - Documentação
- `chore:` - Tarefas de manutenção

---

## 🛠️ Comandos Git Úteis

```powershell
# Ver status dos arquivos
git status

# Ver histórico de commits
git log --oneline

# Desfazer alterações não commitadas
git checkout -- .

# Ver diferenças
git diff

# Criar nova branch
git checkout -b nome-da-branch

# Voltar para main
git checkout main

# Atualizar do GitHub
git pull
```

---

## 🔐 Segurança: Variáveis de Ambiente

### ⚠️ NUNCA commite o arquivo `.env`!

Seu `.gitignore` já está configurado corretamente para ignorar `.env`.

### Como adicionar variáveis na Vercel:

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** (cole o valor)
   - **Environments:** Production, Preview, Development
5. Clique em **Save**

### Após adicionar variáveis:
```powershell
# Fazer redeploy para aplicar variáveis
vercel --prod
```

---

## 🐛 Solução de Problemas

### Erro: "git add ." não faz nada
**Causa:** Não está em um repositório Git  
**Solução:** Execute `git init` primeiro

### Erro: "fatal: not a git repository"
**Causa:** Pasta não inicializada como Git  
**Solução:** Execute `git init`

### Erro: "failed to push some refs"
**Causa:** Repositório remoto tem commits que você não tem  
**Solução:** 
```powershell
git pull origin main --rebase
git push origin main
```

### Erro de build na Vercel
**Causa:** Falta de variáveis de ambiente ou erro no código  
**Solução:**
1. Verifique os logs na Vercel
2. Adicione variáveis de ambiente
3. Teste localmente: `npm run build`

### OneDrive sincronizando node_modules
**Solução:**
1. Adicione `node_modules` ao `.gitignore` (já está)
2. Configure OneDrive para ignorar `node_modules`

---

## 📊 Verificar Deploy

Após deploy bem-sucedido:

1. **URL de Produção:** `https://maria90anos.vercel.app`
2. **Dashboard:** https://vercel.com/dashboard
3. **Logs:** Clique no projeto → Deployments → Ver logs

---

## 🎯 Checklist Final

- [ ] Git configurado (`git config --global`)
- [ ] Repositório inicializado (`git init`)
- [ ] Primeiro commit feito
- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub (`git push`)
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Site acessível na URL da Vercel

---

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Git Docs:** https://git-scm.com/doc
- **GitHub Docs:** https://docs.github.com

---

**✨ Seu projeto está pronto para o mundo!**
