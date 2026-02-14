param(
  [string]$SeedDir = "$PSScriptRoot\\seed-xml",
  [string]$SeedUrlsPath = "$PSScriptRoot\\seed-urls.txt",
  [string]$SeedMappingPath = "$PSScriptRoot\\seed-mapping.json",
  [string]$CacheDir = "$PSScriptRoot\\data\\cache"
)

$ErrorActionPreference = "Stop"

function Get-UrlSha1([string]$Url) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($Url)
  $sha1 = [System.Security.Cryptography.SHA1]::Create()
  try {
    $hashBytes = $sha1.ComputeHash($bytes)
  } finally {
    $sha1.Dispose()
  }
  return -join ($hashBytes | ForEach-Object { $_.ToString("x2") })
}

function Get-CandidateFileNames([string]$Url) {
  $candidates = New-Object System.Collections.Generic.List[string]
  try {
    $uri = [Uri]$Url
    $pathName = [System.IO.Path]::GetFileName($uri.AbsolutePath)
    if ($pathName) {
      $candidates.Add($pathName)
    }
  } catch {
    # Ignore invalid URIs; will fall back to normalized name
  }

  $normalized = ($Url -replace "^https?://", "") -replace "[^a-zA-Z0-9]+", "-"
  $normalized = $normalized.Trim("-")
  if ($normalized) {
    $candidates.Add("$normalized.xml")
    $candidates.Add($normalized)
  }

  return $candidates | Select-Object -Unique
}

function Resolve-SeedFile([string]$Url, [hashtable]$Mapping, [string]$SeedDirPath) {
  if ($Mapping.ContainsKey($Url)) {
    $mapped = $Mapping[$Url]
    if ($mapped) {
      $mappedPath = Join-Path $SeedDirPath $mapped
      if (Test-Path $mappedPath) {
        return $mappedPath
      }
    }
  }

  foreach ($candidate in Get-CandidateFileNames $Url) {
    $candidatePath = Join-Path $SeedDirPath $candidate
    if (Test-Path $candidatePath) {
      return $candidatePath
    }
  }

  return $null
}

if (!(Test-Path $SeedUrlsPath)) {
  throw "seed-urls.txt bulunamadi: $SeedUrlsPath"
}

if (!(Test-Path $SeedDir)) {
  throw "Seed klasoru bulunamadi: $SeedDir"
}

if (!(Test-Path $CacheDir)) {
  New-Item -ItemType Directory -Path $CacheDir | Out-Null
}

$mapping = @{}
if (Test-Path $SeedMappingPath) {
  try {
    $rawMapping = Get-Content -Path $SeedMappingPath -Raw | ConvertFrom-Json
    if ($rawMapping -is [System.Collections.IDictionary]) {
      $mapping = @{}
      foreach ($key in $rawMapping.Keys) {
        $mapping[$key] = $rawMapping[$key]
      }
    }
  } catch {
    Write-Warning "seed-mapping.json okunamadi, es geciliyor: $SeedMappingPath"
  }
}

$urls = Get-Content -Path $SeedUrlsPath | ForEach-Object { $_.Trim() } |
  Where-Object { $_ -and -not $_.StartsWith("#") }

if (-not $urls) {
  throw "seed-urls.txt bos veya yalnizca yorum satiri iceriyor."
}

$seeded = 0
$missing = 0

foreach ($url in $urls) {
  $seedFile = Resolve-SeedFile -Url $url -Mapping $mapping -SeedDirPath $SeedDir
  if (-not $seedFile) {
    Write-Warning "Seed dosyasi bulunamadi: $url"
    $missing += 1
    continue
  }

  $hash = Get-UrlSha1 $url
  $xmlTarget = Join-Path $CacheDir "$hash.xml"
  $metaTarget = Join-Path $CacheDir "$hash.json"

  Copy-Item -Path $seedFile -Destination $xmlTarget -Force
  $length = (Get-Item -Path $xmlTarget).Length
  $meta = [ordered]@{
    url = $url
    fetchedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    statusCode = 200
    contentType = "application/xml; charset=utf-8"
    fetchMode = "manual"
    responseType = "xml"
    staleReason = ""
    bytes = $length
    etag = ""
    lastModified = ""
  }
  $meta | ConvertTo-Json | Set-Content -Path $metaTarget -Encoding UTF8
  Write-Host "Seeded: $url -> $xmlTarget"
  $seeded += 1
}

Write-Host "Tamamlandi. Seeded: $seeded, Missing: $missing"
