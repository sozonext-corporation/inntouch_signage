const SIP_SERVER = "sip.inntouch.jp";
const SIP_DOMAIN = "its2.sozonext.com";
const EXTENSION_NUMBER = "101";
const EXTENSION_PASSWORD = "p@ssw0rd";
const EXTENSION_NUMBER_ = "801";

// Swiper
const swiper = new Swiper(".swiper", {
  loop: true,
  speed: 2 * 1000,
  autoplay: {
    delay: 10 * 1000,
  },
});

/**
 * Event
 */
window.onload = () => {
  register();
};

document.addEventListener("keydown", (e) => {
  document.getElementById("keyCode").innerHTML = e.key;
});

document.addEventListener("keypress", (e) => {
  document.getElementById("keyup").innerHTML = e.key;
});

/**
 * Android Interface
 */
const register = () => {
  return Android.register(SIP_SERVER, SIP_DOMAIN, EXTENSION_NUMBER, EXTENSION_PASSWORD);
};

const call = () => {
  return Android.call(EXTENSION_NUMBER_);
};

const answer = () => {
  return Android.answer();
};

const hangUp = () => {
  return Android.hangUp();
};

const mute = () => {
  return Android.mute();
};

const hold = () => {
  return Android.hold();
};


document.addEventListener("click", (e) => {
  const modal = document.getElementsByClassName("modal");
  if (e.target == modal[0]) {
    modal[0].style.display = "none";
  }
  if (e.target == modal[1]) {
    modal[1].style.display = "none";
  }
  if (e.target == modal[2]) {
    modal[2].style.display = "none";
  }
});
document.getElementById("debugOpenIncomingCall").addEventListener("click", (e) => {
  document.getElementById("incomingCall").style.display = "flex";
});
document.getElementById("debugOpenOutgoingCall").addEventListener("click", (e) => {
  document.getElementById("outgoingCall").style.display = "flex";
});
document.getElementById("debugOpenDuringCall").addEventListener("click", (e) => {
  document.getElementById("duringCall").style.display = "flex";
});
