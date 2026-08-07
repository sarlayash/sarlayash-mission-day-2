from pathlib import Path

path = Path("src/mission-admin.js")
text = path.read_text(encoding="utf-8-sig")


# ======================================================
# INSERT BADGE HELPERS BEFORE APPROVE MISSION
# ======================================================

marker = """// ======================================================
// APPROVE MISSION
// ======================================================"""

helpers = """// ======================================================
// PUBLIC MISSION BADGE REGISTRY
// ======================================================

const BADGE_TITLES = {
  1: 'MISSION INITIATE',
  2: 'FOUNDATION BUILDER',
  3: 'SECURITY SENTINEL',
  4: 'DATA CUSTODIAN',
  5: 'RESPECT CHAMPION',
  6: 'INTEGRITY SENTINEL',
  7: 'ETHICS GUARDIAN',
  8: 'RESPONSIBLE AI PROFESSIONAL',
  9: 'IP GUARDIAN',
  10: 'CORPORATE COMMUNICATOR',
  11: 'ACCOUNTABILITY OWNER',
  12: 'PROCESS ENGINEER',
  13: 'QUALITY CHAMPION',
  14: 'PRIORITY OPERATOR',
  15: 'INCIDENT READY',
  16: 'DAY ONE CORPORATE OPERATOR'
};


function missionBadgeId(
  journeyId,
  hour
) {

  return `SYM-H${String(
    Number(hour || 0)
  ).padStart(2, '0')}-${String(
    journeyId || ''
  ).trim().toUpperCase()}`;

}


// ======================================================
// APPROVE MISSION
// ======================================================"""


if marker not in text:
    raise RuntimeError(
        "APPROVE MISSION MARKER NOT FOUND"
    )

if "function missionBadgeId" in text:
    raise RuntimeError(
        "BADGE REGISTRY HELPERS ALREADY EXIST"
    )

text = text.replace(
    marker,
    helpers,
    1
)


# ======================================================
# CREATE PUBLIC CREDENTIAL REFERENCE
# AFTER missionHour IS KNOWN
# ======================================================

old_hour = """        const missionHour =
          Number(
            currentAssignment.hour ||
            0
          );


        const nextCompleted ="""

new_hour = """        const missionHour =
          Number(
            currentAssignment.hour ||
            0
          );


        const publicCredentialId =
          missionBadgeId(
            currentLearner.journeyId,
            missionHour
          );


        const publicCredentialRef =
          doc(
            db,
            'public_credentials',
            publicCredentialId
          );


        const nextCompleted ="""


if old_hour not in text:
    raise RuntimeError(
        "MISSION HOUR BLOCK NOT FOUND"
    )

text = text.replace(
    old_hour,
    new_hour,
    1
)


# ======================================================
# ISSUE BADGE INSIDE SAME TRANSACTION
# ======================================================

old_learner_update = """        transaction.update(
          learnerRef,
          {

            completedHours:
              nextCompleted

          }
        );

      }
    );"""

new_learner_update = """        transaction.update(
          learnerRef,
          {

            completedHours:
              nextCompleted

          }
        );


        transaction.set(
          publicCredentialRef,
          {

            credentialId:
              publicCredentialId,

            credentialType:
              `Hour ${String(
                missionHour
              ).padStart(2, '0')} Achievement Badge`,

            credentialCategory:
              'MISSION_HOUR_BADGE',

            achievementTitle:
              BADGE_TITLES[missionHour] ||
              `MISSION HOUR ${String(
                missionHour
              ).padStart(2, '0')}`,

            hour:
              missionHour,

            learnerName:
              String(
                currentLearner.name ||
                learner.name ||
                ''
              ).trim(),

            jobTitle:
              'Plug-And-Play Learning Engineer - L1',

            journeyId:
              String(
                currentLearner.journeyId ||
                ''
              ).trim().toUpperCase(),

            issuer:
              'SarlaYash Learning Solutions LLP',

            status:
              'VALID',

            issuedAt:
              serverTimestamp(),

            approvedBy:
              currentAdmin?.email ||
              'SUPER ADMIN'

          },
          {
            merge: true
          }
        );

      }
    );"""


if old_learner_update not in text:
    raise RuntimeError(
        "LEARNER TRANSACTION UPDATE BLOCK NOT FOUND"
    )

text = text.replace(
    old_learner_update,
    new_learner_update,
    1
)


path.write_text(
    text,
    encoding="utf-8"
)

print("MISSION BADGE REGISTRY ISSUANCE WIRED SUCCESSFULLY")