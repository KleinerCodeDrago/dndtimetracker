const maxWaitTime = 60000;
const maxCurrentActiveTime = 300000;

let players = [];
let activePlayer = null;
let isPaused = false;
let intervalId = null;
let isAdmin = false;

async function fetchData() {
    try {
        const response = await fetch('/api/getData');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        players = data.players;
        activePlayer = data.activePlayer;
        isPaused = data.isPaused;
        renderPlayers();
        updatePlayerStyles();
        return true;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
}

async function saveData() {
    if (!isAdmin) return;
    try {
        const response = await fetch('/api/updateData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ players, activePlayer, isPaused })
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function addPlayer() {
    const playerName = prompt("Enter player name:");
    if (!playerName) return;
    
    players.push({
        name: playerName,
        waitTime: 0,
        activeTime: 0,
        currentActiveTime: 0,
        startTime: null
    });
    
    await saveData();
    renderPlayers();
}

// ... existing timer and rendering functions ...

async function initializeApp() {
    const dataLoaded = await fetchData();
    if (!dataLoaded) {
        console.error('Failed to load initial data');
        return;
    }

    const password = prompt("Enter password:");
    isAdmin = password === "admin_password";

    if (!isAdmin) {
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

    startTimer();
    setInterval(() => fetchData(), 5000);
}

document.addEventListener("DOMContentLoaded", initializeApp);