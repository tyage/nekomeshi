var express = require('express'),
	app = express.createServer(),
	ejs = require('ejs'),
	io = require('socket.io'),
	neko = require('./neko2d.js'),
	port = process.env.PORT || 5000;

app.configure(function() {
	app.use(express.static(__dirname + '/static'));

	app.set('view engine', 'ejs');
	app.set('view options', { layout: false });
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});
	app.listen(port);
});


var clients = [];
var waitingClients = [];
var waitingMax = 3;

var socket = io.listen(app);
socket.on("connection", function(client) {
	client.player = new neko.player();
	client.player.x = 1.2;
	client.player.y = 1.2;
	
	waitingClients.push(client);
	if (waitingClients.length >= waitingMax) {
		startGame(waitingClients);
	} else {
		waitingClients.forEach(function(client, i) {
			client.emit("waiting", {
				waiting: waitingClients.length,
				max: waitingMax
			});
		});
	}

	client.on("move", function(data) {
		client.player.keys = data;
	});
});

var startGame = function(clients) {
	waitingClients = [];

	var countdown = function(count, callback) {
		if (count > 0) {
			clients.forEach(function(client, i) {
				client.emit("countdown", count);
			});
			setTimeout(function() {
				countdown(count-1, callback);
			}, 1000);
		} else {
			callback();
		}
	};
	
	var world = createWorld();
	world.addPlayers(clients.map(function(client, i) {
		return client.player;
	}));
	clients.forEach(function(client, i) {
		client.emit("block", {
			blocks: world.blockMap,
			blockWidth: world.blockWidth,
			blockHeight: world.blockHeight
		});
	});
	
	countdown(3, function() {
		var timer = setInterval(function() {
			world.step();
			var data = world.getData();
			clients.forEach(function(client, i) {
				client.emit("step", data);
			});
		}, 1000/60);
		world.gameOver = function(player) {
			clearInterval(timer);
			clients.forEach(function(client, i) {
				client.emit("gameOver", (player === client.player));
			});
		};
	});
};

var createWorld = function() {
	var world = new neko.world();
	world.blockMap = [
		[1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,1,1,1,1,1,0,1,1,0,1],
		[1,0,1,0,0,0,1,0,0,1,0,1],
		[1,0,1,0,1,0,1,1,0,1,0,1],
		[1,0,1,0,1,0,0,0,0,1,0,1],
		[1,0,1,0,0,1,0,1,1,1,0,1],
		[1,0,1,1,0,1,0,0,0,1,0,1],
		[1,0,0,0,0,1,0,1,0,0,0,1],
		[1,1,1,1,1,1,0,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,2,1],
		[1,1,1,1,1,1,1,1,1,1,1,1]
	];

	world.blockData[0] = new neko.block();
	world.blockData[0].blockable = false;

	world.blockData[1] = new neko.block();
	world.blockData[1].blockable = true;
	
	world.blockData[2] = new neko.block();
	world.blockData[2].blockable = false;
	world.blockData[2].onBlock = function(player) {
		world.gameOver(player);
	};
	
	world.getData = function() {
		data = [];
		this.players.forEach(function(player, i) {
			data.push({
				x: player.x,
				y: player.y,
				width: player.width,
				height: player.height
			});
		});
		return data;
	};

	return world;
};
