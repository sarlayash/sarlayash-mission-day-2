from pathlib import Path
import re

path = Path("src/mission.js")
text = path.read_text(encoding="utf-8-sig")


def replace_once(text, pattern, replacement, name):
    new_text, count = re.subn(
        pattern,
        replacement,
        text,
        count=1
    )

    if count != 1:
        raise RuntimeError(
            f"{name}: expected 1 replacement, found {count}"
        )

    print(f"{name}: OK")
    return new_text


# ======================================================
# 1. AFTER EVIDENCE SUBMISSION
# ======================================================

text = replace_once(
    text,
    r"""showSubmitted\(
\s*student,
\s*assignment
\s*\);""",
    """showSubmitted(
          student,
          assignment,
          allAssignments
        );""",
    "POST-SUBMISSION"
)


# ======================================================
# 2. PENDING ADMIN REVIEW
# ======================================================

text = replace_once(
    text,
    r"""showSubmitted\(
\s*student,
\s*submittedMission
\s*\);""",
    """showSubmitted(
        student,
        submittedMission,
        allAssignments
      );""",
    "PENDING-REVIEW"
)


# ======================================================
# 3. WAITING AFTER APPROVED HOURS
#
# Find availableAssignments first.
# Only modify showWaiting AFTER that point.
# This protects the earlier zero-assignment Waiting call.
# ======================================================

marker = "const availableAssignments"

marker_position = text.find(marker)

if marker_position == -1:
    raise RuntimeError(
        "WAITING-AFTER-APPROVAL: availableAssignments marker not found"
    )


before = text[:marker_position]
after = text[marker_position:]


after = replace_once(
    after,
    r"""showWaiting\(
\s*student
\s*\);""",
    """showWaiting(
        student,
        allAssignments
      );""",
    "WAITING-AFTER-APPROVAL"
)

text = before + after


# ======================================================
# 4. CURRENT ACTIVE MISSION
# ======================================================

text = replace_once(
    text,
    r"""showActiveMission\(
\s*student,
\s*currentMission
\s*\);""",
    """showActiveMission(
      student,
      currentMission,
      allAssignments
    );""",
    "ACTIVE-MISSION"
)


# ======================================================
# WRITE ONLY AFTER ALL 4 PATCHES SUCCEED
# ======================================================

path.write_text(
    text,
    encoding="utf-8"
)

print("")
print("4 BADGE DATA ROUTES WIRED SUCCESSFULLY")