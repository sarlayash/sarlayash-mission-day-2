import nodemailer from 'nodemailer';

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: 'Method not allowed'
    });
  }

  try {

    const {
      to,
      subject,
      message
    } = req.body || {};


    if (!to || !subject || !message) {
      return res.status(400).json({
        ok: false,
        message: 'Missing email fields'
      });
    }


    const transporter =
      nodemailer.createTransport({

        host: process.env.SMTP_HOST,

        port:
          Number(process.env.SMTP_PORT || 465),

        secure: true,

        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }

      });


    await transporter.sendMail({

      from:
        `"SarlaYash Mission 2026" <${process.env.SMTP_USER}>`,

      to,

      subject,

      text: message,

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
          ">
            SarlaYash Learning Solutions LLP
          </h1>

          <div style="
            color:#eeeeee;
            font-size:15px;
            white-space:pre-line;
          ">
            ${escapeHtml(message)}
          </div>

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


    return res.status(200).json({
      ok: true,
      message: 'Email sent successfully'
    });


  } catch (error) {

    console.error(
      'SARLAYASH EMAIL ERROR:',
      error
    );

    return res.status(500).json({
      ok: false,
      message: 'Email delivery failed'
    });

  }

}


function escapeHtml(value = '') {

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

}