async function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const messageDiv = document.getElementById("message");

    try {
        const response = await fetch("/api/Auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role })
        });

        const result = await response.json();

        if (result.success) {
            messageDiv.style.color = "green";
        } else {
            messageDiv.style.color = "red";
        }
        messageDiv.textContent = result.message;
    } catch (err) {
        console.error("Error:", err);
        messageDiv.style.color = "red";
        messageDiv.textContent = "Server error";
    }
}