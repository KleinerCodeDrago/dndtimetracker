
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

let players = [
    { name: "Sora", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null },
    { name: "Harpy", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null },
    { name: "Miner", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null },
    { name: "Meister", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null }
];
let activePlayer = null;
let isPaused = false;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/getData', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ players, activePlayer, isPaused });
});

app.post('/api/updateData', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    players = req.body.players;
    activePlayer = req.body.activePlayer;
    isPaused = req.body.isPaused;
    res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});