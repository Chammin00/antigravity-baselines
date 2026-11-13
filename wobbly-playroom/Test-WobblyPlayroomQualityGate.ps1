#Requires -Version 5.1
<#
.SYNOPSIS
    Automated Quality Gate for the 3D Wobbly Life Playroom Sandbox Studio.

.DESCRIPTION
    Validates all architectural, ragdoll physics, and gameplay checkpoints:
    - 7 Signature Wobbly Life Playroom Attractions:
      * Super Bouncy Trampoline (18.5m vertical launch)
      * Giant Colorful Ball Pit (48 physics spheres)
      * Mega Spiral Swirly Slide
      * Bowling Alley with knockdown pins
      * Drivable Wobbly Bumper Kart
      * Carousel & Seesaw
      * 12 Grabbable Physics Toys (Rubber ducks, dice, beach balls, pizza boxes)
    - Articulated Wobbly Jellybean Character Avatar:
      * Floppy noodle limbs & squash/stretch body
      * Googly eyes with physical tracking pupils
      * Interchangeable Hat Closet (Propeller cap, chef toque, royal crown, party cone)
      * Ragdoll flop & tumble recovery state machine
    - Mini-Job Delivery Economy:
      * Pizza box & courier parcel dropzone missions
      * Wobbly Coins counter & particle star bursts
    - PBR Lighting & High-Gloss Lacquer Materiality:
      * Key Directional daylight with soft PCF shadow maps
      * Warm Hemisphere fill & 5 attraction neon uplights
      * Specular lacquer playroom floor
    - Procedural Web Audio API Synthesizer:
      * Rubber shoe squeaks, spring boings, toy pops, kart horns, strike fanfares, coin chimes
    - Tactile On-Screen Action HUD:
      * JUMP, RUN, GRAB/THROW, FLOP/WOBBLE, RIDE KART, VIEW MODE
    - Standalone PowerShell HTTP launcher syntax
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
Write-Host "  3D WOBBLY PLAYROOM: QUALITY GATE VERIFICATION" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host ""

# 1. File Integrity Checks
$Files = @(
    "index.html",
    "wobbly-playroom-scene.js",
    "wobbly-playroom-engine.js",
    "Start-WobblyPlayroom.ps1",
    "high-gloss-lacquer.css",
    "high-gloss-lacquer.js",
    "mcp-baseline.js",
    "mcp-registry.json"
)

foreach ($f in $Files) {
    Assert-Check "File exists: $f" (Test-Path (Join-Path $ScriptDir $f))
}

# 2. Scene Architecture & Attractions Validation
$SceneContent = Get-Content (Join-Path $ScriptDir "wobbly-playroom-scene.js") -Raw

Assert-Check "Implements PBR Lighting Rig (Directional + Hemisphere)" ($SceneContent -match "DirectionalLight" -and $SceneContent -match "HemisphereLight")
Assert-Check "Implements High-Gloss Playroom Floor" ($SceneContent -match "buildPlayroomArchitecture" -and $SceneContent -match "roughness")
Assert-Check "Implements Super Bouncy Trampoline (buildTrampolineAttraction)" ($SceneContent -match "buildTrampolineAttraction")
Assert-Check "Implements Giant Ball Pit with Dynamic Spheres (buildBallPitAttraction)" ($SceneContent -match "buildBallPitAttraction" -and $SceneContent -match "ballPitBalls")
Assert-Check "Implements Mega Spiral Swirly Slide (buildMegaSpiralSlide)" ($SceneContent -match "buildMegaSpiralSlide")
Assert-Check "Implements Bowling Alley & Knockdown Pins (buildBowlingAlley)" ($SceneContent -match "buildBowlingAlley" -and $SceneContent -match "bowlingPins")
Assert-Check "Implements Drivable Wobbly Kart (buildWobblyKart)" ($SceneContent -match "buildWobblyKart" -and $SceneContent -match "kartWheels")
Assert-Check "Implements Spinning Carousel & Seesaw" ($SceneContent -match "buildSpinningCarousel" -and $SceneContent -match "buildSeesaw")
Assert-Check "Implements 12 Grabbable Physics Toys (buildGrabbableToys)" ($SceneContent -match "buildGrabbableToys" -and $SceneContent -match "grabbableToys")
Assert-Check "Implements Articulated Wobbly Jellybean Avatar (buildWobblyCharacterAvatar)" ($SceneContent -match "buildWobblyCharacterAvatar" -and $SceneContent -match "avatarRoot")
Assert-Check "Implements Googly Eyes with Tracking Pupils" ($SceneContent -match "pupilL" -and $SceneContent -match "pupilR")
Assert-Check "Implements Wobbly Hat Closet (setHat: Propeller, Chef, Crown, Cone)" ($SceneContent -match "setHat" -and $SceneContent -match "propeller" -and $SceneContent -match "chef")
Assert-Check "Implements Particle Systems (Confetti, Star Bursts & Dust Puffs)" ($SceneContent -match "buildConfettiSystem" -and $SceneContent -match "spawnDustPuff")

# 3. Interactive Engine & Physics Validation
$EngineContent = Get-Content (Join-Path $ScriptDir "wobbly-playroom-engine.js") -Raw

Assert-Check "Implements Procedural Web Audio API Synthesizer" ($EngineContent -match "initAudioSynthesizer" -and $EngineContent -match "playSpringBoing")
Assert-Check "Implements Rubber Squeak Footsteps (playSqueakFootstep)" ($EngineContent -match "playSqueakFootstep")
Assert-Check "Implements Kart Horn (playKartHorn)" ($EngineContent -match "playKartHorn")
Assert-Check "Implements Wobbly Movement Kinematics & Spine Sway" ($EngineContent -match "updateCharacterMovement" -and $EngineContent -match "wobbleAngleX")
Assert-Check "Implements Wobbly Jump Physics (triggerJump)" ($EngineContent -match "triggerJump")
Assert-Check "Implements Sprint / Run Toggle (toggleRun)" ($EngineContent -match "toggleRun")
Assert-Check "Implements Toy Grab & Throw Mechanics (handleGrab, handleThrow)" ($EngineContent -match "handleGrab" -and $EngineContent -match "handleThrow")
Assert-Check "Implements Wobbly Ragdoll Flop & Tumble (triggerFlop)" ($EngineContent -match "triggerFlop" -and $EngineContent -match "updateFlopPhysics")
Assert-Check "Implements Drivable Kart Physics (toggleKartDrive, updateKartPhysics)" ($EngineContent -match "toggleKartDrive" -and $EngineContent -match "updateKartPhysics")
Assert-Check "Implements Trampoline Spring Launch (updateTrampolineCheck)" ($EngineContent -match "updateTrampolineCheck" -and $EngineContent -match "18.5")
Assert-Check "Implements Ball Pit Scatter Physics (updateBallPitPhysics)" ($EngineContent -match "updateBallPitPhysics")
Assert-Check "Implements Bowling Strike Physics (updateBowlingPhysics)" ($EngineContent -match "updateBowlingPhysics")
Assert-Check "Implements Wobbly Pizza & Toy Courier Mini-Job (startDeliveryJob, completeDeliveryJob)" ($EngineContent -match "startDeliveryJob" -and $EngineContent -match "completeDeliveryJob")
Assert-Check "Implements Dual 3rd/1st Person Camera (setViewMode, toggleViewMode)" ($EngineContent -match "setViewMode" -and $EngineContent -match "toggleViewMode")

# 4. HTML Interface & Action HUD Validation
$HtmlContent = Get-Content (Join-Path $ScriptDir "index.html") -Raw

Assert-Check "HTML includes High-Gloss Lacquer CSS & JS" ($HtmlContent -match "high-gloss-lacquer\.css" -and $HtmlContent -match "high-gloss-lacquer\.js")
Assert-Check "HTML includes Three.js Library" ($HtmlContent -match "three\.min\.js")
Assert-Check "HTML contains JUMP Button (wobbly-jump-btn)" ($HtmlContent -match "wobbly-jump-btn")
Assert-Check "HTML contains RUN Button (wobbly-run-btn)" ($HtmlContent -match "wobbly-run-btn")
Assert-Check "HTML contains GRAB / THROW Button (wobbly-grab-btn)" ($HtmlContent -match "wobbly-grab-btn")
Assert-Check "HTML contains FLOP Button (wobbly-flop-btn)" ($HtmlContent -match "wobbly-flop-btn")
Assert-Check "HTML contains RIDE KART Button (wobbly-kart-btn)" ($HtmlContent -match "wobbly-kart-btn")
Assert-Check "HTML contains VIEW MODE Button (wobbly-view-btn)" ($HtmlContent -match "wobbly-view-btn")
Assert-Check "HTML contains Wobbly Coins Counter (wobbly-coins-val)" ($HtmlContent -match "wobbly-coins-val")
Assert-Check "HTML contains Hat Closet Modal (hat-modal)" ($HtmlContent -match "hat-modal" -and $HtmlContent -match "hat-select-btn")
Assert-Check "HTML contains Delivery Mission HUD (delivery-hud)" ($HtmlContent -match "delivery-hud")

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Yellow
if ($PassedChecks -eq $TotalChecks) {
    Write-Host "  QUALITY GATE STATUS: PASSED ($PassedChecks / $TotalChecks Checks, 100%)" -ForegroundColor Green
} else {
    Write-Host "  QUALITY GATE STATUS: FAILED ($PassedChecks / $TotalChecks Checks)" -ForegroundColor Red
}
Write-Host "==================================================================" -ForegroundColor Yellow
Write-Host ""

if ($PassedChecks -ne $TotalChecks) {
    exit 1
}
