import re

with open('src/components/character/CharacterCreation.tsx', 'r') as f:
    content = f.read()

# Add gender state if not present
if "const [gender, setGender] = useState<Gender>('Female');" not in content:
    content = content.replace(
        "const [race, setRace] = useState<PlayableRace>('Imperial');",
        "const [gender, setGender] = useState<Gender>('Female');\n  const [race, setRace] = useState<PlayableRace>('Imperial');"
    )

# Add gender selection to step 1
if "Select Gender" not in content:
    gender_html = """
                    <h2 className="text-2xl font-serif text-slate-100 border-b border-slate-800 pb-2 mb-4">Select Gender</h2>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {['Female', 'Male'].map(g => (
                        <button
                          key={g}
                          onClick={() => setGender(g as Gender)}
                          className={`p-3 text-center rounded border transition-all ${gender === g ? 'bg-amber-900/30 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                        >
                          <div className="font-bold text-slate-200">{g}</div>
                        </button>
                      ))}
                    </div>
    """

    content = content.replace(
        '<h2 className="text-2xl font-serif text-slate-100 border-b border-slate-800 pb-2 mb-6">Select Heritage</h2>',
        gender_html + '\n                    <h2 className="text-2xl font-serif text-slate-100 border-b border-slate-800 pb-2 mb-4">Select Heritage</h2>'
    )

# Fix startGame call
content = re.sub(
    r'startGame\(\n\s*race,\n\s*bg,\n\s*province.startNode,\n\s*combinedMods,\n\s*selectedBg.clothing\n\s*\);',
    'startGame(\n      gender,\n      race,\n      bg,\n      province.startNode,\n      combinedMods,\n      selectedBg.clothing\n    );',
    content
)

# Fix imports
if "Gender" not in content.split('\n')[2]:
    content = content.replace(
        "import { useGameStore, PlayableRace, Background, ClothingLayer, ClothingItem } from '../../store/gameStore';",
        "import { useGameStore, PlayableRace, Background, ClothingLayer, ClothingItem, Gender } from '../../store/gameStore';"
    )

with open('src/components/character/CharacterCreation.tsx', 'w') as f:
    f.write(content)
