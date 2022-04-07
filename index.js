const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const registerRoute = require('./Routes/RegisterRoute');

//static middleware for external css instead of Route
app.use(bodyParser.json());
app.use('/register', registerRoute);
//To Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/CC_Aufgabe1');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Frontend/register.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});