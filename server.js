var http = require("http");
var express = require("express");
var socket_io = require("socket.io");
var clients = {};

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var i = 0;

io.on('connection', function (socket) {
    console.log('Client connected');
    // console.log(i);
    // i += 1;
    socket.on('disconnect', function() {
        console.log('This user disconnected:');
        console.log(socket.id);
        delete clients[socket.id];
    });    
    
    clients[socket.id] = socket;
    Object.keys(clients).forEach(function(key) {
        console.log(key);
    });    
    
    socket.on('draw', function(msg) {
        // console.log(msg);
        io.emit('draw', msg);
    });
    socket.on('guess', function(msg) {
        // console.log(msg);
        socket.broadcast.emit('guess', msg);
    });
    socket.on('newDrawer', function(msg) {
        socket.broadcast.emit('newDrawer', msg);
    });
  
});

server.listen(8080);