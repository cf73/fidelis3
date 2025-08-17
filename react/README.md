# Fidelis AV React App

A modern, responsive React application for Fidelis AV, a high-end audio equipment retailer. Built with TypeScript, Tailwind CSS, and Supabase for the backend.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, TypeScript, and functional components
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Real-time Data**: Supabase integration for dynamic content
- **SEO Optimized**: Server-side rendering ready
- **Performance**: Optimized for speed and user experience

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom design system

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fidelis-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`

## 🗄 Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Database Schema
Create the following tables in your Supabase database:

#### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  manufacturer TEXT,
  price DECIMAL(10,2),
  description TEXT,
  description_text TEXT,
  quote TEXT,
  quote_text TEXT,
  specs TEXT,
  specs_text TEXT,
  product_hero_image TEXT,
  available_for_demo BOOLEAN DEFAULT false,
  available_to_buy_online BOOLEAN DEFAULT false,
  show_price BOOLEAN DEFAULT true,
  local_only BOOLEAN DEFAULT false,
  product_categories TEXT[],
  system_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Manufacturers Table
```sql
CREATE TABLE manufacturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  logo TEXT,
  tagline TEXT,
  website TEXT,
  hero_image TEXT,
  description TEXT,
  product_categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### News Table
```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  date DATE,
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Pre-owned Table
```sql
CREATE TABLE pre_owned (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  condition TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Testimonials Table
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author TEXT,
  attribution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Import Data
You can import your CSV data from the Statamic export using Supabase's import feature or by running SQL insert statements.

## 🎨 Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- **Primary**: Gray scale for text and backgrounds
- **Accent**: Orange scale for buttons and highlights

### Components
All components are located in `src/components/` and follow a consistent design pattern.

### Pages
Pages are in `src/pages/` and use the same layout structure with motion animations.

## 📱 Pages

- **Home**: Hero section, featured products, manufacturers
- **Products**: Product catalog with filtering and search
- **Product Detail**: Individual product pages with specifications
- **Manufacturers**: Manufacturer showcase
- **News**: Blog-style news section
- **About**: Company information and story
- **Contact**: Contact form and information

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Add environment variables in Netlify dashboard

### Other Platforms
The app can be deployed to any static hosting platform that supports React applications.

## 🔧 Development

### Available Scripts
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App (not recommended)

### Code Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── lib/           # Utilities and configurations
├── App.tsx        # Main app component
└── index.tsx      # Entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please contact the development team or create an issue in the repository.
