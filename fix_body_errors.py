import re

with open('src/components/model/SvgBodyLayers.tsx', 'r') as f:
    content = f.read()

# Add the missing state variables back in
toggles_str = """
  const isBlushing = stats.arousal > stats.maxArousal * 0.4;
  const heavyBlush = stats.arousal > stats.maxArousal * 0.8;
  const isCrying = stats.trauma > stats.maxTrauma * 0.5;
  const heavyTears = stats.trauma > stats.maxTrauma * 0.8;
  const isSweating = stats.fatigue < stats.maxFatigue * 0.4 || stats.stress > stats.maxStress * 0.6;
  const heavySweat = stats.fatigue < stats.maxFatigue * 0.1 || stats.stress > stats.maxStress * 0.9;
  const isBruised = stats.health < stats.maxHealth * 0.5;
  const isBleeding = stats.health < stats.maxHealth * 0.2;
  const isCorrupted = stats.corruption > 1000;

  // Eyebrows
  let leftBrow = "M 64 46 Q 72 42 84 48";
  let rightBrow = "M 136 46 Q 128 42 116 48";
  if (stats.stress > stats.maxStress * 0.6) {
    leftBrow = "M 64 40 Q 76 46 88 52";
    rightBrow = "M 136 40 Q 124 46 112 52";
  } else if (stats.trauma > stats.maxTrauma * 0.6) {
    leftBrow = "M 60 50 Q 72 42 84 44";
    rightBrow = "M 140 50 Q 128 42 116 44";
  }

  // Eyes (Lids and Shape)
  let eyeShape = "M 62 62 Q 74 52 86 62 Q 74 70 62 62";
  let eyeShapeR = "M 138 62 Q 126 52 114 62 Q 126 70 138 62";
  let pupilSize = 4;

  if (stats.stress > stats.maxStress * 0.7) {
    eyeShape = "M 62 64 Q 74 58 86 64 Q 74 68 62 64";
    eyeShapeR = "M 138 64 Q 126 58 114 64 Q 126 68 138 64";
    pupilSize = 3;
  } else if (stats.trauma > stats.maxTrauma * 0.7 || stats.arousal > stats.maxArousal * 0.8) {
    eyeShape = "M 62 62 Q 74 48 86 62 Q 74 74 62 62";
    eyeShapeR = "M 138 62 Q 126 48 114 62 Q 126 74 138 62";
    pupilSize = 5;
  }
  if (isCorrupted) pupilSize = 6;

  // Mouth
  let mouthPath = "M 88 96 Q 100 100 112 96";
  if (stats.health < stats.maxHealth * 0.3) mouthPath = "M 88 96 Q 100 88 112 96";
  else if (stats.arousal > stats.maxArousal * 0.8) mouthPath = "M 92 96 Q 100 108 108 96";
  else if (stats.stress > stats.maxStress * 0.7) mouthPath = "M 84 96 Q 100 98 116 96";
"""

content = content.replace("const isFemale = gender === 'Female';", "const isFemale = gender === 'Female';\n" + toggles_str)

# Fix colors.eye -> colors.eyeBase
content = content.replace("colors.eye}", "colors.eyeBase}")

# Fix colors.highlight -> colors.highLight
content = content.replace("colors.highlight", "colors.highLight")

with open('src/components/model/SvgBodyLayers.tsx', 'w') as f:
    f.write(content)
