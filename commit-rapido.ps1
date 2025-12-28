# Script para fazer commit e push de forma fácil
# Use este script sempre que fizer alterações no código

Write-Host "📝 Script de Commit Rápido" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

# Verificar se há alterações
$status = git status --porcelain

if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ Não há alterações para commitar!" -ForegroundColor Green
    Write-Host "Seu código já está atualizado no GitHub." -ForegroundColor White
    exit 0
}

Write-Host "📋 Arquivos modificados:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Solicitar mensagem de commit
Write-Host "💬 Digite a mensagem do commit:" -ForegroundColor Cyan
Write-Host "Exemplos:" -ForegroundColor Gray
Write-Host "  - feat: adicionar nova funcionalidade" -ForegroundColor Gray
Write-Host "  - fix: corrigir bug no formulário" -ForegroundColor Gray
Write-Host "  - style: melhorar design da página" -ForegroundColor Gray
Write-Host ""

$message = Read-Host "Mensagem"

if ([string]::IsNullOrWhiteSpace($message)) {
    Write-Host "❌ Mensagem não pode estar vazia!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔄 Processando..." -ForegroundColor Green

# Adicionar todos os arquivos
Write-Host "1/3 Adicionando arquivos..." -ForegroundColor White
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao adicionar arquivos" -ForegroundColor Red
    exit 1
}

# Fazer commit
Write-Host "2/3 Fazendo commit..." -ForegroundColor White
git commit -m $message

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer commit" -ForegroundColor Red
    exit 1
}

# Fazer push
Write-Host "3/3 Enviando para GitHub..." -ForegroundColor White
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Alterações enviadas com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 A Vercel irá fazer o deploy automaticamente em alguns minutos." -ForegroundColor Cyan
    Write-Host "Acesse https://vercel.com/dashboard para acompanhar." -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Tente:" -ForegroundColor Yellow
    Write-Host "git pull origin main" -ForegroundColor White
    Write-Host "git push origin main" -ForegroundColor White
    exit 1
}
