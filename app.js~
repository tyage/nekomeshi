var express = require('express');
var app = express.createServer();
var io = require('socket.io');
var port = process.env.PORT || 3000;

app.configure(function() {
app.get('/', function(req, res) {
	console.log('/');
	res.render('index.html');
});
app.listen(port);

var socket = io.listen(app);
socket.on('connection', function(client) {
	client.on('message', function(msg) {
		console.log('send :' + msg);
		client.send(msg);
		client.broadcast(msg);
	});
	client.on('disconnect', function() {
		console.log('disconnect');
	});
});

