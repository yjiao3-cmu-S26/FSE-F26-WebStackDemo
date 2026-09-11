// ============================================================
// LAYER: CLIENT  (runs in the browser -- the UNTRUSTED side)
// ------------------------------------------------------------
// Everything here is visible and editable by the user. Open
// DevTools and you can change any line. So:
//
//    nothing here is a security control
//    nothing here is the source of truth
//
// Note what this file does NOT contain: no connection string, no
// database query, no password. The browser cannot speak MongoDB
// at all -- only HTTP. That is why a server has to exist.
// ============================================================

const form = document.querySelector('#attendance-form');
const nameInput = document.querySelector('#name');
const andrewIdInput = document.querySelector('#andrewId');
const submitBtn = document.querySelector('#submit-btn');
const feedback = document.querySelector('#feedback');

function showMessage(text, kind) {
  feedback.innerHTML = '';

  const box = document.createElement('div');
  box.className = `alert alert-${kind} mb-0`;
  // textContent, never innerHTML -- a name containing <script>
  // must render as text, not execute.
  box.textContent = text;

  feedback.appendChild(box);
}

form.addEventListener('submit', async (event) => {
  // Stop the browser's default full-page form submit. We want to
  // send JSON with fetch and stay on the page.
  event.preventDefault();

  const name = nameInput.value.trim();
  const andrewId = andrewIdInput.value.trim();

  // These checks are UX -- they save a pointless round trip.
  // They are NOT the rule. validateAttendance.js on the server is
  // the rule, and it runs whether this code does or not.
  if (!name || !andrewId) {
    showMessage('Please fill in both fields.', 'warning');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Checking you in...';

  try {
    // CLIENT -> SERVER always goes over HTTP.
    const response = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, andrewId })
    });

    // 404 / 405 mean NO HANDLER MATCHED -- a routing problem, not a
    // problem with what the user typed. Those two are worth a full
    // error page, because the fix is in the server's route table.
    //
    // 400 and 409 are different: a handler DID run and rejected the
    // request on purpose. Those stay inline, next to the form.
    if (response.status === 404 || response.status === 405) {
      const params = new URLSearchParams({
        status: response.status,
        method: 'POST',
        path: '/api/attendance'
      });
      window.location.href = `/error?${params}`;
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      // 400 from validation, 409 if already checked in today.
      showMessage(data.error || 'Something went wrong.', 'danger');
      return;
    }

    showMessage(data.message, 'success');
    form.reset();
  } catch (err) {
    // Only reached if the request never completed at all --
    // server down, network gone.
    showMessage('Could not reach the server. Is it running?', 'danger');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Check me in';
  }
});
