import re

with open("lib/mockData.ts", "r") as f:
    content = f.read()

# remove duplicate testingLabs
pattern = r"export const testingLabs: Lab\[\] = \[\s*\{\s*id: '1',\s*name: 'PSG Hospitals Laboratory',.*?\];"
matches = re.findall(pattern, content, flags=re.DOTALL)
if len(matches) > 1:
    content = content.replace(matches[1], "")

with open("lib/mockData.ts", "w") as f:
    f.write(content)
