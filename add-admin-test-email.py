from pathlib import Path

path = Path("src/mission-admin.js")

text = path.read_text(encoding="utf-8")

marker = """
      <h3 class="section-title">
        JOURNEY INTELLIGENCE
      </h3>
"""

if marker not in text:
    raise SystemExit(
        "STOP: JOURNEY INTELLIGENCE marker not found."
    )

if 'id="mission-send-test-email"' in text:
    raise SystemExit(
        "STOP: Test email feature already appears to exist."
    )

email_panel = """
      <div
        style="
          margin:20px 0 30px;
          padding:20px;
          border:1px solid rgba(214,177,93,.25);
          border-radius:12px;
          background:rgba(214,177,93,.035);
        "
      >

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
          ${esc(
            learner.authEmail
          )}
        </strong>

        <span
          style="
            display:block;
            margin-bottom:16px;
            opacity:.7;
            font-size:12px;
          "
        >
          Send a protected test communication from
          SarlaYash Mission Control.
        </span>

        <button
          class="ghost"
          id="mission-send-test-email"
          type="button"
        >
          SEND TEST EMAIL
        </button>

        <span
          id="mission-email-status"
          style="
            display:block;
            margin-top:12px;
            font-size:12px;
          "
        ></span>

      </div>


"""

text = text.replace(
    marker,
    email_panel + marker,
    1
)

listener_marker = """
  document
    .querySelector(
      '#mission-back'
    )
"""

if listener_marker not in text:
    raise SystemExit(
        "STOP: mission-back listener marker not found."
    )

listener = r"""
  const testEmailButton =
    document.querySelector(
      '#mission-send-test-email'
    );


  const emailStatus =
    document.querySelector(
      '#mission-email-status'
    );


  if (testEmailButton) {

    testEmailButton.onclick =
      async () => {

        const recipient =
          String(
            learner.authEmail || ''
          ).trim();


        if (!recipient) {

          if (emailStatus) {
            emailStatus.textContent =
              'No registered learner email is available.';
          }

          return;
        }


        const confirmed =
          window.confirm(
            `Send a SarlaYash test email to ${recipient}?`
          );


        if (!confirmed) {
          return;
        }


        const originalText =
          testEmailButton.textContent;


        try {

          testEmailButton.disabled = true;

          testEmailButton.textContent =
            'SENDING...';


          if (emailStatus) {
            emailStatus.textContent =
              'Authenticating administrator and sending...';
          }


          if (
            !currentAdmin ||
            typeof currentAdmin.getIdToken !== 'function'
          ) {

            throw new Error(
              'Administrator authentication is unavailable.'
            );

          }


          const idToken =
            await currentAdmin.getIdToken();


          const subject =
            'SarlaYash Mission 2026 | Email Communication Test';


          const message =
`Namaste ${learner.name || 'Learner'},

This is a test communication from the SarlaYash Mission 2026 Administrator Command Centre.

Your registered Journey ID is:
${learner.journeyId || 'N/A'}

If you have received this email successfully, your SarlaYash Mission communication channel is active.

Regards,
SarlaYash Mission 2026
SarlaYash Learning Solutions LLP`;


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
            result = await response.json();
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


          testEmailButton.textContent =
            'EMAIL SENT';

        } catch (error) {

          console.error(
            'SARLAYASH TEST EMAIL ERROR:',
            error
          );


          if (emailStatus) {

            emailStatus.textContent =
              error?.message ||
              'Email delivery failed.';

          }


          testEmailButton.textContent =
            originalText;

        } finally {

          testEmailButton.disabled =
            false;

        }

      };

  }


"""

text = text.replace(
    listener_marker,
    listener + listener_marker,
    1
)

path.write_text(
    text,
    encoding="utf-8"
)

print()
print("SARLAYASH ADMIN TEST EMAIL FEATURE ADDED")
print("LEARNER EMAIL PANEL: OK")
print("FIREBASE ID TOKEN: OK")
print("PROTECTED API CALL: OK")
print("NO HOUR LOGIC MODIFIED")
print()