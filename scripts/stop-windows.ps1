# Windows PowerShell script to stop Prelegal

Write-Host "🛑 Stopping Prelegal services..."

# Kill uvicorn process
Get-Process | Where-Object {$_.ProcessName -like "*python*" -and $_.CommandLine -like "*uvicorn*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Kill npm process
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "👋 Prelegal services stopped"
