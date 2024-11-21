const express = require('express');
const Pusher = require('pusher');
const path = require('path');

const app = express();

const pusher = new Pusher({
  appId: 'your-app-id',
  key: 'your-key',
  secret: 'your-secret',
  cluster: 'your-cluster',
  useTLS: true
});

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

app.post('/updateData', (req, res) => {
    players = req.body.players;
    activePlayer = req.body.activePlayer;
    isPaused = req.body.isPaused;
    pusher.trigger('dnd-channel', 'updateData', { players, activePlayer, isPaused });
    res.sendStatus(200);
});

module.exports = app;