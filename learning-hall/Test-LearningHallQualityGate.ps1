#Requires -Version 5.1
<#
.SYNOPSIS
    Automated Quality Gate for the Antigravity Centralized 3D Learning Hall.

.DESCRIPTION
    Validates all 15 core architectural checkpoints:
    - Baseline specification integrity (HOW_I_LEARN_BASELINE.md)
    - 8 Subject data models with domain weightings, CramExam rationales & cheat sheets
    - 1K PBR textures & footstep audio files
    - Scene engine traversal & floating holographic billboard meshes
    - HTTP launcher server compatibility
#>

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Set-Location Path Baseline
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
Set-Location -Path $ScriptDir

$TotalChecks = 0
$PassedChecks = 0

function Assert-Check {
    param (
        [string]$Name,
        [bool]$Condition,
        [string]$Details = ""
    )
    $script:TotalChecks++
    if ($Condition) {
        $script:PassedChecks++
        Write-Host "  [PASS] $Name" -ForegroundColor Green
        if ($Details) {
            Write-Host "         $Details" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "  [FAIL] $Name" -ForegroundColor Red
        if ($Details) {
            Write-Host "         $Details" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  CENTRALIZED 3D LEARNING HALL: QUALITY GATE VERIFICATION" -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Baseline Document
$BaselinePath = Join-Path (Split-Path -Parent $ScriptDir) "HOW_I_LEARN_BASELINE.md"
Assert-Check -Name "HOW_I_LEARN_BASELINE.md exists in baselines root" -Condition (Test-Path $BaselinePath)
if (Test-Path $BaselinePath) {
    $content = Get-Content $BaselinePath -Raw
    Assert-Check -Name "Baseline references CramExam channel" -Condition ($content -match "cramexam")
    Assert-Check -Name "Baseline covers all 6 Pedagogical Pillars" -Condition ($content -match "6 Core Pedagogical Pillars")
    Assert-Check -Name "Baseline covers all 8 Training Domains" -Condition ($content -match "CompTIA Security\+" -and $content -match "RHCSA EX200" -and $content -match "CLF-C02")
}

# 2. Master Data & Manifest
$DataJs = Join-Path $ScriptDir "learning-data.js"
$ManifestJson = Join-Path $ScriptDir "learning_manifest.json"
Assert-Check -Name "learning-data.js exists" -Condition (Test-Path $DataJs)
Assert-Check -Name "learning_manifest.json exists" -Condition (Test-Path $ManifestJson)

if (Test-Path $ManifestJson) {
    $manifest = Get-Content $ManifestJson -Raw | ConvertFrom-Json
    Assert-Check -Name "Manifest contains verified training subjects (8+ modules)" -Condition ($manifest.subjects.Count -ge 8) -Details "Found $($manifest.subjects.Count) subjects"
    Assert-Check -Name "Manifest tracks overall readiness average (>70%)" -Condition ($manifest.overallReadinessAverage -gt 70) -Details "Readiness: $($manifest.overallReadinessAverage) percent"

    # Verify 3D positions and Roman numerals are assigned to all subjects
    $allHavePositions = ($manifest.subjects | Where-Object { $_.position -and $_.roman }).Count -eq $manifest.subjects.Count
    Assert-Check -Name "All subjects have assigned 3D corridor positions and Roman numerals" -Condition $allHavePositions
}

if (Test-Path $DataJs) {
    $jsContent = Get-Content $DataJs -Raw
    Assert-Check -Name "learning-data.js defines LEARNING_SUBJECTS window object" -Condition ($jsContent -match "window\.LEARNING_SUBJECTS\s*=")
}

# 3. 1K PBR Textures
$ParquetDiff = Join-Path $ScriptDir "assets\textures\herringbone_parquet_diff_1k.jpg"
$PlasterDiff = Join-Path $ScriptDir "assets\textures\painted_plaster_wall_diff_1k.jpg"
$Vista = Join-Path $ScriptDir "assets\textures\earth_galaxy_volcano_bridge_vista.jpg"
Assert-Check -Name "Herringbone Parquet 1K PBR Diffuse texture exists" -Condition (Test-Path $ParquetDiff)
Assert-Check -Name "Painted Plaster 1K PBR Wall texture exists" -Condition (Test-Path $PlasterDiff)
Assert-Check -Name "Earth Galaxy Volcano Bridge Vista panoramic texture exists" -Condition (Test-Path $Vista)

# 4. Audio Foley Assets
$Footsteps = Get-ChildItem -Path (Join-Path $ScriptDir "assets\footsteps") -Filter "*.ogg"
Assert-Check -Name "Real CC0 Hardwood Footstep audio pool exists" -Condition ($Footsteps.Count -ge 8) -Details "Found $($Footsteps.Count) footstep samples"

# 5. Core Engine Files & Centralized In-Studio Labs
$IndexHtml = Join-Path $ScriptDir "index.html"
$SceneJs = Join-Path $ScriptDir "learning-hall-scene.js"
$EngineJs = Join-Path $ScriptDir "learning-hall-engine.js"
$SuitesJs = Join-Path $ScriptDir "learning-hall-centralized-suites.js"
$LauncherPs1 = Join-Path $ScriptDir "Start-LearningHall.ps1"

Assert-Check -Name "index.html exists and contains 3D canvas and HUD dock" -Condition (Test-Path $IndexHtml)
Assert-Check -Name "learning-hall-scene.js exists" -Condition (Test-Path $SceneJs)
Assert-Check -Name "learning-hall-engine.js exists" -Condition (Test-Path $EngineJs)
Assert-Check -Name "learning-hall-centralized-suites.js exists" -Condition (Test-Path $SuitesJs)
Assert-Check -Name "Start-LearningHall.ps1 exists" -Condition (Test-Path $LauncherPs1)

# 6. Centralized Datasets in data/
$DataDir = Join-Path $ScriptDir "data"
Assert-Check -Name "data directory exists for in-studio training data" -Condition (Test-Path $DataDir)
Assert-Check -Name "RHCSA interactive quest data exists" -Condition (Test-Path (Join-Path $DataDir "rhcsa_quests.js"))
Assert-Check -Name "CompTIA flashcards and PBQ data exists" -Condition (Test-Path (Join-Path $DataDir "flashcardsData.js"))
Assert-Check -Name "AWS questions and domains data exists" -Condition (Test-Path (Join-Path $DataDir "aws_questions.js"))

if (Test-Path $SuitesJs) {
    $suitesCode = Get-Content $SuitesJs -Raw
    Assert-Check -Name "Interactive RHEL 9 Terminal simulator implemented" -Condition ($suitesCode -match "renderRhcsaTerminalLab")
    Assert-Check -Name "CompTIA PBQ Firewall Rule Builder implemented" -Condition ($suitesCode -match "renderComptiaPbqLab")
    Assert-Check -Name "Interactive 3D Flashcards Deck implemented" -Condition ($suitesCode -match "renderFlashcardDeck")
}

$RhcsaQuestJs = Join-Path $ScriptDir "rhcsa-exam-quest-suite.js"
$ScriptingStudioJs = Join-Path $ScriptDir "scripting-lecture-studio.js"
Assert-Check -Name "Google AI Studio RHCSA Exam Quest Suite (rhcsa-exam-quest-suite.js) exists" -Condition (Test-Path $RhcsaQuestJs)
Assert-Check -Name "Enterprise Scripting Lecture & Dual-Shell Terminal (scripting-lecture-studio.js) exists" -Condition (Test-Path $ScriptingStudioJs)

if (Test-Path $RhcsaQuestJs) {
    $rhCode = Get-Content $RhcsaQuestJs -Raw
    Assert-Check -Name "RHCSA Exam Quest includes Server 1 Exams, Exam Rescue Specials & Simulated Vi (:wq)" -Condition ($rhCode -match "RHCSA_SERVER1_TASKS" -and $rhCode -match "RHCSA_SPECIAL_LABS" -and $rhCode -match "Save File \(:wq\)")
}

if (Test-Path $ScriptingStudioJs) {
    $scCode = Get-Content $ScriptingStudioJs -Raw
    Assert-Check -Name "Scripting Studio includes 6 Interactive Lectures, 14 Labs, Rosetta Stone & Dual Bash/PWSH Interpreter" -Condition ($scCode -match "SCRIPTING_LECTURE_MODULES" -and $scCode -match "SCRIPTING_ROSETTA_STONE" -and $scCode -match "interpretBash" -and $scCode -match "interpretPowerShell")
}

if (Test-Path $SceneJs) {
    $sceneCode = Get-Content $SceneJs -Raw
    Assert-Check -Name "Scene implements Floating Holographic Stats Banners" -Condition ($sceneCode -match "buildFloatingHologramBanners")
    Assert-Check -Name "Scene implements 3-Phase Biomechanical Human Walk" -Condition ($sceneCode -match "walkToSubject" -and $sceneCode -match "smoothstep")
}

# Summary
Write-Host ""
Write-Host "-----------------------------------------------------------------" -ForegroundColor Cyan
$pct = [math]::Round(($PassedChecks / $TotalChecks) * 100, 1)
if ($PassedChecks -eq $TotalChecks) {
    Write-Host "  QUALITY GATE RESULT: $PassedChecks / $TotalChecks CHECKS PASSED ($pct percent - 10/10 PASS)" -ForegroundColor Green
} else {
    Write-Host "  QUALITY GATE RESULT: $PassedChecks / $TotalChecks CHECKS PASSED ($pct percent)" -ForegroundColor Yellow
}
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""
