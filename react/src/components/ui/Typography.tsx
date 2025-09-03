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
  as?: React.ElementType;
}

export const H1: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h1' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-4xl lg:text-6xl font-light tracking-wide text-stone-800 ${className}`}>
      {children}
    </ComponentType>
  );
};

export const H2: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h2' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-3xl lg:text-3xl font-medium tracking-tight text-stone-800 ${className}`}>
      {children}
    </ComponentType>
  );
};

export const H3: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h3' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-2xl font-light tracking-wide text-stone-800 ${className}`}>
      {children}
    </ComponentType>
  );
};

export const H4: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'h4' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-xl font-light tracking-wide text-stone-800 ${className}`}>
      {children}
    </ComponentType>
  );
};

export const BodyLarge: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'p' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-lg font-light tracking-wide text-stone-700 ${className}`}>
      {children}
    </ComponentType>
  );
};

export const Body: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'p' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-base font-light tracking-wide text-stone-700 ${className}`}>
      {children}
    </ComponentType>
  );
};

export const BodySmall: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'p' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-sm font-light tracking-wide text-stone-600 ${className}`}>
      {children}
    </ComponentType>
  );
};

export const Caption: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'span' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-xs font-light tracking-wide text-stone-500 ${className}`}>
      {children}
    </ComponentType>
  );
};

export const Price: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'span' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-xl font-bold text-stone-900 ${className}`}>
      {children}
    </ComponentType>
  );
};

export const PriceLarge: React.FC<TypographyProps> = ({ children, className = '', as: Component = 'span' }) => {
  const ComponentType = Component as React.ElementType;
  return (
    <ComponentType className={`text-3xl font-bold text-stone-900 ${className}`}>
      {children}
    </ComponentType>
  );
};
