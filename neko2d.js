module.exports = (function() {
	var _Object = function() {};
	_Object.prototype = {
		move: function(direction) {
			var moveStep = 0.2;
			var moveVectors = {
				right: [moveStep, 0],
				left: [-moveStep, 0],
				up: [0, -moveStep],
				down: [0, moveStep]
			};
			var vector = moveVectors[direction];
			if (vector && this.canMove(vector)) {
				this.x += vector[0];
				this.y += vector[1];
			}
		},
		canMove: function(vector) {
			var canMove = true;
			var self = this;
			this.x += vector[0];
			this.y += vector[1];
			this.world.objects.forEach(function(obj, i) {
				if (obj && obj !== self && 
					self.distance(obj) < self.radius + obj.radius) {
					canMove = false;
					return false;
				}
			});
			this.x -= vector[0];
			this.y -= vector[1];
			return canMove;
		},
		distance: function(object) {
			return Math.sqrt(Math.pow(object.x-this.x,2)+Math.pow(object.y-this.y,2));
		}
	};
	
	var _World = function() {
		this.objects = [];
	};
	_World.prototype = {
		createObject: function(object) {
			object.world = this;
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
