const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const registerRoute = require('./Routes/RegisterRoute');
const logInRoute = require('./Routes/LoginRoute');
const https = require('https');
const redis = require('socket.io-redis');
var port = process.env.PORT || 3000;
var serverName = process.env.NAME || 'Unknown';

io.adapter(redis({ host: 'redis', port: 6379 }));

//http Server
server.listen(port, function () {
  console.log('Server listening at port %d', port);
  console.log('Hello, I\'m %s, how can I help?', serverName);
});

//To Connect to DB
mongoose.connect('mongodb://mongo:27017/');

//Routes
app.use(bodyParser.json());
app.use('/register', registerRoute);
app.use('/logIn', logInRoute);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Frontend/login_register.html');
});

app.get('/register', (req,res) => {
  res.sendFile(__dirname + '/Frontend/register.html');
});

app.get('/index', (req,res) => {
  res.sendFile(__dirname + '/Frontend/index.html');
});

app.get('/logIn', (req,res) => {
  res.sendFile(__dirname + '/Frontend/logIn.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/Frontend/register.html');
});

app.get('/chatroom', (req, res) => {
  res.sendFile(__dirname + '/Frontend/index.html')
})

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
//Socket ist Verbindung "on" heisst man will etwas fangen. Wenn sendFile Event eintritt wird Socket aktiviert
io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
});

/**
 * Catching Events from Frontend here and send the payloads back to every Client
 *
 * With io.emit, the Payload gets back to the Chatroom so every Client can see the incoming Message. It is possible to den multi-media Files.
 * There are different Events for different File Types so the Frontend Code can handle them.
 */
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
    socket.on("sendImage", (imageUrl) => {
      console.log("Image blob: " + imageUrl);
      io.emit("sendImage", imageUrl);
    });
    socket.on("sendAudio", (audioUrl) => {
      console.log("Audio blob: " + audioUrl);
      io.emit("sendAudio", audioUrl);
    });
    socket.on("sendVideo", (videoUrl) => {
      console.log("Video blob: " + videoUrl);
      io.emit("sendVideo", videoUrl);

    })
});



//https Server
/* const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'tls/ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'tls/ssl', 'cert.pem')),
  },
  app
)

sslServer.listen(3000, () => console.log('Server on Port 3000')); */