# Windows PowerShell script to start Prelegal

Write-Host "🚀 Starting Prelegal (Windows)..."

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

Set-Location $ProjectDir

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..."
    python -m venv venv
}

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Install backend dependencies if needed
if (-not (Test-Path "backend\.deps_installed")) {
    Write-Host "📦 Installing backend dependencies..."
    pip install -q -r backend\requirements.txt
    New-Item -Path "backend" -Name ".deps_installed" -ItemType "File" | Out-Null
}

# Install frontend dependencies if needed
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "📦 Installing frontend dependencies..."
    Set-Location frontend
    npm install -q
    Set-Location ..
}

# Start backend in background
Write-Host "▶️  Starting FastAPI backend on http://localhost:8000..."
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn app.main:app --reload" -WorkingDirectory "backend"

# Give backend time to start
Start-Sleep -Seconds 2

# Start frontend
Write-Host "▶️  Starting Next.js frontend on http://localhost:3000..."
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "frontend"

Write-Host ""
Write-Host "✅ Both servers are running!"
Write-Host "   Backend:  http://localhost:8000"
Write-Host "   Frontend: http://localhost:3000"
Write-Host ""
Write-Host "To stop the servers, run: .\scripts\stop-windows.ps1"
Write-Host ""
