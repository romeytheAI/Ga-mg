import re

with open('src/store/gameStore.ts', 'r') as f:
    content = f.read()

content = content.replace(
    '  closeShop: () => {\n    set({ phase: \'playing\', activeShopId: null });\n  },',
    '  closeShop: () => {\n    set({ phase: \'playing\', activeShopId: null });\n  },\n\n  toggleXray: () => {\n    set((state) => ({ xrayMode: !state.xrayMode }));\n  },'
)

with open('src/store/gameStore.ts', 'w') as f:
    f.write(content)
