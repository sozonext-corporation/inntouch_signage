const path = window.location.pathname.split("/");
const SIP_SERVER = "sip.inntouch.jp";
const SIP_DOMAIN = path[3]; // xxxxxxxx.inntouch.jp
const EXTENSION_NUMBER = path[4]; // 101
const EXTENSION_PASSWORD = "P@ssw0rd";
const TARGET_EXTENSION_NUMBER = path[5]; // 901
const TARGET_EXTENSION_DISPLAY_NAME = "フロント";

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
};

/**
 * onHookSwitchOn
 */
const onHookSwitchOn = () => {
  console.log("onHookSwitchOn");
};

/**
 * onHookSwitchOff
 */
const onHookSwitchOff = () => {
  console.log("onHookSwitchOff");
};

/**
 * 音声電話をする (WebView→Android)
 */
document.getElementById("buttonCall").addEventListener("click", (e) => {
  Android.call(TARGET_EXTENSION_NUMBER);
});

/**
 * ビデオ電話をする (WebView→Android)
 */
document.getElementById("buttonVideoCall").addEventListener("click", (e) => {
  Android.videoCall(TARGET_EXTENSION_NUMBER);
});
