const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const fs = require("fs");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();

const CSV_FILE = "./new-learners.csv";

function parseCSV(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(line => line.trim());

  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(",");
    const row = {};

    headers.forEach((header, index) => {
      row[header] = (values[index] || "").trim();
    });

    return row;
  });
}

async function run() {

  console.log("");
  console.log("==========================================");
  console.log(" SARLAYASH AUTH PROVISIONER");
  console.log("==========================================");
  console.log(" Login ID : Email");
  console.log(" Password : Journey ID");
  console.log("==========================================");

  const csv = fs.readFileSync(CSV_FILE, "utf8");
  const learners = parseCSV(csv);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const learner of learners) {

    const name = learner.name?.trim();
    const email = learner.email?.trim().toLowerCase();
    const journeyId = learner.journeyId?.trim();

    console.log("");
    console.log("------------------------------------------");
    console.log(`Name       : ${name}`);
    console.log(`Email      : ${email}`);
    console.log(`Journey ID : ${journeyId}`);

    try {

      if (!name || !email || !journeyId) {
        throw new Error(
          "Required field missing: name, email or journeyId."
        );
      }

      // Check whether Authentication account already exists.
      try {

        const existingUser =
          await auth.getUserByEmail(email);

        console.log("SKIPPED: Authentication user already exists.");
        console.log(`UID: ${existingUser.uid}`);

        skipped++;
        continue;

      } catch (error) {

        if (error.code !== "auth/user-not-found") {
          throw error;
        }
      }

      // Existing SarlaYash convention:
      // Login ID = email
      // Password = Journey ID

      const user = await auth.createUser({
        email: email,
        password: journeyId,
        displayName: name,
        emailVerified: false,
        disabled: false
      });

      console.log("CREATED: Firebase Authentication user.");
      console.log(`UID: ${user.uid}`);

      created++;

    } catch (error) {

      console.log(
        `FAILED: ${error.code || ""} ${error.message}`
      );

      failed++;
    }
  }

  console.log("");
  console.log("==========================================");
  console.log(" AUTH PROVISIONING COMPLETE");
  console.log("==========================================");
  console.log(`Created : ${created}`);
  console.log(`Skipped : ${skipped}`);
  console.log(`Failed  : ${failed}`);
  console.log("==========================================");

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(error => {

  console.error("");
  console.error("FATAL ERROR:");
  console.error(error);

  process.exit(1);
});