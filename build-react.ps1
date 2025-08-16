# Build script for React app - copies to Statamic public folder
Write-Host "Building React app for production..." -ForegroundColor Green

# Navigate to React directory
Set-Location react

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Build the React app
Write-Host "Building React app..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (-not (Test-Path "dist")) {
    Write-Host "Build failed! No dist folder found." -ForegroundColor Red
    exit 1
}

# Navigate back to root
Set-Location ..

# Create backup of current public folder (excluding React files)
Write-Host "Creating backup of current public folder..." -ForegroundColor Yellow
if (Test-Path "public_backup") {
    Remove-Item "public_backup" -Recurse -Force
}
Copy-Item "public" "public_backup" -Recurse

# Remove old React files from public
Write-Host "Cleaning old React files from public..." -ForegroundColor Yellow
$reactFiles = @("index.html", "assets", "js", "css")
foreach ($file in $reactFiles) {
    if (Test-Path "public\$file") {
        Remove-Item "public\$file" -Recurse -Force
    }
}

# Copy new React build to public
Write-Host "Copying React build to public folder..." -ForegroundColor Yellow
Copy-Item "react\dist\*" "public\" -Recurse -Force

# Update API base URL in the built files
Write-Host "Updating API base URL for production..." -ForegroundColor Yellow
$indexHtml = Get-Content "public\index.html" -Raw
$indexHtml = $indexHtml -replace "http://localhost:8000/api", "/api"
Set-Content "public\index.html" $indexHtml

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "React app is now available in public/ folder" -ForegroundColor Cyan
Write-Host "Ready for deployment to DigitalOcean!" -ForegroundColor Cyan 