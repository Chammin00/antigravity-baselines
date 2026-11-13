<#
.SYNOPSIS
    Registers a Windows Scheduled Task for automated continuous baseline updates.
.DESCRIPTION
    Schedules Invoke-BaselineAutomation.ps1 to run daily at 12:30 AM (or every 6 hours)
    to parse newly archived conversations, synthesize emerging habits, and enforce baselines.
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter()]
    [string]$TaskName = "Antigravity-Baseline-AutoTracker",

    [Parameter()]
    [string]$ScheduleTime = "00:30"
)

$ErrorActionPreference = 'Stop'
$ScriptPath = Join-Path -Path $PSScriptRoot -ChildPath "Invoke-BaselineAutomation.ps1"

if (-not (Test-Path -LiteralPath $ScriptPath)) {
    throw [System.IO.FileNotFoundException]::new("Script not found: $ScriptPath")
}

Write-Host "Registering Scheduled Task: $TaskName..." -ForegroundColor Cyan

$action = New-ScheduledTaskAction `
    -Execute "pwsh.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`""

$trigger = New-ScheduledTaskTrigger -Daily -At $ScheduleTime

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -WakeToRun

if ($PSCmdlet.ShouldProcess($TaskName, "Register Scheduled Task")) {
    try {
        Register-ScheduledTask `
            -TaskName $TaskName `
            -Action $action `
            -Trigger $trigger `
            -Settings $settings `
            -Description "Automated Antigravity baseline habit tracker and enforcement daemon." `
            -Force | Out-Null
        Write-Host "✅ Scheduled Task '$TaskName' registered successfully to run daily at $ScheduleTime." -ForegroundColor Green
    } catch {
        Write-Warning "Could not register system scheduled task (may require administrator rights): $_"
        Write-Host "Fallback: Run .\Invoke-BaselineAutomation.ps1 directly or schedule via Antigravity /schedule." -ForegroundColor Yellow
    }
}
