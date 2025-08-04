# Statamic API Setup for Headless CMS

## 🚀 **Enable Statamic API**

To use Statamic as a headless CMS with the React app, you need to enable the API.

### **Step 1: Enable API in Statamic Config**

Update `config/statamic/api.php`:

```php
<?php

return [
    'enabled' => env('STATAMIC_API_ENABLED', true),

    'resources' => [
        'collections' => true,
        'navs' => true,
        'taxonomies' => true,
        'assets' => true,
        'globals' => true,
        'forms' => true,
        'users' => false,
    ],

    'route' => env('STATAMIC_API_ROUTE', 'api'),

    'middleware' => env('STATAMIC_API_MIDDLEWARE', 'api'),

    'pagination_size' => 50,

    'cache' => [
        'expiry' => 60,
    ],

    'excluded_keys' => [
        'edit_url',
        'api_url',
        'last_modified',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ],
];
```

### **Step 2: Add Environment Variables**

Add to your `.env` file:

```env
STATAMIC_API_ENABLED=true
STATAMIC_API_ROUTE=api
```

### **Step 3: Test API Endpoints**

Once enabled, test these endpoints:

- **Products**: `http://localhost:8000/api/collections/products`
- **Manufacturers**: `http://localhost:8000/api/collections/manufacturers`
- **News**: `http://localhost:8000/api/collections/news`
- **Categories**: `http://localhost:8000/api/taxonomies/product-categories`
- **Single Product**: `http://localhost:8000/api/collections/products/{id}`

### **Step 4: Start Laravel Server**

```bash
cd /path/to/statamic/site
php artisan serve
```

### **Step 5: Update React App API Base URL**

If your Statamic site runs on a different port, update the API base URL in `src/lib/statamic.ts`:

```typescript
const STATAMIC_API_BASE = 'http://localhost:8000/api'; // Change port if needed
```

## ✅ **Benefits of This Approach**

- **✅ Zero data migration** - All existing content preserved
- **✅ All relationships work** - Products linked to manufacturers, categories, etc.
- **✅ Perfect image handling** - All existing image paths work
- **✅ Real-time updates** - Edit in Statamic CP, see in React
- **✅ Rich content preserved** - All Bard fields, markdown, etc.
- **✅ Taxonomy filtering** - Built-in category filtering works
- **✅ Featured content** - Taxonomy terms can feature products

## 🔧 **API Response Structure**

The Statamic API automatically resolves relationships:

```json
{
  "data": [
    {
      "id": "4e27e871-d106-486e-b721-4889aecaf756",
      "title": "1.7i",
      "manufacturer": {
        "id": "a1bc679d-2575-49b5-b383-070c024b598e",
        "title": "Magnepan",
        "logo": "magnepan-logo.png"
      },
      "product-categories": [
        {
          "id": "speakers",
          "title": "Speakers",
          "category_description": "Speakers are the centerpiece..."
        }
      ],
      "pairs_well_with": [
        {
          "id": "9f7f41a3-b287-4c08-a45f-0cd398b69154",
          "title": "Another Product",
          "product_hero_image": "product-image.jpg"
        }
      ]
    }
  ]
}
```

## 🎯 **Next Steps**

1. Enable the Statamic API using the steps above
2. Start the Laravel server
3. Test the API endpoints
4. The React app will automatically use the Statamic API
5. All relationships, taxonomies, and images will work perfectly!

## 🚨 **Troubleshooting**

- **API not accessible**: Make sure Laravel server is running
- **CORS issues**: Add CORS middleware if needed
- **Image paths**: Images are served from `/assets/main/` directory
- **Relationships not resolving**: Check that API resources are enabled 