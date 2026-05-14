# Papyrus Design System (Light Mode)

The **Papyrus** design system is the foundation of Q-Rate Lite's premium, tactile Light Mode. While the Aurora dark mode relies on ethereal, glowing light, the Papyrus design relies on physical depth, texture, and atmospheric warmth to achieve its cinematic feel.

## 1. Core Philosophy
*   **Tactile Depth:** The background must feel like a physical object—thick parchment, ancient stationary, or shifting dunes.
*   **Atmospheric Light:** Light mode should feel like natural sunlight (golden hour) interacting with a physical surface.
*   **Organic Shadow:** Instead of glowing light, we use soft, widespread drop-shadows to separate layers and create dimension.

## 2. Technical Implementation: "Illuminated Dunes & God Rays"

To achieve a cinematic light mode without resorting to flat, generic glassmorphism, we combine three advanced CSS techniques.

### 1. The Base Texture
We overlay the entire background with an SVG `feTurbulence` noise filter. Using `mix-blend-multiply` at `35%` opacity creates a rich, fibrous texture that looks exactly like thick, high-quality parchment paper.

### 2. The Dunes (Parchment Folds)
We reuse the "Massive Ellipse" technique from Aurora, but inverted for physical mass:
1.  **The Shape:** We use massive `div` elements (`width: 140vw`, `height: 80vh`).
2.  **The Mass:** Instead of a hollow border, we give them a solid fill color (e.g., `bg-[#FFFCF8]`) and `border-radius: 100%`.
3.  **The Depth:** We apply massive, widespread drop shadows (`shadow-[0_40px_80px_rgba(180,83,9,0.05)]`).
4.  **The Sweep:** Positioned offset from the viewport, they look like sweeping, overlapping folds of paper or gentle sand dunes. They animate incredibly slowly on the Y-axis.

### 3. The God Rays (Sunbeams)
To bring the static texture to life, we cast "Sunbeams" across the canvas.
1.  **The Shape:** Extremely tall, angled `div` elements with horizontal gradients (`from-transparent via-amber-200/20 to-transparent`).
2.  **The Light:** Heavily blurred (`blur-[60px]`) and set to `mix-blend-overlay` so they highlight the noise texture beneath them.
3.  **The Motion:** They pan slowly back and forth across the X-axis, mimicking the passage of the sun across a windowpane.

## 3. Color Palette
The Papyrus system relies on warm, earthy, daylight tones:
*   **Base:** `bg-[#FAF3E0]` (Warm Cream)
*   **Dune 1 (Back Fold):** `bg-[#FDF8EB]`
*   **Dune 2 (Front Fold):** `bg-[#FFFCF8]`
*   **Shadows:** `rgba(180,83,9,0.05)` (A very subtle burnt amber, preventing shadows from looking "muddy" or grey).
*   **God Rays:** `amber-200/20` and `orange-200/15`

## 4. Typography Constraints
Because of the heavy texture and shifting shadows, text over the Papyrus background must be strictly high-contrast. We rely exclusively on `stone-900` for primary headings and `stone-600` for secondary text. Never use pure black (`#000000`), as it breaks the organic, earthy warmth of the palette.
