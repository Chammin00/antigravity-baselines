#Requires -Version 5.1
<#
.SYNOPSIS
    Launches the 3D Grade School Learning Hall Studio.

.DESCRIPTION
    Initializes a lightweight local HTTP server serving the 3D Grade School
    Learning Hall with 1K PBR textures, articulated 3D student avatar,
    dual 1st/3rd person view cameras, 7 core subjects, and playable
    typing, ChanceInvaders, and junior chess games.

.EXAMPLE
    .\Start-GradeSchoolHall.ps1
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter()]
    [int]$Port = 8095,

    [Parameter()]
    [switch]$NoBrowser
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Set-Location Path Baseline
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
Set-Location -Path $ScriptDir

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

$url = "http://localhost:$chosenPort/"
Write-Host ""
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  3D GRADE SCHOOL LEARNING HALL: 1ST GRADE FLAGSHIP ACADEMY" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  Directory:  $ScriptDir" -ForegroundColor DarkGray
Write-Host "  URL:        $url" -ForegroundColor Green
Write-Host "  Camera:     1st & 3rd Person Traversal (Hotkeys: V, 1, 3)" -ForegroundColor DarkCyan
Write-Host "  Games:      Typing Academy, ChanceInvaders 1978, Junior Chess" -ForegroundColor DarkCyan
Write-Host "  Subjects:   7 Core Subjects + Frankie Voiced Companion" -ForegroundColor DarkCyan
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to terminate the local server." -ForegroundColor DarkGray
Write-Host ""

$mimeMap = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.png'  = 'image/png'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.ogg'  = 'audio/ogg'
    '.mp3'  = 'audio/mpeg'
    '.wav'  = 'audio/wav'
}

$httpListener = [System.Net.HttpListener]::new()
$httpListener.Prefixes.Add("http://localhost:$chosenPort/")

try {
    $httpListener.Start()
}
catch {
    throw "Failed to start HttpListener on port $chosenPort`: $_"
}

if (-not $NoBrowser) {
    Start-Process $url
}

try {
    while ($httpListener.IsListening) {
        $context = $httpListener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $firstGradeHubDir = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($ScriptDir, '..', '..', '1st grade learning'))
        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq '/' -or [string]::IsNullOrWhiteSpace($rawUrl)) {
            $rawUrl = '/index.html'
        }

        $localFilePath = $null
        if ($rawUrl.StartsWith('/1st-grade-learning/', [System.StringComparison]::OrdinalIgnoreCase) -or $rawUrl.StartsWith('/first-grade-hub/', [System.StringComparison]::OrdinalIgnoreCase)) {
            $subPath = $rawUrl.Substring($rawUrl.IndexOf('/', 1) + 1).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            if ([string]::IsNullOrWhiteSpace($subPath)) { $subPath = 'index.html' }
            $candidatePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($firstGradeHubDir, $subPath))
            if ($candidatePath.StartsWith($firstGradeHubDir, [System.StringComparison]::OrdinalIgnoreCase)) {
                $localFilePath = $candidatePath
            }
        } else {
            $relativePath = $rawUrl.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $candidatePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($ScriptDir, $relativePath))
            if ($candidatePath.StartsWith($ScriptDir, [System.StringComparison]::OrdinalIgnoreCase)) {
                $localFilePath = $candidatePath
            }
        }

        # Security sandbox containment
        if ($null -eq $localFilePath) {
            $response.StatusCode = 403
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ([System.IO.File]::Exists($localFilePath)) {
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLowerInvariant()
            $contentType = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { 'application/octet-stream' }
            $response.ContentType = $contentType
            $response.StatusCode = 200

            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.AddHeader("Access-Control-Allow-Origin", "*")

            try {
                $fileBytes = [System.IO.File]::ReadAllBytes($localFilePath)
                $response.ContentLength64 = $fileBytes.Length
                $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
            }
            catch {
                $response.StatusCode = 500
            }
        }
        else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawUrl")
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }

        $response.Close()
    }
}
finally {
    if ($httpListener.IsListening) {
        $httpListener.Stop()
    }
    $httpListener.Close()
}
