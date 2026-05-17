$body = @{ text = "The committee must comply with all institutional directives immediately. All staff are required to submit their reports by end of day. Failure to comply will result in disciplinary action." } | ConvertTo-Json
Write-Host "Sending request to live API..."
try {
    $r = Invoke-WebRequest -Uri "https://pmddproject.vercel.app/api/analyze" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing -TimeoutSec 65
    Write-Host "STATUS:" $r.StatusCode
    $data = $r.Content | ConvertFrom-Json
    Write-Host "RUNTIME:" $data.runtime_seconds "seconds"
    Write-Host "SEGMENTS:" $data.segments.Count
    Write-Host "DRIFT:" $data.final_output.math_scores.overall_drift_score
    Write-Host "SUCCESS - all results returned correctly"
} catch {
    Write-Host "FAILED:" $_.Exception.Message
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "BODY:" $reader.ReadToEnd()
    }
}
