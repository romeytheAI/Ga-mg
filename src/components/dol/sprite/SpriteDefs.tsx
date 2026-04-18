import React from 'react';

interface SpriteDefsProps {
  skin: string;
  skinShadow: string;
  skinHighlight: string;
  hairClr: string;
  hairHighlight: string;
  eyeClr: string;
}

/** Shared SVG <defs> for the Hikari-quality character sprite */
export const SpriteDefs: React.FC<SpriteDefsProps> = ({
  skin, skinShadow, skinHighlight, hairClr, hairHighlight, eyeClr,
}) => (
  <defs>
    {/* ── Subsurface-scattering skin filter ─────────────────────── */}
    <filter id="sss" x="-4%" y="-4%" width="108%" height="108%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
      <feColorMatrix in="blur" type="matrix"
        values="1 0 0 0 0.02
                0 1 0 0 0.005
                0 0 1 0 0.0
                0 0 0 0.35 0" result="sss" />
      <feComposite in="SourceGraphic" in2="sss" operator="over" />
    </filter>

    {/* ── Soft blur for glow effects ────────────────────────────── */}
    <filter id="blur-soft">
      <feGaussianBlur stdDeviation="1.2" />
    </filter>
    <filter id="blur-xs">
      <feGaussianBlur stdDeviation="0.5" />
    </filter>

    {/* ── Ambient occlusion shadow ──────────────────────────────── */}
    <filter id="ao-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="shadow" />
      <feColorMatrix in="shadow" type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0.18 0" result="tinted" />
      <feComposite in="SourceGraphic" in2="tinted" operator="over" />
    </filter>

    {/* ── Skin gradient (body vertical) ─────────────────────────── */}
    <linearGradient id="skin-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={skinHighlight} />
      <stop offset="35%" stopColor={skin} />
      <stop offset="85%" stopColor={skinShadow} />
      <stop offset="100%" stopColor={skinShadow} />
    </linearGradient>

    {/* ── Skin radial for face ──────────────────────────────────── */}
    <radialGradient id="skin-face" cx="0.5" cy="0.38" r="0.55" fx="0.48" fy="0.35">
      <stop offset="0%" stopColor={skinHighlight} />
      <stop offset="60%" stopColor={skin} />
      <stop offset="100%" stopColor={skinShadow} />
    </radialGradient>

    {/* ── Torso shading (left-lit) ──────────────────────────────── */}
    <linearGradient id="torso-shade" x1="0.15" y1="0" x2="0.85" y2="0.6">
      <stop offset="0%" stopColor={skinHighlight} stopOpacity="0.35" />
      <stop offset="50%" stopColor={skin} stopOpacity="0" />
      <stop offset="100%" stopColor={skinShadow} stopOpacity="0.25" />
    </linearGradient>

    {/* ── Limb cylindrical shading ──────────────────────────────── */}
    <linearGradient id="limb-shade-l" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={skinHighlight} stopOpacity="0.2" />
      <stop offset="45%" stopColor={skin} stopOpacity="0" />
      <stop offset="100%" stopColor={skinShadow} stopOpacity="0.3" />
    </linearGradient>
    <linearGradient id="limb-shade-r" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stopColor={skinHighlight} stopOpacity="0.2" />
      <stop offset="45%" stopColor={skin} stopOpacity="0" />
      <stop offset="100%" stopColor={skinShadow} stopOpacity="0.3" />
    </linearGradient>

    {/* ── Iris gradient ─────────────────────────────────────────── */}
    <radialGradient id="iris-l" cx="0.45" cy="0.42" r="0.55">
      <stop offset="0%" stopColor={eyeClr} />
      <stop offset="70%" stopColor={eyeClr} />
      <stop offset="100%" stopColor="#222" />
    </radialGradient>
    <radialGradient id="iris-r" cx="0.55" cy="0.42" r="0.55">
      <stop offset="0%" stopColor={eyeClr} />
      <stop offset="70%" stopColor={eyeClr} />
      <stop offset="100%" stopColor="#222" />
    </radialGradient>

    {/* ── Sclera gradient ───────────────────────────────────────── */}
    <radialGradient id="sclera" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0%" stopColor="#fff" />
      <stop offset="80%" stopColor="#f0eee8" />
      <stop offset="100%" stopColor="#ddd8d0" />
    </radialGradient>

    {/* ── Lip gradient ──────────────────────────────────────────── */}
    <linearGradient id="lip-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#d06868" stopOpacity="0.7" />
      <stop offset="50%" stopColor="#c05858" stopOpacity="0.55" />
      <stop offset="100%" stopColor="#b04848" stopOpacity="0.4" />
    </linearGradient>

    {/* ── Hair gradient (vertical) ──────────────────────────────── */}
    <linearGradient id="hair-main" x1="0" y1="0" x2="0.15" y2="1">
      <stop offset="0%" stopColor={hairHighlight} />
      <stop offset="40%" stopColor={hairClr} />
      <stop offset="100%" stopColor={hairClr} />
    </linearGradient>

    {/* ── Hair shine band ───────────────────────────────────────── */}
    <linearGradient id="hair-shine" x1="0.3" y1="0" x2="0.7" y2="0.5">
      <stop offset="0%" stopColor="#fff" stopOpacity="0" />
      <stop offset="40%" stopColor="#fff" stopOpacity="0.18" />
      <stop offset="60%" stopColor="#fff" stopOpacity="0.18" />
      <stop offset="100%" stopColor="#fff" stopOpacity="0" />
    </linearGradient>

    {/* ── Rim-light gradient (right edge) ───────────────────────── */}
    <linearGradient id="rim-light" x1="0.7" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#fff" stopOpacity="0" />
      <stop offset="100%" stopColor="#fff" stopOpacity="0.12" />
    </linearGradient>

    {/* ── Bust shading (sphere) ─────────────────────────────────── */}
    <radialGradient id="bust-shade-l" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stopColor={skinHighlight} />
      <stop offset="60%" stopColor={skin} />
      <stop offset="100%" stopColor={skinShadow} />
    </radialGradient>
    <radialGradient id="bust-shade-r" cx="0.6" cy="0.35" r="0.6">
      <stop offset="0%" stopColor={skinHighlight} />
      <stop offset="60%" stopColor={skin} />
      <stop offset="100%" stopColor={skinShadow} />
    </radialGradient>

    {/* ── Areola gradient ───────────────────────────────────────── */}
    <radialGradient id="areola-grad" cx="0.5" cy="0.45" r="0.5">
      <stop offset="0%" stopColor="#c87060" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#b06050" stopOpacity="0.2" />
    </radialGradient>

    {/* ── Corneal reflection arc ────────────────────────────────── */}
    <linearGradient id="cornea-shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
      <stop offset="100%" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
  </defs>
);

// ── Shared hex color parsing utility ──────────────────────────────────
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}
const toHex = (v: number) => v.toString(16).padStart(2, '0');

// ── Helper: derive shadow/highlight colors from base skin hex ─────────
export function deriveSkinTones(skinHex: string): {
  base: string; shadow: string; highlight: string;
} {
  const [r, g, b] = parseHex(skinHex);

  const shadowR  = Math.max(0, Math.round(r * 0.78));
  const shadowG  = Math.max(0, Math.round(g * 0.72));
  const shadowB  = Math.max(0, Math.round(b * 0.70));

  const hiR = Math.min(255, Math.round(r + (255 - r) * 0.35));
  const hiG = Math.min(255, Math.round(g + (255 - g) * 0.30));
  const hiB = Math.min(255, Math.round(b + (255 - b) * 0.22));

  return {
    base: skinHex,
    shadow: `#${toHex(shadowR)}${toHex(shadowG)}${toHex(shadowB)}`,
    highlight: `#${toHex(hiR)}${toHex(hiG)}${toHex(hiB)}`,
  };
}

export function deriveHairHighlight(hairHex: string): string {
  if (hairHex === 'transparent') return 'transparent';
  const [r, g, b] = parseHex(hairHex);
  const hiR = Math.min(255, Math.round(r + (255 - r) * 0.4));
  const hiG = Math.min(255, Math.round(g + (255 - g) * 0.35));
  const hiB = Math.min(255, Math.round(b + (255 - b) * 0.3));
  return `#${toHex(hiR)}${toHex(hiG)}${toHex(hiB)}`;
}
