import { auth, db } from './firebase.js';

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
              required
            >
          </label>


          <label>
            JOURNEY ID

            <input
              type="password"
              name="password"
              placeholder="Enter your Journey ID"
              required
            >
          </label>


          <button type="submit">
            ENTER MISSION →
          </button>

        </form>

        <p id="login-message"></p>

      </section>

    </main>
  `;


  document.querySelector('#mission-login').onsubmit =
    async (event) => {

      event.preventDefault();

      const data =
        Object.fromEntries(
          new FormData(event.target)
        );


      const email =
        data.email
          .trim()
          .toLowerCase();


      const journeyId =
        data.password
          .trim()
          .toUpperCase();


      const message =
        document.querySelector('#login-message');


      message.textContent =
        'Verifying your mission credentials...';


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

      <section>

        <p class="eyebrow">
          MISSION CONTROL
        </p>

        <h1>
          Unable to Load
          <em>Mission.</em>
        </h1>

        <p>
          ${message}
        </p>

        <button id="logout">
          SIGN OUT
        </button>

      </section>

    </main>

  `;


  document.querySelector('#logout').onclick =
    () => signOut(auth);

}


// ======================================================
// WAITING SCREEN
// ======================================================

function showWaiting(student) {

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
          Welcome,
          <em>${student.name}</em>
        </h1>


        <p>
          Your current mission has been completed.
        </p>

        <p>
          Return when your next mission is revealed.
        </p>


        <p>
          <strong>Journey ID:</strong>
          ${student.journeyId}
        </p>

        <p>
          <strong>Completed Hours:</strong>
          ${student.completedHours}
        </p>

      </section>

    </main>

  `;


  document.querySelector('#logout').onclick =
    () => signOut(auth);

}


// ======================================================
// SUBMITTED / REVIEW SCREEN
// ======================================================

function showSubmitted(student, assignment) {

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
          MISSION CONTROL · HOUR ${String(assignment.hour).padStart(2, '0')}
        </p>


        <h1>
          Evidence
          <em>Received.</em>
        </h1>


        <p>
          ${student.name}, your Hour ${assignment.hour}
          evidence has been submitted successfully.
        </p>


        <p>
          <strong>Journey ID:</strong>
          ${student.journeyId}
        </p>


        <p>
          <strong>Mission:</strong>
          ${assignment.theme}
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


  document.querySelector('#logout').onclick =
    () => signOut(auth);

}


// ======================================================
// ACTIVE MISSION SCREEN
// ======================================================

function showActiveMission(student, assignment) {

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
          MISSION CONTROL · HOUR ${String(assignment.hour).padStart(2, '0')}
        </p>


        <h1>
          Welcome,
          <em>${student.name}</em>
        </h1>


        <p>
          Your SarlaYash Mission is active.
        </p>


        <p>
          <strong>Journey ID:</strong>
          ${student.journeyId}
        </p>

        <p>
          <strong>Course:</strong>
          ${student.course}
        </p>

        <p>
          <strong>Month:</strong>
          ${student.month}
        </p>


        <hr>


        <p class="eyebrow">
          TODAY'S MISSION
        </p>


        <h2>
          ${assignment.theme}
        </h2>


        <p>
          <strong>YOUR MISSION</strong>
        </p>

        <p>
          ${assignment.deliverable}
        </p>


        <p>
          <strong>TRANSFORMATION</strong>
        </p>

        <p>
          ${assignment.outcome}
        </p>


        <p>
          <strong>MISSION STATUS</strong>
        </p>

        <p>
          ${assignment.status}
        </p>


        <hr>


        <p>
          Build it. Question it. Publish what you can defend.
        </p>


        <p>
          When your work is ready, publish your evidence
          and return here to complete your mission.
        </p>


        <p>
          <strong>
            One mission. One hour. One piece of evidence.
          </strong>
        </p>


        <hr>


        <div class="evidence-section">

          <p class="eyebrow">
            SUBMIT YOUR EVIDENCE
          </p>


          <h2>
            Complete Hour ${String(assignment.hour).padStart(2, '0')}
          </h2>


          <p>
            Publish your completed work on LinkedIn
            and paste the public LinkedIn post URL below.
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
              SUBMIT HOUR ${String(assignment.hour).padStart(2, '0')} →
            </button>

          </form>


          <p id="evidence-message"></p>

        </div>

      </section>

    </main>

  `;


  document.querySelector('#logout').onclick =
    () => signOut(auth);


  // ====================================================
  // EVIDENCE SUBMISSION
  // ====================================================

  const evidenceForm =
    document.querySelector('#evidence-form');


  evidenceForm.onsubmit =
    async (event) => {

      event.preventDefault();


      const evidenceInput =
        document.querySelector('#evidence-url');


      const message =
        document.querySelector('#evidence-message');


      const submitButton =
        document.querySelector('#submit-evidence');


      const evidenceUrl =
        evidenceInput.value.trim();


      // --------------------------------------------------
      // BASIC URL VALIDATION
      // --------------------------------------------------

      if (!evidenceUrl) {

        message.textContent =
          'Please enter your LinkedIn evidence URL.';

        return;

      }


      let parsedUrl;


      try {

        parsedUrl =
          new URL(evidenceUrl);

      } catch (error) {

        message.textContent =
          'Please enter a valid URL.';

        return;

      }


      const hostname =
        parsedUrl.hostname
          .toLowerCase()
          .replace(/^www\./, '');


      if (
        hostname !== 'linkedin.com' &&
        !hostname.endsWith('.linkedin.com')
      ) {

        message.textContent =
          'Evidence must be a LinkedIn URL.';

        return;

      }


      // --------------------------------------------------
      // PREVENT DOUBLE CLICK
      // --------------------------------------------------

      submitButton.disabled = true;

      evidenceInput.disabled = true;

      submitButton.textContent =
        'SUBMITTING EVIDENCE...';

      message.textContent =
        'Recording your Hour ' +
        assignment.hour +
        ' evidence...';


      try {

        // ------------------------------------------------
        // UPDATE EXACT FIRESTORE ASSIGNMENT
        // ------------------------------------------------

        const assignmentReference =
          doc(
            db,
            'mission_assignments',
            assignment.id
          );


        await updateDoc(
          assignmentReference,
          {

            evidenceUrl: evidenceUrl,

            submitted: true,

            submittedAt: serverTimestamp(),

            status: 'SUBMITTED',

            reviewStatus: 'PENDING'

          }
        );


        // ------------------------------------------------
        // LOCAL OBJECT UPDATE
        // ------------------------------------------------

        assignment.evidenceUrl =
          evidenceUrl;

        assignment.submitted =
          true;

        assignment.status =
          'SUBMITTED';

        assignment.reviewStatus =
          'PENDING';


        // ------------------------------------------------
        // SHOW CONFIRMATION
        // ------------------------------------------------

        showSubmitted(
          student,
          assignment
        );


      } catch (error) {

        console.error(
          'Evidence Submission Error:',
          error
        );


        evidenceInput.disabled = false;

        submitButton.disabled = false;

        submitButton.textContent =
          'SUBMIT HOUR ' +
          String(assignment.hour).padStart(2, '0') +
          ' →';


        message.textContent =
          'Unable to submit evidence. Please try again.';

      }

    };

}


// ======================================================
// LOAD MISSION
// ======================================================

async function showMission(user) {

  try {

    const email =
      user.email
        .trim()
        .toLowerCase();


    // --------------------------------------------------
    // FIND THE LEARNER
    // --------------------------------------------------

    const userQuery = query(
      collection(db, 'mission_users'),
      where(
        'authEmail',
        '==',
        email
      )
    );


    const userSnapshot =
      await getDocs(userQuery);


    if (userSnapshot.empty) {

      showError(
        'Mission record not found.'
      );

      return;

    }


    const student =
      userSnapshot.docs[0].data();


    // --------------------------------------------------
    // FIND LEARNER ASSIGNMENTS
    // --------------------------------------------------

    const assignmentQuery = query(
      collection(db, 'mission_assignments'),
      where(
        'journeyId',
        '==',
        student.journeyId
      )
    );


    const assignmentSnapshot =
      await getDocs(assignmentQuery);


    if (assignmentSnapshot.empty) {

      showWaiting(student);

      return;

    }


    // --------------------------------------------------
    // NORMALIZE ASSIGNMENTS
    // --------------------------------------------------

    const allAssignments =
      assignmentSnapshot.docs
        .map(documentSnapshot => ({

          id: documentSnapshot.id,

          ...documentSnapshot.data()

        }))
        .sort(
          (a, b) =>
            Number(a.hour) - Number(b.hour)
        );


    // --------------------------------------------------
    // CHECK FOR SUBMITTED MISSION AWAITING REVIEW
    // --------------------------------------------------

    const submittedMission =
      allAssignments.find(
        assignment =>
          assignment.status === 'SUBMITTED' ||
          assignment.submitted === true
      );


    if (submittedMission) {

      showSubmitted(
        student,
        submittedMission
      );

      return;

    }


    // --------------------------------------------------
    // FIND CURRENT UNFINISHED RELEASED MISSION
    // --------------------------------------------------

    const availableAssignments =
      allAssignments.filter(
        assignment =>
          assignment.status === 'RELEASED' &&
          assignment.submitted !== true
      );


    if (availableAssignments.length === 0) {

      showWaiting(student);

      return;

    }


    // --------------------------------------------------
    // SHOW ONLY FIRST AVAILABLE MISSION
    // --------------------------------------------------

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
  (user) => {

    if (user) {

      showMission(user);

    } else {

      showLogin();

    }

  }
);