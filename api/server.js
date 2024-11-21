const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.json());

let players = [
    { name: "Sora", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null },
    { name: "Harpy", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null },
    { name: "Miner", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null },
    { name: "Meister", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null }
];
let activePlayer = null;
let isPaused = false;
let clients = [];

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Session_Timer_Manager.html'));
});

app.get('/api/getData', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ players, activePlayer, isPaused });
});

app.post('/api/updateData', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    players = req.body.players;
    activePlayer = req.body.activePlayer;
    isPaused = req.body.isPaused;
    broadcastUpdate();
    res.sendStatus(200);
});

app.get('/api/updates', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };
    clients.push(newClient);

    req.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
    });

    const sendUpdate = () => {
        res.write(`data: ${JSON.stringify({ players, activePlayer, isPaused })}\n\n`);
    };

    sendUpdate();
    const intervalId = setInterval(sendUpdate, 1000);

    req.on('close', () => {
        clearInterval(intervalId);
    });
});

function broadcastUpdate() {
    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify({ players, activePlayer, isPaused })}\n\n`);
    });
}

module.exports = server;