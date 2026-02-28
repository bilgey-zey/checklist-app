let isLogin = true;

const formTitle = document.getElementById("formTitle");
const toggleText = document.getElementById("toggleText");
const submitBtn = document.getElementById("submitBtn");
const messageBox = document.getElementById("message");

toggleText.addEventListener("click", toggleMode);
submitBtn.addEventListener("click", submitForm);

function toggleMode() {
  isLogin = !isLogin;

  formTitle.innerText = isLogin ? "Login" : "Register";
  toggleText.innerText = isLogin
    ? "Don't have an account? Register"
    : "Already have an account? Login";
}

async function submitForm() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  messageBox.innerText = "Loading...";
  messageBox.style.color = "black";

  const endpoint = isLogin
    ? "/api/login"
    : "/api/register";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      if (isLogin) {
        localStorage.setItem("userId", data.userId);
        messageBox.style.color = "green";
        messageBox.innerText = "Login successful!";
        window.location.href = "/todos.html";
      } else {
        messageBox.style.color = "green";
        messageBox.innerText = "Register successful! You can now login.";
        toggleMode();
      }
    } else {
      messageBox.style.color = "red";
      messageBox.innerText = data.message;
    }

  } catch (error) {
    messageBox.innerText = "Server error";
  }
}
