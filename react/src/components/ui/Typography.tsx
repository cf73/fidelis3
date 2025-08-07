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

import React from 'react';

export interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const H1: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h1' }) => (
  <Component className={`text-4xl lg:text-5xl font-bold text-gray-900 ${className}`}>
    {children}
  </Component>
);

export const H2: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h2' }) => (
  <Component className={`text-3xl lg:text-4xl font-bold text-gray-900 ${className}`}>
    {children}
  </Component>
);

export const H3: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h3' }) => (
  <Component className={`text-2xl font-semibold text-gray-900 ${className}`}>
    {children}
  </Component>
);

export const H4: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h4' }) => (
  <Component className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </Component>
);

export const BodyLarge: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'p' }) => (
  <Component className={`text-lg text-gray-700 ${className}`}>
    {children}
  </Component>
);

export const Body: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'p' }) => (
  <Component className={`text-base text-gray-700 ${className}`}>
    {children}
  </Component>
);

export const BodySmall: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'p' }) => (
  <Component className={`text-sm text-gray-600 ${className}`}>
    {children}
  </Component>
);

export const Caption: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'span' }) => (
  <Component className={`text-xs text-gray-500 ${className}`}>
    {children}
  </Component>
);

export const Price: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'span' }) => (
  <Component className={`text-2xl font-bold text-green-600 ${className}`}>
    {children}
  </Component>
);

export const PriceLarge: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'span' }) => (
  <Component className={`text-3xl font-bold text-green-600 ${className}`}>
    {children}
  </Component>
);
