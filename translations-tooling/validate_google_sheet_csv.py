#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path

CONTROL_CHARS_RE = re.compile(r"[\x00-\x08\x0B-\x1F\x7F]")
SCRIPT_ID_RE = re.compile(r"^[a-z0-9_]+$")

REQUIRED_CHARACTER_HEADERS = {
    "id",
    "name",
    "team",
    "edition",
    "ability",
}
REQUIRED_SCRIPT_HEADERS = {
    "id",
    "name",
    "author",
    "synopsis",
    "json",
    "pdf",
}
OPTIONAL_CHARACTER_HEADERS = {
    "image",
    "firstNightReminder",
    "otherNightReminder",
    "reminders",
    "remindersGlobal",
    "firstNight",
    "otherNight",
    "flavor",
    "note",
}
OPTIONAL_SCRIPT_BOOL_HEADERS = {"official", "teensyville"}
OPTIONAL_SCRIPT_HEADERS = {"logo", "note", "official", "teensyville"}
KNOWN_CHARACTER_HEADERS = REQUIRED_CHARACTER_HEADERS | OPTIONAL_CHARACTER_HEADERS
KNOWN_SCRIPT_HEADERS = REQUIRED_SCRIPT_HEADERS | OPTIONAL_SCRIPT_HEADERS
ALLOWED_URL_PREFIXES = ("/translations/assets/", "https://", "http://", "/")
ALLOWED_TEAMS = {"townsfolk", "outsider", "minion", "demon", "traveler", "fabled", "jinxes"}


@dataclass
class ValidationResult:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    infos: list[str] = field(default_factory=list)

    def merge(self, other: "ValidationResult") -> None:
        self.errors.extend(other.errors)
        self.warnings.extend(other.warnings)
        self.infos.extend(other.infos)


def sanitize_header(raw: str | None) -> str:
    if raw is None:
        return ""

    value = raw.lstrip("\ufeff")
    value = CONTROL_CHARS_RE.sub("", value)
    return value.strip()


def clean_text(raw: str | None) -> str:
    if raw is None:
        return ""

    value = raw.replace("\r\n", "\n").replace("\r", "\n")
    value = CONTROL_CHARS_RE.sub("", value)
    return value.strip()


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


def add_issue(result: ValidationResult, message: str, as_error: bool) -> None:
    if as_error:
        result.errors.append(message)
        return
    result.warnings.append(message)


def read_csv(
    csv_path: Path,
    *,
    fail_on_control_chars: bool,
    fail_on_header_normalization: bool,
) -> tuple[list[str], list[tuple[int, dict[str, str]]], ValidationResult]:
    result = ValidationResult()
    if not csv_path.exists():
        result.errors.append(f"{csv_path}: file does not exist")
        return [], [], result

    with csv_path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.reader(handle)
        try:
            raw_headers = next(reader)
        except StopIteration:
            result.errors.append(f"{csv_path}: empty CSV (header row missing)")
            return [], [], result

        headers = [sanitize_header(header) for header in raw_headers]
        for index, (raw_header, normalized_header) in enumerate(zip(raw_headers, headers), start=1):
            if normalized_header == "":
                result.errors.append(f"{csv_path}: header column {index} is empty after sanitization")
                continue
            if raw_header != normalized_header:
                add_issue(
                    result,
                    f"{csv_path}: header '{raw_header}' normalized to '{normalized_header}'",
                    as_error=fail_on_header_normalization,
                )

        duplicates = [header for header, count in count_duplicates(headers).items() if count > 1]
        for duplicate in duplicates:
            result.errors.append(f"{csv_path}: duplicated header '{duplicate}'")

        dict_reader = csv.DictReader(handle, fieldnames=headers)
        rows: list[tuple[int, dict[str, str]]] = []
        for line_number, raw_row in enumerate(dict_reader, start=2):
            row: dict[str, str] = {}
            for raw_key, raw_value in raw_row.items():
                key = sanitize_header(raw_key)
                if key == "":
                    continue
                value = raw_value or ""
                if CONTROL_CHARS_RE.search(value):
                    add_issue(
                        result,
                        f"{csv_path}:{line_number} field '{key}' contains control characters",
                        as_error=fail_on_control_chars,
                    )
                row[key] = value
            rows.append((line_number, row))

        result.infos.append(f"{csv_path}: loaded {len(rows)} row(s)")
        return headers, rows, result


def count_duplicates(values: list[str]) -> dict[str, int]:
    counts: dict[str, int] = defaultdict(int)
    for value in values:
        counts[value] += 1
    return counts


def ensure_required_headers(
    csv_path: Path, headers: list[str], required_headers: set[str]
) -> ValidationResult:
    result = ValidationResult()
    missing = sorted(required_headers - set(headers))
    for header in missing:
        result.errors.append(f"{csv_path}: missing required header '{header}'")
    return result


def validate_known_headers(
    csv_path: Path, headers: list[str], known_headers: set[str]
) -> ValidationResult:
    result = ValidationResult()
    unknown = sorted(set(headers) - known_headers)
    for header in unknown:
        result.errors.append(f"{csv_path}: unknown header '{header}'")
    return result


def validate_unique_ids(csv_path: Path, rows: list[tuple[int, dict[str, str]]]) -> ValidationResult:
    result = ValidationResult()
    seen: dict[str, int] = {}
    for line_number, row in rows:
        row_id = clean_text(row.get("id"))
        has_non_empty_cell = any(clean_text(value) != "" for value in row.values())
        if row_id == "":
            if has_non_empty_cell:
                result.errors.append(f"{csv_path}:{line_number} has data but empty 'id'")
            continue

        first_line = seen.get(row_id)
        if first_line is None:
            seen[row_id] = line_number
            continue

        result.errors.append(
            f"{csv_path}:{line_number} duplicated id '{row_id}' (first defined at line {first_line})"
        )
    return result


def validate_character_rows(csv_path: Path, rows: list[tuple[int, dict[str, str]]]) -> ValidationResult:
    result = ValidationResult()
    for line_number, row in rows:
        row_id = clean_text(row.get("id"))
        if row_id == "":
            continue

        team = clean_text(row.get("team")).lower()
        if team != "" and team not in ALLOWED_TEAMS:
            result.warnings.append(
                f"{csv_path}:{line_number} id='{row_id}' uses unknown team '{team}'"
            )

        for key in ("firstNight", "otherNight"):
            value = clean_text(row.get(key))
            if value != "" and not value.lstrip("-").isdigit():
                result.warnings.append(
                    f"{csv_path}:{line_number} id='{row_id}' has non-numeric '{key}' value '{value}'"
                )

    return result


def validate_script_rows(csv_path: Path, rows: list[tuple[int, dict[str, str]]]) -> ValidationResult:
    result = ValidationResult()
    for line_number, row in rows:
        row_id = clean_text(row.get("id"))
        if row_id == "":
            continue
        if not SCRIPT_ID_RE.fullmatch(row_id):
            result.errors.append(
                f"{csv_path}:{line_number} id='{row_id}' must match regex '{SCRIPT_ID_RE.pattern}'"
            )

        for key in ("name", "author", "synopsis", "json", "pdf"):
            if clean_text(row.get(key)) == "":
                result.errors.append(f"{csv_path}:{line_number} id='{row_id}' has empty '{key}'")

        json_url = clean_text(row.get("json"))
        if any(char.isspace() for char in json_url):
            result.errors.append(
                f"{csv_path}:{line_number} id='{row_id}' has whitespace in json path"
            )
        if json_url != "" and not json_url.endswith(".json"):
            result.warnings.append(
                f"{csv_path}:{line_number} id='{row_id}' has json path not ending with .json"
            )
        if json_url != "" and not json_url.startswith(ALLOWED_URL_PREFIXES):
            result.errors.append(
                f"{csv_path}:{line_number} id='{row_id}' has unsupported json path '{json_url}'"
            )

        pdf_url = clean_text(row.get("pdf"))
        if any(char.isspace() for char in pdf_url):
            result.errors.append(
                f"{csv_path}:{line_number} id='{row_id}' has whitespace in pdf path"
            )
        if pdf_url != "" and not pdf_url.endswith(".pdf"):
            result.warnings.append(
                f"{csv_path}:{line_number} id='{row_id}' has pdf path not ending with .pdf"
            )
        if pdf_url != "" and not pdf_url.startswith(ALLOWED_URL_PREFIXES):
            result.errors.append(
                f"{csv_path}:{line_number} id='{row_id}' has unsupported pdf path '{pdf_url}'"
            )

        for key in OPTIONAL_SCRIPT_BOOL_HEADERS:
            if key not in row:
                continue
            raw_value = row.get(key)
            parsed = parse_optional_bool(raw_value)
            if clean_text(raw_value) != "" and parsed is None:
                result.errors.append(
                    f"{csv_path}:{line_number} id='{row_id}' has invalid boolean '{key}={raw_value}'"
                )

    return result


def print_result(result: ValidationResult) -> None:
    for info in result.infos:
        print(f"[info] {info}")
    for warning in result.warnings:
        print(f"[warn] {warning}")
    for error in result.errors:
        print(f"[error] {error}", file=sys.stderr)

    print(
        f"[summary] {len(result.errors)} error(s), {len(result.warnings)} warning(s), {len(result.infos)} info(s)"
    )


def parse_args() -> argparse.Namespace:
    script_dir = Path(__file__).resolve().parent
    default_csv_dir = script_dir / "assets" / "csv"

    parser = argparse.ArgumentParser(
        description="Validate Google Sheets exported CSV files used by translations tooling"
    )
    parser.add_argument(
        "--characters",
        type=Path,
        default=default_csv_dir / "ko_KR.csv",
        help="Path to Characters CSV export (default: translations-tooling/assets/csv/ko_KR.csv)",
    )
    parser.add_argument(
        "--scripts",
        type=Path,
        default=default_csv_dir / "scripts.csv",
        help="Path to Scripts CSV export (default: translations-tooling/assets/csv/scripts.csv)",
    )
    parser.add_argument(
        "--skip-characters",
        action="store_true",
        help="Skip validation for Characters CSV",
    )
    parser.add_argument(
        "--skip-scripts",
        action="store_true",
        help="Skip validation for Scripts CSV",
    )
    parser.add_argument(
        "--strict-warnings",
        action="store_true",
        help="Treat warnings as errors (exit code 1 when warnings exist)",
    )
    parser.add_argument(
        "--fail-on-control-chars",
        action="store_true",
        help="Treat control characters in CSV values as errors",
    )
    parser.add_argument(
        "--fail-on-header-normalization",
        action="store_true",
        help="Treat header normalization (BOM/control-char cleanup) as errors",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Enable strict mode (strict warnings + fail on control chars + fail on header normalization)",
    )

    args = parser.parse_args()
    if args.strict:
        args.strict_warnings = True
        args.fail_on_control_chars = True
        args.fail_on_header_normalization = True
    return args


def main() -> int:
    args = parse_args()
    result = ValidationResult()

    if args.skip_characters and args.skip_scripts:
        print("[error] both targets are skipped; nothing to validate", file=sys.stderr)
        return 1

    if not args.skip_characters:
        characters_csv = args.characters.resolve()
        headers, rows, load_result = read_csv(
            characters_csv,
            fail_on_control_chars=args.fail_on_control_chars,
            fail_on_header_normalization=args.fail_on_header_normalization,
        )
        result.merge(load_result)
        if headers:
            result.merge(ensure_required_headers(characters_csv, headers, REQUIRED_CHARACTER_HEADERS))
            result.merge(validate_known_headers(characters_csv, headers, KNOWN_CHARACTER_HEADERS))
            result.merge(validate_unique_ids(characters_csv, rows))
            result.merge(validate_character_rows(characters_csv, rows))

    if not args.skip_scripts:
        scripts_csv = args.scripts.resolve()
        headers, rows, load_result = read_csv(
            scripts_csv,
            fail_on_control_chars=args.fail_on_control_chars,
            fail_on_header_normalization=args.fail_on_header_normalization,
        )
        result.merge(load_result)
        if headers:
            result.merge(ensure_required_headers(scripts_csv, headers, REQUIRED_SCRIPT_HEADERS))
            result.merge(validate_known_headers(scripts_csv, headers, KNOWN_SCRIPT_HEADERS))
            result.merge(validate_unique_ids(scripts_csv, rows))
            result.merge(validate_script_rows(scripts_csv, rows))

    print_result(result)
    if result.errors:
        return 1
    if args.strict_warnings and result.warnings:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
