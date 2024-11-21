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

app.use(express.static(path.join(__dirname, '../public')));

// Serve socket.io client script
app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Session_Timer_Manager.html'));
});

app.get('/getData', (req, res) => {
    res.json({ players, activePlayer, isPaused });
});

app.post('/updateData', (req, res) => {
    players = req.body.players;
    activePlayer = req.body.activePlayer;
    isPaused = req.body.isPaused;
    res.sendStatus(200);
});

module.exports = app;