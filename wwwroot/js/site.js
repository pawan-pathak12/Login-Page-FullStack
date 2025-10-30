// Toggle password visibility
document.querySelector(".toggle-btn").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        this.textContent = "👁";
    }
});

// Handle login form submit
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    try {
        const response = await fetch("/api/login/Login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = "✅ Login successful! Redirecting...";

            // Store user info for dashboard
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", result.username || email.split('@')[0]);
            localStorage.setItem("userRole", result.role || "User");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);
        } else {
            message.style.color = "red";
            message.textContent = result.message || "❌ Login failed. Please try again.";
        }
    } catch (error) {
        console.error("Login error:", error);
        message.style.color = "red";
        message.textContent = "⚠️ Something went wrong. Try again later.";
    }
});

// Simple email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}