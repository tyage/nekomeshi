var express = require('express');
var app = express.createServer();
var ejs = require('ejs');
var io = require('socket.io');
var port = process.env.PORT || 5000;

app.configure(function() {
  var expressStatic = express.static(__dirname + '/static');

  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.get('/', function(req, res) {
    console.log('/');
    res.render('index.ejs');
  });
  app.listen(port);
});

var socket = io.listen(app);
socket.on('connection', function(client) {
  client.on('post', function (data) {
    client.emit('get', data);
    console.log(data);
  });
});

