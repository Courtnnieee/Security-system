// Element references
const alertModal = document.getElementById("alertModal");
const termsAcceptedEl = document.getElementById("termsAccepted");
const confirmAlertBtn = document.getElementById("confirmAlertBtn");
const confirmStage = document.getElementById("confirmStage");
const detailsStage = document.getElementById("detailsStage");
const sendStage = document.getElementById("sendStage");
const riskGrid = document.getElementById("riskGrid");
const situationEl = document.getElementById("situation");
const submitDetailsBtn = document.getElementById("submitDetailsBtn");
const alertSummary = document.getElementById("alertSummary");
const sendAlertBtn = document.getElementById("sendAlertBtn");
const chatPanel = document.getElementById("chatPanel");
const chatBody = document.getElementById("chatBody");
const riskBadge = document.getElementById("riskBadge");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const audioCallBtn = document.getElementById("audioCallBtn");
const videoCallBtn = document.getElementById("videoCallBtn");
const callStatus = document.getElementById("callStatus");
const mapPin = document.getElementById("mapPin");
const accuracyRing = document.getElementById("accuracyRing");
const coordsValue = document.getElementById("coordsValue");
const accuracyValue = document.getElementById("accuracyValue");
const timestampValue = document.getElementById("timestampValue");

let selectedRisk = "";
let locationWatchId = null;

// Tile data (already defined)
const tileData = [
  {
    label: "Campus Safety",
    icon: "🛡️",
    enabled: true,
    className: "campus-safety"
  }
];

// Open alert modal
function openAlert() {
  alertModal.classList.remove("hidden");
}

// Terms checkbox enables confirm button
termsAcceptedEl.addEventListener("change", () => {
  confirmAlertBtn.disabled = !termsAcceptedEl.checked;
});

// Confirm stage
confirmAlertBtn.addEventListener("click", () => {
  confirmStage.classList.add("hidden");
  detailsStage.classList.remove("hidden");
});

// Select risk level
riskGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("risk-btn")) {
    selectedRisk = e.target.dataset.risk;
  Array.from(riskGrid.children).forEach(btn =>
  btn.classList.toggle("active", btn === e.target)
);
    submitDetailsBtn.disabled = situationEl.value.trim() === "";
  }
});

// Enable submit when situation is typed
situationEl.addEventListener("input", () => {
  submitDetailsBtn.disabled = situationEl.value.trim() === "" || !selectedRisk;
});

// Submit details stage
submitDetailsBtn.addEventListener("click", () => {
  detailsStage.classList.add("hidden");
  sendStage.classList.remove("hidden");
  alertSummary.textContent = `Risk: ${selectedRisk}\nDescription: ${situationEl.value}`;
});

// Send alert & open chat panel
sendAlertBtn.addEventListener("click", () => {
  alertModal.classList.add("hidden");
  chatPanel.classList.remove("hidden");
  riskBadge.textContent = `Risk: ${selectedRisk}`;
  startLocationTracking();
  appendChatMessage("System", "Live chat started with Campus Security.");
});

// Chat form submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  appendChatMessage("You", message);
  chatInput.value = "";
  setTimeout(() => {
    appendChatMessage("Security", "Message received. Stay safe.");
  }, 800);
});

// Append message to chat
function appendChatMessage(sender, text) {
  const msgEl = document.createElement("div");
  msgEl.className = "chat-message";
  msgEl.textContent = `${sender}: ${text}`;
  chatBody.appendChild(msgEl);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Dummy audio/video buttons
audioCallBtn.addEventListener("click", () => alert("Audio call started"));
videoCallBtn.addEventListener("click", () => alert("Video call started"));

// Simple location tracking
function startLocationTracking() {
  if (!navigator.geolocation) return;
  locationWatchId = navigator.geolocation.watchPosition(updateLocation, handleError, {
    enableHighAccuracy: true
  });
}

function updateLocation(pos) {
  const { latitude, longitude, accuracy } = pos.coords;
  coordsValue.textContent = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  accuracyValue.textContent = `${accuracy.toFixed(1)} m`;
  timestampValue.textContent = new Date(pos.timestamp).toLocaleTimeString();
  mapPin.style.left = "50%";
  mapPin.style.top = "50%";
  accuracyRing.style.width = `${accuracy / 2}px`;
  accuracyRing.style.height = `${accuracy / 2}px`;
}

function handleError(err) {
  console.warn("Geolocation error:", err);
  coordsValue.textContent = "Error";
  accuracyValue.textContent = "Error";
}

const chatOverlay = document.getElementById("chatOverlay");
const closeChatBtn = document.getElementById("closeChatBtn");

// Show overlay on send alert
sendAlertBtn.addEventListener("click", () => {
  alertModal.classList.add("hidden");
  chatOverlay.classList.remove("hidden"); // overlay visible
  riskBadge.textContent = `Risk: ${selectedRisk}`;
  startLocationTracking();
  appendChatMessage("System", "Live chat started with Campus Security.");
});

// Close overlay with confirmation
closeChatBtn.addEventListener("click", () => {
  const confirmExit = confirm("Are you sure you want to exit the live chat? This will reset the alert process.");
  if (!confirmExit) return;

  chatOverlay.classList.add("hidden");
  chatBody.innerHTML = "";
  chatInput.value = "";
  coordsValue.textContent = "Pending...";
  accuracyValue.textContent = "Pending...";
  timestampValue.textContent = "Pending...";
  selectedRisk = "";
  termsAcceptedEl.checked = false;
  confirmAlertBtn.disabled = true;
  confirmStage.classList.remove("hidden");
  detailsStage.classList.add("hidden");
  sendStage.classList.add("hidden");
  if (locationWatchId) {
    navigator.geolocation.clearWatch(locationWatchId);
    locationWatchId = null;
  }
});

// Keep audio/video call buttons functional
audioCallBtn.addEventListener("click", () => alert("Audio call started"));
videoCallBtn.addEventListener("click", () => alert("Video call started"));