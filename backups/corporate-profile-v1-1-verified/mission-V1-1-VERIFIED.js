import { auth, db } from './firebase.js';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

import {
  achievementBadgeVaultMarkup,
  bindAchievementBadgeVault
} from './mission-badges.js';

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
// SARLAYASH CORPORATE PROFILE V1
// Professional identity enrichment.
// Official Mission identity remains system controlled.
// ======================================================

function corporateProfileMarkup(student) {

  const profile =
    student?.professionalProfile || {};

  const skills =
    Array.isArray(profile.skills)
      ? profile.skills.join(', ')
      : '';

  const domains =
    Array.isArray(profile.domainsOfInterest)
      ? profile.domainsOfInterest.join(', ')
      : '';

  return `

    <section class="corporate-profile">

      <div class="corporate-profile-heading">

        <div>
          <p class="eyebrow">
            MY PROFESSIONAL IDENTITY
          </p>

          <h2>
            SarlaYash
            <em>Corporate Profile.</em>
          </h2>

          <p class="corporate-profile-intro">
            Build your professional presence while your
            verified SarlaYash identity remains protected.
          </p>
        </div>

        <div class="corporate-profile-lock">
          <span>●</span>
          VERIFIED IDENTITY
        </div>

      </div>


      <div class="corporate-identity-grid">

        <div class="corporate-identity-item">
          <small>FULL NAME · LOCKED</small>
          <strong>${esc(student.name || '—')}</strong>
        </div>

        <div class="corporate-identity-item">
          <small>JOURNEY ID · LOCKED</small>
          <strong>${esc(student.journeyId || '—')}</strong>
        </div>

        <div class="corporate-identity-item">
          <small>REGISTERED EMAIL · LOCKED</small>
          <strong>${esc(student.authEmail || '—')}</strong>
        </div>

        <div class="corporate-identity-item">
          <small>COURSE · LOCKED</small>
          <strong>${esc(student.course || '—')}</strong>
        </div>

        <div class="corporate-identity-item">
          <small>MONTH · LOCKED</small>
          <strong>${esc(student.month || '—')}</strong>
        </div>

      </div>


      <div class="corporate-profile-completeness">

        <div>
          <small>PROFILE COMPLETENESS</small>
          <strong data-profile-percent>0%</strong>
        </div>

        <div
          class="corporate-profile-progress"
          aria-label="Professional profile completeness"
        >
          <span data-profile-progress></span>
        </div>

      </div>


      <form
        class="corporate-profile-form"
        data-corporate-profile-form
      >

        <div class="corporate-profile-section-title">
          PROFESSIONAL DETAILS
        </div>


        <div class="corporate-profile-fields">

          <label>
            MOBILE NUMBER
            <input
              type="tel"
              name="mobile"
              maxlength="20"
              autocomplete="tel"
              value="${esc(profile.mobile || '')}"
              placeholder="Professional contact number"
            >
          </label>


          <label>
            CITY / LOCATION
            <input
              type="text"
              name="city"
              maxlength="80"
              autocomplete="address-level2"
              value="${esc(profile.city || '')}"
              placeholder="City"
            >
          </label>


          <label class="corporate-profile-wide">
            PROFESSIONAL HEADLINE
            <input
              type="text"
              name="headline"
              maxlength="160"
              value="${esc(profile.headline || '')}"
              placeholder="Example: Java Developer · AI Learner · Problem Solver"
            >
          </label>


          <label class="corporate-profile-wide">
            ABOUT ME
            <textarea
              name="about"
              maxlength="1200"
              rows="5"
              placeholder="Write a concise professional introduction."
            >${esc(profile.about || '')}</textarea>
          </label>

        </div>


        <div class="corporate-profile-section-title">
          PROFESSIONAL PRESENCE
        </div>


        <div class="corporate-profile-fields">

          <label>
            LINKEDIN
            <input
              type="url"
              name="linkedinUrl"
              maxlength="300"
              value="${esc(profile.linkedinUrl || '')}"
              placeholder="https://www.linkedin.com/in/..."
            >
          </label>


          <label>
            GITHUB
            <input
              type="url"
              name="githubUrl"
              maxlength="300"
              value="${esc(profile.githubUrl || '')}"
              placeholder="https://github.com/..."
            >
          </label>


          <label class="corporate-profile-wide">
            PORTFOLIO / WEBSITE
            <input
              type="url"
              name="portfolioUrl"
              maxlength="300"
              value="${esc(profile.portfolioUrl || '')}"
              placeholder="https://..."
            >
          </label>


          <label class="corporate-profile-wide">
            SKILLS
            <input
              type="text"
              name="skills"
              maxlength="500"
              value="${esc(skills)}"
              placeholder="Java, Python, DSA, Power BI..."
            >
            <small>
              Separate skills with commas.
            </small>
          </label>


          <label class="corporate-profile-wide">
            DOMAINS OF INTEREST
            <input
              type="text"
              name="domainsOfInterest"
              maxlength="500"
              value="${esc(domains)}"
              placeholder="Artificial Intelligence, Cloud, Data Analytics..."
            >
            <small>
              Separate domains with commas.
            </small>
          </label>

        </div>


        <div class="corporate-profile-section-title">
          CAREER ASSETS
        </div>


        <div class="corporate-assets-grid">

          <article>
            <small>PROFILE PHOTO</small>
            <strong>Professional Portrait</strong>
            <input
  type="url"
  name="profilePhotoURL"
  maxlength="500"
  value="${esc(profile.profilePhotoURL || '')}"
  placeholder="https://..."
>
          </article>

          <article>
            <small>RESUME</small>
            <strong>PDF Resume</strong>
            <input
  type="url"
  name="resumeURL"
  maxlength="500"
  value="${esc(profile.resumeURL || '')}"
  placeholder="Google Drive / OneDrive / Resume URL"
>
          </article>

        </div>


        <p class="corporate-profile-privacy">
          Professional information only. Government and
          financial identity documents are not collected here.
        </p>


        <button
          type="submit"
          class="corporate-profile-save"
        >
          SAVE PROFESSIONAL PROFILE
        </button>


        <p
          class="corporate-profile-message"
          data-corporate-profile-message
          aria-live="polite"
        ></p>

      </form>

    </section>

  `;

}


// ======================================================
// SARLAYASH CORPORATE PROFILE V1 CONTROLLER
// Validation + completeness + secure Firestore update.
// ======================================================

function bindCorporateProfile(student) {

  const form =
    document.querySelector(
      '[data-corporate-profile-form]'
    );

  if (!form) {
    return;
  }


  const message =
    form.querySelector(
      '[data-corporate-profile-message]'
    );

  const percentNode =
    document.querySelector(
      '[data-profile-percent]'
    );

  const progressNode =
    document.querySelector(
      '[data-profile-progress]'
    );

  const saveButton =
    form.querySelector(
      '.corporate-profile-save'
    );


  // ----------------------------------------------------
  // HELPERS
  // ----------------------------------------------------

  const valueOf = name => {

    const field =
      form.elements.namedItem(name);

    return String(
      field?.value || ''
    ).trim();

  };


  const listOf = name =>
    valueOf(name)
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);


  const validHttpUrl = value => {

    if (!value) {
      return true;
    }

    try {

      const url =
        new URL(value);

      return (
        url.protocol === 'https:' ||
        url.protocol === 'http:'
      );

    } catch {
      return false;
    }

  };


  const validDomainUrl = (
    value,
    domain
  ) => {

    if (!value) {
      return true;
    }

    try {

      const url =
        new URL(value);

      const hostname =
        url.hostname
          .toLowerCase()
          .replace(/^www\./, '');

      return (
        (
          url.protocol === 'https:' ||
          url.protocol === 'http:'
        ) &&
        (
          hostname === domain ||
          hostname.endsWith(
            `.${domain}`
          )
        )
      );

    } catch {
      return false;
    }

  };


  // ----------------------------------------------------
  // PROFILE COMPLETENESS
  // ----------------------------------------------------

  const updateCompleteness = () => {

    const values = [

      valueOf('mobile'),
      valueOf('city'),
      valueOf('headline'),
      valueOf('about'),
      valueOf('linkedinUrl'),
      valueOf('githubUrl'),
      valueOf('portfolioUrl'),
      valueOf('skills'),
      valueOf('domainsOfInterest'),
      valueOf('profilePhotoURL'),
      valueOf('resumeURL')

    ];


    const completed =
      values.filter(Boolean).length;


    const percentage =
      Math.round(
        (
          completed /
          values.length
        ) * 100
      );


    if (percentNode) {
      percentNode.textContent =
        `${percentage}%`;
    }


    if (progressNode) {
      progressNode.style.width =
        `${percentage}%`;
    }

  };


  updateCompleteness();


  form.addEventListener(
    'input',
    updateCompleteness
  );


  // ----------------------------------------------------
  // SAVE PROFILE
  // ----------------------------------------------------

  form.addEventListener(
    'submit',
    async event => {

      event.preventDefault();


      if (!student?.documentId) {

        if (message) {
          message.textContent =
            'Unable to identify your Mission profile.';
        }

        return;

      }


      const mobile =
        valueOf('mobile');

      const city =
        valueOf('city');

      const headline =
        valueOf('headline');

      const about =
        valueOf('about');

      const linkedinUrl =
        valueOf('linkedinUrl');

      const githubUrl =
        valueOf('githubUrl');

      const portfolioUrl =
        valueOf('portfolioUrl');

      const profilePhotoURL =
        valueOf('profilePhotoURL');

      const resumeURL =
        valueOf('resumeURL');

      const skills =
        listOf('skills');

      const domainsOfInterest =
        listOf(
          'domainsOfInterest'
        );


      // ------------------------------------------------
      // VALIDATION
      // ------------------------------------------------

      const mobileDigits =
        mobile.replace(/\D/g, '');


      if (
        mobile &&
        (
          mobileDigits.length < 7 ||
          mobileDigits.length > 15
        )
      ) {

        if (message) {
          message.textContent =
            'Please enter a valid mobile number.';
        }

        return;

      }


      if (
        !validDomainUrl(
          linkedinUrl,
          'linkedin.com'
        )
      ) {

        if (message) {
          message.textContent =
            'Please enter a valid LinkedIn URL.';
        }

        return;

      }


      if (
        !validDomainUrl(
          githubUrl,
          'github.com'
        )
      ) {

        if (message) {
          message.textContent =
            'Please enter a valid GitHub URL.';
        }

        return;

      }


      if (
        !validHttpUrl(
          portfolioUrl
        )
      ) {

        if (message) {
          message.textContent =
            'Please enter a valid portfolio URL.';
        }

        return;

      }


      if (!validHttpUrl(profilePhotoURL)) {
        if (message) {
          message.textContent = 'Please enter a valid profile photo URL.';
        }
        return;
      }

      if (!validHttpUrl(resumeURL)) {
        if (message) {
          message.textContent = 'Please enter a valid resume URL.';
        }
        return;
      }

      if (
        headline.length > 160 ||
        about.length > 1200
      ) {

        if (message) {
          message.textContent =
            'Please review the profile text limits.';
        }

        return;

      }


      const professionalProfile = {

        mobile,
        city,
        headline,
        about,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        skills,
        domainsOfInterest,

        profilePhotoURL,
        resumeURL,
        updatedAt:
          serverTimestamp()

      };


      if (saveButton) {

        saveButton.disabled =
          true;

        saveButton.textContent =
          'SAVING PROFILE...';

      }


      if (message) {
        message.textContent =
          'Updating your professional profile...';
      }


      try {

        const userReference =
          doc(
            db,
            'mission_users',
            student.documentId
          );


        await updateDoc(
          userReference,
          {
            professionalProfile
          }
        );


        student.professionalProfile = {
          ...professionalProfile,
          updatedAt:
            new Date()
        };


        if (message) {
          message.textContent =
            'PROFILE UPDATED SUCCESSFULLY';
        }


        updateCompleteness();


      } catch (error) {

        console.error(
          'Corporate Profile Update Error:',
          error
        );


        if (message) {
          message.textContent =
            'Profile could not be updated. Please try again.';
        }


      } finally {

        if (saveButton) {

          saveButton.disabled =
            false;

          saveButton.textContent =
            'SAVE PROFESSIONAL PROFILE';

        }

      }

    }
  );

}


// ======================================================
// DAY 1 CREDENTIAL VAULT
// Journey ID is generated only after Day 1 onboarding.
// Mission hours are intentionally NOT checked.
// ======================================================

const DAY1_JOB_TITLE =
  'Plug-And-Play Learning Engineer - L1';

const DAY1_ISSUER =
  'SarlaYash Learning Solutions LLP';


function day1CredentialId(student) {

  return `SYM-ONB-L1-${String(
    student?.journeyId || ''
  ).trim().toUpperCase()}`;

}


function day1VerificationUrl(student) {

  return `${window.location.origin}/verify.html?id=${
    encodeURIComponent(day1CredentialId(student))
  }`;

}


function credentialVaultMarkup(student) {

  if (!student?.name || !student?.journeyId) {
    return '';
  }

  const credentialId =
    day1CredentialId(student);

  return `

    <section class="credential-vault">

      <div class="credential-vault-top">

        <div>
          <p class="eyebrow">
            SARLAYASH CREDENTIAL VAULT
          </p>

          <h2>
            Day 1
            <em>Onboarding Credential.</em>
          </h2>
        </div>

        <span class="credential-status">
          ELIGIBLE
        </span>

      </div>

      <div class="credential-vault-grid">

        <div class="credential-vault-logo">
          <img
            src="/assets/sarlayash-logo.png"
            alt="SarlaYash Learning Solutions LLP"
          >
        </div>

        <div class="credential-vault-details">

          <small>CREDENTIAL</small>
          <strong>Day 1 Onboarding</strong>

          <small>LEARNER</small>
          <strong>${esc(student.name)}</strong>

          <small>JOB TITLE</small>
          <strong>${esc(DAY1_JOB_TITLE)}</strong>

          <small>JOURNEY ID</small>
          <strong>${esc(student.journeyId)}</strong>

          <small>CREDENTIAL ID</small>
          <strong class="credential-code">
            ${esc(credentialId)}
          </strong>

        </div>

      </div>

      <p class="credential-vault-note">
        Your Journey ID was created after successful
        Day 1 onboarding and makes this credential
        available to you.
      </p>

      <button
        type="button"
        class="credential-download"
        data-day1-certificate
      >
        DOWNLOAD DAY 1 CERTIFICATE
      </button>

      <p
        class="credential-message"
        data-credential-message
        aria-live="polite"
      ></p>

    </section>

  `;

}


function bindCredentialVault(student) {

  const button =
    document.querySelector(
      '[data-day1-certificate]'
    );

  if (!button) {
    return;
  }

  button.onclick =
    async () => {

      const message =
        document.querySelector(
          '[data-credential-message]'
        );

      button.disabled = true;
      button.textContent =
        'GENERATING CERTIFICATE...';

      if (message) {
        message.textContent =
          'Preparing your Day 1 credential.';
      }

      try {

        await generateDay1Credential(student);

        if (message) {
          message.textContent =
            'Certificate generated successfully.';
        }

      } catch (error) {

        console.error(
          'Credential Generation Error:',
          error
        );

        if (message) {
          message.textContent =
            'Certificate could not be generated. Please try again.';
        }

      } finally {

        button.disabled = false;
        button.textContent =
          'DOWNLOAD DAY 1 CERTIFICATE';

      }

    };

}


function loadCredentialImage(url) {

  return new Promise(
    (resolve, reject) => {

      const image = new Image();

      image.onload =
        () => resolve(image);

      image.onerror =
        () => reject(
          new Error(
            'Credential logo could not be loaded.'
          )
        );

      image.src = url;

    }
  );

}


async function generateDay1Credential(student) {

  if (!student?.name || !student?.journeyId) {
    throw new Error(
      'Learner credential identity is incomplete.'
    );
  }

  const credentialId =
    day1CredentialId(student);

  const verificationUrl =
    day1VerificationUrl(student);

  const qrDataUrl =
    await QRCode.toDataURL(
      verificationUrl,
      {
        width: 420,
        margin: 1,
        errorCorrectionLevel: 'H'
      }
    );

  const logo =
    await loadCredentialImage(
      '/assets/sarlayash-logo.png'
    );

  const pdf =
    new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

  const width =
    pdf.internal.pageSize.getWidth();

  const height =
    pdf.internal.pageSize.getHeight();

  pdf.setFillColor(5, 5, 5);
  pdf.rect(0, 0, width, height, 'F');

  pdf.setDrawColor(201, 164, 82);
  pdf.setLineWidth(1.2);
  pdf.rect(8, 8, width - 16, height - 16);

  pdf.setDrawColor(112, 88, 40);
  pdf.setLineWidth(0.35);
  pdf.rect(12, 12, width - 24, height - 24);

  pdf.addImage(
    logo,
    'PNG',
    width / 2 - 24,
    15,
    48,
    26,
    undefined,
    'FAST'
  );

  pdf.setTextColor(215, 181, 101);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text(
    DAY1_ISSUER.toUpperCase(),
    width / 2,
    49,
    { align: 'center' }
  );

  pdf.setTextColor(170, 166, 156);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text(
    'SARLAYASH MISSION 2026  |  DAY 1 ONBOARDING',
    width / 2,
    57,
    { align: 'center' }
  );

  pdf.setTextColor(244, 220, 158);
  pdf.setFont('times', 'normal');
  pdf.setFontSize(29);
  pdf.text(
    'Certificate of Onboarding',
    width / 2,
    75,
    { align: 'center' }
  );

  pdf.setTextColor(155, 151, 142);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text(
    'PROUDLY PRESENTED TO',
    width / 2,
    87,
    { align: 'center' }
  );

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(25);

  const nameLines =
    pdf.splitTextToSize(
      String(student.name),
      180
    );

  pdf.text(
    nameLines,
    width / 2,
    101,
    { align: 'center' }
  );

  pdf.setDrawColor(201, 164, 82);
  pdf.setLineWidth(0.35);
  pdf.line(
    width / 2 - 65,
    109,
    width / 2 + 65,
    109
  );

  pdf.setTextColor(190, 187, 179);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(
    'has successfully completed the SarlaYash Day 1 Onboarding Journey',
    width / 2,
    120,
    { align: 'center' }
  );

  pdf.text(
    'and is recognised with the professional learning designation',
    width / 2,
    127,
    { align: 'center' }
  );

  pdf.setTextColor(235, 203, 127);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text(
    DAY1_JOB_TITLE,
    width / 2,
    140,
    { align: 'center' }
  );

  pdf.setTextColor(150, 146, 137);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('JOURNEY ID', 30, 158);

  pdf.setTextColor(245, 245, 242);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text(
    String(student.journeyId),
    30,
    166
  );

  pdf.setTextColor(150, 146, 137);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('CREDENTIAL ID', 30, 178);

  pdf.setTextColor(245, 245, 242);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(credentialId, 30, 186);

  pdf.addImage(
    qrDataUrl,
    'PNG',
    width - 55,
    151,
    31,
    31
  );

  pdf.setTextColor(145, 141, 132);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.text(
    'SCAN TO VERIFY',
    width - 39.5,
    188,
    { align: 'center' }
  );

  pdf.setTextColor(177, 145, 74);
  pdf.setFont('times', 'italic');
  pdf.setFontSize(9);
  pdf.text(
    'Legacy of Values. Future of Learning.',
    width / 2,
    height - 17,
    { align: 'center' }
  );

  const safeJourneyId =
    String(student.journeyId)
      .replace(
        /[^a-z0-9_-]/gi,
        '-'
      );

  pdf.save(
    `SarlaYash-Day1-Onboarding-${safeJourneyId}.pdf`
  );

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
            ENTER MISSION â†’
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

function showWaiting(
  student,
  allAssignments = []
) {

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

        ${corporateProfileMarkup(student)}

        ${credentialVaultMarkup(student)}

        ${achievementBadgeVaultMarkup(
          student,
          allAssignments
        )}

      </section>

    </main>

  `;


  bindLogout();
  bindCorporateProfile(student);
  bindCredentialVault(student);

  bindAchievementBadgeVault(
    student,
    allAssignments
  );

}


// ======================================================
// SUBMITTED / REVIEW SCREEN
// ======================================================

function showSubmitted(
  student,
  assignment,
  allAssignments = []
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
          MISSION CONTROL Â·
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

        ${corporateProfileMarkup(student)}

        ${credentialVaultMarkup(student)}

        ${achievementBadgeVaultMarkup(
          student,
          allAssignments
        )}

      </section>

    </main>

  `;


  bindLogout();
  bindCorporateProfile(student);
  bindCredentialVault(student);

  bindAchievementBadgeVault(
    student,
    allAssignments
  );

}


// ======================================================
// ACTIVE MISSION SCREEN
// ======================================================

function showActiveMission(
  student,
  assignment,
  allAssignments = []
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
          MISSION CONTROL Â·
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
          ${esc(student.course || 'â€”')}
        </p>


        <p>
          <strong>Month:</strong>
          ${esc(student.month || 'â€”')}
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

              HOUR ${hourLabel(assignment.hour)} â†’

            </button>

          </form>


          <p id="evidence-message"></p>

        </div>

        ${corporateProfileMarkup(student)}

        ${credentialVaultMarkup(student)}

        ${achievementBadgeVaultMarkup(
          student,
          allAssignments
        )}

      </section>

    </main>

  `;


  bindLogout();
  bindCorporateProfile(student);
  bindCredentialVault(student);

  bindAchievementBadgeVault(
    student,
    allAssignments
  );


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
          assignment,
          allAssignments
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
          } â†’`;


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


    const studentDocument =
      userSnapshot.docs[0];


    const student = {
      documentId:
        studentDocument.id,

      ...studentDocument.data()
    };


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
        submittedMission,
        allAssignments
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
        student,
        allAssignments
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
      currentMission,
      allAssignments
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


