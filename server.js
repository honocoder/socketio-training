const path = require('path');
const http = require('http');
const express = require("express");
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = 'ChatCord Bot';

// Run when a client connects
io.on('connection', socket => {
    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connect
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the room'));

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the room'));
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage("User", msg))
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(3000, () => console.log(`Server running on port ${PORT}`));