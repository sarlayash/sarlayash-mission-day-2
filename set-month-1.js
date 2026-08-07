const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const learners = [
  {
    name: "Shobhitha",
    journeyId: "SYM-D2-2026-5222",
  },
  {
    name: "Sanjana K R",
    journeyId: "SYM-D2-2026-8402",
  },
  {
    name: "Pratyush Pradhan",
    journeyId: "SYM-D2-2026-7750",
  },
  {
    name: "Arpan Mandal",
    journeyId: "SYM-D2-2026-9951",
  },
  {
    name: "Madhumita Adak",
    journeyId: "SYM-D2-2026-9920",
  },
];

async function setMonthOne() {
  console.log("");
  console.log("==============================================");
  console.log(" SARLAYASH MISSION — MONTH 1 DATA FIX");
  console.log("==============================================");
  console.log("");

  let updated = 0;
  let alreadyCorrect = 0;
  let missing = 0;
  let failed = 0;

  for (const learner of learners) {
    const ref = db
      .collection("mission_users")
      .doc(learner.journeyId);

    try {
      const snapshot = await ref.get();

      console.log("----------------------------------------------");
      console.log(`Name       : ${learner.name}`);
      console.log(`Journey ID : ${learner.journeyId}`);

      if (!snapshot.exists) {
        console.log("ERROR: mission_users document not found.");
        missing++;
        continue;
      }

      const data = snapshot.data();

      console.log(`Current Month : ${data.month}`);

      if (data.month === 1) {
        console.log("SKIPPED: Month is already 1.");
        alreadyCorrect++;
        continue;
      }

      // update() modifies ONLY the specified field.
      // No existing learner data is overwritten.
      await ref.update({
        month: 1,
      });

      console.log("UPDATED: Month set to 1.");
      updated++;

    } catch (error) {
      console.log(`FAILED: ${error.message}`);
      failed++;
    }
  }

  console.log("");
  console.log("==============================================");
  console.log(" MONTH 1 DATA FIX COMPLETE");
  console.log("==============================================");
  console.log(`Updated         : ${updated}`);
  console.log(`Already Correct : ${alreadyCorrect}`);
  console.log(`Missing         : ${missing}`);
  console.log(`Failed          : ${failed}`);
  console.log("==============================================");
}

setMonthOne()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("FATAL ERROR:", error);
    process.exit(1);
  });