module.exports = (function() {
	var _Vec = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};
	_Vec.prototype = {
		clone: function() {
			return new _Vec(this.x, this.y);
		},
		add: function(vec, y) {
			if (y !== undefined) {
				vec = new _Vec(vec, y);
			}

			return new _Vec(this.x + vec.x, this.y + vec.y);
		},
		subtract: function(vec, y) {
			if (y !== undefined) {
				vec = new _Vec(vec, y);
			}

			return new _Vec(this.x - vec.x, this.y - vec.y);
		},
		multiply: function(i) {
			return new _Vec(this.x * i, this.y * i);
		},
		divide: function(i) {
			return new _Vec(this.x / i, this.y / i);
		}
	};

	var _Object = function() {
		this.actions = {
			left: false,
			top: false,
			right: false,
			down: false
		};
		this.pos = new _Vec();
	};
	_Object.prototype = {
		setActions: function(actions) {
			this.actions = actions;
		},
		step: function(interval) {
			this.actions.left && this.move("left", interval);
			this.actions.up && this.move("up", interval);
			this.actions.right && this.move("right", interval);
			this.actions.down && this.move("down", interval);
		},
		move: function(direction, interval) {
			var moveStep = 5 * (interval / 1000);
			var moveVectors = {
				right: new _Vec(moveStep, 0),
				left: new _Vec(-moveStep, 0),
				up: new _Vec(0, -moveStep),
				down: new _Vec(0, moveStep)
			};
			var vector = moveVectors[direction];
			if (vector && this.canMove(vector)) {
				this.pos = this.pos.add(vector);
			}
		},
		canMove: function(vector) {
			var canMove = true,
				self = this;
			
			var prePos = this.pos.clone();
			this.pos = this.pos.add(vector);
			this.world.objects.forEach(function(obj, i) {
				if (obj && obj !== self && 
					self.distance(obj) < self.radius + obj.radius) {
					canMove = false;
					return false;
				}
			});
			this.pos = prePos;
			return canMove;
		},
		distance: function(object) {
			return Math.sqrt(Math.pow(object.pos.x-this.pos.x,2)+Math.pow(object.pos.y-this.pos.y,2));
		},
		delete: function() {
			this.world.deleteObject(this);
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
		},
		step: function(interval) {
			this.objects.forEach(function(object) {
				object.step(interval);
			});
		}
	};
	
	return {
		Vec: _Vec,
		Object: _Object,
		World: _World
	};
})();
