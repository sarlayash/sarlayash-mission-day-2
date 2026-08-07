from pathlib import Path

path = Path("src/mission-badges.js")
text = path.read_text(encoding="utf-8-sig")


# ------------------------------------------------------
# ADD IMAGE LOADER
# ------------------------------------------------------

marker = """// ======================================================
// BADGE GENERATOR
// ======================================================"""

loader = """function loadBadgeImage(url) {

  return new Promise(
    (resolve, reject) => {

      const image =
        new Image();

      image.onload =
        () => resolve(image);

      image.onerror =
        () => reject(
          new Error(
            'Badge logo could not be loaded.'
          )
        );

      image.src = url;

    }
  );

}


// ======================================================
// BADGE GENERATOR
// ======================================================"""


if marker not in text:
    raise RuntimeError("BADGE GENERATOR MARKER NOT FOUND")

if "function loadBadgeImage" in text:
    raise RuntimeError("BADGE IMAGE LOADER ALREADY EXISTS")

text = text.replace(
    marker,
    loader,
    1
)


# ------------------------------------------------------
# LOAD OFFICIAL SARLAYASH LOGO
# ------------------------------------------------------

old_qr = """  const qrDataUrl =
    await QRCode.toDataURL(
      verificationUrl,
      {
        width: 260,
        margin: 1
      }
    );


  const canvas ="""

new_qr = """  const qrDataUrl =
    await QRCode.toDataURL(
      verificationUrl,
      {
        width: 260,
        margin: 1
      }
    );


  const logo =
    await loadBadgeImage(
      '/assets/sarlayash-logo.png'
    );


  const canvas ="""


if old_qr not in text:
    raise RuntimeError("QR BLOCK NOT FOUND")

text = text.replace(
    old_qr,
    new_qr,
    1
)


# ------------------------------------------------------
# DRAW LOGO
# ------------------------------------------------------

old_align = """  ctx.textAlign = 'center';


  ctx.fillStyle = '#D4AF37';"""

new_align = """  ctx.textAlign = 'center';


  // OFFICIAL SARLAYASH LOGO
  const logoWidth = 92;

  const logoHeight =
    logo.height *
    (
      logoWidth /
      logo.width
    );

  ctx.drawImage(
    logo,
    540 - (logoWidth / 2),
    72,
    logoWidth,
    logoHeight
  );


  ctx.fillStyle = '#D4AF37';"""


if old_align not in text:
    raise RuntimeError("TITLE ALIGNMENT BLOCK NOT FOUND")

text = text.replace(
    old_align,
    new_align,
    1
)


# ------------------------------------------------------
# MOVE ONLY TOP HEADING
# ------------------------------------------------------

old_title = """  ctx.fillText(
    'SARLAYASH MISSION 2026',
    540,
    125
  );"""

new_title = """  ctx.fillText(
    'SARLAYASH MISSION 2026',
    540,
    165
  );"""


if old_title not in text:
    raise RuntimeError("MISSION TITLE BLOCK NOT FOUND")

text = text.replace(
    old_title,
    new_title,
    1
)


path.write_text(
    text,
    encoding="utf-8"
)

print("SARLAYASH LOGO ADDED TO BADGE DOWNLOAD GENERATOR")