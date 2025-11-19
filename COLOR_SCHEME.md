# 🎨 Color Scheme Reference

This document defines the exact color scheme used throughout the Egg Mining Admin Panel, matching the design specification.

## Primary Backgrounds

### Main Content Area
- **Light Background:** `#F5F5F5`
  - Used for: Main dashboard background, card containers
  - Tailwind Class: `bg-light-bg`

### Sidebar
- **Dark Background:** `#1C2036`
  - Used for: Sidebar navigation, dark cards (e.g., "Invite Friends")
  - Tailwind Class: `bg-dark-sidebar`

## Accent Colors

### Primary Gold Accent
- **Color:** `#FFB84C`
- **Usage:**
  - Primary CTA buttons ("START MINING", "BUY NOW")
  - Important numerical values (Egg Balance)
  - Key graphic highlights
  - Active navigation items
  - Active tab indicators
- **Tailwind Class:** `bg-accent-gold`, `text-accent-gold`, `border-accent-gold`

### Secondary Blue Accent
- **Color:** `#5B9CFF`
- **Usage:**
  - Secondary CTA buttons/outlines
  - Chart lines (Egg Price History)
  - Active states
  - Links and interactive elements
- **Tailwind Class:** `bg-accent-blue`, `text-accent-blue`, `border-accent-blue`

## Text Colors

### Dark Text
- **Color:** `#333333`
- **Usage:** Primary text on light backgrounds
- **Tailwind Class:** `text-text-dark`

### Light Text
- **Color:** `#FFFFFF`
- **Usage:** Text on dark backgrounds (sidebar, dark cards)
- **Tailwind Class:** `text-text-light`

### Subtle Gray Text
- **Color:** `#CCCCCC`
- **Usage:**
  - Secondary information
  - Placeholder text
  - Borders
  - Inactive states
- **Tailwind Class:** `text-subtle-gray`, `border-subtle-gray`

## Card & Element Colors

### Light Card Backgrounds
- **Color:** `#FFFFFF`
- **Usage:** All standard cards, input fields
- **Shadow:** `rgba(0, 0, 0, 0.08)` - `shadow-soft`
- **Tailwind Class:** `bg-white` (or use `.card` component class)

### Dark Card Backgrounds
- **Color:** `#1C2036`
- **Usage:** Special cards like "Invite Friends"
- **Shadow:** `rgba(0, 0, 0, 0.2)` - `shadow-soft-dark`
- **Tailwind Class:** `bg-dark-sidebar` (or use `.card-dark` component class)

## Gradients

### Subtle Gold Gradient
- **Usage:** Behind main chicken illustration on "Mine Eggs & Earn!" card
- **Tailwind Class:** `bg-gradient-gold-soft`
- **Definition:** `linear-gradient(to bottom right, rgba(255, 184, 76, 0.1), rgba(255, 184, 76, 0.05))`

### Soft Blue/Gold Gradient
- **Usage:** Egg Balance card background
- **Tailwind Class:** `bg-gradient-blue-gold`
- **Definition:** `linear-gradient(to bottom right, rgba(91, 156, 255, 0.2), rgba(255, 184, 76, 0.3))`

### Invite Friends Gradient
- **Usage:** "Invite Friends" card with dark background
- **Tailwind Class:** `bg-gradient-invite`
- **Definition:** `linear-gradient(135deg, #1C2036 0%, rgba(255, 184, 76, 0.2) 100%)`

## Component Classes

### Buttons
- **Primary (Gold):** `.btn-primary` - Uses `#FFB84C`
- **Secondary (Blue):** `.btn-secondary` - Uses `#5B9CFF`
- **Outline:** `.btn-outline` - Blue border, transparent background

### Cards
- **Light Card:** `.card` - White background with soft shadow
- **Dark Card:** `.card-dark` - Dark sidebar color with darker shadow
- **Glass Card:** `.card-glass` - Semi-transparent with backdrop blur

### Input Fields
- **Standard:** `.input-field` - White background, subtle gray border
- **Focus State:** Blue ring (`#5B9CFF`)

### Navigation
- **Nav Item:** `.nav-item` - White text on dark sidebar
- **Active Nav Item:** `.nav-item-active` - Gold background (`#FFB84C`)

### Tabs
- **Active Tab:** `.tab-button-active` - Gold background
- **Inactive Tab:** `.tab-button-inactive` - White background

## Usage Examples

```tsx
// Light background
<div className="bg-light-bg">Main content area</div>

// Dark sidebar
<div className="bg-dark-sidebar text-text-light">Sidebar</div>

// Gold accent button
<button className="btn-primary">START MINING</button>

// Blue accent button
<button className="btn-secondary">Buy</button>

// Card with soft shadow
<div className="card">Card content</div>

// Text colors
<p className="text-text-dark">Primary text</p>
<p className="text-subtle-gray">Secondary text</p>

// Gradients
<div className="bg-gradient-gold-soft">Subtle gold gradient</div>
<div className="bg-gradient-blue-gold">Blue-gold gradient</div>
```

## Color Values Summary

| Element | Color | Hex Code | Tailwind Class |
|---------|-------|----------|----------------|
| Main Background | Light Cream | `#F5F5F5` | `bg-light-bg` |
| Sidebar Background | Midnight Blue | `#1C2036` | `bg-dark-sidebar` |
| Primary Accent | Gold | `#FFB84C` | `bg-accent-gold` |
| Secondary Accent | Sky Blue | `#5B9CFF` | `bg-accent-blue` |
| Dark Text | Dark Gray | `#333333` | `text-text-dark` |
| Light Text | White | `#FFFFFF` | `text-text-light` |
| Subtle Gray | Light Gray | `#CCCCCC` | `text-subtle-gray` |
| Card Background | White | `#FFFFFF` | `bg-white` |

