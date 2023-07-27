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

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
     
});

server.listen(3000, () => {
  console.log("App available on http://localhost:3000");
});