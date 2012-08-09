var express = require('express');
var app = express.createServer();
var ejs = require('ejs');
var io = require('socket.io');
var neko2d = require('./neko2d.js');
var port = process.env.PORT || 5000;

app.configure(function() {
	app.use(express.static(__dirname + '/static'));

	app.set('view engine', 'ejs');
	app.set('view options', { layout: false });
	app.get('/', function(req, res) {
		console.log('/');
		res.render('index.ejs');
	});
	app.listen(port);
});

var world = new neko2d.World();
var Player = function() {
		var colors = [0xff0000, 0x00ff00, 0x0000ff];
		this.color = colors[parseInt(colors.length*Math.random())];
		this.x = Math.random()*5+3;
		this.y = Math.random()*5+3;
		this.radius = Math.random()+0.3;
};
Player.prototype = new neko2d.Object();
Player.prototype.getData = function() {
	return {
		color: this.color,
		center: {
			x: this.x,
			y: this.y
		},
		radius: this.radius
	};
};

var socket = io.listen(app);
socket.on('connection', function(client) {
	var player = new Player();
	world.createObject(player);
	
	reload();
	
	client.on('move', function (direction) {
		player.move(direction);
		reload();
	});
	client.on('disconnect', function() {
		world.deleteObject(player);
	});
});

var reload = function() {
	var data = world.objects.map(function(obj, i) {
		return obj.getData();
	});
	socket.sockets.emit('reload', data);
};
