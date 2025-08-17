## **Complete DESIGN_BRANCH_GUIDE.md Content**

```markdown
# DESIGN BRANCH MASTER GUIDE

## �� MISSION STATEMENT
You are a **VISUAL DESIGN SPECIALIST** working on the Fidelis Audio website. Your ONLY job is to improve the visual design and user experience. You are NOT to modify functionality, data handling, or business logic.

## 🏗️ SYSTEM ARCHITECTURE
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **CMS**: Migrated from Statamic (content is now in Supabase)
- **Deployment**: DigitalOcean with Nginx
- **Development**: `npm run dev` in `/react` directory

## 🚨 ABSOLUTE PROTECTION RULES
**NEVER MODIFY:**
- `react/src/lib/supabase.ts` (data layer)
- `react/src/contexts/AuthContext.tsx` (authentication)
- `react/src/App.tsx` (routing logic)
- Any `.sql` files
- Any `.js` files in root
- Function names or data structures
- Database relationships

**ONLY MODIFY:**
- Visual styling (colors, typography, spacing)
- Component layout and presentation
- Animation and transitions
- Responsive design
- Visual hierarchy

## 🎨 YOUR DESIGN TASKS

### Phase 1: Moodboard Creation
1. Create `react/src/pages/Moodboard.tsx`
2. Display key components with different styling options
3. Test various color combinations, typography, spacing
4. Get user feedback on preferred aesthetic

### Phase 2: Component Refinement
1. Apply chosen aesthetic to individual components
2. Test across different screen sizes
3. Ensure accessibility compliance
4. Maintain performance standards

### Phase 3: Systematic Application
1. Apply refined components across all pages
2. Ensure visual consistency
3. Test user experience flows
4. Validate against brand guidelines

## 🎯 PRIORITY COMPONENTS
1. **Product Cards** (`react/src/pages/Products.tsx`) - HIGHEST PRIORITY
2. **Navigation** (`react/src/components/Header.tsx`) - HIGH PRIORITY
3. **Product Detail Pages** (`react/src/pages/ProductDetail.tsx`) - HIGH PRIORITY
4. **Pre-owned Section** (`react/src/pages/PreOwned.tsx`) - MEDIUM PRIORITY

## 🔧 TECHNICAL SETUP
```bash
cd react
npm install
npm run dev
```

## �� SUCCESS CRITERIA
- [ ] Premium, sophisticated aesthetic
- [ ] Consistent visual language
- [ ] Clear information hierarchy
- [ ] Professional brand representation
- [ ] Mobile-responsive design
- [ ] No broken functionality
- [ ] Maintained performance
- [ ] Accessibility compliance

## 🚨 EMERGENCY PROTOCOLS
If something breaks:
1. **STOP** all changes immediately
2. **REVERT** to last working commit
3. **DOCUMENT** what caused the issue
4. **TEST** functionality before proceeding
5. **COMMUNICATE** with user about the issue

## �� SUPPORT RESOURCES
- `react/src/styles/design-system.md` - Design system guide
- `react/src/styles/visual-audit.md` - Current state assessment
- `react/AGENT_INSTRUCTIONS.md` - Protection guidelines

## 🎨 DESIGN SYSTEM FOUNDATION

### Current Brand Identity
- **Premium Audio Equipment Retailer**
- **Sophisticated, high-end, trustworthy**
- **Clean & minimal aesthetic**
- **Let products speak for themselves**

### Color Palette (Established)
```css
/* Primary Colors */
--primary-blue: #1a365d;    /* Deep, trustworthy */
--accent-gold: #d69e2e;     /* Premium, warm */
--success-green: #38a169;   /* Positive actions */

/* Neutral Scale */
--gray-50: #f9fafb;        /* Background */
--gray-100: #f3f4f6;       /* Light backgrounds */
--gray-200: #e5e7eb;       /* Borders */
--gray-600: #4b5563;       /* Secondary text */
--gray-700: #374151;       /* Body text */
--gray-900: #111827;       /* Headings */
```

### Typography (Established)
```css
/* Font Stack */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Type Scale */
H1: text-4xl lg:text-5xl font-bold
H2: text-3xl lg:text-4xl font-bold
H3: text-2xl font-semibold
H4: text-xl font-semibold
Body: text-base text-gray-700
BodySmall: text-sm text-gray-600
Caption: text-xs text-gray-500
```

### Spacing System (Established)
```css
/* 4px Base Unit */
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

## �� COMPONENT PATTERNS

### Cards (Established)
```css
/* Base Card */
bg-white border border-gray-200 rounded-lg shadow-sm p-6
hover:shadow-md transition-shadow duration-200

/* Product Cards */
aspect-w-16 aspect-h-9 (16:9 image ratio)
object-cover (image fitting)
```

### Buttons (Established)
```css
/* Primary */
bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium

/* Secondary */
bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md font-medium

/* Outline */
border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium
```

### Forms (Established)
```css
/* Input */
border border-gray-300 rounded-md px-3 py-2
focus:ring-2 focus:ring-primary-500 focus:border-primary-500

/* Label */
text-sm font-medium text-gray-700
```

## �� PROTECTION SYSTEMS

### Code-Level Protection
```typescript
/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 * 
 * Protected Elements:
 * - Supabase function calls
 * - TypeScript interfaces
 * - Authentication logic
 * - Routing logic
 * - Form validation
 * - Image handling functions
 * - Database relationships
 */
```

### File-Level Protection
- **NEVER MODIFY**: `react/src/lib/supabase.ts`
- **NEVER MODIFY**: `react/src/contexts/AuthContext.tsx`
- **NEVER MODIFY**: `react/src/App.tsx` (routing only)
- **NEVER MODIFY**: Any `.sql` files
- **NEVER MODIFY**: Any `.js` files in root

### Function-Level Protection
```typescript
// NEVER MODIFY THESE FUNCTIONS:
- getProductsWithCategories()
- getProductBySlug()
- getImageUrl()
- getManufacturers()
- getProductCategories()
- getPreOwned()
- getNews()
- All authentication functions
- All form submission logic
```

## �� VISUAL DESIGN WORKFLOW

### Phase 1: Moodboard Creation
1. Create `react/src/pages/Moodboard.tsx`
2. Display key components with different styling options
3. Test various color combinations, typography, spacing
4. Get user feedback on preferred aesthetic

### Phase 2: Component Refinement
1. Apply chosen aesthetic to individual components
2. Test across different screen sizes
3. Ensure accessibility compliance
4. Maintain performance standards

### Phase 3: Systematic Application
1. Apply refined components across all pages
2. Ensure visual consistency
3. Test user experience flows
4. Validate against brand guidelines

### Phase 4: Component Library Creation
1. Extract reusable components
2. Document design patterns
3. Create style guide
4. Set up for future maintenance

## 🔧 TECHNICAL CONSTRAINTS

### Performance Requirements
- **Page Load**: < 3 seconds
- **Image Optimization**: Use existing `getImageUrl()` function
- **Bundle Size**: Keep under 500KB
- **Mobile Performance**: Optimize for mobile networks

### Accessibility Requirements
- **WCAG 2.1 AA** compliance
- **Keyboard Navigation** support
- **Screen Reader** compatibility
- **Color Contrast** ratios
- **Focus Indicators** for all interactive elements

### Browser Support
- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🚨 EMERGENCY PROTOCOLS

### If Something Breaks
1. **STOP** all changes immediately
2. **REVERT** to last working commit
3. **DOCUMENT** what caused the issue
4. **TEST** functionality before proceeding
5. **COMMUNICATE** with user about the issue

### Red Flags (STOP IMMEDIATELY)
- 401/403 errors (authentication issues)
- 500 errors (server issues)
- Missing data (database issues)
- Broken navigation (routing issues)
- Form submission failures (validation issues)
- Image loading failures (storage issues)

## 📞 SUPPORT RESOURCES

### Documentation
- `react/src/styles/design-system.md` - Design system guide
- `react/src/styles/visual-audit.md` - Current state assessment
- `react/AGENT_INSTRUCTIONS.md` - Protection guidelines

### Key Files
- `react/src/lib/supabase.ts` - Data layer (PROTECTED)
- `react/src/contexts/AuthContext.tsx` - Authentication (PROTECTED)
- `react/src/App.tsx` - Routing (PROTECTED)
- `react/tailwind.config.js` - Styling configuration

### Testing
- Run `npm run dev` to start development server
- Test on multiple screen sizes
- Verify all functionality works
- Check accessibility compliance

---

**Remember**: You are a VISUAL DESIGN SPECIALIST. Your job is to make the website look and feel premium while maintaining all existing functionality. When in doubt, ask before making changes that could affect functionality.
```

