module.exports = (function() {
	var _Object = function() {};
	_Object.prototype = {
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
		}
	};
	
	var _World = function() {
		this.objects = [];
	};
	_World.prototype = {
		createObject: function(object) {
			this.objects.push(object);
		},
		deleteObject: function(object) {
			var del = -1;
			this.objects.forEach(function(obj, i) {
				if (obj === object) {
					del = i;
					return false;
				}
			});
			if (del >= 0) {
				delete this.objects[del];
			}
		}
	};
	
	return {
		Object: _Object,
		World: _World
	};
})();
