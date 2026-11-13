import os
import json
import re
from collections import Counter, defaultdict
from datetime import datetime

brain_dir = r"C:\Users\chase\.gemini\antigravity\brain"

transcript_files = []
for root, dirs, files in os.walk(brain_dir):
    if "transcript.jsonl" in files:
        transcript_files.append(os.path.join(root, "transcript.jsonl"))

user_requests = []

for file_path in transcript_files:
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                if '"type":"USER_INPUT"' in line:
                    try:
                        data = json.loads(line)
                        content = data.get("content", "")
                        match = re.search(r"<USER_REQUEST>(.*?)</USER_REQUEST>", content, re.DOTALL)
                        req_text = match.group(1).strip() if match else content.strip()
                        created_at = data.get("created_at", "")
                        if req_text:
                            user_requests.append({
                                "date": created_at,
                                "text": req_text,
                                "file": file_path
                            })
                    except Exception:
                        pass
    except Exception:
        pass

print(f"Total user requests extracted: {len(user_requests)}")

categories = {
    "YouTube & Gaming Automation": [
        "youtube", "gaming uploads", "sentinel_daemon", "eustace", "game dvr", "xbox", "obs", "shorts"
    ],
    "Deals & E-Commerce Scraping": [
        "deal", "deals", "electronics", "discounts", "steam", "chinese counterparts", "ssd"
    ],
    "Red Hat & Linux / Certifications": [
        "rhcsa", "openshift", "do180", "do280", "do380", "comptia", "rhel", "linux", "exam"
    ],
    "Ollama & AI Local Sync": [
        "ollama", "skills sync", "modelfile", "qwen", "llama", "local ai", "models tools"
    ],
    "UI, Planetarium & High-Gloss GUI": [
        "planetarium", "gui", "custom gui", "baseline", "high-gloss", "lacquer", "space background", "planets"
    ],
    "Cybersecurity & Threat Audits": [
        "security", "spam", "broker", "vulnerability", "opt-out", "sentinel pc"
    ],
    "Switch Emulation & Game Studio": [
        "switch", "emulator", "keys", "game studio", "rom", "shadowblade"
    ]
}

categorized = {k: [] for k in categories}
uncategorized = []

for req in user_requests:
    text_lower = req["text"].lower()
    matched = False
    for cat, keywords in categories.items():
        if any(kw in text_lower for kw in keywords):
            categorized[cat].append(req)
            matched = True
            break
    if not matched:
        uncategorized.append(req)

print("\n--- CATEGORY BREAKDOWN ---")
for cat, reqs in categorized.items():
    print(f"{cat}: {len(reqs)} requests")
print(f"Uncategorized: {len(uncategorized)} requests")

# Frequency of identical / near-identical requests
text_counts = Counter(r["text"] for r in user_requests)
print("\n--- TOP MOST REPETITIVE USER PROMPTS ---")
for text, count in text_counts.most_common(12):
    first_line = text.strip().split("\n")[0][:120]
    print(f"[{count} times]: {first_line}...")

# Export analysis to JSON
output_data = {
    "total_requests": len(user_requests),
    "category_counts": {cat: len(reqs) for cat, reqs in categorized.items()},
    "top_repetitive": [
        {"count": count, "text": text} for text, count in text_counts.most_common(20)
    ],
    "categories": {
        cat: [
            {"date": r["date"], "text": r["text"]} for r in reqs[:20]
        ] for cat, reqs in categorized.items()
    }
}

with open(r"G:\My Drive\Antigravity\Projects\baselines\habits_analysis.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=2)

print("\nSaved full habits analysis to habits_analysis.json")
