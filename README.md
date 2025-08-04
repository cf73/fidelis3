# Fidelis3 - React + Statamic Headless CMS

A modern React frontend with Statamic as a headless CMS backend, optimized for production deployment on DigitalOcean.

## 🏗️ Project Structure

```
fidelis3/
├── react/                    # React frontend application
│   ├── src/                 # React source code
│   ├── public/              # Static assets
│   ├── package.json         # React dependencies
│   └── vite.config.ts       # Vite configuration
├── public/                  # Web server document root
│   ├── index.html          # React app (built)
│   ├── assets/             # React assets (built)
│   ├── index.php           # Laravel entry point
│   └── ...                 # Statamic assets
├── app/                     # Laravel application
├── config/                  # Laravel configuration
├── content/                 # Statamic content
├── resources/               # Laravel resources
├── routes/                  # Laravel routes
├── storage/                 # Laravel storage
├── vendor/                  # Composer dependencies
├── artisan                  # Laravel command line
├── composer.json           # PHP dependencies
├── build-react.ps1         # React build script
├── deploy.ps1              # Deployment script
├── nginx.conf              # Production Nginx config
└── README.md               # This file
```

## 🚀 Development Setup

### Prerequisites
- PHP 8.1+
- Node.js 18+
- Composer
- MySQL/PostgreSQL

### 1. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install React dependencies
cd react
npm install
cd ..
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your settings
# Make sure to set:
# - APP_URL=http://localhost:8000
# - STATAMIC_API_ENABLED=true
# - STATAMIC_API_ROUTE=api
```

### 3. Start Development Servers

**Terminal 1 - Statamic API:**
```bash
php artisan serve --port=8000
```

**Terminal 2 - React Development:**
```bash
cd react
npm run dev
```

### 4. Access the Application

- **React App:** http://localhost:5173
- **Statamic API:** http://localhost:8000/api
- **Statamic Admin:** http://localhost:8000/cp

## 🏭 Production Build

### Build React App
```bash
.\build-react.ps1
```

This script will:
1. Build the React app for production
2. Copy built files to `public/` folder
3. Update API URLs for production
4. Create a backup of the current public folder

### Create Deployment Package
```bash
.\deploy.ps1
```

This script will:
1. Build the React app
2. Optimize Laravel for production
3. Create a deployment package in `deploy/` folder
4. Include all necessary files for server deployment

## 🌐 Production Deployment

### Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- PHP 8.1+
- Nginx
- MySQL 8.0+ or PostgreSQL 13+
- Composer
- Node.js 18+

### Deployment Steps

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

## 🔧 Architecture

### How It Works

1. **Nginx** serves static files from `public/` folder
2. **React app** handles frontend routing (`/products`, `/about`, etc.)
3. **API requests** (`/api/*`) are proxied to Statamic API
4. **Statamic** serves as a headless CMS via REST API

### Request Flow

```
User visits /products
├── Nginx checks for /products file ❌
├── Serves /index.html (React app) ✅
├── React app loads
├── Makes API call to /api/products
├── Nginx proxies to localhost:8000/api/products
├── Statamic returns JSON data
└── React displays the page
```

## 📁 Key Files

- **`build-react.ps1`** - Builds React app and copies to public folder
- **`deploy.ps1`** - Creates production deployment package
- **`nginx.conf`** - Production Nginx configuration
- **`react/src/lib/statamic.ts`** - API client for Statamic
- **`public/index.php`** - Laravel entry point

## 🔄 Development Workflow

1. **Edit React code** in `react/src/`
2. **Edit Statamic content** via admin panel or content files
3. **Test locally** with dual development servers
4. **Build for production** with `.\build-react.ps1`
5. **Deploy** with `.\deploy.ps1`

## 🛠️ Troubleshooting

### React Build Issues
- Check Node.js version (18+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Statamic API Issues
- Check `.env` configuration
- Clear Laravel caches: `php artisan cache:clear`
- Verify API is enabled: `STATAMIC_API_ENABLED=true`

### Production Issues
- Check Nginx configuration
- Verify file permissions
- Check Laravel logs: `storage/logs/laravel.log`

## 📚 Additional Resources

- [Statamic Documentation](https://statamic.dev/docs)
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
