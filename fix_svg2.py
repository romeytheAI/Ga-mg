with open('src/components/model/SvgBodyLayers.tsx', 'r') as f:
    content = f.read()

content = content.replace("        </g>\n\n        </g>\n      </svg>\n    </div>\n  );\n};", "        </g>\n      </svg>\n    </div>\n  );\n};")

with open('src/components/model/SvgBodyLayers.tsx', 'w') as f:
    f.write(content)
