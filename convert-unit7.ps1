$files = Get-ChildItem -Recurse -Include *.html
$replacements = @{
  'Unit 7 ·' = 'Unit 8 ·'
  'UNIT 7 ·' = 'UNIT 8 ·'
  'ELECTRIC 7 · POMI · ELECTRICAL MAINTENANCE UNIT 7' = 'ELECTRIC 8 · POMI · ELECTRICAL MAINTENANCE UNIT 8'
  'POMI · ELECTRICAL MAINTENANCE UNIT 7' = 'POMI · ELECTRICAL MAINTENANCE UNIT 8'
  'Portal check sheet Preventive Maintenance — EIC Unit 7 POMI' = 'Portal check sheet Preventive Maintenance — EIC Unit 8 POMI'
  'UNIT 7 — POMI' = 'UNIT 8 — POMI'
  '<option>Unit 7</option>' = '<option>Unit 8</option>'
  'Unit 7 ECO. HOPPER' = 'Unit 8 ECO. HOPPER'
  'PM Unit 7' = 'PM Unit 8'
  'unit 7 apparent' = 'unit 8 apparent'
  'UNIT 7 ECO' = 'UNIT 8 ECO'
}

$count = 0
foreach ($f in $files) {
  try {
    $content = [System.IO.File]::ReadAllText($f.FullName)
    $before = $content
    foreach ($k in $replacements.Keys) {
      $content = $content.Replace($k, $replacements[$k])
    }
    if ($content -ne $before) {
      [System.IO.File]::WriteAllText($f.FullName, $content)
      $count++
      Write-Host "✓ $($f.Name)"
    }
  } catch {
    Write-Host "✗ $($f.Name): $_"
  }
}
Write-Host "Done — $count files updated"
