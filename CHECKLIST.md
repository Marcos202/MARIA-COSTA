# ✅ Checklist de Deploy - Maria Costa 90 Anos

Use este arquivo para acompanhar seu progresso!

---

## 🎯 Configuração Inicial

### Git Local
- [x] Git configurado (`git config --global user.name` e `user.email`)
- [x] Repositório Git inicializado (`git init`)
- [x] Arquivos adicionados (`git add .`)
- [x] Primeiro commit feito
- [x] Branch renomeada para `main`

### GitHub
- [ ] Conta no GitHub criada/acessada
- [ ] Repositório `maria90anos` criado no GitHub
- [ ] Repositório local conectado ao GitHub (`git remote add origin`)
- [ ] Código enviado para GitHub (`git push -u origin main`)

### Vercel
- [ ] Conta na Vercel criada (com GitHub)
- [ ] Repositório importado na Vercel
- [ ] Variáveis de ambiente configuradas:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy realizado com sucesso
- [ ] Site acessível na URL da Vercel

---

## 📝 Informações Importantes

### URLs do Projeto

**GitHub:**
```
https://github.com/SEU-USUARIO/maria90anos
```
_(Preencha após criar o repositório)_

**Vercel (Produção):**
```
https://maria90anos.vercel.app
```
_(Preencha após deploy)_

**Vercel (Dashboard):**
```
https://vercel.com/SEU-USUARIO/maria90anos
```

---

## 🔐 Variáveis de Ambiente

Copie do arquivo `.env` local:

```env
VITE_SUPABASE_URL=_____________________
VITE_SUPABASE_ANON_KEY=_____________________
```

---

## 🚀 Comandos Executados

### Já Executados ✅
```powershell
git init                                    # Inicializar repositório
git add .                                   # Adicionar arquivos
git commit -m "Initial commit..."           # Primeiro commit
git branch -M main                          # Renomear branch
```

### Próximos Passos 📍
```powershell
# 1. Criar repositório no GitHub (via web ou CLI)

# 2. Conectar e enviar código
git remote add origin https://github.com/SEU-USUARIO/maria90anos.git
git push -u origin main

# OU usar o script:
.\conectar-github.ps1
```

---

## 🔄 Workflow Diário (Após Deploy)

Sempre que fizer alterações:

```powershell
# Opção 1: Script automático
.\commit-rapido.ps1

# Opção 2: Manual
git add .
git commit -m "descrição das alterações"
git push
```

**Resultado:** Deploy automático na Vercel! 🎉

---

## 📊 Status do Projeto

### Ambiente Local
- [x] Dependências instaladas (`node_modules`)
- [x] Arquivo `.env` configurado
- [x] Build testado localmente (`npm run build`)
- [x] Dev server funcionando (`npm run dev`)

### Ambiente de Produção
- [ ] Build bem-sucedido na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Site acessível publicamente
- [ ] Domínio personalizado (opcional)

---

## 🆘 Problemas e Soluções

### ❌ Problema encontrado:
```
_____________________________________________________
```

### ✅ Solução aplicada:
```
_____________________________________________________
```

---

## 📞 Recursos de Ajuda

- **Guia Rápido:** `INICIO-RAPIDO.md`
- **Guia Completo:** `GUIA-VERCEL-COMPLETO.md`
- **README:** `LEIA-ME.md`

### Links Úteis
- Vercel Docs: https://vercel.com/docs
- Git Docs: https://git-scm.com/doc
- GitHub Docs: https://docs.github.com

---

## 🎉 Conclusão

Quando todos os itens estiverem marcados, seu projeto estará:
- ✅ Versionado no GitHub
- ✅ Deployado na Vercel
- ✅ Acessível publicamente
- ✅ Com deploy automático configurado

**Parabéns! 🎊**

---

**Última atualização:** ___/___/___
**Status geral:** 🟡 Em progresso / 🟢 Concluído
