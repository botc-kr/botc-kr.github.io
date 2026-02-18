#!/usr/bin/env python3

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

CONTROL_CHARS_RE = re.compile(r"[\x00-\x08\x0B-\x1F\x7F]")


@dataclass
class FileResult:
    path: Path
    removed_count: int
    changed: bool
    skipped_missing: bool = False


def count_control_chars(text: str) -> int:
    return len(CONTROL_CHARS_RE.findall(text))


def sanitize_text(text: str) -> str:
    return CONTROL_CHARS_RE.sub("", text)


def process_file(path: Path, *, dry_run: bool, ignore_missing: bool) -> FileResult:
    if not path.exists():
        if ignore_missing:
            return FileResult(path=path, removed_count=0, changed=False, skipped_missing=True)
        raise FileNotFoundError(f"file not found: {path}")

    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        original = handle.read()

    removed_count = count_control_chars(original)
    sanitized = sanitize_text(original)
    changed = sanitized != original

    if changed and not dry_run:
        with path.open("w", encoding="utf-8", newline="") as handle:
            handle.write(sanitized)

    return FileResult(path=path, removed_count=removed_count, changed=changed)


def parse_args() -> argparse.Namespace:
    script_dir = Path(__file__).resolve().parent
    default_csv = script_dir / "assets" / "csv" / "ko_KR.csv"

    parser = argparse.ArgumentParser(
        description="Remove ASCII control characters from CSV files (except TAB/LF/CR)."
    )
    parser.add_argument(
        "--file",
        action="append",
        type=Path,
        dest="files",
        help="CSV file path to sanitize. Repeat for multiple files.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Do not write files, only report detected control characters.",
    )
    parser.add_argument(
        "--ignore-missing",
        action="store_true",
        help="Skip missing files instead of failing.",
    )
    parser.add_argument(
        "--fail-if-found",
        action="store_true",
        help="Exit with code 1 when any control characters are found.",
    )
    args = parser.parse_args()
    if not args.files:
        args.files = [default_csv]
    return args


def main() -> int:
    args = parse_args()

    results: list[FileResult] = []
    for input_path in args.files:
        path = input_path.resolve()
        try:
            result = process_file(
                path,
                dry_run=args.dry_run,
                ignore_missing=args.ignore_missing,
            )
            results.append(result)
        except FileNotFoundError as error:
            print(f"[error] {error}", file=sys.stderr)
            return 1

    found_count = 0
    changed_count = 0

    for result in results:
        if result.skipped_missing:
            print(f"[warn] skipped missing file: {result.path}")
            continue

        if result.removed_count > 0:
            found_count += 1
        if result.changed:
            changed_count += 1

        status = "changed" if result.changed and not args.dry_run else "checked"
        print(
            f"[ok] {status}: {result.path} (control chars removed={result.removed_count})"
        )

    if args.dry_run:
        print(
            f"[summary] scanned {len(results)} file(s), found control chars in {found_count} file(s)"
        )
    else:
        print(
            f"[summary] processed {len(results)} file(s), updated {changed_count} file(s)"
        )

    if args.fail_if_found and found_count > 0:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
