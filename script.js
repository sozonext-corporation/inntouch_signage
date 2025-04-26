const SIP_SERVER = "sip.inntouch.jp";
const SIP_DOMAIN = "its2.sozonext.com";
const EXTENSION_NUMBER = "101";
const EXTENSION_PASSWORD = "p@ssw0rd";
const TARGET_EXTENSION_NUMBER = "801";

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
  document.getElementById("keyCode").innerHTML = e.key;
});
document.addEventListener("keypress", (e) => {
  document.getElementById("keyup").innerHTML = e.key;
});

/**
 * Call
 */
document.getElementById("call").addEventListener("click", (e) => {
  if (Android.call(TARGET_EXTENSION_NUMBER)) {
    document.getElementById("outgoingCall").style.display = "flex";
  }
});

const handleEndClick = (e) => {
  if (Android.hangUp()) {
    document.getElementById("outgoingCall").style.display = "none";
    document.getElementById("duringCall").style.display = "none";
  }
};

const handleHoldClick = (e) => {
  const isChecked = e.target.checked;
  if (!Android.hold(isChecked)) {
    e.preventDefault();
    e.target.checked = !isChecked;
  }
};

const handleMuteClick = (e) => {
  const isChecked = e.target.checked;
  if (!Android.mute(isChecked)) {
    e.preventDefault();
    e.target.checked = !isChecked;
  }
};

/**
 * Incoming Call
 */
document.getElementById("incomingDecline").addEventListener("click", (e) => {
  document.getElementById("incomingCall").style.display = "none";
  return;
});
document.getElementById("incomingAccept").addEventListener("click", (e) => {
  if (Android.answer()) {
    document.getElementById("incomingCall").style.display = "none";
    document.getElementById("duringCall").style.display = "flex";
  }
});

/**
 * Outgoing Call
 */
document.getElementById("outgoingMute").addEventListener("click", handleMuteClick);
document.getElementById("outgoingEnd").addEventListener("click", handleEndClick);

/**
 * During Call
 */
document.getElementById("duringMute").addEventListener("click", handleMuteClick);
document.getElementById("duringEnd").addEventListener("click", handleEndClick);
document.getElementById("duringHold").addEventListener("click", handleHoldClick);

/**
 * Debug
 */
document.getElementById("debugOpenIncomingCall").addEventListener("click", (e) => {
  document.getElementById("incomingCall").style.display = "flex";
});
document.getElementById("debugOpenOutgoingCall").addEventListener("click", (e) => {
  document.getElementById("outgoingCall").style.display = "flex";
});
document.getElementById("debugOpenDuringCall").addEventListener("click", (e) => {
  document.getElementById("duringCall").style.display = "flex";
});
