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
  getDocs
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

      </section>

    </main>

  `;


  document.querySelector('#logout').onclick =
    () => signOut(auth);

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
      where('authEmail', '==', email)
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
    // FIND RELEASED ASSIGNMENT
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
    // FIND CURRENT UNFINISHED RELEASED MISSION
    // --------------------------------------------------

    const assignments =
      assignmentSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(assignment =>
          assignment.status === 'RELEASED' &&
          assignment.submitted !== true
        )
        .sort(
          (a, b) =>
            Number(a.hour) - Number(b.hour)
        );


    if (assignments.length === 0) {

      showWaiting(student);

      return;

    }


    // Learner sees ONLY the first
    // currently available mission.

    const currentMission =
      assignments[0];


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