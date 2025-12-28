# Script para conectar com GitHub e fazer push
# Execute este script após criar o repositório no GitHub

Write-Host "🚀 Script de Conexão com GitHub" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar nome de usuário do GitHub
$username = Read-Host "Digite seu nome de usuário do GitHub"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Nome de usuário não pode estar vazio!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Passos que serão executados:" -ForegroundColor Yellow
Write-Host "1. Adicionar repositório remoto: https://github.com/$username/maria90anos.git"
Write-Host "2. Verificar branch atual"
Write-Host "3. Fazer push para GitHub"
Write-Host ""

$confirm = Read-Host "Deseja continuar? (S/N)"

if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "❌ Operação cancelada pelo usuário" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🔗 Adicionando repositório remoto..." -ForegroundColor Green

# Remover origin se já existir (evitar erros)
git remote remove origin 2>$null

# Adicionar novo origin
$repoUrl = "https://github.com/$username/maria90anos.git"
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Repositório remoto adicionado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao adicionar repositório remoto" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📤 Enviando código para GitHub..." -ForegroundColor Green

# Fazer push
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Código enviado com sucesso para GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Acesse: https://vercel.com/new" -ForegroundColor White
    Write-Host "2. Faça login com sua conta GitHub" -ForegroundColor White
    Write-Host "3. Importe o repositório 'maria90anos'" -ForegroundColor White
    Write-Host "4. Configure as variáveis de ambiente (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)" -ForegroundColor White
    Write-Host "5. Clique em 'Deploy'" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Consulte o arquivo GUIA-VERCEL-COMPLETO.md para mais detalhes" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "1. Verifique se o repositório 'maria90anos' existe no GitHub" -ForegroundColor White
    Write-Host "2. Verifique se você tem permissão de escrita" -ForegroundColor White
    Write-Host "3. Tente fazer login: gh auth login" -ForegroundColor White
    exit 1
}
