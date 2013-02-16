var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	ejs = require('ejs'),
	io = require('socket.io').listen(server),
	setting = require('./setting.js'),
	world = require('./world.js');

app.use(express.static(__dirname + '/static'));

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.get('/', function(req, res) {
	res.render('index.ejs');
});
server.listen(setting.server.port);

io.on('connection', function(client) {
	var player = world.createPlayer();
	client.emit('player', player.getData());

	client.on('actions', function (actions) {
		player.actions = actions;
	});
	client.on('disconnect', function() {
		player.delete();
	});
});

world.start(function() {
	var data = world.bodies.map(function(body, i) {
		return body.getData();
	});
	io.sockets.emit('reload', data);
});