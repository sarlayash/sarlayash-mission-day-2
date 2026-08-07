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

# ------------------------------------------------------
# BACKUPS
# ------------------------------------------------------

shutil.copy2(HOME, BACKUPS / "home-BEFORE-FRAMEWORK-UNIVERSE.js")
shutil.copy2(CSS, BACKUPS / "home-BEFORE-FRAMEWORK-UNIVERSE.css")

home = HOME.read_text(encoding="utf-8")
css = CSS.read_text(encoding="utf-8")

# Prevent accidental double patching
if "SARLAYASH_FRAMEWORK_UNIVERSE_V1" in home:
    print("Framework Universe already exists. Nothing changed.")
    sys.exit(0)

# ------------------------------------------------------
# DATA + RENDERER
# Insert before ecosystemCards()
# ------------------------------------------------------

marker = "function ecosystemCards() {"

if marker not in home:
    print("ERROR: ecosystemCards() marker not found.")
    sys.exit(1)

framework_code = r'''
// ======================================================
// SARLAYASH_FRAMEWORK_UNIVERSE_V1
// Public portfolio catalogue.
// Counts are calculated from actual catalogue entries.
// ======================================================

const frameworkUniverse = [

  // CORE
  ['SarlaYash AI University Powered By Kapil', 'CORE', 'INITIATIVE'],
  ['SarlaYash Global Online Career University', 'CORE', 'INITIATIVE'],
  ['Pocket University Framework', 'CORE', 'FRAMEWORK'],
  ['LinkedIn-as-an-Internship Framework', 'CORE', 'FRAMEWORK'],
  ['LinkedIn Built-In-Public AI University', 'CORE', 'INITIATIVE'],
  ['Zero-To-Infinity Learning Framework', 'CORE', 'FRAMEWORK'],
  ['10% Theory + 90% Hands-On Framework', 'CORE', 'FRAMEWORK'],
  ['One Phone · One Social Media Account · Infinite Possibilities Framework', 'CORE', 'FRAMEWORK'],
  ['SarlaYash Blessings', 'CORE', 'INITIATIVE'],
  ['Internship-As-A-Service (IaaS) Framework', 'CORE', 'FRAMEWORK'],
  ['Plug-and-Play Learning Engineer Framework', 'CORE', 'FRAMEWORK'],
  ['Learning Intelligence Framework', 'CORE', 'FRAMEWORK'],
  ['Placement Readiness Framework', 'CORE', 'FRAMEWORK'],
  ['Batch Learning Intelligence Progress Framework', 'CORE', 'FRAMEWORK'],
  ['PIQ – Programming IQ Framework', 'CORE', 'FRAMEWORK'],

  // AI
  ['AI Ladder With Kapil | Powered By SarlaYash', 'AI', 'SERIES'],
  ['AI Ladder With Kapil | Students', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | Engineers', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | HR', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | Finance', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | CXO Suite', 'AI', 'LEARNING TRACK'],
  ['AI Ladder With Kapil | Self-Care', 'AI', 'SERIES'],
  ['AI Ladder With Kapil | Elderly Parents', 'AI', 'SERIES'],
  ['Zero To Agentic AI With Kapil', 'AI', 'SERIES'],
  ['A To Z Of OpenAI With Kapil | Powered By SarlaYash', 'AI', 'SERIES'],
  ['Generative AI Prompt Engineering With Kapil', 'AI', 'LEARNING TRACK'],
  ['Prompt Etiquette With Kapil', 'AI', 'SERIES'],
  ['Zero-To-Infinity AI Framework', 'AI', 'FRAMEWORK'],

  // ENGINEERING
  ['DSA Unfiltered With Kapil | Powered By SarlaYash', 'ENGINEERING', 'SERIES'],
  ['Python Programming With Kapil | Powered By SarlaYash', 'ENGINEERING', 'LEARNING TRACK'],
  ['Python + DSA Zero-To-Infinity Framework', 'ENGINEERING', 'FRAMEWORK'],
  ['Java DSA With Kapil', 'ENGINEERING', 'LEARNING TRACK'],
  ['DSA Zero-To-Infinity Series', 'ENGINEERING', 'SERIES'],
  ['Zero-To-Infinity Full-Stack Series', 'ENGINEERING', 'SERIES'],
  ['Algorithm Arena', 'ENGINEERING', 'EXPERIENCE'],
  ['Cogito', 'ENGINEERING', 'EXPERIENCE'],
  ['CodeVault 1.0', 'ENGINEERING', 'PRODUCT'],
  ['NOESIS', 'ENGINEERING', 'PRODUCT'],
  ['ORIGYN 1.0', 'ENGINEERING', 'PRODUCT'],
  ['PRISM-X', 'ENGINEERING', 'PRODUCT'],
  ['VoxSense 1.0', 'ENGINEERING', 'PRODUCT'],
  ['EchoVault', 'ENGINEERING', 'PRODUCT'],
  ['ChatTime', 'ENGINEERING', 'PRODUCT'],
  ['SarlaYash Connect App Powered By Kapil', 'ENGINEERING', 'PRODUCT'],
  ['ATS Friendly Resume Builder', 'ENGINEERING', 'PRODUCT'],

  // CAREER
  ['Polish Aptitude With Kapil | Powered By SarlaYash', 'CAREER', 'SERIES'],
  ['Placement Readiness With Kapil', 'CAREER', 'LEARNING TRACK'],
  ['Programming IQ – PIQ 1.0', 'CAREER', 'EXPERIENCE'],
  ['Programming IQ – PIQ 2.0', 'CAREER', 'EXPERIENCE'],
  ['Learning Intelligence Performance Card', 'CAREER', 'PRODUCT'],
  ['Career Path Intelligence Framework', 'CAREER', 'FRAMEWORK'],
  ['Placement Readiness Intelligence Framework', 'CAREER', 'FRAMEWORK'],

  // CORPORATE
  ['HR Mirror With Kapil', 'CORPORATE', 'SERIES'],
  ['Mysteries Of POSH With Kapil', 'CORPORATE', 'SERIES'],
  ['Mind Your Words With Kapil', 'CORPORATE', 'SERIES'],
  ['CEO Mindset With Kapil', 'CORPORATE', 'SERIES'],
  ['Beyond Code With Kapil', 'CORPORATE', 'SERIES'],
  ['Design Thinking With Kapil', 'CORPORATE', 'LEARNING TRACK'],
  ['PMP With Kapil', 'CORPORATE', 'LEARNING TRACK'],
  ['ITIL With Kapil', 'CORPORATE', 'LEARNING TRACK'],
  ['Sales & Marketing With Kapil', 'CORPORATE', 'LEARNING TRACK'],

  // BFSI
  ['BFSI Edge With Kapil', 'BFSI', 'SERIES'],
  ['Debt Recovery Agents Behaviour Skills With Kapil', 'BFSI', 'LEARNING TRACK'],
  ['Emotional Intelligence With Kapil', 'BFSI', 'LEARNING TRACK'],
  ['Telephone Etiquettes With Kapil', 'BFSI', 'LEARNING TRACK'],
  ['Emotional ATM Framework', 'BFSI', 'FRAMEWORK'],
  ['DRA Behaviour Skills Framework', 'BFSI', 'FRAMEWORK'],

  // CLOUD
  ['AZ-900 With Kapil', 'CLOUD', 'LEARNING TRACK'],
  ['AZ-104 With Kapil', 'CLOUD', 'LEARNING TRACK'],
  ['DP-300 With Kapil', 'CLOUD', 'LEARNING TRACK'],

  // DATA
  ['Zero-To-Infinity Data Analytics Series', 'DATA', 'SERIES'],
  ['Excel With Kapil', 'DATA', 'LEARNING TRACK'],
  ['Power BI With Kapil', 'DATA', 'LEARNING TRACK'],
  ['Tally Prime With Kapil', 'DATA', 'LEARNING TRACK'],
  ['Tally Prime With Cloud AI', 'DATA', 'LEARNING TRACK'],

  // TECHNOLOGY
  ['Ethical Hacking Zero-To-Infinity Series', 'TECHNOLOGY', 'SERIES'],

  // THOUGHT LEADERSHIP
  ['Founder’s Life', 'THOUGHT LEADERSHIP', 'SERIES'],
  ['Indianism Series', 'THOUGHT LEADERSHIP', 'SERIES'],
  ['Mindful Fun Friday', 'THOUGHT LEADERSHIP', 'SERIES'],
  ['Mind Your Words Tuesday', 'THOUGHT LEADERSHIP', 'SERIES'],
  ['One Rupee Full-Stack CEO Framework', 'THOUGHT LEADERSHIP', 'FRAMEWORK'],

  // GOVERNANCE
  ['SarlaYash Right To Disconnect Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash Parental Care Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash 4-Day Work Week Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash Zero Biases Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash Information Security Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash LinkedIn Posting Framework', 'GOVERNANCE', 'GOVERNANCE'],
  ['SarlaYash Anti-Money Laundering & Gift Framework', 'GOVERNANCE', 'GOVERNANCE'],

  // COMMUNITY
  ['SarlaYash Global Full Stack Marathon', 'COMMUNITY', 'EXPERIENCE'],
  ['SarlaYash Blessings Hackathon', 'COMMUNITY', 'EXPERIENCE'],
  ['SarlaYash Legacy Conclave', 'COMMUNITY', 'EXPERIENCE'],
  ['Gratitude LinkedIn Global University Powered By SarlaYash', 'COMMUNITY', 'INITIATIVE']

].map(([name, category, type], index) => ({
  id: index + 1,
  name,
  category,
  type
}));


const frameworkSpotlights = [
  {
    code: '01',
    name: 'Zero-To-Infinity',
    text: 'A learning philosophy built around beginning from first principles and progressing through execution.'
  },
  {
    code: '02',
    name: '10% Theory · 90% Hands-On',
    text: 'A practice-led approach where explanation supports action, building and evidence.'
  },
  {
    code: '03',
    name: 'Pocket University',
    text: 'A learning architecture centred on accessible, portable and continuously available learning.'
  },
  {
    code: '04',
    name: 'LinkedIn-as-an-Internship',
    text: 'A built-in-public approach connecting learning, documentation, professional presence and visible work.'
  },
  {
    code: '05',
    name: 'Plug-and-Play Learning Engineer',
    text: 'A framework focused on preparing learners to understand unfamiliar environments and begin contributing.'
  },
  {
    code: '06',
    name: 'Learning Intelligence',
    text: 'A framework for observing learning through progress, evidence, reflection and readiness signals.'
  }
];


function frameworkCards(items = frameworkUniverse) {

  return items.map(item => `
    <article
      class="framework-card"
      data-framework-category="${item.category}"
      data-framework-type="${item.type}"
      data-framework-name="${item.name.toLowerCase()}"
    >
      <div class="framework-card-top">
        <span>${item.category}</span>
        <small>${String(item.id).padStart(2, '0')}</small>
      </div>

      <h3>${item.name}</h3>

      <div class="framework-card-bottom">
        <span class="framework-type">${item.type}</span>
        <span class="framework-mark">SY</span>
      </div>
    </article>
  `).join('');

}


function frameworkSpotlightCards() {

  return frameworkSpotlights.map(item => `
    <article class="framework-spotlight-card">
      <span>${item.code}</span>
      <h3>${item.name}</h3>
      <p>${item.text}</p>
    </article>
  `).join('');

}

'''

home = home.replace(marker, framework_code + "\n" + marker, 1)

# ------------------------------------------------------
# SECTION
# Insert immediately before Wish To Join
# ------------------------------------------------------

join_marker = """      <!-- ==============================================
           WISH TO JOIN SARLAYASH"""

if join_marker not in home:
    print("ERROR: Wish To Join insertion marker not found.")
    sys.exit(1)

framework_section = r'''
      <!-- ==============================================
           SARLAYASH FRAMEWORK UNIVERSE
           ============================================== -->

      <section
        class="section framework-universe-section"
        id="framework-universe"
      >

        <div class="framework-orbit" aria-hidden="true"></div>

        <div class="framework-universe-head">

          <div>

            <p class="section-label">
              SARLAYASH FRAMEWORK UNIVERSE
            </p>

            <p class="framework-powered">
              POWERED BY KAPIL
            </p>

            <h2>
              Ideas become frameworks.
              <em>Frameworks become experiences.</em>
              Experiences become evidence.
            </h2>

          </div>

          <div class="framework-universe-copy">

            <p>
              A living portfolio of learning architectures,
              AI pathways, career systems, professional learning
              models, technology tracks, governance philosophies
              and experiential initiatives created across the
              SarlaYash ecosystem.
            </p>

            <div class="evidence-statement">
              BUILT · EXECUTED · DOCUMENTED · EVOLVING
            </div>

          </div>

        </div>


        <div class="framework-truth-strip">

          <span>
            <strong id="framework-total">
              ${frameworkUniverse.length}
            </strong>
            CATALOGUED ASSETS
          </span>

          <span>
            <strong>
              ${new Set(frameworkUniverse.map(item => item.category)).size}
            </strong>
            DOMAINS
          </span>

          <span>
            <strong>EVIDENCE</strong>
            OVER VANITY
          </span>

          <span>
            <strong>PUBLIC</strong>
            DISCOVERY
          </span>

        </div>


        <div class="framework-foundations">

          <div class="framework-subhead">

            <div>
              <small>FOUNDATIONAL ARCHITECTURES</small>

              <h3>
                The thinking behind
                <em>the ecosystem.</em>
              </h3>
            </div>

            <p>
              Learning principles and operating ideas that
              influence how SarlaYash designs experiences.
            </p>

          </div>

          <div class="framework-spotlight-grid">
            ${frameworkSpotlightCards()}
          </div>

        </div>


        <div class="framework-catalogue">

          <div class="framework-subhead catalogue-head">

            <div>
              <small>THE LIVING PORTFOLIO</small>

              <h3>
                Explore the
                <em>Framework Universe.</em>
              </h3>
            </div>

            <p>
              Search by name or explore a domain.
              The displayed total is calculated directly
              from the catalogue.
            </p>

          </div>


          <div class="framework-tools">

            <label class="framework-search">

              <span>SEARCH</span>

              <input
                id="framework-search-input"
                type="search"
                placeholder="Search frameworks, tracks, products, series..."
                autocomplete="off"
              >

            </label>


            <button
              type="button"
              class="framework-reset"
              id="framework-reset"
            >
              RESET
            </button>

          </div>


          <div
            class="framework-filters"
            id="framework-filters"
            aria-label="Framework categories"
          >

            ${[
              'ALL',
              'CORE',
              'AI',
              'ENGINEERING',
              'CAREER',
              'CORPORATE',
              'BFSI',
              'CLOUD',
              'DATA',
              'TECHNOLOGY',
              'GOVERNANCE',
              'THOUGHT LEADERSHIP',
              'COMMUNITY'
            ].map((category, index) => `
              <button
                type="button"
                data-framework-filter="${category}"
                class="${index === 0 ? 'active' : ''}"
              >
                ${category}
              </button>
            `).join('')}

          </div>


          <div class="framework-results-bar">

            <span id="framework-showing">
              SHOWING ${frameworkUniverse.length}
              OF ${frameworkUniverse.length}
            </span>

            <span>
              No vanity numbers. The portfolio is the evidence.
            </span>

          </div>


          <div
            class="framework-grid"
            id="framework-grid"
          >
            ${frameworkCards()}
          </div>


          <div
            class="framework-empty"
            id="framework-empty"
            hidden
          >
            No catalogue entry matches this search.
          </div>

        </div>

      </section>


'''

home = home.replace(
    join_marker,
    framework_section + join_marker,
    1
)

# ------------------------------------------------------
# ACTIVATION JS
# Insert before visitor intelligence activation
# ------------------------------------------------------

activation_marker = "activateVisitorIntelligence();"

if activation_marker not in home:
    print("ERROR: visitor activation marker not found.")
    sys.exit(1)

activation_code = r'''
// ======================================================
// FRAMEWORK UNIVERSE INTERACTION
// ======================================================

function activateFrameworkUniverse() {

  const search =
    document.querySelector(
      '#framework-search-input'
    );

  const grid =
    document.querySelector(
      '#framework-grid'
    );

  const showing =
    document.querySelector(
      '#framework-showing'
    );

  const empty =
    document.querySelector(
      '#framework-empty'
    );

  const reset =
    document.querySelector(
      '#framework-reset'
    );

  const filterButtons =
    Array.from(
      document.querySelectorAll(
        '[data-framework-filter]'
      )
    );


  if (
    !search ||
    !grid ||
    !showing
  ) {
    return;
  }


  let activeCategory = 'ALL';


  const applyFrameworkFilters = () => {

    const query =
      search.value
        .trim()
        .toLowerCase();


    const filtered =
      frameworkUniverse.filter(item => {

        const categoryMatch =
          activeCategory === 'ALL' ||
          item.category === activeCategory;

        const searchMatch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query);

        return categoryMatch && searchMatch;

      });


    grid.innerHTML =
      frameworkCards(filtered);


    showing.textContent =
      `SHOWING ${filtered.length} OF ${frameworkUniverse.length}`;


    if (empty) {
      empty.hidden =
        filtered.length !== 0;
    }

  };


  search.addEventListener(
    'input',
    applyFrameworkFilters
  );


  filterButtons.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        activeCategory =
          button.dataset.frameworkFilter ||
          'ALL';


        filterButtons.forEach(item =>
          item.classList.toggle(
            'active',
            item === button
          )
        );


        applyFrameworkFilters();

      }
    );

  });


  if (reset) {

    reset.addEventListener(
      'click',
      () => {

        search.value = '';
        activeCategory = 'ALL';

        filterButtons.forEach(button =>
          button.classList.toggle(
            'active',
            button.dataset.frameworkFilter === 'ALL'
          )
        );

        applyFrameworkFilters();

        search.focus();

      }
    );

  }

}


activateFrameworkUniverse();

'''

home = home.replace(
    activation_marker,
    activation_code + "\n" + activation_marker,
    1
)

# ------------------------------------------------------
# CSS
# ------------------------------------------------------

framework_css = r'''

/* =====================================================
   SARLAYASH FRAMEWORK UNIVERSE V1
   ===================================================== */

.framework-universe-section {
  position: relative;
  overflow: hidden;
  padding-top: 110px;
  padding-bottom: 110px;
  isolation: isolate;
}

.framework-universe-section::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    linear-gradient(
      rgba(214,177,93,.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(214,177,93,.025) 1px,
      transparent 1px
    );
  background-size: 72px 72px;
  mask-image:
    linear-gradient(
      to bottom,
      transparent,
      #000 15%,
      #000 85%,
      transparent
    );
}

.framework-universe-section::after {
  content: "";
  position: absolute;
  width: 700px;
  height: 700px;
  right: -320px;
  top: 100px;
  z-index: -1;
  border-radius: 50%;
  pointer-events: none;
  background:
    radial-gradient(
      circle,
      rgba(214,177,93,.08),
      rgba(214,177,93,.018) 38%,
      transparent 68%
    );
}

.framework-orbit {
  position: absolute;
  width: 440px;
  height: 440px;
  right: -170px;
  top: 170px;
  z-index: -1;
  border:
    1px solid rgba(214,177,93,.11);
  border-radius: 50%;
  pointer-events: none;
}

.framework-orbit::before,
.framework-orbit::after {
  content: "";
  position: absolute;
  border:
    1px solid rgba(214,177,93,.08);
  border-radius: 50%;
}

.framework-orbit::before {
  inset: 55px;
}

.framework-orbit::after {
  inset: 120px;
}

.framework-universe-head {
  display: grid;
  grid-template-columns:
    minmax(0, 1.35fr)
    minmax(280px, .65fr);
  gap: 70px;
  align-items: end;
}

.framework-universe-head h2 {
  max-width: 880px;
  margin: 14px 0 0;
  color: var(--white);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size:
    clamp(38px, 5.4vw, 76px);
  font-weight: 400;
  line-height: .98;
  letter-spacing: -.045em;
}

.framework-universe-head h2 em {
  display: block;
  color: var(--gold-bright);
  font-weight: 400;
}

.framework-powered {
  margin: 8px 0 0;
  color: rgba(214,177,93,.7);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .24em;
}

.framework-universe-copy p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.85;
}

.evidence-statement {
  margin-top: 24px;
  padding-top: 17px;
  border-top:
    1px solid rgba(214,177,93,.16);
  color: var(--gold-bright);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .15em;
}

.framework-truth-strip {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  margin-top: 62px;
  border-top:
    1px solid rgba(214,177,93,.18);
  border-bottom:
    1px solid rgba(214,177,93,.18);
}

.framework-truth-strip span {
  min-height: 94px;
  padding: 22px;
  border-right:
    1px solid rgba(214,177,93,.12);
  color: var(--muted);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .12em;
}

.framework-truth-strip span:last-child {
  border-right: 0;
}

.framework-truth-strip strong {
  display: block;
  margin-bottom: 7px;
  color: var(--white);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -.02em;
}

.framework-foundations,
.framework-catalogue {
  margin-top: 90px;
}

.framework-subhead {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 40px;
  margin-bottom: 30px;
}

.framework-subhead small {
  color: var(--gold);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .18em;
}

.framework-subhead h3 {
  margin: 9px 0 0;
  color: var(--white);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size:
    clamp(28px, 3vw, 44px);
  font-weight: 400;
  line-height: 1.05;
}

.framework-subhead h3 em {
  color: var(--gold-bright);
  font-weight: 400;
}

.framework-subhead > p {
  max-width: 430px;
  margin: 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}

.framework-spotlight-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  border-top:
    1px solid rgba(214,177,93,.18);
  border-left:
    1px solid rgba(214,177,93,.18);
}

.framework-spotlight-card {
  position: relative;
  min-height: 225px;
  padding: 28px;
  border-right:
    1px solid rgba(214,177,93,.18);
  border-bottom:
    1px solid rgba(214,177,93,.18);
  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.022),
      rgba(214,177,93,.018)
    );
  transition:
    transform 200ms ease,
    background 200ms ease;
}

.framework-spotlight-card:hover {
  transform: translateY(-3px);
  background:
    linear-gradient(
      145deg,
      rgba(214,177,93,.065),
      rgba(255,255,255,.02)
    );
}

.framework-spotlight-card > span {
  color: rgba(214,177,93,.58);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .14em;
}

.framework-spotlight-card h3 {
  max-width: 280px;
  margin: 44px 0 13px;
  color: var(--white);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 23px;
  font-weight: 400;
  line-height: 1.1;
}

.framework-spotlight-card p {
  max-width: 330px;
  margin: 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.7;
}

.framework-tools {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.framework-search {
  display: flex;
  align-items: center;
  flex: 1;
  min-height: 54px;
  padding: 0 18px;
  border:
    1px solid rgba(214,177,93,.2);
  border-radius: 10px;
  background: rgba(255,255,255,.018);
}

.framework-search span {
  flex: 0 0 auto;
  margin-right: 16px;
  color: var(--gold);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .14em;
}

.framework-search input {
  width: 100%;
  border: 0;
  outline: 0;
  color: var(--white);
  background: transparent;
  font: inherit;
  font-size: 11px;
}

.framework-search input::placeholder {
  color: rgba(255,255,255,.3);
}

.framework-reset {
  min-width: 92px;
  border:
    1px solid rgba(214,177,93,.22);
  border-radius: 10px;
  color: var(--gold-bright);
  background: rgba(214,177,93,.035);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .12em;
  cursor: pointer;
}

.framework-filters {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding: 15px 0 5px;
  scrollbar-width: thin;
}

.framework-filters button {
  flex: 0 0 auto;
  padding: 9px 12px;
  border:
    1px solid rgba(255,255,255,.09);
  border-radius: 999px;
  color: var(--muted);
  background: transparent;
  font-size: 7px;
  font-weight: 900;
  letter-spacing: .09em;
  cursor: pointer;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.framework-filters button:hover,
.framework-filters button.active {
  color: #080808;
  border-color: var(--gold-bright);
  background: var(--gold-bright);
}

.framework-results-bar {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 0 13px;
  color: rgba(255,255,255,.38);
  font-size: 7px;
  font-weight: 800;
  letter-spacing: .11em;
}

.framework-results-bar span:first-child {
  color: var(--gold);
}

.framework-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  border-top:
    1px solid rgba(255,255,255,.08);
  border-left:
    1px solid rgba(255,255,255,.08);
}

.framework-card {
  display: flex;
  flex-direction: column;
  min-height: 205px;
  padding: 22px;
  border-right:
    1px solid rgba(255,255,255,.08);
  border-bottom:
    1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.012);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.framework-card:hover {
  position: relative;
  z-index: 2;
  transform: translateY(-3px);
  border-color: rgba(214,177,93,.3);
  background: rgba(214,177,93,.035);
}

.framework-card-top,
.framework-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.framework-card-top {
  color: var(--gold);
  font-size: 7px;
  font-weight: 900;
  letter-spacing: .11em;
}

.framework-card-top small {
  color: rgba(255,255,255,.25);
  font-size: 7px;
}

.framework-card h3 {
  margin: 38px 0 35px;
  color: var(--white);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.25;
}

.framework-card-bottom {
  margin-top: auto;
}

.framework-type {
  padding: 6px 8px;
  border:
    1px solid rgba(214,177,93,.18);
  border-radius: 999px;
  color: rgba(214,177,93,.75);
  font-size: 6px;
  font-weight: 900;
  letter-spacing: .1em;
}

.framework-mark {
  color: rgba(255,255,255,.16);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 12px;
  font-style: italic;
}

.framework-empty {
  padding: 60px 20px;
  border:
    1px solid rgba(214,177,93,.15);
  color: var(--muted);
  text-align: center;
  font-size: 10px;
  letter-spacing: .08em;
}


@media (max-width: 1100px) {

  .framework-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

}


@media (max-width: 900px) {

  .framework-universe-head {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .framework-truth-strip {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .framework-truth-strip span:nth-child(2) {
    border-right: 0;
  }

  .framework-spotlight-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .framework-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

}


@media (max-width: 620px) {

  .framework-universe-section {
    padding-top: 78px;
    padding-bottom: 78px;
  }

  .framework-universe-head h2 {
    font-size:
      clamp(38px, 12vw, 54px);
  }

  .framework-truth-strip {
    grid-template-columns: 1fr 1fr;
  }

  .framework-truth-strip span {
    min-height: 82px;
    padding: 17px;
  }

  .framework-subhead {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }

  .framework-spotlight-grid,
  .framework-grid {
    grid-template-columns: 1fr;
  }

  .framework-spotlight-card {
    min-height: 200px;
  }

  .framework-tools {
    flex-direction: column;
  }

  .framework-reset {
    min-height: 44px;
  }

  .framework-results-bar {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .framework-card {
    min-height: 180px;
  }

}


@media (prefers-reduced-motion: reduce) {

  .framework-card,
  .framework-spotlight-card,
  .framework-filters button {
    transition: none;
  }

  .framework-card:hover,
  .framework-spotlight-card:hover {
    transform: none;
  }

}

'''

css += framework_css

HOME.write_text(home, encoding="utf-8")
CSS.write_text(css, encoding="utf-8")

print()
print("SARLAYASH FRAMEWORK UNIVERSE V1 ADDED")
print("=====================================")
print("Existing homepage: PRESERVED")
print("Build Lab: PRESERVED")
print("Wish To Join: PRESERVED")
print("Visitor Intelligence: PRESERVED")
print("Admin / Mission Control: UNTOUCHED")
print("Email Engine: UNTOUCHED")
print("Framework catalogue: DATA DRIVEN")
print("Search: ADDED")
print("Category filters: ADDED")
print("Responsive design: ADDED")
print()
print("NEXT: npm run build")