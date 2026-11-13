<#
.SYNOPSIS
    Automated Baseline Enforcement & Habit Tracker Runner for Antigravity Projects.
.DESCRIPTION
    Executes baseline_tracker.py to scan conversation transcripts, discover user habits,
    synthesize updated baseline rules, and distribute baseline assets across all projects.
.EXAMPLE
    .\Invoke-BaselineAutomation.ps1
.EXAMPLE
    .\Invoke-BaselineAutomation.ps1 -SyncAssets
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter()]
    [switch]$SyncAssets = $true,

    [Parameter()]
    [string]$PythonExecutable = "python"
)

begin {
    $ErrorActionPreference = 'Stop'
    $ScriptDir = $PSScriptRoot
    $TrackerScript = Join-Path -Path $ScriptDir -ChildPath "baseline_tracker.py"
    $DeploySyncScript = Join-Path -Path (Split-Path $ScriptDir -Parent) -ChildPath "deploy\Sync-StillCosmicAndLacquer.ps1"
    $RegistryFile = Join-Path -Path $ScriptDir -ChildPath "habits_registry.json"

    Write-Verbose "Initializing Antigravity Baseline Automation Pipeline..."
}

process {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

    # Step 1: Run Python Habit Tracker & Baseline Synthesizer
    Write-Host "[1/3] Scanning Antigravity transcripts and tracking user habits..." -ForegroundColor Cyan
    try {
        if (-not (Test-Path -LiteralPath $TrackerScript)) {
            throw [System.IO.FileNotFoundException]::new("Tracker script not found: $TrackerScript")
        }

        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = $PythonExecutable
        $processInfo.Arguments = "`"$TrackerScript`""
        $processInfo.WorkingDirectory = $ScriptDir
        $processInfo.RedirectStandardOutput = $true
        $processInfo.RedirectStandardError = $true
        $processInfo.UseShellExecute = $false
        $processInfo.StandardOutputEncoding = [System.Text.Encoding]::UTF8

        $process = [System.Diagnostics.Process]::Start($processInfo)
        $stdout = $process.StandardOutput.ReadToEnd()
        $stderr = $process.StandardError.ReadToEnd()
        $process.WaitForExit()

        if ($process.ExitCode -ne 0) {
            throw [System.InvalidOperationException]::new("baseline_tracker.py failed: $stderr")
        }

        Write-Host $stdout -ForegroundColor DarkGray
        Write-Host "Baseline tracker execution succeeded." -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to execute baseline tracker: $_"
        return
    }

    # Step 2: Synchronize Baseline Assets across Projects
    if ($SyncAssets) {
        Write-Host "`n[2/3] Synchronizing High-Gloss Lacquer, Cosmic Engine & MCP Baseline..." -ForegroundColor Cyan
        if (Test-Path -LiteralPath $DeploySyncScript) {
            try {
                & $DeploySyncScript
                Write-Host "All project targets synchronized with latest baseline standard." -ForegroundColor Green
            } catch {
                Write-Warning "Asset synchronization encountered non-terminating warning: $_"
            }
        } else {
            Write-Warning "Deploy synchronization script not found at $DeploySyncScript"
        }
    }

    # Step 3: Parse and stream telemetry report
    Write-Host "`n[3/3] Emitting Telemetry Summary..." -ForegroundColor Cyan
    $telemetry = $null
    if (Test-Path -LiteralPath $RegistryFile) {
        try {
            $rawJson = Get-Content -Raw -Path $RegistryFile -Encoding UTF8 | ConvertFrom-Json
            $telemetry = [PSCustomObject]@{
                Timestamp            = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                TotalAnalyzed        = $rawJson.total_requests_analyzed
                AutomatedBaselines   = $rawJson.automated_baselines_count
                TopHabit             = if ($rawJson.active_baselines.Count -gt 0) { $rawJson.active_baselines[0].title } else { "N/A" }
                TopHabitCount        = if ($rawJson.active_baselines.Count -gt 0) { $rawJson.active_baselines[0].frequency_count } else { 0 }
                DurationSeconds      = [math]::Round($stopwatch.Elapsed.TotalSeconds, 2)
                Status               = "Active & Enforced"
            }
        } catch {
            Write-Warning "Could not read habits_registry.json: $_"
        }
    }

    $stopwatch.Stop()
    if ($null -ne $telemetry) {
        return $telemetry
    }
}

end {
    Write-Verbose "Antigravity Baseline Automation Pipeline completed."
}
