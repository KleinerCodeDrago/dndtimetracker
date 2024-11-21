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

app.use(express.static(path.join(__dirname, '../public')));

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = (req, res) => {
    const handle = app.getRequestHandler();
    return handle(req, res);
};