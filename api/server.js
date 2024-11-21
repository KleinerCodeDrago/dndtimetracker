const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [
    { name: "Sora", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null },
    { name: "Harpy", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null },
    { name: "Miner", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null },
    { name: "Meister", waitTime: 0, activeTime: 0, currentActiveTime: 0, startTime: null }
];
let activePlayer = null;
let isPaused = false;

app.use(express.static('public'));

// Serve the HTML file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Session_Timer_Manager.html'));
});

io.on('connection', (socket) => {
    socket.emit('initialData', { players, activePlayer, isPaused });

    socket.on('updateData', (data) => {
        players = data.players;
        activePlayer = data.activePlayer;
        isPaused = data.isPaused;
        io.emit('updateData', { players, activePlayer, isPaused });
    });
});

module.exports = (req, res) => {
    try {
        server.emit('request', req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).send('Internal Server Error');
    }
};