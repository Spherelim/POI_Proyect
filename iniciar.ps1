# ============================================================
#  iniciar.ps1 — Script de inicio del proyecto
#  Ejecutar desde la raíz del proyecto:
#  .\iniciar.ps1
# ============================================================

$ProyectoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ServerDir   = Join-Path $ProyectoDir "server"
$EnvFile     = Join-Path $ServerDir ".env"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Iniciando proyecto..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ── 1. MySQL ─────────────────────────────────────────────────
Write-Host ""
Write-Host "[1/4] Verificando MySQL..." -ForegroundColor Yellow
$mysql = Get-Service -Name "mysql" -ErrorAction SilentlyContinue
if ($mysql.Status -ne "Running") {
    Write-Host "      Iniciando servicio MySQL..." -ForegroundColor Yellow
    Start-Service -Name "mysql"
    Start-Sleep 2
    Write-Host "      MySQL iniciado." -ForegroundColor Green
} else {
    Write-Host "      MySQL ya esta corriendo." -ForegroundColor Green
}

# ── 2. Liberar puerto 3000 ───────────────────────────────────
Write-Host ""
Write-Host "[2/4] Liberando puerto 3000..." -ForegroundColor Yellow
$proc = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($proc) {
    Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "      Puerto 3000 liberado." -ForegroundColor Green
} else {
    Write-Host "      Puerto 3000 disponible." -ForegroundColor Green
}
Start-Sleep 1

# ── 3. Cloudflare Tunnel ─────────────────────────────────────
Write-Host ""
Write-Host "[3/4] Iniciando Cloudflare Tunnel..." -ForegroundColor Yellow
$cfExe = Join-Path $ProyectoDir "cloudflared.exe"
# cloudflared escribe en stderr, no en stdout
$cfLogFile = "$ProyectoDir\cf-output.txt"
if (Test-Path $cfLogFile) { Remove-Item $cfLogFile -Force }

$cfJob = Start-Process -FilePath $cfExe `
    -ArgumentList "tunnel --url http://localhost:3000" `
    -PassThru `
    -RedirectStandardError $cfLogFile `
    -WindowStyle Hidden

Write-Host "      Esperando URL del tunel (15s)..." -ForegroundColor Yellow
Start-Sleep 15

# Extraer la URL del log de cloudflared
$cfUrl = ""
$timeout = 30
$elapsed = 0
while ($cfUrl -eq "" -and $elapsed -lt $timeout) {
    if (Test-Path "$ProyectoDir\cf-output.txt") {
        $content = Get-Content "$ProyectoDir\cf-output.txt" -Raw -ErrorAction SilentlyContinue
        if ($content -match "https://[a-z0-9\-]+\.trycloudflare\.com") {
            $cfUrl = $Matches[0]
        }
    }
    if ($cfUrl -eq "") { Start-Sleep 2; $elapsed += 2 }
}

if ($cfUrl -ne "") {
    Write-Host "      Tunel activo: $cfUrl" -ForegroundColor Green
    
    # Actualizar PUBLIC_URL en .env automáticamente
    $envContent = Get-Content $EnvFile -Raw
    $envContent = $envContent -replace "PUBLIC_URL=.*", "PUBLIC_URL=$cfUrl"
    Set-Content $EnvFile $envContent -NoNewline
    Write-Host "      .env actualizado con la nueva URL." -ForegroundColor Green
} else {
    Write-Host "      No se pudo obtener la URL del tunel. Revisa cf-output.txt" -ForegroundColor Red
}

# ── 4. Servidor Node ─────────────────────────────────────────
Write-Host ""
Write-Host "[4/4] Iniciando servidor Node.js..." -ForegroundColor Yellow
Set-Location $ServerDir
Start-Process -FilePath "node" -ArgumentList "server.js" `
    -WorkingDirectory $ServerDir `
    -WindowStyle Normal

Start-Sleep 3
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($cfUrl -ne "") {
    Write-Host "   Proyecto listo!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   URL publica:" -ForegroundColor White
    Write-Host "   $cfUrl" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Comparte esa URL con otros dispositivos." -ForegroundColor White
} else {
    Write-Host "   Servidor iniciado en localhost:3000" -ForegroundColor Green
    Write-Host "   (Revisa la URL del tunel manualmente)" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
