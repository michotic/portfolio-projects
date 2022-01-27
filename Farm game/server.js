var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 7777, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('NodeJS Server initiated on http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

io.sockets.on('connection',
  function (socket) {
    console.log("Client Connected, ID: " + socket.id);
  }
);