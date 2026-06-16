# Zynctra Backend Health Check Script (PowerShell)
# Run from backend directory: .\health-check.ps1

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     ZYNCTRA BACKEND - HEALTH CHECK SCRIPT                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to check service
function Check-Service {
    param(
        [int]$Port,
        [string]$ServiceName
    )
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port/actuator/health" -ErrorAction Stop -TimeoutSec 5
        Write-Host "✅ $ServiceName" -ForegroundColor Green -NoNewline
        Write-Host " (Port $Port)"
        return $true
    } catch {
        Write-Host "❌ $ServiceName" -ForegroundColor Red -NoNewline
        Write-Host " (Port $Port)"
        return $false
    }
}

# Function to check docker container
function Check-Container {
    param([string]$ContainerName)
    
    $container = docker ps --filter "name=$ContainerName" --format "{{.Names}}" 2>$null
    
    if ($container -eq $ContainerName) {
        Write-Host "✅ Docker container: $ContainerName" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Docker container: $ContainerName" -ForegroundColor Red
        return $false
    }
}

Write-Host "🐳 DOCKER CONTAINERS:" -ForegroundColor Yellow
Check-Container "zynctra-postgres-auth"
Check-Container "zynctra-redis"
Check-Container "zynctra-rabbitmq"
Write-Host ""

Write-Host "🔧 BACKEND SERVICES:" -ForegroundColor Yellow
Check-Service 8000 "API Gateway"
Check-Service 8001 "Auth Service"
Check-Service 8002 "Core HR Service"
Check-Service 8003 "Payroll Service"
Check-Service 8004 "ATS Service"
Check-Service 8005 "Time & Attendance Service"
Check-Service 8006 "Analytics Service"
Check-Service 8007 "Performance Service"
Check-Service 8008 "Learning Service"
Check-Service 8009 "Security Admin Service"
Check-Service 8010 "Connector Service"
Check-Service 8086 "Benefits Service"
Write-Host ""

Write-Host "🧠 AI SERVICES (Optional):" -ForegroundColor Yellow
if (-not (Check-Service 5001 "Analytics AI Service")) {
    Write-Host "⏭  Analytics AI (not running - optional)" -ForegroundColor Gray
}
if (-not (Check-Service 5002 "Anomaly Detector")) {
    Write-Host "⏭  Anomaly Detector (not running - optional)" -ForegroundColor Gray
}
if (-not (Check-Service 5003 "NLP Assistant")) {
    Write-Host "⏭  NLP Assistant (not running - optional)" -ForegroundColor Gray
}
Write-Host ""

Write-Host "🔗 CONNECTORS (Optional):" -ForegroundColor Yellow
if (-not (Check-Service 8080 "Connectors Service")) {
    Write-Host "⏭  Connectors (not running - optional)" -ForegroundColor Gray
}
Write-Host ""

Write-Host "💾 DATABASE CONNECTIVITY:" -ForegroundColor Yellow
try {
    docker exec zynctra-postgres-auth pg_isready -U postgres 2>$null | Out-Null
    Write-Host "✅ PostgreSQL (Auth)" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL (Auth)" -ForegroundColor Red
}

try {
    docker exec zynctra-redis redis-cli -a zynctra-redis-password-change-in-prod ping 2>$null | Out-Null
    Write-Host "✅ Redis" -ForegroundColor Green
} catch {
    Write-Host "❌ Redis" -ForegroundColor Red
}

try {
    docker exec zynctra-rabbitmq rabbitmq-diagnostics -q ping 2>$null | Out-Null
    Write-Host "✅ RabbitMQ" -ForegroundColor Green
} catch {
    Write-Host "❌ RabbitMQ" -ForegroundColor Red
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║ Health check complete!                                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
