module.exports = (function() {
	var Vec = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};
	Vec.prototype = {
		clone: function() {
			return new Vec(this.x, this.y);
		},
		add: function(vec, y) {
			if (y !== undefined) {
				vec = new Vec(vec, y);
			}

			return new Vec(this.x + vec.x, this.y + vec.y);
		},
		subtract: function(vec, y) {
			if (y !== undefined) {
				vec = new Vec(vec, y);
			}

			return new Vec(this.x - vec.x, this.y - vec.y);
		},
		multiply: function(i) {
			return new Vec(this.x * i, this.y * i);
		},
		divide: function(i) {
			return new Vec(this.x / i, this.y / i);
		}
	};

	var Shape = function() {}
	Shape.Circle = function() {}

	var Body = function() {
		this.pos = new Vec();
		this.contactListener = new ContactListener();
	};
	Body.prototype = {
		step: function(interval) {},
		move: function(vec) {
			var prePos = this.pos;
			this.pos = this.pos.add(vec);

			var self = this;
			this.checkCollision(function(body) {
				self.pos = prePos;
				self.world.addContact(self, body);
			});
		},
		checkCollision: function(callback) {
			var self = this;
			
			this.world.bodies.forEach(function(body, i) {
				if (body && body !== self && 
					self.distance(body) < self.radius + body.radius) {
					callback(body);
				}
			});
		},
		distance: function(body) {
			return Math.sqrt(Math.pow(body.pos.x-this.pos.x,2)+Math.pow(body.pos.y-this.pos.y,2));
		},
		delete: function() {
			this.world.deleteBody(this);
		}
	};
	
	var ContactListener = function(body) {
		this.body = body
	};
	ContactListener.prototype = {
		add: function() {},
		persisit: function() {},
		remove: function() {}
	};
	
	var World = function() {
		this.bodies = [];
		this.contacts = [];
	};
	World.prototype = {
		createBody: function(body) {
			body.world = this;
			this.bodies.push(body);
		},
		deleteBody: function(body) {
			var del = -1;
			this.bodies.forEach(function(b, i) {
				if (b === body) {
					del = i;
				}
			});
			if (del >= 0) {
				delete this.bodies[del];
			}
		},
		step: function(interval) {
			this.prepareContact();
			this.bodies.forEach(function(body) {
				body.step(interval);
			});
			this.resolveContacts();
		},
		addContact: function(body1, body2) {
			this.contacts.push([body1, body2]);
		},
		prepareContact: function() {
			this.preContacts = this.contacts;
			this.contacts = [];
		},
		resolveContacts: function() {
			var isExists = function(contact, list) {
				var result = false;
				list.forEach(function(elem) {
					if (
						(elem[0] === contact[0] && elem[1] === contact[1]) ||
						(elem[0] === contact[1] && elem[1] === contact[0])
					) {
						result = true;
					}
				});
				return result;
			};

			var self = this;
			this.contacts.forEach(function(contact) {
				if (isExists(contact, self.preContacts)) {
					contact[0].contactListener.persisit(contact[1]);
					contact[1].contactListener.persisit(contact[0]);
				} else {
					contact[0].contactListener.add(contact[1]);
					contact[1].contactListener.add(contact[0]);
				}
			});
			this.preContacts.forEach(function(contact) {
				if (!isExists(contact, self.contacts)) {
					contact[0].contactListener.remove(contact[1]);
					contact[1].contactListener.remove(contact[0]);
				}
			});
		}
	};

	return {
		Vec: Vec,
		Shape: Shape,
		Body: Body,
		World: World,
		ContactListener: ContactListener
	};
})();
