const SIP_SERVER = "sip.inntouch.jp";
const SIP_DOMAIN = "its2.sozonext.com";
const EXTENSION_NUMBER = "101";
const EXTENSION_PASSWORD = "P@ssw0rd";
const EXTENSION_NUMBER_ = "801";

// Swiper
const swiper = new Swiper(".swiper", {
  loop: true,
  speed: 2 * 1000,
  autoplay: {
    delay: 10 * 1000,
  },
});

window.onload = () => {
  register();
};

// Android (Kotlin)
window.chargingchange = (charging) => {
  document.getElementById("charging").innerText = charging ? "True" : "False";
};

window.incoming = () => {
  document.getElementById("modal").style.display = "flex";
};

document.getElementById("button_call").addEventListener("click", () => {
  document.getElementById("modal").style.display = "flex";
});

document.addEventListener("click", (e) => {
  const modal = document.getElementById("modal");
  if (e.target == modal) {
    modal.style.display = "none";
  }
});

document.addEventListener("keydown", (e) => {
  document.getElementById("keyCode").innerHTML = e.key;
});

document.addEventListener("keypress", (e) => {
  document.getElementById("keyup").innerHTML = e.key;
});

const register = () => {
  const json = {
    event: "register",
    sip_server: SIP_SERVER,
    sip_domain: SIP_DOMAIN,
    extension_number: EXTENSION_NUMBER,
    extension_password: EXTENSION_PASSWORD,
  };
  alert(JSON.stringify(json));
};

const call = () => {
  const json = {
    event: "call",
    extension_number: EXTENSION_NUMBER_,
  };
  alert(JSON.stringify(json));
};

const answer = () => {
  const json = {
    event: "answer",
  };
  alert(JSON.stringify(json));
};

const hangUp = () => {
  const json = {
    event: "hangUp",
  };
  alert(JSON.stringify(json));
};

const mute = () => {
  const json = {
    event: "mute",
  };
  alert(JSON.stringify(json));
};
