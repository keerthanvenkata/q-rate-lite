# Frontend Architecture

Q-Rate Lite's frontend is a modern, reactive Single Page Application (SPA) optimized for performance and fluid UX. It serves both as the marketing landing page and the authenticated B2B dashboard.

## Tech Stack

- **Framework**: React 19 via Vite
- **Styling**: Tailwind CSS v4 + PostCSS
- **Routing**: `react-router-dom` v7
- **Animations**: `framer-motion` for hardware-accelerated, cinematic UI transitions.
- **State Management**: React Context API (`ThemeContext`, `AuthContext`)
- **Icons**: `lucide-react`
- **Backend Communication**: Native `fetch` API wrapping FastAPI endpoints.

## Core Structure (`src/`)

- `/components`: Reusable UI elements (`Navbar`, `Logo`, `ProtectedRoute`). Contains the `owner` subdirectory for dashboard-specific components.
- `/context`: Global state providers.
  - `AuthContext.tsx`: Manages the Supabase user session and authentication state.
  - `ThemeContext.tsx`: Manages the unified Light ("Papyrus") and Dark ("Aurora") aesthetic modes.
- `/pages`: Top-level route components.
  - `LandingPage`, `PrivacyPage`, `TermsPage`: Public marketing and legal pages.
  - `LoginPage`, `SignupPage`: Authentication flows.
  - `AdminPage`, `StaffPage`, `SuperAdminPage`, `MarketingPage`: Protected B2B dashboard routes.
  - `FeedbackPage`: The public-facing customer rating PWA triggered via WhatsApp.
- `/lib`: Utility functions and third-party client initializations (e.g., `supabase.ts`).
- `api.ts`: A centralized API client that wraps all backend interactions with strict TypeScript interfaces (e.g., `FeedbackData`, `RedeemResponse`).

## Design System

The application strictly adheres to a cinematic, minimalist design language. 
- **Light Mode (Papyrus)**: Uses warm whites, amber hues (`bg-[#FAF3E0]`), and high-contrast stone/zinc text.
- **Dark Mode (Aurora)**: Deep blacks (`bg-zinc-950`), subtle white borders, and glassmorphism (blur filters) on navigation elements.
Global UI animations are restricted to marketing pages to prevent leaking heavy DOM repaints into the data-dense dashboard views.
