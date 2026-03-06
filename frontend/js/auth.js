let isLogin = true;

import { applyAuthPageTranslations, t, getLocale, setLocale } from "./i18n.js";

const formTitle = document.getElementById("formTitle");
const toggleBtn = document.getElementById("toggleBtn");
const submitBtn = document.getElementById("submitBtn");
const messageBox = document.getElementById("message");
const langSelect = document.getElementById("langSelectAuth");

toggleBtn.addEventListener("click", toggleMode);
submitBtn.addEventListener("click", submitForm);

function refreshLanguage() {
  applyAuthPageTranslations({ isLogin });
  if (langSelect) {
    langSelect.value = getLocale();
  }
}

if (langSelect) {
  langSelect.addEventListener("change", (e) => {
    setLocale(e.target.value);
    refreshLanguage();
  });
}

refreshLanguage();

function toggleMode() {
  isLogin = !isLogin;
  applyAuthPageTranslations({ isLogin });
}

async function submitForm() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    messageBox.innerText = t("emailPasswordRequired");
    messageBox.style.color = "red";
    return;
  }

  messageBox.innerText = t("loading");
  messageBox.style.color = "black";

  const endpoint = isLogin
    ? "/api/login"
    : "/api/register";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": getLocale()
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      if (isLogin) {
        localStorage.setItem("userId", data.userId);
        messageBox.style.color = "green";
        messageBox.innerText = t("loginSuccess");
        window.location.href = "/todos.html";
      } else {
        messageBox.style.color = "green";
        messageBox.innerText = t("registerSuccess");
        toggleMode();
      }
    } else {
      messageBox.style.color = "red";
      messageBox.innerText = (data && data.message) ? data.message : t("serverError");
    }

  } catch (error) {
    messageBox.style.color = "red";
    messageBox.innerText = t("serverError");
  }
}