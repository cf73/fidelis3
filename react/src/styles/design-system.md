# Fidelis Audio Design System

## 🎨 Brand Identity
**Premium Audio Equipment Retailer** - Sophisticated, high-end, trustworthy

## 🎯 Design Principles
- **Premium Quality** - Reflect the high-end nature of audio equipment
- **Clean & Minimal** - Let the products speak for themselves
- **Sophisticated** - Professional, trustworthy, knowledgeable
- **Accessible** - Clear information hierarchy and readable typography

## 🌈 Color Palette

### Primary Colors
- **Primary Blue**: `#1a365d` (Deep, trustworthy blue)
- **Accent Gold**: `#d69e2e` (Premium, warm accent)
- **Success Green**: `#38a169` (Positive actions, pricing)

### Neutral Colors
- **Gray 50**: `#f9fafb` (Background)
- **Gray 100**: `#f3f4f6` (Light backgrounds)
- **Gray 200**: `#e5e7eb` (Borders)
- **Gray 300**: `#d1d5db` (Dividers)
- **Gray 600**: `#4b5563` (Secondary text)
- **Gray 700**: `#374151` (Body text)
- **Gray 900**: `#111827` (Headings)

### Semantic Colors
- **Error**: `#dc2626`
- **Warning**: `#d97706`
- **Info**: `#2563eb`

## 📝 Typography

### Font Stack
- **Primary**: Inter (Clean, modern, highly readable)
- **Fallback**: system-ui, -apple-system, sans-serif

### Type Scale
- **H1**: `text-4xl lg:text-5xl font-bold` (Page titles)
- **H2**: `text-3xl lg:text-4xl font-bold` (Section headers)
- **H3**: `text-2xl font-semibold` (Subsection headers)
- **H4**: `text-xl font-semibold` (Card titles)
- **Body Large**: `text-lg` (Important content)
- **Body**: `text-base` (Regular content)
- **Body Small**: `text-sm` (Secondary information)
- **Caption**: `text-xs` (Metadata, labels)

### Font Weights
- **Light**: `font-light` (300)
- **Normal**: `font-normal` (400)
- **Medium**: `font-medium` (500)
- **Semibold**: `font-semibold` (600)
- **Bold**: `font-bold` (700)

## 📏 Spacing System
Based on Tailwind's 4px base unit:
- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)
- **2xl**: `3rem` (48px)
- **3xl**: `4rem` (64px)

## 🧩 Component Patterns

### Cards
- **Background**: `bg-white`
- **Border**: `border border-gray-200`
- **Radius**: `rounded-lg`
- **Shadow**: `shadow-sm`
- **Padding**: `p-6`
- **Hover**: `hover:shadow-md transition-shadow`

### Buttons
- **Primary**: `bg-primary-600 hover:bg-primary-700 text-white`
- **Secondary**: `bg-gray-200 hover:bg-gray-300 text-gray-900`
- **Outline**: `border border-gray-300 hover:bg-gray-50 text-gray-700`
- **Size**: `px-4 py-2 rounded-md font-medium`

### Forms
- **Input**: `border border-gray-300 rounded-md px-3 py-2`
- **Focus**: `focus:ring-2 focus:ring-primary-500 focus:border-primary-500`
- **Label**: `text-sm font-medium text-gray-700`

## 🎭 Layout Principles

### Container
- **Max Width**: `max-w-7xl` (1280px)
- **Padding**: `px-4 sm:px-6 lg:px-8`
- **Center**: `mx-auto`

### Grid System
- **Mobile**: Single column
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns
- **Gap**: `gap-6 lg:gap-8`

### Section Spacing
- **Section**: `py-12 lg:py-16`
- **Subsection**: `py-8 lg:py-12`
- **Component**: `py-4 lg:py-6`

## 🎬 Animation Guidelines

### Transitions
- **Duration**: `transition-all duration-200`
- **Easing**: `ease-in-out`
- **Hover**: Subtle scale or shadow changes

### Loading States
- **Spinner**: `animate-spin`
- **Skeleton**: `animate-pulse`
- **Fade In**: `animate-fade-in`

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### Mobile-First Approach
- Start with mobile layout
- Add tablet/desktop enhancements
- Ensure touch-friendly interactions

## 🎨 Component-Specific Guidelines

### Product Cards
- **Image**: 16:9 aspect ratio, object-cover
- **Title**: H4, single line with ellipsis
- **Price**: Large, prominent, green
- **Manufacturer**: Small, gray, below title

### Navigation
- **Active State**: Primary color underline
- **Hover**: Subtle background change
- **Mobile**: Hamburger menu with overlay

### Pre-owned Items
- **Savings Badge**: Green background, white text
- **Condition**: Small badge, neutral colors
- **Price**: Large, prominent display

## 🚫 Protected Elements
These should NEVER be modified without explicit permission:
- Color palette
- Typography scale
- Spacing system
- Component layouts
- Visual hierarchy
- Brand elements

## ✅ Safe to Modify
- Functional logic
- Data handling
- Performance optimizations
- Accessibility improvements
- SEO enhancements
