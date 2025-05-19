// Toggle dark mode class on the body
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // Save user's preference in localStorage
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark ? "true" : "false");
}

// Apply dark mode on page load based on saved preference or system preference
window.addEventListener("DOMContentLoaded", () => {
    const userPref = localStorage.getItem("darkMode");

    if (userPref === null) {
        // No preference saved yet, check system setting
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "true");
        }
    } else if (userPref === "true") {
        document.body.classList.add("dark-mode");
    }
});

