from pathlib import Path

path = Path("src/verify.js")
text = path.read_text(encoding="utf-8-sig")


# ======================================================
# ACCEPT ONBOARDING + MISSION HOUR BADGE IDS
# ======================================================

old = """    if (
      !credentialId.startsWith(
        'SYM-ONB-L1-'
      )
    ) {

      showInvalid(
        'The supplied Credential ID is not recognised.'
      );

      return;

    }"""


new = """    const isOnboardingCredential =
      credentialId.startsWith(
        'SYM-ONB-L1-'
      );


    const missionBadgeMatch =
      credentialId.match(
        /^SYM-H(0[1-9]|1[0-6])-.+/
      );


    const isMissionHourBadge =
      Boolean(
        missionBadgeMatch
      );


    if (
      !isOnboardingCredential &&
      !isMissionHourBadge
    ) {

      showInvalid(
        'The supplied Credential ID is not recognised.'
      );

      return;

    }"""


if old not in text:
    raise RuntimeError(
        "CREDENTIAL PREFIX VALIDATION BLOCK NOT FOUND"
    )

text = text.replace(
    old,
    new,
    1
)


# ======================================================
# CHANGE VERIFIED HEADING DYNAMICALLY
# ======================================================

old_heading = """    <p class="status-label">
      VALID CREDENTIAL
    </p>

    <h2>
      Credential
      <em>Verified.</em>
    </h2>"""


new_heading = """    <p class="status-label">
      ${
        data.credentialCategory ===
        'MISSION_HOUR_BADGE'
          ? 'VERIFIED ACHIEVEMENT BADGE'
          : 'VALID CREDENTIAL'
      }
    </p>

    <h2>
      ${
        data.credentialCategory ===
        'MISSION_HOUR_BADGE'
          ? 'Achievement'
          : 'Credential'
      }
      <em>Verified.</em>
    </h2>"""


if old_heading not in text:
    raise RuntimeError(
        "VERIFIED HEADING BLOCK NOT FOUND"
    )

text = text.replace(
    old_heading,
    new_heading,
    1
)


path.write_text(
    text,
    encoding="utf-8"
)

print(
    "MISSION BADGE VERIFICATION SUPPORT ADDED SUCCESSFULLY"
)