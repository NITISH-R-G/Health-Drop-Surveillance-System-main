import re

with open("components/__tests__/TestingLabs.test.tsx", "r") as f:
    content = f.read()

content = content.replace("expect(getByText('TWAD Board Water Testing Lab')).toBeTruthy();", "expect(getByText('Micro Labs & Diagnostics')).toBeTruthy();")

with open("components/__tests__/TestingLabs.test.tsx", "w") as f:
    f.write(content)
