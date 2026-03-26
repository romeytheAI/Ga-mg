import re

with open('src/components/model/SvgBodyLayers.tsx', 'r') as f:
    content = f.read()

# Let's clean up the end of the file. My replace command probably duplicated or messed up the closing tags
content = content[:content.rfind('        </g>')] + """
        </g>
      </svg>
    </div>
  );
};
"""
with open('src/components/model/SvgBodyLayers.tsx', 'w') as f:
    f.write(content)
