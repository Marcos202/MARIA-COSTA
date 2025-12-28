# Script de Deploy para Vercel
# Execute este script para fazer deploy do projeto

Write-Host "🚀 Preparando deploy para Vercel..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está em um repositório Git
if (-not (Test-Path .git)) {
    Write-Host "⚠️  Repositório Git não encontrado!" -ForegroundColor Yellow
    Write-Host ""
    $initGit = Read-Host "Deseja inicializar um repositório Git? (s/n)"
    
    if ($initGit -eq "s") {
        Write-Host "📦 Inicializando Git..." -ForegroundColor Green
        git init
        git add .
        git commit -m "feat: preparar projeto para deploy na Vercel"
        Write-Host "✅ Git inicializado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Deploy cancelado. Inicialize o Git primeiro." -ForegroundColor Red
        exit
    }
}

# Verificar se há mudanças não commitadas
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Há mudanças não commitadas!" -ForegroundColor Yellow
    Write-Host ""
    $commit = Read-Host "Deseja fazer commit das mudanças? (s/n)"
    
    if ($commit -eq "s") {
        git add .
        $message = Read-Host "Mensagem do commit"
        git commit -m "$message"
        Write-Host "✅ Commit realizado!" -ForegroundColor Green
    }
}

# Testar build
Write-Host ""
Write-Host "🔨 Testando build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build bem-sucedido!" -ForegroundColor Green
} else {
    Write-Host "❌ Build falhou! Corrija os erros antes de fazer deploy." -ForegroundColor Red
    exit
}

# Verificar se Vercel CLI está instalado
Write-Host ""
Write-Host "🔍 Verificando Vercel CLI..." -ForegroundColor Cyan

$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI não encontrado!" -ForegroundColor Yellow
    Write-Host ""
    $installVercel = Read-Host "Deseja instalar Vercel CLI? (s/n)"
    
    if ($installVercel -eq "s") {
        Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Green
        npm i -g vercel
    } else {
        Write-Host ""
        Write-Host "📝 Instruções alternativas:" -ForegroundColor Yellow
        Write-Host "1. Acesse https://vercel.com" -ForegroundColor White
        Write-Host "2. Faça login com GitHub" -ForegroundColor White
        Write-Host "3. Clique em 'Add New...' → 'Project'" -ForegroundColor White
        Write-Host "4. Importe seu repositório" -ForegroundColor White
        Write-Host "5. Configure as variáveis de ambiente" -ForegroundColor White
        Write-Host "6. Clique em 'Deploy'" -ForegroundColor White
        exit
    }
}

# Deploy
Write-Host ""
Write-Host "🚀 Iniciando deploy..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Configure as variáveis de ambiente na Vercel:" -ForegroundColor Yellow
Write-Host "   - VITE_SUPABASE_URL" -ForegroundColor White
Write-Host "   - VITE_SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host ""

$deploy = Read-Host "Continuar com deploy? (s/n)"

if ($deploy -eq "s") {
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Deploy concluído com sucesso! 🎉" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
        Write-Host "1. Acesse o dashboard da Vercel" -ForegroundColor White
        Write-Host "2. Configure as variáveis de ambiente" -ForegroundColor White
        Write-Host "3. Faça um novo deploy se necessário" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Deploy falhou!" -ForegroundColor Red
        Write-Host "Verifique os logs acima para mais detalhes." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Deploy cancelado." -ForegroundColor Red
}
