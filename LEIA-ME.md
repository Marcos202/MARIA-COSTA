# 🎉 Maria Costa - 90 Anos

Site comemorativo para celebrar os 90 anos de Maria Costa de Jesus.

## 🚀 Como Usar

### Primeira vez (Configuração Inicial)

1. **Criar repositório no GitHub:**
   - Acesse: https://github.com/new
   - Nome: `maria90anos`
   - Clique em "Create repository"

2. **Conectar com GitHub:**
   ```powershell
   .\conectar-github.ps1
   ```

3. **Deploy na Vercel:**
   - Acesse: https://vercel.com/new
   - Importe o repositório `maria90anos`
   - Configure as variáveis de ambiente
   - Clique em "Deploy"

### Uso Diário (Fazer alterações)

Sempre que modificar o código:

```powershell
.\commit-rapido.ps1
```

Ou manualmente:

```powershell
git add .
git commit -m "sua mensagem aqui"
git push
```

## 📋 Comandos Úteis

```powershell
# Ver status
git status

# Ver histórico
git log --oneline

# Executar localmente
npm run dev

# Testar build
npm run build
```

## 🔐 Variáveis de Ambiente

Configure na Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📖 Documentação Completa

Consulte `GUIA-VERCEL-COMPLETO.md` para instruções detalhadas.

## 🛠️ Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Framer Motion

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Git](https://git-scm.com/doc)

---

**Desenvolvido com ❤️ para Maria Costa**
