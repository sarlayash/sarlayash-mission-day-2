const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const learners = [
  {
    name: "Golsan Ali",
    journeyId: "SYM-D2-2026-7169",
  },
  {
    name: "Kamatham Vishnu Vardhan Reddy",
    journeyId: "SYM-D2-2026-6528",
  },
  {
    name: "Keshav Arora",
    journeyId: "SYM-D2-2026-4009",
  },
];
const theme =
  "Code of Business Conduct — The Code You Would Be Willing to Live By";

const deliverable =
  "Build your own 5-point professional Code of Business Conduct. For each principle, include one real-world workplace situation showing what that principle means in action. Do not copy or rewrite an existing company’s COBC. Build something you would personally be willing to follow and be held accountable for.";

const outcome = "Policy Reader → Policy Thinker";

async function provisionHour1() {
  console.log("");
  console.log("==============================================");
  console.log(" SARLAYASH MISSION — HOUR 1 PROVISIONING");
  console.log("==============================================");
  console.log("");

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const learner of learners) {
    const documentId = `${learner.journeyId}-H01`;

    const ref = db
      .collection("mission_assignments")
      .doc(documentId);

    try {
      const existing = await ref.get();

      console.log("----------------------------------------------");
      console.log(`Name       : ${learner.name}`);
      console.log(`Journey ID : ${learner.journeyId}`);
      console.log(`Document   : ${documentId}`);

      if (existing.exists) {
        console.log("SKIPPED: Hour 1 assignment already exists.");
        skipped++;
        continue;
      }

      await ref.set({
        journeyId: learner.journeyId,
        hour: 1,

        theme: theme,
        deliverable: deliverable,
        outcome: outcome,

        evidenceUrl: "",

        releasedAt: Timestamp.now(),

        status: "RELEASED",
        reviewStatus: "PENDING",

        submitted: false,
        submittedAt: null,
      });

      console.log("CREATED: Hour 1 mission released successfully.");
      created++;

    } catch (error) {
      console.log("FAILED:", error.message);
      failed++;
    }
  }

  console.log("");
  console.log("==============================================");
  console.log(" HOUR 1 PROVISIONING COMPLETE");
  console.log("==============================================");
  console.log(`Created : ${created}`);
  console.log(`Skipped : ${skipped}`);
  console.log(`Failed  : ${failed}`);
  console.log("==============================================");
}

provisionHour1()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("FATAL ERROR:", error);
    process.exit(1);
  });