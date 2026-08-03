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


/* =========================================================
   LOGIN SCREEN
========================================================= */

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
          Use your registered Email ID and Journey ID
          to enter your SarlaYash Mission.
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


          <button type="submit">
            ENTER MISSION →
          </button>

        </form>


        <p id="login-message"></p>

      </section>

    </main>

  `;


  const loginForm =
    document.querySelector('#mission-login');


  loginForm.onsubmit = async (e) => {

    e.preventDefault();


    const data =
      Object.fromEntries(
        new FormData(e.target)
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

    }

    catch (error) {

      console.error(
        'Mission Login Error:',
        error
      );


      message.textContent =
        'Email ID or Journey ID is incorrect.';

    }

  };

}


/* =========================================================
   MISSION DASHBOARD
========================================================= */

async function showMission(user) {

  const email =
    user.email
      ?.trim()
      .toLowerCase();


  if (!email) {

    await signOut(auth);

    return;

  }


  root.innerHTML = `

    <main class="mission-dashboard">

      <section>

        <p class="eyebrow">
          MISSION CONTROL
        </p>

        <h1>
          Loading Your
          <em>Mission...</em>
        </h1>

        <p>
          Please wait while we prepare your journey.
        </p>

      </section>

    </main>

  `;


  try {

    /* -----------------------------------------------------
       FIND STUDENT IN FIRESTORE
    ----------------------------------------------------- */

    const studentQuery = query(

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


    const snapshot =
      await getDocs(studentQuery);


    /* -----------------------------------------------------
       NO MATCHING MISSION RECORD
    ----------------------------------------------------- */

    if (snapshot.empty) {

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
              Mission Record
              <em>Not Found.</em>
            </h1>

            <p>
              ${email}
            </p>

            <p>
              Your login is valid, but no Mission record
              is currently connected to this account.
            </p>

          </section>

        </main>

      `;


      document
        .querySelector('#logout')
        .onclick =
          () => signOut(auth);


      return;

    }


    /* -----------------------------------------------------
       STUDENT RECORD
    ----------------------------------------------------- */

    const student =
      snapshot.docs[0].data();


    const name =
      student.name || 'Mission Member';


    const journeyId =
      student.journeyId || 'Not Assigned';


    const course =
      student.course || 'Not Assigned';


    const month =
      student.month ?? 1;


    const status =
      student.status || 'ACTIVE';


    const completedHours =
      student.completedHours ?? 0;


    const totalHours =
      student.totalHours ?? 0;


    /* -----------------------------------------------------
       STUDENT DASHBOARD
    ----------------------------------------------------- */

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
            <em>${name}</em>
          </h1>


          <p>
            Your SarlaYash Mission is now active.
          </p>


          <div class="mission-profile">

            <p>
              <strong>Journey ID:</strong>
              ${journeyId}
            </p>

            <p>
              <strong>Email:</strong>
              ${email}
            </p>

            <p>
              <strong>Course:</strong>
              ${course}
            </p>

            <p>
              <strong>Month:</strong>
              ${month}
            </p>

            <p>
              <strong>Status:</strong>
              ${status}
            </p>

            <p>
              <strong>Completed Hours:</strong>
              ${completedHours}
            </p>

            <p>
              <strong>Total Hours:</strong>
              ${totalHours}
            </p>

          </div>


          <p>
            Your Month ${String(month).padStart(2, '0')}
            journey will appear here.
          </p>

        </section>

      </main>

    `;


    document
      .querySelector('#logout')
      .onclick =
        () => signOut(auth);

  }


  /* =======================================================
     FIRESTORE ERROR
  ======================================================= */

  catch (error) {

    console.error(
      'Mission Loading Error:',
      error
    );


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
            Please try again.
          </p>

          <button id="logout">
            SIGN OUT
          </button>

        </section>

      </main>

    `;


    document
      .querySelector('#logout')
      .onclick =
        () => signOut(auth);

  }

}


/* =========================================================
   AUTHENTICATION STATE
========================================================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      showMission(user);

    }

    else {

      showLogin();

    }

  }
);