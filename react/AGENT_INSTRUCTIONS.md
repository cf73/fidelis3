# Agent Instructions - Visual Language Protection

## 🚨 CRITICAL: Visual Language Protection

### 🚫 DO NOT MODIFY (unless explicitly requested):
- **Component styling and layout**
- **Color schemes and typography**
- **Spacing and sizing**
- **Animation behaviors**
- **Visual hierarchy**
- **Component structure and markup**
- **CSS class names and organization**

### ✅ ALLOWED MODIFICATIONS:
- **Functional logic only**
- **Data fetching and state management**
- **Routing and navigation**
- **Form validation**
- **API integration**
- **Performance optimizations**
- **Accessibility improvements**

## 📋 Before Making Any Changes:

### 1. Check Design System
- **Read**: `react/src/styles/design-system.md`
- **Follow**: Established patterns and guidelines
- **Use**: Existing component library in `/ui/`

### 2. Component Protection
- **Look for**: `@preserve-visual-language` comments
- **Respect**: Existing styling and layout
- **Maintain**: Visual consistency across similar components

### 3. Naming Conventions
- **Follow**: Existing naming patterns
- **Use**: Semantic class names
- **Avoid**: Arbitrary styling changes

## 🎨 Visual Language Reference

### Color Palette (NEVER CHANGE)
- **Primary**: `#1a365d` (Deep blue)
- **Accent**: `#d69e2e` (Gold)
- **Success**: `#38a169` (Green)
- **Neutral**: Gray scale (50-900)

### Typography (NEVER CHANGE)
- **Font**: Inter (system fallback)
- **Scale**: H1-H4, Body, Small, Caption
- **Weights**: Light, Normal, Medium, Semibold, Bold

### Spacing (NEVER CHANGE)
- **Base**: 4px unit system
- **Scale**: xs, sm, md, lg, xl, 2xl, 3xl
- **Components**: p-6, py-12, gap-6

## 🧩 Component Patterns (PROTECTED)

### Cards
```css
bg-white border border-gray-200 rounded-lg shadow-sm p-6
hover:shadow-md transition-shadow
```

### Buttons
```css
/* Primary */
bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium

/* Secondary */
bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md font-medium
```

### Forms
```css
border border-gray-300 rounded-md px-3 py-2
focus:ring-2 focus:ring-primary-500 focus:border-primary-500
```

## 🔒 Protected Components

### High-Priority Protection
- `ProductCard` - Revenue critical
- `Navigation` - User experience foundation
- `ProductDetail` - Conversion optimization
- `PreOwnedCard` - Unique value proposition

### Medium-Priority Protection
- `ManufacturerCard` - Brand representation
- `NewsCard` - Content presentation
- `ContactForm` - Lead generation
- `Footer` - Brand consistency

## 📝 Code Comments for Protection

### Use This Comment Pattern:
```tsx
/**
 * @preserve-visual-language
 * DO NOT MODIFY: Styling, layout, or visual presentation
 * Only modify: Functionality, data handling, or performance
 * 
 * Visual Language:
 * - Colors: Primary blue, accent gold, neutral grays
 * - Typography: Inter font, established scale
 * - Spacing: 4px base unit system
 * - Layout: Responsive grid, consistent padding
 */
export const ComponentName = () => {
  // ... existing code
}
```

## 🚨 Emergency Override Protocol

### If Visual Changes Are REQUIRED:
1. **Document the reason** in commit message
2. **Reference design system** for consistency
3. **Test across similar components**
4. **Update documentation** if patterns change
5. **Notify in commit**: `[VISUAL-CHANGE]`

### Example Commit:
```
[VISUAL-CHANGE] Update ProductCard hover state for accessibility
- Follows design system color guidelines
- Maintains existing layout structure
- Tested across all product components
```

## 📚 Resources

### Design System
- **File**: `react/src/styles/design-system.md`
- **Purpose**: Visual language reference
- **Status**: PROTECTED - Do not modify without permission

### Component Library
- **Location**: `react/src/components/ui/`
- **Purpose**: Reusable, consistent components
- **Status**: PROTECTED - Follow established patterns

### Style Guide
- **File**: `react/src/styles/guide.md`
- **Purpose**: Implementation examples
- **Status**: REFERENCE - Use as template

## ⚠️ Warning Signs

### Red Flags (STOP and ask):
- Changing color values
- Modifying typography classes
- Altering spacing/padding
- Changing component structure
- Adding new CSS classes without pattern
- Removing established styling

### Green Lights (SAFE to proceed):
- Adding state management
- Implementing new features
- Optimizing performance
- Fixing bugs
- Adding accessibility features
- Improving SEO

## 🎯 Success Criteria

### Before Committing:
- [ ] No visual changes without explicit permission
- [ ] Follows established design patterns
- [ ] Maintains component consistency
- [ ] Preserves responsive behavior
- [ ] Respects accessibility standards
- [ ] Documents any necessary changes

### After Changes:
- [ ] Visual regression testing
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Performance impact assessment
- [ ] Accessibility validation

---

**Remember**: When in doubt, ASK before making visual changes. The design system is the source of truth, and consistency is more important than individual preferences.
