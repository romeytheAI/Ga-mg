import re

with open('src/components/model/SvgBodyLayers.tsx', 'r') as f:
    content = f.read()

clothing_logic = """

  // --- Clothing Renderer (Advanced High Fidelity) ---
  const renderClothing = (item: ClothingItem | null, type: 'upper' | 'lower') => {
    if (!item) return null;
    const clothColor = clothingColors[item.id] || clothingColors['common_shirt'];
    const integrityPct = item.integrity / item.maxIntegrity;

    // Tattered masks for holes and rips (High Fidelity)
    let maskId = undefined;
    if (integrityPct < 0.8) {
       maskId = integrityPct < 0.4 ? "url(#heavy-tear-mask)" : "url(#light-tear-mask)";
    }

    if (type === 'upper') {
       const tunicPath = isFemale
         ? "M 56 130 C 40 160, 40 240, 50 250 L 70 220 L 66 370 C 100 390, 134 370, 134 370 L 130 220 L 150 250 C 160 240, 160 160, 144 130 C 130 116, 120 124, 100 140 C 80 124, 70 116, 56 130 Z"
         : "M 50 130 C 36 160, 36 240, 46 250 L 70 220 L 70 370 C 100 380, 130 370, 130 370 L 130 220 L 154 250 C 164 240, 164 160, 150 130 C 136 116, 120 124, 100 140 C 80 124, 64 116, 50 130 Z";

       return (
          <g mask={maskId} style={{ opacity: integrityPct < 0.1 ? 0.8 : 1 }}>
             {/* Back collar / Inside */}
             <path d="M 76 120 Q 100 130, 124 120 L 130 130 Q 100 144, 70 130 Z" fill="#1a1a1a" opacity="0.6" />

             {/* Main Tunic Body with High-Fidelity Gradient */}
             <path d={tunicPath} fill={`url(#cloth-grad-${item.id})`} />

             {/* Texture Overlay */}
             <path d={tunicPath} fill="none" stroke={clothColor.texture} strokeWidth="1" strokeDasharray="2, 2" opacity="0.3" />

             {/* Deep Shadows / Folds */}
             <path d="M 70 220 C 90 260, 80 360, 80 360" stroke={clothColor.deepShadow} strokeWidth="2" fill="none" opacity="0.6" filter="url(#blur-sm)" />
             <path d="M 130 220 C 110 260, 120 360, 120 360" stroke={clothColor.deepShadow} strokeWidth="2" fill="none" opacity="0.6" filter="url(#blur-sm)" />

             {/* Female chest drape shadow */}
             {isFemale && <path d="M 70 210 Q 100 230, 130 210" stroke={clothColor.deepShadow} strokeWidth="4" fill="none" opacity="0.5" filter="url(#blur-md)" />}

             {/* Specular Highlights for leather/silk */}
             {item.id.includes('leather') && (
               <path d="M 76 180 C 80 200, 78 280, 78 280" stroke="#FFF" strokeWidth="1.5" fill="none" opacity="0.3" filter="url(#blur-sm)" />
             )}

             {/* Belt */}
             {(item.id.includes('tunic') || item.id.includes('robes')) && (
               <g>
                 <path d="M 68 300 Q 100 310, 132 300 L 132 310 Q 100 320, 68 310 Z" fill="#2d1a11" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.5))" />
                 <path d="M 68 302 Q 100 312, 132 302" stroke="#4a2b18" strokeWidth="1" fill="none" />
                 <rect x="94" y="298" width="12" height="16" fill="#d4af37" rx="2" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.5))" />
                 <rect x="96" y="300" width="8" height="12" fill="#2d1a11" />
                 <rect x="94" y="306" width="12" height="2" fill="#FFF" opacity="0.5" />
               </g>
             )}
          </g>
       );
    } else { // lower
       const pantsPath = isFemale
         ? "M 64 360 Q 100 370, 136 360 L 136 500 L 104 500 L 100 400 L 96 500 L 64 500 Z"
         : "M 68 360 Q 100 370, 132 360 L 134 500 L 104 500 L 100 400 L 96 500 L 66 500 Z";

       return (
          <g mask={maskId} style={{ opacity: integrityPct < 0.1 ? 0.8 : 1 }}>
             <path d={pantsPath} fill={`url(#cloth-grad-${item.id})`} />

             {/* Crotch/Inseam Shading */}
             <path d="M 100 400 L 104 500 L 96 500 Z" fill="#000" opacity="0.4" filter="url(#blur-sm)" />

             {/* Knee Folds */}
             <path d="M 68 440 Q 80 450, 92 440 M 108 440 Q 120 450, 132 440" stroke={clothColor.deepShadow} strokeWidth="3" fill="none" opacity="0.5" filter="url(#blur-sm)" />
             <path d="M 68 438 Q 80 448, 92 438 M 108 438 Q 120 448, 132 438" stroke={clothColor.highlight} strokeWidth="1" fill="none" opacity="0.4" filter="url(#blur-sm)" />
          </g>
       );
    }
  };

  // Insert before return (
"""

content = content.replace("  return (\n    <div className=\"w-full h-full", clothing_logic + "  return (\n    <div className=\"w-full h-full")

# Find the end of the <g id="model"> block to append the clothing calls
render_clothing_calls = """
           {/* --- CLOTHING LAYERS (High Fidelity) --- */}
           {clothing.under_lower && (
              <g mask={clothing.under_lower.integrity / clothing.under_lower.maxIntegrity < 0.5 ? "url(#heavy-tear-mask)" : "none"}>
                 <path d={isFemale ? "M 72 300 Q 100 310, 128 300 L 120 340 Q 100 330, 80 340 Z" : "M 76 300 Q 100 310, 124 300 L 120 340 Q 100 330, 80 340 Z"} fill="#D1C288" />
                 <path d="M 100 306 L 100 330" stroke="#9A803B" strokeWidth="2" fill="none" opacity="0.5" />
                 {/* Shadows */}
                 <path d="M 74 300 Q 100 310, 126 300 L 126 310 Q 100 320, 74 310 Z" fill="#000" opacity="0.2" filter="url(#blur-sm)" />
              </g>
           )}

           {renderClothing(clothing.lower, 'lower')}
           {renderClothing(clothing.upper, 'upper')}

           {clothing.over && (
              <g mask={clothing.over.integrity / clothing.over.maxIntegrity < 0.5 ? "url(#heavy-tear-mask)" : "none"}>
                 <path d="M 30 100 Q 100 90, 170 100 L 180 400 Q 100 440, 20 400 Z" fill={`url(#cloth-grad-${clothing.over.id})`} opacity="0.95" />
                 <path d="M 50 100 Q 60 240, 40 390 M 150 100 Q 140 240, 160 390" stroke={clothingColors[clothing.over.id]?.deepShadow || '#000'} strokeWidth="4" fill="none" opacity="0.6" filter="url(#blur-sm)" />
                 <path d="M 48 100 Q 58 240, 38 390 M 148 100 Q 138 240, 158 390" stroke={clothingColors[clothing.over.id]?.highlight || '#FFF'} strokeWidth="2" fill="none" opacity="0.4" filter="url(#blur-sm)" />
              </g>
           )}
        </g>
"""

content = content.replace("        </g>\n      </svg>", render_clothing_calls + "        </g>\n      </svg>")

with open('src/components/model/SvgBodyLayers.tsx', 'w') as f:
    f.write(content)
