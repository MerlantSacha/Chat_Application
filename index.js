// Server side

// Managing dependencies
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Array of all the messages recieved by the server
var allMessages = [];
var allClients = [];

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

// Show in the console when a user connect or disconnect
io.on('connection', function(socket){
  console.log(socket.id+' user connected');
  socket.on('disconnect', function(){
    console.log(socket.id+'user disconnected');
  });
});

// Send to the client its uid when he first connects
io.on('connection', function(socket){
	var uid = socket.id.toString();
	allClients.push(socket.id);
	socket.emit('Giving uid',uid);
});

// If a user enter the chat the server pass him all the messages exchanged before he get there
io.on('connection', function(socket){
 	var hugeChain = "";
 	for (var i = 0 ; i < allMessages.length; i++) {
 		hugeChain += (i!=0?"#":"")+allMessages[i];
 	}
    socket.emit('Missed messages', hugeChain);
});

// Show the message in the console
/*io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});*/

// Send the message to everyone (including sender)
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	allMessages.push(msg);
    io.emit('chat message', msg);
  });
});

// Listening on the 3000th port and printing it in the console
http.listen(3000, function(){
  console.log('listening on *:3000');
}
);

