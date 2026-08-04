import { db } from './firebase.js';

import {
  collection,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';


// ======================================================
// SARLAYASH MISSION COMMAND CENTRE
// Day 3 · Hours 01–16
// Clean replacement for src/mission-admin.js
// ======================================================


// ======================================================
// STATE
// ======================================================

let root = null;
let learners = [];
let assignments = [];
let currentAdmin = null;


// ======================================================
// HOUR CATALOGUE
//
// Hour 01 is preserved from the existing live system.
// Hour 02 is the next mission requested for the programme.
// Hours 03–16 intentionally remain configurable. The
// Command Centre can visualize them without inventing
// curriculum content.
// ======================================================

const HOUR_CATALOGUE = {

  1: {
    theme:
      'Code of Business Conduct — The Code You Would Be Willing to Live By',

    deliverable:
      'Build your own 5-point professional Code of Business Conduct. For each principle, include one real-world workplace situation showing what that principle means in action. Do not copy or rewrite an existing company’s COBC. Build something you would personally be willing to follow and be held accountable for.',

    outcome:
      'Policy Reader → Policy Thinker'
  },

  2: {
    theme:
      'Code of Operations & Conduct',

    deliverable:
      'Build a practical Code of Operations & Conduct for how you will work inside a professional team. Define clear operating principles for ownership, communication, information handling, responsible AI use and professional behaviour. For each principle, explain one workplace situation showing what the principle means in action.',

    outcome:
      'Task Participant → Responsible Operator'
  }

};


const TOTAL_HOURS = 16;


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
      return value.toDate().toLocaleString();
    }

    return new Date(value).toLocaleString();

  } catch {
    return '—';
  }

}


function hourLabel(hour) {

  return String(
    Number(hour || 0)
  ).padStart(2, '0');

}


function statusLabel(assignment) {

  if (!assignment) {
    return 'NOT RELEASED';
  }

  if (
    assignment.reviewStatus === 'APPROVED' ||
    assignment.status === 'APPROVED'
  ) {
    return 'APPROVED';
  }

  if (
    assignment.reviewStatus === 'REVISION_REQUIRED'
  ) {
    return 'REVISION REQUIRED';
  }

  if (
    assignment.status === 'SUBMITTED' &&
    assignment.submitted === true &&
    assignment.reviewStatus === 'PENDING'
  ) {
    return 'AWAITING REVIEW';
  }

  if (
    assignment.status === 'RELEASED'
  ) {
    return 'RELEASED';
  }

  return assignment.status || 'UNKNOWN';

}


function statusClass(status) {

  return String(status || '')
    .toLowerCase()
    .replaceAll(' ', '-');

}


function assignmentForHour(
  journeyId,
  hour
) {

  return assignments.find(
    assignment =>
      assignment.journeyId === journeyId &&
      Number(assignment.hour) === Number(hour)
  ) || null;

}


function assignmentsForLearner(
  journeyId
) {

  return assignments
    .filter(
      assignment =>
        assignment.journeyId === journeyId
    )
    .sort(
      (a, b) =>
        Number(a.hour || 0) -
        Number(b.hour || 0)
    );

}


function getCurrentAssignment(
  journeyId
) {

  const learnerAssignments =
    assignmentsForLearner(journeyId);

  if (!learnerAssignments.length) {
    return null;
  }


  const pending =
    learnerAssignments.find(
      assignment =>
        assignment.status === 'SUBMITTED' &&
        assignment.submitted === true &&
        assignment.reviewStatus === 'PENDING'
    );

  if (pending) {
    return pending;
  }


  const revision =
    learnerAssignments.find(
      assignment =>
        assignment.status === 'RELEASED' &&
        assignment.reviewStatus === 'REVISION_REQUIRED'
    );

  if (revision) {
    return revision;
  }


  const released =
    learnerAssignments.find(
      assignment =>
        assignment.status === 'RELEASED' &&
        assignment.submitted !== true
    );

  if (released) {
    return released;
  }


  return [...learnerAssignments]
    .sort(
      (a, b) =>
        Number(b.hour || 0) -
        Number(a.hour || 0)
    )[0];

}


function approvedHours(
  journeyId
) {

  return assignmentsForLearner(journeyId)
    .filter(
      assignment =>
        statusLabel(assignment) === 'APPROVED'
    )
    .map(
      assignment =>
        Number(assignment.hour || 0)
    );

}


function completedCount(
  learner
) {

  const fromAssignments =
    approvedHours(
      learner.journeyId
    ).length;

  const fromLearner =
    Number(
      learner.completedHours || 0
    );

  return Math.max(
    fromAssignments,
    fromLearner
  );

}


function nextHourNumber(
  learner
) {

  const completed =
    completedCount(learner);

  if (completed >= TOTAL_HOURS) {
    return null;
  }

  return completed + 1;

}


function canReleaseHour(
  learner,
  hour
) {

  const numericHour =
    Number(hour);

  if (
    numericHour < 1 ||
    numericHour > TOTAL_HOURS
  ) {
    return false;
  }


  if (
    assignmentForHour(
      learner.journeyId,
      numericHour
    )
  ) {
    return false;
  }


  if (numericHour === 1) {
    return true;
  }


  const previous =
    assignmentForHour(
      learner.journeyId,
      numericHour - 1
    );


  return Boolean(
    previous &&
    statusLabel(previous) === 'APPROVED'
  );

}


function hourVisual(
  learner,
  hour
) {

  const assignment =
    assignmentForHour(
      learner.journeyId,
      hour
    );


  if (!assignment) {

    const releaseable =
      canReleaseHour(
        learner,
        hour
      );

    return {
      symbol:
        releaseable ? '+' : '🔒',

      title:
        releaseable
          ? `Hour ${hourLabel(hour)} ready for Super Admin release`
          : `Hour ${hourLabel(hour)} locked`,

      className:
        releaseable
          ? 'hour-ready'
          : 'hour-locked'
    };

  }


  const status =
    statusLabel(
      assignment
    );


  if (status === 'APPROVED') {
    return {
      symbol: '✓',
      title:
        `Hour ${hourLabel(hour)} approved`,
      className:
        'hour-approved'
    };
  }


  if (status === 'AWAITING REVIEW') {
    return {
      symbol: '!',
      title:
        `Hour ${hourLabel(hour)} awaiting review`,
      className:
        'hour-review'
    };
  }


  if (status === 'REVISION REQUIRED') {
    return {
      symbol: '↻',
      title:
        `Hour ${hourLabel(hour)} revision required`,
      className:
        'hour-revision'
    };
  }


  if (status === 'RELEASED') {
    return {
      symbol: '●',
      title:
        `Hour ${hourLabel(hour)} released`,
      className:
        'hour-released'
    };
  }


  return {
    symbol: '•',
    title:
      `Hour ${hourLabel(hour)} · ${status}`,
    className:
      'hour-other'
  };

}


// ======================================================
// LOAD DATA
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
      .map(
        snapshot => ({
          id: snapshot.id,
          ...snapshot.data()
        })
      )
      .sort(
        (a, b) =>
          String(a.name || '')
            .localeCompare(
              String(b.name || '')
            )
      );


  assignments =
    assignmentSnapshot.docs
      .map(
        snapshot => ({
          id: snapshot.id,
          ...snapshot.data()
        })
      );

}


// ======================================================
// ENTRY
// ======================================================

export async function showMissionControl(
  container,
  adminUser
) {

  root = container;
  currentAdmin = adminUser;


  root.innerHTML = `

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
        SARLAYASH · ADMINISTRATOR CONTROL PLANE
      </p>


      <h2>
        Mission
        <em>Command Centre.</em>
      </h2>


      <p class="intro">
        Day 3 · Hours 01–16.
        Human-controlled progression.
        Evidence-led review.
        Every Hour remains individually
        auditable, gated and releasable only
        through Mission Control.
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
    .onclick =
      goSuperAdmin;


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

      board.innerHTML = `

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
// DASHBOARD
// ======================================================

function drawDashboard() {

  const rows =
    learners.map(
      learner => {

        const current =
          getCurrentAssignment(
            learner.journeyId
          );


        return {
          learner,
          current,
          status:
            statusLabel(current),
          completed:
            completedCount(learner)
        };

      }
    );


  const awaitingReview =
    rows.filter(
      row =>
        row.status ===
        'AWAITING REVIEW'
    ).length;


  const active =
    rows.filter(
      row =>
        row.status ===
          'RELEASED' ||
        row.status ===
          'REVISION REQUIRED'
    ).length;


  const revisions =
    rows.filter(
      row =>
        row.status ===
        'REVISION REQUIRED'
    ).length;


  const graduates =
    rows.filter(
      row =>
        row.completed >=
        TOTAL_HOURS
    ).length;


  const tableRows =
    rows
      .map(
        (row, index) => {

          const learner =
            row.learner;


          const hourCells =
            Array.from(
              {
                length:
                  TOTAL_HOURS
              },
              (_, position) => {

                const hour =
                  position + 1;


                const visual =
                  hourVisual(
                    learner,
                    hour
                  );


                return `

                  <td
                    title="${esc(
                      visual.title
                    )}"
                    style="
                      text-align:center;
                      min-width:38px;
                    "
                  >

                    <span
                      class="${esc(
                        visual.className
                      )}"
                      style="
                        display:inline-flex;
                        width:28px;
                        height:28px;
                        align-items:center;
                        justify-content:center;
                        border:1px solid rgba(214,177,61,.25);
                        border-radius:50%;
                      "
                    >
                      ${esc(
                        visual.symbol
                      )}
                    </span>

                  </td>

                `;

              }
            )
              .join('');


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

              <td
                style="
                  position:sticky;
                  left:0;
                  background:#080806;
                  z-index:2;
                  min-width:220px;
                "
              >

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


              ${hourCells}


              <td>
                <b>
                  ${row.completed}/${TOTAL_HOURS}
                </b>
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
                  CONTROL →
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


  board.innerHTML = `

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
          ACTIVE MISSIONS
        </small>

        <b>
          ${active}
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
          REVISION REQUIRED
        </small>

        <b>
          ${revisions}
        </b>

      </article>


      <article>

        <small>
          16/16 GRADUATES
        </small>

        <b>
          ${graduates}
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
      16-HOUR · PROGRESSION MATRIX
    </h3>


    <p class="quiet">
      ✓ Approved · ● Released · ! Awaiting Review ·
      ↻ Revision · + Ready for Admin Release · 🔒 Locked
    </p>


    <div
      class="table-wrap"
      style="
        overflow-x:auto;
        max-width:100%;
      "
    >

      <table
        style="
          min-width:1250px;
        "
      >

        <thead>

          <tr>

            <th
              style="
                position:sticky;
                left:0;
                background:#080806;
                z-index:3;
              "
            >
              Learner
            </th>

            ${
              Array.from(
                {
                  length:
                    TOTAL_HOURS
                },
                (_, position) => `

                  <th
                    style="
                      text-align:center;
                      min-width:38px;
                    "
                  >
                    ${hourLabel(
                      position + 1
                    )}
                  </th>

                `
              ).join('')
            }

            <th>
              Progress
            </th>

            <th>
              Current State
            </th>

            <th>
              Control
            </th>

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
    .forEach(
      button => {

        button.onclick =
          () => {

            const row =
              rows[
                Number(
                  button.dataset.index
                )
              ];


            openLearnerControl(
              row.learner
            );

          };

      }
    );


  document
    .querySelector(
      '#mission-search'
    )
    .oninput =
      event => {

        const queryText =
          event.target.value
            .trim()
            .toLowerCase();


        document
          .querySelectorAll(
            '#mission-board tbody tr'
          )
          .forEach(
            row => {

              row.hidden =
                !row.dataset.search
                  .includes(
                    queryText
                  );

            }
          );

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
// LEARNER CONTROL ROOM
// ======================================================

function openLearnerControl(
  learner
) {

  const learnerAssignments =
    assignmentsForLearner(
      learner.journeyId
    );


  const completed =
    completedCount(
      learner
    );


  const current =
    getCurrentAssignment(
      learner.journeyId
    );


  const currentStatus =
    statusLabel(
      current
    );


  const nextHour =
    nextHourNumber(
      learner
    );


  const nextAssignment =
    nextHour
      ? assignmentForHour(
          learner.journeyId,
          nextHour
        )
      : null;


  const nextDefinition =
    nextHour
      ? HOUR_CATALOGUE[
          nextHour
        ]
      : null;


  const canReleaseNext =
    nextHour &&
    !nextAssignment &&
    canReleaseHour(
      learner,
      nextHour
    ) &&
    Boolean(
      nextDefinition
    );


  const history =
    Array.from(
      {
        length:
          TOTAL_HOURS
      },
      (_, position) => {

        const hour =
          position + 1;


        const assignment =
          assignmentForHour(
            learner.journeyId,
            hour
          );


        const visual =
          hourVisual(
            learner,
            hour
          );


        return `

          <article class="review">

            <span>
              HOUR ${hourLabel(hour)}
            </span>


            <h3>
              ${
                assignment
                  ? esc(
                      assignment.theme ||
                      `Mission Hour ${hourLabel(hour)}`
                    )
                  : esc(
                      HOUR_CATALOGUE[hour]?.theme ||
                      'LOCKED'
                    )
              }
            </h3>


            <p>

              <strong>
                Status:
              </strong>

              ${esc(
                assignment
                  ? statusLabel(
                      assignment
                    )
                  : (
                      canReleaseHour(
                        learner,
                        hour
                      )
                        ? 'READY FOR ADMIN RELEASE'
                        : 'LOCKED'
                    )
              )}

            </p>


            ${
              assignment?.submittedAt

                ? `

                    <p>
                      <strong>
                        Submitted:
                      </strong>

                      ${formatDate(
                        assignment.submittedAt
                      )}
                    </p>

                  `

                : ''
            }


            ${
              assignment?.reviewedAt

                ? `

                    <p>
                      <strong>
                        Reviewed:
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


            ${
              assignment?.evidenceUrl

                ? `

                    <p>

                      <a
                        class="evidence-link"
                        style="display:inline-flex;align-items:center;justify-content:center;width:auto;max-width:100%;min-height:44px;padding:12px 18px;margin:8px 0;border:1px solid rgba(212,175,55,.55);background:transparent;color:#e6c75a;text-decoration:none;font:600 12px/1.2 Arial,sans-serif;letter-spacing:.08em;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;"
                        href="${esc(
                          assignment.evidenceUrl
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        OPEN LINKEDIN EVIDENCE ↗
                      </a>

                    </p>

                  `

                : ''
            }


            ${
              assignment &&
              (
                statusLabel(
                  assignment
                ) ===
                  'AWAITING REVIEW' ||
                statusLabel(
                  assignment
                ) ===
                  'REVISION REQUIRED' ||
                statusLabel(
                  assignment
                ) ===
                  'RELEASED'
              )

                ? `

                    <button
                      class="ghost hour-review-open"
                      data-hour="${hour}"
                    >
                      OPEN HOUR ${hourLabel(hour)} →
                    </button>

                  `

                : ''
            }

          </article>

        `;

      }
    )
      .join('');


  root.innerHTML = `

    <section class="review-page">

      <button
        class="ghost"
        id="mission-back"
      >
        ← BACK TO COMMAND CENTRE
      </button>


      <p
        class="eyebrow"
        style="margin-top:30px"
      >
        INDIVIDUAL JOURNEY CONTROL ROOM
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
        JOURNEY INTELLIGENCE
      </h3>


      <div class="intelligence">

        <article>

          <small>
            COMPLETED
          </small>

          <b>
            ${completed}/${TOTAL_HOURS}
          </b>

        </article>


        <article>

          <small>
            CURRENT STATE
          </small>

          <b>
            ${esc(
              currentStatus
            )}
          </b>

        </article>


        <article>

          <small>
            NEXT HOUR
          </small>

          <b>
            ${
              nextHour
                ? hourLabel(
                    nextHour
                  )
                : 'COMPLETE'
            }
          </b>

        </article>

      </div>


      ${
        completed >= TOTAL_HOURS

          ? `

              <h3 class="section-title">
                JOURNEY COMPLETE
              </h3>

              <article class="review">

                <span>
                  ZERO-TO-INFINITY
                </span>

                <h3>
                  16 / 16 HOURS APPROVED
                </h3>

                <p>
                  This learner has completed the
                  full Mission Journey.
                </p>

              </article>

            `

          : nextAssignment

            ? `

                <h3 class="section-title">
                  NEXT PROGRESSION
                </h3>

                <article class="review">

                  <span>
                    HOUR ${hourLabel(
                      nextHour
                    )}
                  </span>

                  <h3>
                    ${esc(
                      nextAssignment.theme ||
                      `Mission Hour ${hourLabel(
                        nextHour
                      )}`
                    )}
                  </h3>

                  <p>
                    <strong>
                      Status:
                    </strong>

                    ${esc(
                      statusLabel(
                        nextAssignment
                      )
                    )}
                  </p>

                  <p class="quiet">
                    This Hour already exists.
                    Mission Control will not create
                    a duplicate assignment.
                  </p>

                </article>

              `

            : canReleaseNext

              ? `

                  <h3 class="section-title">
                    NEXT PROGRESSION
                  </h3>

                  <article class="review">

                    <span>
                      HOUR ${hourLabel(
                        nextHour
                      )}
                    </span>

                    <h3>
                      ${esc(
                        nextDefinition.theme
                      )}
                    </h3>

                    <p>
                      ${esc(
                        nextDefinition.deliverable
                      )}
                    </p>

                    <p>

                      <strong>
                        Transformation:
                      </strong>

                      ${esc(
                        nextDefinition.outcome
                      )}

                    </p>

                    <p>
                      <strong>
                        Status:
                      </strong>
                      NOT RELEASED
                    </p>

                    <button
                      class="gold"
                      id="release-next-hour"
                    >
                      RELEASE HOUR ${hourLabel(
                        nextHour
                      )} →
                    </button>

                    <p class="quiet">
                      Approval and release are separate
                      Super Admin decisions.
                      The learner receives access only
                      after this release.
                    </p>

                  </article>

                `

              : `

                  <h3 class="section-title">
                    NEXT PROGRESSION
                  </h3>

                  <article class="review">

                    <span>
                      HOUR ${
                        nextHour
                          ? hourLabel(
                              nextHour
                            )
                          : '—'
                      }
                    </span>

                    <h3>
                      LOCKED
                    </h3>

                    <p class="quiet">

                      ${
                        nextHour &&
                        !HOUR_CATALOGUE[
                          nextHour
                        ]

                          ? `
                              Curriculum definition for
                              Hour ${hourLabel(
                                nextHour
                              )} has not yet been configured.
                              No release action is available.
                            `

                          : `
                              The previous Hour must be
                              approved before this Hour
                              can be released.
                            `
                      }

                    </p>

                  </article>

                `
      }


      <h3 class="section-title">
        HOURS 01–16 · AUDIT TRAIL
      </h3>


      <div class="review-grid">
        ${history}
      </div>

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


  document
    .querySelectorAll(
      '.hour-review-open'
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            const hour =
              Number(
                button.dataset.hour
              );


            const assignment =
              assignmentForHour(
                learner.journeyId,
                hour
              );


            reviewMission(
              learner,
              assignment
            );

          };

      }
    );


  const releaseButton =
    document.querySelector(
      '#release-next-hour'
    );


  if (releaseButton) {

    releaseButton.onclick =
      () =>
        releaseHour(
          learner,
          nextHour
        );

  }

}


// ======================================================
// REVIEW SCREEN
// ======================================================

function reviewMission(
  learner,
  assignment
) {

  if (!assignment) {

    openLearnerControl(
      learner
    );

    return;

  }


  const status =
    statusLabel(
      assignment
    );


  const canReview =
    assignment.status ===
      'SUBMITTED' &&
    assignment.submitted ===
      true &&
    assignment.reviewStatus ===
      'PENDING';


  const evidence =
    assignment.evidenceUrl

      ? `

          <a
            class="evidence-link"
            style="display:inline-flex;align-items:center;justify-content:center;width:auto;max-width:100%;min-height:44px;padding:12px 18px;margin:8px 0;border:1px solid rgba(212,175,55,.55);background:transparent;color:#e6c75a;text-decoration:none;font:600 12px/1.2 Arial,sans-serif;letter-spacing:.08em;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;"
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


  root.innerHTML = `

    <section class="review-page">

      <button
        class="ghost"
        id="mission-review-back"
      >
        ← BACK TO LEARNER CONTROL
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
          · HOUR ${hourLabel(
            assignment.hour
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
            learner.journeyId
          )}
        </span>

      </div>


      <h3 class="section-title">
        MISSION INTELLIGENCE
      </h3>


      <div class="intelligence">

        <article>

          <small>
            HOUR
          </small>

          <b>
            ${hourLabel(
              assignment.hour
            )}
          </b>

        </article>


        <article>

          <small>
            MISSION STATUS
          </small>

          <b>
            ${esc(
              status
            )}
          </b>

        </article>


        <article>

          <small>
            COMPLETED HOURS
          </small>

          <b>
            ${completedCount(
              learner
            )}/${TOTAL_HOURS}
          </b>

        </article>

      </div>


      <h3 class="section-title">
        ASSIGNMENT
      </h3>


      <article class="review">

        <span>
          HOUR ${hourLabel(
            assignment.hour
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
            assignment.submittedAt
          )}

        </p>


        <p>

          <strong>
            Review Status:
          </strong>

          ${esc(
            assignment.reviewStatus ||
            '—'
          )}

        </p>


        ${
          assignment.reviewedAt

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
          assignment.reviewedBy

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
          assignment.reviewNotes

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
                  APPROVE HOUR ${hourLabel(
                    assignment.hour
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
                  status === 'APPROVED'

                    ? `
                        This Mission has already
                        been approved.
                      `

                    : status ===
                        'REVISION REQUIRED'

                      ? `
                          This Mission has been
                          returned to the learner
                          for revision.
                        `

                      : `
                          Review controls become
                          available after evidence
                          is submitted.
                        `
                }

              </p>

            `
      }

    </section>

  `;


  document
    .querySelector(
      '#mission-review-back'
    )
    .onclick =
      () =>
        openLearnerControl(
          learner
        );


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
      `Hour ${assignment.hour} approved for ${learner.name}. The next Hour remains locked until you release it.`
    );


    await loadMissionData();

    const refreshedLearner =
      learners.find(
        item =>
          item.journeyId ===
          learner.journeyId
      ) || learner;


    openLearnerControl(
      refreshedLearner
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


    await loadMissionData();

    const refreshedLearner =
      learners.find(
        item =>
          item.journeyId ===
          learner.journeyId
      ) || learner;


    openLearnerControl(
      refreshedLearner
    );


  } catch (error) {

    console.error(error);


    alert(
      `Revision action failed: ${error.message}`
    );

  }

}


// ======================================================
// RELEASE NEXT HOUR
// ======================================================

async function releaseHour(
  learner,
  hour
) {

  const numericHour =
    Number(hour);


  const definition =
    HOUR_CATALOGUE[
      numericHour
    ];


  if (!definition) {

    alert(
      `Hour ${hourLabel(numericHour)} curriculum has not yet been configured.`
    );

    return;

  }


  if (
    !canReleaseHour(
      learner,
      numericHour
    )
  ) {

    alert(
      `Hour ${hourLabel(numericHour)} cannot be released yet. Refresh Mission Control and verify the previous Hour is approved.`
    );

    return;

  }


  const confirmed =
    window.confirm(
      `Release Hour ${numericHour} to ${learner.name}?\n\n${definition.theme}\n\nThe learner will receive access immediately.`
    );


  if (!confirmed) {
    return;
  }


  const documentId =
    `${learner.journeyId}-H${hourLabel(
      numericHour
    )}`;


  const assignmentRef =
    doc(
      db,
      'mission_assignments',
      documentId
    );


  try {

    await runTransaction(
      db,
      async transaction => {

        const existing =
          await transaction.get(
            assignmentRef
          );


        if (existing.exists()) {

          throw new Error(
            `Hour ${hourLabel(numericHour)} already exists for this learner.`
          );

        }


        if (numericHour > 1) {

          const previousId =
            `${learner.journeyId}-H${hourLabel(
              numericHour - 1
            )}`;


          const previousRef =
            doc(
              db,
              'mission_assignments',
              previousId
            );


          const previousSnapshot =
            await transaction.get(
              previousRef
            );


          if (!previousSnapshot.exists()) {

            throw new Error(
              `Hour ${hourLabel(
                numericHour - 1
              )} assignment was not found.`
            );

          }


          const previous =
            previousSnapshot.data();


          if (
            previous.status !==
              'APPROVED' &&
            previous.reviewStatus !==
              'APPROVED'
          ) {

            throw new Error(
              `Hour ${hourLabel(
                numericHour - 1
              )} must be approved before Hour ${hourLabel(
                numericHour
              )} can be released.`
            );

          }

        }


        transaction.set(
          assignmentRef,
          {

            journeyId:
              learner.journeyId,

            hour:
              numericHour,

            theme:
              definition.theme,

            deliverable:
              definition.deliverable,

            outcome:
              definition.outcome,

            evidenceUrl:
              '',

            releasedAt:
              serverTimestamp(),

            releasedBy:
              currentAdmin?.email ||
              'SUPER ADMIN',

            status:
              'RELEASED',

            reviewStatus:
              'PENDING',

            submitted:
              false,

            submittedAt:
              null

          }
        );

      }
    );


    alert(
      `Hour ${hourLabel(numericHour)} released successfully to ${learner.name}.`
    );


    await loadMissionData();


    const refreshedLearner =
      learners.find(
        item =>
          item.journeyId ===
          learner.journeyId
      ) || learner;


    openLearnerControl(
      refreshedLearner
    );


  } catch (error) {

    console.error(error);


    alert(
      `Release failed: ${error.message}`
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
    'Completed Hours',
    'Current Hour',
    'Current Status',

    ...Array.from(
      {
        length:
          TOTAL_HOURS
      },
      (_, position) =>
        `Hour ${hourLabel(
          position + 1
        )}`
    )

  ];


  const dataRows =
    learners.map(
      learner => {

        const current =
          getCurrentAssignment(
            learner.journeyId
          );


        const hourStatuses =
          Array.from(
            {
              length:
                TOTAL_HOURS
            },
            (_, position) => {

              const assignment =
                assignmentForHour(
                  learner.journeyId,
                  position + 1
                );


              return assignment
                ? statusLabel(
                    assignment
                  )
                : 'NOT RELEASED';

            }
          );


        return [

          learner.journeyId,
          learner.name,
          learner.authEmail,
          learner.course,
          completedCount(
            learner
          ),
          current?.hour || '',
          statusLabel(
            current
          ),

          ...hourStatuses

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
    `sarlayash-mission-command-centre-${
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
