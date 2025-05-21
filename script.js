const SIP_SERVER = "sip.inntouch.jp";
const SIP_DOMAIN = "magconn.inntouch.jp";
const EXTENSION_NUMBER = "101";
const EXTENSION_PASSWORD = "P@ssw0rd";
const TARGET_EXTENSION_NUMBER = "901";
const TARGET_EXTENSION_DISPLAY_NAME = "フロント (901)";

const ui = {
  // Modal
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalMessage: document.getElementById("modalMessage"),
  // Button
  callButton: document.getElementById("callButton"),
  // Modal Button
  declineButton: document.getElementById("declineButton"),
  acceptButton: document.getElementById("acceptButton"),
  muteButton: document.getElementById("muteButton"),
  endButton: document.getElementById("endButton"),
  holdButton: document.getElementById("holdButton"),
};

// Swiper
const swiper = new Swiper(".swiper", {
  loop: true,
  speed: 2 * 1000,
  autoplay: { delay: 10 * 1000 },
});

/**
 * Event
 */
window.onload = () => {
  Android.register(SIP_SERVER, SIP_DOMAIN, EXTENSION_NUMBER, EXTENSION_PASSWORD);
};
document.addEventListener("keydown", (e) => {
  document.getElementById("keyCode").textContent = e.key;
  const keyCode = e.key;
  const hookSwitch = document.getElementById("hookSwitch").textContent;
  if (hookSwitch == "ON" && keyCode == "F11") {
    document.getElementById("hookSwitch").textContent = "OFF";
    if (Android.call(TARGET_EXTENSION_NUMBER)) {
      openOutgoingCallModal(TARGET_EXTENSION_DISPLAY_NAME);
    }
  } else if (hookSwitch == "OFF" && keyCode == "F12") {
    document.getElementById("hookSwitch").textContent = "ON";
    Android.hangUp();
    closeModal();
  }
});

/**
 * フロントに電話をする (WebView→Android)
 */
ui.callButton.addEventListener("click", (e) => {
  if (Android.call(TARGET_EXTENSION_NUMBER)) {
    openOutgoingCallModal(TARGET_EXTENSION_DISPLAY_NAME);
  }
});

/**
 * 応答 (WebView→Android)
 */
ui.acceptButton.addEventListener("click", (e) => {
  openDuringCallModal("");
});

/**
 * 拒否 (WebView→Android)
 */
ui.declineButton.addEventListener("click", (e) => {
  Android.hangUp();
  closeModal();
});

/**
 * 終了 (WebView→Android)
 */
ui.endButton.addEventListener("click", (e) => {
  Android.hangUp();
  closeModal();
});

/**
 * 消音 (WebView→Android)
 */
ui.muteButton.addEventListener("click", (e) => {
  const isChecked = e.target.checked;
  if (!Android.mute(isChecked)) {
    e.preventDefault();
    e.target.checked = !isChecked;
  }
});

/**
 * 保留 (WebView→Android)
 */
ui.holdButton.addEventListener("click", (e) => {
  const isChecked = e.target.checked;
  if (!Android.hold(isChecked)) {
    e.preventDefault();
    e.target.checked = !isChecked;
  }
});

/**
 * 応答 (Android→WebView)
 */
const onInviteAnswered = () => {
  openDuringCallModal();
};

/**
 * 着信 (Android→WebView)
 */
const onIncomingCall = () => {
  openIncomingCallModal("");
};

/**
 * 拒否・終了 (Android→WebView)
 */
const onReject = () => {
  closeModal();
};

const onChargingStatusChanged = (isCharging) => {
  document.getElementById("charging").textContent = isCharging ? "TRUE" : "FALSE";
  if (!isCharging) {
    document.getElementById("keyCode").textContent = "";
    document.getElementById("hookSwitch").textContent = "";
  }
};

const closeModal = () => {
  ui.modal.style.display = "none";
  ui.modalTitle.textContent = "${modalTitle}";
  ui.modalMessage.textContent = "${modalMessage}";
  ui.muteButton.checked = false;
  ui.holdButton.checked = false;
  clearInterval(timerInterval);
};

const openIncomingCallModal = (modalTitle) => {
  ui.modal.style.display = "flex";
  ui.modalTitle.textContent = modalTitle;
  ui.modalMessage.textContent = "着信中...";
  ui.declineButton.parentElement.parentElement.style.display = "block";
  ui.acceptButton.parentElement.parentElement.style.display = "block";
  ui.muteButton.parentElement.parentElement.style.display = "none";
  ui.endButton.parentElement.parentElement.style.display = "none";
  ui.holdButton.parentElement.parentElement.style.display = "none";
};

const openOutgoingCallModal = (modalTitle) => {
  ui.modal.style.display = "flex";
  ui.modalTitle.textContent = modalTitle;
  ui.modalMessage.textContent = "呼び出し中...";
  ui.declineButton.parentElement.parentElement.style.display = "none";
  ui.acceptButton.parentElement.parentElement.style.display = "none";
  ui.muteButton.parentElement.parentElement.style.display = "block";
  ui.endButton.parentElement.parentElement.style.display = "block";
  ui.holdButton.parentElement.parentElement.style.display = "none";
};

let startTime = null;
let timerInterval = null;

const openDuringCallModal = () => {
  ui.modal.style.display = "flex";
  // ui.modalTitle.textContent = modalTitle;
  ui.modalMessage.textContent = "00:00:00";
  ui.declineButton.parentElement.parentElement.style.display = "none";
  ui.acceptButton.parentElement.parentElement.style.display = "none";
  ui.muteButton.parentElement.parentElement.style.display = "block";
  ui.endButton.parentElement.parentElement.style.display = "block";
  ui.holdButton.parentElement.parentElement.style.display = "block";
  startTime = Date.now();
  timerInterval = setInterval(updateCallDuration, 100);
};

function updateCallDuration() {
  const elapsedMs = Date.now() - startTime;
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  ui.modalMessage.textContent = `${hours}:${minutes}:${seconds}`;
}

/**
 * Debug
 */
document.getElementById("openDebugIncomingCallButton").addEventListener("click", (e) => {
  openIncomingCallModal("着信画面 (Debug)");
});
document.getElementById("openDebugOutgoingCallButton").addEventListener("click", (e) => {
  openOutgoingCallModal("発信画面 (Debug)");
});
document.getElementById("openDebugDuringCallButton").addEventListener("click", (e) => {
  openDuringCallModal("通話中画面 (Debug)");
});
