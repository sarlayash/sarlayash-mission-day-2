import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const root = document.querySelector('#mission-app');

function showLogin() {
  root.innerHTML = `
    <main class="mission-login">

      <div class="mission-brand">
        SARLAYASH MISSION
      </div>

      <section class="login-card">

        <p class="eyebrow">YOUR JOURNEY BEGINS HERE</p>

        <h1>
          Enter Your
          <em>Mission.</em>
        </h1>

        <p class="intro">
          Your Journey ID is your identity inside the SarlaYash Mission.
        </p>

        <form id="mission-login">

          <label>
            JOURNEY ID
            <input
              type="text"
              name="journeyId"
              placeholder="SYM-D2-2026-XXXX"
              required
            >
          </label>

          <label>
            PASSWORD
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
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

  document.querySelector('#mission-login').onsubmit = async (e) => {

    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    const journeyId = data.journeyId.trim().toUpperCase();

    /*
      Firebase Authentication requires an email internally.

      Interns will NEVER need to know this.

      Example:
      SYM-D2-2026-8825
      becomes internally:
      sym-d2-2026-8825@mission.sarlayash.com
    */

    const internalEmail =
      journeyId.toLowerCase() + '@mission.sarlayash.com';

    const message =
      document.querySelector('#login-message');

    message.textContent = 'Verifying Journey ID...';

    try {

      await signInWithEmailAndPassword(
        auth,
        internalEmail,
        data.password
      );

    } catch (error) {

      console.error(error);

      message.textContent =
        'Journey ID or password is incorrect.';

    }

  };
}


function showMission(user) {

  const journeyId =
    user.email
      .replace('@mission.sarlayash.com', '')
      .toUpperCase();

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
          <em>${journeyId}</em>
        </h1>

        <p>
          Your Month 01 journey will appear here.
        </p>

      </section>

    </main>

  `;

  document.querySelector('#logout').onclick =
    () => signOut(auth);

}


onAuthStateChanged(auth, (user) => {

  if (user) {

    showMission(user);

  } else {

    showLogin();

  }

});