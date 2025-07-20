const path = window.location.pathname.split("/");
const SIP_SERVER = "sip.inntouch.jp";
const SIP_DOMAIN = path[3]; // xxxxxxxx.inntouch.jp
const EXTENSION_NUMBER = path[4]; // 101
const EXTENSION_PASSWORD = "P@ssw0rd";
const TARGET_EXTENSION_NUMBER = path[5]; // 901
const TARGET_EXTENSION_DISPLAY_NAME = "フロント";

let startTime = null;
let timerInterval = null;

const ui = {
  // Modal
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalMessage: document.getElementById("modalMessage"),
  // Button
  buttonCall: document.getElementById("buttonCall"),
  buttonVideoCall: document.getElementById("buttonVideoCall"),
  // Modal Button
  buttonDecline: document.getElementById("buttonDecline"),
  buttonAccept: document.getElementById("buttonAccept"),
  buttonMute: document.getElementById("buttonMute"),
  buttonEnd: document.getElementById("buttonEnd"),
  buttonHold: document.getElementById("buttonHold"),
};

// Swiper
const swiper = new Swiper(".swiper", {
  loop: true,
  speed: 2 * 1000,
  autoplay: { delay: 10 * 1000 },
});

/**
 * Event: On Load
 */
window.onload = () => {
  Android.register(SIP_SERVER, SIP_DOMAIN, EXTENSION_NUMBER, EXTENSION_PASSWORD);
  document.getElementById("charging").textContent = Android.getBatteryChargingStatus() ? "TRUE" : "FALSE";
  document.getElementById("attaching").textContent = Android.getUsbAttachingStatus() ? "TRUE" : "FALSE";
};

/**
 * Event: Keydown
 */
document.addEventListener("keydown", (e) => {
  const keyCode = e.key;
  const hookSwitch = document.getElementById("hookSwitch").textContent;
  if (hookSwitch == "OFF" && keyCode == "F12") {
    onHookSwitchOn();
    document.getElementById("hookSwitch").textContent = "ON";
  } else if (hookSwitch == "ON" && keyCode == "F11") {
    onHookSwitchOff();
    document.getElementById("hookSwitch").textContent = "OFF";
  } else if (hookSwitch == "UNKNOWN" && keyCode == "F12") {
    document.getElementById("hookSwitch").textContent = "ON";
  } else if (hookSwitch == "UNKNOWN" && keyCode == "F11") {
    document.getElementById("hookSwitch").textContent = "OFF";
  }
  document.getElementById("keyCode").textContent = e.key;
});

/**
 * onHookSwitchOn
 */
const onHookSwitchOn = () => {
  Android.hangUp();
  closeCallModal();
};

/**
 * onHookSwitchOff
 */
const onHookSwitchOff = () => {
  if (!Android.answer()) {
    if (Android.call(TARGET_EXTENSION_NUMBER)) {
      openOutgoingCallModal(TARGET_EXTENSION_DISPLAY_NAME);
    }
  }
};

/**
 * 音声電話をする (WebView→Android)
 */
ui.buttonCall.addEventListener("click", (e) => {
  if (Android.call(TARGET_EXTENSION_NUMBER)) {
    openOutgoingCallModal(TARGET_EXTENSION_DISPLAY_NAME);
  }
});

/**
 * ビデオ電話をする (WebView→Android)
 */
ui.buttonVideoCall.addEventListener("click", (e) => {
  Android.videoCall(TARGET_EXTENSION_NUMBER);
});

/**
 * 応答 (WebView→Android)
 */
ui.buttonAccept.addEventListener("click", (e) => {
  if (Android.answer()) {
    openDuringCallModal();
  }
});

/**
 * 拒否 (WebView→Android)
 */
ui.buttonDecline.addEventListener("click", (e) => {
  Android.hangUp();
  closeCallModal();
});

/**
 * 終了 (WebView→Android)
 */
ui.buttonEnd.addEventListener("click", (e) => {
  Android.hangUp();
  closeCallModal();
});

/**
 * 消音 (WebView→Android)
 */
ui.buttonMute.addEventListener("click", (e) => {
  const isChecked = e.target.checked;
  if (!Android.mute(isChecked)) {
    e.preventDefault();
    e.target.checked = !isChecked;
  }
});

/**
 * 保留 (WebView→Android)
 */
ui.buttonHold.addEventListener("click", (e) => {
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
const onIncomingCall = (displayName) => {
  openIncomingCallModal(displayName);
};

/**
 * 拒否・終了 (Android→WebView)
 */
const onReject = () => {
  closeCallModal();
};

/**
 * 充電状態の変更 (Android→WebView)
 */
const onBatteryChargingStatusChanged = (isCharging) => {
  document.getElementById("charging").textContent = isCharging ? "TRUE" : "FALSE";
  // if (!isCharging) {
  //   document.getElementById("keyCode").textContent = "";
  //   document.getElementById("hookSwitch").textContent = "UNKNOWN";
  // }
};

/**
 * USB接続状態の変更 (Android→WebView)
 */
const onUsbAttachingStatusChanged = (isAttaching) => {
  document.getElementById("attaching").textContent = isAttaching ? "TRUE" : "FALSE";
  if (!isAttaching) {
    document.getElementById("keyCode").textContent = "";
    document.getElementById("hookSwitch").textContent = "UNKNOWN";
  }
};

const closeCallModal = () => {
  ui.modal.style.display = "none";
  ui.modalTitle.textContent = "${modalTitle}";
  ui.modalMessage.textContent = "${modalMessage}";
  ui.buttonMute.checked = false;
  ui.buttonHold.checked = false;

  // 通話時間タイマーの終了
  clearInterval(timerInterval);
  timerInterval = null;
  duringCallStartTime = null;
};

const openIncomingCallModal = (modalTitle) => {
  ui.modal.style.display = "flex";
  ui.modalTitle.textContent = modalTitle;
  ui.modalMessage.textContent = "着信中...";
  ui.buttonDecline.parentElement.parentElement.style.display = "block";
  ui.buttonAccept.parentElement.parentElement.style.display = "block";
  ui.buttonMute.parentElement.parentElement.style.display = "none";
  ui.buttonEnd.parentElement.parentElement.style.display = "none";
  ui.buttonHold.parentElement.parentElement.style.display = "none";
};

const openOutgoingCallModal = (modalTitle) => {
  ui.modal.style.display = "flex";
  ui.modalTitle.textContent = modalTitle;
  ui.modalMessage.textContent = "呼び出し中...";
  ui.buttonDecline.parentElement.parentElement.style.display = "none";
  ui.buttonAccept.parentElement.parentElement.style.display = "none";
  ui.buttonMute.parentElement.parentElement.style.display = "block";
  ui.buttonEnd.parentElement.parentElement.style.display = "block";
  ui.buttonHold.parentElement.parentElement.style.display = "none";
};

const openDuringCallModal = () => {
  ui.modal.style.display = "flex";
  // ui.modalTitle.textContent = modalTitle;
  ui.modalMessage.textContent = "00:00";
  ui.buttonDecline.parentElement.parentElement.style.display = "none";
  ui.buttonAccept.parentElement.parentElement.style.display = "none";
  ui.buttonMute.parentElement.parentElement.style.display = "block";
  ui.buttonEnd.parentElement.parentElement.style.display = "block";
  ui.buttonHold.parentElement.parentElement.style.display = "block";
  // 通話時間タイマーの開始
  startTime = Date.now();
  updateDuringCallTime();
  timerInterval = setInterval(updateDuringCallTime, 100);
};

const updateDuringCallTime = () => {
  const ms = Date.now() - startTime;
  const ts = Math.floor(ms / 1000);
  const hh = String(Math.floor(ts / 3600)).padStart(2, "0");
  const mm = String(Math.floor((ts % 3600) / 60)).padStart(2, "0");
  const ss = String(ts % 60).padStart(2, "0");
  ui.modalMessage.textContent = hh === "00" ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`;
};

/**
 * Update Wifi Level (Debug)
 */
const updateWifiLevel = () => {
  document.getElementById("wifiLevel").textContent = Android.getWifiLevel();
};
updateWifiLevel();
setInterval(updateWifiLevel(), 1000 * 5);

/**
 * Update Battery Level (Debug)
 */
const updateBatteryLevel = () => {
  document.getElementById("batteryLevel").textContent = Android.getBatteryLevel();
};
updateBatteryLevel();
setInterval(updateBatteryLevel(), 1000 * 5);
