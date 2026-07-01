function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");


    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark ? "true" : "false");
}

window.addEventListener("DOMContentLoaded", () => {
    const userPref = localStorage.getItem("darkMode");

    if (userPref === null) {
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "true");
        }
    } else if (userPref === "true") {
        document.body.classList.add("dark-mode");
    }
});

