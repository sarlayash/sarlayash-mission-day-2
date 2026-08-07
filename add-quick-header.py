from pathlib import Path
import shutil
import sys

HOME = Path("src/home.js")
CSS = Path("src/home.css")
BACKUPS = Path("backups")

BACKUPS.mkdir(exist_ok=True)

if not HOME.exists() or not CSS.exists():
    print("ERROR: src/home.js or src/home.css not found.")
    sys.exit(1)

shutil.copy2(
    HOME,
    BACKUPS / "home-BEFORE-QUICK-HEADER.js"
)

shutil.copy2(
    CSS,
    BACKUPS / "home-BEFORE-QUICK-HEADER.css"
)

home = HOME.read_text(encoding="utf-8")
css = CSS.read_text(encoding="utf-8")

if "SARLAYASH_QUICK_HEADER_V1" in home:
    print("Quick Header already installed.")
    sys.exit(0)


# ======================================================
# 1. ADD HERO ID
# ======================================================

old = '<section class="hero">'

if old not in home:
    print("ERROR: Hero section not found.")
    sys.exit(1)

home = home.replace(
    old,
    '<section class="hero" id="home">',
    1
)


# ======================================================
# 2. ADD BUILD LAB ID
# ======================================================

old = '<section class="section build-lab-section">'

if old not in home:
    print("ERROR: Build Lab section not found.")
    sys.exit(1)

home = home.replace(
    old,
    '<section class="section build-lab-section" id="build-lab">',
    1
)


# ======================================================
# 3. ADD JOIN ID
# ======================================================

old = '<section class="section join-section">'

if old not in home:
    print("ERROR: Join section not found.")
    sys.exit(1)

home = home.replace(
    old,
    '<section class="section join-section" id="join">',
    1
)


# ======================================================
# 4. DIRECTORY + STATUS IDs
#
# Use their comments so we don't accidentally modify
# unrelated generic .section elements.
# ======================================================

directory_comment = """      <!-- ==============================================
           ECOSYSTEM DIRECTORY"""

directory_pos = home.find(directory_comment)

if directory_pos == -1:
    print("ERROR: Ecosystem Directory marker not found.")
    sys.exit(1)

directory_section_pos = home.find(
    '<section class="section">',
    directory_pos
)

if directory_section_pos == -1:
    print("ERROR: Ecosystem Directory section not found.")
    sys.exit(1)

home = (
    home[:directory_section_pos] +
    '<section class="section" id="directory">' +
    home[
        directory_section_pos +
        len('<section class="section">'):
    ]
)


status_comment = """      <!-- ==============================================
           LIVE ECOSYSTEM STATUS"""

status_pos = home.find(status_comment)

if status_pos == -1:
    print("ERROR: Live Ecosystem Status marker not found.")
    sys.exit(1)

status_section_pos = home.find(
    '<section class="section">',
    status_pos
)

if status_section_pos == -1:
    print("ERROR: Live Ecosystem Status section not found.")
    sys.exit(1)

home = (
    home[:status_section_pos] +
    '<section class="section" id="live-status">' +
    home[
        status_section_pos +
        len('<section class="section">'):
    ]
)


# ======================================================
# 5. INSERT QUICK HEADER BEFORE HERO
# ======================================================

hero_marker = '<section class="hero" id="home">'

header = r'''
      <!-- ==============================================
           SARLAYASH_QUICK_HEADER_V1
           ============================================== -->

      <header
        class="sy-quick-header"
        id="sy-quick-header"
      >

        <a
          class="sy-quick-brand"
          href="#home"
          aria-label="SarlaYash Home"
        >
          <strong>SY</strong>

          <span>
            SARLAYASH
            <small>MISSION 2026</small>
          </span>
        </a>


        <nav
          class="sy-quick-nav"
          aria-label="Quick navigation"
        >

          <a href="#home">
            HOME
          </a>

          <a href="#build-lab">
            BUILD LAB
          </a>

          <a href="#framework-universe">
            FRAMEWORKS
          </a>

          <a href="#join">
            JOIN
          </a>

          <a href="#directory">
            DIRECTORY
          </a>

          <a href="#live-status">
            LIVE STATUS
          </a>

        </nav>


        <div class="sy-quick-time">

          <span
            class="sy-live-dot"
            aria-hidden="true"
          ></span>

          <div>
            <strong id="sy-header-time">
              --:--:--
            </strong>

            <small id="sy-header-date">
              INDIA STANDARD TIME
            </small>
          </div>

        </div>

      </header>


'''

if hero_marker not in home:
    print("ERROR: Updated Hero marker unavailable.")
    sys.exit(1)

home = home.replace(
    hero_marker,
    header + hero_marker,
    1
)


# ======================================================
# 6. ADD TOP BUTTON
# ======================================================

top_button = r'''

      <button
        type="button"
        class="sy-back-top"
        id="sy-back-top"
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>

'''

# Insert before final closing template section.
# We use the framework activation comment as a safe JS-side
# boundary and insert HTML before the last template closing.
#
# Find the end of rendered markup before interaction code.

interaction_marker = """// ======================================================
// FRAMEWORK UNIVERSE INTERACTION"""

interaction_pos = home.find(interaction_marker)

if interaction_pos == -1:
    print("ERROR: Framework interaction marker not found.")
    sys.exit(1)

before_interactions = home[:interaction_pos]
after_interactions = home[interaction_pos:]

# Locate final </section> area is risky, so instead add button
# using JS dynamically. This guarantees valid markup.


# ======================================================
# 7. HEADER INTERACTION
# ======================================================

quick_js = r'''
// ======================================================
// SARLAYASH QUICK HEADER
// Navigation + IST clock + back-to-top utility.
// ======================================================

function activateSarlaYashQuickHeader() {

  const header =
    document.querySelector(
      '#sy-quick-header'
    );

  const timeNode =
    document.querySelector(
      '#sy-header-time'
    );

  const dateNode =
    document.querySelector(
      '#sy-header-date'
    );


  if (!header) {
    return;
  }


  // ----------------------------------------------------
  // IST CLOCK
  // ----------------------------------------------------

  const updateHeaderClock = () => {

    const now =
      new Date();


    if (timeNode) {

      timeNode.textContent =
        new Intl.DateTimeFormat(
          'en-IN',
          {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }
        ).format(now);

    }


    if (dateNode) {

      dateNode.textContent =
        new Intl.DateTimeFormat(
          'en-IN',
          {
            timeZone: 'Asia/Kolkata',
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }
        ).format(now)
        .toUpperCase() +
        ' · IST';

    }

  };


  updateHeaderClock();

  window.setInterval(
    updateHeaderClock,
    1000
  );


  // ----------------------------------------------------
  // SMOOTH NAVIGATION
  // ----------------------------------------------------

  const links =
    Array.from(
      header.querySelectorAll(
        'a[href^="#"]'
      )
    );


  links.forEach(link => {

    link.addEventListener(
      'click',
      event => {

        const targetId =
          link.getAttribute('href');


        if (
          !targetId ||
          targetId === '#'
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        const offset =
          header.offsetHeight + 18;


        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          offset;


        window.scrollTo({
          top,
          behavior: 'smooth'
        });

      }
    );

  });


  // ----------------------------------------------------
  // BACK TO TOP
  // ----------------------------------------------------

  const topButton =
    document.createElement(
      'button'
    );

  topButton.type = 'button';
  topButton.id = 'sy-back-top';
  topButton.className = 'sy-back-top';
  topButton.setAttribute(
    'aria-label',
    'Back to top'
  );

  topButton.innerHTML = '↑';

  document.body.appendChild(
    topButton
  );


  topButton.addEventListener(
    'click',
    () => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }
  );


  const updateHeaderState = () => {

    const scrolled =
      window.scrollY > 40;

    header.classList.toggle(
      'scrolled',
      scrolled
    );


    topButton.classList.toggle(
      'visible',
      window.scrollY > 700
    );

  };


  updateHeaderState();


  window.addEventListener(
    'scroll',
    updateHeaderState,
    {
      passive: true
    }
  );

}


activateSarlaYashQuickHeader();


'''

home = (
    before_interactions +
    quick_js +
    after_interactions
)


# ======================================================
# 8. CSS
# ======================================================

quick_css = r'''

/* =====================================================
   SARLAYASH QUICK HEADER V1
   ===================================================== */

html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;
}


.sy-quick-header {
  position: sticky;
  top: 0;
  z-index: 1000;

  display: grid;
  grid-template-columns:
    auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 26px;

  width: 100%;
  min-height: 68px;

  padding:
    10px
    clamp(18px, 4vw, 58px);

  border-bottom:
    1px solid rgba(214,177,93,.14);

  background:
    rgba(5,5,5,.86);

  backdrop-filter:
    blur(18px);

  -webkit-backdrop-filter:
    blur(18px);

  transition:
    min-height 180ms ease,
    background 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}


.sy-quick-header.scrolled {
  min-height: 58px;

  border-color:
    rgba(214,177,93,.25);

  background:
    rgba(4,4,4,.96);

  box-shadow:
    0 12px 35px
    rgba(0,0,0,.28);
}


.sy-quick-brand {
  display: flex;
  align-items: center;
  gap: 11px;

  color: var(--white);
  text-decoration: none;
}


.sy-quick-brand > strong {
  display: grid;
  place-items: center;

  width: 36px;
  height: 36px;

  border:
    1px solid rgba(214,177,93,.42);

  border-radius: 50%;

  color: var(--gold-bright);

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 12px;
  font-weight: 400;
  font-style: italic;

  background:
    radial-gradient(
      circle,
      rgba(214,177,93,.1),
      transparent 70%
    );
}


.sy-quick-brand > span {
  display: block;

  font-size: 9px;
  font-weight: 900;
  letter-spacing: .16em;
  white-space: nowrap;
}


.sy-quick-brand small {
  display: block;

  margin-top: 3px;

  color:
    rgba(214,177,93,.64);

  font-size: 6px;
  font-weight: 800;
  letter-spacing: .14em;
}


.sy-quick-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  min-width: 0;
}


.sy-quick-nav a {
  position: relative;

  padding: 10px 9px;

  color:
    rgba(255,255,255,.52);

  text-decoration: none;

  font-size: 7px;
  font-weight: 900;
  letter-spacing: .1em;
  white-space: nowrap;

  transition:
    color 160ms ease,
    background 160ms ease;
}


.sy-quick-nav a::after {
  content: "";

  position: absolute;
  left: 9px;
  right: 9px;
  bottom: 4px;

  height: 1px;

  background:
    var(--gold-bright);

  transform: scaleX(0);

  transform-origin:
    center;

  transition:
    transform 160ms ease;
}


.sy-quick-nav a:hover {
  color:
    var(--gold-bright);
}


.sy-quick-nav a:hover::after {
  transform: scaleX(1);
}


.sy-quick-time {
  display: flex;
  align-items: center;
  gap: 9px;

  min-width: 150px;

  padding-left: 17px;

  border-left:
    1px solid rgba(214,177,93,.15);
}


.sy-live-dot {
  position: relative;

  width: 6px;
  height: 6px;

  flex: 0 0 auto;

  border-radius: 50%;

  background:
    var(--gold-bright);

  box-shadow:
    0 0 12px
    rgba(214,177,93,.65);
}


.sy-live-dot::after {
  content: "";

  position: absolute;
  inset: -4px;

  border:
    1px solid rgba(214,177,93,.28);

  border-radius: 50%;

  animation:
    sy-live-pulse 2s infinite;
}


@keyframes sy-live-pulse {

  0% {
    transform: scale(.7);
    opacity: 1;
  }

  100% {
    transform: scale(1.8);
    opacity: 0;
  }

}


.sy-quick-time strong {
  display: block;

  color: var(--white);

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 13px;
  font-weight: 400;

  white-space: nowrap;
}


.sy-quick-time small {
  display: block;

  margin-top: 2px;

  color:
    rgba(214,177,93,.55);

  font-size: 6px;
  font-weight: 900;
  letter-spacing: .08em;

  white-space: nowrap;
}


.sy-back-top {
  position: fixed;

  right: 22px;
  bottom: 22px;

  z-index: 999;

  display: grid;
  place-items: center;

  width: 42px;
  height: 42px;

  border:
    1px solid rgba(214,177,93,.34);

  border-radius: 50%;

  color:
    var(--gold-bright);

  background:
    rgba(5,5,5,.9);

  backdrop-filter:
    blur(12px);

  font-size: 17px;

  cursor: pointer;

  opacity: 0;
  visibility: hidden;

  transform:
    translateY(10px);

  transition:
    opacity 180ms ease,
    visibility 180ms ease,
    transform 180ms ease,
    background 180ms ease;
}


.sy-back-top.visible {
  opacity: 1;
  visibility: visible;

  transform:
    translateY(0);
}


.sy-back-top:hover {
  background:
    rgba(214,177,93,.1);
}


/* -----------------------------------------------------
   TABLET
   ----------------------------------------------------- */

@media (max-width: 1050px) {

  .sy-quick-header {
    grid-template-columns:
      auto minmax(0, 1fr);
  }


  .sy-quick-time {
    display: none;
  }


  .sy-quick-nav {
    justify-content: flex-end;
  }

}


/* -----------------------------------------------------
   MOBILE
   ----------------------------------------------------- */

@media (max-width: 720px) {

  html {
    scroll-padding-top: 105px;
  }


  .sy-quick-header,
  .sy-quick-header.scrolled {
    display: flex;
    flex-wrap: wrap;

    gap: 4px;

    min-height: 0;

    padding:
      9px 14px 7px;
  }


  .sy-quick-brand {
    width: 100%;
  }


  .sy-quick-brand > strong {
    width: 30px;
    height: 30px;
  }


  .sy-quick-brand > span {
    font-size: 8px;
  }


  .sy-quick-nav {
    width: calc(100% + 28px);

    margin:
      4px -14px -7px;

    padding:
      0 14px 7px;

    justify-content: flex-start;

    overflow-x: auto;

    scrollbar-width: none;

    border-top:
      1px solid rgba(255,255,255,.05);
  }


  .sy-quick-nav::-webkit-scrollbar {
    display: none;
  }


  .sy-quick-nav a {
    padding:
      10px 9px 7px;

    font-size: 6px;
  }


  .sy-back-top {
    right: 14px;
    bottom: 14px;

    width: 38px;
    height: 38px;
  }

}


@media (prefers-reduced-motion: reduce) {

  html {
    scroll-behavior: auto;
  }


  .sy-live-dot::after {
    animation: none;
  }


  .sy-quick-header,
  .sy-quick-nav a,
  .sy-quick-nav a::after,
  .sy-back-top {
    transition: none;
  }

}

'''

css += quick_css


HOME.write_text(
    home,
    encoding="utf-8"
)

CSS.write_text(
    css,
    encoding="utf-8"
)


print()
print("SARLAYASH QUICK HEADER V1 ADDED")
print("================================")
print("Sticky quick navigation: ADDED")
print("Live IST date/time: ADDED")
print("Home anchor: ADDED")
print("Build Lab anchor: ADDED")
print("Framework Universe anchor: EXISTING / PRESERVED")
print("Join anchor: ADDED")
print("Directory anchor: ADDED")
print("Live Status anchor: ADDED")
print("Back-to-top control: ADDED")
print("Mobile horizontal navigation: ADDED")
print("Existing homepage content: PRESERVED")
print("Admin / Mission Control: UNTOUCHED")
print("Firebase / SMTP / Email: UNTOUCHED")
print()
print("NEXT: npm run build")