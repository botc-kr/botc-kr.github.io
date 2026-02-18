#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path
from typing import Any

CONTROL_CHARS_RE = re.compile(r"[\x00-\x08\x0B-\x1F\x7F]")
KNOWN_OFFICIAL_IDS = {"trouble_brewing", "bad_moon_rising", "sects_and_violets"}


def sanitize_header(raw: str | None) -> str:
    if raw is None:
        return ""

    raw = raw.lstrip("\ufeff")
    raw = CONTROL_CHARS_RE.sub("", raw)
    return raw.strip()


def clean_text(raw: str | None) -> str:
    if raw is None:
        return ""

    normalized = raw.replace("\r\n", "\n").replace("\r", "\n")
    normalized = CONTROL_CHARS_RE.sub("", normalized)
    return normalized.strip()


def parse_optional_bool(raw: str | None) -> bool | None:
    if raw is None:
        return None

    value = clean_text(raw).lower()
    if value == "":
        return None
    if value in {"true", "1", "yes", "y"}:
        return True
    if value in {"false", "0", "no", "n"}:
        return False

    return None


def load_existing_scripts(path: Path) -> dict[str, dict[str, Any]]:
    if not path.exists():
        return {}

    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError(f"{path} must contain a JSON array")

    scripts_by_id: dict[str, dict[str, Any]] = {}
    for item in data:
        if not isinstance(item, dict):
            continue
        script_id = item.get("id")
        if isinstance(script_id, str) and script_id:
            scripts_by_id[script_id] = item

    return scripts_by_id


def iter_csv_rows(csv_path: Path) -> list[dict[str, str]]:
    with csv_path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.reader(handle)

        try:
            raw_headers = next(reader)
        except StopIteration:
            return []

        headers = [sanitize_header(header) for header in raw_headers]
        dict_reader = csv.DictReader(handle, fieldnames=headers)

        rows: list[dict[str, str]] = []
        for raw_row in dict_reader:
            normalized: dict[str, str] = {}
            for raw_key, raw_value in raw_row.items():
                key = sanitize_header(raw_key)
                if key == "":
                    continue
                normalized[key] = raw_value or ""
            rows.append(normalized)

        return rows


def build_script_row(row: dict[str, str], existing: dict[str, Any]) -> dict[str, Any] | None:
    script_id = clean_text(row.get("id"))
    if script_id == "":
        return None

    name = clean_text(row.get("name"))
    author = clean_text(row.get("author"))
    synopsis = clean_text(row.get("synopsis"))
    json_url = clean_text(row.get("json"))
    pdf_url = clean_text(row.get("pdf"))
    logo = clean_text(row.get("logo"))
    note = clean_text(row.get("note"))

    script: dict[str, Any] = {
        "author": author,
        "synopsis": synopsis,
        "name": name,
        "id": script_id,
        "pdf": pdf_url,
        "json": json_url,
        "note": note,
    }

    if logo != "":
        script["logo"] = logo

    official = parse_optional_bool(row.get("official"))
    if official is None:
        if "official" in existing:
            official = bool(existing["official"])
        else:
            official = script_id in KNOWN_OFFICIAL_IDS

    if official:
        script["official"] = True

    teensyville = parse_optional_bool(row.get("teensyville"))
    if teensyville:
        script["teensyville"] = True

    background = existing.get("background")
    if isinstance(background, str) and background.strip() != "":
        script["background"] = background

    return script


def generate_scripts(csv_path: Path, existing_path: Path) -> list[dict[str, Any]]:
    rows = iter_csv_rows(csv_path)
    existing_scripts = load_existing_scripts(existing_path)

    generated: list[dict[str, Any]] = []
    for row in rows:
        script_id = clean_text(row.get("id"))
        existing = existing_scripts.get(script_id, {})
        script = build_script_row(row, existing)
        if script is not None:
            generated.append(script)

    return generated


def main() -> int:
    script_dir = Path(__file__).resolve().parent

    parser = argparse.ArgumentParser(
        description="Generate public/scripts.json from translations-tooling scripts.csv"
    )
    parser.add_argument(
        "--csv",
        type=Path,
        default=script_dir / "assets" / "csv" / "scripts.csv",
        help="Path to scripts.csv (default: translations-tooling/assets/csv/scripts.csv)",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=script_dir.parent / "public" / "scripts.json",
        help="Output path for generated scripts.json (default: ../public/scripts.json)",
    )
    parser.add_argument(
        "--existing",
        type=Path,
        default=None,
        help="Existing scripts.json to preserve non-CSV fields (default: same as --out)",
    )

    args = parser.parse_args()
    csv_path = args.csv.resolve()
    output_path = args.out.resolve()
    existing_path = args.existing.resolve() if args.existing else output_path

    if not csv_path.exists():
        print(f"[error] CSV file not found: {csv_path}", file=sys.stderr)
        return 1

    scripts = generate_scripts(csv_path, existing_path)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(scripts, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"[ok] Generated {len(scripts)} scripts")
    print(f"[ok] Wrote: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
