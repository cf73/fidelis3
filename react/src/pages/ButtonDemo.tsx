/**
 * @preserve-visual-language
 * DO NOT MODIFY: Functionality, data handling, or business logic
 * Only modify: Visual styling, layout, and user experience
 * 
 * Button Demo Page - Showcases our refined button design
 */

import React from 'react';
import { Button, Section, Grid, Container, Flex, H1, H2, H3, Body, BodyLarge } from '../components/ui';

export const ButtonDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fffcf9]">
      {/* Hero Section */}
      <Section variant="hero" background="white">
        <Container>
          <Flex direction="col" align="center" className="text-center">
            <H1 className="mb-4">Button Component Demo</H1>
            <BodyLarge className="text-stone-600 max-w-2xl">
              Showcasing our refined midcentury modern button design with sophisticated typography and elegant interactions.
            </BodyLarge>
          </Flex>
        </Container>
      </Section>

      {/* Variants Section */}
      <Section variant="default" background="white">
        <Container>
          <H2 className="mb-12 text-center">Button Variants</H2>
          <Grid cols={2} gap="xl">
            <div>
              <H3 className="mb-6">Primary Variant</H3>
              <div className="space-y-4">
                <div>
                  <Body className="mb-2 text-stone-600">Small</Body>
                  <Button variant="primary" size="sm">Primary Button</Button>
                </div>
                <div>
                  <Body className="mb-2 text-stone-600">Medium</Body>
                  <Button variant="primary" size="md">Primary Button</Button>
                </div>
                <div>
                  <Body className="mb-2 text-stone-600">Large</Body>
                  <Button variant="primary" size="lg">Primary Button</Button>
                </div>
              </div>
            </div>
            <div>
              <H3 className="mb-6">Secondary Variant</H3>
              <div className="space-y-4">
                <div>
                  <Body className="mb-2 text-stone-600">Small</Body>
                  <Button variant="secondary" size="sm">Secondary Button</Button>
                </div>
                <div>
                  <Body className="mb-2 text-stone-600">Medium</Body>
                  <Button variant="secondary" size="md">Secondary Button</Button>
                </div>
                <div>
                  <Body className="mb-2 text-stone-600">Large</Body>
                  <Button variant="secondary" size="lg">Secondary Button</Button>
                </div>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Outline & Ghost Section */}
      <Section variant="default" background="stone-50">
        <Container>
          <H2 className="mb-12 text-center">Outline & Ghost Variants</H2>
          <Grid cols={2} gap="xl">
            <div>
              <H3 className="mb-6">Outline Variant</H3>
              <div className="space-y-4">
                <div>
                  <Body className="mb-2 text-stone-600">Small</Body>
                  <Button variant="outline" size="sm">Outline Button</Button>
                </div>
                <div>
                  <Body className="mb-2 text-stone-600">Medium</Body>
                  <Button variant="outline" size="md">Outline Button</Button>
                </div>
                <div>
                  <Body className="mb-2 text-stone-600">Large</Body>
                  <Button variant="outline" size="lg">Outline Button</Button>
                </div>
              </div>
            </div>
            <div>
              <H3 className="mb-6">Ghost Variant</H3>
              <div className="space-y-4">
                <div>
                  <Body className="mb-2 text-stone-600">Small</Body>
                  <Button variant="ghost" size="sm">Ghost Button</Button>
                </div>
                <div>
                  <Body className="mb-2 text-stone-600">Medium</Body>
                  <Button variant="ghost" size="md">Ghost Button</Button>
                </div>
                <div>
                  <Body className="mb-2 text-stone-600">Large</Body>
                  <Button variant="ghost" size="lg">Ghost Button</Button>
                </div>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Interactive States Section */}
      <Section variant="default" background="white">
        <Container>
          <H2 className="mb-12 text-center">Interactive States</H2>
          <Grid cols={3} gap="lg">
            <div className="text-center">
              <H3 className="mb-4">Default</H3>
              <Button variant="primary" size="md">Click Me</Button>
            </div>
            <div className="text-center">
              <H3 className="mb-4">Hover</H3>
              <Button variant="primary" size="md" className="hover:bg-stone-700">Hover Me</Button>
            </div>
            <div className="text-center">
              <H3 className="mb-4">Disabled</H3>
              <Button variant="primary" size="md" disabled>Disabled</Button>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Loading States Section */}
      <Section variant="default" background="stone-50">
        <Container>
          <H2 className="mb-12 text-center">Loading States</H2>
          <Grid cols={2} gap="xl">
            <div className="text-center">
              <H3 className="mb-4">Primary Loading</H3>
              <Button variant="primary" size="md" loading>Loading...</Button>
            </div>
            <div className="text-center">
              <H3 className="mb-4">Secondary Loading</H3>
              <Button variant="secondary" size="md" loading>Loading...</Button>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Design System Integration */}
      <Section variant="default" background="white">
        <Container>
          <H2 className="mb-12 text-center">Design System Integration</H2>
          <div className="max-w-2xl mx-auto text-center">
            <BodyLarge className="mb-8">
              Our buttons integrate seamlessly with our refined midcentury modern design system, 
              featuring sophisticated typography, elegant spacing, and premium visual hierarchy.
            </BodyLarge>
            <div className="space-x-4">
              <Button variant="primary" size="lg">Get Started</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
