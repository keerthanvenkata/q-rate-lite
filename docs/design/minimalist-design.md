# Minimalist Dashboard Design System

The **Minimalist** design system is the backbone for all operational application routes (`/staff`, `/sudo`, `/superadmin`, `/marketing`, `/feedback`) within Q-Rate Lite. 

Unlike the highly stylized **Aurora** and **Papyrus** themes reserved for the marketing landing page, this system prioritizes pure legibility, extreme contrast, and zero visual fatigue for daily active users.

## 1. Core Philosophy
*   **Vercel-Esque Aesthetic:** The UI must feel lightning-fast and professional. We rely heavily on stark monochrome contrasts and geometric precision.
*   **Zero Distractions:** No animated gradients, no glowing blobs, no textured backgrounds.
*   **Single Accent Constraint:** The UI uses exactly one vibrant accent color (Indigo or Amber) exclusively reserved for primary Call-To-Action (CTA) elements and active state indicators.

## 2. Technical Implementation: Abstract Utilities

To maintain strict consistency across all application views and prevent bloated JSX, we enforce the use of abstract CSS custom properties and `@apply` utility classes defined in `index.css`.

### The Core Utility Classes

*   `.dashboard-bg`: 
    *   **Light Mode:** Pure White (`#FFFFFF`) or ultra-light slate (`#F8FAFC`).
    *   **Dark Mode:** Pure Black (`#000000`).
*   `.dashboard-card`: 
    *   Surfaces elevated slightly above the background.
    *   **Light Mode:** Pure White with a subtle shadow (`shadow-sm`).
    *   **Dark Mode:** `bg-zinc-950` with a hairline `border-white/5` inner ring.
*   `.dashboard-input`: 
    *   Input fields must be massive touch-targets (min `h-12`) with strong focus rings (`focus:ring-2 focus:ring-accent`).
*   `.dashboard-btn-primary`: 
    *   The single accent color (e.g., `bg-indigo-600 dark:bg-indigo-500`).
    *   Hover states should simply darken or lighten the background slightly (`hover:bg-indigo-700 dark:hover:bg-indigo-400`); avoid aggressive scaling or bouncy animations.

## 3. Color Palette

The Minimalist system enforces a strictly restricted palette:

*   **Backgrounds:** `bg-white`, `dark:bg-black`
*   **Surfaces:** `bg-slate-50`, `dark:bg-zinc-900`
*   **Borders:** `border-slate-200`, `dark:border-zinc-800` (Hairline 1px borders only).
*   **Primary Text:** `text-slate-900`, `dark:text-zinc-100`
*   **Secondary Text:** `text-slate-500`, `dark:text-zinc-400`
*   **Accent (Primary Action):** `indigo-600` (Light) / `indigo-500` (Dark)

## 4. Typography & Spacing

*   **Sans-Serif Only:** We rely on the system font stack (Inter or San Francisco) to guarantee zero layout shifts and maximum rendering speed.
*   **Whitespace Heavy:** Cards and sections must have generous padding (e.g., `p-6` or `p-8`). Never cramp data.
*   **Data Legibility:** Statistical numbers (e.g., in the Admin Dashboard) should be bold and massive (`text-4xl font-black`), while their accompanying labels should be tiny and muted (`text-xs text-slate-500 uppercase tracking-widest`).
