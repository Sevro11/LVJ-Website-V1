// ===== Config =====
// Paste deployed Apps Script Web App URL here:
const WAITLIST_ENDPOINT = "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE";

// ===== Helpers =====
function $(id){ return document.getElementById(id); }

function setStatus(msg){
  const el = $("formStatus");
  if (el) el.textContent = msg || "";
}

// ===== Year =====
$("year").textContent = new Date().getFullYear();

// ===== Age gate =====
const gate = $("ageGate");
const denied = $("ageDenied");
const KEY = "lvj_age_ok";

function showGate(){
  gate.style.display = "flex";
  gate.removeAttribute("hidden");
}
function hideGate(){
  gate.style.display = "none";
}

if (localStorage.getItem(KEY) === "yes") {
  hideGate();
} else {
  showGate();
}

$("ageYes").addEventListener("click", () => {
  localStorage.setItem(KEY, "yes");
  hideGate();
});

$("ageNo").addEventListener("click", () => {
  denied.hidden = false;
});

// ===== Waitlist submit =====
$("waitlistForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (localStorage.getItem(KEY) !== "yes") {
    setStatus("Please confirm you are 21+ to join the waitlist.");
    return;
  }

  const name = $("name").value.trim();
  const email = $("email").value.trim().toLowerCase();
  const state = $("state").value.trim();
  const age_confirm = $("ageConfirm").checked;

  if (!WAITLIST_ENDPOINT || WAITLIST_ENDPOINT.includes("PASTE_")) {
    setStatus("Form is not connected yet. Paste your Apps Script URL into script.js.");
    return;
  }

  setStatus("Submitting…");

  const body = new URLSearchParams({
    name,
    email,
    state,
    age_confirm: age_confirm ? "yes" : "no",
    user_agent: navigator.userAgent
  });

  try {
    // no-cors avoids CORS blocking on static hosting; Apps Script still receives it.
    await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body
    });

    window.location.href = "thanks.html";
  } catch (err) {
    setStatus("Could not submit right now. Please try again in a moment.");
  }
});

