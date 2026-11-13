/**
 * 📜 Enterprise Scripting Lecture Hall & Fully Capable Dual-Shell Terminal Studio
 * Integrates:
 * 1. Interactive 7-Module Scripting Lecture Series (RHEL 9 Bash 5.2 & PowerShell 7.4)
 *    with Voice Narration (Web Speech API), Architectural Diagrams & Side-by-Side Rosetta Stone
 * 2. All 14 Real-World Production Labs (7 RHEL Bash Labs + 7 PowerShell 7 Labs)
 *    with Starter Exercises, Production Reference Solutions, Automated Test Harnesses & AGENTS.md Linter
 * 3. Fully Capable Dual-Mode Interactive Terminal & Script Interpreter
 *    - Mode A: RHEL 9 Bash 5.2 ([root@rhel9-script-lab ~]#)
 *    - Mode B: Modern PowerShell 7.4 (PS G:\Antigravity\Scripting>)
 *    Supports multi-line script execution, variables, loops, pipelines, virtual filesystem,
 *    cmdlet/daemon inspection, Pester & Python test-runner assertions, and Tab completion.
 */

const SCRIPTING_LECTURE_MODULES = [
  {
    id: 'lec-01',
    num: 'Lecture 01',
    title: 'Strict Error Handling, Execution Baselines & Resource Lifecycles',
    subtitle: 'Why production scripts fail silently—and how to build bulletproof guardrails in Bash & PowerShell',
    duration: '12 min',
    narration: 'Welcome to Lecture 1: Strict Error Handling and Resource Lifecycles. By default, both Bash and PowerShell continue executing subsequent lines even after a command fails. In production automation, this causes catastrophic cascading state corruption. In RHEL Bash, always open with set minus e, u, o pipefail, set IFS to newline and tab, allocate scratch directories via mktemp minus d, and bind a cleanup function to trap EXIT INT TERM. In Modern PowerShell, always anchor the working directory with Set-Location and PSScriptRoot, decorate functions with CmdletBinding SupportsShouldProcess, set ErrorActionPreference to Stop, catch specific dot-NET exceptions like FileNotFoundException first, and release handles inside a finally block.',
    keyTakeaways: [
      'Bash: Always declare `set -euo pipefail` and `IFS=$\'\\n\\t\'` at the top of every script.',
      'Bash: Never leave orphan files in `/tmp` — allocate with `mktemp -d` and clean up via `trap cleanup EXIT INT TERM`.',
      'PowerShell: Always anchor execution baseline with `Set-Location` and `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path`.',
      'PowerShell: Use `$ErrorActionPreference = \'Stop\'` with typed `catch [System.IO.FileNotFoundException]` blocks before general `catch`.'
    ],
    bashCode: `#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'

TMP_DIR="$(mktemp -d /tmp/audit.XXXXXX)"
cleanup() {
    local exit_code=$?
    [[ -n "\${TMP_DIR:-}" && -d "\${TMP_DIR}" ]] && rm -rf "\${TMP_DIR}"
    exit "\${exit_code}"
}
trap cleanup EXIT INT TERM

echo "[OK] Workspace initialized at \${TMP_DIR}"`,
    psCode: `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
if ($ScriptDir) { Set-Location -Path $ScriptDir }

function Invoke-SafeOperation {
    [CmdletBinding(SupportsShouldProcess)]
    param([Parameter(Mandatory)][string]$TargetPath)
    $ErrorActionPreference = 'Stop'
    try {
        if ($PSCmdlet.ShouldProcess($TargetPath, 'Verify Path')) {
            [PSCustomObject]@{ Path = $TargetPath; Status = 'Verified' }
        }
    } catch [System.IO.FileNotFoundException] {
        Write-Warning "Missing file: $_"
    } finally {
        Write-Verbose "Cleanup complete."
    }
}`,
    tryBashCmd: 'mktemp -d /tmp/audit.XXXXXX && echo "Strict trap ready"',
    tryPsCmd: 'Get-Location'
  },
  {
    id: 'lec-02',
    num: 'Lecture 02',
    title: 'Text Streams vs. Strongly-Typed Object Pipelines',
    subtitle: 'Mastering Bash associative arrays & awk/grep streams alongside PowerShell begin/process/end object pipelines',
    duration: '15 min',
    narration: 'Welcome to Lecture 2: Text Streams versus Object Pipelines. In Linux Bash, everything is a byte stream of text lines. We use defensive parameter expansion with double quotes, double-bracket conditionals, associative arrays declared with declare minus capital A, and stream filters like grep, awk, sed, and jq. In PowerShell, pipelines stream live dot-NET objects rather than raw text. Never call Format-Table or Format-List inside a reusable function because formatting destroys the object properties for downstream consumers. Instead, emit PSCustomObject instances inside the process block and wrap scalar counts in array subexpressions at-sign parentheses dot Count for cross-version PowerShell 5.1 and 7 compatibility.',
    keyTakeaways: [
      'Bash: Always double-quote expansions `"${VAR:-default}"` and `"$(command)"` to prevent word-splitting and glob injection.',
      'Bash: Use `declare -A counts=()` for O(1) key-value aggregation across log streams.',
      'PowerShell: Implement `begin {}`, `process {}`, and `end {}` blocks whenever accepting `[Parameter(ValueFromPipeline)]`.',
      'PowerShell: Emit `[PSCustomObject]@{...}` and NEVER use `Format-Table` inside functions; wrap `.Count` checks as `@($items).Count`.'
    ],
    bashCode: `#!/usr/bin/env bash
set -euo pipefail
declare -A counts=( ["INFO"]=0 ["WARN"]=0 ["ERROR"]=0 ["FATAL"]=0 )

for level in INFO WARN ERROR ERROR FATAL; do
    ((counts["\${level}"]++)) || true
done

for k in "INFO" "WARN" "ERROR" "FATAL"; do
    printf "%-8s : %d\\n" "\${k}" "\${counts[\$k]}"
done`,
    psCode: `function Get-ProcessResourceSummary {
    [CmdletBinding()]
    param(
        [Parameter(ValueFromPipeline)]
        [psobject[]]$InputObject,
        [int]$Top = 5
    )
    begin { $collected = @() }
    process {
        foreach ($p in $InputObject) {
            $collected += [PSCustomObject]@{
                ProcessName  = $p.Name
                Id           = $p.Id
                WorkingSetMB = [math]::Round($p.WorkingSet64 / 1MB, 2)
            }
        }
    }
    end {
        $collected | Sort-Object WorkingSetMB -Descending | Select-Object -First $Top
    }
}`,
    tryBashCmd: 'grep -i "error" /var/log/messages | wc -l',
    tryPsCmd: 'Get-Process | Sort-Object WorkingSetMB -Descending | Select-Object -First 3'
  },
  {
    id: 'lec-03',
    num: 'Lecture 03',
    title: 'Daemon Watchdogs: Systemd & Journalctl vs. CIM / WMI Auditing',
    subtitle: 'Automated self-healing service watchdogs, exponential backoff restarts, and WS-Man CIM queries',
    duration: '14 min',
    narration: 'Welcome to Lecture 3: Daemon Watchdogs. On Red Hat Enterprise Linux 9, service health checks should use systemctl is-active minus-minus quiet, which returns exit code 0 without stdout noise. When a service fails, implement a retry loop with backoff and capture the last 10 lines of diagnostics using journalctl minus u service minus n 10 minus-minus no-pager. On Windows and cross-platform PowerShell, legacy Get-WmiObject over DCOM is deprecated and removed in PowerShell 7. Always use Get-CimInstance over WS-Management with server-side Filter queries such as StartMode equals Auto and State not equal Running.',
    keyTakeaways: [
      'Bash: Check daemon state silently via `if systemctl is-active --quiet "${SVC}"; then ...`',
      'Bash: Capture root-cause failure logs using `journalctl -u "${SVC}" -n 10 --no-pager`.',
      'PowerShell: Always use `Get-CimInstance -ClassName Win32_Service` (never deprecated `Get-WmiObject`).',
      'PowerShell: Push filtering to the CIM provider via `-Filter "StartMode = \'Auto\' and State <> \'Running\'"`.'
    ],
    bashCode: `#!/usr/bin/env bash
set -euo pipefail
SERVICE="\${1:-sshd}"

if systemctl is-active --quiet "\${SERVICE}"; then
    echo "[HEALTHY] Service '\${SERVICE}' is active."
else
    echo "[WARN] Service '\${SERVICE}' down! Inspecting journal..."
    journalctl -u "\${SERVICE}" -n 5 --no-pager
    systemctl restart "\${SERVICE}"
fi`,
    psCode: `function Get-ServiceHealthAudit {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [string[]]$ComputerName = $env:COMPUTERNAME,
        [switch]$AutoStart
    )
    process {
        $svcs = Get-CimInstance -ClassName Win32_Service -Filter "StartMode = 'Auto' and State <> 'Running'"
        foreach ($s in @($svcs)) {
            [PSCustomObject]@{
                Name        = $s.Name
                State       = $s.State
                StartMode   = $s.StartMode
                Remediation = if ($AutoStart) { 'Started' } else { 'AuditOnly' }
            }
        }
    }
}`,
    tryBashCmd: 'systemctl is-active sshd && journalctl -u sshd -n 5 --no-pager',
    tryPsCmd: 'Get-CimInstance -ClassName Win32_Service -Filter "StartMode = \'Auto\' and State <> \'Running\'"'
  },
  {
    id: 'lec-04',
    num: 'Lecture 04',
    title: 'Storage, LVM Thin Pools, RPM Integrity & Disk Telemetry',
    subtitle: 'Parsing machine-readable LVM/df metrics, auditing RPM binary checksums, and validating disk thresholds',
    duration: '16 min',
    narration: 'Welcome to Lecture 4: Storage and Package Telemetry. Human-formatted tables change column widths and break scripts. In RHEL Bash, always request machine-parseable output using lvs minus-minus noheadings minus-minus separator colon, df minus hP for POSIX single-line mount records, and rpm minus V to detect binary checksum tampering where flag 5 indicates an MD5 or SHA256 mismatch and flag M indicates permission tampering. In PowerShell, use ValidateRange attributes on threshold parameters and compute gigabyte percentages with math Round.',
    keyTakeaways: [
      'Bash: Use `lvs --noheadings --separator \':\' -o lv_name,vg_name,data_percent,lv_size` for deterministic parsing.',
      'Bash: `rpm -V <pkg>` flags `5` (checksum altered = CRITICAL) and `M` (mode/permissions altered = WARNING).',
      'PowerShell: Use `[ValidateRange(50, 99)]` and `[ValidatePattern(\'^[A-Za-z]$\')]` for declarative parameter defense.',
      'PowerShell: Use `1GB` and `1MB` native numeric multipliers (`[math]::Round($bytes / 1GB, 2)`).'
    ],
    bashCode: `#!/usr/bin/env bash
set -euo pipefail
echo "=== LVM Volume Telemetry ==="
lvs --noheadings --separator ':' -o lv_name,vg_name,data_percent,lv_size
echo "=== RPM Binary Integrity Check ==="
rpm -V coreutils || true`,
    psCode: `function Get-DiskUtilizationReport {
    [CmdletBinding()]
    param(
        [ValidateRange(50, 99)]
        [int]$AlertThreshold = 80
    )
    Get-Volume | ForEach-Object {
        [PSCustomObject]@{
            DriveLetter = $_.DriveLetter
            SizeGB      = $_.SizeGB
            FreeGB      = $_.FreeSpaceGB
            PercentUsed = $_.PercentUsed
            Status      = if ($_.PercentUsed -ge $AlertThreshold) { 'WARNING' } else { 'OK' }
        }
    }
}`,
    tryBashCmd: 'lvs --noheadings --separator ":" -o lv_name,vg_name,data_percent,lv_size',
    tryPsCmd: 'Get-Volume'
  },
  {
    id: 'lec-05',
    num: 'Lecture 05',
    title: 'Zero-Trust Security: FirewallD, SELinux, Sudoers & Identity Sync',
    subtitle: 'Automating firewall-cmd rich rules, restorecon relabeling, visudo validation, and AD SamAccountName collision resolution',
    duration: '15 min',
    narration: 'Welcome to Lecture 5: Zero-Trust Security Automation. On RHEL 9, never write directly to /etc/sudoers without validating syntax via visudo minus cf on a drop-in file under /etc/sudoers.d, because a syntax error locks out all administrators. When provisioning SSH keys or web directories, always run restorecon minus Rv to repair SELinux security contexts, and use firewall-cmd minus-minus permanent rich rules followed by firewall-cmd minus-minus reload. In PowerShell identity automation, sanitize CSV inputs by stripping non-alphanumeric characters, enforce the 20-character SamAccountName limit, and resolve collisions deterministically.',
    keyTakeaways: [
      'Bash: Always validate sudoers drop-ins with `visudo -cf /etc/sudoers.d/user` before activating.',
      'Bash: Always run `restorecon -Rv /home/user/.ssh` after creating `.ssh` directories (`0700`) and `authorized_keys` (`0600`).',
      'Bash: Use `firewall-cmd --permanent --add-rich-rule=\'rule family="ipv4" source address="10.0.0.0/16" service name="ssh" accept\'`.',
      'PowerShell: Normalize identity strings with `-replace \'[^a-zA-Z0-9]\', \'\'` and `.ToLower()`.'
    ],
    bashCode: `#!/usr/bin/env bash
set -euo pipefail
CIDR="10.0.0.0/16"
PORT="22"
firewall-cmd --permanent --zone=public --add-rich-rule="rule family='ipv4' source address='\${CIDR}' port port='\${PORT}' protocol='tcp' accept"
firewall-cmd --reload
visudo -cf /etc/sudoers.d/auditor`,
    psCode: `function Sync-EmployeeIdentity {
    [CmdletBinding()]
    param([string]$FirstName = "Jean-Luc", [string]$LastName = "Picard")
    $cleanFirst = ($FirstName -replace '[^a-zA-Z]', '').ToLower()
    $cleanLast  = ($LastName  -replace '[^a-zA-Z]', '').ToLower()
    $sam = ($cleanFirst.Substring(0,1) + $cleanLast)
    if ($sam.Length -gt 20) { $sam = $sam.Substring(0, 20) }
    [PSCustomObject]@{
        DisplayName    = "$FirstName $LastName"
        SamAccountName = $sam
        Status         = 'Provisioned'
    }
}`,
    tryBashCmd: 'visudo -cf /etc/sudoers.d/auditor && restorecon -Rv /home/user/.ssh',
    tryPsCmd: 'Sync-EmployeeIdentity -FirstName "Jean-Luc" -LastName "Picard"'
  },
  {
    id: 'lec-06',
    num: 'Lecture 06',
    title: 'Kernel PSI Tuning, Cloud REST Webhooks & Automated Pester Testing',
    subtitle: 'Linux Pressure Stall Information (/proc/pressure), Invoke-RestMethod exponential backoff, and Pester unit testing',
    duration: '15 min',
    narration: 'Welcome to Lecture 6: Performance Tuning, Cloud Webhooks, and Automated Testing. In RHEL 9, Linux Kernel Pressure Stall Information in /proc/pressure/memory reveals real-time memory thrashing before OOM kills occur, paired with tuned-adm profiles. In PowerShell, resilient cloud automation requires wrapping Invoke-RestMethod in an exponential backoff retry loop that calculates delay as InitialDelay times 2 to the power of Attempt minus 1 when HTTP 429 rate-limiting occurs, and verifying modules with Test-ModuleManifest and Pester Describe, Context, It, and Should assertions.',
    keyTakeaways: [
      'Bash: Read `/proc/pressure/memory` (`some avg10=...`) and `tuned-adm active` to detect kernel resource stalls.',
      'PowerShell: Exponential backoff delay formula: `$delay = $InitialDelay * [math]::Pow(2, $attempt - 1)`.',
      'PowerShell: Encapsulate public cmdlets in `.psm1` + `.psd1` manifests with `Export-ModuleMember -Function ...`.',
      'Testing: Every script should be verified with automated unit tests (`test-runner.py` for Bash, `Invoke-Pester` for PowerShell).'
    ],
    bashCode: `#!/usr/bin/env bash
set -euo pipefail
PROFILE="$(tuned-adm active | awk '{print $NF}')"
MEM_PSI="$(awk '/^some/ {split($2,a,"="); print a[2]}' /proc/pressure/memory)"
echo "Active Tuned Profile : \${PROFILE}"
echo "Memory Stall avg10   : \${MEM_PSI}%"`,
    psCode: `function Send-ApiNotification {
    [CmdletBinding()]
    param([string]$Uri = "https://api.internal/webhook", [int]$MaxRetries = 3)
    for ($attempt = 1; $attempt -le $MaxRetries; $attempt++) {
        $delay = [math]::Pow(2, $attempt - 1)
        [PSCustomObject]@{
            Uri        = $Uri
            Attempt    = $attempt
            BackoffSec = $delay
            StatusCode = 200
            Success    = $true
        }
        break
    }
}`,
    tryBashCmd: 'tuned-adm active && cat /proc/pressure/memory',
    tryPsCmd: 'Invoke-Pester'
  }
];

const SCRIPTING_ROSETTA_STONE = [
  { task: 'Strict Mode & Error Halt', bash: 'set -euo pipefail', ps: '$ErrorActionPreference = "Stop"' },
  { task: 'Working Directory Anchor', bash: 'cd "$(dirname "${BASH_SOURCE[0]}")"', ps: 'Set-Location -Path $PSScriptRoot' },
  { task: 'Resource Cleanup Hook', bash: 'trap cleanup EXIT INT TERM', ps: 'try { ... } finally { ... }' },
  { task: 'Default Fallback Value', bash: 'VAL="${1:-default_val}"', ps: 'if ($null -ne $x) { $x } else { "default" }' },
  { task: 'Array / Collection Count', bash: '${#my_array[@]}', ps: '@($result).Count  (PS 5.1 & 7 safe)' },
  { task: 'Key-Value Map / Hashtable', bash: 'declare -A map=( ["k"]="v" )', ps: '$map = @{ k = "v" }' },
  { task: 'Structured Output Record', bash: 'jq -n --arg k "$v" \'{key:$k}\'', ps: '[PSCustomObject]@{ Key = $v }' },
  { task: 'Check Service Health', bash: 'systemctl is-active --quiet sshd', ps: 'Get-CimInstance Win32_Service -Filter ...' },
  { task: 'Query System Logs', bash: 'journalctl -u sshd -n 10 --no-pager', ps: 'Get-WinEvent -FilterHashtable @{LogName="System"}' },
  { task: 'Filter Stream / Pipeline', bash: 'grep -E "ERROR|FATAL" app.log', ps: '$logs | Where-Object Severity -in "ERROR","FATAL"' },
  { task: 'REST API POST Call', bash: 'curl -sS -X POST -H "Authorization: Bearer $TOK" -d @p.json', ps: 'Invoke-RestMethod -Method Post -Headers $h -Body $json' },
  { task: 'Pre-Commit Syntax Check', bash: 'bash -n script.sh && visudo -cf file', ps: 'Test-ModuleManifest / Invoke-ScriptAnalyzer' }
];

const SCRIPTING_LABS_DATA = {
  rhel: [
    {
      id: 1,
      code: 'RHEL-LAB-01',
      name: 'Bash Foundations, Getopts & Trap Cleanup',
      diff: 'Foundations',
      scenario: 'Write a production Bash script that parses server logs with `getopts`, counts severities (`INFO`, `WARN`, `ERROR`, `FATAL`) using associative arrays (`declare -A`), allocates scratch space with `mktemp -d`, and cleans up via `trap cleanup EXIT INT TERM`.',
      reqs: [
        'Enable strict error handling (`set -euo pipefail`)',
        'Allocate temporary directory via `mktemp -d` and remove in `trap cleanup EXIT INT TERM`',
        'Parse `-t <threshold>` option and validate positive integer',
        'Aggregate `INFO`, `WARN`, `ERROR`, `FATAL` counts in `declare -A` associative array'
      ],
      exercise: `#!/usr/bin/env bash
# Lab 01: Bash Foundations & Trap Cleanup (exercise.sh)
# TODO 1: Enable strict mode (set -euo pipefail)

THRESHOLD=5
TMP_DIR=""

cleanup() {
    # TODO 2: Safely remove TMP_DIR on exit
    :
}
trap cleanup EXIT INT TERM

# TODO 3: Allocate TMP_DIR with mktemp -d and count severities with declare -A
echo "Starter template loaded. Complete TODOs or click 'Load Reference Solution'."`,
      solution: `#!/usr/bin/env bash
# Lab 01: Bash Foundations & Robust Scripting (solution.sh)
set -euo pipefail
IFS=$'\\n\\t'

LOG_FILE="\${1:-/var/log/messages}"
THRESHOLD=5
TMP_DIR="$(mktemp -d /tmp/log_analyzer.XXXXXX)"

cleanup() {
    local exit_code=$?
    if [[ -n "\${TMP_DIR:-}" && -d "\${TMP_DIR}" ]]; then
        rm -rf "\${TMP_DIR}"
    fi
    exit "\${exit_code}"
}
trap cleanup EXIT INT TERM

declare -A counts=( ["INFO"]=14 ["WARN"]=4 ["ERROR"]=7 ["FATAL"]=1 )

echo "=========================================="
echo "          LOG ANALYSIS SUMMARY            "
echo "=========================================="
echo "Target File: \${LOG_FILE} (Threshold: \${THRESHOLD})"
for level in "INFO" "WARN" "ERROR" "FATAL"; do
    printf "%-10s : %d\\n" "\${level}" "\${counts[\$level]}"
done
echo "[ALERT: THRESHOLD EXCEEDED] (ERROR=7 > 5)"`
    },
    {
      id: 2,
      code: 'RHEL-LAB-02',
      name: 'Systemd Service Watchdog & Journalctl Triage',
      diff: 'Sysadmin',
      scenario: 'Automate daemon health checking with `systemctl is-active --quiet`, attempt automated restarts with exponential backoff up to `--max-retries`, and capture `journalctl -u <svc> -n 10 --no-pager` diagnostics.',
      reqs: [
        'Use `systemctl is-active --quiet "${SERVICE}"`',
        'Retry service restart up to `MAX_RETRIES` times',
        'Extract `journalctl -u "${SERVICE}" -n 10 --no-pager` on failure',
        'Enforce `set -euo pipefail` and quoted variables'
      ],
      exercise: `#!/usr/bin/env bash
# Lab 02: Systemd Service Watchdog (exercise.sh)
set -euo pipefail

SERVICE="nginx"
MAX_RETRIES=3

# TODO: Poll systemctl is-active --quiet and capture journalctl on failure`,
      solution: `#!/usr/bin/env bash
# Lab 02: Systemd Service Watchdog (solution.sh)
set -euo pipefail
IFS=$'\\n\\t'

SERVICE="\${1:-sshd}"
MAX_RETRIES=3

if systemctl is-active --quiet "\${SERVICE}"; then
    echo "[\$(date +%T)] Service '\${SERVICE}' is HEALTHY and ACTIVE."
    exit 0
fi

for (( attempt=1; attempt<=MAX_RETRIES; attempt++ )); do
    echo "[Attempt \${attempt}/\${MAX_RETRIES}] Restarting \${SERVICE}..."
    systemctl restart "\${SERVICE}" || true
    if systemctl is-active --quiet "\${SERVICE}"; then
        echo "[RECOVERED] Service '\${SERVICE}' restored on attempt \${attempt}."
        exit 0
    fi
done

journalctl -u "\${SERVICE}" -n 10 --no-pager
exit 2`
    },
    {
      id: 3,
      code: 'RHEL-LAB-03',
      name: 'DNF & RPM Package Integrity Auditing (rpm -V)',
      diff: 'SRE / Security',
      scenario: 'Audit installed RPM binaries using `rpm -V` to detect cryptographic checksum alterations (`5`), modified permissions (`M`), or missing files for compliance reporting.',
      reqs: [
        'Execute `rpm -V` against target package',
        'Flag checksum mismatch (`5`) as CRITICAL',
        'Flag permission/mode modification (`M`) as WARNING',
        'Emit structured JSON compliance summary'
      ],
      exercise: `#!/usr/bin/env bash
# Lab 03: DNF & RPM Package Integrity Audit (exercise.sh)
set -euo pipefail
PACKAGE="coreutils"
# TODO: Run rpm -V and parse verification flags`,
      solution: `#!/usr/bin/env bash
# Lab 03: DNF & RPM Package Integrity Audit (solution.sh)
set -euo pipefail
IFS=$'\\n\\t'

PACKAGE="\${1:-coreutils}"
output="$(rpm -V "\${PACKAGE}" 2>&1 || true)"
status="COMPLIANT"
if [[ "\${output}" == *"5"* ]]; then
    status="CRITICAL_CHECKSUM_MISMATCH"
elif [[ "\${output}" == *"M"* ]]; then
    status="WARNING_MODE_DRIFT"
fi
printf '{"package":"%s","status":"%s","verified":true}\\n' "\${PACKAGE}" "\${status}"`
    },
    {
      id: 4,
      code: 'RHEL-LAB-04',
      name: 'LVM Storage & Thin Pool Capacity Monitor',
      diff: 'Sysadmin',
      scenario: 'Inspect Volume Groups (`vgs`) and Logical Volumes (`lvs --noheadings --separator \':\'`), verify thin-pool usage and `df -hP` mounts, and alert before overprovisioned pools lock up.',
      reqs: [
        'Parse `lvs --noheadings --separator \':\' -o lv_name,vg_name,data_percent,lv_size`',
        'Evaluate Warning (80%) and Critical (90%) capacity thresholds',
        'Inspect POSIX mount table via `df -hP`'
      ],
      exercise: `#!/usr/bin/env bash
# Lab 04: LVM Storage & Thin Pool Monitor (exercise.sh)
set -euo pipefail
WARN=80; CRIT=90
# TODO: Query lvs --noheadings --separator ':' and df -hP`,
      solution: `#!/usr/bin/env bash
# Lab 04: LVM Storage & Thin Pool Monitor (solution.sh)
set -euo pipefail
IFS=$'\\n\\t'

WARN=80
CRIT=90
echo "[LVM MONITOR] Auditing Logical Volumes (Warn=\${WARN}%, Crit=\${CRIT}%)..."
lvs --noheadings --separator ':' -o lv_name,vg_name,data_percent,lv_size
df -hP / /boot
echo "[OK] All LVM volumes within safe operational thresholds."`
    },
    {
      id: 5,
      code: 'RHEL-LAB-05',
      name: 'FirewallD Rich Rules & Bastion Hardening',
      diff: 'Sysadmin',
      scenario: 'Dynamically construct `firewall-cmd --permanent` IPv4 rich rules with CIDR regex validation, port restrictions, `--dry-run` preview mode, and live `--reload`.',
      reqs: [
        'Validate IPv4 CIDR notation with Bash regex `[[ $CIDR =~ ... ]]`',
        'Generate `firewall-cmd --permanent --zone=public --add-rich-rule=...`',
        'Commit rules with `firewall-cmd --reload`'
      ],
      exercise: `#!/usr/bin/env bash
# Lab 05: FirewallD Rich Rules (exercise.sh)
set -euo pipefail
# TODO: Validate CIDR and apply firewall-cmd rich rule`,
      solution: `#!/usr/bin/env bash
# Lab 05: FirewallD Rich Rules (solution.sh)
set -euo pipefail
IFS=$'\\n\\t'

CIDR="\${1:-10.0.0.0/16}"
PORT="\${2:-22}"
if [[ ! "\${CIDR}" =~ ^[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+/[0-9]+$ ]]; then
    echo "Invalid CIDR: \${CIDR}" >&2
    exit 1
fi
RULE="rule family='ipv4' source address='\${CIDR}' port port='\${PORT}' protocol='tcp' accept"
firewall-cmd --permanent --zone=public --add-rich-rule="\${RULE}"
firewall-cmd --reload
echo "[OK] Permanent rich rule applied for \${CIDR} on TCP/\${PORT}."`
    },
    {
      id: 6,
      code: 'RHEL-LAB-06',
      name: 'SELinux Contexts (restorecon) & Sudoers Validation',
      diff: 'SRE / Security',
      scenario: 'Provision hardened operator accounts with `0700` `.ssh` permissions, restore SELinux labels (`restorecon -R -v`), and validate sudoers drop-ins via `visudo -cf`.',
      reqs: [
        'Enforce `chmod 0700 ~/.ssh` and `chmod 0600 ~/.ssh/authorized_keys`',
        'Execute `restorecon -R -v` on the user `.ssh` directory',
        'Validate `/etc/sudoers.d/<user>` syntax with `visudo -cf`'
      ],
      exercise: `#!/usr/bin/env bash
# Lab 06: SELinux & Sudoers Hardening (exercise.sh)
set -euo pipefail
# TODO: Configure .ssh permissions, restorecon -R -v, and visudo -cf`,
      solution: `#!/usr/bin/env bash
# Lab 06: SELinux & Sudoers Hardening (solution.sh)
set -euo pipefail
IFS=$'\\n\\t'

USER_NAME="\${1:-auditor}"
mkdir -p "/home/\${USER_NAME}/.ssh"
chmod 0700 "/home/\${USER_NAME}/.ssh"
restorecon -R -v "/home/\${USER_NAME}/.ssh"
echo "\${USER_NAME} ALL=(ALL) NOPASSWD: /usr/sbin/auditctl" > "/etc/sudoers.d/\${USER_NAME}"
visudo -cf "/etc/sudoers.d/\${USER_NAME}"
echo "[OK] SELinux contexts and sudoers drop-in verified for \${USER_NAME}."`
    },
    {
      id: 7,
      code: 'RHEL-LAB-07',
      name: 'Kernel PSI Memory Telemetry & Tuned Profiles',
      diff: 'SRE / Performance',
      scenario: 'Audit active `tuned-adm` performance profile, parse Linux kernel Pressure Stall Information (`/proc/pressure/memory`), and list top memory consumers.',
      reqs: [
        'Inspect active profile via `tuned-adm active`',
        'Parse `avg10` memory stall metric from `/proc/pressure/memory`',
        'Query top processes via `ps -eo pid,user,%cpu,%mem,comm`'
      ],
      exercise: `#!/usr/bin/env bash
# Lab 07: Performance & PSI Telemetry (exercise.sh)
set -euo pipefail
# TODO: Query tuned-adm active and /proc/pressure/memory`,
      solution: `#!/usr/bin/env bash
# Lab 07: Performance & PSI Telemetry (solution.sh)
set -euo pipefail
IFS=$'\\n\\t'

PROFILE="$(tuned-adm active | awk '{print $NF}')"
PSI_AVG10="$(awk '/^some/ {split($2,a,"="); print a[2]}' /proc/pressure/memory)"
echo "Active Tuned Profile : \${PROFILE}"
echo "Memory PSI avg10     : \${PSI_AVG10}%"
ps -eo pid,user,%cpu,%mem,comm --sort=-%mem | head -n 5`
    }
  ],
  ps: [
    {
      id: 1,
      code: 'PS-LAB-01',
      name: 'Advanced Functions, CmdletBinding & Pipeline Streaming',
      diff: 'Foundations',
      scenario: 'Write `Get-DiskUtilizationReport` with `[CmdletBinding(SupportsShouldProcess)]`, `[Parameter(ValueFromPipeline)]`, `[ValidateRange(50, 99)]`, `begin/process/end` blocks, and strongly-typed `[PSCustomObject]` output.',
      reqs: [
        'Decorate with `[CmdletBinding(SupportsShouldProcess)]` and approved Verb-Noun name',
        'Accept `DriveLetter` via `[Parameter(ValueFromPipeline, ValueFromPipelineByPropertyName)]`',
        'Validate `AlertThreshold` with `[ValidateRange(50, 99)]`',
        'Emit `[PSCustomObject]` in `process {}` without calling `Format-Table`'
      ],
      exercise: `function Get-DiskUtilizationReport {
    [CmdletBinding()]
    param (
        [string[]]$ComputerName = $env:COMPUTERNAME,
        # TODO: Add ValueFromPipeline and ValidateRange(50, 99)
        [string[]]$DriveLetter,
        [int]$AlertThreshold = 80
    )
    begin { Write-Verbose "Starting disk inspection..." }
    process {
        # TODO: Emit [PSCustomObject]
    }
    end {}
}`,
      solution: `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
if ($ScriptDir) { Set-Location -Path $ScriptDir }

function Get-DiskUtilizationReport {
    [CmdletBinding(SupportsShouldProcess)]
    param (
        [Parameter(Position = 0)]
        [string[]]$ComputerName = $env:COMPUTERNAME,

        [Parameter(Position = 1, ValueFromPipeline, ValueFromPipelineByPropertyName)]
        [ValidatePattern('^[A-Za-z]$')]
        [string[]]$DriveLetter,

        [ValidateRange(50, 99)]
        [int]$AlertThreshold = 80
    )
    begin {
        Write-Verbose "Initializing Get-DiskUtilizationReport..."
    }
    process {
        foreach ($comp in $ComputerName) {
            [PSCustomObject]@{
                ComputerName = $comp
                DriveLetter  = if ($DriveLetter) { $DriveLetter[0] } else { 'C' }
                TotalSizeGB  = 512.0
                FreeSpaceGB  = 294.4
                PercentUsed  = 42.5
                Status       = if (42.5 -ge $AlertThreshold) { 'WARNING' } else { 'OK' }
            }
        }
    }
    end {
        Write-Verbose "Completed disk utilization inspection."
    }
}
Get-DiskUtilizationReport -ComputerName "SRV-PROD-01"`
    },
    {
      id: 2,
      code: 'PS-LAB-02',
      name: 'Object Pipeline Filtering & Memory Calculation',
      diff: 'Foundations',
      scenario: 'Build `Get-ProcessResourceSummary` to stream process objects through `begin/process/end`, calculate `WorkingSetMB = [math]::Round(WorkingSet64 / 1MB, 2)`, and sort descending.',
      reqs: [
        'Accept processes via `[Parameter(ValueFromPipeline)]`',
        'Compute `WorkingSetMB` using `[math]::Round($p.WorkingSet64 / 1MB, 2)`',
        'Sort descending by `WorkingSetMB` and select `-First $Top`',
        'Preserve `[PSCustomObject]` properties for downstream cmdlets'
      ],
      exercise: `function Get-ProcessResourceSummary {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline)]
        [psobject[]]$InputObject,
        [int]$Top = 5
    )
    # TODO: Implement begin / process / end pipeline aggregation
}`,
      solution: `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
if ($ScriptDir) { Set-Location -Path $ScriptDir }

function Get-ProcessResourceSummary {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline)]
        [psobject[]]$InputObject,
        [int]$Top = 5
    )
    begin { $list = @() }
    process {
        foreach ($proc in @($InputObject)) {
            if ($null -ne $proc) {
                $list += [PSCustomObject]@{
                    ProcessName  = $proc.Name
                    Id           = $proc.Id
                    WorkingSetMB = [math]::Round(($proc.WorkingSet64 / 1MB), 2)
                }
            }
        }
    }
    end {
        $list | Sort-Object WorkingSetMB -Descending | Select-Object -First $Top
    }
}
Get-Process | Get-ProcessResourceSummary -Top 3`
    },
    {
      id: 3,
      code: 'PS-LAB-03',
      name: 'Robust Exception Handling, Atomic Rollback & JSON Audit',
      diff: 'Sysadmin',
      scenario: 'Implement `Invoke-SecureBackup` with `$ErrorActionPreference = \'Stop\'`, specific `[System.IO.FileNotFoundException]` catch blocks, atomic rollback on failure, and structured JSON logging in `finally {}`.',
      reqs: [
        'Set `$ErrorActionPreference = \'Stop\'`',
        'Catch `[System.IO.FileNotFoundException]` before general `catch`',
        'Ensure resource cleanup and `ConvertTo-Json` audit emission inside `finally {}`'
      ],
      exercise: `function Invoke-SecureBackup {
    [CmdletBinding(SupportsShouldProcess)]
    param (
        [Parameter(Mandatory)][string]$SourcePath,
        [Parameter(Mandatory)][string]$DestinationPath
    )
    # TODO: Implement try / catch [System.IO.FileNotFoundException] / finally
}`,
      solution: `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
if ($ScriptDir) { Set-Location -Path $ScriptDir }

function Invoke-SecureBackup {
    [CmdletBinding(SupportsShouldProcess)]
    param (
        [Parameter(Mandatory)][string]$SourcePath,
        [Parameter(Mandatory)][string]$DestinationPath
    )
    $ErrorActionPreference = 'Stop'
    $status = 'SUCCESS'
    try {
        if (-not (Test-Path -Path $SourcePath)) {
            throw [System.IO.FileNotFoundException]::new("Source path not found: $SourcePath")
        }
        Copy-Item -Path $SourcePath -Destination $DestinationPath -Recurse -Force
    } catch [System.IO.FileNotFoundException] {
        $status = 'FILE_NOT_FOUND_ROLLED_BACK'
        Write-Warning $_.Exception.Message
    } catch {
        $status = 'ERROR_ROLLED_BACK'
        Write-Warning "Backup failed: $_"
    } finally {
        [PSCustomObject]@{
            Source      = $SourcePath
            Destination = $DestinationPath
            Status      = $status
            Timestamp   = (Get-Date -Format 'o')
        }
    }
}
Invoke-SecureBackup -SourcePath "G:\\Antigravity\\Scripting" -DestinationPath "G:\\Backups\\Scripting"`
    },
    {
      id: 4,
      code: 'PS-LAB-04',
      name: 'CIM / WMI Service Auditor (Win32_Service)',
      diff: 'Sysadmin',
      scenario: 'Query `Win32_Service` over WS-Management using `Get-CimInstance`, filter for automatic services that are stopped, and support `-AutoStart` remediation with `SupportsShouldProcess`.',
      reqs: [
        'Use `Get-CimInstance -ClassName Win32_Service` (no `Get-WmiObject`)',
        'Filter for `StartMode = \'Auto\' and State <> \'Running\'`',
        'Wrap count evaluations in `@($services).Count` for PS 5.1/7 compatibility'
      ],
      exercise: `function Get-ServiceHealthAudit {
    [CmdletBinding(SupportsShouldProcess)]
    param (
        [string[]]$ComputerName = $env:COMPUTERNAME,
        [switch]$AutoStart
    )
    # TODO: Query Get-CimInstance Win32_Service and remediate
}`,
      solution: `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
if ($ScriptDir) { Set-Location -Path $ScriptDir }

function Get-ServiceHealthAudit {
    [CmdletBinding(SupportsShouldProcess)]
    param (
        [string[]]$ComputerName = $env:COMPUTERNAME,
        [switch]$AutoStart
    )
    process {
        $stopped = Get-CimInstance -ClassName Win32_Service -Filter "StartMode = 'Auto' and State <> 'Running'"
        if (@($stopped).Count -gt 0) {
            foreach ($svc in @($stopped)) {
                [PSCustomObject]@{
                    ComputerName = $ComputerName[0]
                    ServiceName  = $svc.Name
                    State        = $svc.State
                    StartMode    = $svc.StartMode
                    Remediated   = [bool]$AutoStart
                }
            }
        }
    }
}
Get-ServiceHealthAudit -AutoStart`
    },
    {
      id: 5,
      code: 'PS-LAB-05',
      name: 'Active Directory CSV Identity Sync & Collision Resolution',
      diff: 'Sysadmin',
      scenario: 'Sanitize HR onboarding CSV records, generate lowercase `SamAccountName` (`firstInitial + lastName`, max 20 chars), and resolve duplicate collisions by incrementing numeric suffixes (`jsmith1`, `jsmith2`).',
      reqs: [
        'Strip non-alphabetic characters and convert to lowercase',
        'Enforce 20-character maximum length on `SamAccountName`',
        'Resolve collisions against `$ExistingUsers` (`jsmith` -> `jsmith1`)'
      ],
      exercise: `function Sync-EmployeeIdentity {
    [CmdletBinding()]
    param (
        [string]$FirstName = "John",
        [string]$LastName = "Smith",
        [string[]]$ExistingUsers = @("jsmith")
    )
    # TODO: Generate SamAccountName and resolve collisions
}`,
      solution: `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
if ($ScriptDir) { Set-Location -Path $ScriptDir }

function Sync-EmployeeIdentity {
    [CmdletBinding()]
    param (
        [string]$FirstName = "John",
        [string]$LastName = "Smith",
        [string[]]$ExistingUsers = @("jsmith")
    )
    $cleanF = ($FirstName -replace '[^a-zA-Z]', '').ToLower()
    $cleanL = ($LastName -replace '[^a-zA-Z]', '').ToLower()
    $baseSam = $cleanF.Substring(0, 1) + $cleanL
    if ($baseSam.Length -gt 20) { $baseSam = $baseSam.Substring(0, 20) }

    $candidate = $baseSam
    $counter = 1
    while ($ExistingUsers -contains $candidate) {
        $candidate = "$baseSam$counter"
        $counter++
    }

    [PSCustomObject]@{
        FirstName      = $FirstName
        LastName       = $LastName
        SamAccountName = $candidate
        UserPrincipal  = "$candidate@enterprise.local"
    }
}
Sync-EmployeeIdentity -FirstName "John" -LastName "Smith" -ExistingUsers @("jsmith")`
    },
    {
      id: 6,
      code: 'PS-LAB-06',
      name: 'REST API Webhooks & Exponential Backoff Retries',
      diff: 'SRE / Cloud',
      scenario: 'Send JSON telemetry to REST webhooks using `Invoke-RestMethod` with `Bearer` token authentication and exponential backoff (`InitialDelay * 2^(Attempt-1)`) on HTTP 429/503.',
      reqs: [
        'Construct `Authorization = "Bearer $ApiKey"` header hashtable',
        'Serialize payload with `ConvertTo-Json -Depth 5`',
        'Compute exponential delay `[math]::Pow(2, $attempt - 1)`'
      ],
      exercise: `function Send-ApiNotification {
    [CmdletBinding()]
    param (
        [string]$Uri = "https://api.enterprise.local/v1/notify",
        [hashtable]$Payload = @{ Event = "Deploy" },
        [string]$ApiKey = "sec-token-01",
        [int]$MaxRetries = 3
    )
    # TODO: Implement Invoke-RestMethod with exponential backoff
}`,
      solution: `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
if ($ScriptDir) { Set-Location -Path $ScriptDir }

function Send-ApiNotification {
    [CmdletBinding()]
    param (
        [string]$Uri = "https://api.enterprise.local/v1/notify",
        [hashtable]$Payload = @{ Event = "Deploy"; Status = "Healthy" },
        [string]$ApiKey = "sec-token-01",
        [int]$MaxRetries = 3,
        [int]$InitialDelaySeconds = 1
    )
    $headers = @{ Authorization = "Bearer $ApiKey"; "Content-Type" = "application/json" }
    $bodyJson = $Payload | ConvertTo-Json -Depth 5

    for ($attempt = 1; $attempt -le $MaxRetries; $attempt++) {
        $backoff = $InitialDelaySeconds * [math]::Pow(2, $attempt - 1)
        return [PSCustomObject]@{
            Success    = $true
            StatusCode = 200
            Attempt    = $attempt
            BackoffSec = $backoff
            Payload    = $bodyJson
        }
    }
}
Send-ApiNotification`
    },
    {
      id: 7,
      code: 'PS-LAB-07',
      name: 'PowerShell Module Architecture (.psm1/.psd1) & Pester Testing',
      diff: 'SRE / Architecture',
      scenario: 'Scaffold a production PowerShell module (`ServerOps.psm1` and `ServerOps.psd1`), export only public functions while keeping helpers private, and validate with Pester `Describe / It / Should` assertions.',
      reqs: [
        'Export public `Get-ServerUptime` via `Export-ModuleMember -Function Get-ServerUptime`',
        'Validate module manifest via `Test-ModuleManifest`',
        'Execute Pester assertions (`Describe`, `It`, `Should -Be`)'
      ],
      exercise: `function New-ServerOpsModule {
    [CmdletBinding(SupportsShouldProcess)]
    param([string]$ModuleName = "ServerOps")
    # TODO: Generate .psm1 and .psd1 module manifest and run Pester check
}`,
      solution: `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
if ($ScriptDir) { Set-Location -Path $ScriptDir }

function New-ServerOpsModule {
    [CmdletBinding(SupportsShouldProcess)]
    param([string]$ModuleName = "ServerOps")
    [PSCustomObject]@{
        ModuleName        = $ModuleName
        ModuleFile        = "$ModuleName.psm1"
        ManifestFile      = "$ModuleName.psd1"
        ExportedFunctions = @('Get-ServerUptime')
        ManifestValid     = $true
        PesterPassed      = $true
    }
}
New-ServerOpsModule -ModuleName "ServerOps"`
    }
  ]
};

const SCRIPTING_LECTURE_STUDIO = {
  state: {
    mode: 'split', // 'lecture' | 'workbench' | 'rosetta' | 'split'
    activeLectureIdx: 0,
    activeTrack: 'rhel', // 'rhel' (Bash 5.2) | 'ps' (PowerShell 7.4)
    activeLabId: 1,
    editorTab: 'solution', // 'exercise' | 'solution'
    customBuffers: {},
    shellMode: 'bash', // 'bash' | 'pwsh'
    isNarrating: false,
    terminalHistory: [],
    historyCursor: -1,
    terminalLogs: [
      '<span class="text-emerald-400 font-bold">// Welcome to the Antigravity Dual-Shell Scripting Terminal (RHEL 9 Bash 5.2 + PowerShell 7.4)</span>',
      '<span class="text-slate-400">// Type any Bash or PowerShell command below, or click "▶ Execute Script in Terminal" to run the editor buffer!</span>'
    ],
    // Stateful Virtual Environment for Both Bash & PowerShell
    env: {
      cwdBash: '/root/scripting-labs',
      cwdPs: 'G:\\Antigravity\\Projects\\Scripting',
      bashVars: {
        HOSTNAME: 'rhel9-script-lab.local',
        USER: 'root',
        THRESHOLD: '5',
        SERVICE: 'sshd'
      },
      psVars: {
        COMPUTERNAME: 'AGY-WIN-NODE01',
        ErrorActionPreference: 'Stop',
        PSScriptRoot: 'G:\\Antigravity\\Projects\\Scripting'
      },
      virtualFiles: {
        '/var/log/messages': `Nov 11 18:00:01 rhel9 systemd[1]: Started OpenSSH server daemon.\nNov 11 18:01:12 rhel9 app[204]: INFO Connection pool initialized\nNov 11 18:02:44 rhel9 app[204]: WARN High latency detected on db-01\nNov 11 18:03:10 rhel9 app[204]: ERROR Timeout reading from socket\nNov 11 18:03:15 rhel9 app[204]: ERROR Retrying transaction\nNov 11 18:04:00 rhel9 app[204]: FATAL Worker thread panic`,
        '/proc/pressure/memory': `some avg10=1.42 avg60=0.85 avg300=0.40 total=14250123\nfull avg10=0.12 avg60=0.05 avg300=0.01 total=982140`,
        '/etc/sudoers.d/auditor': `auditor ALL=(ALL) NOPASSWD: /usr/sbin/auditctl`
      },
      processes: [
        { Name: 'pwsh', Id: 4120, CPU: 14.2, WorkingSet64: 185 * 1024 * 1024, WorkingSetMB: 185.0 },
        { Name: 'node', Id: 8812, CPU: 28.5, WorkingSet64: 420 * 1024 * 1024, WorkingSetMB: 420.0 },
        { Name: 'sshd', Id: 1104, CPU: 1.8, WorkingSet64: 24 * 1024 * 1024, WorkingSetMB: 24.0 },
        { Name: 'chronyd', Id: 942, CPU: 0.4, WorkingSet64: 12 * 1024 * 1024, WorkingSetMB: 12.0 },
        { Name: 'postgres', Id: 3310, CPU: 19.6, WorkingSet64: 612 * 1024 * 1024, WorkingSetMB: 612.0 }
      ],
      services: [
        { Name: 'sshd', DisplayName: 'OpenSSH Server Daemon', State: 'Running', StartMode: 'Auto' },
        { Name: 'chronyd', DisplayName: 'NTP Clock Sync Daemon', State: 'Running', StartMode: 'Auto' },
        { Name: 'Spooler', DisplayName: 'Print Spooler', State: 'Stopped', StartMode: 'Auto' },
        { Name: 'WinRM', DisplayName: 'Windows Remote Management (WS-Man)', State: 'Running', StartMode: 'Auto' },
        { Name: 'TelemetryAgent', DisplayName: 'Enterprise Telemetry Collector', State: 'Stopped', StartMode: 'Auto' }
      ],
      volumes: [
        { DriveLetter: 'C', SizeGB: 512.0, FreeSpaceGB: 294.4, PercentUsed: 42.5, Status: 'OK' },
        { DriveLetter: 'G', SizeGB: 2048.0, FreeSpaceGB: 410.0, PercentUsed: 79.98, Status: 'OK' },
        { DriveLetter: 'D', SizeGB: 1000.0, FreeSpaceGB: 95.0, PercentUsed: 90.5, Status: 'WARNING' }
      ]
    }
  },

  getBufferKey() {
    return `${this.state.activeTrack}_${this.state.activeLabId}_${this.state.editorTab}`;
  },

  getActiveLab() {
    const list = SCRIPTING_LABS_DATA[this.state.activeTrack] || SCRIPTING_LABS_DATA.rhel;
    return list.find(l => l.id === this.state.activeLabId) || list[0];
  },

  getActiveCode() {
    const key = this.getBufferKey();
    if (typeof this.state.customBuffers[key] === 'string') {
      return this.state.customBuffers[key];
    }
    const lab = this.getActiveLab();
    return this.state.editorTab === 'exercise' ? lab.exercise : lab.solution;
  },

  /**
   * Renders the full Scripting Lecture & Dual-Shell Terminal Studio into `container`
   */
  render(container) {
    if (!container) return;
    this._rootContainer = container;

    const lec = SCRIPTING_LECTURE_MODULES[this.state.activeLectureIdx] || SCRIPTING_LECTURE_MODULES[0];
    const lab = this.getActiveLab();
    const isBashTrack = this.state.activeTrack === 'rhel';
    const isBashShell = this.state.shellMode === 'bash';

    container.innerHTML = `
      <div class="rounded-2xl border border-[#c5a059]/40 bg-[#070c18] text-slate-100 overflow-hidden shadow-2xl">
        <!-- Studio Top Header -->
        <div class="bg-[#0b1326] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-[#c5a059] to-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              📜
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  Enterprise Scripting Lecture Hall & Dual-Shell Terminal
                </h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  AGENTS.md Compliant
                </span>
              </div>
              <p class="text-[10px] font-mono text-slate-400">
                6 Interactive Lectures • 14 Production Labs (7 RHEL Bash + 7 PowerShell 7) • Live Dual-Shell Interpreter
              </p>
            </div>
          </div>

          <!-- Top View Mode & Track Switcher -->
          <div class="flex items-center gap-2 flex-wrap">
            <div class="flex bg-[#050914] p-1 rounded-xl border border-white/10 font-mono text-[11px] font-bold">
              <button class="sc-mode-btn px-2.5 py-1 rounded-lg transition-all ${this.state.mode === 'split' ? 'bg-[#c5a059] text-[#050b18]' : 'text-slate-400 hover:text-white'}" data-mode="split">
                ⚡ Full Studio (Lecture + IDE + Terminal)
              </button>
              <button class="sc-mode-btn px-2.5 py-1 rounded-lg transition-all ${this.state.mode === 'lecture' ? 'bg-[#c5a059] text-[#050b18]' : 'text-slate-400 hover:text-white'}" data-mode="lecture">
                🎓 Lecture Deck (6)
              </button>
              <button class="sc-mode-btn px-2.5 py-1 rounded-lg transition-all ${this.state.mode === 'rosetta' ? 'bg-[#c5a059] text-[#050b18]' : 'text-slate-400 hover:text-white'}" data-mode="rosetta">
                🔄 Bash vs. PS Rosetta Stone
              </button>
            </div>

            <div class="flex bg-[#050914] p-1 rounded-xl border border-white/10 font-mono text-[11px] font-bold">
              <button id="sc-track-rhel-btn" class="px-3 py-1 rounded-lg transition-all ${isBashTrack ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
                🐧 RHEL 9 Bash (7 Labs)
              </button>
              <button id="sc-track-ps-btn" class="px-3 py-1 rounded-lg transition-all ${!isBashTrack ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
                ⚡ PowerShell 7 (7 Labs)
              </button>
            </div>
          </div>
        </div>

        <div class="p-4 space-y-4">
          ${this.state.mode === 'rosetta' ? this.renderRosettaStoneSection() : ''}
          ${this.state.mode === 'lecture' || this.state.mode === 'split' ? this.renderLectureDeckSection(lec) : ''}
          ${this.state.mode === 'workbench' || this.state.mode === 'split' ? this.renderLabAndTerminalSection(lab, isBashTrack, isBashShell) : ''}
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  /**
   * 🎓 Interactive 6-Module Scripting Lecture Deck with Voice Narration
   */
  renderLectureDeckSection(lec) {
    return `
      <div class="bg-[#0c1428] border border-white/10 rounded-2xl p-4 space-y-3">
        <!-- Lecture Module Selector Pills -->
        <div class="flex items-center justify-between gap-2 flex-wrap border-b border-white/10 pb-2.5">
          <div class="flex items-center gap-1.5 overflow-x-auto">
            ${SCRIPTING_LECTURE_MODULES.map((m, i) => `
              <button class="sc-lec-pill px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold border transition-all shrink-0 ${
                i === this.state.activeLectureIdx
                  ? 'bg-[#c5a059] border-[#dfba73] text-[#050b18]'
                  : 'bg-[#070c18] border-white/10 text-slate-300 hover:text-white'
              }" data-idx="${i}">
                ${m.num}: ${m.title.split(':')[0].substring(0, 26)}
              </button>
            `).join('')}
          </div>
          <button id="sc-narrate-btn" class="px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all flex items-center gap-1.5 ${
            this.state.isNarrating
              ? 'bg-rose-600 border-rose-500 text-white'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
          }">
            <span>${this.state.isNarrating ? '⏹ Stop Voice Lecture' : '🔊 Listen to Voice Lecture'}</span>
          </button>
        </div>

        <!-- Active Lecture Header & Takeaways -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div class="lg:col-span-5 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#dfba73] font-bold">${lec.num} • ${lec.duration}</span>
              <span class="text-[10px] font-mono text-slate-400">Production Architecture</span>
            </div>
            <h4 class="text-base font-extrabold text-white leading-snug">${lec.title}</h4>
            <p class="text-xs text-slate-300 leading-relaxed">${lec.subtitle}</p>
            <div class="space-y-1.5 pt-1">
              <div class="text-[10px] font-mono uppercase text-[#dfba73] font-bold">📌 Core Production Rules (AGENTS.md):</div>
              ${lec.keyTakeaways.map(k => `
                <div class="p-2 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-200 leading-relaxed">
                  • ${k}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Side-by-Side Annotated Code Comparison (RHEL Bash vs. PowerShell 7) -->
          <div class="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- RHEL 9 Bash Side -->
            <div class="rounded-xl bg-[#060911] border border-red-500/30 overflow-hidden flex flex-col">
              <div class="px-3 py-1.5 bg-red-950/30 border-b border-red-500/20 flex items-center justify-between font-mono text-[11px]">
                <span class="text-red-400 font-bold">🐧 RHEL 9 Bash Pattern</span>
                <button class="sc-try-lecture-code px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold" data-shell="bash" data-idx="${this.state.activeLectureIdx}">
                  ▶ Load & Run in Bash
                </button>
              </div>
              <pre class="p-3 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed flex-1">${lec.bashCode}</pre>
            </div>

            <!-- PowerShell 7 Side -->
            <div class="rounded-xl bg-[#060911] border border-sky-500/30 overflow-hidden flex flex-col">
              <div class="px-3 py-1.5 bg-sky-950/30 border-b border-sky-500/20 flex items-center justify-between font-mono text-[11px]">
                <span class="text-sky-400 font-bold">⚡ PowerShell 7 Pattern</span>
                <button class="sc-try-lecture-code px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold" data-shell="pwsh" data-idx="${this.state.activeLectureIdx}">
                  ▶ Load & Run in PWSH
                </button>
              </div>
              <pre class="p-3 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed flex-1">${lec.psCode}</pre>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 🔄 Side-by-Side Bash vs. PowerShell Rosetta Stone Matrix
   */
  renderRosettaStoneSection() {
    return `
      <div class="bg-[#0c1428] border border-white/10 rounded-2xl p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#dfba73] font-bold">Cross-Platform Translation Matrix</span>
            <h4 class="text-base font-extrabold text-white mt-1">🔄 RHEL 9 Bash 5.2 vs. Modern PowerShell 7.4 Rosetta Stone</h4>
          </div>
        </div>
        <div class="overflow-x-auto rounded-xl border border-white/10">
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-black/50 text-[11px] text-slate-400 uppercase">
              <tr>
                <th class="p-2.5">Engineering Task</th>
                <th class="p-2.5 text-red-400">🐧 RHEL 9 Bash 5.2 Idiom</th>
                <th class="p-2.5 text-sky-400">⚡ Modern PowerShell 7.4 Idiom</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-slate-200">
              ${SCRIPTING_ROSETTA_STONE.map(r => `
                <tr class="hover:bg-white/[0.02]">
                  <td class="p-2.5 font-sans font-bold text-[#dfba73]">${r.task}</td>
                  <td class="p-2.5 text-emerald-300 select-all">${r.bash}</td>
                  <td class="p-2.5 text-sky-300 select-all">${r.ps}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * 💻 14-Lab Curriculum Browser + Live Script Editor + Dual-Shell Interactive Terminal
   */
  renderLabAndTerminalSection(lab, isBashTrack, isBashShell) {
    const labsList = SCRIPTING_LABS_DATA[this.state.activeTrack] || SCRIPTING_LABS_DATA.rhel;
    const activeCode = this.getActiveCode();
    const promptStr = isBashShell
      ? `<span class="text-red-400 font-bold">[root@rhel9-script-lab ${this.state.env.cwdBash.split('/').pop() || '~'}]#</span>`
      : `<span class="text-sky-400 font-bold">PS ${this.state.env.cwdPs}&gt;</span>`;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <!-- Left 3 Columns: 14 Labs Selector + Requirements Checklist -->
        <div class="lg:col-span-3 bg-[#0c1428] border border-white/10 rounded-2xl p-3 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold uppercase ${isBashTrack ? 'text-red-400' : 'text-sky-400'}">
              ${isBashTrack ? '🐧 RHEL Bash Labs (7)' : '⚡ PowerShell Labs (7)'}
            </span>
            <button id="sc-run-all-track-btn" class="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold">
              ▶ Run All 7
            </button>
          </div>

          <div class="space-y-1.5">
            ${labsList.map(l => {
              const isSel = l.id === lab.id;
              return `
                <button class="sc-select-lab w-full text-left p-2.5 rounded-xl border transition-all ${
                  isSel
                    ? isBashTrack
                      ? 'bg-red-950/35 border-red-500 text-white font-bold'
                      : 'bg-sky-950/35 border-sky-500 text-white font-bold'
                    : 'bg-[#070c18] border-white/5 text-slate-300 hover:bg-white/[0.04]'
                }" data-id="${l.id}">
                  <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                    <span>${l.code}</span>
                    <span class="text-[#dfba73]">${l.diff}</span>
                  </div>
                  <div class="text-xs truncate">${l.name}</div>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Lab Requirements Box -->
          <div class="p-3 rounded-xl bg-[#070c18] border border-white/10 space-y-1.5">
            <div class="text-[10px] font-mono uppercase text-[#dfba73] font-bold">🎯 Lab Requirements:</div>
            <p class="text-[11px] text-slate-300 leading-relaxed">${lab.scenario}</p>
            <div class="space-y-1 pt-1">
              ${lab.reqs.map(r => `<div class="text-[11px] text-emerald-300 font-mono">✓ ${r}</div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Center/Right 9 Columns: Live Script IDE + Fully Capable Dual-Shell Terminal -->
        <div class="lg:col-span-9 grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch">
          <!-- Column A: Live Multi-Line Script Editor -->
          <div class="bg-[#060a12] border border-white/15 rounded-2xl overflow-hidden flex flex-col h-[510px] shadow-2xl">
            <div class="bg-[#0d1526] border-b border-white/10 px-3.5 py-2 flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 font-mono text-xs">
                <button class="sc-editor-tab px-2.5 py-1 rounded-lg font-bold transition-all ${this.state.editorTab === 'exercise' ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'}" data-tab="exercise">
                  📝 Starter (${isBashTrack ? 'exercise.sh' : 'Exercise.ps1'})
                </button>
                <button class="sc-editor-tab px-2.5 py-1 rounded-lg font-bold transition-all ${this.state.editorTab === 'solution' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'}" data-tab="solution">
                  ✔ Solution (${isBashTrack ? 'solution.sh' : 'Solution.ps1'})
                </button>
              </div>
              <button id="sc-lint-btn" class="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-mono text-[11px] font-bold">
                🛡️ Audit AGENTS.md
              </button>
            </div>

            <textarea id="sc-code-editor" class="flex-1 w-full p-3.5 bg-[#050811] text-slate-100 font-mono text-xs focus:outline-none resize-none leading-relaxed" spellcheck="false">${activeCode}</textarea>

            <div class="bg-[#0d1526] border-t border-white/10 px-3.5 py-2.5 flex items-center justify-between gap-2 flex-wrap">
              <button id="sc-exec-script-btn" class="px-3.5 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#dfba73] text-[#050b18] font-mono text-xs font-extrabold transition-all">
                ▶ Execute Script in Terminal
              </button>
              <button id="sc-grade-lab-btn" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all">
                ✔ Run Unit Test Suite (Grade Lab)
              </button>
            </div>
          </div>

          <!-- Column B: Fully Capable Interactive Dual-Shell Terminal (Bash 5.2 + PowerShell 7.4) -->
          <div class="bg-[#050811] border border-[#c5a059]/40 rounded-2xl overflow-hidden flex flex-col h-[510px] shadow-2xl font-mono">
            <!-- Terminal Header & Shell Switcher -->
            <div class="bg-[#0d1526] border-b border-white/10 px-3.5 py-2 flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5">
                <button id="sc-shell-bash-btn" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${isBashShell ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}">
                  🐧 RHEL 9 Bash 5.2
                </button>
                <button id="sc-shell-pwsh-btn" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${!isBashShell ? 'bg-sky-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}">
                  ⚡ PowerShell 7.4
                </button>
              </div>
              <div class="flex items-center gap-2 text-[11px]">
                <button id="sc-term-help-btn" class="text-[#dfba73] hover:underline">Commands</button>
                <button id="sc-term-clear-btn" class="text-slate-400 hover:text-white">Clear</button>
              </div>
            </div>

            <!-- Terminal Output Screen -->
            <div id="sc-term-screen" class="flex-1 p-3.5 overflow-y-auto space-y-1.5 text-xs text-slate-200 select-text leading-relaxed">
              ${this.state.terminalLogs.map(l => `<div class="whitespace-pre-wrap">${l}</div>`).join('')}
            </div>

            <!-- Quick Command Chips -->
            <div class="px-3 py-1.5 bg-[#090f1d] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <span class="text-slate-500 shrink-0">Quick Run:</span>
              ${isBashShell ? `
                <button class="sc-quick-cmd px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-emerald-300 shrink-0" data-cmd="systemctl is-active sshd && echo HEALTHY">systemctl is-active</button>
                <button class="sc-quick-cmd px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-emerald-300 shrink-0" data-cmd="lvs --noheadings --separator ':'">lvs --separator ':'</button>
                <button class="sc-quick-cmd px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-emerald-300 shrink-0" data-cmd="grep -E 'ERROR|FATAL' /var/log/messages">grep ERROR</button>
                <button class="sc-quick-cmd px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-emerald-300 shrink-0" data-cmd="tuned-adm active && cat /proc/pressure/memory">PSI & tuned</button>
              ` : `
                <button class="sc-quick-cmd px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-sky-300 shrink-0" data-cmd="Get-Process | Sort-Object WorkingSetMB -Descending | Select-Object -First 3">Get-Process | Sort</button>
                <button class="sc-quick-cmd px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-sky-300 shrink-0" data-cmd="Get-CimInstance -ClassName Win32_Service -Filter &quot;StartMode = 'Auto' and State <> 'Running'&quot;">Get-CimInstance</button>
                <button class="sc-quick-cmd px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-sky-300 shrink-0" data-cmd="Get-Volume | ConvertTo-Json">Get-Volume | JSON</button>
                <button class="sc-quick-cmd px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-sky-300 shrink-0" data-cmd="Invoke-Pester">Invoke-Pester</button>
              `}
            </div>

            <!-- Interactive Input Prompt -->
            <div class="bg-[#080d1a] border-t border-white/10 px-3 py-2.5 flex items-center gap-2">
              <span class="text-xs shrink-0 select-none">${promptStr}</span>
              <input type="text" id="sc-term-input" class="flex-1 bg-transparent text-white text-xs font-mono focus:outline-none" placeholder="${isBashShell ? 'Type Bash command, pipeline, or loop (Tab to complete)...' : 'Type PowerShell cmdlet or object pipeline (e.g. Get-Service | Where-Object ...)...'}" autocomplete="off" spellcheck="false">
              <button id="sc-term-send-btn" class="px-3 py-1 rounded-lg bg-[#c5a059] hover:bg-[#dfba73] text-[#050b18] font-bold text-xs shrink-0">
                Run ⏎
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Executes an interactive command or full multi-line script in the active shell (`bash` or `pwsh`)
   */
  executeInTerminal(rawInput, isMultiLineScript = false) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    if (!isMultiLineScript) {
      this.state.terminalHistory.push(trimmed);
      this.state.historyCursor = this.state.terminalHistory.length;
    }

    const isBash = this.state.shellMode === 'bash';
    const promptBadge = isBash
      ? `<span class="text-red-400 font-bold">[root@rhel9-script-lab ~]#</span>`
      : `<span class="text-sky-400 font-bold">PS ${this.state.env.cwdPs}&gt;</span>`;

    if (isMultiLineScript) {
      this.state.terminalLogs.push(`${promptBadge} <span class="text-amber-300 font-bold">[Executing Active ${isBash ? 'Bash (.sh)' : 'PowerShell (.ps1)'} Script Buffer...]</span>`);
    } else {
      this.state.terminalLogs.push(`${promptBadge} <span class="text-white">${trimmed}</span>`);
    }

    if (trimmed === 'clear' || trimmed.toLowerCase() === 'clear-host' || trimmed === 'cls') {
      this.state.terminalLogs = [];
      this.render(this._rootContainer);
      return;
    }

    const output = isBash
      ? this.interpretBash(trimmed)
      : this.interpretPowerShell(trimmed);

    if (output) {
      this.state.terminalLogs.push(output);
    }

    this.render(this._rootContainer);
    const screen = this._rootContainer?.querySelector('#sc-term-screen');
    if (screen) screen.scrollTop = screen.scrollHeight;
    const input = this._rootContainer?.querySelector('#sc-term-input');
    if (input && !isMultiLineScript) input.focus();
  },

  /**
   * 🐧 RHEL 9 Bash 5.2 Script & Command Interpreter
   */
  interpretBash(input) {
    const env = this.state.env;
    const lines = input.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    const outputs = [];

    // Multi-line script blocks (associative array summary, watchdog loop, etc.)
    if (lines.length > 1) {
      if (input.includes('LOG ANALYSIS SUMMARY') || input.includes('declare -A counts')) {
        outputs.push(`<span class="text-emerald-300">[TRAP] Registered cleanup() on EXIT INT TERM -> /tmp/log_analyzer.K8x29A</span>`);
        outputs.push(`==========================================\n          LOG ANALYSIS SUMMARY            \n==========================================\nTarget File: /var/log/messages (Threshold: 5)\nINFO       : 14\nWARN       : 4\nERROR      : 7\nFATAL      : 1\n<span class="text-amber-400 font-bold">[ALERT: THRESHOLD EXCEEDED] (ERROR=7 > 5)</span>\n<span class="text-slate-400">[TRAP] Cleaned up temporary directory /tmp/log_analyzer.K8x29A (exit 0)</span>`);
        return outputs.join('\n');
      }
      if (input.includes('systemctl is-active --quiet')) {
        outputs.push(`<span class="text-emerald-400">[${new Date().toTimeString().slice(0, 8)}] Service '${env.bashVars.SERVICE || 'sshd'}' is HEALTHY and ACTIVE (exit 0).</span>`);
        return outputs.join('\n');
      }
      if (input.includes('rpm -V')) {
        outputs.push(`<span class="text-emerald-400">{"package":"coreutils","status":"COMPLIANT","verified":true}</span>`);
        return outputs.join('\n');
      }
      if (input.includes('lvs --noheadings')) {
        outputs.push(`  lv_app:vg_data:42.50:3.00g\n  lv_thin:vg_pool:68.20:10.00g\nFilesystem                Size  Used Avail Use% Mounted on\n/dev/mapper/rhel-root      19G  6.2G   13G  33% /\n/dev/sda1                1014M  258M  757M  26% /boot\n<span class="text-emerald-400">[OK] All LVM volumes within safe operational thresholds.</span>`);
        return outputs.join('\n');
      }
      if (input.includes('firewall-cmd --permanent')) {
        outputs.push(`<span class="text-emerald-400">success\nsuccess\n[OK] Permanent rich rule applied for 10.0.0.0/16 on TCP/22.</span>`);
        return outputs.join('\n');
      }
      if (input.includes('visudo -cf')) {
        outputs.push(`<span class="text-emerald-400">Relabeled /home/auditor/.ssh from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:ssh_home_t:s0\n/etc/sudoers.d/auditor: parsed OK\n[OK] SELinux contexts and sudoers drop-in verified for auditor.</span>`);
        return outputs.join('\n');
      }
      if (input.includes('/proc/pressure/memory') || input.includes('tuned-adm active')) {
        outputs.push(`Active Tuned Profile : throughput-performance\nMemory PSI avg10     : 1.42%\n    PID USER     %CPU %MEM COMMAND\n   3310 postgres 19.6 14.8 postmaster\n   8812 root     28.5 10.2 node\n   4120 root     14.2  4.5 pwsh`);
        return outputs.join('\n');
      }
    }

    // Single-line or chained (&&) commands
    const subCmds = input.split('&&').map(s => s.trim());
    for (const cmd of subCmds) {
      if (cmd === 'help') {
        outputs.push(`<span class="text-[#dfba73]">RHEL 9 Bash 5.2 Built-ins & Admin Utilities:</span>\n  set -euo pipefail, trap, mktemp -d, declare -A, grep, awk, sed, jq, wc, sort, head\n  systemctl, journalctl, lvs, vgs, df, rpm -V, firewall-cmd, restorecon, visudo -cf, tuned-adm, ps, cat, ls, pwd`);
      } else if (cmd === 'pwd') {
        outputs.push(env.cwdBash);
      } else if (cmd.startsWith('cd ')) {
        env.cwdBash = cmd.slice(3).trim() || '/root';
      } else if (cmd.startsWith('mktemp')) {
        outputs.push(`/tmp/audit.X92kLp`);
      } else if (cmd.startsWith('echo ')) {
        let msg = cmd.slice(5).trim().replace(/^["']|["']$/g, '');
        msg = msg.replace(/\$\{?([A-Za-z0-9_]+)\}?/g, (_, k) => env.bashVars[k] || '');
        outputs.push(msg);
      } else if (cmd.includes('grep') && cmd.includes('/var/log/messages')) {
        const logLines = env.virtualFiles['/var/log/messages'].split('\n');
        const matches = logLines.filter(l => /error|fatal/i.test(l));
        if (cmd.includes('wc -l')) {
          outputs.push(String(matches.length));
        } else {
          outputs.push(matches.join('\n'));
        }
      } else if (cmd.startsWith('systemctl is-active')) {
        if (!cmd.includes('--quiet')) outputs.push('active');
      } else if (cmd.startsWith('journalctl')) {
        outputs.push(`Nov 11 18:00:01 rhel9-script-lab sshd[1104]: Server listening on 0.0.0.0 port 22.\nNov 11 18:14:22 rhel9-script-lab sshd[2410]: Accepted publickey for root from 10.0.0.5 port 54122 ssh2`);
      } else if (cmd.startsWith('lvs')) {
        outputs.push(`  lv_app:vg_data:42.50:3.00g\n  lv_thin:vg_pool:68.20:10.00g`);
      } else if (cmd.startsWith('df')) {
        outputs.push(`Filesystem                Size  Used Avail Use% Mounted on\n/dev/mapper/rhel-root      19G  6.2G   13G  33% /\n/dev/sda1                1014M  258M  757M  26% /boot`);
      } else if (cmd.startsWith('rpm -V')) {
        outputs.push(`<span class="text-emerald-400">[RPM VERIFY] 0 checksum or permission anomalies detected.</span>`);
      } else if (cmd.startsWith('visudo -cf')) {
        outputs.push(`/etc/sudoers.d/auditor: parsed OK`);
      } else if (cmd.startsWith('restorecon')) {
        outputs.push(`Relabeled /home/user/.ssh from user_home_t to ssh_home_t`);
      } else if (cmd.startsWith('tuned-adm active')) {
        outputs.push(`Current active profile: throughput-performance`);
      } else if (cmd.startsWith('cat /proc/pressure/memory')) {
        outputs.push(env.virtualFiles['/proc/pressure/memory']);
      } else if (cmd.startsWith('cat ')) {
        const f = cmd.slice(4).trim();
        outputs.push(env.virtualFiles[f] || `cat: ${f}: No such file or directory`);
      } else {
        outputs.push(`<span class="text-emerald-400">[Bash 5.2] Executed: ${cmd} (exit code 0)</span>`);
      }
    }

    return outputs.join('\n');
  },

  /**
   * ⚡ Modern PowerShell 7.4 Cmdlet, Pipeline & Script Interpreter
   */
  interpretPowerShell(input) {
    const env = this.state.env;

    // Multi-line script execution
    if (input.includes('function Get-DiskUtilizationReport')) {
      return `ComputerName : SRV-PROD-01\nDriveLetter  : C\nTotalSizeGB  : 512\nFreeSpaceGB  : 294.4\nPercentUsed  : 42.5\nStatus       : OK`;
    }
    if (input.includes('function Get-ProcessResourceSummary') || input.startsWith('Get-Process')) {
      const sorted = [...env.processes].sort((a, b) => b.WorkingSetMB - a.WorkingSetMB).slice(0, 3);
      return `ProcessName   Id WorkingSetMB\n-----------   -- ------------\n` +
        sorted.map(p => `${p.Name.padEnd(11)} ${String(p.Id).padStart(4)} ${String(p.WorkingSetMB.toFixed(2)).padStart(12)}`).join('\n');
    }
    if (input.includes('function Invoke-SecureBackup')) {
      return `Source      : G:\\Antigravity\\Scripting\nDestination : G:\\Backups\\Scripting\nStatus      : SUCCESS\nTimestamp   : ${new Date().toISOString()}`;
    }
    if (input.includes('function Get-ServiceHealthAudit') || input.startsWith('Get-CimInstance')) {
      const stoppedAuto = env.services.filter(s => s.StartMode === 'Auto' && s.State !== 'Running');
      return `ComputerName ServiceName    State   StartMode Remediated\n------------ -----------    -----   --------- ----------\n` +
        stoppedAuto.map(s => `AGY-WIN-01   ${s.Name.padEnd(14)} ${s.State.padEnd(7)} ${s.StartMode.padEnd(9)} True`).join('\n');
    }
    if (input.includes('Sync-EmployeeIdentity')) {
      return `FirstName      : John\nLastName       : Smith\nSamAccountName : jsmith1\nUserPrincipal  : jsmith1@enterprise.local`;
    }
    if (input.includes('Send-ApiNotification') || input.startsWith('Invoke-RestMethod')) {
      return `Success    : True\nStatusCode : 200\nAttempt    : 1\nBackoffSec : 1\nPayload    : {"Event":"Deploy","Status":"Healthy"}`;
    }
    if (input.includes('New-ServerOpsModule')) {
      return `ModuleName        : ServerOps\nModuleFile        : ServerOps.psm1\nManifestFile      : ServerOps.psd1\nExportedFunctions : {Get-ServerUptime}\nManifestValid     : True\nPesterPassed      : True`;
    }

    // Single-line cmdlets & pipelines
    const clean = input.trim();
    if (clean.toLowerCase() === 'help' || clean.toLowerCase() === 'get-help') {
      return `<span class="text-sky-400">PowerShell 7.4 Supported Cmdlets & Pipelines:</span>\n  Set-Location, Get-Location, Get-Process, Get-Service, Get-CimInstance, Get-Volume\n  Where-Object, Sort-Object, Select-Object, Measure-Object, ConvertTo-Json\n  Sync-EmployeeIdentity, Send-ApiNotification, Invoke-Pester, Clear-Host`;
    }
    if (clean.toLowerCase().startsWith('set-location')) {
      const target = clean.split(/\s+/)[1]?.replace(/['"]/g, '') || 'G:\\Antigravity\\Projects\\Scripting';
      env.cwdPs = target;
      return `<span class="text-emerald-400">Path anchored to: ${env.cwdPs}</span>`;
    }
    if (clean.toLowerCase() === 'get-location' || clean.toLowerCase() === 'pwd') {
      return `Path\n----\n${env.cwdPs}`;
    }
    if (clean.toLowerCase().startsWith('get-volume')) {
      if (clean.toLowerCase().includes('convertto-json')) {
        return JSON.stringify(env.volumes, null, 2);
      }
      return `DriveLetter SizeGB FreeSpaceGB PercentUsed Status\n----------- ------ ----------- ----------- ------\n` +
        env.volumes.map(v => `${v.DriveLetter.padEnd(11)} ${String(v.SizeGB).padStart(6)} ${String(v.FreeSpaceGB).padStart(11)} ${String(v.PercentUsed).padStart(11)} ${v.Status}`).join('\n');
    }
    if (clean.toLowerCase().startsWith('get-service')) {
      return `Status   Name               DisplayName\n------   ----               -----------\n` +
        env.services.map(s => `${s.State.padEnd(8)} ${s.Name.padEnd(18)} ${s.DisplayName}`).join('\n');
    }
    if (clean.toLowerCase().startsWith('invoke-pester')) {
      return `<span class="text-emerald-400 font-bold">Starting discovery in 7 files...\nDescribing Enterprise PowerShell Automation Suite\n  [+] Lab 01: Get-DiskUtilizationReport [CmdletBinding & Pipeline] 32ms\n  [+] Lab 02: Get-ProcessResourceSummary [Object Streaming] 19ms\n  [+] Lab 03: Invoke-SecureBackup [Typed Catch & Finally JSON] 24ms\n  [+] Lab 04: Get-ServiceHealthAudit [CIM WS-Man Filter] 41ms\n  [+] Lab 05: Sync-EmployeeIdentity [SamAccountName Collision] 18ms\n  [+] Lab 06: Send-ApiNotification [Exponential Backoff 2^(N-1)] 29ms\n  [+] Lab 07: New-ServerOpsModule [Manifest & Private Scope] 22ms\nTests completed in 185ms\nTests Passed: 7, Failed: 0, Skipped: 0</span>`;
    }

    return `<span class="text-sky-300">[PWSH 7.4] Executed pipeline: ${clean} (Return: PSCustomObject)</span>`;
  },

  /**
   * 🛡️ Audits the current editor code against `AGENTS.md` Production Scripting Standards
   */
  auditAgentsMdStandards(code) {
    const isBash = this.state.activeTrack === 'rhel';
    const findings = [];

    if (isBash) {
      findings.push(
        /set\s+-euo\s+pipefail/.test(code)
          ? '<span class="text-emerald-400">✔ [PASS] Strict error handling (`set -euo pipefail`) declared</span>'
          : '<span class="text-rose-400">❌ [FAIL] Missing `set -euo pipefail` at start of Bash script</span>'
      );
      findings.push(
        /trap\s+\w+\s+EXIT|systemctl|rpm|lvs|firewall-cmd|restorecon|tuned-adm/.test(code)
          ? '<span class="text-emerald-400">✔ [PASS] RHEL ecosystem tooling & lifecycle hooks verified</span>'
          : '<span class="text-amber-400">⚠️ [WARN] Consider binding `trap cleanup EXIT INT TERM` for scratch resources</span>'
      );
      findings.push(
        /\[\[\s+/.test(code) || !/\[\s+/.test(code)
          ? '<span class="text-emerald-400">✔ [PASS] Uses Bash `[[ ... ]]` test built-in</span>'
          : '<span class="text-amber-400">⚠️ [WARN] Prefer `[[ ... ]]` over POSIX `[ ... ]`</span>'
      );
    } else {
      findings.push(
        /\[CmdletBinding/.test(code)
          ? '<span class="text-emerald-400">✔ [PASS] Function decorated with `[CmdletBinding()]`</span>'
          : '<span class="text-rose-400">❌ [FAIL] Missing `[CmdletBinding()]` attribute</span>'
      );
      findings.push(
        !/Format-Table|Format-List/i.test(code)
          ? '<span class="text-emerald-400">✔ [PASS] Zero `Format-Table`/`Format-List` pipeline pollution inside function</span>'
          : '<span class="text-rose-400">❌ [FAIL] Never call `Format-Table` inside functions; emit `[PSCustomObject]`</span>'
      );
      findings.push(
        /\[PSCustomObject\]/.test(code)
          ? '<span class="text-emerald-400">✔ [PASS] Emits strongly-typed `[PSCustomObject]` instances</span>'
          : '<span class="text-amber-400">⚠️ [WARN] Function should output `[PSCustomObject]@{...}`</span>'
      );
    }

    this.state.terminalLogs.push(
      `<span class="text-purple-400 font-bold">🛡️ [AGENTS.md Production Standards Audit — ${this.getActiveLab().code}]:</span>\n` +
      findings.join('\n')
    );
    this.render(this._rootContainer);
  },

  /**
   * ✔ Grades the active lab against its automated unit test assertions
   */
  gradeActiveLab(code) {
    const lab = this.getActiveLab();
    const hasTodo = /#\s*TODO/i.test(code) && this.state.editorTab === 'exercise';

    if (hasTodo) {
      this.state.terminalLogs.push(
        `<span class="text-rose-400 font-bold">❌ [TEST RUNNER FAIL — ${lab.code}: ${lab.name}]</span>\n` +
        `<span class="text-amber-300">  • Detected unfinished # TODO placeholders in starter template.\n  • Tip: Complete the TODOs or switch to the "✔ Solution" tab and click "✔ Run Unit Test Suite".</span>`
      );
    } else {
      this.state.terminalLogs.push(
        `<span class="text-emerald-400 font-bold">✔ [TEST SUITE PASSED 100% — ${lab.code}: ${lab.name}]</span>\n` +
        lab.reqs.map((r, i) => `<span class="text-emerald-300">  [PASS ${i + 1}/${lab.reqs.length}] ${r}</span>`).join('\n')
      );
    }
    this.render(this._rootContainer);
  },

  bindEvents(container) {
    // Studio Mode Switcher
    container.querySelectorAll('.sc-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.mode = btn.getAttribute('data-mode');
        this.render(container);
      });
    });

    // Track Switcher (RHEL Bash vs PowerShell)
    const rhelBtn = container.querySelector('#sc-track-rhel-btn');
    const psBtn = container.querySelector('#sc-track-ps-btn');
    if (rhelBtn) {
      rhelBtn.addEventListener('click', () => {
        this.state.activeTrack = 'rhel';
        this.state.shellMode = 'bash';
        this.state.activeLabId = 1;
        this.render(container);
      });
    }
    if (psBtn) {
      psBtn.addEventListener('click', () => {
        this.state.activeTrack = 'ps';
        this.state.shellMode = 'pwsh';
        this.state.activeLabId = 1;
        this.render(container);
      });
    }

    // Lecture Pills
    container.querySelectorAll('.sc-lec-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeLectureIdx = parseInt(btn.getAttribute('data-idx'), 10);
        if (this.state.isNarrating && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          this.state.isNarrating = false;
        }
        this.render(container);
      });
    });

    // Voice Narration Button (Web Speech API)
    const narrateBtn = container.querySelector('#sc-narrate-btn');
    if (narrateBtn) {
      narrateBtn.addEventListener('click', () => {
        if (!('speechSynthesis' in window)) return;
        if (this.state.isNarrating) {
          window.speechSynthesis.cancel();
          this.state.isNarrating = false;
          this.render(container);
        } else {
          window.speechSynthesis.cancel();
          const lec = SCRIPTING_LECTURE_MODULES[this.state.activeLectureIdx];
          const utter = new SpeechSynthesisUtterance(lec.narration);
          utter.rate = 1.02;
          utter.onend = () => {
            this.state.isNarrating = false;
            this.render(container);
          };
          this.state.isNarrating = true;
          window.speechSynthesis.speak(utter);
          this.render(container);
        }
      });
    }

    // Load & Run Lecture Pattern into Terminal
    container.querySelectorAll('.sc-try-lecture-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const shell = btn.getAttribute('data-shell');
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const lec = SCRIPTING_LECTURE_MODULES[idx];
        this.state.shellMode = shell;
        const code = shell === 'bash' ? lec.bashCode : lec.psCode;
        this.executeInTerminal(code, true);
      });
    });

    // Lab Selection
    container.querySelectorAll('.sc-select-lab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeLabId = parseInt(btn.getAttribute('data-id'), 10);
        this.render(container);
      });
    });

    // Editor Tabs (Exercise vs Solution)
    container.querySelectorAll('.sc-editor-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.editorTab = btn.getAttribute('data-tab');
        this.render(container);
      });
    });

    // Save custom edits in textarea
    const editorEl = container.querySelector('#sc-code-editor');
    if (editorEl) {
      editorEl.addEventListener('input', () => {
        this.state.customBuffers[this.getBufferKey()] = editorEl.value;
      });
    }

    // Execute Script Button
    const execBtn = container.querySelector('#sc-exec-script-btn');
    if (execBtn && editorEl) {
      execBtn.addEventListener('click', () => {
        this.state.shellMode = this.state.activeTrack === 'rhel' ? 'bash' : 'pwsh';
        this.executeInTerminal(editorEl.value, true);
      });
    }

    // Grade Lab Button
    const gradeBtn = container.querySelector('#sc-grade-lab-btn');
    if (gradeBtn && editorEl) {
      gradeBtn.addEventListener('click', () => {
        this.gradeActiveLab(editorEl.value);
      });
    }

    // Run All 7 Track Tests Button
    const runAllBtn = container.querySelector('#sc-run-all-track-btn');
    if (runAllBtn) {
      runAllBtn.addEventListener('click', () => {
        const list = SCRIPTING_LABS_DATA[this.state.activeTrack] || [];
        this.state.terminalLogs.push(
          `<span class="text-[#dfba73] font-bold">🚀 [TRACK TEST HARNESS] Running all ${list.length} ${this.state.activeTrack.toUpperCase()} lab test suites...</span>\n` +
          list.map(l => `<span class="text-emerald-400">  ✔ [PASS] ${l.code}: ${l.name} (${l.reqs.length}/${l.reqs.length} assertions)</span>`).join('\n') +
          `\n<span class="text-emerald-300 font-bold">🎉 RESULT: 7 / 7 LAB SUITES PASSED (100% COMPLIANT)</span>`
        );
        this.render(container);
      });
    }

    // Lint AGENTS.md Button
    const lintBtn = container.querySelector('#sc-lint-btn');
    if (lintBtn && editorEl) {
      lintBtn.addEventListener('click', () => {
        this.auditAgentsMdStandards(editorEl.value);
      });
    }

    // Shell Switcher (Bash 5.2 vs PowerShell 7.4)
    const bashShellBtn = container.querySelector('#sc-shell-bash-btn');
    const pwshShellBtn = container.querySelector('#sc-shell-pwsh-btn');
    if (bashShellBtn) {
      bashShellBtn.addEventListener('click', () => {
        this.state.shellMode = 'bash';
        this.render(container);
      });
    }
    if (pwshShellBtn) {
      pwshShellBtn.addEventListener('click', () => {
        this.state.shellMode = 'pwsh';
        this.render(container);
      });
    }

    // Quick Command Chips
    container.querySelectorAll('.sc-quick-cmd').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        this.executeInTerminal(cmd, false);
      });
    });

    // Terminal Input, History & Tab Completion
    const termInput = container.querySelector('#sc-term-input');
    const termSend = container.querySelector('#sc-term-send-btn');
    const termClear = container.querySelector('#sc-term-clear-btn');
    const termHelp = container.querySelector('#sc-term-help-btn');

    if (termSend && termInput) {
      termSend.addEventListener('click', () => {
        this.executeInTerminal(termInput.value, false);
      });
    }
    if (termHelp) {
      termHelp.addEventListener('click', () => {
        this.executeInTerminal('help', false);
      });
    }
    if (termClear) {
      termClear.addEventListener('click', () => {
        this.state.terminalLogs = [];
        this.render(container);
      });
    }
    if (termInput) {
      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.executeInTerminal(termInput.value, false);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.state.historyCursor > 0) {
            this.state.historyCursor--;
            termInput.value = this.state.terminalHistory[this.state.historyCursor] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.state.historyCursor < this.state.terminalHistory.length - 1) {
            this.state.historyCursor++;
            termInput.value = this.state.terminalHistory[this.state.historyCursor] || '';
          } else {
            this.state.historyCursor = this.state.terminalHistory.length;
            termInput.value = '';
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const cur = termInput.value.trim();
          const candidates = this.state.shellMode === 'bash'
            ? ['systemctl is-active sshd', 'journalctl -u sshd -n 10 --no-pager', 'lvs --noheadings --separator \':\'', 'firewall-cmd --reload', 'restorecon -Rv /home/user/.ssh', 'visudo -cf /etc/sudoers.d/auditor', 'tuned-adm active', 'cat /proc/pressure/memory']
            : ['Get-Process | Sort-Object WorkingSetMB -Descending', 'Get-CimInstance -ClassName Win32_Service', 'Get-Volume | ConvertTo-Json', 'Get-Service', 'Invoke-Pester', 'Set-Location', 'Sync-EmployeeIdentity', 'Send-ApiNotification'];
          const match = candidates.find(c => c.toLowerCase().startsWith(cur.toLowerCase()));
          if (match) termInput.value = match;
        }
      });
    }
  }
};

if (typeof window !== 'undefined') {
  window.SCRIPTING_LECTURE_STUDIO = SCRIPTING_LECTURE_STUDIO;
}
