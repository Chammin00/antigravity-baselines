#Requires -Version 5.1
<#
.SYNOPSIS
    Launches the Antigravity Centralized 3D Learning Hall Studio.

.DESCRIPTION
    Initializes a lightweight local HTTP server serving the 3D exhibition
    corridor with 1K PBR textures, floating holographic telemetry banners, and CramExam drills,
    and opens the studio in your default browser.

.EXAMPLE
    .\Start-LearningHall.ps1
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter()]
    [int]$Port = 8090,

    [Parameter()]
    [switch]$NoBrowser
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Set-Location Path Baseline
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
Set-Location -Path $ScriptDir
$ManifestPath = Join-Path $ScriptDir "learning_manifest.json"

function Test-PortAvailable {
    param([int]$TestPort)
    $listener = $null
    try {
        $ip = [System.Net.IPAddress]::Loopback
        $listener = [System.Net.Sockets.TcpListener]::new($ip, $TestPort)
        $listener.Start()
        $listener.Stop()
        return $true
    }
    catch {
        return $false
    }
    finally {
        if ($null -ne $listener) {
            try { $listener.Stop() } catch { }
        }
    }
}

$chosenPort = $Port
while (-not (Test-PortAvailable -TestPort $chosenPort)) {
    Write-Verbose "Port $chosenPort occupied, testing $($chosenPort + 1)..."
    $chosenPort++
    if ($chosenPort -gt $Port + 50) {
        throw "Could not bind an available HTTP port between $Port and $chosenPort."
    }
}

$Prefix = "http://localhost:$chosenPort/"
$httpListener = [System.Net.HttpListener]::new()
$httpListener.Prefixes.Add($Prefix)
$httpListener.Start()

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   ANTIGRAVITY CENTRALIZED 3D LEARNING HALL STUDIO" -ForegroundColor Yellow
Write-Host "   Modeled on CramExam (@cramexam) High-Yield Architecture" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Corridor Assets: 1K Herringbone Parquet PBR & Poly Haven Plaster" -ForegroundColor DarkGray
$manifestObj = if (Test-Path $ManifestPath) { Get-Content $ManifestPath -Raw | ConvertFrom-Json } else { $null }
$subjCount = if ($manifestObj) { $manifestObj.totalSubjects } else { "65" }
Write-Host "Subjects: $subjCount Exhibits with Memory Palace Traversal & Floating Holograms" -ForegroundColor DarkGray
Write-Host "`n[OK] 3D Learning Hall HTTP Server listening at: $Prefix`index.html" -ForegroundColor Green

if (-not $NoBrowser) {
    Write-Host "[->] Opening default browser..." -ForegroundColor Cyan
    Start-Process "$Prefix`index.html"
}

Write-Host "`nPress Ctrl+C to terminate the studio server.`n" -ForegroundColor DarkGray

$mimeMap = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".svg"   = "image/svg+xml"
    ".wav"   = "audio/wav"
    ".mp3"   = "audio/mpeg"
    ".ogg"   = "audio/ogg"
    ".woff2" = "font/woff2"
    ".txt"   = "text/plain; charset=utf-8"
}

try {
    while ($httpListener.IsListening) {
        $context = $httpListener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $localPath = $request.Url.LocalPath
        if ([string]::IsNullOrWhiteSpace($localPath) -or $localPath -eq "/") {
            $localPath = "/index.html"
        }

        $relFile = $localPath.TrimStart('/').Replace('/', '\')
        $safePath = Join-Path -Path $ScriptDir -ChildPath $relFile

        if (Test-Path -Path $safePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($safePath).ToLowerInvariant()
            $contentType = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($safePath)

            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }

        $response.Close()
    }
}
finally {
    if ($null -ne $httpListener -and $httpListener.IsListening) {
        $httpListener.Stop()
        $httpListener.Close()
    }
    Write-Host "`n[OK] 3D Learning Hall Studio server stopped cleanly." -ForegroundColor Yellow
}
