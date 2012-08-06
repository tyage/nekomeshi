var express = require('express');
var app = express.createServer();
var ejs = require('ejs');
var io = require('socket.io');
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

var objects = [];

var Player = function() {
	var colors = ["red", "blue", "green"];
	this.color = colors[parseInt(colors.length*Math.random())];
	this.x = parseInt(Math.random()*50);
	this.y = parseInt(Math.random()*40);
	this.size = parseInt(Math.random()*10+10);
};
Player.prototype = {
	move: function(direction) {
		var moveStep = 3;
		var moveVectors = {
			right: [1,0],
			left: [-1,0],
			up: [0,-1],
			down: [0,1]
		};
		var vector = moveVectors[direction];
		if (vector) {
			this.x += vector[0] * moveStep;
			this.y += vector[1] * moveStep;
		}
	},
	getData: function() {
		return {
			color: this.color,
			x: this.x,
			y: this.y,
			size: this.size
		};
	}
};

var socket = io.listen(app);
socket.on('connection', function(client) {
	var player = new Player();
	objects.push(player);
	
	client.on('move', function (direction) {
		player.move(direction);
	});
	client.on('disconnect', function() {
		var del = 0;
		objects.forEach(function(obj, i) {
			if (obj === player) {
				del = i;
				return false;
			}
		});
		delete objects[del];
	});
});

setInterval(function() {
	var data = objects.map(function(obj, i) {
		return obj.getData();
	});
	socket.sockets.emit('reload', data);
	console.log(data);
}, 100);

