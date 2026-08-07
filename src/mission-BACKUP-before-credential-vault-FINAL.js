import { auth, db } from './firebase.js';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';


const root = document.querySelector('#mission-app');


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


function hourLabel(hour) {

  return String(
    Number(hour || 0)
  ).padStart(2, '0');

}


// ======================================================
// LOGIN SCREEN
// ======================================================

function showLogin() {

  root.innerHTML = `

    <main class="mission-login">

      <div class="mission-brand">
        SARLAYASH MISSION
      </div>

      <section class="login-card">

        <p class="eyebrow">
          YOUR JOURNEY BEGINS HERE
        </p>

        <h1>
          Enter Your
          <em>Mission.</em>
        </h1>

        <p class="intro">
          Enter your registered Email ID and Journey ID
          to access your SarlaYash Mission.
        </p>

        <form id="mission-login">

          <label>

            EMAIL ID

            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              autocomplete="email"
              required
            >

          </label>


          <label>

            JOURNEY ID

            <input
              type="password"
              name="password"
              placeholder="Enter your Journey ID"
              autocomplete="current-password"
              required
            >

          </label>


          <button
            type="submit"
            id="mission-login-button"
          >
            ENTER MISSION →
          </button>

        </form>

        <p id="login-message"></p>

      </section>

    </main>

  `;


  const form =
    document.querySelector(
      '#mission-login'
    );


  form.onsubmit =
    async event => {

      event.preventDefault();


      const data =
        Object.fromEntries(
          new FormData(
            event.target
          )
        );


      const email =
        String(
          data.email || ''
        )
          .trim()
          .toLowerCase();


      const journeyId =
        String(
          data.password || ''
        )
          .trim()
          .toUpperCase();


      const message =
        document.querySelector(
          '#login-message'
        );


      const button =
        document.querySelector(
          '#mission-login-button'
        );


      message.textContent =
        'Verifying your mission credentials...';


      button.disabled = true;


      try {

        await signInWithEmailAndPassword(
          auth,
          email,
          journeyId
        );

      } catch (error) {

        console.error(
          'Mission Login Error:',
          error
        );


        button.disabled = false;


        message.textContent =
          'Email ID or Journey ID is incorrect.';

      }

    };

}


// ======================================================
// ERROR SCREEN
// ======================================================

function showError(message) {

  root.innerHTML = `

    <main class="mission-dashboard">

      <header>

        <div>
          SARLAYASH MISSION
        </div>

        <button id="logout">
          SIGN OUT
        </button>

      </header>


      <section>

        <p class="eyebrow">
          MISSION CONTROL
        </p>

        <h1>
          Unable to Load
          <em>Mission.</em>
        </h1>

        <p>
          ${esc(message)}
        </p>

      </section>

    </main>

  `;


  bindLogout();

}


// ======================================================
// WAITING SCREEN
// ======================================================

function showWaiting(student) {

  const completedHours =
    Number(
      student.completedHours || 0
    );


  const totalHours =
    Number(
      student.totalHours || 16
    );


  const journeyComplete =
    completedHours >= totalHours;


  root.innerHTML = `

    <main class="mission-dashboard">

      <header>

        <div>
          SARLAYASH MISSION
        </div>

        <button id="logout">
          SIGN OUT
        </button>

      </header>


      <section>

        <p class="eyebrow">

          ${
            journeyComplete
              ? 'MISSION JOURNEY'
              : 'MISSION CONTROL'
          }

        </p>


        <h1>

          ${
            journeyComplete
              ? `
                  Journey
                  <em>Complete.</em>
                `
              : `
                  Welcome,
                  <em>${esc(student.name)}</em>
                `
          }

        </h1>


        ${
          journeyComplete

            ? `

                <p>
                  ${esc(student.name)}, you have completed
                  all ${totalHours} Mission Hours.
                </p>

                <p>
                  Your Zero-To-Infinity Mission Journey
                  has reached completion.
                </p>

              `

            : `

                <p>
                  Your current mission has been completed.
                </p>

                <p>
                  Return when your next mission is revealed.
                </p>

                <p>
                  Your next Hour remains locked until it is
                  released by SarlaYash Mission Control.
                </p>

              `
        }


        <hr>


        <p>
          <strong>Journey ID:</strong>
          ${esc(student.journeyId)}
        </p>


        <p>
          <strong>Completed Hours:</strong>
          ${completedHours} / ${totalHours}
        </p>


        ${
          !journeyComplete

            ? `

                <p>
                  <strong>
                    Progression is controlled individually.
                    Completion of one Hour does not
                    automatically release the next.
                  </strong>
                </p>

              `

            : ''
        }

      </section>

    </main>

  `;


  bindLogout();

}


// ======================================================
// SUBMITTED / REVIEW SCREEN
// ======================================================

function showSubmitted(
  student,
  assignment
) {

  root.innerHTML = `

    <main class="mission-dashboard">

      <header>

        <div>
          SARLAYASH MISSION
        </div>

        <button id="logout">
          SIGN OUT
        </button>

      </header>


      <section>

        <p class="eyebrow">
          MISSION CONTROL ·
          HOUR ${hourLabel(assignment.hour)}
        </p>


        <h1>
          Evidence
          <em>Received.</em>
        </h1>


        <p>
          ${esc(student.name)}, your Hour
          ${esc(assignment.hour)}
          evidence has been submitted successfully.
        </p>


        <p>
          <strong>Journey ID:</strong>
          ${esc(student.journeyId)}
        </p>


        <p>
          <strong>Mission:</strong>
          ${esc(assignment.theme)}
        </p>


        <p>
          <strong>Mission Status:</strong>
          SUBMITTED
        </p>


        <p>
          <strong>Review Status:</strong>
          PENDING
        </p>


        <hr>


        <p>
          Your evidence is now awaiting review.
        </p>


        <p>
          Your next mission will remain locked
          until the current mission is reviewed
          and progression is approved.
        </p>


        <p>
          <strong>
            Submission does not mean progression.
            Evidence must stand up to review.
          </strong>
        </p>

      </section>

    </main>

  `;


  bindLogout();

}


// ======================================================
// ACTIVE MISSION SCREEN
// ======================================================

function showActiveMission(
  student,
  assignment
) {

  const revisionRequired =
    assignment.reviewStatus ===
    'REVISION_REQUIRED';


  root.innerHTML = `

    <main class="mission-dashboard">

      <header>

        <div>
          SARLAYASH MISSION
        </div>

        <button id="logout">
          SIGN OUT
        </button>

      </header>


      <section>

        <p class="eyebrow">
          MISSION CONTROL ·
          HOUR ${hourLabel(assignment.hour)}
        </p>


        <h1>
          Welcome,
          <em>${esc(student.name)}</em>
        </h1>


        ${
          revisionRequired

            ? `

                <p>
                  Your Hour ${esc(assignment.hour)}
                  submission requires revision.
                </p>

                ${
                  assignment.reviewNotes

                    ? `

                        <p>
                          <strong>
                            REVIEW NOTE
                          </strong>
                        </p>

                        <p>
                          ${esc(
                            assignment.reviewNotes
                          )}
                        </p>

                      `

                    : ''
                }

              `

            : `

                <p>
                  Your SarlaYash Mission is active.
                </p>

              `
        }


        <p>
          <strong>Journey ID:</strong>
          ${esc(student.journeyId)}
        </p>


        <p>
          <strong>Course:</strong>
          ${esc(student.course || '—')}
        </p>


        <p>
          <strong>Month:</strong>
          ${esc(student.month || '—')}
        </p>


        <hr>


        <p class="eyebrow">

          ${
            revisionRequired
              ? 'MISSION REVISION'
              : "TODAY'S MISSION"
          }

        </p>


        <h2>
          ${esc(assignment.theme)}
        </h2>


        <p>
          <strong>
            YOUR MISSION
          </strong>
        </p>


        <p>
          ${esc(assignment.deliverable)}
        </p>


        <p>
          <strong>
            TRANSFORMATION
          </strong>
        </p>


        <p>
          ${esc(assignment.outcome)}
        </p>


        <p>
          <strong>
            MISSION STATUS
          </strong>
        </p>


        <p>

          ${
            revisionRequired
              ? 'REVISION REQUIRED'
              : esc(assignment.status)
          }

        </p>


        <hr>


        <p>
          Build it. Question it.
          Publish what you can defend.
        </p>


        <p>
          When your work is ready,
          publish your evidence and return here
          to complete your mission.
        </p>


        <p>
          <strong>
            One mission. One hour.
            One piece of evidence.
          </strong>
        </p>


        <hr>


        <div class="evidence-section">

          <p class="eyebrow">
            ${
              revisionRequired
                ? 'RESUBMIT YOUR EVIDENCE'
                : 'SUBMIT YOUR EVIDENCE'
            }
          </p>


          <h2>

            ${
              revisionRequired
                ? 'Revise Hour'
                : 'Complete Hour'
            }

            ${hourLabel(assignment.hour)}

          </h2>


          <p>

            ${
              revisionRequired

                ? `
                    Complete the requested revision,
                    publish the updated work on LinkedIn
                    and submit the public post URL below.
                  `

                : `
                    Publish your completed work on LinkedIn
                    and paste the public LinkedIn post URL below.
                  `
            }

          </p>


          <form id="evidence-form">

            <label>

              LINKEDIN EVIDENCE URL

              <input
                type="url"
                name="evidenceUrl"
                id="evidence-url"
                placeholder="https://www.linkedin.com/posts/..."
                autocomplete="off"
                required
              >

            </label>


            <button
              type="submit"
              id="submit-evidence"
            >

              ${
                revisionRequired
                  ? 'RESUBMIT'
                  : 'SUBMIT'
              }

              HOUR ${hourLabel(assignment.hour)} →

            </button>

          </form>


          <p id="evidence-message"></p>

        </div>

      </section>

    </main>

  `;


  bindLogout();


  const evidenceForm =
    document.querySelector(
      '#evidence-form'
    );


  evidenceForm.onsubmit =
    async event => {

      event.preventDefault();


      const evidenceInput =
        document.querySelector(
          '#evidence-url'
        );


      const message =
        document.querySelector(
          '#evidence-message'
        );


      const submitButton =
        document.querySelector(
          '#submit-evidence'
        );


      const evidenceUrl =
        evidenceInput.value.trim();


      // ==================================================
      // URL VALIDATION
      // ==================================================

      if (!evidenceUrl) {

        message.textContent =
          'Please enter your LinkedIn evidence URL.';

        return;

      }


      let parsedUrl;


      try {

        parsedUrl =
          new URL(
            evidenceUrl
          );

      } catch {

        message.textContent =
          'Please enter a valid URL.';

        return;

      }


      const hostname =
        parsedUrl.hostname
          .toLowerCase()
          .replace(
            /^www\./,
            ''
          );


      if (
        hostname !== 'linkedin.com' &&
        !hostname.endsWith(
          '.linkedin.com'
        )
      ) {

        message.textContent =
          'Evidence must be a LinkedIn URL.';

        return;

      }


      // ==================================================
      // PREVENT DOUBLE SUBMISSION
      // ==================================================

      submitButton.disabled = true;

      evidenceInput.disabled = true;


      submitButton.textContent =
        'SUBMITTING EVIDENCE...';


      message.textContent =
        `Recording your Hour ${
          assignment.hour
        } evidence...`;


      try {

        const assignmentReference =
          doc(
            db,
            'mission_assignments',
            assignment.id
          );


        await updateDoc(
          assignmentReference,
          {

            evidenceUrl,

            submitted:
              true,

            submittedAt:
              serverTimestamp(),

            status:
              'SUBMITTED',

            reviewStatus:
              'PENDING'

          }
        );


        assignment.evidenceUrl =
          evidenceUrl;

        assignment.submitted =
          true;

        assignment.status =
          'SUBMITTED';

        assignment.reviewStatus =
          'PENDING';


        showSubmitted(
          student,
          assignment
        );

      } catch (error) {

        console.error(
          'Evidence Submission Error:',
          error
        );


        evidenceInput.disabled =
          false;

        submitButton.disabled =
          false;


        submitButton.textContent =
          `${
            revisionRequired
              ? 'RESUBMIT'
              : 'SUBMIT'
          } HOUR ${
            hourLabel(
              assignment.hour
            )
          } →`;


        message.textContent =
          'Unable to submit evidence. Please try again.';

      }

    };

}


// ======================================================
// LOGOUT
// ======================================================

function bindLogout() {

  const logoutButton =
    document.querySelector(
      '#logout'
    );


  if (!logoutButton) {
    return;
  }


  logoutButton.onclick =
    () => signOut(auth);

}


// ======================================================
// LOAD MISSION
// ======================================================

async function showMission(user) {

  try {

    const email =
      String(
        user.email || ''
      )
        .trim()
        .toLowerCase();


    // ==================================================
    // FIND LEARNER
    // ==================================================

    const userQuery =
      query(
        collection(
          db,
          'mission_users'
        ),
        where(
          'authEmail',
          '==',
          email
        )
      );


    const userSnapshot =
      await getDocs(
        userQuery
      );


    if (userSnapshot.empty) {

      showError(
        'Mission record not found.'
      );

      return;

    }


    const student =
      userSnapshot
        .docs[0]
        .data();


    // ==================================================
    // FIND ALL ASSIGNMENTS FOR THIS JOURNEY
    // ==================================================

    const assignmentQuery =
      query(
        collection(
          db,
          'mission_assignments'
        ),
        where(
          'journeyId',
          '==',
          student.journeyId
        )
      );


    const assignmentSnapshot =
      await getDocs(
        assignmentQuery
      );


    // ==================================================
    // NO RELEASED MISSION YET
    // ==================================================

    if (assignmentSnapshot.empty) {

      showWaiting(
        student
      );

      return;

    }


    // ==================================================
    // NORMALIZE + SORT HOURS
    // ==================================================

    const allAssignments =
      assignmentSnapshot.docs
        .map(
          documentSnapshot => ({

            id:
              documentSnapshot.id,

            ...documentSnapshot.data()

          })
        )
        .sort(
          (a, b) =>
            Number(a.hour || 0) -
            Number(b.hour || 0)
        );


    // ==================================================
    // PRIORITY 1
    // MISSION CURRENTLY AWAITING ADMIN REVIEW
    //
    // IMPORTANT:
    // An APPROVED assignment may still contain
    // submitted:true as historical evidence.
    //
    // Therefore submitted:true ALONE must never
    // trap the learner on the review screen.
    // ==================================================

    const submittedMission =
      allAssignments.find(
        assignment =>

          assignment.status ===
            'SUBMITTED' &&

          assignment.submitted ===
            true &&

          assignment.reviewStatus ===
            'PENDING'
      );


    if (submittedMission) {

      showSubmitted(
        student,
        submittedMission
      );

      return;

    }


    // ==================================================
    // PRIORITY 2
    // CURRENT RELEASED / REVISION MISSION
    //
    // Only an assignment explicitly RELEASED by
    // Mission Control becomes available.
    // ==================================================

    const availableAssignments =
      allAssignments.filter(
        assignment =>

          assignment.status ===
            'RELEASED' &&

          assignment.submitted !==
            true
      );


    if (
      availableAssignments.length ===
      0
    ) {

      showWaiting(
        student
      );

      return;

    }


    // ==================================================
    // SHOW ONLY THE FIRST AVAILABLE HOUR
    //
    // Even if bad data accidentally releases multiple
    // assignments, the learner receives one Hour only.
    // ==================================================

    const currentMission =
      availableAssignments[0];


    showActiveMission(
      student,
      currentMission
    );


  } catch (error) {

    console.error(
      'Mission Loading Error:',
      error
    );


    showError(
      'Please try again.'
    );

  }

}


// ======================================================
// AUTHENTICATION STATE
// ======================================================

onAuthStateChanged(
  auth,
  user => {

    if (user) {

      showMission(
        user
      );

    } else {

      showLogin();

    }

  }
);