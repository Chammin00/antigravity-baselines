import os
import json
from collections import Counter
import re

with open('habits_analysis.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("Top 15 Most Common Repetitive User Prompts:")
for item in d['top_repetitive'][:15]:
    text_sample = item['text'].replace('\n', ' ')[:110]
    print(f"[{item['count']}x] {text_sample}")

# Let's inspect sidecars that user has in C:\Users\chase\.gemini\config\sidecars
sidecar_dir = r"C:\Users\chase\.gemini\config\sidecars"
if os.path.exists(sidecar_dir):
    print("\nConfigured Sidecars in ~/.gemini/config/sidecars:")
    for sc in os.listdir(sidecar_dir):
        print(f" - {sc}")
