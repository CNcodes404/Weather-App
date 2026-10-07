# Builds the app and zips it with the Lambda handler -> lambda/skymind-lambda.zip
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$stage = Join-Path $PSScriptRoot 'build'
$zip = Join-Path $PSScriptRoot 'skymind-lambda.zip'

Push-Location $root
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'npm run build failed' }
Pop-Location

if (Test-Path $stage) { Remove-Item -Recurse -Force $stage }
if (Test-Path $zip) { Remove-Item -Force $zip }
New-Item -ItemType Directory -Force $stage | Out-Null

Copy-Item (Join-Path $PSScriptRoot 'index.mjs') $stage
Copy-Item -Recurse (Join-Path $root 'dist') (Join-Path $stage 'dist')

# tar produces forward-slash paths, which Lambda (Linux) requires
Push-Location $stage
tar -a -c -f $zip index.mjs dist
Pop-Location

Remove-Item -Recurse -Force $stage
Write-Host "Created $zip"
