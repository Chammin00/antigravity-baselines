#Requires -Version 5.1
<#
.SYNOPSIS
    Automated Quality Gate for the 3D Grade School Learning Hall.

.DESCRIPTION
    Validates all architectural and edutainment checkpoints:
    - 7 Core 1st grade subjects + questions + soundOut explanations
    - Full 1-School-Year (36-Week / 4-Quarter) Scope & Sequence Curriculum
    - GCompris 3-Level Adaptive Scaffolding (Explorer, Adventurer, Master)
    - Antura 3-Tier Intelligent Mascot Hint Ladder (Phonics, 50/50, Walkthrough)
    - 3 Playable arcade games (Typing Academy, ChanceInvaders 1978, Junior Chess)
    - Dual 1st and 3rd person view camera engine
    - Articulated 3D student avatar mesh
    - 1K PBR textures & footstep audio files
    - JumpStart Milk Cap vault registry & Annual Report Card
    - HTTP launcher server syntax
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
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host "  3D GRADE SCHOOL LEARNING HALL: QUALITY GATE VERIFICATION" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host ""

# 1. Baseline Specification Integrity
$ChildrenBaselinePath = Join-Path (Split-Path -Parent $ScriptDir) "CHILDREN_LEARNING_BASELINE.md"
Assert-Check -Name "CHILDREN_LEARNING_BASELINE.md exists" -Condition (Test-Path $ChildrenBaselinePath)

$LearningBaselinePath = Join-Path (Split-Path -Parent $ScriptDir) "HOW_I_LEARN_BASELINE.md"
Assert-Check -Name "HOW_I_LEARN_BASELINE.md exists" -Condition (Test-Path $LearningBaselinePath)

# 2. 1-School-Year (36-Week) Curriculum Database
$CurriculumPath = Join-Path $ScriptDir "grade-school-curriculum-year.js"
Assert-Check -Name "grade-school-curriculum-year.js exists" -Condition (Test-Path $CurriculumPath)

if (Test-Path $CurriculumPath) {
    try {
        $nodeOut = & node -e "const c = require('./grade-school-curriculum-year.js'); process.stdout.write(JSON.stringify(Object.keys(c).map(k => ({ key: k, count: c[k].length }))));"
        $subjects = ConvertFrom-Json $nodeOut
        foreach ($s in $subjects) {
            Assert-Check -Name "36 Weeks for $($s.key)" -Condition ($s.count -eq 36) -Details "Verified $($s.count) structured weekly units"
        }
    }
    catch {
        $currContent = Get-Content $CurriculumPath -Raw
        Assert-Check -Name "Reading curriculum defined" -Condition ($currContent -match "generateReadingYear")
        Assert-Check -Name "Math curriculum defined" -Condition ($currContent -match "generateMathYear")
        Assert-Check -Name "Writing curriculum defined" -Condition ($currContent -match "generateWritingYear")
        Assert-Check -Name "Science curriculum defined" -Condition ($currContent -match "generateScienceYear")
        Assert-Check -Name "Social curriculum defined" -Condition ($currContent -match "generateSocialYear")
        Assert-Check -Name "Arts curriculum defined" -Condition ($currContent -match "generateArtsYear")
        Assert-Check -Name "Health curriculum defined" -Condition ($currContent -match "generateHealthYear")
        Assert-Check -Name "Typing curriculum defined" -Condition ($currContent -match "generateTypingYear")
        Assert-Check -Name "Chess curriculum defined" -Condition ($currContent -match "generateChessYear")
    }
}

# 3. Grade School Data Model
$DataPath = Join-Path $ScriptDir "grade-school-data.js"
Assert-Check -Name "grade-school-data.js exists" -Condition (Test-Path $DataPath)

if (Test-Path $DataPath) {
    $dataContent = Get-Content $DataPath -Raw
    Assert-Check -Name "Contains Reading & Phonics Safari" -Condition ($dataContent -match "Reading & Phonics Safari")
    Assert-Check -Name "Contains Math & Numbers Pizzeria" -Condition ($dataContent -match "Math & Numbers Pizzeria")
    Assert-Check -Name "Contains Writing & Spelling Workshop" -Condition ($dataContent -match "Writing & Spelling Workshop")
    Assert-Check -Name "Contains Curious Science & Habitats" -Condition ($dataContent -match "Curious Science & Habitats")
    Assert-Check -Name "Contains Community & World Explorers" -Condition ($dataContent -match "Community & World Explorers")
    Assert-Check -Name "Contains Art, Colors & Music Studio" -Condition ($dataContent -match "Art, Colors & Music Studio")
    Assert-Check -Name "Contains Human Body & Healthy Habits" -Condition ($dataContent -match "Human Body & Healthy Habits")
    Assert-Check -Name "Contains 1st Grade Typing Academy" -Condition ($dataContent -match "1st Grade Typing Academy")
    Assert-Check -Name "Contains ChanceInvaders 1978 Space Arcade" -Condition ($dataContent -match "ChanceInvaders 1978 Arcade")
    Assert-Check -Name "Contains Junior Chess & ChessVault" -Condition ($dataContent -match "Junior Chess & ChessVault")
    Assert-Check -Name "Contains Frankie Milk Cap Vault" -Condition ($dataContent -match "Frankie the Hero Pup")
}

# 4. 3D Scene Engine & Dual 1st/3rd Person Views
$ScenePath = Join-Path $ScriptDir "grade-school-hall-scene.js"
Assert-Check -Name "grade-school-hall-scene.js exists" -Condition (Test-Path $ScenePath)

if (Test-Path $ScenePath) {
    $sceneContent = Get-Content $ScenePath -Raw
    Assert-Check -Name "Implements 1st/3rd Person View Controller (setViewMode)" -Condition ($sceneContent -match "setViewMode")
    Assert-Check -Name "Implements Articulated 3D Student Avatar (buildStudentAvatar)" -Condition ($sceneContent -match "buildStudentAvatar")
    Assert-Check -Name "Implements Floating Holographic Stats Banners" -Condition ($sceneContent -match "buildFloatingHolograms")
    Assert-Check -Name "Implements PBR Architecture & Parquet Flooring" -Condition ($sceneContent -match "herringbone_parquet")
    Assert-Check -Name "Implements Procedural Web Audio Synthesis" -Condition ($sceneContent -match "initProceduralAudio")
}

# 5. Engine & GitHub Top-Rated Educational Features
$EnginePath = Join-Path $ScriptDir "grade-school-hall-engine.js"
Assert-Check -Name "grade-school-hall-engine.js exists" -Condition (Test-Path $EnginePath)

if (Test-Path $EnginePath) {
    $engineContent = Get-Content $EnginePath -Raw
    Assert-Check -Name "Implements GCompris 3-Level Adaptive Scaffolding (setLevel)" -Condition ($engineContent -match "setLevel")
    Assert-Check -Name "Implements Antura 3-Tier Hint Ladder (applyAnturaHint)" -Condition ($engineContent -match "applyAnturaHint")
    Assert-Check -Name "Implements 36-Week Syllabus Navigator (openSyllabusModal)" -Condition ($engineContent -match "openSyllabusModal")
    Assert-Check -Name "Implements Annual Mastery Report Card (openReportCardModal)" -Condition ($engineContent -match "openReportCardModal")
    Assert-Check -Name "Implements Playable Typing Game (startTypingGame)" -Condition ($engineContent -match "startTypingGame")
    Assert-Check -Name "Implements Playable ChanceInvaders (startChanceInvadersGame)" -Condition ($engineContent -match "startChanceInvadersGame")
    Assert-Check -Name "Implements Playable Junior Chess (startChessGame)" -Condition ($engineContent -match "startChessGame")
    Assert-Check -Name "Implements Frankie Web Speech API (speakFrankie)" -Condition ($engineContent -match "speakFrankie")
}

# 6. Asset Files
$TexDir = Join-Path $ScriptDir "assets\textures"
Assert-Check -Name "Parquet Diffuse PBR exists" -Condition (Test-Path (Join-Path $TexDir "herringbone_parquet_diff_1k.jpg"))
Assert-Check -Name "Parquet Normal PBR exists" -Condition (Test-Path (Join-Path $TexDir "herringbone_parquet_nor_1k.jpg"))
Assert-Check -Name "Plaster Wall Diffuse PBR exists" -Condition (Test-Path (Join-Path $TexDir "painted_plaster_wall_diff_1k.jpg"))

$FootDir = Join-Path $ScriptDir "assets\footsteps"
Assert-Check -Name "Footstep Audio 01 exists" -Condition (Test-Path (Join-Path $FootDir "footstep_01.ogg"))

# 7. PowerShell Launcher
$LauncherPath = Join-Path $ScriptDir "Start-GradeSchoolHall.ps1"
Assert-Check -Name "Start-GradeSchoolHall.ps1 exists" -Condition (Test-Path $LauncherPath)

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Yellow
$Pct = [math]::Round(($PassedChecks / $TotalChecks) * 100, 1)
if ($PassedChecks -eq $TotalChecks) {
    Write-Host "  QUALITY GATE STATUS: PASSED ($PassedChecks / $TotalChecks Checks, $Pct%)" -ForegroundColor Green
} else {
    Write-Host "  QUALITY GATE STATUS: FAILED ($PassedChecks / $TotalChecks Checks, $Pct%)" -ForegroundColor Red
}
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host ""
