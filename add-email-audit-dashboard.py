from pathlib import Path
import sys

API = Path("api/send-email.js")
ADMIN = Path("src/admin.js")

if not API.exists() or not ADMIN.exists():
    print("ERROR: Required files not found.")
    sys.exit(1)

api = API.read_text(encoding="utf-8")
admin = ADMIN.read_text(encoding="utf-8")


# ======================================================
# SAFETY
# ======================================================

if "SARLAYASH_EMAIL_AUDIT_V1" in api:
    print("ERROR: Email Audit V1 already exists.")
    sys.exit(1)

if "SARLAYASH_EMAIL_COUNT_V1" in admin:
    print("ERROR: Email Count V1 already exists.")
    sys.exit(1)


# ======================================================
# 1. SERVER: WRITE AUDIT AFTER SUCCESSFUL SMTP SEND
# ======================================================

api_marker = """
    console.log(
      'SARLAYASH EMAIL SENT:',
"""

audit_code = """
    // ==================================================
    // SARLAYASH_EMAIL_AUDIT_V1
    // Persistent communication intelligence.
    //
    // IMPORTANT:
    // SMTP delivery has already succeeded at this point.
    // Audit failure must therefore NOT report the email
    // itself as failed.
    // ==================================================

    try {

      await getFirestore(app)
        .collection('email_audit')
        .add({

          recipient:
            to.trim(),

          subject:
            subject.trim(),

          adminUid:
            decodedToken.uid,

          adminEmail:
            decodedToken.email || '',

          messageId:
            info.messageId || '',

          status:
            'SENT',

          sentAt:
            new Date(),

          source:
            'MISSION_ADMIN'

        });

    } catch (auditError) {

      console.error(
        'SARLAYASH EMAIL AUDIT ERROR:',
        auditError
      );

    }


"""

if api_marker not in api:
    print("ERROR: API success log marker not found.")
    sys.exit(1)

api = api.replace(
    api_marker,
    audit_code + api_marker,
    1
)


# ======================================================
# 2. ADMIN: ADD EMAIL AUDIT TO PROMISE.ALL
# ======================================================

old_destructure = """  const [
    assessmentSnapshot,
    missionUserSnapshot,
    assignmentSnapshot
  ] = await Promise.all([
"""

new_destructure = """  // SARLAYASH_EMAIL_COUNT_V1

  const [
    assessmentSnapshot,
    missionUserSnapshot,
    assignmentSnapshot,
    emailAuditSnapshot
  ] = await Promise.all([
"""

if old_destructure not in admin:
    print("ERROR: Overview Promise.all destructure not found.")
    sys.exit(1)

admin = admin.replace(
    old_destructure,
    new_destructure,
    1
)


old_last_query = """    getDocs(
      collection(
        db,
        'mission_assignments'
      )
    )

  ]);
"""

new_last_query = """    getDocs(
      collection(
        db,
        'mission_assignments'
      )
    ),

    getDocs(
      collection(
        db,
        'email_audit'
      )
    )

  ]);
"""

if old_last_query not in admin:
    print("ERROR: mission_assignments query block not found.")
    sys.exit(1)

admin = admin.replace(
    old_last_query,
    new_last_query,
    1
)


# ======================================================
# 3. RETURN REAL EMAIL COUNT
# ======================================================

old_return_end = """    missionReviewsPending,

    approvedMissionHours

  };
"""

new_return_end = """    missionReviewsPending,

    approvedMissionHours,

    emailsSent:
      emailAuditSnapshot.size

  };
"""

if old_return_end not in admin:
    print("ERROR: Overview return block not found.")
    sys.exit(1)

admin = admin.replace(
    old_return_end,
    new_return_end,
    1
)


# ======================================================
# 4. ADD EMAILS SENT TO TOP METRICS
# ======================================================

# Insert immediately before the section title that follows
# the existing top metrics area.

metrics_end = """      <h3 class="section-title">
"""

email_metric = """
        <article>

          <small>
            EMAILS SENT
          </small>

          <strong>
            ${overview.emailsSent}
          </strong>

        </article>

      </div>


      <h3 class="section-title">
"""

# We need replace the closing metrics div + heading, not merely heading.

metrics_boundary = """      </div>


      <h3 class="section-title">
"""

if metrics_boundary not in admin:
    print("ERROR: Top metrics boundary not found.")
    sys.exit(1)

admin = admin.replace(
    metrics_boundary,
    email_metric,
    1
)


# ======================================================
# SAVE
# ======================================================

API.write_text(api, encoding="utf-8")
ADMIN.write_text(admin, encoding="utf-8")


print()
print("SARLAYASH EMAIL INTELLIGENCE V1 ADDED")
print("======================================")
print("Firestore email_audit collection: ADDED")
print("Audit written after SMTP success: YES")
print("Failed email counted: NO")
print("Audit failure breaks successful delivery: NO")
print("Recipient recorded: YES")
print("Subject recorded: YES")
print("Admin UID recorded: YES")
print("Admin email recorded: YES")
print("SMTP Message ID recorded: YES")
print("Timestamp recorded: YES")
print("Main Admin EMAILS SENT metric: ADDED")
print("Historical count fabricated: NO")
print("Email message body stored: NO")
print("Existing SMTP delivery: PRESERVED")
print("Firebase authentication: PRESERVED")
print("Mission Hours 01-16: UNTOUCHED")
print("Approvals / Badges: UNTOUCHED")
print()
print("NEXT: npm run build")