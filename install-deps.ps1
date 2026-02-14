# Requires PowerShell 5+
# Runs npm install to restore project dependencies.
param()

Write-Host "Installing npm dependencies..." -ForegroundColor Cyan

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "npm bulunamadi. Lutfen once Node.js kurun: https://nodejs.org/"
  exit 1
}

try {
  npm install
  Write-Host "Bagimliliklar basariyla yuklendi." -ForegroundColor Green
} catch {
  Write-Error "Bagimliliklar yuklenemedi. Ayrinti: $($_.Exception.Message)"
  exit 1
}
