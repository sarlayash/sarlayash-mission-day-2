from pathlib import Path
import sys

HOME = Path("src/home.js")
CSS = Path("src/home.css")

home = HOME.read_text(encoding="utf-8")
css = CSS.read_text(encoding="utf-8")

if "SARLAYASH_THEME_TOGGLE_V1" in home:
    print("Theme toggle already installed.")
    sys.exit(0)

# ------------------------------------------------------
# ADD TOGGLE BEFORE HEADER TIME
# ------------------------------------------------------

marker = '<div class="sy-quick-time">'

if marker not in home:
    print("ERROR: Quick header time block not found.")
    sys.exit(1)

toggle = r'''
        <!-- SARLAYASH_THEME_TOGGLE_V1 -->

        <button
          type="button"
          class="sy-theme-toggle"
          id="sy-theme-toggle"
          aria-label="Switch colour theme"
          title="Switch colour theme"
        >
          <span id="sy-theme-icon">☀</span>
          <small id="sy-theme-label">LIGHT</small>
        </button>


'''

home = home.replace(
    marker,
    toggle + marker,
    1
)

# ------------------------------------------------------
# ADD THEME ENGINE BEFORE QUICK HEADER ACTIVATION
# ------------------------------------------------------

marker = "function activateSarlaYashQuickHeader() {"

if marker not in home:
    print("ERROR: Quick Header function not found.")
    sys.exit(1)

theme_js = r'''
// ======================================================
// SARLAYASH THEME ENGINE
// ======================================================

function activateSarlaYashTheme() {

  const button =
    document.querySelector('#sy-theme-toggle');

  const icon =
    document.querySelector('#sy-theme-icon');

  const label =
    document.querySelector('#sy-theme-label');


  if (!button) {
    return;
  }


  const applyTheme = theme => {

    const light =
      theme === 'light';

    document.documentElement
      .setAttribute(
        'data-theme',
        light ? 'light' : 'dark'
      );

    if (icon) {
      icon.textContent =
        light ? '🌙' : '☀';
    }

    if (label) {
      label.textContent =
        light ? 'DARK' : 'LIGHT';
    }

    button.setAttribute(
      'aria-label',
      light
        ? 'Switch to dark mode'
        : 'Switch to light mode'
    );

  };


  let savedTheme = 'dark';

  try {

    savedTheme =
      localStorage.getItem(
        'sarlayash-theme'
      ) || 'dark';

  } catch {
    savedTheme = 'dark';
  }


  applyTheme(savedTheme);


  button.addEventListener(
    'click',
    () => {

      const current =
        document.documentElement
          .getAttribute('data-theme');

      const next =
        current === 'light'
          ? 'dark'
          : 'light';

      applyTheme(next);

      try {

        localStorage.setItem(
          'sarlayash-theme',
          next
        );

      } catch {
        // Theme still works without persistence.
      }

    }
  );

}


'''

home = home.replace(
    marker,
    theme_js + marker,
    1
)

# Activate theme before header behaviour.

activation_marker = "activateSarlaYashQuickHeader();"

if activation_marker not in home:
    print("ERROR: Quick Header activation not found.")
    sys.exit(1)

home = home.replace(
    activation_marker,
    """activateSarlaYashTheme();
activateSarlaYashQuickHeader();""",
    1
)

# ------------------------------------------------------
# CSS
# ------------------------------------------------------

theme_css = r'''

/* =====================================================
   SARLAYASH THEME TOGGLE V1
   ===================================================== */

.sy-theme-toggle {
  display: flex;
  align-items: center;
  gap: 7px;

  padding: 8px 10px;

  border:
    1px solid rgba(214,177,93,.22);

  border-radius: 999px;

  color: var(--gold-bright);

  background:
    rgba(214,177,93,.035);

  cursor: pointer;

  transition:
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
}


.sy-theme-toggle:hover {
  transform: translateY(-1px);

  border-color:
    rgba(214,177,93,.46);

  background:
    rgba(214,177,93,.08);
}


.sy-theme-toggle span {
  font-size: 12px;
  line-height: 1;
}


.sy-theme-toggle small {
  color: inherit;

  font-size: 6px;
  font-weight: 900;
  letter-spacing: .1em;
}


/* =====================================================
   SARLAYASH LIGHT MODE
   Warm Ivory + Charcoal + Gold
   ===================================================== */

html[data-theme="light"] {
  --black: #f7f3e9;
  --white: #171717;
  --muted: #665f54;

  color-scheme: light;
}


html[data-theme="light"] body {
  color: #171717;

  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(180,140,55,.09),
      transparent 35%
    ),
    #f7f3e9;
}


html[data-theme="light"] .sy-quick-header,
html[data-theme="light"] .sy-quick-header.scrolled {
  background:
    rgba(250,247,239,.94);

  border-bottom-color:
    rgba(145,108,30,.22);

  box-shadow:
    0 10px 32px
    rgba(70,55,25,.08);
}


html[data-theme="light"] .sy-quick-brand {
  color: #171717;
}


html[data-theme="light"] .sy-quick-nav a {
  color:
    rgba(20,20,20,.62);
}


html[data-theme="light"] .sy-quick-nav a:hover {
  color: #8c681d;
}


html[data-theme="light"] .sy-quick-time strong {
  color: #171717;
}


html[data-theme="light"] .sy-theme-toggle {
  color: #7d5b16;

  border-color:
    rgba(125,91,22,.25);

  background:
    rgba(125,91,22,.05);
}


/*
   Broad surface conversion.
   Existing structure remains untouched.
*/

html[data-theme="light"] section,
html[data-theme="light"] main {
  color: #171717;
}


html[data-theme="light"] h1,
html[data-theme="light"] h2,
html[data-theme="light"] h3,
html[data-theme="light"] h4,
html[data-theme="light"] strong {
  color: #171717;
}


html[data-theme="light"] p {
  color: #625d54;
}


html[data-theme="light"] .project-card,
html[data-theme="light"] .ecosystem-card,
html[data-theme="light"] .framework-card,
html[data-theme="light"] .join-step,
html[data-theme="light"] .github-gateway {
  background:
    rgba(255,255,255,.52);

  border-color:
    rgba(135,100,25,.18);

  box-shadow:
    0 12px 34px
    rgba(80,60,20,.045);
}


html[data-theme="light"] input,
html[data-theme="light"] select,
html[data-theme="light"] textarea {
  color: #171717;

  background:
    rgba(255,255,255,.7);

  border-color:
    rgba(125,91,22,.22);
}


html[data-theme="light"] .sy-back-top {
  color: #7d5b16;

  background:
    rgba(250,247,239,.95);

  border-color:
    rgba(125,91,22,.28);
}


@media (max-width: 1050px) {

  .sy-theme-toggle {
    margin-left: auto;
  }

}


@media (max-width: 720px) {

  .sy-theme-toggle {
    position: absolute;

    top: 9px;
    right: 14px;

    min-height: 30px;
  }

}

'''

css += theme_css

HOME.write_text(
    home,
    encoding="utf-8"
)

CSS.write_text(
    css,
    encoding="utf-8"
)

print()
print("SARLAYASH DARK / LIGHT MODE ADDED")
print("=================================")
print("Current Dark Mode: PRESERVED")
print("Premium Light Mode: ADDED")
print("Header Toggle: ADDED")
print("Theme Memory: ADDED")
print("Mobile Support: ADDED")
print("Homepage Content: UNTOUCHED")
print("Framework Universe: UNTOUCHED")
print("Build Lab: UNTOUCHED")
print("Admin / Mission Control: UNTOUCHED")
print("Firebase / SMTP / Email: UNTOUCHED")
print()
print("NEXT: npm run build")