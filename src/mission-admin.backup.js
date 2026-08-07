import {
  db
} from './firebase.js';

import {
  collection,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';


// ======================================================
// STATE
// ======================================================

let root = null;
let learners = [];
let assignments = [];
let currentAdmin = null;


// ======================================================
// HELPERS
// ======================================================

const esc = (value) =>
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

    if (typeof value.toDate === 'function') {
      return value
        .toDate()
        .toLocaleString();
    }

    return new Date(value)
      .toLocaleString();

  } catch {

    return '—';

  }

}


function statusLabel(assignment) {

  if (!assignment) {
    return 'NOT RELEASED';
  }

  if (
    assignment.reviewStatus ===
    'APPROVED'
  ) {
    return 'APPROVED';
  }

  if (
    assignment.reviewStatus ===
    'REVISION_REQUIRED'
  ) {
    return 'REVISION REQUIRED';
  }

  if (
    assignment.status === 'SUBMITTED' &&
    assignment.reviewStatus === 'PENDING'
  ) {
    return 'AWAITING REVIEW';
  }

  if (
    assignment.status === 'RELEASED'
  ) {
    return 'RELEASED';
  }

  return (
    assignment.status ||
    'UNKNOWN'
  );

}


function statusClass(status) {

  return String(status)
    .toLowerCase()
    .replaceAll(' ', '-');

}


// ======================================================
// LOAD MISSION DATA
// ======================================================

async function loadMissionData() {

  const [
    learnerSnapshot,
    assignmentSnapshot
  ] = await Promise.all([

    getDocs(
      collection(
        db,
        'mission_users'
      )
    ),

    getDocs(
      collection(
        db,
        'mission_assignments'
      )
    )

  ]);


  learners =
    learnerSnapshot.docs
      .map(snapshot => ({
        id: snapshot.id,
        ...snapshot.data()
      }))
      .sort(
        (a, b) =>
          String(a.name || '')
            .localeCompare(
              String(b.name || '')
            )
      );


  assignments =
    assignmentSnapshot.docs
      .map(snapshot => ({
        id: snapshot.id,
        ...snapshot.data()
      }));

}


// ======================================================
// FIND CURRENT ASSIGNMENT
// ======================================================

function getCurrentAssignment(
  journeyId
) {

  const learnerAssignments =
    assignments
      .filter(
        assignment =>
          assignment.journeyId ===
          journeyId
      )
      .sort(
        (a, b) =>
          Number(b.hour || 0) -
          Number(a.hour || 0)
      );


  return (
    learnerAssignments[0] ||
    null
  );

}


// ======================================================
// MISSION CONTROL ENTRY
// ======================================================

export async function showMissionControl(
  container,
  adminUser
) {

  root = container;
  currentAdmin = adminUser;


  root.innerHTML =
    `
      <section class="review-page">

        <button
          class="ghost"
          id="mission-super-home"
        >
          ← SUPER ADMIN
        </button>


        <p
          class="eyebrow"
          style="margin-top:30px"
        >
          ADMINISTRATOR CONTROL PLANE
        </p>


        <h2>
          Mission <em>Control.</em>
        </h2>


        <p class="intro">
          Day 3 · Hours 01–16.
          Evidence-led progression.
          Every Mission remains individually
          reviewable, auditable and gated.
        </p>


        <div id="mission-board">
          Loading Mission intelligence…
        </div>

      </section>
    `;


  document
    .querySelector(
      '#mission-super-home'
    )
    .onclick = goSuperAdmin;


  try {

    await loadMissionData();

    drawDashboard();

  } catch (error) {

    console.error(error);


    const board =
      document.querySelector(
        '#mission-board'
      );


    if (board) {

      board.innerHTML =
        `
          <p class="quiet">
            Unable to load Mission data.
            Check Firestore permissions
            and try again.
          </p>
        `;

    }

  }

}


// ======================================================
// SUPER ADMIN NAVIGATION
// ======================================================

function goSuperAdmin() {

  window.dispatchEvent(
    new CustomEvent(
      'sarlayash:super-admin-home'
    )
  );

}


// ======================================================
// DRAW DASHBOARD
// ======================================================

function drawDashboard() {

  const missionRows =
    learners.map(learner => {

      const assignment =
        getCurrentAssignment(
          learner.journeyId
        );


      return {

        learner,

        assignment,

        status:
          statusLabel(
            assignment
          )

      };

    });


  const awaitingReview =
    missionRows.filter(
      row =>
        row.status ===
        'AWAITING REVIEW'
    ).length;


  const approved =
    missionRows.filter(
      row =>
        row.status ===
        'APPROVED'
    ).length;


  const revisionRequired =
    missionRows.filter(
      row =>
        row.status ===
        'REVISION REQUIRED'
    ).length;


  const released =
    missionRows.filter(
      row =>
        row.status ===
        'RELEASED'
    ).length;


  const notReleased =
    missionRows.filter(
      row =>
        row.status ===
        'NOT RELEASED'
    ).length;


  const tableRows =
    missionRows
      .map(
        (row, index) => {

          const learner =
            row.learner;


          const assignment =
            row.assignment;


          return `
            <tr
              data-search="${esc(
                [
                  learner.name,
                  learner.authEmail,
                  learner.journeyId,
                  learner.course,
                  row.status
                ]
                  .join(' ')
                  .toLowerCase()
              )}"
            >

              <td>

                <b>
                  ${esc(
                    learner.name
                  )}
                </b>

                <br>

                <small>
                  ${esc(
                    learner.authEmail
                  )}
                </small>

              </td>


              <td>
                ${esc(
                  learner.journeyId
                )}
              </td>


              <td>
                ${esc(
                  learner.course ||
                  '—'
                )}
              </td>


              <td>

                ${
                  assignment
                    ? String(
                        assignment.hour
                      ).padStart(
                        2,
                        '0'
                      )
                    : '—'
                }

              </td>


              <td>

                ${esc(
                  learner.completedHours ??
                  0
                )}

                /

                ${esc(
                  learner.totalHours ??
                  16
                )}

              </td>


              <td>

                <span
                  class="mission-status ${statusClass(
                    row.status
                  )}"
                >
                  ${esc(
                    row.status
                  )}
                </span>

              </td>


              <td>

                <button
                  class="ghost mission-open"
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


  const board =
    document.querySelector(
      '#mission-board'
    );


  if (!board) {
    return;
  }


  board.innerHTML =
    `

      <div class="metrics">

        <article>

          <small>
            MISSION LEARNERS
          </small>

          <b>
            ${learners.length}
          </b>

        </article>


        <article>

          <small>
            AWAITING REVIEW
          </small>

          <b>
            ${awaitingReview}
          </b>

        </article>


        <article>

          <small>
            APPROVED
          </small>

          <b>
            ${approved}
          </b>

        </article>


        <article>

          <small>
            REVISION REQUIRED
          </small>

          <b>
            ${revisionRequired}
          </b>

        </article>

      </div>


      <div class="toolbar">

        <input
          id="mission-search"
          placeholder="Search learner, email, Journey ID, course or status…"
        >


        <button
          class="ghost"
          id="mission-refresh"
        >
          REFRESH
        </button>


        <button
          class="ghost"
          id="mission-csv"
        >
          DOWNLOAD CSV
        </button>

      </div>


      <h3 class="section-title">
        DAY 3 · MISSION PIPELINE
      </h3>


      <div class="signals">

        <div class="signal">

          <span>
            Released
          </span>

          <b>
            ${released}
          </b>

        </div>


        <div class="signal">

          <span>
            Awaiting Review
          </span>

          <b>
            ${awaitingReview}
          </b>

        </div>


        <div class="signal">

          <span>
            Approved
          </span>

          <b>
            ${approved}
          </b>

        </div>


        <div class="signal">

          <span>
            Revision Required
          </span>

          <b>
            ${revisionRequired}
          </b>

        </div>


        <div class="signal">

          <span>
            Not Released
          </span>

          <b>
            ${notReleased}
          </b>

        </div>

      </div>


      <h3 class="section-title">
        DAY 3 LEARNERS
      </h3>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>
                Learner
              </th>

              <th>
                Journey ID
              </th>

              <th>
                Course
              </th>

              <th>
                Hour
              </th>

              <th>
                Progress
              </th>

              <th>
                Status
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
      '.mission-open'
    )
    .forEach(button => {

      button.onclick = () => {

        const row =
          missionRows[
            Number(
              button.dataset.index
            )
          ];


        reviewMission(
          row.learner,
          row.assignment
        );

      };

    });


  document
    .querySelector(
      '#mission-search'
    )
    .oninput = event => {

      const query =
        event.target.value
          .trim()
          .toLowerCase();


      document
        .querySelectorAll(
          '#mission-board tbody tr'
        )
        .forEach(row => {

          row.hidden =
            !row.dataset.search
              .includes(query);

        });

    };


  document
    .querySelector(
      '#mission-refresh'
    )
    .onclick =
      async () => {

        await showMissionControl(
          root,
          currentAdmin
        );

      };


  document
    .querySelector(
      '#mission-csv'
    )
    .onclick =
      exportCsv;

}


// ======================================================
// REVIEW SCREEN
// ======================================================

function reviewMission(
  learner,
  assignment
) {

  const status =
    statusLabel(
      assignment
    );


  const canReview =
    assignment &&
    assignment.status ===
      'SUBMITTED' &&
    assignment.submitted ===
      true &&
    assignment.reviewStatus ===
      'PENDING';


  const evidence =
    assignment?.evidenceUrl

      ? `
          <a
            class="gold"
            href="${esc(
              assignment.evidenceUrl
            )}"
            target="_blank"
            rel="noopener noreferrer"
          >
            OPEN LINKEDIN EVIDENCE ↗
          </a>
        `

      : `
          <p class="quiet">
            No evidence submitted yet.
          </p>
        `;


  root.innerHTML =
    `
      <section class="review-page">

        <button
          class="ghost"
          id="mission-back"
        >
          ← BACK TO MISSION CONTROL
        </button>


        <p
          class="eyebrow"
          style="margin-top:30px"
        >
          INDIVIDUAL MISSION REVIEW
        </p>


        <h2>

          ${esc(
            learner.name
          )}

          <em>
            · ${esc(
              learner.journeyId
            )}
          </em>

        </h2>


        <div class="candidate">

          <strong>
            ${esc(
              learner.authEmail
            )}
          </strong>


          <span>
            ${esc(
              learner.course ||
              '—'
            )}
          </span>

        </div>


        <h3 class="section-title">
          MISSION INTELLIGENCE
        </h3>


        <div class="intelligence">

          <article>

            <small>
              CURRENT HOUR
            </small>

            <b>

              ${
                assignment
                  ? String(
                      assignment.hour
                    ).padStart(
                      2,
                      '0'
                    )
                  : '—'
              }

            </b>

          </article>


          <article>

            <small>
              MISSION STATUS
            </small>

            <b>
              ${esc(status)}
            </b>

          </article>


          <article>

            <small>
              COMPLETED HOURS
            </small>

            <b>

              ${esc(
                learner.completedHours ??
                0
              )}

              /

              ${esc(
                learner.totalHours ??
                16
              )}

            </b>

          </article>

        </div>


        <h3 class="section-title">
          ASSIGNMENT
        </h3>


        ${
          assignment

            ? `
                <article class="review">

                  <span>

                    HOUR ${String(
                      assignment.hour
                    ).padStart(
                      2,
                      '0'
                    )}

                  </span>


                  <h3>
                    ${esc(
                      assignment.theme
                    )}
                  </h3>


                  <p>
                    ${esc(
                      assignment.deliverable
                    )}
                  </p>


                  <p>

                    <strong>
                      Transformation:
                    </strong>

                    ${esc(
                      assignment.outcome
                    )}

                  </p>

                </article>
              `

            : `
                <p class="quiet">
                  No Mission assignment
                  exists for this learner.
                </p>
              `
        }


        <h3 class="section-title">
          EVIDENCE
        </h3>


        <article class="review">

          <span>
            LINKEDIN EVIDENCE
          </span>


          ${evidence}


          <p>

            <strong>
              Submitted:
            </strong>

            ${formatDate(
              assignment?.submittedAt
            )}

          </p>


          <p>

            <strong>
              Review Status:
            </strong>

            ${esc(
              assignment?.reviewStatus ||
              '—'
            )}

          </p>


          ${
            assignment?.reviewedAt

              ? `
                  <p>

                    <strong>
                      Last Reviewed:
                    </strong>

                    ${formatDate(
                      assignment.reviewedAt
                    )}

                  </p>
                `

              : ''
          }


          ${
            assignment?.reviewedBy

              ? `
                  <p>

                    <strong>
                      Reviewed By:
                    </strong>

                    ${esc(
                      assignment.reviewedBy
                    )}

                  </p>
                `

              : ''
          }


          ${
            assignment?.reviewNotes

              ? `
                  <p>

                    <strong>
                      Review Notes:
                    </strong>

                    ${esc(
                      assignment.reviewNotes
                    )}

                  </p>
                `

              : ''
          }

        </article>


        ${
          canReview

            ? `
                <h3 class="section-title">
                  SUPER ADMIN DECISION
                </h3>


                <div class="fields">

                  <label
                    style="grid-column:1/-1"
                  >

                    Review Notes

                    <textarea
                      id="mission-review-notes"
                      placeholder="Optional internal review note…"
                    ></textarea>

                  </label>


                  <button
                    class="gold"
                    id="mission-approve"
                  >

                    APPROVE HOUR ${String(
                      assignment.hour
                    ).padStart(
                      2,
                      '0'
                    )}

                  </button>


                  <button
                    class="ghost"
                    id="mission-revision"
                  >
                    RETURN FOR REVISION
                  </button>

                </div>
              `

            : `
                <p class="quiet">

                  ${
                    status ===
                    'APPROVED'

                      ? 'This Mission has already been approved.'

                      : status ===
                        'REVISION REQUIRED'

                        ? 'This Mission has been returned to the learner for revision.'

                        : 'Review controls become available after evidence is submitted.'
                  }

                </p>
              `
        }

      </section>
    `;


  document
    .querySelector(
      '#mission-back'
    )
    .onclick =
      async () => {

        await showMissionControl(
          root,
          currentAdmin
        );

      };


  if (canReview) {

    document
      .querySelector(
        '#mission-approve'
      )
      .onclick =
        () =>
          approveMission(
            learner,
            assignment
          );


    document
      .querySelector(
        '#mission-revision'
      )
      .onclick =
        () =>
          returnForRevision(
            learner,
            assignment
          );

  }

}


// ======================================================
// APPROVE MISSION
// ======================================================

async function approveMission(
  learner,
  assignment
) {

  const confirmed =
    window.confirm(
      `Approve Hour ${assignment.hour} for ${learner.name}?`
    );


  if (!confirmed) {
    return;
  }


  const notes =
    document
      .querySelector(
        '#mission-review-notes'
      )
      ?.value
      .trim() || '';


  const assignmentRef =
    doc(
      db,
      'mission_assignments',
      assignment.id
    );


  const learnerRef =
    doc(
      db,
      'mission_users',
      learner.id
    );


  try {

    await runTransaction(
      db,
      async transaction => {

        const [
          assignmentSnapshot,
          learnerSnapshot
        ] = await Promise.all([

          transaction.get(
            assignmentRef
          ),

          transaction.get(
            learnerRef
          )

        ]);


        if (
          !assignmentSnapshot.exists() ||
          !learnerSnapshot.exists()
        ) {

          throw new Error(
            'Mission records no longer exist.'
          );

        }


        const currentAssignment =
          assignmentSnapshot.data();


        const currentLearner =
          learnerSnapshot.data();


        if (
          currentAssignment.status !==
            'SUBMITTED' ||
          currentAssignment.submitted !==
            true ||
          currentAssignment.reviewStatus !==
            'PENDING'
        ) {

          throw new Error(
            'This Mission is no longer awaiting review.'
          );

        }


        const currentCompleted =
          Number(
            currentLearner.completedHours ||
            0
          );


        const missionHour =
          Number(
            currentAssignment.hour ||
            0
          );


        const nextCompleted =
          Math.max(
            currentCompleted,
            missionHour
          );


        transaction.update(
          assignmentRef,
          {

            status:
              'APPROVED',

            reviewStatus:
              'APPROVED',

            reviewedAt:
              serverTimestamp(),

            reviewedBy:
              currentAdmin?.email ||
              'SUPER ADMIN',

            reviewNotes:
              notes,

            submitted:
              true

          }
        );


        transaction.update(
          learnerRef,
          {

            completedHours:
              nextCompleted

          }
        );

      }
    );


    alert(
      `Hour ${assignment.hour} approved for ${learner.name}.`
    );


    await showMissionControl(
      root,
      currentAdmin
    );

  } catch (error) {

    console.error(error);


    alert(
      `Approval failed: ${error.message}`
    );

  }

}


// ======================================================
// RETURN FOR REVISION
// ======================================================

async function returnForRevision(
  learner,
  assignment
) {

  const confirmed =
    window.confirm(
      `Return Hour ${assignment.hour} to ${learner.name} for revision?`
    );


  if (!confirmed) {
    return;
  }


  const notes =
    document
      .querySelector(
        '#mission-review-notes'
      )
      ?.value
      .trim() || '';


  const assignmentRef =
    doc(
      db,
      'mission_assignments',
      assignment.id
    );


  try {

    await runTransaction(
      db,
      async transaction => {

        const snapshot =
          await transaction.get(
            assignmentRef
          );


        if (!snapshot.exists()) {

          throw new Error(
            'Mission assignment no longer exists.'
          );

        }


        const current =
          snapshot.data();


        if (
          current.status !==
            'SUBMITTED' ||
          current.submitted !==
            true ||
          current.reviewStatus !==
            'PENDING'
        ) {

          throw new Error(
            'This Mission is no longer awaiting review.'
          );

        }


        transaction.update(
          assignmentRef,
          {

            status:
              'RELEASED',

            reviewStatus:
              'REVISION_REQUIRED',

            reviewedAt:
              serverTimestamp(),

            reviewedBy:
              currentAdmin?.email ||
              'SUPER ADMIN',

            reviewNotes:
              notes,

            submitted:
              false

          }
        );

      }
    );


    alert(
      `Hour ${assignment.hour} returned to ${learner.name} for revision.`
    );


    await showMissionControl(
      root,
      currentAdmin
    );

  } catch (error) {

    console.error(error);


    alert(
      `Revision action failed: ${error.message}`
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


  const headers = [

    'Journey ID',

    'Learner',

    'Email',

    'Course',

    'Current Hour',

    'Completed Hours',

    'Total Hours',

    'Mission Status',

    'Review Status',

    'Evidence URL',

    'Submitted At',

    'Reviewed At',

    'Reviewed By',

    'Review Notes'

  ];


  const dataRows =
    learners.map(
      learner => {

        const assignment =
          getCurrentAssignment(
            learner.journeyId
          );


        return [

          learner.journeyId,

          learner.name,

          learner.authEmail,

          learner.course,

          assignment?.hour || '',

          learner.completedHours ?? 0,

          learner.totalHours ?? 16,

          assignment?.status || '',

          assignment?.reviewStatus || '',

          assignment?.evidenceUrl || '',

          formatDate(
            assignment?.submittedAt
          ),

          formatDate(
            assignment?.reviewedAt
          ),

          assignment?.reviewedBy ||
          '',

          assignment?.reviewNotes ||
          ''

        ];

      }
    );


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
    `sarlayash-mission-control-${
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