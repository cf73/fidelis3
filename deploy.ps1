# Deployment script for Fidelis3 - React + Statamic
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "react\package.json")) {
    Write-Host "❌ Error: React app not found in react/ folder" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "artisan")) {
    Write-Host "❌ Error: Laravel/Statamic not found in root folder" -ForegroundColor Red
    exit 1
}

# Step 1: Build React app
Write-Host "📦 Step 1: Building React app..." -ForegroundColor Yellow
& .\build-react.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ React build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Prepare Statamic for production
Write-Host "🔧 Step 2: Preparing Statamic for production..." -ForegroundColor Yellow

# Clear Laravel caches
Write-Host "   Clearing Laravel caches..." -ForegroundColor Cyan
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
Write-Host "   Optimizing for production..." -ForegroundColor Cyan
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Step 3: Create deployment package
Write-Host "📁 Step 3: Creating deployment package..." -ForegroundColor Yellow

$deployFolder = "deploy"
if (Test-Path $deployFolder) {
    Remove-Item $deployFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $deployFolder

# Copy necessary files (exclude development files)
$includePaths = @(
    "app",
    "bootstrap",
    "config", 
    "content",
    "database",
    "lang",
    "public",
    "resources",
    "routes",
    "storage",
    "vendor",
    "artisan",
    "composer.json",
    "composer.lock",
    "nginx.conf",
    ".env.example"
)

$excludePaths = @(
    "node_modules",
    "react\node_modules",
    "react\dist",
    "react\.git",
    "react\*.log",
    "storage\logs\*",
    "storage\framework\cache\*",
    "storage\framework\sessions\*",
    "storage\framework\views\*",
    ".git",
    ".vscode",
    "exports",
    "site",
    "assets",
    "tests"
)

Write-Host "   Copying files to deployment folder..." -ForegroundColor Cyan
foreach ($path in $includePaths) {
    if (Test-Path $path) {
        Copy-Item $path -Destination $deployFolder -Recurse -Force
    }
}

# Copy React source (for future builds on server)
Write-Host "   Copying React source for server builds..." -ForegroundColor Cyan
Copy-Item "react" -Destination "$deployFolder\react" -Recurse -Force

# Remove development files from deployment
Write-Host "   Cleaning deployment package..." -ForegroundColor Cyan
foreach ($path in $excludePaths) {
    $fullPath = "$deployFolder\$path"
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Recurse -Force
    }
}

# Create deployment instructions
$deployInstructions = @"
# Fidelis3 Deployment Instructions

## Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- PHP 8.1+
- Nginx
- MySQL 8.0+ or PostgreSQL 13+
- Composer
- Node.js 18+

## Deployment Steps

1. **Upload files to server:**
   ```bash
   scp -r deploy/* user@your-server:/var/www/fidelis3/
   ```

2. **Set up environment:**
   ```bash
   cd /var/www/fidelis3
   cp .env.example .env
   # Edit .env with your database and domain settings
   ```

3. **Install dependencies:**
   ```bash
   composer install --no-dev --optimize-autoloader
   npm install --prefix react
   ```

4. **Build React app:**
   ```bash
   npm run build --prefix react
   cp -r react/dist/* public/
   ```

5. **Set up database:**
   ```bash
   php artisan migrate
   php artisan stache:clear
   php artisan stache:warm
   ```

6. **Set permissions:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

7. **Configure Nginx:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/fidelis3
   sudo ln -s /etc/nginx/sites-available/fidelis3 /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

8. **Start Statamic API server:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   # Or use Supervisor for production
   ```

## Environment Variables (.env)
```
APP_NAME=Fidelis3
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fidelis3
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

STATAMIC_API_ENABLED=true
STATAMIC_API_ROUTE=api
```

## SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
"@

Set-Content "$deployFolder\DEPLOYMENT.md" $deployInstructions

# Step 4: Create production build script for server
$serverBuildScript = @"
#!/bin/bash
# Production build script for server

echo "Building React app for production..."
cd react
npm install
npm run build
cd ..

echo "Copying React build to public folder..."
cp -r react/dist/* public/

echo "Clearing Laravel caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Build completed!"
"@

Set-Content "$deployFolder\build.sh" $serverBuildScript

Write-Host "✅ Deployment package created successfully!" -ForegroundColor Green
Write-Host "📁 Deployment folder: $deployFolder" -ForegroundColor Cyan
Write-Host "📋 See $deployFolder\DEPLOYMENT.md for instructions" -ForegroundColor Cyan
Write-Host "🚀 Ready to upload to DigitalOcean!" -ForegroundColor Green 