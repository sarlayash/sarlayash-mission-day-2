from pathlib import Path

path = Path("src/home.js")
text = path.read_text(encoding="utf-8")

# -------------------------------------------------------
# PATCH 1: FIREBASE IMPORTS
# -------------------------------------------------------

marker = """const root =
  document.querySelector('#home-app');"""

replacement = """import { db } from './firebase.js';

import {
  doc,
  getDoc,
  runTransaction
} from 'firebase/firestore';


const root =
  document.querySelector('#home-app');"""

if marker not in text:
    raise RuntimeError("FIREBASE IMPORT MARKER NOT FOUND")

text = text.replace(marker, replacement, 1)


# -------------------------------------------------------
# PATCH 2: VISITOR COUNTER LOGIC
# -------------------------------------------------------

start_marker = """// ======================================================
// START
// ======================================================

renderHome();"""

visitor_logic = """// ======================================================
// PERSISTENT ECOSYSTEM VISITOR INTELLIGENCE
// ======================================================

async function activateVisitorIntelligence() {

  const countElement =
    document.querySelector(
      '#visitor-count'
    );

  const noteElement =
    document.querySelector(
      '#visitor-note'
    );


  if (!countElement || !noteElement || !db) {
    return;
  }


  const counterRef =
    doc(
      db,
      'ecosystem_metrics',
      'gateway'
    );


  try {

    const sessionKey =
      'sarlayash_gateway_visit_counted';


    if (
      sessionStorage.getItem(
        sessionKey
      ) !== 'yes'
    ) {

      const total =
        await runTransaction(
          db,
          async transaction => {

            const snapshot =
              await transaction.get(
                counterRef
              );


            if (!snapshot.exists()) {

              transaction.set(
                counterRef,
                {
                  totalVisits: 1
                }
              );

              return 1;

            }


            const current =
              Number(
                snapshot.data()
                  ?.totalVisits || 0
              );


            const next =
              current + 1;


            transaction.update(
              counterRef,
              {
                totalVisits: next
              }
            );


            return next;

          }
        );


      sessionStorage.setItem(
        sessionKey,
        'yes'
      );


      countElement.textContent =
        Number(total)
          .toLocaleString(
            'en-IN'
          );

    } else {

      const snapshot =
        await getDoc(
          counterRef
        );


      if (snapshot.exists()) {

        const total =
          Number(
            snapshot.data()
              ?.totalVisits || 0
          );


        countElement.textContent =
          total.toLocaleString(
            'en-IN'
          );

      }

    }


    noteElement.textContent =
      'Persistent ecosystem engagement intelligence';

  } catch (error) {

    console.error(
      'Visitor Intelligence Error:',
      error
    );


    countElement.textContent =
      '—';


    noteElement.textContent =
      'Live visitor intelligence temporarily unavailable';

  }

}


// ======================================================
// START
// ======================================================

renderHome();

activateVisitorIntelligence();"""

if start_marker not in text:
    raise RuntimeError("START MARKER NOT FOUND")

text = text.replace(
    start_marker,
    visitor_logic,
    1
)

path.write_text(
    text,
    encoding="utf-8"
)

print()
print("VISITOR COUNTER WIRED INTO HOME.JS")
print("FIREBASE IMPORT: OK")
print("SESSION PROTECTION: OK")
print("PERSISTENT COUNTER: OK")
print()