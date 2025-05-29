document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("errorMessage");
    const loginButton = document.getElementById("loginButton");

    document.getElementById("errorMessage").classList.add("hidden");
    document.getElementById("usernameError").classList.add("hidden");
    document.getElementById("passwordError").classList.add("hidden");
    document.getElementById("minError").classList.add("hidden");

    let hasError = false;

    if (!username) {
      document.getElementById("usernameError").classList.remove("hidden");
      hasError = true;
    }

    if (!password) {
      document.getElementById("passwordError").classList.remove("hidden");
      hasError = true;
    } else if (password.length < 6) {
      document.getElementById("minError").classList.remove("hidden");
      hasError = true;
    }

    if (hasError) return;

    // ⏳ Mulai loading
    loginButton.disabled = true;
    loginButton.textContent = "Loading...";

    try {
      const res = await fetch(`${window.env.API_URL}/account/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        await window.pouchdb.saveUser(username, password);
        alert("Login success!");
        window.location.href = "dashboard.html";
      } else {
        const errText = await res.text();
        throw new Error(res.status);
      }
    } catch (err) {
      const localUser = await window.pouchdb.getUser(username);
      if (localUser) {
        const valid = await window.pouchdb.verifyPassword(
          password,
          localUser.passwordHash
        );
        if (valid) {
          alert("Login success (offline)");
          window.location.href = "dashboard-offline.html";
          return;
        }
      }

      errorBox.textContent = "Login Failed, Invalid credentials";
      errorBox.classList.remove("hidden");
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "SIGN IN";
    }
  });
