import re

with open('src/store/gameStore.ts', 'r') as f:
    content = f.read()

# Update startGame parameters type
content = content.replace(
    'startGame: (\n    race: PlayableRace, \n    background: Background, ',
    'startGame: (\n    gender: Gender,\n    race: PlayableRace, \n    background: Background, '
)

# Update startGame implementation
content = content.replace(
    'startGame: (race, background, startingLocationId, statModifiers, startingClothing) => {',
    'startGame: (gender, race, background, startingLocationId, statModifiers, startingClothing) => {'
)

# Update state assignment in startGame
content = content.replace(
    '        race,\n        background,',
    '        gender,\n        race,\n        background,'
)

with open('src/store/gameStore.ts', 'w') as f:
    f.write(content)
