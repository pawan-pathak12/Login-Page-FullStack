async function login(event) {
    event.preventDefault(); // stop form refresh

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const messageDiv = document.getElementById("message");

    try {
        // 🔑 MAIN JOIN POINT: Frontend → Backend
        // This is where your frontend (JS in browser) calls your backend API.
        // "/api/Login/Login" is the endpoint exposed by your ASP.NET Core controller.
        const response = await fetch("/api/Login/Login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }) // sending data to backend
        });

        // Backend → Frontend
        // The backend responds with JSON (success, username, role, redirectUrl).
        const result = await response.json();

        if (result.success) {
            localStorage.setItem("username", result.username);
            window.location.href = result.redirectUrl; // redirect after success
        }
        else {
            messageDiv.style.color = "red";
            messageDiv.textContent = result.message || "Login failed!";
        }
    } catch (error) {
        console.error("Error during login:", error);
        messageDiv.textContent = "Server error";
    }
}

function togglePassword() {
    const pwd = document.getElementById("password");
    pwd.type = pwd.type === "password" ? "text" : "password";
}