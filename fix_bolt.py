import re

with open(".jules/bolt.md", "r") as f:
    content = f.read()

pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> origin/main\n', re.DOTALL)
new_content = pattern.sub(r'\1\n', content)

with open(".jules/bolt.md", "w") as f:
    f.write(new_content)

with open("src/components/StatsSidebar.tsx", "r") as f:
    content = f.read()

pattern = re.compile(r'<<<<<<< HEAD.*?=======(.*?)>>>>>>> origin/main', re.DOTALL)
new_content = pattern.sub(r'\1', content)

with open("src/components/StatsSidebar.tsx", "w") as f:
    f.write(new_content)
