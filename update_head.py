import re

with open('src/components/model/SvgBodyLayers.tsx', 'r') as f:
    content = f.read()

# Let's insert the Head section right after the torso section

head_svg = """

           {/* --- ARMS --- */}
           {/* Left Arm */}
           <g id="arm-l">
              {/* Shoulder/Deltoid */}
              <path d="M 64 110 C 30 110, 30 150, 40 220 L 45 220 C 40 160, 50 140, 72 135 Z" fill="url(#arm-l)" />
              <circle cx="56" cy="130" r="12" fill={colors.highlight} opacity="0.3" filter="url(#blur-md)" />
           </g>

           {/* Right Arm */}
           <g id="arm-r">
              <path d="M 136 110 C 170 110, 170 150, 160 220 L 155 220 C 160 160, 150 140, 128 135 Z" fill="url(#arm-r)" />
              <circle cx="144" cy="130" r="12" fill={colors.highlight} opacity="0.3" filter="url(#blur-md)" />
           </g>

           {/* --- HEAD & NECK --- */}
           <g id="head" className="origin-[100px_100px]">
              {/* Neck Cylinder */}
              <rect x="88" y="80" width="24" height="40" fill="url(#neck)" />
              {/* Sternocleidomastoid muscles */}
              <path d="M 88 80 Q 94 100 96 120" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#blur-sm)" />
              <path d="M 112 80 Q 106 100 104 120" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#blur-sm)" />
              {/* Chin Drop Shadow on Neck */}
              <path d="M 88 80 Q 100 100 112 80 Z" fill={colors.deepShadow} opacity="0.6" filter="url(#blur-sm)" />

              {/* Jaw & Cheeks */}
              <path d="M 64 50 Q 64 80 84 96 Q 100 104 116 96 Q 136 80 136 50 Z" fill={colors.base} />
              {/* Jawline shadow */}
              <path d="M 64 50 Q 64 80 84 96 Q 100 104 116 96 Q 136 80 136 50" stroke={colors.shadow} strokeWidth="6" fill="none" opacity="0.5" filter="url(#blur-md)" />
              {/* Cheekbone Highlights */}
              <ellipse cx="76" cy="65" rx="8" ry="4" fill={colors.highLight} opacity="0.4" filter="url(#blur-sm)" transform="rotate(-15 76 65)" />
              <ellipse cx="124" cy="65" rx="8" ry="4" fill={colors.highLight} opacity="0.4" filter="url(#blur-sm)" transform="rotate(15 124 65)" />

              {/* Forehead & Cranium */}
              <path d="M 64 50 C 64 -10, 136 -10, 136 50 Z" fill="url(#head-grad)" />
              <ellipse cx="100" cy="20" rx="20" ry="10" fill={colors.highLight} opacity="0.3" filter="url(#blur-md)" />

              {/* High-Fidelity Nose */}
              {/* Bridge Shadow */}
              <path d="M 94 45 Q 96 65 92 75 M 106 45 Q 104 65 108 75" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.6" filter="url(#blur-sm)" />
              {/* Bridge Highlight */}
              <path d="M 100 45 L 100 70" stroke={colors.highLight} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" filter="url(#blur-sm)" />
              {/* Tip */}
              <circle cx="100" cy="74" r="4" fill={colors.midHighlight} opacity="0.8" filter="url(#blur-sm)" />
              {/* Nostrils */}
              <path d="M 92 75 Q 96 80 100 78 Q 104 80 108 75" stroke={colors.deepShadow} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
              <circle cx="94" cy="76" r="1.5" fill={colors.deepShadow} />
              <circle cx="106" cy="76" r="1.5" fill={colors.deepShadow} />

              {/* High-Fidelity Lips */}
              {/* Philtrum (groove above lip) */}
              <path d="M 98 80 Q 100 84 102 80" stroke={colors.shadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />

              {/* Lips Base */}
              <path d={mouthPath} fill="#D96666" stroke="#5A1A1A" strokeWidth="1" strokeLinecap="round" />
              {/* Upper Lip Shadow */}
              <path d={mouthPath} fill="#8C3333" opacity="0.5" filter="url(#blur-sm)" />
              {/* Lower Lip Highlight for Volume */}
              <path d="M 90 90 Q 100 96 110 90" stroke={colors.highLight} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" filter="url(#blur-sm)" />

              {/* High-Fidelity Eyes */}
              <g className={isCrying ? 'opacity-70' : 'opacity-100'}>
                 {/* Sclera Base (Not pure white, shaded at corners) */}
                 <path d={eyeShape} fill="#E8E8E8" />
                 <path d={eyeShapeR} fill="#E8E8E8" />

                 {/* Sclera Shadow (Top lid occlusion) */}
                 <path d="M 62 55 Q 74 45 86 55" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.5" filter="url(#blur-sm)" />
                 <path d="M 138 55 Q 126 45 114 55" stroke={colors.shadow} strokeWidth="2" fill="none" opacity="0.5" filter="url(#blur-sm)" />

                 {/* Tear Ducts */}
                 <circle cx="85" cy="55" r="1.5" fill="#D98888" opacity="0.8" />
                 <circle cx="115" cy="55" r="1.5" fill="#D98888" opacity="0.8" />

                 {/* Irises with complex radial gradients (Using solid colors for now but deeply layered) */}
                 <g clipPath="url(#left-eye-clip)">
                    <clipPath id="left-eye-clip"><path d={eyeShape} /></clipPath>
                    {/* Base Iris */}
                    <circle cx="74" cy="55" r="6" fill={colors.eye} />
                    {/* Outer Iris Ring */}
                    <circle cx="74" cy="55" r="6" stroke="#000" strokeWidth="1" fill="none" opacity="0.5" />
                    {/* Inner Iris Highlight */}
                    <circle cx="74" cy="55" r="3" fill={colors.highLight} opacity="0.3" filter="url(#blur-sm)" />
                    {/* Pupil */}
                    <circle cx="74" cy="55" r={pupilSize * 2} fill="#000" />
                    {/* Hard Catchlight (Reflection) */}
                    <circle cx="72" cy="53" r="1.5" fill="#FFF" opacity="0.9" />
                    <circle cx="76" cy="57" r="0.5" fill="#FFF" opacity="0.6" />
                 </g>

                 <g clipPath="url(#right-eye-clip)">
                    <clipPath id="right-eye-clip"><path d={eyeShapeR} /></clipPath>
                    <circle cx="126" cy="55" r="6" fill={colors.eye} />
                    <circle cx="126" cy="55" r="6" stroke="#000" strokeWidth="1" fill="none" opacity="0.5" />
                    <circle cx="126" cy="55" r="3" fill={colors.highLight} opacity="0.3" filter="url(#blur-sm)" />
                    <circle cx="126" cy="55" r={pupilSize * 2} fill="#000" />
                    <circle cx="124" cy="53" r="1.5" fill="#FFF" opacity="0.9" />
                    <circle cx="128" cy="57" r="0.5" fill="#FFF" opacity="0.6" />
                 </g>

                 {/* Upper Eyelid & Eyelashes */}
                 <path d="M 60 55 Q 74 42 88 55" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                 {/* Lashes Left */}
                 <path d="M 62 52 L 58 48 M 66 48 L 64 43 M 72 46 L 72 40" stroke="#000" strokeWidth="1" fill="none" />

                 <path d="M 140 55 Q 126 42 112 55" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                 {/* Lashes Right */}
                 <path d="M 138 52 L 142 48 M 134 48 L 136 43 M 128 46 L 128 40" stroke="#000" strokeWidth="1" fill="none" />

                 {/* Eye Bags / Lower Lid Shadow */}
                 <path d="M 64 58 Q 74 64 84 58" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />
                 <path d="M 136 58 Q 126 64 116 58" stroke={colors.deepShadow} strokeWidth="1.5" fill="none" opacity="0.4" filter="url(#blur-sm)" />
              </g>

              {/* Eyebrows (Dynamic & Detailed) */}
              {/* Shadow under brow */}
              <path d={leftBrow} stroke={colors.shadow} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" filter="url(#blur-sm)" transform="translate(0, 2)" />
              <path d={rightBrow} stroke={colors.shadow} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" filter="url(#blur-sm)" transform="translate(0, 2)" />

              {/* Actual Brow Hair (Thick stroke + thin strokes) */}
              <path d={leftBrow} stroke={colors.hairBase} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d={leftBrow} stroke={colors.hairShadow} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />

              <path d={rightBrow} stroke={colors.hairBase} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d={rightBrow} stroke={colors.hairShadow} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />

           </g>
"""

new_content = content.replace('        <g id="model" className="animate-breathe origin-bottom">', '        <g id="model" className="animate-breathe origin-bottom">' + head_svg)

with open('src/components/model/SvgBodyLayers.tsx', 'w') as f:
    f.write(new_content)
