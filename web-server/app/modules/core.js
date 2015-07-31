var fs = require('fs');
var url = require('url');
var cookie = require('cookie')
var cookieSgn = require('cookie-signature');

module.exports = function RoomsBinaryCore(io) {
  io.on('connection', function(socket){
    if (socket.handshake && socket.handshake.headers && socket.handshake.headers.cookie) {
      var raw = cookie.parse(socket.handshake.headers.cookie)['connect.sid'];
      if (raw) {
        socket.sessionId = raw;
      }
    }

    var roomName = url.parse(socket.handshake.url, true).query.username;

    API.subscribeUserToRoom(roomName,socket.sessionId,function (val) {
      if(val == 1)
        socket.join(roomName);
    });

    sendUserWelcomeImage(socket);

    socket.on('disconnect', function() {
      API.unsubscribeUserFromRoom(roomName,socket.sessionId)
      socket.leave(roomName)
    });

    socket.on('audio-blod-send',function(data){
      socket.broadcast.to(roomName).emit('audio-blod-receive', data);
    });

    socket.on('heartbeat', function(){
      sendUserWelcomeImage(socket);
    });
  });
}


function sendUserWelcomeImage(socket)
{
  fs.readFile('./app/files/heart.png', function(err, buf){
    socket.emit('heartbeat', { image: true, buffer: buf.toString('base64') });
  });
}

//CHEATSHEET

// send to current request socket client
//socket.emit('message', "this is a test");

// sending to all clients, include sender
//io.sockets.emit('message', "this is a test");

// sending to all clients except sender
//socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
//socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
//io.sockets.in('game').emit('message', 'cool game');

// sending to individual socketid
//io.sockets.socket(socketid).emit('message', 'for your eyes only');
