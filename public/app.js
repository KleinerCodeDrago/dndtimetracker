
const maxWaitTime = 60000; // 1 minute in milliseconds
const maxCurrentActiveTime = 300000; // 5 minutes in milliseconds

let players = [];
let activePlayer = null;
let isPaused = false;
let intervalId = null;

// ... Rest of your JavaScript functions ...
// (All the functions from your original script, but moved to this separate file)

document.addEventListener("DOMContentLoaded", () => {
    fetchData(); // Fetch data immediately on page load
    intervalId = setInterval(updateTimers, 1000);
    setInterval(fetchData, 5000); // Poll the server every 5 seconds
});