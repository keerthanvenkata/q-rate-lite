# Q-Rate Lite: Design System

This document outlines the visual language and CSS conventions used across the Q-Rate Lite platform.

## 1. Dual Theme Architecture

To cater to both cinematic marketing and focused utility, we employ two distinct design systems.

### A. Marketing Theme (Cinematic)
Used strictly on the `LandingPage`. Designed to "wow" users upon entry.
*   **Aurora (Dark Mode):** Deep, organic hardware-accelerated animations (waves, ribbons, blobs) that evoke a premium night-time aesthetic. High contrast typography against deep purples/blacks.
*   **Papyrus (Light Mode):** Sand/dune-inspired animations, subtle sun rays, noise textures, offering a refined, natural daylight feel.

### B. Dashboard Theme (Ultra-Minimalist)
Used on all application routes (`/feedback`, `/admin`, `/superadmin`, `/staff`, `/marketing`). Designed for speed, clarity, and low cognitive load.
*   **Philosophy:** "Vercel-like" UI. Content is the interface. No unnecessary styling.
*   **Backgrounds:** Pure white (`bg-white` or `#ffffff`).
*   **Typography:** Pure black (`text-black`) for primary headings, neutral grays (`text-neutral-500`) for secondary text. Use system fonts or Inter (if configured).
*   **Borders:** Extremely subtle, hairline borders (`border-neutral-200` or `border-neutral-100`).
*   **Shadows:** Minimal, tight shadows. Avoid wide, blurry drop shadows.

## 2. Accents

For the minimalist dashboard theme, we use a single, strong accent color to denote primary actions.

### Primary Accent
*   **Color:** Jet Black (`bg-black text-white`) or a very sharp, subtle blue (`bg-blue-600` / `hover:bg-blue-700`).
*   **Usage:** The accent color should ONLY be used for:
    *   Primary Calls to Action (CTAs) like "Submit Feedback", "Send Blast".
    *   Active states in navigation (subtle underline or text color change).
    *   Critical badges (e.g., Status: Active).
*   **Rule:** If everything is highlighted, nothing is highlighted. Keep 95% of the UI monochrome, letting the 5% accent color draw the user's eye instantly to what matters.

### Status Colors (Utility Accents)
When indicating system state, stick to standard semantic colors but keep them muted or sharp:
*   **Success:** Emerald/Green (`text-emerald-600`, `bg-emerald-50`)
*   **Warning:** Amber/Yellow (`text-amber-600`, `bg-amber-50`)
*   **Danger:** Red (`text-red-600`, `bg-red-50`)
*   **Info:** Blue (`text-blue-600`, `bg-blue-50`)

## 3. Component Classes

In `index.css`, we will introduce utility classes to enforce the dashboard theme across pages, ensuring consistency.
*   `.dashboard-bg`: Sets the pure white canvas.
*   `.dashboard-card`: Standardized bordered container.
*   `.dashboard-input`: Standardized input field with focus ring.
*   `.dashboard-btn-primary`: The main accent button.
