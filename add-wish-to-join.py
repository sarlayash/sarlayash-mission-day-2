from pathlib import Path

js_path = Path("src/home.js")
css_path = Path("src/home.css")

js = js_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")


# ======================================================
# INSERT WISH TO JOIN SECTION INTO HOME.JS
# ======================================================

marker = """
      <!-- ==============================================
           GLOBAL TIME DESK
           ============================================== -->
"""

section = """
      <!-- ==============================================
           WISH TO JOIN SARLAYASH
           ============================================== -->

      <section class="section join-section">

        <div class="join-intro">

          <p class="section-label">
            WISH TO JOIN US?
          </p>

          <h2>
            Your SarlaYash Journey
            <em>Starts With Intent.</em>
          </h2>

          <p class="join-lead">
            We do not begin with a conventional registration.
            We begin by understanding you, introducing you to
            the SarlaYash way of learning, and seeing your
            willingness to take the first step.
          </p>

        </div>


        <div class="join-path">

          <article class="join-step">

            <span class="join-number">01</span>

            <div>
              <small>DISCOVER</small>

              <h3>
                Know Me First | SarlaYash Mission
              </h3>

              <p>
                Tell us about yourself, your aspirations and
                why you wish to become part of the SarlaYash
                learning ecosystem.
              </p>

              <a
                class="join-link"
                href="https://forms.gle/d6cvX9bpV3SAiCcu9"
                target="_blank"
                rel="noopener noreferrer"
              >
                KNOW ME FIRST →
              </a>
            </div>

          </article>


          <article class="join-step">

            <span class="join-number">02</span>

            <div>
              <small>EXPERIENCE</small>

              <h3>
                Your First Day Starts Here.
              </h3>

              <p>
                Experience SarlaYash before asking to join.
                Complete the Day 1 onboarding journey and
                understand how our learning culture works.
              </p>

              <a
                class="join-link"
                href="https://sarlayash.github.io/SarlaYash_Onboarding_Day1/"
                target="_blank"
                rel="noopener noreferrer"
              >
                START DAY 1 →
              </a>
            </div>

          </article>


          <article class="join-step">

            <span class="join-number">03</span>

            <div>
              <small>CONFIRM</small>

              <h3>
                Share Your Completion.
              </h3>

              <p>
                After completing the required journey,
                share your confirmation with the SarlaYash
                team for consideration.
              </p>

              <a
                class="join-link"
                href="mailto:namaste@sarlayash.com?subject=SarlaYash%20Mission%20-%20Journey%20Completion"
              >
                NAMASTE@SARLAYASH.COM →
              </a>
            </div>

          </article>

        </div>


        <div class="join-gate">

          <div class="join-gate-mark">
            SY
          </div>

          <div>

            <small>
              SARLAYASH OPPORTUNITY GATE
            </small>

            <strong>
              Completion creates eligibility for consideration —
              not automatic entry.
            </strong>

            <p>
              Only candidates who complete the required journey
              and share their confirmation with
              namaste@sarlayash.com will be considered for an
              opportunity to enter SarlaYash Mission.
            </p>

          </div>

        </div>


        <div class="social-connect">

          <div>

            <small>
              CONNECT WITH THE ECOSYSTEM
            </small>

            <h3>
              Follow the people and mission behind SarlaYash.
            </h3>

          </div>

          <div class="social-actions">

            <a
              href="https://www.linkedin.com/in/kapil-narula-63447026/"
              target="_blank"
              rel="noopener noreferrer"
            >
              KAPIL NARULA · LINKEDIN ↗
            </a>

            <a
              href="https://www.linkedin.com/company/sarlayash-learning-solutions-llp-001/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              SARLAYASH · LINKEDIN ↗
            </a>

          </div>

        </div>

      </section>


"""

if marker not in js:
    raise RuntimeError(
        "GLOBAL TIME DESK marker not found in home.js"
    )

js = js.replace(
    marker,
    section + marker,
    1
)


# ======================================================
# ADD JOIN SECTION DESIGN TO HOME.CSS
# ======================================================

css_marker = """
/* =====================================================
   WORLD CLOCKS
   ===================================================== */
"""

join_css = r"""
/* =====================================================
   WISH TO JOIN SARLAYASH
   ===================================================== */

.join-section {
  position: relative;
  overflow: hidden;
}

.join-section::before {
  content: "";
  position: absolute;
  width: 440px;
  height: 440px;
  top: -250px;
  right: -180px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle,
      rgba(214,177,93,.12),
      transparent 68%
    );
  pointer-events: none;
}

.join-intro {
  position: relative;
  max-width: 780px;
}

.join-intro h2 em {
  display: block;
  margin-top: 6px;
  color: var(--gold-bright);
  font-weight: 400;
}

.join-lead {
  max-width: 690px;
  margin: 18px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
}

.join-path {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 13px;
  margin-top: 30px;
}

.join-step {
  position: relative;
  min-height: 320px;
  padding: 25px;
  border:
    1px solid rgba(255,255,255,.075);
  border-radius: var(--radius-small);
  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.025),
      rgba(255,255,255,.012)
    );
}

.join-number {
  display: block;
  margin-bottom: 38px;
  color: rgba(214,177,93,.34);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 45px;
  line-height: 1;
}

.join-step small,
.join-gate small,
.social-connect small {
  display: block;
  color: var(--gold);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .2em;
}

.join-step h3 {
  margin: 9px 0 12px;
  color: var(--gold-bright);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.25;
}

.join-step p {
  margin: 0 0 23px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
}

.join-link {
  display: inline-block;
  color: var(--gold-bright);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
  transition:
    transform 180ms ease,
    color 180ms ease;
}

.join-link:hover {
  color: #fff0b8;
  transform: translateX(4px);
}

.join-gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
  margin-top: 14px;
  padding: 22px;
  border:
    1px solid rgba(214,177,93,.30);
  border-radius: var(--radius-small);
  background:
    rgba(214,177,93,.045);
}

.join-gate-mark {
  display: flex;
  width: 58px;
  height: 58px;
  align-items: center;
  justify-content: center;
  border:
    1px solid rgba(214,177,93,.45);
  border-radius: 50%;
  color: var(--gold-bright);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 19px;
}

.join-gate strong {
  display: block;
  margin-top: 8px;
  color: var(--white);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.45;
}

.join-gate p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.65;
}

.social-connect {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  margin-top: 14px;
  padding: 22px;
  border:
    1px solid rgba(255,255,255,.07);
  border-radius: var(--radius-small);
  background:
    rgba(255,255,255,.018);
}

.social-connect h3 {
  margin: 7px 0 0;
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 18px;
  font-weight: 400;
}

.social-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.social-actions a {
  padding: 11px 13px;
  border:
    1px solid rgba(214,177,93,.25);
  border-radius: 9px;
  color: var(--gold-bright);
  background:
    rgba(214,177,93,.035);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .1em;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.social-actions a:hover {
  transform: translateY(-2px);
  border-color:
    rgba(214,177,93,.55);
  background:
    rgba(214,177,93,.075);
}

"""

if css_marker not in css:
    raise RuntimeError(
        "WORLD CLOCKS marker not found in home.css"
    )

css = css.replace(
    css_marker,
    join_css + css_marker,
    1
)


# ======================================================
# RESPONSIVE EXTENSION
# ======================================================

responsive_marker = """
@media (max-width: 700px) {
"""

responsive_css = """
@media (max-width: 900px) {

  .join-path {
    grid-template-columns: 1fr;
  }

  .join-step {
    min-height: auto;
  }

  .join-number {
    margin-bottom: 22px;
  }

  .social-connect {
    align-items: flex-start;
    flex-direction: column;
  }

  .social-actions {
    justify-content: flex-start;
  }

}

"""

if responsive_marker not in css:
    raise RuntimeError(
        "700px responsive marker not found in home.css"
    )

css = css.replace(
    responsive_marker,
    responsive_css + responsive_marker,
    1
)


js_path.write_text(
    js,
    encoding="utf-8"
)

css_path.write_text(
    css,
    encoding="utf-8"
)

print()
print("WISH TO JOIN SARLAYASH SECTION ADDED SUCCESSFULLY")
print("HOME.JS: OK")
print("HOME.CSS: OK")
print()