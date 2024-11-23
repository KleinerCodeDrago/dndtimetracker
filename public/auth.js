
document.addEventListener("DOMContentLoaded", () => {
    const password = prompt("Enter password:");
    const isAdmin = password === "node server.js";

    if (password === null || !isAdmin) {
        const adminButtons = [
            "addPlayerButton",
            "resetSessionButton",
            "togglePauseButton",
            "exportPlayersButton",
            "importPlayersButton"
        ];
        
        adminButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) button.style.display = "none";
        });
    }
});