#Requires -Version 5.1
<#
.SYNOPSIS
    Launches the 3D Wobbly Life Playroom Sandbox Studio.

.DESCRIPTION
    Initializes a lightweight local HTTP server serving the 3D Wobbly Playroom
    with ragdoll physics, articulated jellybean avatar, bouncy trampoline,
    ball pit, mega spiral slide, bowling alley, drivable wobbly kart,
    toy grab & throw mechanics, and pizza courier missions.

.EXAMPLE
    .\Start-WobblyPlayroom.ps1
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter()]
    [int]$Port = 8096,

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
            $listener.Dispose()
        }
    }
}

# Auto-increment to an available port if default is bound
$SelectedPort = $Port
while (-not (Test-PortAvailable -TestPort $SelectedPort) -and $SelectedPort -lt ($Port + 50)) {
    $SelectedPort++
}

$Url = "http://localhost:$SelectedPort/index.html"

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  🎪 LAUNCHING 3D WOBBLY LIFE PLAYROOM SANDBOX STUDIO" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  Port       : $SelectedPort" -ForegroundColor Cyan
Write-Host "  URL        : $Url" -ForegroundColor Green
Write-Host "  Physics    : Ragdoll Bean + Trampoline + Ball Pit + Drivable Kart" -ForegroundColor DarkGray
Write-Host "  Controls   : WASD + Space (Jump) + Shift (Sprint) + G/F (Grab/Throw) + R (Flop)" -ForegroundColor DarkGray
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host ""

if (-not $NoBrowser) {
    Start-Process $Url
}

# Simple synchronous HTTP listener for local asset serving
$Listener = [System.Net.HttpListener]::new()
$Prefix = "http://localhost:$SelectedPort/"
$Listener.Prefixes.Add($Prefix)

try {
    $Listener.Start()
    Write-Host "Server running. Press Ctrl+C in terminal to stop." -ForegroundColor Gray

    while ($Listener.IsListening) {
        $context = $Listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relPath)) {
            $relPath = "index.html"
        }

        # Resolve local disk path safely
        $filePath = Join-Path $ScriptDir $relPath

        if (Test-Path -Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".ogg"  { "audio/ogg" }
                ".mp3"  { "audio/mpeg" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
        }
        else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - Asset not found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            $response.OutputStream.Close()
        }
    }
}
catch {
    if ($_.Exception -isnot [System.Net.HttpListenerException]) {
        Write-Warning "Server stopped: $($_.Exception.Message)"
    }
}
finally {
    if ($Listener.IsListening) {
        $Listener.Stop()
    }
    $Listener.Close()
}
