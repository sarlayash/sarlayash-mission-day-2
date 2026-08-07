const { initializeApp, cert } =
  require("firebase-admin/app");

const { getAuth } =
  require("firebase-admin/auth");

const {
  getFirestore,
  FieldValue
} = require("firebase-admin/firestore");

const serviceAccount =
  require("./serviceAccountKey.json");


initializeApp({
  credential: cert(serviceAccount)
});


const auth = getAuth();
const db = getFirestore();


// ======================================================
// SARLAYASH QA DEMO LEARNER
// ======================================================

const DEMO = {

  name:
    "SarlaYash QA Demo Learner",

  email:
    "demo@sarlayash.com",

  journeyId:
    "SYM-DEMO-2026-0001",

  course:
    "Plug-and-Play Learning Engineer | QA Sandbox"

};


// ======================================================
// FIREBASE AUTH
// ======================================================

async function ensureAuthUser() {

  console.log("");
  console.log("Checking Firebase Authentication...");


  try {

    const existing =
      await auth.getUserByEmail(
        DEMO.email
      );


    console.log(
      "AUTH EXISTS: Demo Authentication account already exists."
    );

    console.log(
      `UID: ${existing.uid}`
    );


    return existing;

  } catch (error) {

    if (
      error.code !==
      "auth/user-not-found"
    ) {
      throw error;
    }

  }


  const created =
    await auth.createUser({

      email:
        DEMO.email,

      password:
        DEMO.journeyId,

      displayName:
        DEMO.name,

      emailVerified:
        false,

      disabled:
        false

    });


  console.log(
    "AUTH CREATED: Demo Authentication account."
  );

  console.log(
    `UID: ${created.uid}`
  );


  return created;

}


// ======================================================
// FIRESTORE PROFILE
// ======================================================

async function ensureMissionUser(
  authUser
) {

  console.log("");
  console.log("Checking mission_users...");


  const learnerRef =
    db
      .collection("mission_users")
      .doc(DEMO.journeyId);


  const existingJourney =
    await learnerRef.get();


  if (existingJourney.exists) {

    const data =
      existingJourney.data();


    if (
      String(
        data.authEmail || ""
      ).toLowerCase() !==
      DEMO.email.toLowerCase()
    ) {

      throw new Error(
        "SAFETY STOP: Demo Journey ID already belongs to another email."
      );

    }


    console.log(
      "PROFILE EXISTS: Demo Mission learner already exists."
    );

    return;

  }


  // ====================================================
  // EMAIL DUPLICATE PROTECTION
  // ====================================================

  const emailMatch =
    await db
      .collection("mission_users")
      .where(
        "authEmail",
        "==",
        DEMO.email
      )
      .limit(1)
      .get();


  if (!emailMatch.empty) {

    throw new Error(
      `SAFETY STOP: ${DEMO.email} already belongs to Journey ID ${emailMatch.docs[0].id}.`
    );

  }


  await learnerRef.set({

    name:
      DEMO.name,

    authEmail:
      DEMO.email,

    journeyId:
      DEMO.journeyId,

    course:
      DEMO.course,

    completedHours:
      0,

    month:
      1,

    status:
      "ACTIVE",

    accountType:
      "QA_DEMO",

    qaSandbox:
      true,

    authUid:
      authUser.uid,

    createdAt:
      FieldValue.serverTimestamp()

  });


  console.log(
    "PROFILE CREATED: QA Demo Mission learner."
  );

}


// ======================================================
// MAIN
// ======================================================

async function run() {

  console.log("");
  console.log("================================================");
  console.log(" SARLAYASH MISSION - QA DEMO PROVISIONER");
  console.log("================================================");

  console.log(
    `Name       : ${DEMO.name}`
  );

  console.log(
    `Email      : ${DEMO.email}`
  );

  console.log(
    `Journey ID : ${DEMO.journeyId}`
  );

  console.log(
    `Course     : ${DEMO.course}`
  );

  console.log(
    "Account    : QA_DEMO"
  );

  console.log("================================================");


  const authUser =
    await ensureAuthUser();


  await ensureMissionUser(
    authUser
  );


  console.log("");
  console.log("================================================");
  console.log(" QA DEMO ACCOUNT READY");
  console.log("================================================");

  console.log(
    `Login ID : ${DEMO.email}`
  );

  console.log(
    `Password : ${DEMO.journeyId}`
  );

  console.log(
    `Journey  : ${DEMO.journeyId}`
  );

  console.log("");
  console.log(
    "This account is reserved for Mission QA testing."
  );

  console.log("================================================");

}


run()
  .then(
    () => process.exit(0)
  )
  .catch(
    error => {

      console.error("");
      console.error(
        "QA DEMO PROVISIONING FAILED"
      );

      console.error(
        error.code || ""
      );

      console.error(
        error.message
      );

      process.exit(1);

    }
  );