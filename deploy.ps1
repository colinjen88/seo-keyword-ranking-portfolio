# deploy.ps1
$ErrorActionPreference = "Stop"

# 1. 讀取設定檔
$ConfigPath = Join-Path $PSScriptRoot "config.json"
if (-not (Test-Path $ConfigPath)) {
    Write-Error "Config not found (config.json)"
    exit 1
}
$Config = Get-Content $ConfigPath -Encoding UTF8 -Raw | ConvertFrom-Json

# 2. 建構 (Build) - Static site, skipping build
# if ($args -notcontains "-no-build") { ... }

# 3. 部署 (Deploy)
$RemoteUser = $Config.remote.user
$RemoteHost = $Config.remote.host
$RemoteDir  = $Config.remote.dir
$DeployFiles = $Config.deploy.files

Write-Host "Target: $RemoteUser@$RemoteHost" -ForegroundColor Cyan
Write-Host "Dest Dir: $RemoteDir" -ForegroundColor Cyan

# Create remote directory if it doesn't exist (optional but good practice)
# ssh $RemoteUser@$RemoteHost "mkdir -p $RemoteDir"

foreach ($Item in $DeployFiles) {
    $LocalPath = Join-Path $PSScriptRoot $Item
    
    if (Test-Path $LocalPath) {
        Write-Host "Uploading: $Item -> $RemoteDir" -ForegroundColor Yellow
        scp -r "$LocalPath" "$RemoteUser@$RemoteHost`:$RemoteDir"
    } else {
        Write-Warning "Local file not found: $LocalPath"
    }
}

Write-Host "Deployment Complete!" -ForegroundColor Green
