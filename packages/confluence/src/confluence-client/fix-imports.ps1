# Get all TypeScript files in the current directory
$tsFiles = Get-ChildItem -Path . -Filter "*.ts" -Recurse

# Counter for modified files
$modifiedCount = 0

foreach ($file in $tsFiles) {
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw

    # Use regex to find and replace only regular import statements (not import type) that don't end with .js
    # This pattern looks for import statements that aren't "import type" followed by path that doesn't end with .js
#     $newContent = $content -replace "(import\s+(?!type\s+)(?:\{[^}]+\}|\*\s+as\s+[^;]+|\S+\s+,\s+(?:\{[^}]+\})|\S+)\s+from\s+['`"])([^'`"]+?)(?!\.js)(['`"];)", '$1$2.js$3'
#     $newContent = $content -replace "(import\s+(?:type\s+)?(?:\{[^}]+\}|\*\s+as\s+[^;]+)\s+from\s+['`"])([^'`"]+)(['`"];)", '$1$2.js$3'
    $newContent = $content -replace "(import\s+(?:type\s+)?(?:\{[^}]+\}|\*\s+as\s+[^;]+)\s+from\s+['`"])([^'`"]+)(['`"];)", '$1$2.js$3'


    # Skip files that don't need changes
    if ($content -ne $newContent) {
        # Write the modified content back to the file
        Set-Content -Path $file.FullName -Value $newContent

        # Increment counter and output progress
        $modifiedCount++
        Write-Host "Modified: $($file.FullName)"
    }
}

Write-Host "Complete! Modified $modifiedCount files."
