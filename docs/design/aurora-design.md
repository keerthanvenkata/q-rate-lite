# Aurora Design System (Dark Mode)

The **Aurora** design system is the foundation of Q-Rate Lite's premium, cinematic Dark Mode. It is designed to evoke the feeling of a high-end, exclusive B2B SaaS platform while maintaining strict readability and performance.

## 1. Core Philosophy
*   **Atmospheric Depth:** The background should never feel flat. It must have depth, achieved through layering and soft, glowing light.
*   **Restrained Motion:** Animations must be incredibly slow and subtle. The background should "breathe," not distract.
*   **Authentic Curves:** We avoid rigid lines or chaotic drifting blobs. Light moves in sweeping, organic arcs.

## 2. Technical Implementation: "Massive Hollow Ellipses"

Creating authentic, curving ribbons of light in CSS without massive performance penalties (like SVG filter rendering) is achieved using the **Massive Hollow Ellipse** technique.

### The Problem
Using `repeating-linear-gradient` creates rigid diagonal pillars (the "M-shape" problem). Using solid blurred `div` elements creates formless glowing gas.

### The Solution
1.  **The Shape:** We use `div` elements with `width: 150vw` and `height: 150vh`.
2.  **The Hollow Ring:** Instead of a `background-color`, we apply a massive `border` (e.g., `border-[60px]`) and `border-radius: 100%`. This creates a giant, hollow, glowing ring.
3.  **The Sweep:** By positioning these rings far off the top of the viewport (e.g., `top: -60%`), only the bottom arc of the ring is visible on screen. This perfectly mimics the natural, sweeping curve of an Aurora borealis ribbon.
4.  **The Glow:** We apply a moderate `blur-[50px]` and `mix-blend-screen` to the elements so their intersecting colors create bright, additive light.

### The Code Example
```tsx
<div className="absolute inset-0 opacity-80 mix-blend-screen">
  {/* The Ribbon */}
  <div className="absolute top-[-60%] left-[-20%] w-[150vw] h-[120vh] border-[60px] border-emerald-500/25 rounded-[100%] blur-[40px] animate-ribbon-wave-1"></div>
</div>
```

## 3. Color Palette
The Aurora system relies on a very dark base with cool, additive highlights:
*   **Base:** `bg-[#020617]` (Deep Slate 950) with an `absolute inset-0 bg-slate-950/80` layer for extra depth.
*   **Ribbon 1 (Primary):** `border-emerald-500/25`
*   **Ribbon 2 (Secondary):** `border-teal-400/20`
*   **Ribbon 3 (Deep Accent):** `border-indigo-500/20`
*   **Focal Bloom:** `bg-teal-400/5` (Behind the main headline/content to ensure readability).

## 4. Texture
An `absolute` layer with an SVG `feTurbulence` filter is overlaid on the entire background using `mix-blend-screen` at `4%` opacity. This provides a subtle "film grain" texture that grounds the glowing lights and prevents color banding on low-quality displays.
