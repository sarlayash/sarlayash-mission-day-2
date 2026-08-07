from pathlib import Path

HOME_JS = Path("src/home.js")
HOME_CSS = Path("src/home.css")

js = HOME_JS.read_text(encoding="utf-8")
css = HOME_CSS.read_text(encoding="utf-8")

marker = """      <!-- ==============================================
           WISH TO JOIN SARLAYASH
           ============================================== -->"""

if marker not in js:
    raise RuntimeError("WISH TO JOIN insertion marker not found")

if "SARLAYASH BUILD LAB" in js:
    raise RuntimeError("Project Showcase already exists")


showcase = r'''
      <!-- ==============================================
           SARLAYASH BUILD LAB
           ============================================== -->

      <section class="section build-lab-section">

        <div class="build-lab-intro">

          <p class="section-label">
            SARLAYASH BUILD LAB
          </p>

          <h2>
            Don't Take Our Word For It.
            <em>Explore What We've Built.</em>
          </h2>

          <p class="build-lab-lead">
            Before you ask to join SarlaYash, explore the work.
            These public repositories represent learning
            environments, engineering experiments, credential
            systems, mission platforms and digital experiences
            built openly through the SarlaYash ecosystem.
          </p>

          <div class="build-lab-stats">

            <span>
              <strong>11</strong>
              PUBLIC REPOSITORIES
            </span>

            <span>
              <strong>100%</strong>
              BUILD IN PUBLIC
            </span>

            <span>
              <strong>01</strong>
              ECOSYSTEM
            </span>

          </div>

        </div>


        <div class="project-grid">


          <article class="project-card project-featured">

            <div class="project-index">01</div>

            <small>LEARNING LAB</small>

            <h3>
              Tally Prime Zero-Infinity Lab
            </h3>

            <p>
              A SarlaYash public build focused on applied,
              experience-driven learning around Tally Prime.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/tally-prime-zero-infinity-lab"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card project-featured">

            <div class="project-index">02</div>

            <small>MISSION PLATFORM</small>

            <h3>
              SarlaYash Mission Day 2
            </h3>

            <p>
              Mission-based learning, evidence submission,
              progression, administration and credential
              infrastructure.
            </p>

            <div class="project-actions">

              <a
                class="project-live"
                href="https://sarlayash-mission-day-2.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE EXPERIENCE ↗
              </a>

              <a
                href="https://github.com/sarlayash/sarlayash-mission-day-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">03</div>

            <small>ONBOARDING EXPERIENCE</small>

            <h3>
              SarlaYash Onboarding Day 1
            </h3>

            <p>
              The first-day SarlaYash onboarding experience
              designed to introduce learners to the ecosystem.
            </p>

            <div class="project-actions">

              <a
                class="project-live"
                href="https://sarlayash.github.io/SarlaYash_Onboarding_Day1/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE EXPERIENCE ↗
              </a>

              <a
                href="https://github.com/sarlayash/SarlaYash_Onboarding_Day1"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">04</div>

            <small>CREDENTIAL INFRASTRUCTURE</small>

            <h3>
              CertiVault Enterprise
            </h3>

            <p>
              A public SarlaYash engineering project exploring
              digital credential infrastructure and enterprise
              credential experiences.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/certivault-enterprise"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">05</div>

            <small>ENGINEERING EXPERIENCE</small>

            <h3>
              Platform Commander
            </h3>

            <p>
              A SarlaYash public engineering build from the
              growing portfolio of hands-on digital learning
              experiences.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/platform-commander"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">06</div>

            <small>ALGORITHM LEARNING</small>

            <h3>
              Complexity Master
            </h3>

            <p>
              A public project focused on making computational
              complexity and algorithmic thinking more
              experience-driven.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/complexity-master"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">07</div>

            <small>ENGINEERING LEARNING</small>

            <h3>
              Code Architect
            </h3>

            <p>
              A SarlaYash public build exploring engineering,
              problem solving and code-oriented learning.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/code-architect"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">08</div>

            <small>PROBLEM SOLVING</small>

            <h3>
              Pattern Detective
            </h3>

            <p>
              An experiential public build around pattern
              recognition, observation and computational
              problem-solving.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/pattern-detective"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">09</div>

            <small>DSA EXPERIENCE</small>

            <h3>
              DSAgram Powered By Kapil
            </h3>

            <p>
              A public SarlaYash project exploring a different
              experience for learning and engaging with Data
              Structures and Algorithms.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/dsagram-powered-by-kapil"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">10</div>

            <small>SARLAYASH EXPERIENCE</small>

            <h3>
              SarlaYash Blessings
            </h3>

            <p>
              A live public SarlaYash digital experience,
              available both as a deployed application and
              open repository.
            </p>

            <div class="project-actions">

              <a
                class="project-live"
                href="https://sarlayash-blessings.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE EXPERIENCE ↗
              </a>

              <a
                href="https://github.com/sarlayash/sarlayash-blessings"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


          <article class="project-card">

            <div class="project-index">11</div>

            <small>PUBLIC REPOSITORY</small>

            <h3>
              ABC
            </h3>

            <p>
              Part of the public SarlaYash GitHub repository
              portfolio and included here for complete
              transparency of our build-in-public journey.
            </p>

            <div class="project-actions">

              <a
                href="https://github.com/sarlayash/abc"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>

            </div>

          </article>


        </div>


        <div class="github-gateway">

          <div>

            <small>
              THE PUBLIC BUILD ARCHIVE
            </small>

            <strong>
              Explore the complete SarlaYash GitHub.
            </strong>

            <p>
              Inspect the repositories. Read the code.
              Follow the evolution. See the work before
              deciding whether you wish to join us.
            </p>

          </div>

          <a
            href="https://github.com/sarlayash"
            target="_blank"
            rel="noopener noreferrer"
          >
            EXPLORE ALL PROJECTS ON GITHUB ↗
          </a>

        </div>

      </section>


'''


js = js.replace(
    marker,
    showcase + marker,
    1
)


css_addition = r'''

/* =====================================================
   SARLAYASH BUILD LAB
   ===================================================== */

.build-lab-section {
  position: relative;
  overflow: hidden;
}

.build-lab-section::after {
  content: "";
  position: absolute;
  width: 520px;
  height: 520px;
  left: -300px;
  top: -260px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle,
      rgba(214,177,93,.10),
      transparent 68%
    );
  pointer-events: none;
}

.build-lab-intro {
  position: relative;
  z-index: 1;
  max-width: 850px;
}

.build-lab-intro h2 em {
  display: block;
  margin-top: 6px;
  color: var(--gold-bright);
  font-weight: 400;
}

.build-lab-lead {
  max-width: 720px;
  margin: 18px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
}

.build-lab-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.build-lab-stats span {
  min-width: 150px;
  padding: 14px 16px;
  border: 1px solid rgba(214,177,93,.18);
  border-radius: 10px;
  color: var(--muted);
  background: rgba(214,177,93,.025);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .13em;
}

.build-lab-stats strong {
  display: block;
  margin-bottom: 5px;
  color: var(--gold-bright);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0;
}

.project-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 30px;
}

.project-card {
  position: relative;
  display: flex;
  min-height: 285px;
  flex-direction: column;
  padding: 23px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: var(--radius-small);
  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.025),
      rgba(255,255,255,.009)
    );
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(214,177,93,.32);
  background:
    linear-gradient(
      145deg,
      rgba(214,177,93,.045),
      rgba(255,255,255,.012)
    );
}

.project-featured {
  border-color: rgba(214,177,93,.22);
}

.project-index {
  position: absolute;
  top: 17px;
  right: 19px;
  color: rgba(214,177,93,.22);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 34px;
}

.project-card small,
.github-gateway small {
  display: block;
  padding-right: 48px;
  color: var(--gold);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .18em;
}

.project-card h3 {
  margin: 35px 0 12px;
  color: var(--gold-bright);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 21px;
  font-weight: 400;
  line-height: 1.25;
}

.project-card p {
  margin: 0 0 22px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: auto;
}

.project-actions a {
  padding: 9px 10px;
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 8px;
  color: var(--muted);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.project-actions a:hover {
  color: var(--gold-bright);
  border-color: rgba(214,177,93,.38);
  background: rgba(214,177,93,.04);
}

.project-actions .project-live {
  color: var(--gold-bright);
  border-color: rgba(214,177,93,.28);
  background: rgba(214,177,93,.035);
}

.github-gateway {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-top: 14px;
  padding: 25px;
  border: 1px solid rgba(214,177,93,.28);
  border-radius: var(--radius-small);
  background:
    linear-gradient(
      135deg,
      rgba(214,177,93,.055),
      rgba(255,255,255,.012)
    );
}

.github-gateway strong {
  display: block;
  margin-top: 8px;
  color: var(--white);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 20px;
  font-weight: 400;
}

.github-gateway p {
  max-width: 620px;
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.65;
}

.github-gateway > a {
  flex: 0 0 auto;
  padding: 13px 16px;
  border: 1px solid rgba(214,177,93,.38);
  border-radius: 9px;
  color: var(--gold-bright);
  background: rgba(214,177,93,.04);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .1em;
  transition:
    transform 180ms ease,
    background 180ms ease;
}

.github-gateway > a:hover {
  transform: translateY(-2px);
  background: rgba(214,177,93,.08);
}


@media (max-width: 900px) {

  .project-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .github-gateway {
    align-items: flex-start;
    flex-direction: column;
  }

}


@media (max-width: 620px) {

  .project-grid {
    grid-template-columns: 1fr;
  }

  .project-card {
    min-height: 250px;
  }

  .build-lab-stats {
    display: grid;
    grid-template-columns: 1fr;
  }

  .build-lab-stats span {
    min-width: 0;
  }

  .github-gateway > a {
    width: 100%;
    text-align: center;
  }

}

'''


if "SARLAYASH BUILD LAB" in css:
    raise RuntimeError("Build Lab CSS already exists")

css += css_addition

HOME_JS.write_text(js, encoding="utf-8")
HOME_CSS.write_text(css, encoding="utf-8")

print()
print("SARLAYASH BUILD LAB ADDED SUCCESSFULLY")
print("PROJECTS: 11")
print("HOME.JS: OK")
print("HOME.CSS: OK")
print()