import nodemailer from 'nodemailer';

import {
  cert,
  getApps,
  initializeApp
} from 'firebase-admin/app';

import {
  getAuth
} from 'firebase-admin/auth';

import {
  getFirestore
} from 'firebase-admin/firestore';


// ======================================================
// FIREBASE ADMIN
// ======================================================

function getAdminApp() {

  if (getApps().length) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId:
        process.env.FIREBASE_ADMIN_PROJECT_ID,

      clientEmail:
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL,

      privateKey:
        process.env.FIREBASE_ADMIN_PRIVATE_KEY
    })
  });

}


// ======================================================
// HTML SAFETY
// ======================================================

function escapeHtml(value = '') {

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

}


// ======================================================
// API
// ======================================================

export default async function handler(req, res) {

  if (req.method !== 'POST') {

    return res.status(405).json({
      ok: false,
      message: 'Method not allowed'
    });

  }


  try {

    // --------------------------------------------------
    // 1. VERIFY FIREBASE AUTH TOKEN
    // --------------------------------------------------

    const authorization =
      String(
        req.headers.authorization || ''
      );


    if (
      !authorization.startsWith('Bearer ')
    ) {

      return res.status(401).json({
        ok: false,
        message: 'Authentication required'
      });

    }


    const idToken =
      authorization.slice(7).trim();


    if (!idToken) {

      return res.status(401).json({
        ok: false,
        message: 'Authentication required'
      });

    }


    const app =
      getAdminApp();


    const decodedToken =
      await getAuth(app)
        .verifyIdToken(idToken);


    // --------------------------------------------------
    // 2. VERIFY SARLAYASH ADMIN RECORD
    // --------------------------------------------------

    const adminSnapshot =
      await getFirestore(app)
        .collection('admins')
        .doc(decodedToken.uid)
        .get();


    if (!adminSnapshot.exists) {

      return res.status(403).json({
        ok: false,
        message: 'Admin access required'
      });

    }


    const admin =
      adminSnapshot.data();


    if (
      admin.active !== true ||
      admin.role !== 'ADMIN'
    ) {

      return res.status(403).json({
        ok: false,
        message: 'Admin access required'
      });

    }


    // --------------------------------------------------
    // 3. VALIDATE EMAIL REQUEST
    // --------------------------------------------------

    const {
      to,
      subject,
      message
    } = req.body || {};


    if (
      typeof to !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string' ||
      !to.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {

      return res.status(400).json({
        ok: false,
        message: 'Missing email fields'
      });

    }


    // Basic limits for V1.

    if (
      to.length > 320 ||
      subject.length > 200 ||
      message.length > 10000
    ) {

      return res.status(400).json({
        ok: false,
        message: 'Email content exceeds limits'
      });

    }


    // --------------------------------------------------
    // 4. SMTP
    // --------------------------------------------------

    const transporter =
      nodemailer.createTransport({

        host:
          process.env.SMTP_HOST,

        port:
          Number(
            process.env.SMTP_PORT || 465
          ),

        secure: true,

        auth: {

          user:
            process.env.SMTP_USER,

          pass:
            process.env.SMTP_PASS

        }

      });


    // --------------------------------------------------
    // 5. SEND
    // --------------------------------------------------

    const info =
      await transporter.sendMail({

        from:
          `"SarlaYash Mission 2026" <${process.env.SMTP_USER}>`,

        to:
          to.trim(),

        subject:
          subject.trim(),

        text:
          message.trim(),

        html: `
          <div style="
            background:#050505;
            color:#ffffff;
            padding:36px;
            font-family:Arial,sans-serif;
            line-height:1.7;
          ">

            <div style="
              color:#d6b15d;
              font-size:12px;
              font-weight:700;
              letter-spacing:2px;
            ">
              SARLAYASH MISSION 2026
            </div>

            <h1 style="
              color:#e3c46e;
              margin:14px 0 20px;
              font-size:24px;
            ">
              SarlaYash Learning Solutions LLP
            </h1>

            <div style="
              color:#eeeeee;
              font-size:15px;
              white-space:pre-line;
            ">${escapeHtml(message.trim())}</div>

            <div style="
              border-top:1px solid #493b1c;
              margin-top:30px;
              padding-top:20px;
              color:#999999;
              font-size:12px;
            ">
              Legacy of Values. Future of Learning.<br>
              SarlaYash Mission 2026
            </div>

          </div>
        `

      });


    console.log(
      'SARLAYASH EMAIL SENT:',
      {
        adminUid:
          decodedToken.uid,

        adminEmail:
          decodedToken.email || '',

        recipient:
          to.trim(),

        messageId:
          info.messageId
      }
    );


    return res.status(200).json({
      ok: true,
      message: 'Email sent successfully'
    });


  } catch (error) {

    console.error(
      'SARLAYASH EMAIL ERROR:',
      error
    );


    // Don't expose SMTP/Firebase internals
    // to the browser.

    return res.status(500).json({
      ok: false,
      message: 'Email delivery failed'
    });

  }

}