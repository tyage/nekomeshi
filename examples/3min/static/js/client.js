$(function() {
	var socket = new io.connect();
	socket.on('block', function(data) {
		Stage.blocks = data.blocks;
		Stage.blockWidth = data.blockWidth;
		Stage.blockHeight = data.blockHeight;
	});
	socket.on('step', function(objects) {
		Stage.draw(objects);
	});
	socket.on('waiting', function(data) {
		Stage.waiting(data);
	});
	socket.on('countdown', function(minute) {
		Stage.countdown(minute);
	});
	socket.on('gameOver', function(win) {
		Stage.gameOver(win);
	});

	// send key data
	var isKeyActive = {};
	var key2Direction = {
		37: "left",
		38:"up",
		39: "right",
		40: "down",
		65: "left", // a
		87: "up", // w
		68: "right", // d
		83: "down" // s
	};
	$(window).keydown(function(e) {
		isKeyActive[e.which] = true;
	});
	$(window).keyup(function(e) {
		isKeyActive[e.which] = false;
	});
	setInterval(function() {
		var key, keys = {};
		for (key in key2Direction) {
			if (isKeyActive[key]) {
				keys[key2Direction[key]] = true;
			}
		}
		socket.emit('move', keys);
	}, 1000/30);
});
