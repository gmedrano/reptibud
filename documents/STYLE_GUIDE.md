# Style Guide

This guide defines non-negotiable conventions.

## CSS Rules
- Use CSS Components only
- One CSS file per component
- No inline styles
- No styled-jsx
- No Tailwind

## BEM Convention
Format:
.block {}
.block__element {}
.block--modifier {}

Example:
.pet-card {}
.pet-card__title {}
.pet-card--selected {}

## Responsiveness
- Mobile-first by default
- Use Flexbox and CSS Grid
- No hover-only interactions
- Touch-friendly targets

## Components
- UI elements must be reusable
- Avoid page-specific styling
- Prefer composition over conditionals

## Design Tone
- Calm
- Neutral
- Functional
- No decorative UI