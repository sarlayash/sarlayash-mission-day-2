// ======================================================
// SARLAYASH LEAD & OFFER CONTROL V1
// READ-ONLY GOOGLE SHEET INTEGRATION
// ======================================================

const LEAD_API_URL =
  'https://script.google.com/macros/s/AKfycbyS45IpZJpmxNT9mhKrmWPF_xMduB6gieRZucGxuDiyvDgJZ5ZVbhdAhEk9jNYnsj-TVA/exec';

const LEAD_SHEET_NAME =
  'Form Responses 1';

let leadRecords = [];


// ======================================================
// HELPERS
// ======================================================

function escapeHtml(value) {

  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

}


function getField(record, names) {

  for (const name of names) {

    if (
      record &&
      Object.prototype.hasOwnProperty.call(
        record,
        name
      )
    ) {

      return record[name] ?? '';

    }

  }

  return '';

}


// ======================================================
// LOAD LEADS
// ======================================================

async function loadLeadRecords() {

  const response =
    await fetch(
      LEAD_API_URL,
      {
        method: 'GET',
        cache: 'no-store'
      }
    );

  if (!response.ok) {

    throw new Error(
      `Lead API returned HTTP ${response.status}`
    );

  }

  const data =
    await response.json();

  if (!data.success) {

    throw new Error(
      data.error ||
      'Unable to load leads.'
    );

  }

  leadRecords =
    Array.isArray(data.leads)
      ? data.leads
      : [];

  return leadRecords;

}


// ======================================================
// STATS
// ======================================================

function leadStats(records) {

  const total =
    records.length;

  const offerReleased =
    records.filter(
      record =>
        String(
          getField(
            record,
            [
              'Offer Released',
              'Offer released'
            ]
          )
        )
          .trim()
          .toLowerCase() === 'yes'
    ).length;

  const offerReceived =
    records.filter(
      record =>
        String(
          getField(
            record,
            [
              'Offer Letter Received',
              'Offer letter received'
            ]
          )
        )
          .trim()
          .toLowerCase() === 'yes'
    ).length;

  const commitmentYes =
    records.filter(
      record =>
        String(
          getField(
            record,
            [
              'Ready for 1-hour daily commitment',
              'Ready for 1-hour daily commitment?'
            ]
          )
        )
          .trim()
          .toLowerCase() === 'yes'
    ).length;

  return {
    total,
    offerReleased,
    offerReceived,
    commitmentYes
  };

}


// ======================================================
// LEAD TABLE
// ======================================================

function renderLeadRows(records) {

  if (!records.length) {

    return `
      <tr>
        <td
          colspan="7"
          style="
            padding:30px;
            text-align:center;
          "
        >
          No leads found.
        </td>
      </tr>
    `;

  }

  return records.map(
    record => {

      const name =
        getField(
          record,
          [
            'Name',
            'name',
            'Full Name'
          ]
        );

      const email =
        getField(
          record,
          [
            'Email Address',
            'Email',
            'email'
          ]
        );

      const mobile =
        getField(
          record,
          [
            'Mobile',
            'Mobile Number',
            'Phone'
          ]
        );

      const domain =
        getField(
          record,
          [
            'Domain',
            'Course',
            'Interested Domain'
          ]
        );

      const score =
        getField(
          record,
          [
            'Score'
          ]
        );

      const offerReleased =
        getField(
          record,
          [
            'Offer Released'
          ]
        );

      const offerReceived =
        getField(
          record,
          [
            'Offer Letter Received'
          ]
        );

      return `
        <tr>

          <td>
            <strong>
              ${escapeHtml(name)}
            </strong>

            <br>

            <small>
              ${escapeHtml(email)}
            </small>
          </td>

          <td>
            ${escapeHtml(domain)}
          </td>

          <td>
            ${escapeHtml(score)}
          </td>

          <td>
            ${escapeHtml(mobile)}
          </td>

          <td>
            ${escapeHtml(offerReleased)}
          </td>

          <td>
            ${escapeHtml(offerReceived)}
          </td>

          <td>

            <button
              type="button"
              class="ghost lead-review-btn"
              data-row="${escapeHtml(
                record._rowNumber
              )}"
            >
              REVIEW
            </button>

          </td>

        </tr>
      `;

    }
  ).join('');

}


// ======================================================
// LEAD REVIEW
// ======================================================

function showLeadReview(record) {

  const name =
    getField(
      record,
      [
        'Name',
        'name',
        'Full Name'
      ]
    );

  const email =
    getField(
      record,
      [
        'Email Address',
        'Email',
        'email'
      ]
    );

  const mobile =
    getField(
      record,
      [
        'Mobile',
        'Mobile Number',
        'Phone'
      ]
    );

  const domain =
    getField(
      record,
      [
        'Domain'
      ]
    );

  const linkedin =
    getField(
      record,
      [
        'LinkedIn',
        'LinkedIn Profile'
      ]
    );

  const github =
    getField(
      record,
      [
        'GitHub',
        'GitHub Profile'
      ]
    );

  const experience =
    getField(
      record,
      [
        'Fresher / Experienced',
        'Fresher/Experienced',
        'Experience'
      ]
    );

  const why =
    getField(
      record,
      [
        'Why SarlaYash?',
        'Why SarlaYash'
      ]
    );

  const expectations =
    getField(
      record,
      [
        'Expectations'
      ]
    );

  const commitment =
    getField(
      record,
      [
        'Ready for 1-hour daily commitment',
        'Ready for 1-hour daily commitment?'
      ]
    );

  const offerReleased =
    getField(
      record,
      [
        'Offer Released'
      ]
    );

  const offerReceived =
    getField(
      record,
      [
        'Offer Letter Received'
      ]
    );

  const panel =
    document.querySelector(
      '#lead-review-panel'
    );

  if (!panel) {
    return;
  }

  panel.innerHTML = `

    <div
      style="
        border:1px solid rgba(212,175,55,.35);
        padding:24px;
        margin-top:24px;
      "
    >

      <div
        style="
          display:flex;
          justify-content:space-between;
          gap:20px;
          flex-wrap:wrap;
        "
      >

        <div>

          <small>
            LEAD REVIEW
          </small>

          <h3>
            ${escapeHtml(name)}
          </h3>

        </div>

        <button
          type="button"
          class="ghost"
          id="close-lead-review"
        >
          CLOSE
        </button>

      </div>


      <div class="metrics">

        <article>
          <small>EMAIL</small>
          <strong>
            ${escapeHtml(email)}
          </strong>
        </article>

        <article>
          <small>MOBILE</small>
          <strong>
            ${escapeHtml(mobile)}
          </strong>
        </article>

        <article>
          <small>DOMAIN</small>
          <strong>
            ${escapeHtml(domain)}
          </strong>
        </article>

        <article>
          <small>EXPERIENCE</small>
          <strong>
            ${escapeHtml(experience)}
          </strong>
        </article>

      </div>


      <div
        style="
          margin-top:24px;
          display:grid;
          gap:18px;
        "
      >

        <div>

          <small>
            LINKEDIN
          </small>

          <p>
            ${escapeHtml(linkedin)}
          </p>

        </div>


        <div>

          <small>
            GITHUB
          </small>

          <p>
            ${escapeHtml(github)}
          </p>

        </div>


        <div>

          <small>
            WHY SARLAYASH?
          </small>

          <p>
            ${escapeHtml(why)}
          </p>

        </div>


        <div>

          <small>
            EXPECTATIONS
          </small>

          <p>
            ${escapeHtml(expectations)}
          </p>

        </div>


        <div>

          <small>
            1-HOUR DAILY COMMITMENT
          </small>

          <p>
            ${escapeHtml(commitment)}
          </p>

        </div>


        <div>

          <small>
            OFFER RELEASED
          </small>

          <p>
            ${escapeHtml(offerReleased)}
          </p>

        </div>


        <div>

          <small>
            OFFER LETTER RECEIVED
          </small>

          <p>
            ${escapeHtml(offerReceived)}
          </p>

        </div>

      </div>


      <div
        style="
          margin-top:24px;
          padding-top:24px;
          border-top:1px solid rgba(255,255,255,.12);
        "
      >

        <small>
          ACTIONS
        </small>

        <p>
          Offer and rejection actions will be enabled
          after the read-only lead integration is verified.
        </p>

      </div>

    </div>

  `;


  document
    .querySelector(
      '#close-lead-review'
    )
    ?.addEventListener(
      'click',
      () => {

        panel.innerHTML = '';

      }
    );

}


// ======================================================
// BIND REVIEW BUTTONS
// ======================================================

function bindLeadReviewButtons() {

  document
    .querySelectorAll(
      '.lead-review-btn'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () => {

            const rowNumber =
              Number(
                button.dataset.row
              );

            const record =
              leadRecords.find(
                item =>
                  Number(
                    item._rowNumber
                  ) === rowNumber
              );

            if (record) {

              showLeadReview(
                record
              );

            }

          }
        );

      }
    );

}


// ======================================================
// DRAW LEAD CONTROL
// ======================================================

function drawLeadControl(
  root,
  records
) {

  const stats =
    leadStats(records);

  root.innerHTML = `

    <section>

      <div
        class="toolbar"
        style="
          margin-bottom:24px;
        "
      >

        <div>

          <small>
            SARLAYASH SUPER ADMIN
          </small>

          <h2>
            LEAD & OFFER CONTROL
          </h2>

          <p>
            Google Sheet lead intelligence
            and offer decision workspace.
          </p>

        </div>


        <button
          type="button"
          class="ghost"
          id="lead-control-back"
        >
          ← SUPER ADMIN HOME
        </button>

      </div>


      <div class="metrics">

        <article>

          <small>
            TOTAL LEADS
          </small>

          <b>
            ${stats.total}
          </b>

        </article>


        <article>

          <small>
            OFFER RELEASED
          </small>

          <b>
            ${stats.offerReleased}
          </b>

        </article>


        <article>

          <small>
            OFFER RECEIVED
          </small>

          <b>
            ${stats.offerReceived}
          </b>

        </article>


        <article>

          <small>
            1-HOUR COMMITMENT
          </small>

          <b>
            ${stats.commitmentYes}
          </b>

        </article>

      </div>


      <div
        style="
          margin-top:28px;
        "
      >

        <input
          type="search"
          id="lead-search"
          placeholder="Search name, email, domain or mobile..."
          style="
            width:100%;
            box-sizing:border-box;
            padding:14px;
          "
        >

      </div>


      <div
        style="
          overflow:auto;
          margin-top:20px;
        "
      >

        <table
          style="
            width:100%;
            border-collapse:collapse;
          "
        >

          <thead>

            <tr>

              <th>
                LEAD
              </th>

              <th>
                DOMAIN
              </th>

              <th>
                SCORE
              </th>

              <th>
                MOBILE
              </th>

              <th>
                OFFER
              </th>

              <th>
                RECEIVED
              </th>

              <th>
                ACTION
              </th>

            </tr>

          </thead>

          <tbody
            id="lead-table-body"
          >

            ${renderLeadRows(records)}

          </tbody>

        </table>

      </div>


      <div
        id="lead-review-panel"
      ></div>

    </section>

  `;


  document
    .querySelector(
      '#lead-control-back'
    )
    ?.addEventListener(
      'click',
      () => {

        window.dispatchEvent(
          new CustomEvent(
            'sarlayash:super-admin-home'
          )
        );

      }
    );


  document
    .querySelector(
      '#lead-search'
    )
    ?.addEventListener(
      'input',
      event => {

        const term =
          event.target.value
            .trim()
            .toLowerCase();

        const filtered =
          leadRecords.filter(
            record => {

              const searchable = [
                getField(
                  record,
                  [
                    'Name',
                    'name',
                    'Full Name'
                  ]
                ),
                getField(
                  record,
                  [
                    'Email Address',
                    'Email',
                    'email'
                  ]
                ),
                getField(
                  record,
                  [
                    'Domain'
                  ]
                ),
                getField(
                  record,
                  [
                    'Mobile',
                    'Mobile Number',
                    'Phone'
                  ]
                )
              ]
                .join(' ')
                .toLowerCase();

              return searchable.includes(
                term
              );

            }
          );

        const body =
          document.querySelector(
            '#lead-table-body'
          );

        if (body) {

          body.innerHTML =
            renderLeadRows(
              filtered
            );

          bindLeadReviewButtons();

        }

      }
    );


  bindLeadReviewButtons();

}


// ======================================================
// OPEN LEAD CONTROL
// ======================================================

export async function showLeadOfferControl(
  root
) {

  root.innerHTML = `

    <section>

      <small>
        SARLAYASH SUPER ADMIN
      </small>

      <h2>
        LEAD & OFFER CONTROL
      </h2>

      <p>
        Loading Google Sheet leads...
      </p>

    </section>

  `;

  try {

    const records =
      await loadLeadRecords();

    drawLeadControl(
      root,
      records
    );

  } catch (error) {

    console.error(
      'Lead & Offer Control Error:',
      error
    );

    root.innerHTML = `

      <section>

        <small>
          SARLAYASH SUPER ADMIN
        </small>

        <h2>
          LEAD & OFFER CONTROL
        </h2>

        <p>
          Unable to load the Google Sheet.
        </p>

        <pre
          style="
            white-space:pre-wrap;
            overflow-wrap:anywhere;
          "
        >
          ${escapeHtml(
            error.message
          )}
        </pre>

        <button
          type="button"
          class="ghost"
          id="lead-control-retry"
        >
          RETRY
        </button>

      </section>

    `;

    document
      .querySelector(
        '#lead-control-retry'
      )
      ?.addEventListener(
        'click',
        () =>
          showLeadOfferControl(
            root
          )
      );

  }

}