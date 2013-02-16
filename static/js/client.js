$(function() {
	var socket = new io.connect();
	socket.on('reload', function(objects) {
		Stage.draw(objects);
	});

	var isKeyActive = {};
	var usedKeys = [37,38,39,40];
	var key2Action = {37: "left", 38:"up", 39: "right", 40: "down"};
	$(window).keydown(function(e) {
		isKeyActive[e.which] = true;
	});
	$(window).keyup(function(e) {
		isKeyActive[e.which] = false;
	});
	setInterval(function() {
		var i = 0, l = usedKeys.length, data = {};
		for (;i<l;++i) {
			var key = usedKeys[i];
			data[key2Action[key]] = isKeyActive[key];
		}
		socket.emit('actions', data);
	}, 1000/60);
});
