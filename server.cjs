const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("./www/"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/www/index.html');
});

let players = [];

io.on('connection', (socket) => {
    if(players.length >= 2) { 
        socket.emit('full');
        socket.disconnect(true);
        return;
    }

    if(players.length == 1) { 
        socket.emit('matched with player');
        io.emit('start');
    }

    if(players.length == 0) {
        socket.emit('waiting for player');
    }

    players.push(socket.id);
    console.log('a user connected');
    
    

    socket.on('disconnect', () => {
        players = players.filter(player => player !== socket.id);
        console.log('user disconnected');
    });

    socket.on('move', (move) => {
        socket.broadcast.emit('move', move);
    });
     
});

server.listen(process.env.PORT || '3000', () => {
  console.log(`App available on http://localhost:${process.env.PORT || '3000'}`);
});