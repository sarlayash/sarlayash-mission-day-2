// =====================================================
// SARLAYASH EVIDENCE SUBMISSION MODAL V1
// =====================================================

export function evidenceModalMarkup(currentMission = '') {

  return `

<div
  id="evidence-modal"
  class="evidence-modal hidden"
>

  <div class="evidence-modal-card">

    <h2>

      Submit Evidence

    </h2>

    <p>

      Paste your LinkedIn post URL for today's mission.

    </p>

    <label>

      Current Mission

    </label>

    <input

      id="evidence-current-mission"

      type="text"

      value="${currentMission}"

      readonly

    >

    <label>

      LinkedIn Post URL

    </label>

    <input

      id="evidence-url"

      type="url"

      placeholder="https://www.linkedin.com/posts/..."

    >

    <div class="evidence-modal-actions">

      <button
        id="cancel-evidence"
        type="button"
      >
        Cancel
      </button>

      <button
        id="save-evidence"
        type="button"
      >
        Submit
      </button>

    </div>

  </div>

</div>

  `;

}