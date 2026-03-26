import re

with open('src/components/character/CharacterCreation.tsx', 'r') as f:
    content = f.read()

# Add gender to state
content = content.replace(
    'const [race, setRace] = useState<PlayableRace>(\'Imperial\');',
    'const [gender, setGender] = useState<Gender>(\'Female\');\n  const [race, setRace] = useState<PlayableRace>(\'Imperial\');'
)

# Import Gender
content = content.replace(
    'PlayableRace, Background, ClothingLayer, ClothingItem }',
    'PlayableRace, Background, ClothingLayer, ClothingItem, Gender }'
)

# Update startGame call
content = content.replace(
    '    startGame(\n      race, \n      background,',
    '    startGame(\n      gender,\n      race, \n      background,'
)

# Add Gender to step 1
gender_html = """
                <h2 className="text-xl font-bold border-b border-stone-700 pb-2 mb-2">Select Gender</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['Female', 'Male'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g as Gender)}
                      className={`p-3 rounded text-center transition-colors border ${
                        gender === g
                          ? 'bg-stone-600 border-stone-400 font-bold'
                          : 'bg-stone-700 border-stone-700 hover:bg-stone-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
"""

content = content.replace(
    '<h2 className="text-xl font-bold border-b border-stone-700 pb-2 mb-4">Select Heritage</h2>',
    gender_html + '\n                <h2 className="text-xl font-bold border-b border-stone-700 pb-2 mb-4">Select Heritage</h2>'
)

with open('src/components/character/CharacterCreation.tsx', 'w') as f:
    f.write(content)
