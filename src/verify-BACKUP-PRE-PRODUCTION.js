import { db } from './firebase.js';

import {
  doc,
  getDoc
} from 'firebase/firestore';


const result =
  document.querySelector(
    '#verification-result'
  );


const esc = value =>
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


function showInvalid(message) {

  result.className =
    'verification-card invalid';

  result.innerHTML = `

    <div class="status-icon">
      ×
    </div>

    <p class="status-label">
      CREDENTIAL NOT VERIFIED
    </p>

    <h2>
      Unable to verify
      <em>this credential.</em>
    </h2>

    <p class="message">
      ${esc(message)}
    </p>

    <div class="security-note">
      This page verifies credentials directly
      against the official SarlaYash
      Credential Registry.
    </div>

  `;

}


function showValid(data) {

  result.className =
    'verification-card valid';

  result.innerHTML = `

    <div class="status-icon">
      ✓
    </div>

    <p class="status-label">
      VALID CREDENTIAL
    </p>

    <h2>
      Credential
      <em>Verified.</em>
    </h2>

    <p class="verified-copy">
      This credential is present in the
      official SarlaYash Credential Registry.
    </p>

    <div class="learner">

      <small>
        CREDENTIAL HOLDER
      </small>

      <strong>
        ${esc(data.learnerName)}
      </strong>

      <span>
        ${esc(data.jobTitle)}
      </span>

    </div>

    <div class="credential-grid">

      <div>
        <small>CREDENTIAL</small>
        <strong>
          ${esc(data.credentialType)}
        </strong>
      </div>

      <div>
        <small>STATUS</small>
        <strong class="valid-text">
          ${esc(data.status)}
        </strong>
      </div>

      <div>
        <small>JOURNEY ID</small>
        <strong>
          ${esc(data.journeyId)}
        </strong>
      </div>

      <div>
        <small>CREDENTIAL ID</small>
        <strong>
          ${esc(data.credentialId)}
        </strong>
      </div>

      <div class="issuer">
        <small>ISSUED BY</small>
        <strong>
          ${esc(data.issuer)}
        </strong>
      </div>

    </div>

    <div class="registry-seal">

      <span></span>

      VERIFIED AGAINST
      SARLAYASH CREDENTIAL REGISTRY

    </div>

  `;

}


async function verifyCredential() {

  try {

    const params =
      new URLSearchParams(
        window.location.search
      );


    const credentialId =
      String(
        params.get('id') || ''
      )
        .trim()
        .toUpperCase();


    if (!credentialId) {

      showInvalid(
        'No Credential ID was provided.'
      );

      return;

    }


    if (
      !credentialId.startsWith(
        'SYM-ONB-L1-'
      )
    ) {

      showInvalid(
        'The supplied Credential ID is not recognised.'
      );

      return;

    }


    const credentialReference =
      doc(
        db,
        'public_credentials',
        credentialId
      );


    const credentialSnapshot =
      await getDoc(
        credentialReference
      );


    if (!credentialSnapshot.exists()) {

      showInvalid(
        'No matching credential exists in the official registry.'
      );

      return;

    }


    const data =
      credentialSnapshot.data();


    if (
      data.credentialId !==
      credentialId
    ) {

      showInvalid(
        'Credential registry integrity check failed.'
      );

      return;

    }


    if (
      String(data.status || '')
        .toUpperCase() !==
      'VALID'
    ) {

      showInvalid(
        'This credential is not currently valid.'
      );

      return;

    }


    showValid(data);


  } catch (error) {

    console.error(
      'Credential Verification Error:',
      error
    );


    showInvalid(
      'Verification service is temporarily unavailable. Please try again.'
    );

  }

}


verifyCredential();