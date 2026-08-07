// ======================================================
// SARLAYASH MISSION ACHIEVEMENT BADGES
// Hour 01 - Hour 16
// Copyright © 2026 SarlaYash Learning Solutions LLP
// ======================================================

import QRCode from 'qrcode';


// ======================================================
// HELPERS
// ======================================================

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function hourLabel(hour) {
  return String(Number(hour || 0)).padStart(2, '0');
}


function isApproved(assignment) {
  return (
    assignment?.status === 'APPROVED' ||
    assignment?.reviewStatus === 'APPROVED'
  );
}


function badgeId(student, hour) {

  const journeyId =
    String(student?.journeyId || '')
      .trim()
      .toUpperCase();

  return `SYM-H${hourLabel(hour)}-${journeyId}`;
}


function badgeVerificationUrl(student, hour) {

  const id =
    badgeId(student, hour);

  return (
    `${window.location.origin}/verify.html?id=` +
    encodeURIComponent(id)
  );
}


// ======================================================
// BADGE TITLES
// ======================================================

const BADGE_TITLES = {

  1: 'MISSION INITIATE',
  2: 'FOUNDATION BUILDER',
  3: 'ACTIVE LEARNER',
  4: 'MISSION BUILDER',
  5: 'SKILL EXPLORER',
  6: 'EXECUTION ENGINEER',
  7: 'PROBLEM SOLVER',
  8: 'MISSION PRACTITIONER',
  9: 'ADVANCED EXPLORER',
  10: 'SOLUTION BUILDER',
  11: 'MISSION SPECIALIST',
  12: 'ADVANCED PRACTITIONER',
  13: 'IMPACT BUILDER',
  14: 'MISSION PROFESSIONAL',
  15: 'MISSION ELITE',
  16: 'MISSION COMPLETE'

};


function badgeTitle(hour) {

  return (
    BADGE_TITLES[Number(hour)] ||
    `HOUR ${hourLabel(hour)} ACHIEVEMENT`
  );

}


// ======================================================
// BADGE VAULT MARKUP
// ======================================================

export function achievementBadgeVaultMarkup(
  student,
  assignments = []
) {

  const approvedHours =
    assignments
      .filter(isApproved)
      .map(item => Number(item.hour))
      .filter(
        hour =>
          Number.isInteger(hour) &&
          hour >= 1 &&
          hour <= 16
      );

  const approvedSet =
    new Set(approvedHours);


  const cards =
    Array.from(
      { length: 16 },
      (_, index) => index + 1
    )
      .map(hour => {

        const approved =
          approvedSet.has(hour);

        return `
          <article
            class="achievement-badge-card ${
              approved
                ? 'achievement-badge-approved'
                : 'achievement-badge-locked'
            }"
          >

            <div class="achievement-badge-number">
              HOUR ${hourLabel(hour)}
            </div>

            <div class="achievement-badge-seal">
              ${
                approved
                  ? '✓'
                  : '🔒'
              }
            </div>

            <h4>
              ${esc(badgeTitle(hour))}
            </h4>

            <p>
              ${
                approved
                  ? 'MISSION ACCOMPLISHED'
                  : 'AWAITING APPROVAL'
              }
            </p>

            ${
              approved
                ? `
                  <button
                    type="button"
                    class="achievement-badge-download"
                    data-hour-badge="${hour}"
                  >
                    DOWNLOAD BADGE
                  </button>
                `
                : `
                  <button
                    type="button"
                    class="achievement-badge-download"
                    disabled
                  >
                    LOCKED
                  </button>
                `
            }

          </article>
        `;

      })
      .join('');


  return `
    <section class="achievement-badge-vault">

      <div class="achievement-badge-header">

        <div>
          <small>
            SARLAYASH MISSION 2026
          </small>

          <h3>
            MISSION ACHIEVEMENT BADGES
          </h3>

          <p>
            Every approved Mission Hour unlocks
            a verified digital achievement badge.
          </p>
        </div>

        <strong>
          ${approvedSet.size} / 16 APPROVED
        </strong>

      </div>

      <div class="achievement-badge-grid">
        ${cards}
      </div>

      <p
        class="achievement-badge-message"
        data-badge-message
      ></p>

    </section>
  `;

}


// ======================================================
// DOWNLOAD BINDING
// ======================================================

export function bindAchievementBadgeVault(
  student,
  assignments = []
) {

  const approved =
    assignments.filter(isApproved);


  document
    .querySelectorAll(
      '[data-hour-badge]'
    )
    .forEach(button => {

      button.onclick =
        async () => {

          const hour =
            Number(
              button.dataset.hourBadge
            );


          const assignment =
            approved.find(
              item =>
                Number(item.hour) === hour
            );


          if (!assignment) {
            return;
          }


          const message =
            document.querySelector(
              '[data-badge-message]'
            );


          const originalText =
            button.textContent;


          button.disabled = true;

          button.textContent =
            'GENERATING...';


          if (message) {
            message.textContent =
              `Preparing Hour ${hourLabel(hour)} achievement badge...`;
          }


          try {

            await downloadAchievementBadge(
              student,
              assignment
            );


            if (message) {
              message.textContent =
                `Hour ${hourLabel(hour)} badge downloaded successfully.`;
            }

          } catch (error) {

            console.error(
              'Badge Generation Error:',
              error
            );


            if (message) {
              message.textContent =
                'Badge could not be generated. Please try again.';
            }

          } finally {

            button.disabled = false;

            button.textContent =
              originalText;

          }

        };

    });

}


// ======================================================
// BADGE GENERATOR
// ======================================================

async function downloadAchievementBadge(
  student,
  assignment
) {

  if (!isApproved(assignment)) {

    throw new Error(
      'Mission Hour is not approved.'
    );

  }


  const hour =
    Number(assignment.hour);


  const id =
    badgeId(student, hour);


  const verificationUrl =
    badgeVerificationUrl(
      student,
      hour
    );


  const qrDataUrl =
    await QRCode.toDataURL(
      verificationUrl,
      {
        width: 260,
        margin: 1
      }
    );


  const canvas =
    document.createElement(
      'canvas'
    );


  canvas.width = 1080;
  canvas.height = 1080;


  const ctx =
    canvas.getContext('2d');


  // BLACK CINEMATIC BACKGROUND
  ctx.fillStyle = '#050505';
  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // GOLD BORDER
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 10;

  ctx.strokeRect(
    35,
    35,
    1010,
    1010
  );


  ctx.strokeStyle = '#8B6B18';
  ctx.lineWidth = 2;

  ctx.strokeRect(
    55,
    55,
    970,
    970
  );


  ctx.textAlign = 'center';


  ctx.fillStyle = '#D4AF37';
  ctx.font =
    '600 30px Arial';

  ctx.fillText(
    'SARLAYASH MISSION 2026',
    540,
    125
  );


  ctx.fillStyle = '#FFFFFF';
  ctx.font =
    '700 82px Arial';

  ctx.fillText(
    `HOUR ${hourLabel(hour)}`,
    540,
    245
  );


  ctx.fillStyle = '#D4AF37';
  ctx.font =
    '700 42px Arial';

  ctx.fillText(
    badgeTitle(hour),
    540,
    315
  );


  // BADGE CIRCLE
  ctx.beginPath();

  ctx.arc(
    540,
    455,
    105,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 8;
  ctx.stroke();


  ctx.fillStyle = '#D4AF37';
  ctx.font =
    '700 95px Arial';

  ctx.fillText(
    '✓',
    540,
    490
  );


  ctx.fillStyle = '#FFFFFF';
  ctx.font =
    '700 31px Arial';

  ctx.fillText(
    'MISSION ACCOMPLISHED',
    540,
    610
  );


  ctx.fillStyle = '#AFAFAF';
  ctx.font =
    '24px Arial';

  ctx.fillText(
    'AWARDED TO',
    540,
    665
  );


  ctx.fillStyle = '#FFFFFF';
  ctx.font =
    '700 38px Arial';

  ctx.fillText(
    String(
      student?.name ||
      'SARLAYASH LEARNER'
    ).toUpperCase(),
    540,
    720
  );


  ctx.fillStyle = '#D4AF37';
  ctx.font =
    '24px Arial';

  ctx.fillText(
    'Plug-And-Play Learning Engineer - L1',
    540,
    765
  );


  // QR
  const qrImage =
    new Image();


  await new Promise(
    (resolve, reject) => {

      qrImage.onload =
        resolve;

      qrImage.onerror =
        reject;

      qrImage.src =
        qrDataUrl;

    }
  );


  ctx.drawImage(
    qrImage,
    110,
    820,
    145,
    145
  );


  ctx.textAlign = 'left';

  ctx.fillStyle = '#AFAFAF';
  ctx.font =
    '18px Arial';

  ctx.fillText(
    'JOURNEY ID',
    300,
    855
  );


  ctx.fillStyle = '#FFFFFF';
  ctx.font =
    '700 20px Arial';

  ctx.fillText(
    String(student?.journeyId || ''),
    300,
    885
  );


  ctx.fillStyle = '#AFAFAF';
  ctx.font =
    '18px Arial';

  ctx.fillText(
    'BADGE ID',
    300,
    925
  );


  ctx.fillStyle = '#FFFFFF';
  ctx.font =
    '700 18px Arial';

  ctx.fillText(
    id,
    300,
    955
  );


  ctx.textAlign = 'center';

  ctx.fillStyle = '#D4AF37';
  ctx.font =
    '600 18px Arial';

  ctx.fillText(
    'SARLAYASH LEARNING SOLUTIONS LLP',
    540,
    1000
  );


  // DOWNLOAD PNG
  const link =
    document.createElement('a');


  link.download =
    `SarlaYash-Hour-${hourLabel(hour)}-${String(
      student?.journeyId || 'Learner'
    )}.png`;


  link.href =
    canvas.toDataURL(
      'image/png',
      1
    );


  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

}