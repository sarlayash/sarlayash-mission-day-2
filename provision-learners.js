const fs = require("fs");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const CSV_FILE = "./new-learners.csv";

function parseCSV(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(line => line.trim());

  const headers = lines[0]
    .split(",")
    .map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(",");

    const row = {};

    headers.forEach((header, index) => {
      row[header] = (values[index] || "").trim();
    });

    return row;
  });
}

async function provision() {

  console.log("");
  console.log("==========================================");
  console.log(" SARLAYASH MISSION LEARNER PROVISIONER");
  console.log("==========================================");
  console.log("");

  const csv = fs.readFileSync(CSV_FILE, "utf8");

  const learners = parseCSV(csv);

  console.log(`Learners found in CSV: ${learners.length}`);
  console.log("");

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const learner of learners) {

    const name = learner.name?.trim();
    const email = learner.email?.trim().toLowerCase();
    const journeyId = learner.journeyId?.trim();
    const course = learner.course?.trim() || "";

    console.log("------------------------------------------");
    console.log(`Name       : ${name}`);
    console.log(`Email      : ${email}`);
    console.log(`Journey ID : ${journeyId}`);
    console.log(`Course     : ${course}`);

    try {

      if (!name || !email || !journeyId) {
        throw new Error(
          "Required field missing: name, email or journeyId."
        );
      }

      const learnerRef =
        db.collection("mission_users").doc(journeyId);

      const existingJourney = await learnerRef.get();

      if (existingJourney.exists) {

        console.log(
          "SKIPPED: Journey ID already exists in mission_users."
        );

        skipped++;
        continue;
      }

      /*
       * Additional duplicate protection:
       * Check whether this email already belongs to another
       * Mission learner.
       */

      const emailMatch = await db
        .collection("mission_users")
        .where("authEmail", "==", email)
        .limit(1)
        .get();

      if (!emailMatch.empty) {

        console.log(
          "SKIPPED: Email already belongs to a Mission learner."
        );

        console.log(
          `Existing Journey ID: ${emailMatch.docs[0].id}`
        );

        skipped++;
        continue;
      }

      await learnerRef.set({
  name: name,
  authEmail: email,
  journeyId: journeyId,
  course: course,
  completedHours: 0,
  month: 1,
  status: "ACTIVE",
  createdAt: FieldValue.serverTimestamp()
});

      console.log(
        "CREATED: Mission learner profile successfully."
      );

      created++;

    } catch (error) {

      console.log(`FAILED: ${error.message}`);

      failed++;
    }
  }

  console.log("");
  console.log("==========================================");
  console.log(" PROVISIONING COMPLETE");
  console.log("==========================================");

  console.log(`Created : ${created}`);
  console.log(`Skipped : ${skipped}`);
  console.log(`Failed  : ${failed}`);

  console.log("==========================================");
  console.log("");

  process.exit(failed > 0 ? 1 : 0);
}

provision().catch(error => {

  console.error("");
  console.error("FATAL ERROR");
  console.error(error);

  process.exit(1);

});