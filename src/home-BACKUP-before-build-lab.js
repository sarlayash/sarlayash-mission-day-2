// ======================================================
// SARLAYASH LIVE DIGITAL ECOSYSTEM GATEWAY
// Copyright SarlaYash Mission 2026
// ======================================================

const root =
  document.querySelector('#home-app');


// ======================================================
// ECOSYSTEM DIRECTORY
// ======================================================

const ecosystem = [

  {
    name: 'SarlaYash Official',
    description:
      'Official digital home of SarlaYash Learning Solutions LLP.',
    url: 'https://sarlayash.com/'
  },

  {
    name: 'SarlaYash Official — WWW',
    description:
      'Primary www gateway to the SarlaYash ecosystem.',
    url: 'https://www.sarlayash.com/'
  },

  {
    name: 'SYAAAS',
    description:
      'Explore the SarlaYash learning and services ecosystem.',
    url: 'https://www.syaaas.sarlayash.com/'
  },

  {
    name: 'Live DSA Seeds',
    description:
      'Hands-on Data Structures and Algorithms learning environment.',
    url: 'https://livedsaseedsa.sarlayash.com/'
  },

  {
    name: 'Java DSA',
    description:
      'Java and Data Structures & Algorithms learning journey.',
    url: 'https://javadsa.sarlayash.com/'
  },

  {
    name: 'Python With Kapil',
    description:
      'Applied Python learning ecosystem powered by hands-on practice.',
    url: 'https://pythonwithkapil.sarlayash.com/'
  },

  {
    name: 'SarlaYash Certify',
    description:
      'SarlaYash certification and digital credential ecosystem.',
    url: 'https://sarlayashcertify.sarlayash.com/'
  },

  {
    name: 'SarlaYash Mission',
    description:
      'Enter the Mission-based learning, evidence and progression environment.',
    url: '/mission.html'
  },

  {
    name: 'Talent & Domain Discovery',
    description:
      'Begin the SarlaYash Day 2 talent and domain discovery assessment.',
    url: '/assessment.html'
  }

];


// ======================================================
// CLOCK CONFIGURATION
// ======================================================

const clocks = [

  {
    id: 'india',
    city: 'INDIA · IST',
    zone: 'Asia/Kolkata',
    primary: true
  },

  {
    id: 'london',
    city: 'LONDON',
    zone: 'Europe/London'
  },

  {
    id: 'new-york',
    city: 'NEW YORK',
    zone: 'America/New_York'
  },

  {
    id: 'dubai',
    city: 'DUBAI',
    zone: 'Asia/Dubai'
  },

  {
    id: 'singapore',
    city: 'SINGAPORE',
    zone: 'Asia/Singapore'
  }

];


// ======================================================
// HTML HELPERS
// ======================================================

function ecosystemCards() {

  return ecosystem
    .map(
      (item, index) => `

        <a
          class="ecosystem-card"
          href="${item.url}"
          ${
            item.url.startsWith('http')
              ? 'target="_blank" rel="noopener noreferrer"'
              : ''
          }
        >

          <span class="card-number">
            ${String(index + 1).padStart(2, '0')}
          </span>

          <h3>
            ${item.name}
          </h3>

          <p>
            ${item.description}
          </p>

        </a>

      `
    )
    .join('');

}


function clockCards() {

  return clocks
    .map(
      clock => `

        <article
          class="clock-card ${
            clock.primary
              ? 'primary'
              : ''
          }"
        >

          <div class="clock-city">
            ${clock.city}
          </div>

          <div
            class="clock-time"
            id="clock-${clock.id}"
          >
            --:--:--
          </div>

          <div
            class="clock-date"
            id="date-${clock.id}"
          >
            Synchronising...
          </div>

        </article>

      `
    )
    .join('');

}


// ======================================================
// PAGE RENDER
// ======================================================

function renderHome() {

  root.innerHTML = `

    <div class="home-shell">


      <!-- ==============================================
           COMMAND BAR
           ============================================== -->

      <div class="command-bar">

        <div class="command-brand">
          SARLAYASH · DIGITAL ECOSYSTEM
        </div>

        <div class="live-status">
          <span class="live-dot"></span>
          LIVE
        </div>

      </div>


      <!-- ==============================================
           HERO
           ============================================== -->

      <section class="hero">

        <img
          class="hero-logo"
          src="/assets/sarlayash-logo.png"
          alt="SarlaYash Learning Solutions LLP"
        />

        <p class="hero-kicker">
          SARLAYASH LEARNING SOLUTIONS LLP
        </p>

        <h1>
          One Digital
          <em>Ecosystem.</em>
        </h1>

        <p class="hero-lead">
          Learning, missions, assessments, credentials
          and applied career journeys connected through
          one SarlaYash gateway.
        </p>

        <p class="hero-tagline">
          Legacy of Values. Future of Learning.
        </p>


        <div class="primary-actions">

          <a
            class="action action-primary"
            href="/assessment.html"
          >
            BEGIN ASSESSMENT
          </a>

          <a
            class="action action-secondary"
            href="/mission.html"
          >
            ENTER SARLAYASH MISSION
          </a>

          <a
            class="action action-admin"
            href="/admin.html"
          >
            SUPER ADMIN
          </a>

        </div>

      </section>


      <!-- ==============================================
           WISH TO JOIN SARLAYASH
           ============================================== -->

      <section class="section join-section">

        <div class="join-intro">

          <p class="section-label">
            WISH TO JOIN US?
          </p>

          <h2>
            Your SarlaYash Journey
            <em>Starts With Intent.</em>
          </h2>

          <p class="join-lead">
            We do not begin with a conventional registration.
            We begin by understanding you, introducing you to
            the SarlaYash way of learning, and seeing your
            willingness to take the first step.
          </p>

        </div>


        <div class="join-path">

          <article class="join-step">

            <span class="join-number">01</span>

            <div>
              <small>DISCOVER</small>

              <h3>
                Know Me First | SarlaYash Mission
              </h3>

              <p>
                Tell us about yourself, your aspirations and
                why you wish to become part of the SarlaYash
                learning ecosystem.
              </p>

              <a
                class="join-link"
                href="https://forms.gle/d6cvX9bpV3SAiCcu9"
                target="_blank"
                rel="noopener noreferrer"
              >
                KNOW ME FIRST →
              </a>
            </div>

          </article>


          <article class="join-step">

            <span class="join-number">02</span>

            <div>
              <small>EXPERIENCE</small>

              <h3>
                Your First Day Starts Here.
              </h3>

              <p>
                Experience SarlaYash before asking to join.
                Complete the Day 1 onboarding journey and
                understand how our learning culture works.
              </p>

              <a
                class="join-link"
                href="https://sarlayash.github.io/SarlaYash_Onboarding_Day1/"
                target="_blank"
                rel="noopener noreferrer"
              >
                START DAY 1 →
              </a>
            </div>

          </article>


          <article class="join-step">

            <span class="join-number">03</span>

            <div>
              <small>CONFIRM</small>

              <h3>
                Share Your Completion.
              </h3>

              <p>
                After completing the required journey,
                share your confirmation with the SarlaYash
                team for consideration.
              </p>

              <a
                class="join-link"
                href="mailto:namaste@sarlayash.com?subject=SarlaYash%20Mission%20-%20Journey%20Completion"
              >
                NAMASTE@SARLAYASH.COM →
              </a>
            </div>

          </article>

        </div>


        <div class="join-gate">

          <div class="join-gate-mark">
            SY
          </div>

          <div>

            <small>
              SARLAYASH OPPORTUNITY GATE
            </small>

            <strong>
              Completion creates eligibility for consideration —
              not automatic entry.
            </strong>

            <p>
              Only candidates who complete the required journey
              and share their confirmation with
              namaste@sarlayash.com will be considered for an
              opportunity to enter SarlaYash Mission.
            </p>

          </div>

        </div>


        <div class="social-connect">

          <div>

            <small>
              CONNECT WITH THE ECOSYSTEM
            </small>

            <h3>
              Follow the people and mission behind SarlaYash.
            </h3>

          </div>

          <div class="social-actions">

            <a
              href="https://www.linkedin.com/in/kapil-narula-63447026/"
              target="_blank"
              rel="noopener noreferrer"
            >
              KAPIL NARULA · LINKEDIN ↗
            </a>

            <a
              href="https://www.linkedin.com/company/sarlayash-learning-solutions-llp-001/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              SARLAYASH · LINKEDIN ↗
            </a>

          </div>

        </div>

      </section>



      <!-- ==============================================
           GLOBAL TIME DESK
           ============================================== -->

      <section class="section">

        <div class="section-head">

          <div>

            <p class="section-label">
              LIVE · GLOBAL TIME DESK
            </p>

            <h2>
              SarlaYash Around the World
            </h2>

          </div>

          <p class="section-description">
            India Standard Time anchors the ecosystem,
            accompanied by four global business clocks.
          </p>

        </div>


        <div class="clock-grid">

          ${clockCards()}

        </div>

      </section>


      <!-- ==============================================
           ECOSYSTEM DIRECTORY
           ============================================== -->

      <section class="section">

        <div class="section-head">

          <div>

            <p class="section-label">
              DIGITAL DIRECTORY
            </p>

            <h2>
              Explore the Ecosystem
            </h2>

          </div>

          <p class="section-description">
            One gateway to SarlaYash learning,
            assessment, Mission and credential
            experiences.
          </p>

        </div>


        <div class="ecosystem-grid">

          ${ecosystemCards()}

        </div>

      </section>


      <!-- ==============================================
           LIVE ECOSYSTEM STATUS
           ============================================== -->

      <section class="section">

        <div class="section-head">

          <div>

            <p class="section-label">
              LIVE · ECOSYSTEM STATUS
            </p>

            <h2>
              Digital Footprint
            </h2>

          </div>

          <p class="section-description">
            Live gateway status and ecosystem
            engagement intelligence.
          </p>

        </div>


        <div class="live-metrics">

          <article class="metric">

            <small>
              GATEWAY STATUS
            </small>

            <strong>
              ● LIVE
            </strong>

            <div class="metric-note">
              SarlaYash Digital Ecosystem Gateway
            </div>

          </article>


          <article class="metric">

            <small>
              ECOSYSTEM VISITS
            </small>

            <strong id="visitor-count">
              —
            </strong>

            <div
              class="metric-note"
              id="visitor-note"
            >
              Persistent visitor intelligence
              will be activated securely.
            </div>

          </article>

        </div>

      </section>


      <!-- ==============================================
           LEADERSHIP & CONTACT
           ============================================== -->

      <section class="section">

        <div class="section-head">

          <div>

            <p class="section-label">
              LEADERSHIP & CONTACT
            </p>

            <h2>
              Connect With SarlaYash
            </h2>

          </div>

        </div>


        <div class="leadership">

          <div>

            <h3 class="leader-name">
              Kapil Narula
            </h3>

            <div class="leader-role">
              CEO | Founder
            </div>

          </div>


          <div class="contact-grid">

            <div class="contact-item">

              <small>
                PHONE
              </small>

              <a href="tel:+919873152277">
                +91 98731 52277
              </a>

            </div>


            <div class="contact-item">

              <small>
                EMAIL
              </small>

              <a
                href="mailto:namaste@sarlayash.com"
              >
                namaste@sarlayash.com
              </a>

            </div>

          </div>

        </div>

      </section>


      <!-- ==============================================
           FOOTER
           ============================================== -->

      <footer class="home-footer">

        <div class="footer-brand">
          SarlaYash Learning Solutions LLP
        </div>

        <div class="footer-tagline">
          Legacy of Values. Future of Learning.
        </div>

        <div class="footer-copy">
          © 2026 SARLAYASH MISSION 2026 ·
          ALL RIGHTS RESERVED
        </div>

      </footer>


    </div>

  `;


  startClocks();

}


// ======================================================
// LIVE WORLD CLOCK ENGINE
// ======================================================

function formatTime(
  date,
  timeZone
) {

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
  ).format(date);

}


function formatDate(
  date,
  timeZone
) {

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      timeZone,
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  ).format(date);

}


function updateClocks() {

  const now =
    new Date();


  clocks.forEach(
    clock => {

      const timeElement =
        document.querySelector(
          `#clock-${clock.id}`
        );


      const dateElement =
        document.querySelector(
          `#date-${clock.id}`
        );


      if (
        !timeElement ||
        !dateElement
      ) {
        return;
      }


      timeElement.textContent =
        formatTime(
          now,
          clock.zone
        );


      dateElement.textContent =
        formatDate(
          now,
          clock.zone
        );

    }
  );

}


function startClocks() {

  updateClocks();

  window.setInterval(
    updateClocks,
    1000
  );

}


// ======================================================
// START
// ======================================================

renderHome();