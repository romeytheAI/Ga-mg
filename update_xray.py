import re

with open('src/components/model/SvgBodyLayers.tsx', 'r') as f:
    content = f.read()

# Add xrayMode to ModelProps
content = content.replace(
    'interface ModelProps {\n  stats: PlayerState[\'stats\'];\n  clothing: PlayerState[\'clothing\'];\n}',
    'interface ModelProps {\n  stats: PlayerState[\'stats\'];\n  clothing: PlayerState[\'clothing\'];\n  xrayMode?: boolean;\n}'
)

# Extract xrayMode from props
content = content.replace(
    'export const SvgPlayerModel: React.FC<ModelProps> = ({ stats, clothing }) => {',
    'export const SvgPlayerModel: React.FC<ModelProps> = ({ stats, clothing, xrayMode = false }) => {'
)

# Add neon glowing filters to defs
neon_filters = """
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="xray-bg" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
             <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
"""

content = content.replace('        <defs>', '        <defs>' + neon_filters)

# Build the X-Ray SVG group
xray_group = """
           {/* --- X-RAY OVERLAY --- */}
           {xrayMode && (
             <g id="xray" className="pointer-events-none" style={{ mixBlendMode: 'screen' }}>
                {/* Dark circular vignette/window to simulate the X-ray view focusing on the pelvis */}
                <ellipse cx="100" cy="270" rx="35" ry="30" fill="url(#xray-bg)" />
                <ellipse cx="100" cy="270" rx="35" ry="30" stroke="#ff00ff" strokeWidth="0.5" fill="none" opacity="0.3" filter="url(#neon-glow)" />

                {isFemale ? (
                  <g transform="translate(0, 20)">
                    {/* Womb/Uterus */}
                    <path d="M 85 240 Q 100 230 115 240 C 120 260, 110 270, 105 270 L 102 280 L 98 280 L 95 270 C 90 270, 80 260, 85 240 Z"
                          fill="none" stroke="#ff2a85" strokeWidth="2" filter="url(#neon-glow)" className="animate-pulse" />

                    {/* Cervix/Vaginal Canal */}
                    <path d="M 100 280 Q 95 295 100 310" stroke="#ff2a85" strokeWidth="2" fill="none" filter="url(#neon-glow)" />
                    <path d="M 100 280 Q 105 295 100 310" stroke="#ff2a85" strokeWidth="2" fill="none" filter="url(#neon-glow)" />

                    {/* Ovaries/Fallopian Tubes */}
                    <path d="M 85 245 Q 70 240 65 245 M 115 245 Q 130 240 135 245" stroke="#f472b6" strokeWidth="1.5" fill="none" filter="url(#neon-glow)" />
                    <circle cx="65" cy="245" r="3" fill="#f472b6" filter="url(#neon-glow)" />
                    <circle cx="135" cy="245" r="3" fill="#f472b6" filter="url(#neon-glow)" />

                    {/* Fluids / Arousal visualizer */}
                    {stats.arousal > stats.maxArousal * 0.5 && (
                      <circle cx="100" cy="295" r="2" fill="#fff" filter="url(#neon-glow)" className="animate-[tearFall_2s_infinite]" />
                    )}
                  </g>
                ) : (
                  <g transform="translate(0, 20)">
                    {/* Prostate/Internal structures */}
                    <ellipse cx="100" cy="265" rx="8" ry="6" fill="none" stroke="#0ea5e9" strokeWidth="2" filter="url(#neon-glow)" className="animate-pulse" />

                    {/* Urethra/Canal */}
                    <path d="M 100 271 Q 97 290 100 320" stroke="#0ea5e9" strokeWidth="2" fill="none" filter="url(#neon-glow)" />
                    <path d="M 100 271 Q 103 290 100 320" stroke="#0ea5e9" strokeWidth="2" fill="none" filter="url(#neon-glow)" />

                    {/* Testes (Internal) */}
                    <circle cx="92" cy="315" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" filter="url(#neon-glow)" />
                    <circle cx="108" cy="315" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" filter="url(#neon-glow)" />

                    {/* Seminal Vesicles */}
                    <path d="M 92 311 Q 90 280 98 265 M 108 311 Q 110 280 102 265" stroke="#7dd3fc" strokeWidth="1" fill="none" filter="url(#neon-glow)" />

                    {/* Fluids / Arousal visualizer */}
                    {stats.arousal > stats.maxArousal * 0.5 && (
                      <circle cx="100" cy="285" r="1.5" fill="#fff" filter="url(#neon-glow)" className="animate-[tearFall_1s_infinite]" />
                    )}
                  </g>
                )}
             </g>
           )}
"""

content = content.replace('        </g>\n      </svg>\n    </div>', xray_group + '        </g>\n      </svg>\n    </div>')

with open('src/components/model/SvgBodyLayers.tsx', 'w') as f:
    f.write(content)
