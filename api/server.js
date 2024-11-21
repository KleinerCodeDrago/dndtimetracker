const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
app.use(express.json());

const serviceAccount = require('./path/to/your/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com'
});

const db = admin.database();
const ref = db.ref('dndtimetracker');

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
    ref.set({ players, activePlayer, isPaused });
    res.sendStatus(200);
});

module.exports = app;