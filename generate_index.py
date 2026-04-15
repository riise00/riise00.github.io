import os
import json
from datetime import datetime

# =========================
# CONFIG
# =========================
CONFIG = [
    {
        "input_dir": "./blog/posts",
        "output_file": "./blog/index.json",
        "type": "blog"
    },
    {
        "input_dir": "./tools/items",
        "output_file": "./tools/index.json",
        "type": "tools"
    }
]

# =========================
# HELPERS
# =========================
def safe_title(data):
    return data.get("title") or data.get("name") or "Untitled"


def normalize_id(value):
    if not value:
        return None
    return str(value).strip().lower()


def safe_tags(data):
    tags = data.get("tags")
    if isinstance(tags, list):
        return tags
    return []


def upsert(items_map, item):
    item_id = normalize_id(item.get("id"))
    if not item_id:
        return

    item["id"] = item_id

    # merge instead of overwrite
    if item_id in items_map:
        existing = items_map[item_id]

        for k, v in item.items():
            if v not in [None, "", []]:
                existing[k] = v
    else:
        items_map[item_id] = item


# =========================
# RECURSIVE SCAN
# =========================
def get_all_json_files(folder):
    json_files = []
    for root, _, files in os.walk(folder):
        for f in files:
            if f.endswith(".json"):
                json_files.append(os.path.join(root, f))
    return json_files


# =========================
# MAIN GENERATOR
# =========================
def generate_index(input_dir, output_file, type_):
    items_map = {}

    if not os.path.exists(input_dir):
        print(f"❌ Folder not found: {input_dir}")
        return

    files = get_all_json_files(input_dir)

    for path in files:
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # =========================
            # BLOGS
            # =========================
            if type_ == "blog":
                if data.get("status") != "published":
                    continue

                item = dict(data)
                item["id"] = normalize_id(data.get("id") or data.get("title"))
                item["title"] = safe_title(data)
                item["tags"] = safe_tags(data)

                upsert(items_map, item)

            # =========================
            # TOOLS
            # =========================
            elif type_ == "tools":

                # CASE 1: normal tool file
                if "tools" not in data:
                    tool = dict(data)

                    tool["id"] = normalize_id(data.get("id") or data.get("title"))
                    tool["title"] = safe_title(data)
                    tool["tags"] = safe_tags(data)

                    upsert(items_map, tool)

                # CASE 2: container file (list of tools)
                else:
                    parent_title = safe_title(data)

                    for tool_data in data["tools"]:
                        tool = dict(tool_data)

                        tool["id"] = normalize_id(tool_data.get("id") or tool_data.get("name"))
                        tool["title"] = tool_data.get("name")
                        tool["tags"] = tool_data.get("tags", [])

                        # defaults if missing
                        tool.setdefault("category", "os")
                        tool.setdefault("type", "self_hosted")
                        tool["parent"] = parent_title

                        upsert(items_map, tool)

        except Exception as e:
            print(f"⚠️ Error reading {path}: {e}")

    # =========================
    # FINAL LIST
    # =========================
    items = list(items_map.values())

    # BLOG SORTING
    if type_ == "blog":
        def parse_date(item):
            try:
                return datetime.strptime(item.get("date", ""), "%Y-%m-%d")
            except:
                return datetime.min

        items.sort(key=parse_date, reverse=True)

    # WRITE FILE
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated {output_file} ({len(items)} unique items)")


# =========================
# RUN
# =========================
if __name__ == "__main__":
    for cfg in CONFIG:
        generate_index(cfg["input_dir"], cfg["output_file"], cfg["type"])