$(function() {
	var socket = new io.connect();
	var player = null;
	socket.on('reload', function(objects) {
		var i = 0, l = objects.length, object;
		for (;i<l;++i) {
			object = objects[i];
			if (object) {
				if (object.isOni) {
					object.color = '0xff0000';
				} else if (object.id === player.id) {
					object.color = '0x0000ff';
				} else {
					object.color = '0x00ff00';
				}
			}
		};

		Stage.draw(objects);
	});
	socket.on('player', function(p) {
		player = p;
	});

	var isKeyActive = {};
	var usedKeys = [37,38,39,40];
	var key2Action = {37: "left", 38:"up", 39: "right", 40: "down"};
	var actions = {};
	$(window).keydown(function(e) {
		isKeyActive[e.which] = true;
		emit();
	});
	$(window).keyup(function(e) {
		isKeyActive[e.which] = false;
		emit();
	});
	var emit = function() {
		var i = 0, l = usedKeys.length, data = {};
		for (;i<l;++i) {
			var key = usedKeys[i];
			data[key2Action[key]] = isKeyActive[key];
		}
		socket.emit('actions', data);
	};
});
