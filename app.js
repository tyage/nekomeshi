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
	
	client.on('actions', function (actions) {
		player.setActions(actions);
	});
	client.on('disconnect', function() {
		player.delete();
	});
});

world.start(function() {
	var data = world.objects.map(function(obj, i) {
		return obj.getData();
	});
	io.sockets.emit('reload', data);
});