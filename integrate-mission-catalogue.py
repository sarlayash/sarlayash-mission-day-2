from pathlib import Path

ADMIN = Path("src/mission-admin.js")

text = ADMIN.read_text(
    encoding="utf-8"
)

original = text


# ======================================================
# EXACT JAVASCRIPT ANCHORS
# ======================================================

catalogue_start = (
    "const HOUR_CATALOGUE = {"
)

total_hours = (
    "const TOTAL_HOURS = 16;"
)

firebase_import = (
    "import { db } from './firebase.js';"
)

catalogue_import = """import {
  HOUR_CATALOGUE,
  TOTAL_HOURS
} from './mission-catalogue.js';"""


# ======================================================
# SAFETY CHECKS
# ======================================================

if text.count(catalogue_start) != 1:
    raise SystemExit(
        "STOP: Expected exactly one embedded "
        "HOUR_CATALOGUE."
    )

if text.count(total_hours) != 1:
    raise SystemExit(
        "STOP: Expected exactly one TOTAL_HOURS."
    )

if text.count(firebase_import) != 1:
    raise SystemExit(
        "STOP: Expected exactly one Firebase import."
    )


start = text.index(
    catalogue_start
)

end = text.index(
    total_hours,
    start
)

end += len(
    total_hours
)


# ======================================================
# REMOVE ONLY EMBEDDED CATALOGUE + TOTAL HOURS
# ======================================================

text = (
    text[:start]
    +
    """// Canonical Hours 01-16 are imported from
// mission-catalogue.js.
"""
    +
    text[end:]
)


# ======================================================
# ADD CANONICAL CATALOGUE IMPORT
# ======================================================

if catalogue_import not in text:

    text = text.replace(
        firebase_import,
        firebase_import
        + "\n\n"
        + catalogue_import,
        1
    )


# ======================================================
# POST-INTEGRATION SAFETY CHECKS
# ======================================================

if catalogue_start in text:
    raise SystemExit(
        "STOP: Embedded catalogue still exists."
    )

if total_hours in text:
    raise SystemExit(
        "STOP: Embedded TOTAL_HOURS still exists."
    )

if text.count(
    "from './mission-catalogue.js';"
) != 1:
    raise SystemExit(
        "STOP: Catalogue import validation failed."
    )

if text.count("HOUR_CATALOGUE") < 5:
    raise SystemExit(
        "STOP: Unexpected HOUR_CATALOGUE "
        "reference count."
    )

if text.count("TOTAL_HOURS") < 2:
    raise SystemExit(
        "STOP: Unexpected TOTAL_HOURS "
        "reference count."
    )

if len(text) >= len(original):
    print(
        "INFO: File length did not shrink as expected."
    )


# ======================================================
# WRITE COMPLETE CLEAN FILE
# ======================================================

ADMIN.write_text(
    text,
    encoding="utf-8",
    newline="\n"
)


print()
print("=" * 62)
print(" SARLAYASH MISSION CATALOGUE INTEGRATION")
print("=" * 62)
print()
print("Updated  : src/mission-admin.js")
print("Catalogue: src/mission-catalogue.js")
print("Hours    : 01-16")
print("Engine   : PRESERVED")
print("Firebase : NOT MODIFIED")
print("Firestore: NOT MODIFIED")
print()
print("STATUS   : INTEGRATION COMPLETE")
print("=" * 62)