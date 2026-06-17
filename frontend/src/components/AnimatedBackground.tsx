import React from 'react';

export default function AnimatedBackground() {
  return (
    <>
      {/* Authentic Dark Mode Curved Aurora Ribbons & Noise Background */}
      <div className="hidden dark:block fixed inset-0 z-0 pointer-events-none bg-[#020617] overflow-hidden">
        
        {/* Far Layer: Deep Haze */}
        <div className="absolute inset-0 bg-slate-950/80 blur-[50px]"></div>

        {/* Mid Layer: Curved Hollow Ellipse Ribbons */}
        <div className="absolute inset-0 opacity-80 mix-blend-screen" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)', maskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)' }}>
          {/* Ribbon 1: Primary Emerald Curve */}
          <div className="absolute top-[-60%] left-[-20%] w-[150vw] h-[120vh] border-[60px] border-emerald-500/25 rounded-[100%] blur-[40px] animate-[ribbon-wave-1_25s_ease-in-out_infinite]"></div>
          
          {/* Ribbon 2: Intersecting Teal Curve */}
          <div className="absolute top-[-50%] left-[-10%] w-[140vw] h-[130vh] border-[40px] border-teal-400/20 rounded-[100%] blur-[50px] animate-[ribbon-wave-2_30s_ease-in-out_infinite]"></div>
          
          {/* Ribbon 3: Deep Indigo Curve */}
          <div className="absolute top-[-70%] left-[0%] w-[160vw] h-[150vh] border-[80px] border-indigo-500/20 rounded-[100%] blur-[60px] animate-[ribbon-wave-3_35s_ease-in-out_infinite]"></div>
        </div>

        {/* Focal Bloom (keeps the area behind the headline softly lit) */}
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[50%] h-[30%] rounded-[100%] bg-teal-400/5 blur-[100px]"></div>
        
        {/* Animated Film Grain */}
        <div className="absolute inset-[-10%] opacity-[0.04] mix-blend-screen animate-noise-shift" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>
      
      {/* Light Mode Papyrus Background (Sweeping Ink Washes & God Rays) */}
      <div className="dark:hidden fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FAF3E0]">
        
        {/* Soft Sun Glow (Top Right) */}
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vh] bg-amber-400/15 blur-[120px] rounded-full mix-blend-multiply"></div>
        
        {/* Soft Earth Glow (Bottom Left) */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vh] bg-orange-600/10 blur-[120px] rounded-full mix-blend-multiply"></div>

        {/* Dune 1: Sweeping Hollow Curve */}
        <div className="absolute top-[-50%] left-[-20%] w-[150vw] h-[120vh] border-[80px] border-amber-700/5 rounded-[100%] blur-[40px] animate-[papyrus-dune-1_30s_ease-in-out_infinite] will-change-transform"></div>

        {/* Dune 2: Sweeping Hollow Curve */}
        <div className="absolute bottom-[-60%] right-[-10%] w-[140vw] h-[130vh] border-[60px] border-orange-800/5 rounded-[100%] blur-[50px] animate-[papyrus-dune-2_35s_ease-in-out_infinite] will-change-transform"></div>

        {/* God Ray */}
        <div className="absolute top-[-50%] left-[30%] w-[40vw] h-[200vh] bg-gradient-to-r from-transparent via-amber-100/40 to-transparent blur-[60px] mix-blend-overlay animate-[papyrus-ray_25s_ease-in-out_infinite] will-change-transform"></div>

        {/* Subtle SVG Noise Texture for Papyrus feel */}
        <div className="absolute inset-0 opacity-[0.35] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>
    </>
  );
}
