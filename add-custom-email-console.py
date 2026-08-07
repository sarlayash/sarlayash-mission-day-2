from pathlib import Path
import sys

FILE = Path("src/mission-admin.js")

if not FILE.exists():
    print("ERROR: src/mission-admin.js not found.")
    sys.exit(1)

text = FILE.read_text(encoding="utf-8")

if "SARLAYASH_CUSTOM_EMAIL_CONSOLE_V1" in text:
    print("Custom Email Console already installed.")
    sys.exit(0)


# ======================================================
# 1. REPLACE EXISTING TEST EMAIL PANEL
# ======================================================

start_marker = """
        <small
          style="
            display:block;
            margin-bottom:8px;
            color:#d6b15d;
            font-weight:800;
            letter-spacing:.14em;
          "
        >
          SECURE ADMIN COMMUNICATION
        </small>
"""

start = text.find(start_marker)

if start == -1:
    print("ERROR: Existing communication panel not found.")
    sys.exit(1)


end_marker = """
      </div>



      <h3 class="section-title">
        JOURNEY INTELLIGENCE
"""

end = text.find(end_marker, start)

if end == -1:
    print("ERROR: Communication panel end not found.")
    sys.exit(1)


new_panel = r'''
        <!-- SARLAYASH_CUSTOM_EMAIL_CONSOLE_V1 -->

        <small
          style="
            display:block;
            margin-bottom:8px;
            color:#d6b15d;
            font-weight:800;
            letter-spacing:.14em;
          "
        >
          SECURE ADMIN COMMUNICATION
        </small>

        <strong
          style="
            display:block;
            margin-bottom:5px;
          "
        >
          COMMUNICATION CONSOLE
        </strong>

        <span
          style="
            display:block;
            margin-bottom:18px;
            opacity:.7;
            font-size:12px;
            line-height:1.6;
          "
        >
          Send a protected, personalised communication
          directly to this learner.
        </span>


        <label
          style="
            display:block;
            margin-bottom:6px;
            color:#d6b15d;
            font-size:10px;
            font-weight:800;
            letter-spacing:.1em;
          "
        >
          RECIPIENT
        </label>

        <input
          id="mission-email-recipient"
          type="email"
          value="${esc(learner.authEmail || '')}"
          readonly
          style="
            width:100%;
            box-sizing:border-box;
            margin-bottom:15px;
            padding:12px;
            border:1px solid rgba(214,177,93,.22);
            border-radius:8px;
            background:rgba(255,255,255,.025);
            color:#ffffff;
          "
        >


        <label
          style="
            display:block;
            margin-bottom:6px;
            color:#d6b15d;
            font-size:10px;
            font-weight:800;
            letter-spacing:.1em;
          "
        >
          COMMUNICATION TYPE
        </label>

        <select
          id="mission-email-template"
          style="
            width:100%;
            box-sizing:border-box;
            margin-bottom:15px;
            padding:12px;
            border:1px solid rgba(214,177,93,.22);
            border-radius:8px;
            background:#101010;
            color:#ffffff;
          "
        >
          <option value="CUSTOM">
            Custom Message
          </option>

          <option value="MISSION_UPDATE">
            Mission Update
          </option>

          <option value="ACTION_REQUIRED">
            Action Required
          </option>

          <option value="APPRECIATION">
            Appreciation
          </option>

          <option value="CONGRATULATIONS">
            Congratulations
          </option>
        </select>


        <label
          style="
            display:block;
            margin-bottom:6px;
            color:#d6b15d;
            font-size:10px;
            font-weight:800;
            letter-spacing:.1em;
          "
        >
          SUBJECT
        </label>

        <input
          id="mission-email-subject"
          type="text"
          maxlength="200"
          placeholder="Enter email subject"
          style="
            width:100%;
            box-sizing:border-box;
            margin-bottom:15px;
            padding:12px;
            border:1px solid rgba(214,177,93,.22);
            border-radius:8px;
            background:rgba(255,255,255,.025);
            color:#ffffff;
          "
        >


        <label
          style="
            display:block;
            margin-bottom:6px;
            color:#d6b15d;
            font-size:10px;
            font-weight:800;
            letter-spacing:.1em;
          "
        >
          MESSAGE
        </label>

        <textarea
          id="mission-email-message"
          maxlength="10000"
          rows="12"
          placeholder="Write your personalised message..."
          style="
            width:100%;
            box-sizing:border-box;
            resize:vertical;
            padding:12px;
            border:1px solid rgba(214,177,93,.22);
            border-radius:8px;
            background:rgba(255,255,255,.025);
            color:#ffffff;
            font-family:inherit;
            line-height:1.6;
          "
        ></textarea>


        <div
          style="
            display:flex;
            justify-content:space-between;
            gap:12px;
            margin-top:7px;
            margin-bottom:16px;
            font-size:10px;
            opacity:.65;
          "
        >
          <span>
            Protected via authenticated Admin API
          </span>

          <span id="mission-email-count">
            0 / 10000
          </span>
        </div>


        <button
          class="ghost"
          id="mission-send-custom-email"
          type="button"
        >
          SEND CUSTOM EMAIL
        </button>


        <span
          id="mission-email-status"
          style="
            display:block;
            margin-top:12px;
            font-size:12px;
          "
        ></span>

'''

text = (
    text[:start] +
    new_panel +
    text[end:]
)


# ======================================================
# 2. REPLACE EXISTING TEST EMAIL HANDLER
# ======================================================

handler_start_marker = """
  const testEmailButton =
    document.querySelector(
      '#mission-send-test-email'
    );
"""

handler_start = text.find(handler_start_marker)

if handler_start == -1:
    print("ERROR: Existing test email handler not found.")
    sys.exit(1)


handler_end_marker = """
  document
    .querySelector(
      '#mission-back'
"""

handler_end = text.find(
    handler_end_marker,
    handler_start
)

if handler_end == -1:
    print("ERROR: mission-back handler boundary not found.")
    sys.exit(1)


new_handler = r'''
  // ====================================================
  // SARLAYASH CUSTOM EMAIL CONSOLE V1
  // ====================================================

  const customEmailButton =
    document.querySelector(
      '#mission-send-custom-email'
    );


  const emailStatus =
    document.querySelector(
      '#mission-email-status'
    );


  const emailRecipient =
    document.querySelector(
      '#mission-email-recipient'
    );


  const emailTemplate =
    document.querySelector(
      '#mission-email-template'
    );


  const emailSubject =
    document.querySelector(
      '#mission-email-subject'
    );


  const emailMessage =
    document.querySelector(
      '#mission-email-message'
    );


  const emailCount =
    document.querySelector(
      '#mission-email-count'
    );


  const learnerName =
    String(
      learner.name || 'Learner'
    );


  const journeyId =
    String(
      learner.journeyId || 'N/A'
    );


  const emailTemplates = {

    CUSTOM: {
      subject:
        '',

      message:
`Namaste ${learnerName},

`
    },


    MISSION_UPDATE: {

      subject:
        'SarlaYash Mission 2026 | Journey Update',

      message:
`Namaste ${learnerName},

This is an update regarding your SarlaYash Mission 2026 journey.

Journey ID:
${journeyId}

Please review your Mission journey and continue with the next applicable action.

Regards,
SarlaYash Mission 2026
SarlaYash Learning Solutions LLP`

    },


    ACTION_REQUIRED: {

      subject:
        'SarlaYash Mission 2026 | Action Required',

      message:
`Namaste ${learnerName},

An action is required from your side regarding your SarlaYash Mission 2026 journey.

Journey ID:
${journeyId}

Please review your Mission journey and complete the required action.

Regards,
SarlaYash Mission 2026
SarlaYash Learning Solutions LLP`

    },


    APPRECIATION: {

      subject:
        'SarlaYash Mission 2026 | Appreciation',

      message:
`Namaste ${learnerName},

We would like to appreciate your effort and participation in SarlaYash Mission 2026.

Journey ID:
${journeyId}

Your commitment to learning, execution and professional growth is acknowledged.

Keep building. Keep learning.

Regards,
SarlaYash Mission 2026
SarlaYash Learning Solutions LLP`

    },


    CONGRATULATIONS: {

      subject:
        'SarlaYash Mission 2026 | Congratulations',

      message:
`Namaste ${learnerName},

Congratulations on your progress in SarlaYash Mission 2026.

Journey ID:
${journeyId}

Your achievement reflects your continued effort and commitment to the journey.

We wish you continued success in the next stage.

Regards,
SarlaYash Mission 2026
SarlaYash Learning Solutions LLP`

    }

  };


  function updateEmailCounter() {

    if (
      emailCount &&
      emailMessage
    ) {

      emailCount.textContent =
        `${emailMessage.value.length} / 10000`;

    }

  }


  function loadEmailTemplate() {

    if (
      !emailTemplate ||
      !emailSubject ||
      !emailMessage
    ) {
      return;
    }


    const selected =
      emailTemplates[
        emailTemplate.value
      ] ||
      emailTemplates.CUSTOM;


    emailSubject.value =
      selected.subject;


    emailMessage.value =
      selected.message;


    updateEmailCounter();


    if (emailStatus) {
      emailStatus.textContent = '';
    }

  }


  if (emailTemplate) {

    emailTemplate.onchange =
      loadEmailTemplate;

  }


  if (emailMessage) {

    emailMessage.oninput =
      updateEmailCounter;

  }


  loadEmailTemplate();


  if (customEmailButton) {

    customEmailButton.onclick =
      async () => {

        const recipient =
          String(
            emailRecipient?.value || ''
          ).trim();


        const subject =
          String(
            emailSubject?.value || ''
          ).trim();


        const message =
          String(
            emailMessage?.value || ''
          ).trim();


        if (!recipient) {

          if (emailStatus) {
            emailStatus.textContent =
              'No registered learner email is available.';
          }

          return;

        }


        if (!subject) {

          if (emailStatus) {
            emailStatus.textContent =
              'Please enter an email subject.';
          }

          emailSubject?.focus();

          return;

        }


        if (!message) {

          if (emailStatus) {
            emailStatus.textContent =
              'Please enter an email message.';
          }

          emailMessage?.focus();

          return;

        }


        const confirmed =
          window.confirm(
            `Send this communication to ${recipient}?`
          );


        if (!confirmed) {
          return;
        }


        const originalText =
          customEmailButton.textContent;


        try {

          customEmailButton.disabled =
            true;


          customEmailButton.textContent =
            'SENDING...';


          if (emailStatus) {

            emailStatus.textContent =
              'Authenticating administrator and sending secure communication...';

          }


          if (
            !currentAdmin ||
            typeof currentAdmin.getIdToken !==
              'function'
          ) {

            throw new Error(
              'Administrator authentication is unavailable.'
            );

          }


          const idToken =
            await currentAdmin.getIdToken();


          const response =
            await fetch(
              '/api/send-email',
              {

                method: 'POST',

                headers: {

                  'Content-Type':
                    'application/json',

                  'Authorization':
                    `Bearer ${idToken}`

                },

                body:
                  JSON.stringify({
                    to: recipient,
                    subject,
                    message
                  })

              }
            );


          let result = {};


          try {

            result =
              await response.json();

          } catch {

            result = {};

          }


          if (!response.ok) {

            throw new Error(
              result.message ||
              `Email request failed (${response.status}).`
            );

          }


          if (emailStatus) {

            emailStatus.textContent =
              `EMAIL SENT SUCCESSFULLY TO ${recipient}`;

          }


          customEmailButton.textContent =
            'EMAIL SENT';


          window.setTimeout(
            () => {

              customEmailButton.textContent =
                originalText;

            },
            2500
          );


        } catch (error) {

          console.error(
            'SARLAYASH CUSTOM EMAIL ERROR:',
            error
          );


          if (emailStatus) {

            emailStatus.textContent =
              error?.message ||
              'Email delivery failed.';

          }


          customEmailButton.textContent =
            originalText;


        } finally {

          customEmailButton.disabled =
            false;

        }

      };

  }



'''

text = (
    text[:handler_start] +
    new_handler +
    text[handler_end:]
)


FILE.write_text(
    text,
    encoding="utf-8"
)


print()
print("SARLAYASH CUSTOM EMAIL CONSOLE V1 ADDED")
print("========================================")
print("Registered learner recipient: AUTO-FILLED")
print("Recipient editing: DISABLED")
print("Custom subject: ADDED")
print("Custom message: ADDED")
print("Mission Update template: ADDED")
print("Action Required template: ADDED")
print("Appreciation template: ADDED")
print("Congratulations template: ADDED")
print("Character counter: ADDED")
print("Confirmation before send: PRESERVED")
print("Firebase Admin token protection: PRESERVED")
print("/api/send-email backend: UNTOUCHED")
print("SMTP configuration: UNTOUCHED")
print("Hours 01-16: UNTOUCHED")
print("Approvals / Badges: UNTOUCHED")
print()
print("NEXT: npm run build")