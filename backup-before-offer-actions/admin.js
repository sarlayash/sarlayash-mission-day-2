import {
  auth,
  db,
  firebaseReady
} from './firebase.js';

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import {
  doc,
  getDoc,
  collection,
  getDocs
} from 'firebase/firestore';

import {
  showOnboardingControl
} from './onboarding-admin.js';

import {
  showMissionControl
} from './mission-admin.js';

import {
  showLeadOfferControl
} from './lead-offer-admin.js';


// ======================================================
// ROOT + STATE
// ======================================================

const root =
  document.querySelector('#admin-app');

let currentAdmin = null;


// ======================================================
// HEADER
// ======================================================

function header() {

  setTimeout(
    startIstClock,
    0
  );

  return `
    <div class="grain"></div>

    <header>

      <a
        class="brand"
        href="/"
      >
        SARLAYASH <i>MISSION</i>
      </a>

      <div class="admin-header-meta">
        <span class="day">
          SUPER ADMIN
        </span>
        <span
          id="ist-clock"
          class="day"
          style="display:block; margin-top:8px; text-align:right; font-size:12px;"
        >
          INDIA · IST
        </span>
      </div>

    </header>
  `;

}



// ======================================================
// LIVE INDIA DATE + TIME
// ======================================================

let istClockTimer = null;

function updateIstClock() {

  const clock =
    document.querySelector('#ist-clock');

  if (!clock) {
    return;
  }

  const now =
    new Date();

  const date =
    new Intl.DateTimeFormat(
      'en-IN',
      {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(now);

  const time =
    new Intl.DateTimeFormat(
      'en-IN',
      {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }
    ).format(now);

  clock.textContent =
    `${date} · ${time} · IST`;
}


function startIstClock() {

  updateIstClock();

  if (istClockTimer) {
    clearInterval(istClockTimer);
  }

  istClockTimer =
    setInterval(
      updateIstClock,
      1000
    );
}


// ======================================================
// LOGIN
// ======================================================

function login() {

  root.innerHTML =
    header() +
    `
      <section class="form-page">

        <p class="eyebrow">
          RESTRICTED ACCESS
        </p>

        <h2>
          Super Admin
          <em>Command Centre.</em>
        </h2>

        <p class="intro">
          Control the complete learner Journey —
          from the 10-question assessment
          to Day 3 Mission progression.
        </p>


        <form
          id="super-login"
          class="fields"
        >

          <label>

            Email

            <input
              required
              type="email"
              name="email"
              autocomplete="email"
            >

          </label>


          <label>

            Password

            <input
              required
              type="password"
              name="password"
              autocomplete="current-password"
            >

          </label>


          <button
            class="gold"
            type="submit"
          >
            ENTER COMMAND CENTRE →
          </button>

        </form>

      </section>
    `;


  document
    .querySelector('#super-login')
    .onsubmit =
      async event => {

        event.preventDefault();


        const data =
          Object.fromEntries(
            new FormData(
              event.target
            )
          );


        try {

          await signInWithEmailAndPassword(
            auth,
            data.email,
            data.password
          );

        } catch (error) {

          console.error(error);

          alert(
            'Unable to sign in. Check your administrator credentials.'
          );

        }

      };

}


// ======================================================
// ACCESS DENIED
// ======================================================

function accessDenied() {

  root.innerHTML =
    header() +
    `
      <section class="form-page">

        <p class="eyebrow">
          ACCESS DENIED
        </p>

        <h2>
          Super Admin
          <em>Authorization Required.</em>
        </h2>

        <p class="intro">
          This Firebase account may be authenticated,
          but it is not authorised to access
          the SarlaYash Super Admin Command Centre.
        </p>


        <button
          class="ghost"
          id="denied-signout"
        >
          SIGN OUT
        </button>

      </section>
    `;


  document
    .querySelector(
      '#denied-signout'
    )
    .onclick =
      () => signOut(auth);

}


// ======================================================
// VERIFY SUPER ADMIN
// ======================================================

async function verifyAdmin(user) {

  const adminRef =
    doc(
      db,
      'admins',
      user.uid
    );


  const snapshot =
    await getDoc(
      adminRef
    );


  if (!snapshot.exists()) {
    return false;
  }


  const data =
    snapshot.data();


  return (
    data.active === true &&
    data.role === 'ADMIN'
  );

}


// ======================================================
// LOAD COMMAND-CENTRE COUNTS
// ======================================================

async function loadOverview() {

  // SARLAYASH_EMAIL_COUNT_V1

  const [
    assessmentSnapshot,
    missionUserSnapshot,
    assignmentSnapshot,
    emailAuditSnapshot
  ] = await Promise.all([

    getDocs(
      collection(
        db,
        'day2_responses'
      )
    ),

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
    ),

    getDocs(
      collection(
        db,
        'email_audit'
      )
    )

  ]);


  const assessments =
    assessmentSnapshot.docs.map(
      snapshot => ({
        id: snapshot.id,
        ...snapshot.data()
      })
    );


  const missionUsers =
    missionUserSnapshot.docs.map(
      snapshot => ({
        id: snapshot.id,
        ...snapshot.data()
      })
    );


  const assignments =
    assignmentSnapshot.docs.map(
      snapshot => ({
        id: snapshot.id,
        ...snapshot.data()
      })
    );


  const approvedForDay3 =
    assessments.filter(
      record =>
        record.adminReview
          ?.day3Status ===
        'APPROVED'
    ).length;


  const awaitingOnboardingReview =
    assessments.filter(
      record =>
        !record.adminReview
          ?.day3Status ||
        record.adminReview
          ?.day3Status ===
          'PENDING'
    ).length;


  const missionReviewsPending =
    assignments.filter(
      assignment =>
        assignment.status ===
          'SUBMITTED' &&
        assignment.reviewStatus ===
          'PENDING'
    ).length;


  const approvedMissionHours =
    assignments.filter(
      assignment =>
        assignment.reviewStatus ===
        'APPROVED'
    ).length;


  return {

    assessments:
      assessments.length,

    awaitingOnboardingReview,

    approvedForDay3,

    missionLearners:
      missionUsers.length,

    missionReviewsPending,

    approvedMissionHours,

    emailsSent:
      emailAuditSnapshot.size

  };

}


// ======================================================
// SUPER ADMIN HOME
// ======================================================

async function superAdminHome() {

  root.innerHTML =
    header() +
    `
      <section class="review-page">

        <p class="eyebrow">
          SARLAYASH JOURNEY OPERATING SYSTEM
        </p>


        <h2>
          Super Admin
          <em>Command Centre.</em>
        </h2>


        <p class="intro">
          One control plane for the complete Journey —
          assessment, human review,
          Day 3 admission and Mission progression.
        </p>


        <div id="super-overview">
          Loading Journey intelligence…
        </div>

      </section>
    `;


  try {

    const overview =
      await loadOverview();


    drawSuperAdminHome(
      overview
    );

  } catch (error) {

    console.error(error);


    document
      .querySelector(
        '#super-overview'
      )
      .innerHTML =
        `
          <p class="quiet">
            Unable to load Super Admin data.
            Check Firestore permissions
            and try again.
          </p>
        `;

  }

}


// ======================================================
// DRAW SUPER ADMIN HOME
// ======================================================

function drawSuperAdminHome(
  overview
) {

  const board =
    document.querySelector(
      '#super-overview'
    );


  if (!board) {
    return;
  }


  board.innerHTML =
    `

      <div class="metrics">

        <article>

          <small>
            JOURNEYS STARTED
          </small>

          <b>
            ${overview.assessments}
          </b>

        </article>


        <article>

          <small>
            AWAITING ENTRY REVIEW
          </small>

          <b>
            ${overview.awaitingOnboardingReview}
          </b>

        </article>


        <article>

          <small>
            DAY 3 APPROVED
          </small>

          <b>
            ${overview.approvedForDay3}
          </b>

        </article>


        <article>

          <small>
            ACTIVE MISSION LEARNERS
          </small>

          <b>
            ${overview.missionLearners}
          </b>

        </article>


        <article>

          <small>
            EMAILS SENT
          </small>

          <strong>
            ${overview.emailsSent}
          </strong>

        </article>

      </div>


      <h3 class="section-title">
        COMMAND CENTRE
      </h3>


      <div class="directions">


        <article>

          <small>
            CONTROL 01
          </small>


          <h3>
            Onboarding Control
          </h3>


          <p>
            Review every learner who has completed
            the 10-question Journey assessment.
            Human approval is the gate into Day 3.
          </p>


          <p>

            <strong>
              Awaiting Review:
            </strong>

            ${overview.awaitingOnboardingReview}

          </p>


          <p>

            <strong>
              Approved for Day 3:
            </strong>

            ${overview.approvedForDay3}

          </p>


          <button
            class="gold"
            id="open-onboarding"
          >
            OPEN ONBOARDING CONTROL →
          </button>

        </article>


        <article>

          <small>
            CONTROL 02
          </small>


          <h3>
            Mission Control
          </h3>


          <p>
            Operate Day 3 Hours 01–16.
            Review LinkedIn evidence,
            approve progression and
            return work for revision.
          </p>


          <p>

            <strong>
              Mission Learners:
            </strong>

            ${overview.missionLearners}

          </p>


          <p>

            <strong>
              Evidence Awaiting Review:
            </strong>

            ${overview.missionReviewsPending}

          </p>


          <button
            class="gold"
            id="open-mission"
          >
            OPEN MISSION CONTROL →
          </button>

        </article>

    <article>

      <small>
        CONTROL 03
      </small>

      <h3>
        Lead & Offer Control
      </h3>

      <p>
        Review prospective learners from the
        SarlaYash recruitment pipeline and
        manage offer decisions from one
        controlled workspace.
      </p>

      <p>

        <strong>
          Source:
        </strong>

        Google Sheet — Form Responses 1

      </p>

      <p>

        <strong>
          Decision Mode:
        </strong>

        Read-only verification

      </p>

      <button
        class="gold"
        id="open-lead-offer"
      >
        OPEN LEAD & OFFER CONTROL →
      </button>

    </article>
        <article>

          <small>
            SYSTEM INTELLIGENCE
          </small>


          <h3>
            Journey Pipeline
          </h3>


          <p>
            Assessment → Super Admin Review →
            Day 3 Admission → Hour 01–16 →
            Evidence → Human Review.
          </p>


          <p>

            <strong>
              Approved Mission Hours:
            </strong>

            ${overview.approvedMissionHours}

          </p>


          <button
            class="ghost"
            id="refresh-super"
          >
            REFRESH DASHBOARD
          </button>

        </article>

      </div>


      <div
        class="toolbar"
        style="margin-top:40px"
      >

        <div>

          <small>
            SIGNED IN AS
          </small>

          <br>

          <strong>
            ${currentAdmin?.email || '—'}
          </strong>

        </div>


        <button
          class="ghost"
          id="super-signout"
        >
          SIGN OUT
        </button>

      </div>
    `;


  document
    .querySelector(
      '#open-onboarding'
    )
    .onclick =
      () =>
        showOnboardingControl(
          root
        );


  document
    .querySelector(
      '#open-mission'
    )
    .onclick =
      () =>
        showMissionControl(
          root,
          currentAdmin
        );

document
  .querySelector(
    '#open-lead-offer'
  )
  .onclick =
  () =>
    showLeadOfferControl(
      root
    );
  document
    .querySelector(
      '#refresh-super'
    )
    .onclick =
      superAdminHome;


  document
    .querySelector(
      '#super-signout'
    )
    .onclick =
      () => signOut(auth);

}


// ======================================================
// CHILD MODULE → SUPER ADMIN HOME
// ======================================================

window.addEventListener(
  'sarlayash:super-admin-home',
  () => {

    if (currentAdmin) {
      superAdminHome();
    }

  }
);


// ======================================================
// FIREBASE BOOT
// ======================================================

if (!firebaseReady) {

  root.innerHTML =
    header() +
    `
      <section class="form-page">

        <p class="eyebrow">
          CONFIGURATION REQUIRED
        </p>

        <h2>
          Connect
          <em>Firebase.</em>
        </h2>

        <p class="intro">
          Firebase configuration
          is unavailable.
        </p>

      </section>
    `;

} else {

  onAuthStateChanged(
    auth,
    async user => {

      if (!user) {

        currentAdmin = null;

        login();

        return;

      }


      try {

        const authorised =
          await verifyAdmin(
            user
          );


        if (!authorised) {

          currentAdmin = null;

          accessDenied();

          return;

        }


        currentAdmin =
          user;


        await superAdminHome();

      } catch (error) {

        console.error(error);

        currentAdmin = null;

        accessDenied();

      }

    }
  );

}