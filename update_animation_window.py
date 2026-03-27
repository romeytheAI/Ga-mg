import re

with open('src/components/AnimationWindow.tsx', 'r') as f:
    content = f.read()

# Add xray mode to hook
content = content.replace(
    'const { stats, clothing } = useGameStore();',
    'const { stats, clothing, xrayMode, toggleXray } = useGameStore();'
)

# Add UI toggle button
toggle_button = """
       {/* X-Ray Toggle Button */}
       <button
         onClick={toggleXray}
         className={`absolute top-2 left-2 z-40 px-2 py-1 text-xs font-bold rounded border transition-all ${
            xrayMode
              ? 'bg-pink-500/80 text-white border-pink-300 shadow-[0_0_10px_#ec4899]'
              : 'bg-stone-800/50 text-stone-400 border-stone-600 hover:bg-stone-700/50'
         }`}
       >
         X-RAY
       </button>

       {/* Corner Status Indicators */}
"""

content = content.replace('       {/* Corner Status Indicators */}', toggle_button)

# Also update the props to the SvgPlayerModel
content = content.replace(
    '<SvgPlayerModel stats={stats} clothing={clothing} />',
    '<SvgPlayerModel stats={stats} clothing={clothing} xrayMode={xrayMode} />'
)

# Remove the corner status indicators that were overlapping with the top-left button (the eye icon)
# Actually, the eye icon is top-left in the previous code. I will move the eye to bottom-left.
content = content.replace(
    'className="absolute top-2 left-2 text-indigo-500 animate-pulse text-2xl z-30 pointer-events-none">👁️</div>',
    'className="absolute bottom-10 left-2 text-indigo-500 animate-pulse text-2xl z-30 pointer-events-none">👁️</div>'
)

with open('src/components/AnimationWindow.tsx', 'w') as f:
    f.write(content)
