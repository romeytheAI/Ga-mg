import json

def get_issues(filename):
    try:
        with open(filename, 'r') as f:
            data = json.load(f)
            return data.get('issues', [])
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

issues1 = get_issues('docs/foundation-roadmap.json')
issues2 = get_issues('docs/agentic-roadmap.json')

all_issues = []
for i in issues1: i['source'] = 'docs/foundation-roadmap.json'; all_issues.append(i)
for i in issues2: i['source'] = 'docs/agentic-roadmap.json'; all_issues.append(i)

unresolved = [i for i in all_issues if not i['title'].startswith('[RESOLVED]')]
p0_issues = [i for i in unresolved if '[P0]' in i['title']]

print(f"Total unresolved: {len(unresolved)}")
for i in p0_issues:
    print(f"P0 Issue: {i['title']} in {i['source']}")
