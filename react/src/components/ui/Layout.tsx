/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 * 
 * Layout Components - Refined Midcentury Modern Design
 * Captures the sophisticated layout patterns we developed
 */

import React from 'react';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'alternate' | 'hero' | 'compact';
  background?: 'white' | 'stone-50' | 'stone-100' | 'custom';
  customBackground?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  variant = 'default',
  background = 'white',
  customBackground
}) => {
  const variants = {
    default: 'py-20',
    alternate: 'py-16',
    hero: 'py-32',
    compact: 'py-12'
  };

  const backgrounds = {
    white: 'bg-warm-white',
    'stone-50': 'bg-warm-white',
    'stone-100': 'bg-warm-white',
    custom: customBackground || 'bg-warm-white'
  };

  return (
    <section className={`${variants[variant]} ${backgrounds[background]} ${className}`}>
      <div className="container-custom">
        {children}
      </div>
    </section>
  );
};

export interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  cols = 3,
  gap = 'lg',
  responsive = true
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const responsiveClass = responsive ? colClasses[cols] : `grid-cols-${cols}`;

  return (
    <div className={`grid ${responsiveClass} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'md'
}) => {
  const sizes = {
    sm: 'max-w-4xl xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8',
    md: 'max-w-7xl xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8',
    lg: 'max-w-7xl xl:max-w-none mx-auto px-8 sm:px-12 lg:px-16',
    xl: 'max-w-7xl xl:max-w-none mx-auto px-12 sm:px-16 lg:px-20',
    full: 'w-full px-4 sm:px-6 lg:px-8'
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};

export interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Flex: React.FC<FlexProps> = ({
  children,
  className = '',
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = false,
  gap = 'md'
}) => {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  const justifyClass = `justify-${justify}`;
  const alignClass = `items-${align}`;
  const wrapClass = wrap ? 'flex-wrap' : 'flex-nowrap';
  const gapClass = `gap-${gap === 'sm' ? '2' : gap === 'md' ? '4' : gap === 'lg' ? '6' : '8'}`;

  return (
    <div className={`flex ${directionClass} ${justifyClass} ${alignClass} ${wrapClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};
