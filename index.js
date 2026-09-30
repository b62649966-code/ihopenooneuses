# =========================================================================
#            FORTNITE LEGACY PRIVATE SERVER RUNTIME AUTOMATION
# =========================================================================
# Target Environment: Standard User Context (No Admin Required)
# Target Endpoint: Remote Cloud Backend Deployment Layer
# =========================================================================

# 1. ENFORCE CLEAN ENVIRONMENT CONTEXT
Write-Host "[*] Purging active background process trees..." -ForegroundColor Yellow
Stop-Process -Name "FortniteClient-Win64-Shipping" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# 2. FILE SYSTEM PATH STRUCTURING
$TargetBuildPath = "C:\Users\User\Documents\Era\builds\ea8efa76-bc89-4132-b5da-397680d3a7bf"
if (-not (Test-Path -Path $TargetBuildPath)) {
    Write-Error "[-] Critical: The target directory path does not exist. Verify your installation."
    return
}

# Jump directory context into the root folder target
cd $TargetBuildPath

$BinarySubPath = "FortniteGame\Binaries\Win64"
$ExecutableFile = Join-Path $BinarySubPath "FortniteClient-Win64-Shipping.exe"
$ConfigDirectory = "FortniteGame\Config"

# 3. REMOTE SERVICES CONFIGURATION
$TargetDomain = "://onrender.com"
$TargetUrl = "https://$TargetDomain"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      POWERSHELL COBALT ENGINE LOCAL CONTROLLER         " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 4. INITIALIZE AUTOMATED REDIRECTION OVERRIDES (DefaultEngine.ini)
if (-not (Test-Path -Path $ConfigDirectory)) {
    New-Item -ItemType Directory -Force -Path $ConfigDirectory | Out-Null
}

$EngineOverrideContent = @"
[OnlineSubsystemMcp]
bEnabled=true
szMcpBackendUrl=$TargetUrl
szBaseUrl=$TargetUrl

[OnlineSubsystemMcp.OnlineSubsystemMcpMcp]
szServerUrl=$TargetUrl
szServerStatusUrl=$TargetUrl
szServerStatusEulaUrl=$TargetUrl

[Xmpp]
szServerUrl=$TargetDomain
iServerPort=443
bUseSSL=true
"@

Set-Content -Path (Join-Path $ConfigDirectory "DefaultEngine.ini") -Value $EngineOverrideContent -Force
Write-Host "[+] Local engine network redirect matrix initialized." -ForegroundColor Green

# 5. DYNAMIC .NET MEMORY LAYER HOOK (SSL Validation Bypass)
$CsharpPayload = @"
using System;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

public class SecurityBypassEngine {
    public static void DisableValidation() {
        ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;
    }
}
"@

try {
    # Inline compiler compilation tracking
    Add-Type -TypeDefinition $CsharpPayload -ErrorAction SilentlyContinue
    [SecurityBypassEngine]::DisableValidation()
    Write-Host "[+] Runtime let-encrypt SSL certificate trust validation bypassed." -ForegroundColor Green
} catch {
    # If type exists from previous runtime session
    [SecurityBypassEngine]::DisableValidation()
}

# 6. WAKE CONTAINER INFRASTRUCTURE
Write-Host "[*] Dispatching keep-alive query packet to remote cloud array..." -ForegroundColor Yellow
try {
    $null = Invoke-WebRequest -Uri $TargetUrl -TimeoutSec 15 -ErrorAction SilentlyContinue
    Write-Host "[+] Cloud service responsive and listening." -ForegroundColor Green
} catch {
    Write-Host "[!] Handshake acknowledgement delayed; proceeding to native invocation layer..." -ForegroundColor Maroon
}

# 7. EXECUTE TARGET GAME CLIENT
$LaunchArguments = "-epicapp=Fortnite -epicenv=Prod -epiclocale=en -epicportal -noeac -nobattleye -fltoken=000000000000000000000000 -skippatchcheck -NoPatchCheck -noverify -log -AUTH_TYPE=epic -AUTH_LOGIN=clouduser@lawin.com -AUTH_PASSWORD=password"

if (Test-Path -Path $ExecutableFile) {
    Write-Host "[+] Executing binary environment loop..." -ForegroundColor Green
    Start-Process -FilePath $ExecutableFile -ArgumentList $LaunchArguments -WorkingDirectory $BinarySubPath
    Write-Host "[SUCCESS] Client loaded! Track traffic signatures via your Render panel logs." -ForegroundColor Green
} else {
    Write-Error "[-] Failure: Could not locate binary at: $ExecutableFile. Verify installation components."
}
