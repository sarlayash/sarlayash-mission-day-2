import {
  auth,
  db
} from './firebase.js';

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

import {
  questions
} from './questions.js';


// ======================================================
// STATE
// ======================================================

let root = null;
let rows = [];


// ======================================================
// DOMAIN SIGNAL ENGINE
// ======================================================

const domains = {

  'Artificial Intelligence / ML': [
    'ai',
    'machine learning',
    'llm',
    'prompt'
  ],

  'Software Development': [
    'code',
    'coding',
    'javascript',
    'python',
    'java',
    'software',
    'api'
  ],

  'Data Analytics': [
    'data',
    'excel',
    'power bi',
    'tableau',
    'analytics',
    'sql'
  ],

  'UI/UX': [
    'design',
    'figma',
    'ux',
    'ui'
  ],

  'Cybersecurity': [
    'security',
    'cyber'
  ],

  'Cloud / DevOps': [
    'cloud',
    'devops',
    'aws',
    'azure'
  ],

  'Digital Marketing': [
    'marketing',
    'seo',
    'campaign'
  ],

  'Content / Communication': [
    'writing',
    'content',
    'communication'
  ],

  'Finance': [
    'finance',
    'financial'
  ],

  'Research': [
    'research'
  ],

  'Entrepreneurship': [
    'business',
    'startup'
  ]

};


// ======================================================
// HELPERS
// ======================================================

const esc = value =>
  String(value ?? '')
    .replace(
      /[&<>"']/g,
      character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[character]
    );


function formatDate(value) {

  if (!value) {
    return '—';
  }

  try {

    if (
      typeof value.toDate ===
      'function'
    ) {

      return value
        .toDate()
        .toLocaleString();

    }

    return new Date(
      value
    ).toLocaleString();

  } catch {

    return '—';

  }

}


// ======================================================
// TALENT SIGNAL
// ======================================================

function signal(record) {

  const text =
    Object
      .values(
        record.answers || {}
      )
      .join(' ')
      .toLowerCase();


  const matches =
    Object
      .entries(domains)
      .map(
        ([domain, words]) => [

          domain,

          words.reduce(
            (count, word) =>
              count +
              (
                text.match(
                  new RegExp(
                    word,
                    'g'
                  )
                ) || []
              ).length,

            0
          )

        ]
      )
      .filter(
        result =>
          result[1] > 0
      )
      .sort(
        (a, b) =>
          b[1] - a[1]
      );


  return {

    primary:
      matches[0]?.[0] ||
      'Other / Undetermined',

    secondary:
      matches
        .slice(1, 3)
        .map(
          result =>
            result[0]
        ),

    confidence:
      matches[0]?.[1] >= 3
        ? 'Emerging signal'
        : 'Human review required'

  };

}


// ======================================================
// ONBOARDING STATUS
// ======================================================

function onboardingStatus(record) {

  const status =
    record.adminReview
      ?.day3Status;


  if (
    status ===
    'APPROVED'
  ) {

    return 'APPROVED FOR DAY 3';

  }


  if (
    status ===
    'NOT_APPROVED'
  ) {

    return 'NOT APPROVED';

  }


  return 'AWAITING REVIEW';

}


// ======================================================
// LOAD RESPONSES
// ======================================================

async function loadResponses() {

  const snapshot =
    await getDocs(
      collection(
        db,
        'day2_responses'
      )
    );


  rows =
    snapshot.docs
      .map(snapshot => {

        const data =
          snapshot.data();


        return {

          id:
            snapshot.id,

          ...data,

          sig:
            signal(data)

        };

      })
      .sort(
        (a, b) => {

          const nameA =
            a.candidate?.name || '';

          const nameB =
            b.candidate?.name || '';


          return nameA
            .localeCompare(
              nameB
            );

        }
      );

}


// ======================================================
// MAIN ONBOARDING CONTROL
// ======================================================

export async function showOnboardingControl(
  container
) {

  root = container;


  root.innerHTML =
    `
      <section class="review-page">

        <button
          class="ghost"
          id="super-home"
        >
          ← SUPER ADMIN
        </button>


        <p
          class="eyebrow"
          style="margin-top:30px"
        >
          JOURNEY ENTRY CONTROL
        </p>


        <h2>
          Onboarding
          <em>Control.</em>
        </h2>


        <p class="intro">
          Every Journey begins with the
          10-question assessment.
          Review the learner before granting
          entry into Day 3 Mission.
        </p>


        <div id="onboarding-board">
          Loading assessments…
        </div>

      </section>
    `;


  document
    .querySelector('#super-home')
    .onclick = () => {

      window.dispatchEvent(
        new CustomEvent(
          'sarlayash:super-admin-home'
        )
      );

    };


  try {

    await loadResponses();

    drawDashboard();

  } catch (error) {

    console.error(error);


    document
      .querySelector(
        '#onboarding-board'
      )
      .innerHTML =
        `
          <p class="quiet">
            Unable to load onboarding assessments.
          </p>
        `;

  }

}


// ======================================================
// DASHBOARD
// ======================================================

function drawDashboard() {

  const total =
    rows.length;


  const approved =
    rows.filter(
      record =>
        onboardingStatus(record) ===
        'APPROVED FOR DAY 3'
    ).length;


  const awaiting =
    rows.filter(
      record =>
        onboardingStatus(record) ===
        'AWAITING REVIEW'
    ).length;


  const notApproved =
    rows.filter(
      record =>
        onboardingStatus(record) ===
        'NOT APPROVED'
    ).length;


  const tableRows =
    rows
      .map(
        (record, index) => {

          const status =
            onboardingStatus(
              record
            );


          return `
            <tr
              data-search="${esc(
                [
                  record.journeyId,
                  record.candidate?.name,
                  record.candidate?.email,
                  record.candidate?.course,
                  record.sig.primary,
                  status
                ]
                  .join(' ')
                  .toLowerCase()
              )}"
            >

              <td>
                ${esc(
                  record.journeyId
                )}
              </td>


              <td>

                <b>
                  ${esc(
                    record.candidate
                      ?.name
                  )}
                </b>

                <br>

                <small>
                  ${esc(
                    record.candidate
                      ?.email
                  )}
                </small>

              </td>


              <td>
                ${esc(
                  record.candidate
                    ?.course || '—'
                )}
              </td>


              <td>
                ${esc(
                  record.sig.primary
                )}
              </td>


              <td>
                ${esc(status)}
              </td>


              <td>

                <button
                  class="ghost open-assessment"
                  data-index="${index}"
                >
                  REVIEW →
                </button>

              </td>

            </tr>
          `;

        }
      )
      .join('');


  document
    .querySelector(
      '#onboarding-board'
    )
    .innerHTML =
      `

        <div class="metrics">

          <article>

            <small>
              ASSESSMENTS
            </small>

            <b>
              ${total}
            </b>

          </article>


          <article>

            <small>
              AWAITING REVIEW
            </small>

            <b>
              ${awaiting}
            </b>

          </article>


          <article>

            <small>
              APPROVED FOR DAY 3
            </small>

            <b>
              ${approved}
            </b>

          </article>


          <article>

            <small>
              NOT APPROVED
            </small>

            <b>
              ${notApproved}
            </b>

          </article>

        </div>


        <div class="toolbar">

          <input
            id="onboarding-search"
            placeholder="Search learner, Journey ID, email, course or status…"
          >


          <button
            class="ghost"
            id="onboarding-refresh"
          >
            REFRESH
          </button>


          <button
            class="ghost"
            id="onboarding-csv"
          >
            DOWNLOAD CSV
          </button>

        </div>


        <h3 class="section-title">
          JOURNEY ENTRY PIPELINE
        </h3>


        <div class="signals">

          <div class="signal">

            <span>
              Submitted
            </span>

            <b>
              ${total}
            </b>

          </div>


          <div class="signal">

            <span>
              Awaiting Review
            </span>

            <b>
              ${awaiting}
            </b>

          </div>


          <div class="signal">

            <span>
              Day 3 Approved
            </span>

            <b>
              ${approved}
            </b>

          </div>

        </div>


        <h3 class="section-title">
          LEARNERS
        </h3>


        <div class="table-wrap">

          <table>

            <thead>

              <tr>

                <th>
                  Journey ID
                </th>

                <th>
                  Learner
                </th>

                <th>
                  Course
                </th>

                <th>
                  Primary Signal
                </th>

                <th>
                  Entry Status
                </th>

                <th></th>

              </tr>

            </thead>


            <tbody>

              ${tableRows}

            </tbody>

          </table>

        </div>
      `;


  document
    .querySelectorAll(
      '.open-assessment'
    )
    .forEach(button => {

      button.onclick = () => {

        const record =
          rows[
            Number(
              button.dataset.index
            )
          ];


        showAssessment(
          record
        );

      };

    });


  document
    .querySelector(
      '#onboarding-search'
    )
    .oninput = event => {

      const query =
        event.target.value
          .trim()
          .toLowerCase();


      document
        .querySelectorAll(
          '#onboarding-board tbody tr'
        )
        .forEach(row => {

          row.hidden =
            !row.dataset.search
              .includes(query);

        });

    };


  document
    .querySelector(
      '#onboarding-refresh'
    )
    .onclick =
      async () => {

        await loadResponses();

        drawDashboard();

      };


  document
    .querySelector(
      '#onboarding-csv'
    )
    .onclick =
      exportCsv;

}

// ======================================================
// INDIVIDUAL ASSESSMENT
// ======================================================

function showAssessment(record) {

  const status =
    onboardingStatus(
      record
    );


  const answers =
    questions
      .map(
        (question, index) => {

          const key =
            `q${index + 1}`;


          return `

            <article class="review">

              <span>
                QUESTION ${String(
                  index + 1
                ).padStart(2, '0')}
              </span>


              <h3>
                ${esc(
                  question[0]
                )}
              </h3>


              <p>
                ${esc(
                  record.answers
                    ?.[key] || '—'
                )}
              </p>

            </article>
          `;

        }
      )
      .join('');


  const directions =
    [
      record.sig.primary,
      ...record.sig.secondary,
      'Exploratory real-world project'
    ]
      .filter(
        (
          value,
          index,
          array
        ) =>
          value &&
          array.indexOf(value) ===
            index
      )
      .slice(0, 3)
      .map(
        (direction, index) => `

          <article>

            <small>
              DIRECTION ${String(
                index + 1
              ).padStart(2, '0')}
            </small>


            <h3>
              ${esc(direction)}
            </h3>


            <p>
              Suggested from the learner's
              written interests and goals.
              Human review remains mandatory.
            </p>

          </article>
        `
      )
      .join('');


  root.innerHTML =
    `

      <section class="review-page">

        <button
          class="ghost"
          id="back-onboarding"
        >
          ← BACK TO ONBOARDING CONTROL
        </button>


        <p
          class="eyebrow"
          style="margin-top:30px"
        >
          JOURNEY ENTRY REVIEW
        </p>


        <h2>

          ${esc(
            record.candidate
              ?.name
          )}

          <em>
            · ${esc(
              record.journeyId
            )}
          </em>

        </h2>


        <div class="candidate">

          <strong>
            ${esc(
              record.candidate
                ?.email
            )}
          </strong>


          <span>

            ${esc(
              record.candidate
                ?.course || '—'
            )}

            ${
              record.candidate
                ?.yearStatus
                ? ` · ${esc(
                    record.candidate
                      .yearStatus
                  )}`
                : ''
            }

          </span>

        </div>


        <h3 class="section-title">
          ENTRY STATUS
        </h3>


        <div class="intelligence">

          <article>

            <small>
              CURRENT STATUS
            </small>

            <b>
              ${esc(status)}
            </b>

          </article>


          <article>

            <small>
              PRIMARY SIGNAL
            </small>

            <b>
              ${esc(
                record.sig.primary
              )}
            </b>

          </article>


          <article>

            <small>
              CONFIDENCE
            </small>

            <b>
              ${esc(
                record.sig.confidence
              )}
            </b>

          </article>

        </div>


        <h3 class="section-title">
          TALENT INTELLIGENCE
        </h3>


        <div class="directions">

          ${directions}

        </div>


        <h3 class="section-title">
          SUPER ADMIN REVIEW
        </h3>


        <form
          id="entry-review"
          class="fields"
        >

          <label>

            Primary Domain Assigned

            <input
              name="assignedDomain"
              value="${esc(
                record.adminReview
                  ?.assignedDomain ||
                record.sig.primary
              )}"
            >

          </label>


          <label>

            Secondary Domain

            <input
              name="secondaryDomain"
              value="${esc(
                record.adminReview
                  ?.secondaryDomain ||
                record.sig.secondary
                  .join(' · ')
              )}"
            >

          </label>


          <label>

            Mentor Assigned

            <input
              name="mentor"
              value="${esc(
                record.adminReview
                  ?.mentor
              )}"
            >

          </label>


          <label>

            Priority

            <input
              name="priority"
              value="${esc(
                record.adminReview
                  ?.priority
              )}"
            >

          </label>


          <label
            style="grid-column:1/-1"
          >

            Super Admin Notes

            <textarea
              name="notes"
            >${esc(
              record.adminReview
                ?.notes
            )}</textarea>

          </label>


          <button
            class="ghost"
            type="submit"
          >
            SAVE REVIEW NOTES
          </button>


          ${
            status !==
            'APPROVED FOR DAY 3'
              ? `

                  <button
                    class="gold"
                    type="button"
                    id="approve-day3"
                  >
                    APPROVE FOR DAY 3 →
                  </button>

                `
              : ''
          }


          ${
            status !==
            'NOT APPROVED'
              ? `

                  <button
                    class="ghost"
                    type="button"
                    id="not-approved"
                  >
                    NOT APPROVED
                  </button>

                `
              : ''
          }

        </form>


        ${
          record.adminReview
            ?.reviewedAt
            ? `

                <p class="quiet">

                  Last reviewed:
                  ${formatDate(
                    record.adminReview
                      .reviewedAt
                  )}

                </p>

              `
            : ''
        }


        <h3 class="section-title">
          ORIGINAL 10-QUESTION ASSESSMENT
        </h3>


        ${answers}

      </section>
    `;


  document
    .querySelector(
      '#back-onboarding'
    )
    .onclick =
      async () => {

        await showOnboardingControl(
          root
        );

      };


  document
    .querySelector(
      '#entry-review'
    )
    .onsubmit =
      async event => {

        event.preventDefault();

        await saveReview(
          record,
          event.target,
          null
        );

      };


  const approveButton =
    document.querySelector(
      '#approve-day3'
    );


  if (approveButton) {

    approveButton.onclick =
      async () => {

        const confirmed =
          window.confirm(
            `Approve ${record.candidate?.name} for Day 3 Mission?`
          );


        if (!confirmed) {
          return;
        }


        const form =
          document.querySelector(
            '#entry-review'
          );


        await saveReview(
          record,
          form,
          'APPROVED'
        );

      };

  }


  const rejectButton =
    document.querySelector(
      '#not-approved'
    );


  if (rejectButton) {

    rejectButton.onclick =
      async () => {

        const confirmed =
          window.confirm(
            `Mark ${record.candidate?.name} as NOT APPROVED for Day 3?`
          );


        if (!confirmed) {
          return;
        }


        const form =
          document.querySelector(
            '#entry-review'
          );


        await saveReview(
          record,
          form,
          'NOT_APPROVED'
        );

      };

  }

}

// ======================================================
// SAVE REVIEW
// ======================================================

async function saveReview(
  record,
  form,
  decision
) {

  const values =
    Object.fromEntries(
      new FormData(form)
    );


  const previous =
    record.adminReview || {};


  const adminReview = {

    ...previous,

    assignedDomain:
      values.assignedDomain
        ?.trim() || '',

    secondaryDomain:
      values.secondaryDomain
        ?.trim() || '',

    mentor:
      values.mentor
        ?.trim() || '',

    priority:
      values.priority
        ?.trim() || '',

    notes:
      values.notes
        ?.trim() || '',

    day3Status:
      decision ||
      previous.day3Status ||
      'PENDING',

    reviewedBy:
      auth.currentUser
        ?.email || '',

    reviewedAt:
      serverTimestamp()

  };


  try {

    await updateDoc(
      doc(
        db,
        'day2_responses',
        record.id
      ),
      {
        adminReview
      }
    );


    if (
      decision ===
      'APPROVED'
    ) {

      alert(
        `${record.candidate?.name} is approved for Day 3.`
      );

    } else if (
      decision ===
      'NOT_APPROVED'
    ) {

      alert(
        `${record.candidate?.name} has been marked NOT APPROVED.`
      );

    } else {

      alert(
        'Super Admin review saved.'
      );

    }


    await loadResponses();


    const refreshed =
      rows.find(
        item =>
          item.id === record.id
      );


    if (refreshed) {

      showAssessment(
        refreshed
      );

    } else {

      drawDashboard();

    }

  } catch (error) {

    console.error(error);


    alert(
      `Unable to save review: ${error.message}`
    );

  }

}


// ======================================================
// CSV EXPORT
// ======================================================

function exportCsv() {

  const cell =
    value =>
      `"${String(
        value ?? ''
      )
        .replaceAll(
          '"',
          '""'
        )
        .replace(
          /\r?\n/g,
          ' '
        )
        .trim()}"`;


  // ====================================================
  // CSV HEADERS
  // ====================================================

  const headers = [

    'Journey ID',

    'Name',

    'Email',

    'Course',

    // Each assessment question gets
    // its own individual CSV column.
    ...questions.map(
      (question, index) =>
        `Q${index + 1} - ${question[0]}`
    ),

    'Primary Signal',

    'Secondary Signals',

    'Signal Confidence',

    'Day 3 Status',

    'Assigned Domain',

    'Secondary Domain',

    'Mentor',

    'Priority',

    'Super Admin Notes',

    'Reviewed By',

    'Reviewed At'

  ];


  // ====================================================
  // LEARNER DATA ROWS
  // ====================================================

  const dataRows =
    rows.map(
      record => [

        record.journeyId,

        record.candidate?.name,

        record.candidate?.email,

        record.candidate?.course,

        // Q1 through Q10.
        // Every answer sits beneath its
        // corresponding full question.
        ...questions.map(
          (question, index) =>
            record.answers?.[
              `q${index + 1}`
            ] || ''
        ),

        record.sig.primary,

        record.sig.secondary
          .join(' | '),

        record.sig.confidence,

        onboardingStatus(
          record
        ),

        record.adminReview
          ?.assignedDomain,

        record.adminReview
          ?.secondaryDomain,

        record.adminReview
          ?.mentor,

        record.adminReview
          ?.priority,

        record.adminReview
          ?.notes,

        record.adminReview
          ?.reviewedBy,

        formatDate(
          record.adminReview
            ?.reviewedAt
        )

      ]
    );

  // ====================================================
  // BUILD CSV
  // ====================================================

  const output = [

    headers
      .map(cell)
      .join(','),

    ...dataRows.map(
      row =>
        row
          .map(cell)
          .join(',')
    )

  ];


  // ====================================================
  // CREATE UTF-8 CSV FILE
  // ====================================================

  const blob =
    new Blob(
      [
        '\uFEFF' +
        output.join('\r\n')
      ],
      {
        type:
          'text/csv;charset=utf-8;'
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const anchor =
    document.createElement(
      'a'
    );


  anchor.href =
    url;


  anchor.download =
    `sarlayash-onboarding-control-${
      new Date()
        .toISOString()
        .slice(0, 10)
    }.csv`;


  document.body.appendChild(
    anchor
  );


  anchor.click();


  document.body.removeChild(
    anchor
  );


  URL.revokeObjectURL(
    url
  );

}