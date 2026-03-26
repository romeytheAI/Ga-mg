with open('src/components/character/CharacterCreation.tsx', 'r') as f:
    content = f.read()

content = content.replace('      gender,\n      race, \n      background,', '      gender,\n      race, \n      background,')

# Wait, let's just rewrite the startGame call manually
import re
new_content = re.sub(r'startGame\(\n\s*race,\n\s*background,\n\s*startingLocationId,\n\s*startingStatsMap\[background\],\n\s*initialClothingMap\[background\]\n\s*\);',
                     'startGame(gender, race, background, startingLocationId, startingStatsMap[background], initialClothingMap[background]);',
                     content, flags=re.MULTILINE)

# Also fix the import
new_content = new_content.replace(
    "import { useGameStore, PlayableRace, Background, ClothingLayer, ClothingItem } from '../../store/gameStore';",
    "import { useGameStore, PlayableRace, Background, ClothingLayer, ClothingItem, Gender } from '../../store/gameStore';"
)

with open('src/components/character/CharacterCreation.tsx', 'w') as f:
    f.write(new_content)
