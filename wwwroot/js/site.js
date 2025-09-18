// Attach event listener to form submit
document.getElementById("submit").addEventListener("click", login);

async function login(event) {
    event.preventDefault(); // stop form refresh

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // ✅ FIX: point to the message div, not the submit button
    const messageDiv = document.getElementById("message");

    try {
        const response = await fetch("/api/Login/Login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem("email", result.email);
            window.location.href = result.redirectUrl;
        } else {
            messageDiv.style.color = "red";
            messageDiv.textContent = result.message || "Login failed!";
        }
    } catch (error) {
        console.error("Error during login:", error);
        messageDiv.style.color = "red";
        messageDiv.textContent = "Server error";
    }
}

function togglePassword() {
    const pwd = document.getElementById("password");
    pwd.type = pwd.type === "password" ? "text" : "password";
}