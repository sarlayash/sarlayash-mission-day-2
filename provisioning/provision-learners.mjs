import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  initializeApp,
  cert,
  getApps
} from 'firebase-admin/app';

import {
  getAuth
} from 'firebase-admin/auth';

import {
  getFirestore,
  FieldValue
} from 'firebase-admin/firestore';


// ======================================================
// PATHS
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');

const serviceAccountPath =
  path.join(projectRoot, 'serviceAccountKey.json');

const csvPath =
  path.join(
    __dirname,
    'sarlayash-mission-learners.csv'
  );


// ======================================================
// SAFETY SWITCH
// ======================================================

// true  = READ + VALIDATE + PREVIEW ONLY
// false = ACTUALLY CREATE FIREBASE RECORDS

const DRY_RUN = true;


// ======================================================
// COMMON MISSION CONFIGURATION
// ======================================================

const MISSION_CONFIG = {

  month: 1,

  totalHours: 16,

  completedHours: 0,

  hour01: {

    hour: 1,

    theme:
      'Code of Business Conduct — The Code You Would Be Willing to Live By',

    deliverable:
      'Build your own 5-point professional Code of Business Conduct. For each principle, include one real-world workplace situation showing what that principle means in action. Do not copy or rewrite an existing company’s COBC. Build something you would personally be willing to follow and be held accountable for.',

    outcome:
      'Policy Reader → Policy Thinker',

    status:
      'RELEASED',

    reviewStatus:
      'PENDING',

    submitted:
      false,

    evidenceUrl:
      ''

  }

};


// ======================================================
// CSV PARSER
// ======================================================

function parseCsvLine(line) {

  const values = [];

  let current = '';
  let insideQuotes = false;


  for (let i = 0; i < line.length; i++) {

    const character = line[i];


    if (character === '"') {

      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {

        current += '"';
        i++;

      } else {

        insideQuotes = !insideQuotes;

      }

    } else if (
      character === ',' &&
      !insideQuotes
    ) {

      values.push(current.trim());
      current = '';

    } else {

      current += character;

    }

  }


  values.push(current.trim());

  return values;

}


// ======================================================
// READ CSV
// ======================================================

function readLearners() {

  if (!fs.existsSync(csvPath)) {

    throw new Error(
      `CSV file not found:\n${csvPath}`
    );

  }


  const content =
    fs.readFileSync(csvPath, 'utf8');


  const lines =
    content
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .filter(line => line.trim());


  if (lines.length < 2) {

    throw new Error(
      'CSV contains no learner records.'
    );

  }


  const headers =
    parseCsvLine(lines[0])
      .map(header =>
        header
          .trim()
          .toLowerCase()
      );


  const requiredHeaders = [
    'name',
    'email',
    'journeyid',
    'course'
  ];


  for (const requiredHeader of requiredHeaders) {

    if (!headers.includes(requiredHeader)) {

      throw new Error(
        `Missing CSV column: ${requiredHeader}`
      );

    }

  }


  return lines
    .slice(1)
    .map((line, index) => {

      const values =
        parseCsvLine(line);


      const row = {};


      headers.forEach(
        (header, headerIndex) => {

          row[header] =
            values[headerIndex]?.trim() || '';

        }
      );


      return {

        rowNumber:
          index + 2,

        name:
          row.name.trim(),

        email:
          row.email
            .trim()
            .toLowerCase(),

        journeyId:
          row.journeyid
            .trim()
            .toUpperCase(),

        course:
          row.course.trim()

      };

    });

}


// ======================================================
// VALIDATION
// ======================================================

function validateLearners(learners) {

  const errors = [];

  const emails = new Set();
  const journeyIds = new Set();


  for (const learner of learners) {

    if (!learner.name) {

      errors.push(
        `Row ${learner.rowNumber}: Name is blank.`
      );

    }


    if (!learner.email) {

      errors.push(
        `Row ${learner.rowNumber}: Email is blank.`
      );

    }


    if (
      learner.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        learner.email
      )
    ) {

      errors.push(
        `Row ${learner.rowNumber}: Invalid email ${learner.email}`
      );

    }


    if (!learner.journeyId) {

      errors.push(
        `Row ${learner.rowNumber}: Journey ID is blank.`
      );

    }


    if (
      learner.journeyId &&
      !/^SYM-D2-2026-\d{4}$/.test(
        learner.journeyId
      )
    ) {

      errors.push(
        `Row ${learner.rowNumber}: Invalid Journey ID ${learner.journeyId}`
      );

    }


    if (!learner.course) {

      errors.push(
        `Row ${learner.rowNumber}: Course is blank.`
      );

    }


    if (emails.has(learner.email)) {

      errors.push(
        `Row ${learner.rowNumber}: Duplicate email ${learner.email}`
      );

    }


    if (journeyIds.has(learner.journeyId)) {

      errors.push(
        `Row ${learner.rowNumber}: Duplicate Journey ID ${learner.journeyId}`
      );

    }


    emails.add(learner.email);
    journeyIds.add(learner.journeyId);

  }


  return errors;

}


// ======================================================
// FIREBASE ADMIN
// ======================================================

function initializeFirebase() {

  if (!fs.existsSync(serviceAccountPath)) {

    throw new Error(
      `Service account key not found:\n${serviceAccountPath}`
    );

  }


  const serviceAccount =
    JSON.parse(
      fs.readFileSync(
        serviceAccountPath,
        'utf8'
      )
    );


  let app;


  if (getApps().length === 0) {

    app =
      initializeApp({

        credential:
          cert(serviceAccount)

      });

  } else {

    app =
      getApps()[0];

  }


  return {

    auth:
      getAuth(app),

    db:
      getFirestore(app)

  };

}


// ======================================================
// FIND AUTH USER
// ======================================================

async function findAuthUser(auth, email) {

  try {

    return await auth.getUserByEmail(email);

  } catch (error) {

    if (
      error.code ===
      'auth/user-not-found'
    ) {

      return null;

    }

    throw error;

  }

}


// ======================================================
// PROVISION ONE LEARNER
// ======================================================

async function provisionLearner(
  auth,
  db,
  learner
) {

  console.log('');
  console.log(
    '--------------------------------------------------'
  );

  console.log(learner.name);
  console.log(`Email      : ${learner.email}`);
  console.log(`Journey ID : ${learner.journeyId}`);
  console.log(`Course     : ${learner.course}`);


  // ====================================================
  // AUTH
  // ====================================================

  const existingAuthUser =
    await findAuthUser(
      auth,
      learner.email
    );


  if (existingAuthUser) {

    console.log(
      'AUTH       : EXISTS — SKIPPING'
    );

  } else if (DRY_RUN) {

    console.log(
      'AUTH       : WOULD CREATE'
    );

  } else {

    await auth.createUser({

      email:
        learner.email,

      password:
        learner.journeyId,

      displayName:
        learner.name,

      emailVerified:
        false,

      disabled:
        false

    });


    console.log(
      'AUTH       : CREATED'
    );

  }


  // ====================================================
  // MISSION USER
  // ====================================================

  const missionUserRef =
    db
      .collection('mission_users')
      .doc(learner.journeyId);


  const missionUserSnapshot =
    await missionUserRef.get();


  if (missionUserSnapshot.exists) {

    const existing =
      missionUserSnapshot.data();


    if (
      existing.authEmail &&
      existing.authEmail.toLowerCase() !==
        learner.email
    ) {

      throw new Error(
        `Journey ID ${learner.journeyId} already belongs to another email.`
      );

    }


    console.log(
      'PROFILE    : EXISTS — SKIPPING'
    );

  } else if (DRY_RUN) {

    console.log(
      'PROFILE    : WOULD CREATE'
    );

  } else {

    await missionUserRef.set({

      name:
        learner.name,

      authEmail:
        learner.email,

      journeyId:
        learner.journeyId,

      course:
        learner.course,

      month:
        MISSION_CONFIG.month,

      status:
        'ACTIVE',

      completedHours:
        MISSION_CONFIG.completedHours,

      totalHours:
        MISSION_CONFIG.totalHours,

      createdAt:
        FieldValue.serverTimestamp()

    });


    console.log(
      'PROFILE    : CREATED'
    );

  }


  // ====================================================
  // HOUR 01
  // ====================================================

  const assignmentId =
    `${learner.journeyId}-H01`;


  const assignmentRef =
    db
      .collection('mission_assignments')
      .doc(assignmentId);


  const assignmentSnapshot =
    await assignmentRef.get();


  if (assignmentSnapshot.exists) {

    const existingAssignment =
      assignmentSnapshot.data();


    if (
      existingAssignment.journeyId !==
      learner.journeyId
    ) {

      throw new Error(
        `Assignment ${assignmentId} contains an unexpected Journey ID.`
      );

    }


    console.log(
      'HOUR 01    : EXISTS — SKIPPING'
    );

  } else if (DRY_RUN) {

    console.log(
      'HOUR 01    : WOULD CREATE'
    );

  } else {

    await assignmentRef.set({

      journeyId:
        learner.journeyId,

      hour:
        MISSION_CONFIG.hour01.hour,

      theme:
        MISSION_CONFIG.hour01.theme,

      deliverable:
        MISSION_CONFIG.hour01.deliverable,

      outcome:
        MISSION_CONFIG.hour01.outcome,

      status:
        MISSION_CONFIG.hour01.status,

      reviewStatus:
        MISSION_CONFIG.hour01.reviewStatus,

      submitted:
        MISSION_CONFIG.hour01.submitted,

      evidenceUrl:
        MISSION_CONFIG.hour01.evidenceUrl,

      submittedAt:
        null,

      releasedAt:
        FieldValue.serverTimestamp()

    });


    console.log(
      'HOUR 01    : CREATED'
    );

  }


  return true;

}


// ======================================================
// MAIN
// ======================================================

async function main() {

  console.log('');
  console.log(
    '=================================================='
  );

  console.log(
    'SARLAYASH MISSION — BULK LEARNER PROVISIONING'
  );

  console.log(
    '=================================================='
  );

  console.log('');


  if (DRY_RUN) {

    console.log(
      'MODE: DRY RUN — FIREBASE WILL NOT BE MODIFIED'
    );

  } else {

    console.log(
      'MODE: LIVE — FIREBASE CREATION ENABLED'
    );

  }


  console.log('');


  // ====================================================
  // CSV
  // ====================================================

  const learners =
    readLearners();


  console.log(
    `Learners found: ${learners.length}`
  );


  const validationErrors =
    validateLearners(learners);


  if (validationErrors.length > 0) {

    console.error('');
    console.error(
      'CSV VALIDATION FAILED'
    );


    for (
      const validationError
      of validationErrors
    ) {

      console.error(
        `• ${validationError}`
      );

    }


    console.error('');
    console.error(
      'NOTHING HAS BEEN WRITTEN TO FIREBASE.'
    );


    process.exitCode = 1;
    return;

  }


  console.log(
    'CSV validation: PASSED'
  );


  // ====================================================
  // FIREBASE
  // ====================================================

  const {
    auth,
    db
  } = initializeFirebase();


  console.log(
    'Firebase Admin: CONNECTED'
  );


  // ====================================================
  // PROCESS
  // ====================================================

  let successful = 0;
  let failed = 0;


  for (const learner of learners) {

    try {

      await provisionLearner(
        auth,
        db,
        learner
      );


      successful++;

    } catch (error) {

      failed++;


      console.error('');
      console.error(
        `FAILED: ${learner.name}`
      );

      console.error(
        error.message
      );

    }

  }


  // ====================================================
  // REPORT
  // ====================================================

  console.log('');
  console.log(
    '=================================================='
  );

  console.log(
    'FINAL REPORT'
  );

  console.log(
    '=================================================='
  );

  console.log(
    `Total learners : ${learners.length}`
  );

  console.log(
    `Successful     : ${successful}`
  );

  console.log(
    `Failed         : ${failed}`
  );


  console.log('');


  if (DRY_RUN) {

    console.log(
      'DRY RUN COMPLETE.'
    );

    console.log(
      'NO FIREBASE RECORDS WERE CREATED OR MODIFIED.'
    );

  } else {

    console.log(
      'LIVE PROVISIONING COMPLETE.'
    );

  }


  if (failed > 0) {

    process.exitCode = 1;

  }

}


// ======================================================
// RUN
// ======================================================

main()
  .catch(error => {

    console.error('');
    console.error(
      'FATAL PROVISIONING ERROR'
    );

    console.error(error);

    process.exitCode = 1;

  });