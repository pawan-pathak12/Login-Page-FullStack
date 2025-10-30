async function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const messageDiv = document.getElementById("message");

    // Basic validation
    if (!username || !email || !password || !role) {
        messageDiv.style.color = "red";
        messageDiv.textContent = "Please fill in all fields";
        return;
    }

    try {
        const response = await fetch("/api/Auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, role })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            messageDiv.style.color = "green";
            messageDiv.textContent = "✅ Registration successful! Redirecting to login...";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            messageDiv.style.color = "red";
            messageDiv.textContent = result.message || "Registration failed";
        }
    } catch (err) {
        console.error("Error:", err);
        messageDiv.style.color = "red";
        messageDiv.textContent = "Server error - please try again later";
    }
}