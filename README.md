# SarlaYash Mission | Day 2 — Talent & Domain Discovery

Premium, mobile-first reflection experience for SarlaYash Blessings Internships 2026, Batch 01. Participants need no account; administrators sign in separately at `/admin`.

## Local run

Install Node.js 20+, copy `.env.example` to `.env`, add Firebase web app values, then run `npm install` and `npm run dev`.

## Firebase setup

1. Create a Firebase project and add a Web app.
2. Enable Cloud Firestore (production mode) and Email/Password in Authentication.
3. Create administrator users only in Firebase Authentication.
4. Publish `firestore.rules` in the Firestore Rules editor.
5. Set the six `VITE_FIREBASE_*` values from Firebase’s Web app configuration in `.env`.

Firebase web configuration identifies a project; it is not an administrative credential. Never add service-account secrets to this app.

## Deployment and operations

Import this folder into Vercel, add the same six variables in Project Settings, and deploy. `/admin` is mapped by `vercel.json`. Change questions in `src/questions.js`; use the admin CSV button to export submissions. Individual profiles support browser Print / Save PDF. Back up Firestore through Google Cloud Firestore exports or scheduled Cloud Storage exports.

## Responsible analysis

Domain labels are lightweight signals from the ten answers, not scores or automatic decisions. The app does not infer sensitive characteristics; every allocation remains subject to human review.
