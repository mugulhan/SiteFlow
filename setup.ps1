# Requires PowerShell 5+
# Sets up the SitemapFlow project by installing dependencies and preparing local data storage.
[CmdletBinding()]
param(
  [switch]$SkipNpmInstall,
  [switch]$ForceDataReset
)

$ErrorActionPreference = "Stop"

function Write-Info {
  param([string]$Message)
  Write-Host $Message -ForegroundColor Cyan
}

function Write-Success {
  param([string]$Message)
  Write-Host $Message -ForegroundColor Green
}

function Write-WarningMessage {
  param([string]$Message)
  Write-Host $Message -ForegroundColor Yellow
}

function Ensure-Command {
  param(
    [string]$Command,
    [string]$InstallHint
  )

  if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
    throw "$Command bulunamadi. $InstallHint"
  }
}

function Get-NormalizedVersion {
  param([string]$Raw)

  if (-not $Raw) {
    return [version]"0.0.0"
  }

  $clean = $Raw.TrimStart("v", "V")
  try {
    return [version]$clean
  } catch {
    throw "Versiyon numarasi okunamadi: $Raw"
  }
}

function Ensure-Node {
  $minVersion = [version]"18.0.0"
  Ensure-Command -Command "node" -InstallHint "Lutfen Node.js 18 veya uzeri surumu kurun: https://nodejs.org/"

  $rawVersion = node --version
  $current = Get-NormalizedVersion $rawVersion

  if ($current -lt $minVersion) {
    throw "Node.js surumu yetersiz ($current). Lutfen en az $minVersion surumunu kurun: https://nodejs.org/"
  }

  Write-Info "Node.js versiyonu uygun: $current"
}

function Run-NpmInstall {
  Ensure-Command -Command "npm" -InstallHint "npm bulunamadi. Node.js kuruldugunda otomatik gelir: https://nodejs.org/"

  Write-Info "npm install calistiriliyor..."
  npm install
  Write-Success "npm bagimliliklari yuklendi."
}

function Ensure-DataStore {
  $dataDir = Join-Path $PSScriptRoot "data"
  $dataFile = Join-Path $dataDir "sitemaps.json"

  if (-not (Test-Path $dataDir)) {
    Write-Info "data klasoru olusturuluyor..."
    New-Item -ItemType Directory -Path $dataDir | Out-Null
  }

  if (-not (Test-Path $dataFile) -or $ForceDataReset.IsPresent) {
    if ($ForceDataReset) {
      Write-WarningMessage "Var olan sitemaps.json dosyasi varsayilan degerlerle yeniden yazilacak."
    } else {
      Write-Info "Varsayilan sitemap verisi olusturuluyor..."
    }

    $defaults = @(
      @{
        title = "Acibadem - Genel Sitemap"
        url = "https://www.acibadem.com.tr/sitemap.xml"
        tags = @()
      },
      @{
        title = "Memorial - Saglik Rehberi"
        url = "https://www.memorial.com.tr/sitemaps/sitemaps-details/tr-saglik-rehberi.xml"
        tags = @()
      }
    ) | ConvertTo-Json -Depth 3

    $defaults | Out-File -FilePath $dataFile -Encoding utf8
    Write-Success "sitemaps.json varsayilan verilerle hazirlandi."
  } else {
    Write-Info "sitemaps.json dosyasi zaten mevcut, duyulmadi."
  }
}

Write-Info "SitemapFlow kurulum betigi basladi."

Ensure-Node

if (-not $SkipNpmInstall) {
  Run-NpmInstall
} else {
  Write-WarningMessage "npm install adimi atlandi."
}

Ensure-DataStore

Write-Success "Kurulum tamamlandi. Sunucuyu baslatmak icin: npm start"
