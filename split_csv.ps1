param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [Parameter(Mandatory=$true)][string]$OutDir,
  [int]$RowsPerChunk = 300000
)

$ErrorActionPreference = 'Stop'

if (!(Test-Path $InputPath)) { throw "Input not found: $InputPath" }
if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

$sr = [System.IO.StreamReader]::new($InputPath)
$header = $sr.ReadLine()
if (-not $header) { throw "CSV appears empty" }

$script:sw = $null
$rowInChunk = 0
$chunkIndex = 1

function New-ChunkWriter([int]$idx) {
  if ($script:sw) { $script:sw.Flush(); $script:sw.Close() }
  $outPath = Join-Path $OutDir ("taxa_part_{0:D3}.csv" -f $idx)
  $script:sw = [System.IO.StreamWriter]::new($outPath, $false, [System.Text.Encoding]::UTF8)
  $script:sw.WriteLine($header)
}

New-ChunkWriter -idx $chunkIndex

while (($line = $sr.ReadLine()) -ne $null) {
  $script:sw.WriteLine($line)
  $rowInChunk++
  if ($rowInChunk -ge $RowsPerChunk) {
    $rowInChunk = 0
    $chunkIndex++
    New-ChunkWriter -idx $chunkIndex
  }
}

if ($script:sw) { $script:sw.Flush(); $script:sw.Close() }
$sr.Close()

Write-Host "Wrote $($chunkIndex) chunk file(s) to $OutDir"
