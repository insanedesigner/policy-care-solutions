# Simple PowerShell Local HTTP Web Server for Policy Care Solutions
$port = 8080
$url = "http://localhost:$port/"
$folder = $PSScriptRoot

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Policy Care Solutions - Local Web Server Running" -ForegroundColor Green
Write-Host " Website URL: $url" -ForegroundColor Yellow
Write-Host " Advisors: Sudeep S, Amrutha & Sathish Kumar A (Policy Care Solutions)" -ForegroundColor White
Write-Host " Press Ctrl+C in terminal to stop server" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Cyan

# Open default browser
Start-Process $url

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

$mimeTypes = @{
    ".html" = "text/html";
    ".css"  = "text/css";
    ".js"   = "application/javascript";
    ".json" = "application/json";
    ".png"  = "image/png";
    ".jpg"  = "image/jpeg";
    ".svg"  = "image/svg+xml";
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relativePath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relativePath)) {
            $relativePath = "index.html"
        }

        $filePath = Join-Path $folder $relativePath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
